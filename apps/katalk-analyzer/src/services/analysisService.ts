import { ParsedChat, AnalysisResult, LoveAnalysis, AnalysisTier, TIER_INFO } from '../types/katalk';
import { sampleMessages, formatMessagesForAPI } from './katalkParser';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8787' : '';

interface AnalyzeRequestBody {
  tier: AnalysisTier;
  chatData: {
    participants: string[];
    messages: string;
    metadata: {
      totalMessages: number;
      analyzedMessages: number;
      dateRange: string;
      messageCountBySender: Record<string, number>;
    };
  };
}

// Normalize API response to ensure overallScore has personA/personB keys and sums to 100
function normalizeLoveAnalysis(love: LoveAnalysis): LoveAnalysis {
  const { overallScore, personAName, personBName } = love;

  let scoreA: number;
  let scoreB: number;

  // Extract scores - handle both personA/personB keys and actual name keys
  if ('personA' in overallScore && 'personB' in overallScore) {
    scoreA = overallScore.personA;
    scoreB = overallScore.personB;
  } else {
    // Map actual names to scores
    scoreA = (overallScore as Record<string, number>)[personAName] ?? 50;
    scoreB = (overallScore as Record<string, number>)[personBName] ?? 50;
  }

  // Ensure scores sum to 100
  const total = scoreA + scoreB;
  if (total !== 100 && total > 0) {
    scoreA = Math.round((scoreA / total) * 100);
    scoreB = 100 - scoreA;
  } else if (total === 0) {
    scoreA = 50;
    scoreB = 50;
  }

  return {
    ...love,
    overallScore: {
      personA: scoreA,
      personB: scoreB,
    },
  };
}

export async function analyzeChat(
  parsedChat: ParsedChat,
  tier: AnalysisTier = 'free'
): Promise<AnalysisResult> {
  // Sample messages based on tier
  const maxMessages = TIER_INFO[tier].maxMessages;
  const sampledMessages = sampleMessages(parsedChat, maxMessages);
  const formattedMessages = formatMessagesForAPI(sampledMessages);

  const requestBody: AnalyzeRequestBody = {
    tier,
    chatData: {
      participants: parsedChat.participants,
      messages: formattedMessages,
      metadata: {
        totalMessages: parsedChat.totalMessageCount,
        analyzedMessages: sampledMessages.length,
        dateRange: `${parsedChat.dateRange.start.toLocaleDateString()} ~ ${parsedChat.dateRange.end.toLocaleDateString()}`,
        messageCountBySender: parsedChat.messageCountBySender,
      },
    },
  };

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Analysis failed: ${response.status}`);
  }

  const result = await response.json();
  const data = result.data;

  // Normalize the love analysis to ensure correct keys
  return {
    ...data,
    love: normalizeLoveAnalysis(data.love),
    analyzedAt: new Date(),
  };
}

// Mock analysis for development/testing without API
export function mockAnalyzeChat(parsedChat: ParsedChat): AnalysisResult {
  const [personA, personB] = parsedChat.participants;
  const countA = parsedChat.messageCountBySender[personA] || 0;
  const countB = parsedChat.messageCountBySender[personB] || 0;
  const total = countA + countB;

  // Simple calculation based on message count
  const scoreA = Math.round((countA / total) * 100);
  const scoreB = 100 - scoreA;

  return {
    love: {
      overallScore: {
        personA: scoreA,
        personB: scoreB,
      },
      personAName: personA,
      personBName: personB,
      winner: scoreA > scoreB ? personA : personB,
      indicators: {
        initiationRate: { personA: Math.random() * 100, personB: Math.random() * 100 },
        responseTime: { personA: Math.random() * 10, personB: Math.random() * 10 },
        avgMessageLength: { personA: Math.random() * 50, personB: Math.random() * 50 },
        questionRate: { personA: Math.random() * 30, personB: Math.random() * 30 },
        emoticonUsage: { personA: Math.random() * 40, personB: Math.random() * 40 },
      },
      interpretation: `${scoreA > scoreB ? personA : personB}님이 대화에서 더 적극적인 모습을 보이고 있어요. 메시지 수와 대화 패턴을 분석한 결과입니다.`,
    },
    teto: {
      [personA]: {
        score: Math.round(Math.random() * 40 + 60),
        grade: 'A',
        gradeDescription: '대화를 잘 이끌어가는 타입이에요',
        metrics: {
          leadingPower: Math.random() * 100,
          topicChangingAbility: Math.random() * 100,
          responseVariety: Math.random() * 100,
          humorSense: Math.random() * 100,
          empathyExpression: Math.random() * 100,
        },
      },
      [personB]: {
        score: Math.round(Math.random() * 40 + 60),
        grade: 'B',
        gradeDescription: '안정적인 대화 스타일이에요',
        metrics: {
          leadingPower: Math.random() * 100,
          topicChangingAbility: Math.random() * 100,
          responseVariety: Math.random() * 100,
          humorSense: Math.random() * 100,
          empathyExpression: Math.random() * 100,
        },
      },
    },
    aegyo: {
      [personA]: {
        score: Math.round(Math.random() * 60 + 20),
        grade: 'B',
        type: 'natural',
        typeDescription: '자연스러운 애교 타입',
        metrics: {
          waveUsage: Math.random() * 100,
          cuteEmoticonUsage: Math.random() * 100,
          cuteEndingUsage: Math.random() * 100,
          onomatopoeiaUsage: Math.random() * 100,
          slangUsage: Math.random() * 100,
        },
      },
      [personB]: {
        score: Math.round(Math.random() * 60 + 20),
        grade: 'A',
        type: 'tsundere',
        typeDescription: '츤데레 타입',
        metrics: {
          waveUsage: Math.random() * 100,
          cuteEmoticonUsage: Math.random() * 100,
          cuteEndingUsage: Math.random() * 100,
          onomatopoeiaUsage: Math.random() * 100,
          slangUsage: Math.random() * 100,
        },
      },
    },
    summary: `${personA}님과 ${personB}님의 대화를 분석한 결과, 두 분 모두 활발하게 대화에 참여하고 계세요. 서로에 대한 관심이 느껴지는 건강한 대화 패턴입니다.`,
    analyzedAt: new Date(),
  };
}
