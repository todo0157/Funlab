import { ParsedChat, MenheraAnalysisResult, MenheraScore, AnalysisTier, TIER_INFO } from '../types/menhera';
import { sampleMessages, formatMessagesForAPI } from './chatParser';

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

export async function analyzeMenhera(
  parsedChat: ParsedChat,
  tier: AnalysisTier = 'free'
): Promise<MenheraAnalysisResult> {
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

  const response = await fetch(`${API_BASE_URL}/api/analyze-menhera`, {
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
  return {
    ...result.data,
    analyzedAt: new Date(),
  };
}

// Mock analysis for development/testing without API
export function mockAnalyzeMenhera(parsedChat: ParsedChat): MenheraAnalysisResult {
  const participants = parsedChat.participants;

  // Generate random scores for each participant
  const rankings: MenheraScore[] = participants.map((name, index) => {
    const score = Math.round(Math.random() * 60 + 40); // 40-100
    const grades: Array<'S' | 'A' | 'B' | 'C' | 'D'> = ['S', 'A', 'B', 'C', 'D'];
    const titles = [
      '새벽감성 맨헤라',
      '관종 맨헤라',
      '츤데레 맨헤라',
      '조용한 맨헤라',
      '텐션 맨헤라',
    ];

    return {
      name,
      score,
      rank: index + 1, // Will be sorted later
      grade: grades[Math.floor(Math.random() * grades.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      metrics: {
        emotionalVolatility: Math.round(Math.random() * 100),
        nightActivity: Math.round(Math.random() * 100),
        negativity: Math.round(Math.random() * 100),
        attentionSeeking: Math.round(Math.random() * 100),
        dependency: Math.round(Math.random() * 100),
      },
      interpretation: `${name}님은 대화에서 특유의 감성이 느껴지는 스타일이에요.`,
    };
  });

  // Sort by score descending and assign ranks
  rankings.sort((a, b) => b.score - a.score);
  rankings.forEach((r, i) => (r.rank = i + 1));

  const winner = rankings[0];

  return {
    rankings,
    winner: {
      name: winner.name,
      score: winner.score,
      title: winner.title,
    },
    summary: `이 톡방에서 가장 맨헤라력이 높은 분은 ${winner.name}님이에요! ${winner.title} 타입으로, 톡방에서 독보적인 존재감을 보여주고 있어요.`,
    analyzedAt: new Date(),
  };
}
