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

// Relationship metrics
export interface RelationshipMetrics {
  responseSpeed: number; // 0-100
  conversationBalance: number; // 0-100
  emotionalSupport: number; // 0-100
  sharedInterests: number; // 0-100
  communicationQuality: number; // 0-100
}

// Participant relationship data
export interface ParticipantRelationship {
  name: string;
  metrics: RelationshipMetrics;
  characteristics: string[];
}

// Overall relationship analysis
export interface RelationshipScore {
  overallScore: number; // 0-100
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  relationshipType: string; // e.g., "찐친", "소울메이트", "케미폭발" 등
  typeDescription: string;
}

// Full analysis result
export interface RelationshipAnalysisResult {
  score: RelationshipScore;
  participants: ParticipantRelationship[];
  highlights: {
    title: string;
    description: string;
  }[];
  summary: string;
  tips: string[];
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
    features: ['샘플 메시지 분석', '기본 관계 점수', '관계 유형 분석'],
    price: null,
  },
  premium: {
    tier: 'premium',
    name: '프리미엄 분석',
    maxMessages: 5000,
    model: 'GPT-4 Turbo',
    features: ['전체 메시지 분석', '정밀 관계 점수', '상세 케미 분석', '관계 개선 팁'],
    price: 3900,
  },
};
