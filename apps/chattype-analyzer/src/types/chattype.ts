export type AnalysisTier = 'free' | 'premium';

export type AppState =
  | 'idle'
  | 'parsing'
  | 'selectTarget'
  | 'tierSelection'
  | 'analyzing'
  | 'result'
  | 'error';

export interface Message {
  sender: string;
  content: string;
  timestamp: Date;
  hour: number;
}

export interface ParticipantStats {
  name: string;
  messageCount: number;
  avgMessageLength: number;
  responseSpeed: 'fast' | 'normal' | 'slow';
  emojiRate: number;
  questionRate: number;
  exclamationRate: number;
  lateNightRate: number;
  initiationRate: number;
  shortReplyRate: number;
  longReplyRate: number;
}

export interface ParsedChat {
  participants: string[];
  messages: Message[];
  totalMessageCount: number;
  participantStats: Map<string, ParticipantStats>;
}

// 16가지 카톡 말투 유형
export type ChatTypeCode =
  | 'LIGHTNING' // 폭풍 답장러
  | 'GHOST' // 읽씹 마스터
  | 'EMOJI_BOMB' // 이모티콘 폭격기
  | 'MINIMALIST' // 단답 장인
  | 'NOVELIST' // 장문 소설가
  | 'NIGHT_OWL' // 새벽 감성러
  | 'MORNING_BIRD' // 아침형 인간
  | 'QUESTION_MARK' // 질문 폭격기
  | 'MOOD_MAKER' // 분위기 메이커
  | 'TSUNDERE' // 츤데레형
  | 'AEGYO_MASTER' // 애교 만렙
  | 'COOL_GUY' // 쿨한 도시남녀
  | 'ENERGY_BOMB' // 텐션 폭발형
  | 'CHILL_VIBES' // 느긋한 힐러
  | 'DETECTIVE' // 반응 탐정
  | 'CHAMELEON'; // 카멜레온형

export interface ChatTypeInfo {
  code: ChatTypeCode;
  title: string;
  emoji: string;
  description: string;
  characteristics: string[];
  bestMatch: ChatTypeCode;
  worstMatch: ChatTypeCode;
  gradient: string;
}

export interface ChatTypeResult {
  targetName: string;
  type: ChatTypeInfo;
  scores: {
    responseSpeed: number;
    messageLength: number;
    emotionExpression: number;
    activityTime: number;
    conversationStyle: number;
  };
  details: {
    title: string;
    description: string;
  }[];
  tips: string[];
}
