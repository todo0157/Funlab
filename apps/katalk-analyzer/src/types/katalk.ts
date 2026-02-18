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

// Love analysis result
export interface LoveAnalysis {
  overallScore: {
    personA: number; // 0-100%
    personB: number; // 0-100%
  };
  personAName: string;
  personBName: string;
  winner: string;
  indicators: {
    initiationRate: { personA: number; personB: number };
    responseTime: { personA: number; personB: number };
    avgMessageLength: { personA: number; personB: number };
    questionRate: { personA: number; personB: number };
    emoticonUsage: { personA: number; personB: number };
  };
  interpretation: string;
}

// Teto (text conversation power) analysis
export interface TetoAnalysis {
  score: number; // 0-100
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeDescription: string;
  metrics: {
    leadingPower: number;
    topicChangingAbility: number;
    responseVariety: number;
    humorSense: number;
    empathyExpression: number;
  };
}

// Aegyo (cute expression) analysis
export interface AegyoAnalysis {
  score: number; // 0-100
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  type: 'natural' | 'forced' | 'tsundere' | 'minimal';
  typeDescription: string;
  metrics: {
    waveUsage: number; // ~~~
    cuteEmoticonUsage: number;
    cuteEndingUsage: number; // 용, 당, 양 등
    onomatopoeiaUsage: number;
    slangUsage: number;
  };
}

// Full analysis result
export interface AnalysisResult {
  love: LoveAnalysis;
  teto: Record<string, TetoAnalysis>;
  aegyo: Record<string, AegyoAnalysis>;
  summary: string;
  analyzedAt: Date;
}

// Analysis state
export type AnalysisState = 'idle' | 'parsing' | 'tierSelection' | 'analyzing' | 'complete' | 'error';

// Analysis tier
export type AnalysisTier = 'free' | 'premium';

// Tier configuration for display
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
    features: ['샘플 메시지 분석', '기본 호감도 측정', '테토력/에겐력 분석'],
    price: null,
  },
  premium: {
    tier: 'premium',
    name: '프리미엄 분석',
    maxMessages: 5000,
    model: 'GPT-4 Turbo',
    features: ['전체 메시지 분석', '정밀 호감도 측정', '상세 대화 패턴 분석', '심층 해석'],
    price: 3900,
  },
};
