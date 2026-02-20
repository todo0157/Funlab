export type TierType = 'free' | 'premium';

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
  date?: string;
}

export interface ParsedChat {
  messages: ChatMessage[];
  participants: string[];
}

export interface BalanceQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  answer: 'A' | 'B';
  evidence: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface BalanceGameData {
  targetName: string;
  questions: BalanceQuestion[];
  creatorName: string;
  createdAt: string;
}

export interface GameResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  answers: {
    questionId: string;
    userAnswer: 'A' | 'B';
    correctAnswer: 'A' | 'B';
    isCorrect: boolean;
  }[];
}

export interface PreferenceInsight {
  category: string;
  preferences: string[];
  examples: string[];
}

export interface AnalysisState {
  step: 'upload' | 'select-target' | 'select-tier' | 'analyzing' | 'preview' | 'share' | 'play' | 'result';
  parsedChat: ParsedChat | null;
  selectedTarget: string | null;
  tier: TierType;
  gameData: BalanceGameData | null;
  gameResult: GameResult | null;
  error: string | null;
}
