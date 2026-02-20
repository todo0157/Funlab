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
  avgResponseTime: number;
  shortReplyRate: number;
  initiationRate: number;
  emojiRate: number;
  questionRate: number;
  lateNightRate: number;
}

export interface ParsedChat {
  participants: string[];
  messages: Message[];
  totalMessageCount: number;
  participantStats: Map<string, ParticipantStats>;
}

export interface SignalItem {
  type: 'greenlight' | 'redflag';
  title: string;
  description: string;
  evidence: string;
  severity: number; // 1-5
}

export interface GreenlightResult {
  overallScore: number; // 0-100
  verdict: 'strong_greenlight' | 'greenlight' | 'neutral' | 'redflag' | 'strong_redflag';
  verdictMessage: string;
  greenlights: SignalItem[];
  redflags: SignalItem[];
  advice: string;
  targetName: string;
}
