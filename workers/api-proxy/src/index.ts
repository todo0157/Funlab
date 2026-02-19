interface Env {
  OPENAI_API_KEY: string;
  ENVIRONMENT: string;
}

// Tier types
type AnalysisTier = 'free' | 'premium';

interface TierConfig {
  model: string;
  maxTokens: number;
  rateLimit: number;
}

const TIER_CONFIGS: Record<AnalysisTier, TierConfig> = {
  free: {
    model: 'gpt-3.5-turbo',
    maxTokens: 2000,
    rateLimit: 10,
  },
  premium: {
    model: 'gpt-4-turbo',
    maxTokens: 4000,
    rateLimit: 5,
  },
};

interface AnalyzeRequest {
  tier?: AnalysisTier;
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
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string, tier: AnalysisTier = 'free'): boolean {
  const now = Date.now();
  const limit = TIER_CONFIGS[tier].rateLimit;
  const key = `${ip}:${tier}`;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// OpenAI API call with custom system prompt and tier-based model selection
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  tier: AnalysisTier = 'free'
): Promise<string> {
  const config = TIER_CONFIGS[tier];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: config.maxTokens,
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

// System prompts
const LOVE_ANALYSIS_PROMPT = `You are an expert at analyzing KakaoTalk conversations. Analyze the conversation and return a JSON response.

CRITICAL RULES:
1. In the "love" section, you MUST use exactly "personA" and "personB" as keys (not actual names).
2. The actual names go in "personAName" and "personBName" fields.
3. overallScore.personA + overallScore.personB MUST equal exactly 100 (e.g., 65 and 35, or 48 and 52).

Required JSON structure:
{
  "love": {
    "overallScore": { "personA": number (0-100), "personB": number (0-100) },
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

Return ONLY valid JSON, no additional text.`;

const MBTI_ANALYSIS_PROMPT = `You are an expert at analyzing conversation patterns to predict MBTI personality types. Analyze each participant's messaging style and predict their MBTI type.

IMPORTANT: Return results for ALL participants in the conversation.

Required JSON structure:
{
  "participants": [
    {
      "name": "participant name",
      "mbtiType": "ENFP" (4 letters),
      "axes": [
        {
          "dimension": "EI",
          "first": { "letter": "E", "score": 65, "label": "외향형" },
          "second": { "letter": "I", "score": 35, "label": "내향형" }
        },
        {
          "dimension": "SN",
          "first": { "letter": "S", "score": 40, "label": "감각형" },
          "second": { "letter": "N", "score": 60, "label": "직관형" }
        },
        {
          "dimension": "TF",
          "first": { "letter": "T", "score": 30, "label": "사고형" },
          "second": { "letter": "F", "score": 70, "label": "감정형" }
        },
        {
          "dimension": "JP",
          "first": { "letter": "J", "score": 45, "label": "판단형" },
          "second": { "letter": "P", "score": 55, "label": "인식형" }
        }
      ],
      "confidence": number (0-100, how confident the prediction is),
      "personality": {
        "title": "Korean personality title like 열정 넘치는 활동가",
        "description": "2-3 sentence Korean description of their communication style",
        "traits": ["Korean trait 1", "Korean trait 2", "Korean trait 3"]
      }
    }
  ],
  "chatStyle": {
    "summary": "Korean summary of overall conversation dynamics between participants (2-3 sentences)",
    "patterns": [
      "Korean pattern observation 1",
      "Korean pattern observation 2",
      "Korean pattern observation 3"
    ]
  }
}

MBTI indicators to analyze:
- E vs I: Message frequency, initiation, response speed, message length
- S vs N: Concrete vs abstract language, detail focus vs big picture
- T vs F: Logical vs emotional expressions, direct vs harmonious communication
- J vs P: Structured messages vs spontaneous, planning vs flexibility

Scores for each axis MUST sum to 100 (e.g., E:65 + I:35 = 100).
Return ONLY valid JSON, no additional text.`;

const RELATIONSHIP_ANALYSIS_PROMPT = `You are an expert at analyzing conversations to measure relationship quality and chemistry between participants.

Analyze the conversation and return a JSON response measuring their relationship dynamics.

Required JSON structure:
{
  "score": {
    "overallScore": number (0-100, overall relationship score),
    "grade": "S" | "A" | "B" | "C" | "D",
    "relationshipType": "Korean relationship type (e.g., 소울메이트, 찐친, 케미폭발, 티키타카 등)",
    "typeDescription": "Korean description of the relationship type (1-2 sentences)"
  },
  "participants": [
    {
      "name": "participant name",
      "metrics": {
        "responseSpeed": number (0-100, how quickly they respond),
        "conversationBalance": number (0-100, how balanced their messaging is),
        "emotionalSupport": number (0-100, level of emotional support shown),
        "sharedInterests": number (0-100, shared topics and interests),
        "communicationQuality": number (0-100, quality of communication)
      },
      "characteristics": ["Korean trait 1", "Korean trait 2", "Korean trait 3"]
    }
  ],
  "highlights": [
    {
      "title": "Korean highlight title",
      "description": "Korean description of a notable positive aspect"
    }
  ],
  "summary": "Korean overall summary of their relationship (3-4 sentences)",
  "tips": [
    "Korean tip 1 for improving relationship",
    "Korean tip 2 for maintaining good chemistry",
    "Korean tip 3 for better communication"
  ]
}

Grade criteria:
- S (90-100): 완벽한 케미, 최고의 관계
- A (75-89): 좋은 관계, 서로 잘 맞음
- B (60-74): 괜찮은 관계, 발전 가능성 있음
- C (40-59): 보통 관계, 노력 필요
- D (0-39): 개선이 많이 필요한 관계

Analyze based on:
- Message frequency and balance
- Response time patterns
- Emotional expressions
- Shared topics and interests
- Supportive language use
- Communication quality

Make analysis warm and encouraging! Return ONLY valid JSON.`;

const MOCKEXAM_PROMPT = `You are an expert at creating viral, fun couple quizzes like those on Instagram Reels and TikTok. Create quiz questions that couples would actually enjoy and find accurate.

## CRITICAL RULES
1. Questions MUST be based on the provided STATISTICS, BEHAVIORAL PATTERNS, and CONVERSATION data
2. Do NOT create questions about emoticons (txt files don't preserve them)
3. Each question should have ONE clearly correct answer from the data
4. Make it feel like a fun Instagram couple quiz, not a boring test
5. EVERY answer must have "evidence" - actual quotes or data from the conversation

## QUESTION CATEGORIES (mix these)

### 1. 말투/습관 문제 (Based on statistics)
Use the provided "자주 쓰는 단어", "자주 쓰는 표현", "자주 쓰는 말투/어미" data
- "이 사람이 가장 자주 쓰는 말은?"
- "이 사람의 시그니처 말투는?"
- "카톡에서 이 사람이 자주 쓰는 표현은?"

### 2. 시간/패턴 문제 (Based on statistics)
Use the "가장 활발한 시간대", "심야 메시지 비율", "대화 시작 비율" data
- "이 사람이 가장 활발한 시간대는?"
- "누가 먼저 카톡을 더 자주 보낼까?"
- "이 사람의 새벽 카톡 빈도는?"

### 3. 연인 밸런스 게임 스타일 (Based on behavioral patterns)
Use the "사과할 때 패턴", "애교 표현 패턴", "화났을 때 표현" data
- "이 사람이 삐졌을 때 반응은?" → Use emotional patterns
- "이 사람이 애교 부릴 때 스타일은?" → Use aegyo patterns
- "이 사람이 화났을 때 카톡 스타일은?" → Use angry patterns
- "이 사람이 피곤할 때 보이는 신호는?" → Use sad patterns
- "연락 안 되면 이 사람의 반응은?" → Use delayed response patterns

### 4. 관계 패턴 문제 (Based on behavioral patterns)
Use the extracted patterns for evidence
- "이 사람이 사과할 때 방식은?" → Use apology patterns
- "이 사람이 대화 끝낼 때 마지막 말은?" → Use conversation enders
- "이 사람이 대화 시작할 때 첫 마디는?" → Use conversation starters

## OUTPUT FORMAT
{
  "questions": [
    {
      "question": "재미있고 구체적인 한국어 질문",
      "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
      "correctAnswer": 0,
      "explanation": "대화에서 확인된 근거",
      "evidence": "실제 대화 인용 또는 통계 데이터"
    }
  ]
}

## EVIDENCE EXAMPLES
- 통계 기반: "통계에서 '밥' 단어 47회 사용 확인"
- 패턴 기반: "사과 패턴에서 '미안해용' 표현 3회 발견"
- 대화 기반: "실제 대화: '오빠 미안해용ㅠㅠ 늦어서ㅠ'"

## QUALITY CHECKLIST
- All 4 options should be plausible and similar length
- Correct answer must be verifiable from data with evidence
- Questions should be fun and shareable
- Use natural, casual Korean (not formal)
- Make options specific, not generic
- Include actual conversation quotes in evidence

## BAD vs GOOD EXAMPLES

BAD: "이 사람의 성격은?" (너무 모호함, 근거 없음)
GOOD: "이 사람이 사과할 때 자주 쓰는 말은?" (패턴 데이터 기반)

BAD: "이 사람이 화났을 때 어떻게 할까?" (추측)
GOOD: "이 사람이 화났을 때 카톡에서 자주 보이는 표현은?" (패턴 데이터 기반)

Return ONLY valid JSON.`;

const MENHERA_ANALYSIS_PROMPT = `You are an expert at analyzing group chat conversations for "menhera" tendencies - emotional patterns that indicate attention-seeking, emotional volatility, or dramatic behavior. This is for entertainment purposes only.

Analyze the conversation and return a JSON response ranking ALL participants by their "menhera score".

IMPORTANT: This should be FUN and LIGHTHEARTED. Use humorous Korean titles and interpretations.

Required JSON structure:
{
  "rankings": [
    {
      "name": "participant name",
      "score": number (0-100),
      "rank": number (1 = highest menhera),
      "grade": "S" | "A" | "B" | "C" | "D",
      "title": "funny Korean title like 새벽감성 맨헤라, 관종 맨헤라, 츤데레 맨헤라, 조용한 맨헤라, 텐션 맨헤라 등",
      "metrics": {
        "emotionalVolatility": number (0-100, 감정 기복 - sudden mood changes in messages),
        "nightActivity": number (0-100, 심야 활동 - late night message frequency),
        "negativity": number (0-100, 부정적 표현 - negative expressions usage),
        "attentionSeeking": number (0-100, 관심 요구 - asking questions, calling names frequently),
        "dependency": number (0-100, 의존성 표현 - expressions like 외롭다, 혼자, 보고싶다)
      },
      "interpretation": "Funny Korean description of their menhera style (2-3 sentences)"
    }
  ],
  "winner": {
    "name": "name of #1 menhera",
    "score": number,
    "title": "their title"
  },
  "summary": "Funny Korean summary of the group's overall menhera dynamics (3-4 sentences)"
}

Menhera indicators to look for:
- 감정 기복: Sudden changes between happy/sad, use of ㅠㅠ, ㅋㅋㅋ in quick succession
- 심야 활동: Messages sent between 12am-5am
- 부정적 표현: 힘들다, 지친다, 짜증, 우울 etc.
- 관심 요구: Frequently calling names, asking "뭐해?", lots of questions
- 의존성: 보고싶다, 외롭다, 혼자, 같이 etc.

Make it entertaining! Return ONLY valid JSON.`;


// Parse and validate OpenAI response for love analysis
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

// Parse and validate OpenAI response for menhera analysis
function parseMenheraResponse(content: string): unknown {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Basic validation
  if (!parsed.rankings || !parsed.winner || !parsed.summary) {
    throw new Error('Invalid menhera response structure');
  }

  return parsed;
}

// Parse and validate OpenAI response for MBTI analysis
function parseMBTIResponse(content: string): unknown {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Basic validation
  if (!parsed.participants || !parsed.chatStyle) {
    throw new Error('Invalid MBTI response structure');
  }

  return parsed;
}

// Parse and validate OpenAI response for relationship analysis
function parseRelationshipResponse(content: string): unknown {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Basic validation
  if (!parsed.score || !parsed.participants || !parsed.summary) {
    throw new Error('Invalid relationship response structure');
  }

  return parsed;
}

// Parse and validate OpenAI response for mockexam
function parseMockexamResponse(content: string): unknown {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Basic validation
  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error('Invalid mockexam response structure');
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
        // Parse request body
        const body: AnalyzeRequest = await request.json();
        const tier: AnalysisTier = body.tier || 'free';

        // Rate limiting with tier
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP, tier)) {
          return new Response(
            JSON.stringify({ success: false, message: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

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

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(LOVE_ANALYSIS_PROMPT, prompt, env.OPENAI_API_KEY, tier);
        const analysisData = parseAnalysisResponse(aiResponse);

        return new Response(
          JSON.stringify({
            success: true,
            data: analysisData,
            tier,
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

    // Menhera analyze endpoint
    if (url.pathname === '/api/analyze-menhera' && request.method === 'POST') {
      try {
        // Parse request body
        const body: AnalyzeRequest = await request.json();
        const tier: AnalysisTier = body.tier || 'free';

        // Rate limiting with tier
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP, tier)) {
          return new Response(
            JSON.stringify({ success: false, message: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

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
다음 단체 카카오톡 대화를 분석해서 맨헤라 순위를 매겨주세요.

## 대화 참여자 (${participants.length}명)
${participants.join(', ')}

## 대화 메타데이터
- 총 메시지 수: ${metadata.totalMessages}
- 기간: ${metadata.dateRange}
- 메시지 수 (참여자별): ${JSON.stringify(metadata.messageCountBySender)}

## 대화 내용 (샘플)
${messages}

위 대화를 분석하여 각 참여자의 맨헤라력을 측정해주세요.
재미있고 유머러스하게 분석해주세요!
`;

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(MENHERA_ANALYSIS_PROMPT, prompt, env.OPENAI_API_KEY, tier);
        const analysisData = parseMenheraResponse(aiResponse);

        return new Response(
          JSON.stringify({
            success: true,
            data: analysisData,
            tier,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Menhera analysis error:', error);

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

    // MBTI analyze endpoint
    if (url.pathname === '/api/analyze-mbti' && request.method === 'POST') {
      try {
        // Parse request body
        const body: AnalyzeRequest = await request.json();
        const tier: AnalysisTier = body.tier || 'free';

        // Rate limiting with tier
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP, tier)) {
          return new Response(
            JSON.stringify({ success: false, message: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

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
다음 카카오톡 대화를 분석해서 각 참여자의 대화 스타일 기반 MBTI를 예측해주세요.

## 대화 참여자 (${participants.length}명)
${participants.join(', ')}

## 대화 메타데이터
- 총 메시지 수: ${metadata.totalMessages}
- 기간: ${metadata.dateRange}
- 메시지 수 (참여자별): ${JSON.stringify(metadata.messageCountBySender)}

## 대화 내용 (샘플)
${messages}

위 대화를 분석하여 각 참여자의 MBTI 유형을 예측해주세요.
분석은 반드시 한국어로 작성해주세요.
`;

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(MBTI_ANALYSIS_PROMPT, prompt, env.OPENAI_API_KEY, tier);
        const analysisData = parseMBTIResponse(aiResponse);

        return new Response(
          JSON.stringify({
            success: true,
            data: analysisData,
            tier,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('MBTI analysis error:', error);

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

    // Relationship analyze endpoint
    if (url.pathname === '/api/analyze-relationship' && request.method === 'POST') {
      try {
        // Parse request body
        const body: AnalyzeRequest = await request.json();
        const tier: AnalysisTier = body.tier || 'free';

        // Rate limiting with tier
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP, tier)) {
          return new Response(
            JSON.stringify({ success: false, message: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

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
다음 카카오톡 대화를 분석해서 참여자들의 관계 점수를 측정해주세요.

## 대화 참여자 (${participants.length}명)
${participants.join(', ')}

## 대화 메타데이터
- 총 메시지 수: ${metadata.totalMessages}
- 기간: ${metadata.dateRange}
- 메시지 수 (참여자별): ${JSON.stringify(metadata.messageCountBySender)}

## 대화 내용 (샘플)
${messages}

위 대화를 분석하여 관계 점수와 케미를 측정해주세요.
따뜻하고 긍정적인 톤으로 분석해주세요!
`;

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(RELATIONSHIP_ANALYSIS_PROMPT, prompt, env.OPENAI_API_KEY, tier);
        const analysisData = parseRelationshipResponse(aiResponse);

        return new Response(
          JSON.stringify({
            success: true,
            data: analysisData,
            tier,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Relationship analysis error:', error);

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

    // Mockexam generate endpoint
    if (url.pathname === '/api/generate-mockexam' && request.method === 'POST') {
      try {
        // Parse request body
        const body = await request.json() as {
          tier?: AnalysisTier;
          targetName: string;
          chatData: {
            participants: string[];
            messages: string;
            targetStats?: string;
            behavioralPatterns?: string;
            metadata: {
              totalMessages: number;
              analyzedMessages: number;
              dateRange: string;
              messageCountBySender: Record<string, number>;
            };
          };
        };
        const tier: AnalysisTier = body.tier || 'free';
        const questionCount = tier === 'free' ? 5 : 10;

        // Rate limiting with tier
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP, tier)) {
          return new Response(
            JSON.stringify({ success: false, message: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        if (!body.chatData || !body.targetName || !body.chatData.messages) {
          return new Response(
            JSON.stringify({ success: false, message: 'Invalid request body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { participants, messages, targetStats, behavioralPatterns, metadata } = body.chatData;

        // Build prompt with statistics and behavioral patterns
        const prompt = `
# "${body.targetName}" 연인 모의고사 만들기

## 퀴즈 대상
${body.targetName}

## 대화 참여자
${participants.join(', ')}

## 대화 기간
${metadata.dateRange}

---

${targetStats || '통계 데이터 없음'}

---

${behavioralPatterns || '행동 패턴 데이터 없음'}

---

## 대화 내용 (샘플 ${metadata.analyzedMessages}개 / 전체 ${metadata.totalMessages}개)
${messages}

---

## 요청사항
위 통계, 행동 패턴, 대화를 바탕으로 "${body.targetName}"에 대한 연인 퀴즈 ${questionCount}문제를 만들어주세요.

### 문제 구성 가이드
1. **통계 기반 문제 (${Math.ceil(questionCount * 0.4)}개)**: 위 통계 데이터를 활용한 객관적 문제
   - 자주 쓰는 단어/표현 문제
   - 활발한 시간대 문제
   - 대화 시작 비율 문제

2. **행동 패턴 문제 (${Math.ceil(questionCount * 0.3)}개)**: 추출된 행동 패턴 활용
   - 사과할 때 패턴
   - 애교 표현 패턴
   - 감정 표현 패턴 (기쁠 때/슬플 때/화났을 때)
   - 대화 시작/끝 패턴

3. **연인 케미 문제 (${Math.ceil(questionCount * 0.3)}개)**: 인스타 밸런스게임 스타일
   - 삐졌을 때/화났을 때 반응
   - 애교 스타일
   - 늦게 답장할 때 첫 마디

### 주의사항
- 이모티콘 관련 문제 만들지 말 것
- 정답은 반드시 통계나 패턴 데이터에서 확인 가능해야 함
- "evidence" 필드에 실제 근거 데이터(대화 인용 또는 통계 수치) 포함 필수
- 재미있고 공유하고 싶은 문제로!
`;

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(MOCKEXAM_PROMPT, prompt, env.OPENAI_API_KEY, tier);
        const quizData = parseMockexamResponse(aiResponse);

        return new Response(
          JSON.stringify({
            success: true,
            data: quizData,
            tier,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Mockexam generation error:', error);

        const message =
          error instanceof Error ? error.message : '퀴즈 생성 중 오류가 발생했어요';

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
