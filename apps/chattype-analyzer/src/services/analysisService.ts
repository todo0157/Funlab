import { AnalysisTier, ChatTypeResult, ParsedChat, ChatTypeInfo, ChatTypeCode } from '../types/chattype';
import { prepareAnalysisData } from './chatParser';

const API_URL = import.meta.env.DEV ? 'http://localhost:8787' : '';

// 16가지 카톡 말투 유형 정의
export const CHAT_TYPES: Record<ChatTypeCode, ChatTypeInfo> = {
  LIGHTNING: {
    code: 'LIGHTNING',
    title: '폭풍 답장러',
    emoji: '⚡',
    description: '메시지가 오면 0.1초 안에 답장하는 당신! 상대방이 입력 중일 때 이미 답장 완료.',
    characteristics: ['초고속 답장', '대화 끊김 없음', '항상 온라인'],
    bestMatch: 'LIGHTNING',
    worstMatch: 'GHOST',
    gradient: 'from-yellow-400 to-orange-500',
  },
  GHOST: {
    code: 'GHOST',
    title: '읽씹 마스터',
    emoji: '👻',
    description: '읽었는데 답장은... 나중에. 바쁜 거 아니고 그냥 그런 거.',
    characteristics: ['느긋한 답장', '선택적 반응', '미스터리한 타이밍'],
    bestMatch: 'CHILL_VIBES',
    worstMatch: 'LIGHTNING',
    gradient: 'from-gray-400 to-gray-600',
  },
  EMOJI_BOMB: {
    code: 'EMOJI_BOMB',
    title: '이모티콘 폭격기',
    emoji: '🎉',
    description: '말로 하면 되는 걸 이모티콘으로 표현하는 감성 충만 유형!',
    characteristics: ['이모티콘 과다 사용', 'ㅋㅋㅋ 필수', '감정 표현 만렙'],
    bestMatch: 'MOOD_MAKER',
    worstMatch: 'MINIMALIST',
    gradient: 'from-pink-400 to-purple-500',
  },
  MINIMALIST: {
    code: 'MINIMALIST',
    title: '단답 장인',
    emoji: '💬',
    description: 'ㅇㅇ, ㅋㅋ, ㄱㄱ로 모든 대화를 커버하는 효율의 달인.',
    characteristics: ['최소한의 글자', '효율적 소통', '함축적 표현'],
    bestMatch: 'COOL_GUY',
    worstMatch: 'NOVELIST',
    gradient: 'from-slate-400 to-slate-600',
  },
  NOVELIST: {
    code: 'NOVELIST',
    title: '장문 소설가',
    emoji: '📚',
    description: '카톡으로 소설을 연재하는 당신. 스크롤이 필요한 메시지는 기본.',
    characteristics: ['긴 메시지', '상세한 설명', '풍부한 표현'],
    bestMatch: 'NOVELIST',
    worstMatch: 'MINIMALIST',
    gradient: 'from-amber-400 to-orange-500',
  },
  NIGHT_OWL: {
    code: 'NIGHT_OWL',
    title: '새벽 감성러',
    emoji: '🌙',
    description: '해가 지면 활동 시작. 새벽 3시가 골든타임인 당신.',
    characteristics: ['심야 활동', '감성적 대화', '늦은 답장'],
    bestMatch: 'NIGHT_OWL',
    worstMatch: 'MORNING_BIRD',
    gradient: 'from-indigo-500 to-purple-600',
  },
  MORNING_BIRD: {
    code: 'MORNING_BIRD',
    title: '아침형 인간',
    emoji: '🌅',
    description: '새벽 6시에 "좋은 아침!" 보내는 건강한 당신.',
    characteristics: ['아침 활동', '규칙적인 패턴', '일찍 잠드는 편'],
    bestMatch: 'MORNING_BIRD',
    worstMatch: 'NIGHT_OWL',
    gradient: 'from-orange-400 to-yellow-500',
  },
  QUESTION_MARK: {
    code: 'QUESTION_MARK',
    title: '질문 폭격기',
    emoji: '❓',
    description: '뭐해? 밥 먹었어? 어디야? 질문으로 대화를 이끌어가는 당신.',
    characteristics: ['질문 많음', '관심 표현', '대화 주도'],
    bestMatch: 'MOOD_MAKER',
    worstMatch: 'GHOST',
    gradient: 'from-blue-400 to-cyan-500',
  },
  MOOD_MAKER: {
    code: 'MOOD_MAKER',
    title: '분위기 메이커',
    emoji: '🎭',
    description: '톡방 분위기는 내가 책임진다! 드립력 만렙 유쾌한 당신.',
    characteristics: ['유머 감각', '적극적 참여', '분위기 전환'],
    bestMatch: 'EMOJI_BOMB',
    worstMatch: 'COOL_GUY',
    gradient: 'from-rose-400 to-pink-500',
  },
  TSUNDERE: {
    code: 'TSUNDERE',
    title: '츤데레형',
    emoji: '😤',
    description: '관심 있는 척 안 하는데 사실 엄청 관심 있는 유형.',
    characteristics: ['쿨한 척', '은근한 관심', '반전 매력'],
    bestMatch: 'AEGYO_MASTER',
    worstMatch: 'TSUNDERE',
    gradient: 'from-red-400 to-rose-500',
  },
  AEGYO_MASTER: {
    code: 'AEGYO_MASTER',
    title: '애교 만렙',
    emoji: '🥺',
    description: '~~~용, ㅠㅠ, 귀여운 말투로 무장한 애교 대장.',
    characteristics: ['애교 표현', '귀여운 말투', '이모티콘 활용'],
    bestMatch: 'TSUNDERE',
    worstMatch: 'COOL_GUY',
    gradient: 'from-pink-400 to-rose-400',
  },
  COOL_GUY: {
    code: 'COOL_GUY',
    title: '쿨한 도시남녀',
    emoji: '😎',
    description: '감정 표현? 그런 건 쿨하지 않아. 담백한 대화 스타일.',
    characteristics: ['담백한 말투', '감정 절제', '쿨한 이미지'],
    bestMatch: 'MINIMALIST',
    worstMatch: 'AEGYO_MASTER',
    gradient: 'from-gray-500 to-zinc-600',
  },
  ENERGY_BOMB: {
    code: 'ENERGY_BOMB',
    title: '텐션 폭발형',
    emoji: '🔥',
    description: '!!!와 ㅋㅋㅋㅋㅋㅋ로 가득한 에너지 넘치는 당신!',
    characteristics: ['높은 텐션', '느낌표 과다', '열정적 표현'],
    bestMatch: 'EMOJI_BOMB',
    worstMatch: 'MINIMALIST',
    gradient: 'from-orange-500 to-red-500',
  },
  CHILL_VIBES: {
    code: 'CHILL_VIBES',
    title: '느긋한 힐러',
    emoji: '🍃',
    description: '급할 거 없어~ 느긋하고 편안한 대화 스타일.',
    characteristics: ['여유로운 답장', '편안한 분위기', '스트레스 프리'],
    bestMatch: 'GHOST',
    worstMatch: 'LIGHTNING',
    gradient: 'from-green-400 to-teal-500',
  },
  DETECTIVE: {
    code: 'DETECTIVE',
    title: '반응 탐정',
    emoji: '🔍',
    description: '읽씹 시간, 답장 속도, 말투 변화까지 다 분석하는 당신.',
    characteristics: ['세심한 관찰', '패턴 분석', '반응 체크'],
    bestMatch: 'QUESTION_MARK',
    worstMatch: 'CHILL_VIBES',
    gradient: 'from-violet-400 to-purple-500',
  },
  CHAMELEON: {
    code: 'CHAMELEON',
    title: '카멜레온형',
    emoji: '🦎',
    description: '상대에 따라 말투가 바뀌는 적응력 만렙 유형.',
    characteristics: ['상황 적응력', '다양한 말투', '공감 능력'],
    bestMatch: 'CHAMELEON',
    worstMatch: 'MINIMALIST',
    gradient: 'from-emerald-400 to-cyan-500',
  },
};

export async function analyzeChatType(
  parsedChat: ParsedChat,
  targetName: string,
  tier: AnalysisTier
): Promise<ChatTypeResult> {
  const { messages, stats } = prepareAnalysisData(parsedChat, targetName, tier);

  const response = await fetch(`${API_URL}/api/analyze-chattype`, {
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
        avgMessageLength: Math.round(stats.avgMessageLength),
        responseSpeed: stats.responseSpeed,
        emojiRate: Math.round(stats.emojiRate * 100),
        questionRate: Math.round(stats.questionRate * 100),
        exclamationRate: Math.round(stats.exclamationRate * 100),
        lateNightRate: Math.round(stats.lateNightRate * 100),
        initiationRate: Math.round(stats.initiationRate * 100),
        shortReplyRate: Math.round(stats.shortReplyRate * 100),
        longReplyRate: Math.round(stats.longReplyRate * 100),
      } : null,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || '분석 중 오류가 발생했어요');
  }

  const data = await response.json();

  // Map the type code to full type info
  const typeInfo = CHAT_TYPES[data.typeCode as ChatTypeCode] || CHAT_TYPES.CHAMELEON;

  return {
    ...data,
    type: typeInfo,
  };
}

export function getCompatibility(type1: ChatTypeCode, type2: ChatTypeCode): 'best' | 'good' | 'normal' | 'bad' {
  const typeInfo = CHAT_TYPES[type1];
  if (typeInfo.bestMatch === type2) return 'best';
  if (typeInfo.worstMatch === type2) return 'bad';
  return 'normal';
}
