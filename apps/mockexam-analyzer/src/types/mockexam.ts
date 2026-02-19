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

// Quiz question
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  explanation?: string;
}

// Quiz data
export interface QuizData {
  targetName: string; // 퀴즈 대상 (여친/남친 이름)
  creatorName: string; // 퀴즈 생성자 이름
  questions: QuizQuestion[];
  createdAt: string;
  tier: AnalysisTier;
}

// Encoded quiz for URL sharing
export interface EncodedQuiz {
  t: string; // targetName
  c: string; // creatorName
  q: Array<{
    q: string; // question
    o: string[]; // options
    a: number; // correctAnswer
  }>;
}

// Quiz result
export interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: number[]; // user's answers
  correctAnswers: number[]; // correct answers
}

// App state
export type AppState =
  | 'idle'
  | 'parsing'
  | 'selectTarget'
  | 'tierSelection'
  | 'generating'
  | 'editing'
  | 'sharing'
  | 'solving'
  | 'result'
  | 'error';

// Analysis tier
export type AnalysisTier = 'free' | 'premium';

// Tier configuration
export interface TierInfo {
  tier: AnalysisTier;
  name: string;
  questionCount: number;
  model: string;
  features: string[];
  price: number | null;
}

export const TIER_INFO: Record<AnalysisTier, TierInfo> = {
  free: {
    tier: 'free',
    name: '무료 모의고사',
    questionCount: 5,
    model: 'GPT-3.5',
    features: ['5문제 생성', '기본 문제 유형', '카카오톡 공유'],
    price: null,
  },
  premium: {
    tier: 'premium',
    name: '프리미엄 모의고사',
    questionCount: 10,
    model: 'GPT-4 Turbo',
    features: ['10문제 생성', '심층 분석 문제', '맞춤형 해설', '카카오톡 공유'],
    price: 2900,
  },
};
