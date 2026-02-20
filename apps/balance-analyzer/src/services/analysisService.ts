import type { BalanceGameData, BalanceQuestion, ChatMessage, TierType, PreferenceInsight } from '../types/balance';
import { extractPreferences, getMessageStats } from './chatParser';

const API_URL = import.meta.env.DEV ? 'http://localhost:8787' : '';

interface GenerateBalanceRequest {
  messages: ChatMessage[];
  targetName: string;
  tier: TierType;
  preferences: PreferenceInsight[];
  stats: ReturnType<typeof getMessageStats>;
}

export async function generateBalanceGame(
  messages: ChatMessage[],
  targetName: string,
  tier: TierType
): Promise<BalanceGameData> {
  const preferences = extractPreferences(messages, targetName);
  const stats = getMessageStats(messages, targetName);

  const targetMessages = messages.filter((m) => m.sender === targetName);
  const sampleSize = tier === 'premium' ? 500 : 200;
  const sampledMessages = sampleMessages(targetMessages, sampleSize);

  const requestBody: GenerateBalanceRequest = {
    messages: sampledMessages,
    targetName,
    tier,
    preferences,
    stats,
  };

  const response = await fetch(`${API_URL}/api/generate-balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '밸런스게임 생성에 실패했습니다');
  }

  const data = await response.json();
  return {
    targetName,
    questions: data.questions,
    creatorName: '',
    createdAt: new Date().toISOString(),
  };
}

function sampleMessages(messages: ChatMessage[], maxCount: number): ChatMessage[] {
  if (messages.length <= maxCount) {
    return messages;
  }

  // 균등하게 샘플링
  const step = messages.length / maxCount;
  const sampled: ChatMessage[] = [];
  for (let i = 0; i < maxCount; i++) {
    const index = Math.floor(i * step);
    sampled.push(messages[index]);
  }
  return sampled;
}

// URL 기반 공유 (DB 불필요)
export function encodeGameData(gameData: BalanceGameData): string {
  const json = JSON.stringify(gameData);
  // Base64 인코딩
  return btoa(encodeURIComponent(json));
}

export function decodeGameData(encoded: string): BalanceGameData | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getShareUrl(gameData: BalanceGameData): string {
  const encoded = encodeGameData(gameData);
  const baseUrl = window.location.origin;
  return `${baseUrl}/balance/?game=${encoded}`;
}

export function getGameDataFromUrl(): BalanceGameData | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('game');
  if (!encoded) return null;
  return decodeGameData(encoded);
}

// 카카오톡 공유
export function shareToKakao(gameData: BalanceGameData) {
  const shareUrl = getShareUrl(gameData);
  const questionCount = gameData.questions.length;

  if (window.Kakao && window.Kakao.Share) {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${gameData.targetName}님의 밸런스게임`,
        description: `${questionCount}개의 밸런스게임으로 ${gameData.targetName}님의 취향을 맞춰보세요!`,
        imageUrl: 'https://fun-lab.pages.dev/balance/og-image.png',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '밸런스게임 시작하기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  } else {
    // 카카오 SDK 없으면 URL 복사
    navigator.clipboard.writeText(shareUrl);
    alert('링크가 복사되었습니다!');
  }
}

// 결과에 따른 등급
export function getScoreGrade(score: number): { grade: string; emoji: string; message: string } {
  if (score >= 90) {
    return { grade: 'S', emoji: '👑', message: '완벽해요! 찐소울메이트!' };
  } else if (score >= 70) {
    return { grade: 'A', emoji: '🎉', message: '대단해요! 취향저격수!' };
  } else if (score >= 50) {
    return { grade: 'B', emoji: '😊', message: '꽤 잘 알고 있네요!' };
  } else if (score >= 30) {
    return { grade: 'C', emoji: '🤔', message: '조금 더 알아가봐요!' };
  } else {
    return { grade: 'D', emoji: '😅', message: '아직 서먹서먹?' };
  }
}

// 난이도별 이모지
export function getDifficultyEmoji(difficulty: BalanceQuestion['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'hard':
      return '🔴';
    default:
      return '⚪';
  }
}

// 카테고리별 이모지
export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    음식: '🍽️',
    여행: '✈️',
    취미: '🎮',
    라이프스타일: '🏠',
    성격: '💭',
    관계: '💕',
    default: '🎯',
  };
  return emojis[category] || emojis.default;
}

// Kakao SDK 타입
declare global {
  interface Window {
    Kakao?: {
      Share?: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}
