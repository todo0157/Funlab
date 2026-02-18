// Parsed chat message
export interface ChatMessage {
  sender: string;
  timestamp: Date;
  content: string;
  messageType: 'text' | 'photo' | 'emoticon' | 'link' | 'file' | 'system';
}

// Parsed chat data
export interface ParsedChat {
  participants: string[];
  messages: ChatMessage[];
  dateRange: {
    start: Date;
    end: Date;
  };
  totalMessageCount: number;
  messageCountBySender: Record<string, number>;
}

// MBTI axis analysis
export interface MBTIAxis {
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  first: {
    letter: string;
    score: number;
    label: string;
  };
  second: {
    letter: string;
    score: number;
    label: string;
  };
}

// Individual participant MBTI result
export interface ParticipantMBTI {
  name: string;
  mbtiType: string;
  axes: MBTIAxis[];
  confidence: number;
  personality: {
    title: string;
    description: string;
    traits: string[];
  };
}

// Full analysis result
export interface MBTIAnalysisResult {
  participants: ParticipantMBTI[];
  chatStyle: {
    summary: string;
    patterns: string[];
  };
  analyzedAt: Date;
}

// Analysis state
export type AnalysisState = 'idle' | 'parsing' | 'tierSelection' | 'analyzing' | 'complete' | 'error';

// Analysis tier
export type AnalysisTier = 'free' | 'premium';

// Tier configuration
export interface TierInfo {
  tier: AnalysisTier;
  name: string;
  maxMessages: number;
  model: string;
  features: string[];
  price: number | null;
}

export const TIER_INFO: Record<AnalysisTier, TierInfo> = {
  free: {
    tier: 'free',
    name: '무료 분석',
    maxMessages: 200,
    model: 'GPT-3.5',
    features: ['샘플 메시지 분석', '기본 MBTI 예측', '대화 스타일 분석'],
    price: null,
  },
  premium: {
    tier: 'premium',
    name: '프리미엄 분석',
    maxMessages: 5000,
    model: 'GPT-4 Turbo',
    features: ['전체 메시지 분석', '정밀 MBTI 예측', '상세 성격 분석', '대화 패턴 심층 분석'],
    price: 3900,
  },
};
