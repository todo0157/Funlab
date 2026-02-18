interface Env {
  OPENAI_API_KEY: string;
  ENVIRONMENT: string;
}

interface AnalyzeRequest {
  chatData: {
    participants: string[];
    messages: string;
    metadata: {
      totalMessages: number;
      dateRange: string;
      messageCountBySender: Record<string, number>;
    };
  };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Rate limiting (simple in-memory, resets on worker restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// OpenAI API call
async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing KakaoTalk conversations. Analyze the conversation and return a JSON response.

CRITICAL RULES:
1. In the "love" section, you MUST use exactly "personA" and "personB" as keys (not actual names).
2. The actual names go in "personAName" and "personBName" fields.
3. overallScore.personA + overallScore.personB MUST equal exactly 100 (e.g., 65 and 35, or 48 and 52).

Required JSON structure:
{
  "love": {
    "overallScore": { "personA": number (0-100), "personB": number (0-100) },  // MUST sum to 100
    "personAName": "actual name of first person",
    "personBName": "actual name of second person",
    "winner": "name of person who likes more",
    "indicators": {
      "initiationRate": { "personA": number, "personB": number },
      "responseTime": { "personA": number, "personB": number },
      "avgMessageLength": { "personA": number, "personB": number },
      "questionRate": { "personA": number, "personB": number },
      "emoticonUsage": { "personA": number, "personB": number }
    },
    "interpretation": "Korean string describing who likes whom more and why"
  },
  "teto": {
    "[use actual personAName]": {
      "score": number (0-100),
      "grade": "S" | "A" | "B" | "C" | "D",
      "gradeDescription": "Korean description",
      "metrics": {
        "leadingPower": number,
        "topicChangingAbility": number,
        "responseVariety": number,
        "humorSense": number,
        "empathyExpression": number
      }
    },
    "[use actual personBName]": { ... same structure ... }
  },
  "aegyo": {
    "[use actual personAName]": {
      "score": number (0-100),
      "grade": "S" | "A" | "B" | "C" | "D",
      "type": "natural" | "forced" | "tsundere" | "minimal",
      "typeDescription": "Korean description of aegyo type",
      "metrics": {
        "waveUsage": number,
        "cuteEmoticonUsage": number,
        "cuteEndingUsage": number,
        "onomatopoeiaUsage": number,
        "slangUsage": number
      }
    },
    "[use actual personBName]": { ... same structure ... }
  },
  "summary": "Korean summary of the overall analysis"
}

Analyze based on:
- Message frequency and initiation
- Response patterns and length
- Use of emoticons, aegyo expressions (~~~, ㅎㅎ, 용, 당, etc.)
- Question asking and engagement
- Overall conversation dynamics

Return ONLY valid JSON, no additional text.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content || '';
}

// Parse and validate OpenAI response
function parseAnalysisResponse(content: string): unknown {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Basic validation
  if (!parsed.love || !parsed.teto || !parsed.aegyo) {
    throw new Error('Invalid response structure');
  }

  return parsed;
}

// Main handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', environment: env.ENVIRONMENT }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Analyze endpoint
    if (url.pathname === '/api/analyze' && request.method === 'POST') {
      try {
        // Rate limiting
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP)) {
          return new Response(
            JSON.stringify({ success: false, message: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Parse request body
        const body: AnalyzeRequest = await request.json();

        if (!body.chatData || !body.chatData.participants || !body.chatData.messages) {
          return new Response(
            JSON.stringify({ success: false, message: 'Invalid request body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { participants, messages, metadata } = body.chatData;

        // Build prompt
        const prompt = `
다음 카카오톡 대화를 분석해주세요.

## 대화 참여자
${participants.join(', ')}

## 대화 메타데이터
- 총 메시지 수: ${metadata.totalMessages}
- 기간: ${metadata.dateRange}
- 메시지 수 (참여자별): ${JSON.stringify(metadata.messageCountBySender)}

## 대화 내용 (샘플)
${messages}

위 대화를 분석하여 호감도, 테토력(대화력), 에겐력(애교 표현력)을 JSON 형식으로 분석해주세요.
분석은 반드시 한국어로 작성해주세요.
`;

        // Call OpenAI
        const aiResponse = await callOpenAI(prompt, env.OPENAI_API_KEY);
        const analysisData = parseAnalysisResponse(aiResponse);

        return new Response(
          JSON.stringify({
            success: true,
            data: analysisData,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Analysis error:', error);

        const message =
          error instanceof Error ? error.message : '분석 중 오류가 발생했어요';

        return new Response(
          JSON.stringify({ success: false, message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ success: false, message: 'Not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  },
};
