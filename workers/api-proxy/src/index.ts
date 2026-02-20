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

const BESTFRIEND_PROMPT = `You are an expert at creating viral "Best Friend Quiz" questions like those on Instagram Reels and TikTok. Create quiz questions about a person that their friends would enjoy answering.

## CRITICAL RULES
1. Questions MUST be based on the provided STATISTICS, BEHAVIORAL PATTERNS, and CONVERSATION data
2. Do NOT create questions about emoticons (txt files don't preserve them)
3. Each question should have ONE clearly correct answer from the data
4. Make it feel like a fun HolaQuiz-style friend test, not a boring survey
5. EVERY answer must have "evidence" - actual quotes or data from the conversation

## QUESTION CATEGORIES (mix these)

### 1. 말투/습관 문제 (Based on statistics)
Use the provided "자주 쓰는 단어", "자주 쓰는 표현", "자주 쓰는 말투/어미" data
- "이 친구가 가장 자주 쓰는 말은?"
- "이 친구의 시그니처 말투는?"
- "카톡에서 이 친구가 자주 쓰는 표현은?"

### 2. 시간/패턴 문제 (Based on statistics)
Use the "가장 활발한 시간대", "심야 메시지 비율", "대화 시작 비율" data
- "이 친구가 가장 활발한 시간대는?"
- "이 친구가 먼저 연락하는 비율은?"
- "이 친구의 새벽 카톡 빈도는?"

### 3. 반응 패턴 문제 (Based on behavioral patterns)
Use the "사과할 때 패턴", "애교 표현 패턴", "감정 표현" data
- "이 친구가 미안할 때 하는 말은?"
- "이 친구가 신나면 하는 표현은?"
- "이 친구가 힘들 때 보이는 신호는?"
- "연락 오래 안 하면 이 친구의 첫 마디는?"

### 4. 대화 습관 문제 (Based on behavioral patterns)
Use the extracted patterns for evidence
- "이 친구가 대화 끝낼 때 마지막 말은?"
- "이 친구가 대화 시작할 때 첫 마디는?"
- "이 친구의 대화 특징은?"

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
- 통계 기반: "통계에서 '진짜' 단어 52회 사용 확인"
- 패턴 기반: "대화 시작 패턴에서 '야' 표현 5회 발견"
- 대화 기반: "실제 대화: '야 뭐해ㅋㅋ'"

## QUALITY CHECKLIST
- All 4 options should be plausible and similar length
- Correct answer must be verifiable from data with evidence
- Questions should be fun and shareable
- Use natural, casual Korean (not formal)
- Make options specific, not generic
- Focus on friend-appropriate content (habits, speech patterns, behavior)

Return ONLY valid JSON.`;

const GREENLIGHT_ANALYSIS_PROMPT = `You are an expert at analyzing conversations to detect romantic interest signals. Analyze the conversation and identify "green lights" (positive interest signals) and "red flags" (warning signs or lack of interest).

## ANALYSIS FOCUS
Look for signals that indicate:
- GREEN LIGHTS: Interest, engagement, effort, consistency, initiative
- RED FLAGS: Disinterest, avoidance, one-sided effort, inconsistency

## Required JSON structure
{
  "overallScore": number (0-100, where 100 is strong green light),
  "verdict": "strong_greenlight" | "greenlight" | "neutral" | "redflag" | "strong_redflag",
  "verdictMessage": "Korean verdict message (e.g., '완전 그린라이트! 지금 당장 고백하세요!')",
  "greenlights": [
    {
      "type": "greenlight",
      "title": "Korean title (e.g., '먼저 연락하는 적극성')",
      "description": "Korean description of this green light signal",
      "evidence": "Actual quote or specific data from conversation",
      "severity": number (1-5, how strong this signal is)
    }
  ],
  "redflags": [
    {
      "type": "redflag",
      "title": "Korean title (e.g., '답장 속도 느림')",
      "description": "Korean description of this red flag",
      "evidence": "Actual quote or specific data from conversation",
      "severity": number (1-5, how concerning this signal is)
    }
  ],
  "advice": "Korean advice for the user (3-4 sentences, warm and helpful tone)",
  "targetName": "Name of the person being analyzed"
}

## GREEN LIGHT INDICATORS
- 먼저 연락하기 (initiating conversations)
- 빠른 답장 (quick responses)
- 긴 메시지 (detailed messages)
- 질문 많이 하기 (asking questions about you)
- 이모티콘/ㅋㅋ 많이 사용 (emotional expressions)
- 심야 대화 참여 (late night chats)
- 약속/만남 제안 (suggesting meetups)
- 칭찬/관심 표현 (compliments, interest)
- 일상 공유 (sharing daily life)

## RED FLAG INDICATORS
- 답장 늦음 (slow responses)
- 단답 (short replies)
- 대화 끊기 (ending conversations)
- 질문 안 함 (not asking questions)
- 감정 표현 부재 (lack of emotional expression)
- 약속 회피 (avoiding meetups)
- 읽씹 (read but no reply patterns)
- 다른 사람 언급 (mentioning others romantically)

## VERDICT CRITERIA
- strong_greenlight (80-100): 확실한 호감, 적극적 신호
- greenlight (60-79): 긍정적 신호, 관심 있음
- neutral (40-59): 판단 보류, 더 관찰 필요
- redflag (20-39): 부정적 신호, 관심 적음
- strong_redflag (0-19): 확실한 무관심, 경고 신호

Return ONLY valid JSON. Make analysis fun but insightful!`;

const CHATTYPE_ANALYSIS_PROMPT = `You are an expert at analyzing chat conversation styles. Analyze the person's messaging patterns and categorize them into one of 16 chat types.

## 16 CHAT TYPES (typeCode)
- LIGHTNING: 폭풍 답장러 (super fast replier)
- GHOST: 읽씹 마스터 (slow/no reply)
- EMOJI_BOMB: 이모티콘 폭격기 (emoji heavy)
- MINIMALIST: 단답 장인 (short replies)
- NOVELIST: 장문 소설가 (long messages)
- NIGHT_OWL: 새벽 감성러 (late night active)
- MORNING_BIRD: 아침형 인간 (morning active)
- QUESTION_MARK: 질문 폭격기 (lots of questions)
- MOOD_MAKER: 분위기 메이커 (humor, energy)
- TSUNDERE: 츤데레형 (cold but caring)
- AEGYO_MASTER: 애교 만렙 (cute expressions)
- COOL_GUY: 쿨한 도시남녀 (calm, minimal emotion)
- ENERGY_BOMB: 텐션 폭발형 (high energy, exclamations)
- CHILL_VIBES: 느긋한 힐러 (relaxed, slow)
- DETECTIVE: 반응 탐정 (analytical, observant)
- CHAMELEON: 카멜레온형 (adapts to others)

## Required JSON structure
{
  "typeCode": "LIGHTNING" (one of the 16 codes above),
  "targetName": "분석 대상 이름",
  "scores": {
    "responseSpeed": number (0-100),
    "messageLength": number (0-100),
    "emotionExpression": number (0-100),
    "activityTime": number (0-100),
    "conversationStyle": number (0-100)
  },
  "details": [
    {
      "title": "Korean detail title",
      "description": "Korean description of this aspect"
    }
  ],
  "tips": [
    "Korean communication tip 1",
    "Korean communication tip 2",
    "Korean communication tip 3"
  ]
}

## TYPE SELECTION CRITERIA
Use the provided stats to determine type:
- Fast response + many messages → LIGHTNING
- Slow response + few messages → GHOST
- High emoji rate → EMOJI_BOMB
- Short avg length + low emoji → MINIMALIST
- Long avg length → NOVELIST
- High late night rate → NIGHT_OWL
- Low late night rate + morning activity → MORNING_BIRD
- High question rate → QUESTION_MARK
- High exclamation + emoji + energy → MOOD_MAKER or ENERGY_BOMB
- Mix of styles → CHAMELEON

Make analysis fun and relatable! Return ONLY valid JSON.`;

const BALANCE_GAME_PROMPT = `You are an expert at creating fun "Balance Game" questions based on conversation patterns. Analyze the chat and create personalized balance game questions about the person's preferences.

## CRITICAL RULES
1. Questions MUST be based on actual preferences shown in conversations
2. Each question should have ONE clearly correct answer based on the data
3. Create questions that are fun to share and play
4. Use the provided statistics and preferences data
5. EVERY answer must have "evidence" - actual quotes or data

## QUESTION CATEGORIES (mix these)

### 1. 음식 취향 (Food preferences)
- "이 사람이 더 좋아하는 건?" (치킨 vs 피자)
- "이 사람이 배고플 때 먼저 떠올리는 건?"

### 2. 라이프스타일 (Lifestyle)
- "이 사람이 더 선호하는 시간대는?" (아침 vs 밤)
- "주말에 이 사람이 더 좋아하는 건?" (집순이 vs 밖순이)

### 3. 관계/소통 (Communication style)
- "이 사람이 더 자주 하는 건?" (먼저 연락 vs 기다리기)
- "이 사람이 화났을 때 스타일은?" (직접 말하기 vs 돌려 말하기)

### 4. 성격/취향 (Personality)
- "이 사람에게 더 어울리는 건?"
- "이 사람이 더 공감하는 건?"

## OUTPUT FORMAT
{
  "questions": [
    {
      "id": "unique_id",
      "question": "재미있는 한국어 질문",
      "optionA": "선택지 A",
      "optionB": "선택지 B",
      "answer": "A" or "B",
      "evidence": "실제 대화 인용 또는 통계 데이터",
      "difficulty": "easy" | "medium" | "hard",
      "category": "음식" | "여행" | "취미" | "라이프스타일" | "성격" | "관계"
    }
  ]
}

## QUALITY CHECKLIST
- Options should be genuinely balanced and interesting
- Answer must be verifiable from data
- Questions should be fun to share
- Use natural, casual Korean
- Include actual evidence

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

// Parse and validate OpenAI response for greenlight analysis
function parseGreenlightResponse(content: string): unknown {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Basic validation
  if (parsed.overallScore === undefined || !parsed.verdict || !parsed.greenlights || !parsed.redflags) {
    throw new Error('Invalid greenlight response structure');
  }

  return parsed;
}

// Parse and validate OpenAI response for chattype analysis
function parseChatTypeResponse(content: string): unknown {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Basic validation
  if (!parsed.typeCode || !parsed.scores || !parsed.details) {
    throw new Error('Invalid chattype response structure');
  }

  return parsed;
}

// Parse and validate OpenAI response for balance game
function parseBalanceResponse(content: string): unknown {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Basic validation
  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error('Invalid balance response structure');
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

    // Bestfriend quiz generate endpoint
    if (url.pathname === '/api/generate-bestfriend' && request.method === 'POST') {
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
# "${body.targetName}" 찐친 테스트 만들기

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
위 통계, 행동 패턴, 대화를 바탕으로 "${body.targetName}"에 대한 찐친 테스트 ${questionCount}문제를 만들어주세요.

### 문제 구성 가이드
1. **통계 기반 문제 (${Math.ceil(questionCount * 0.4)}개)**: 위 통계 데이터를 활용한 객관적 문제
   - 자주 쓰는 단어/표현 문제
   - 활발한 시간대 문제
   - 대화 시작 비율 문제

2. **행동 패턴 문제 (${Math.ceil(questionCount * 0.3)}개)**: 추출된 행동 패턴 활용
   - 대화할 때 습관
   - 감정 표현 패턴
   - 대화 시작/끝 패턴

3. **친구 케미 문제 (${Math.ceil(questionCount * 0.3)}개)**: HolaQuiz 스타일
   - 특이한 말버릇
   - 자주 하는 말
   - 대화 스타일

### 주의사항
- 이모티콘 관련 문제 만들지 말 것
- 정답은 반드시 통계나 패턴 데이터에서 확인 가능해야 함
- "evidence" 필드에 실제 근거 데이터(대화 인용 또는 통계 수치) 포함 필수
- 친구 사이에 공유하기 좋은 재미있는 문제로!
`;

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(BESTFRIEND_PROMPT, prompt, env.OPENAI_API_KEY, tier);
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
        console.error('Bestfriend quiz generation error:', error);

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

    // Greenlight analysis endpoint
    if (url.pathname === '/api/analyze-greenlight' && request.method === 'POST') {
      try {
        // Parse request body
        const body = await request.json() as {
          tier?: AnalysisTier;
          targetName: string;
          messages: string;
          stats?: {
            messageCount: number;
            avgResponseTime: number;
            shortReplyRate: number;
            initiationRate: number;
            emojiRate: number;
            questionRate: number;
            lateNightRate: number;
          };
        };
        const tier: AnalysisTier = body.tier || 'free';

        // Rate limiting with tier
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP, tier)) {
          return new Response(
            JSON.stringify({ error: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        if (!body.messages || !body.targetName) {
          return new Response(
            JSON.stringify({ error: 'Invalid request body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Build prompt with statistics
        const statsInfo = body.stats
          ? `
## ${body.targetName}의 대화 통계
- 메시지 수: ${body.stats.messageCount}개
- 평균 답장 시간: ${body.stats.avgResponseTime}분
- 단답 비율: ${body.stats.shortReplyRate}%
- 대화 시작 비율: ${body.stats.initiationRate}%
- 이모티콘 사용률: ${body.stats.emojiRate}%
- 질문 비율: ${body.stats.questionRate}%
- 심야 메시지 비율: ${body.stats.lateNightRate}%
`
          : '';

        const prompt = `
# "${body.targetName}"의 그린라이트 분석

${statsInfo}

## 대화 내용
${body.messages}

---

## 요청사항
위 대화와 통계를 바탕으로 "${body.targetName}"님의 그린라이트/레드플래그 신호를 분석해주세요.

분석 포인트:
1. 답장 패턴과 속도
2. 대화 시작/유지 의지
3. 감정 표현 정도
4. 질문 빈도 (상대에 대한 관심)
5. 긴 메시지 vs 단답
6. 시간대 (심야 대화 = 편안함)
7. 약속/만남 관련 언급

그린라이트 TOP ${tier === 'premium' ? 5 : 3}개, 레드플래그 TOP ${tier === 'premium' ? 5 : 3}개를 찾아주세요.
재미있고 공감되게 분석해주세요!
`;

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(GREENLIGHT_ANALYSIS_PROMPT, prompt, env.OPENAI_API_KEY, tier);
        const analysisData = parseGreenlightResponse(aiResponse);

        return new Response(
          JSON.stringify(analysisData),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Greenlight analysis error:', error);

        const message =
          error instanceof Error ? error.message : '분석 중 오류가 발생했어요';

        return new Response(
          JSON.stringify({ error: message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Chat type analysis endpoint
    if (url.pathname === '/api/analyze-chattype' && request.method === 'POST') {
      try {
        // Parse request body
        const body = await request.json() as {
          tier?: AnalysisTier;
          targetName: string;
          messages: string;
          stats?: {
            messageCount: number;
            avgMessageLength: number;
            responseSpeed: string;
            emojiRate: number;
            questionRate: number;
            exclamationRate: number;
            lateNightRate: number;
            initiationRate: number;
            shortReplyRate: number;
            longReplyRate: number;
          };
        };
        const tier: AnalysisTier = body.tier || 'free';

        // Rate limiting with tier
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP, tier)) {
          return new Response(
            JSON.stringify({ error: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        if (!body.messages || !body.targetName) {
          return new Response(
            JSON.stringify({ error: 'Invalid request body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Build prompt with statistics
        const statsInfo = body.stats
          ? `
## ${body.targetName}의 대화 통계
- 메시지 수: ${body.stats.messageCount}개
- 평균 메시지 길이: ${body.stats.avgMessageLength}자
- 답장 속도: ${body.stats.responseSpeed}
- 이모티콘 사용률: ${body.stats.emojiRate}%
- 질문 비율: ${body.stats.questionRate}%
- 느낌표 비율: ${body.stats.exclamationRate}%
- 심야 메시지 비율: ${body.stats.lateNightRate}%
- 대화 시작 비율: ${body.stats.initiationRate}%
- 단답 비율: ${body.stats.shortReplyRate}%
- 장문 비율: ${body.stats.longReplyRate}%
`
          : '';

        const prompt = `
# "${body.targetName}"의 카톡 말투 유형 분석

${statsInfo}

## 대화 내용
${body.messages}

---

## 요청사항
위 대화와 통계를 바탕으로 "${body.targetName}"님의 카톡 말투 유형을 16가지 중 하나로 분류해주세요.

분석 포인트:
1. 답장 속도 패턴
2. 메시지 길이 특성
3. 이모티콘/감정 표현 정도
4. 활동 시간대
5. 대화 스타일 (질문형/서술형/공감형 등)

재미있고 공감되게 분석해주세요!
`;

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(CHATTYPE_ANALYSIS_PROMPT, prompt, env.OPENAI_API_KEY, tier);
        const analysisData = parseChatTypeResponse(aiResponse);

        return new Response(
          JSON.stringify(analysisData),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Chat type analysis error:', error);

        const message =
          error instanceof Error ? error.message : '분석 중 오류가 발생했어요';

        return new Response(
          JSON.stringify({ error: message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Balance game generate endpoint
    if (url.pathname === '/api/generate-balance' && request.method === 'POST') {
      try {
        // Parse request body
        const body = await request.json() as {
          tier?: AnalysisTier;
          targetName: string;
          messages: Array<{
            sender: string;
            message: string;
            timestamp: string;
          }>;
          preferences?: Array<{
            category: string;
            preferences: string[];
            examples: string[];
          }>;
          stats?: {
            totalMessages: number;
            topWords: string[];
            avgLength: number;
          };
        };
        const tier: AnalysisTier = body.tier || 'free';
        const questionCount = tier === 'free' ? 5 : 10;

        // Rate limiting with tier
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIP, tier)) {
          return new Response(
            JSON.stringify({ error: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        if (!body.messages || !body.targetName) {
          return new Response(
            JSON.stringify({ error: 'Invalid request body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Format messages for prompt
        const messagesText = body.messages
          .map((m) => `[${m.sender}] ${m.message}`)
          .join('\n');

        // Build preferences info
        const preferencesInfo = body.preferences
          ? `
## ${body.targetName}의 취향 키워드
${body.preferences.map((p) => `- ${p.category}: ${p.preferences.join(', ')}`).join('\n')}
`
          : '';

        // Build stats info
        const statsInfo = body.stats
          ? `
## ${body.targetName}의 대화 통계
- 총 메시지 수: ${body.stats.totalMessages}개
- 평균 메시지 길이: ${body.stats.avgLength}자
- 자주 쓰는 단어: ${body.stats.topWords.slice(0, 10).join(', ')}
`
          : '';

        const prompt = `
# "${body.targetName}"의 밸런스게임 만들기

${statsInfo}

${preferencesInfo}

## 대화 내용
${messagesText}

---

## 요청사항
위 대화와 통계를 바탕으로 "${body.targetName}"님의 취향을 맞추는 밸런스게임 ${questionCount}문제를 만들어주세요.

### 문제 구성 가이드
1. **취향 기반 문제 (${Math.ceil(questionCount * 0.4)}개)**: 대화에서 드러난 음식, 취미, 여행 취향
2. **성격 기반 문제 (${Math.ceil(questionCount * 0.3)}개)**: 대화 스타일에서 드러난 성격
3. **라이프스타일 문제 (${Math.ceil(questionCount * 0.3)}개)**: 대화 패턴에서 드러난 생활 방식

### 주의사항
- 각 질문은 A vs B 선택지로 명확하게
- 정답은 반드시 대화 내용에서 확인 가능해야 함
- "evidence" 필드에 실제 근거(대화 인용) 포함 필수
- 재미있고 공유하고 싶은 문제로!

### 난이도 분배
- easy: ${Math.ceil(questionCount * 0.4)}개 (대화에서 명확히 드러난 취향)
- medium: ${Math.ceil(questionCount * 0.3)}개 (약간 추론이 필요)
- hard: ${Math.ceil(questionCount * 0.3)}개 (세심한 관찰 필요)
`;

        // Call OpenAI with tier-based model
        const aiResponse = await callOpenAI(BALANCE_GAME_PROMPT, prompt, env.OPENAI_API_KEY, tier);
        const gameData = parseBalanceResponse(aiResponse);

        return new Response(
          JSON.stringify(gameData),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Balance game generation error:', error);

        const message =
          error instanceof Error ? error.message : '밸런스게임 생성 중 오류가 발생했어요';

        return new Response(
          JSON.stringify({ error: message }),
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
