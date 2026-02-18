// Parsed chat message
export interface ChatMessage {
  sender: string;
  timestamp: Date;
  content: string;
  messageType: 'text' | 'photo' | 'emoticon' | 'link' | 'file' | 'system';
}

// Parsed chat data (supports multiple participants)
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

// Individual menhera analysis
export interface MenheraScore {
  name: string;
  score: number; // 0-100
  rank: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  title: string; // 예: "관종 맨헤라", "새벽감성 맨헤라" 등
  metrics: {
    emotionalVolatility: number;    // 감정 기복 지수
    nightActivity: number;          // 심야 활동 빈도
    negativity: number;             // 부정적 표현 사용률
    attentionSeeking: number;       // 관심 요구 패턴
    dependency: number;             // 의존성 표현
  };
  interpretation: string;
}

// Full analysis result
export interface MenheraAnalysisResult {
  rankings: MenheraScore[];
  winner: {
    name: string;
    score: number;
    title: string;
  };
  summary: string;
  analyzedAt: Date;
}

// Analysis state
export type AnalysisState = 'idle' | 'parsing' | 'analyzing' | 'complete' | 'error';
