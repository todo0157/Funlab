export type AnalysisTier = 'free' | 'premium';
export type AnalysisMode = 'quiz' | 'chat';

export type AppState =
  | 'idle'
  | 'modeSelect'
  | 'quiz'
  | 'parsing'
  | 'selectTarget'
  | 'tierSelection'
  | 'analyzing'
  | 'result'
  | 'error'
  | 'gallery'
  | 'characterDetail';

// 캐릭터 특성 (0-100 점수)
export interface CharacterTraits {
  warmth: number;      // 다정함 (100) vs 냉정함 (0)
  energy: number;      // 텐션 높음 (100) vs 차분함 (0)
  directness: number;  // 직설적 (100) vs 돌려말하기 (0)
  humor: number;       // 유머러스 (100) vs 진지함 (0)
  initiative: number;  // 주도적 (100) vs 수동적 (0)
  emotion: number;     // 감정적 (100) vs 이성적 (0)
  loyalty: number;     // 의리/충성심 (100) vs 개인주의 (0)
  ambition: number;    // 야망/목표지향 (100) vs 현실만족 (0)
}

// 캐릭터 정보
export interface Character {
  id: string;
  name: string;
  drama: string;
  platform: 'netflix' | 'tvn' | 'jtbc' | 'sbs' | 'kbs' | 'movie' | 'disney';
  year: number;
  emoji: string;
  color: string;
  description: string;
  traits: CharacterTraits;
  quotes: string[];
  keywords: string[];
}

// 매칭 결과
export interface MatchResult {
  character: Character;
  similarity: number;  // 0-100%
  matchedTraits: string[];
}

// 설문 문항
export interface QuizQuestion {
  id: string;
  category: 'communication' | 'energy' | 'relationship' | 'values';
  question: string;
  options: {
    text: string;
    traits: Partial<CharacterTraits>;
  }[];
}

// 설문 응답
export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
}

// 분석 결과
export interface AnalysisResult {
  mode: AnalysisMode;
  targetName?: string;
  userTraits: CharacterTraits;
  matches: MatchResult[];
  analysis: string;
  analyzedAt: Date;
}

// 카톡 메시지
export interface Message {
  sender: string;
  content: string;
  timestamp: Date;
  hour: number;
}

// 파싱된 카톡 데이터
export interface ParsedChat {
  participants: string[];
  messages: Message[];
  totalMessageCount: number;
  messageCountBySender: Record<string, number>;
  dateRange: {
    start: Date;
    end: Date;
  };
}

// 공유 데이터
export interface ShareData {
  characterId: string;
  similarity: number;
  traits: CharacterTraits;
  mode: AnalysisMode;
  targetName?: string;
}

// 티어 정보
export const TIER_INFO = {
  free: {
    name: 'Free',
    maxMessages: 300,
    description: '빠른 분석',
  },
  premium: {
    name: 'Premium',
    maxMessages: 1000,
    description: '정밀 분석',
  },
} as const;
