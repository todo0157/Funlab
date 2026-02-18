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
export type AnalysisState = 'idle' | 'parsing' | 'analyzing' | 'complete' | 'error';
