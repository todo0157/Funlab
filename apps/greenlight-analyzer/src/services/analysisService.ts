import { AnalysisTier, GreenlightResult, ParsedChat } from '../types/greenlight';
import { prepareAnalysisData } from './chatParser';

const API_URL = import.meta.env.DEV ? 'http://localhost:8787' : '';

export async function analyzeGreenlight(
  parsedChat: ParsedChat,
  targetName: string,
  tier: AnalysisTier
): Promise<GreenlightResult> {
  const { messages, stats } = prepareAnalysisData(parsedChat, targetName, tier);

  const response = await fetch(`${API_URL}/api/analyze-greenlight`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      targetName,
      tier,
      stats: stats ? {
        messageCount: stats.messageCount,
        avgResponseTime: Math.round(stats.avgResponseTime),
        shortReplyRate: Math.round(stats.shortReplyRate * 100),
        initiationRate: Math.round(stats.initiationRate * 100),
        emojiRate: Math.round(stats.emojiRate * 100),
        questionRate: Math.round(stats.questionRate * 100),
        lateNightRate: Math.round(stats.lateNightRate * 100),
      } : null,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || '분석 중 오류가 발생했어요');
  }

  return response.json();
}

export function getVerdictInfo(verdict: GreenlightResult['verdict']): {
  emoji: string;
  color: string;
  gradient: string;
  bgColor: string;
} {
  switch (verdict) {
    case 'strong_greenlight':
      return {
        emoji: '💚',
        color: 'text-green-500',
        gradient: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
      };
    case 'greenlight':
      return {
        emoji: '🟢',
        color: 'text-green-400',
        gradient: 'from-green-400 to-teal-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
      };
    case 'neutral':
      return {
        emoji: '🟡',
        color: 'text-yellow-500',
        gradient: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      };
    case 'redflag':
      return {
        emoji: '🚩',
        color: 'text-red-400',
        gradient: 'from-orange-400 to-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
      };
    case 'strong_redflag':
      return {
        emoji: '🚨',
        color: 'text-red-500',
        gradient: 'from-red-500 to-rose-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
      };
  }
}
