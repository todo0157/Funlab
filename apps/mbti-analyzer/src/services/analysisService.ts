import { ParsedChat, MBTIAnalysisResult, AnalysisTier, TIER_INFO } from '../types/mbti';
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

export async function analyzeMBTI(
  parsedChat: ParsedChat,
  tier: AnalysisTier = 'free'
): Promise<MBTIAnalysisResult> {
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

  const response = await fetch(`${API_BASE_URL}/api/analyze-mbti`, {
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
