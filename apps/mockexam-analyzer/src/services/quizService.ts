import { ParsedChat, QuizData, QuizQuestion, EncodedQuiz, AnalysisTier } from '../types/mockexam';
import { sampleMessages, formatMessagesForAPI, analyzePersonStats, formatStatsForAPI, extractBehavioralPatterns, formatPatternsForAPI } from './chatParser';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

interface GenerateQuizRequestBody {
  tier: AnalysisTier;
  targetName: string;
  chatData: {
    participants: string[];
    messages: string;
    targetStats: string;
    behavioralPatterns: string;
    metadata: {
      totalMessages: number;
      analyzedMessages: number;
      dateRange: string;
      messageCountBySender: Record<string, number>;
    };
  };
}

// Generate quiz using AI
export async function generateQuiz(
  parsedChat: ParsedChat,
  targetName: string,
  tier: AnalysisTier = 'free'
): Promise<QuizData> {
  const maxMessages = tier === 'free' ? 200 : 500;
  const sampledMessages = sampleMessages(parsedChat, maxMessages);
  const formattedMessages = formatMessagesForAPI(sampledMessages);

  // Analyze target person's statistics
  const targetStats = analyzePersonStats(parsedChat.messages, targetName, parsedChat.messages);
  const formattedStats = formatStatsForAPI(targetStats);

  // Extract behavioral patterns
  const behavioralPatterns = extractBehavioralPatterns(parsedChat.messages, targetName);
  const formattedPatterns = formatPatternsForAPI(behavioralPatterns, targetName);

  const creatorName = parsedChat.participants.find(p => p !== targetName) || '나';

  const requestBody: GenerateQuizRequestBody = {
    tier,
    targetName,
    chatData: {
      participants: parsedChat.participants,
      messages: formattedMessages,
      targetStats: formattedStats,
      behavioralPatterns: formattedPatterns,
      metadata: {
        totalMessages: parsedChat.totalMessageCount,
        analyzedMessages: sampledMessages.length,
        dateRange: `${parsedChat.dateRange.start.toLocaleDateString()} ~ ${parsedChat.dateRange.end.toLocaleDateString()}`,
        messageCountBySender: parsedChat.messageCountBySender,
      },
    },
  };

  const response = await fetch(`${API_BASE_URL}/api/generate-mockexam`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Quiz generation failed: ${response.status}`);
  }

  const result = await response.json();

  // Transform API response to QuizData
  const questions: QuizQuestion[] = result.data.questions.map((q: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }, idx: number) => ({
    id: `q${idx + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  return {
    targetName,
    creatorName,
    questions,
    createdAt: new Date().toISOString(),
    tier,
  };
}

// Encode quiz data for URL sharing
export function encodeQuiz(quizData: QuizData): string {
  const encoded: EncodedQuiz = {
    t: quizData.targetName,
    c: quizData.creatorName,
    q: quizData.questions.map(q => ({
      q: q.question,
      o: q.options,
      a: q.correctAnswer,
    })),
  };

  const jsonStr = JSON.stringify(encoded);
  // Use base64 encoding with URL-safe characters
  const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Decode quiz data from URL
export function decodeQuiz(encodedStr: string): QuizData | null {
  try {
    // Restore base64 padding and characters
    let base64 = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonStr = decodeURIComponent(escape(atob(base64)));
    const decoded: EncodedQuiz = JSON.parse(jsonStr);

    const questions: QuizQuestion[] = decoded.q.map((q, idx) => ({
      id: `q${idx + 1}`,
      question: q.q,
      options: q.o,
      correctAnswer: q.a,
    }));

    return {
      targetName: decoded.t,
      creatorName: decoded.c,
      questions,
      createdAt: new Date().toISOString(),
      tier: questions.length > 5 ? 'premium' : 'free',
    };
  } catch (error) {
    console.error('Failed to decode quiz:', error);
    return null;
  }
}

// Generate share URL
export function generateShareUrl(quizData: QuizData): string {
  const encoded = encodeQuiz(quizData);
  const baseUrl = import.meta.env.DEV
    ? 'http://localhost:3005/mockexam/'
    : 'https://funlab.kr/mockexam/';
  return `${baseUrl}?q=${encoded}`;
}

// Share via KakaoTalk (Web Share API fallback)
export async function shareToKakao(quizData: QuizData): Promise<void> {
  const shareUrl = generateShareUrl(quizData);
  const shareData = {
    title: `${quizData.targetName} 모의고사`,
    text: `${quizData.creatorName}님이 만든 "${quizData.targetName}" 모의고사! 얼마나 잘 알고 있는지 테스트해보세요!`,
    url: shareUrl,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // User cancelled or share failed, copy to clipboard instead
      await copyToClipboard(shareUrl);
    }
  } else {
    await copyToClipboard(shareUrl);
  }
}

// Copy to clipboard
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    alert('링크가 복사되었어요! 카카오톡에 붙여넣기 해주세요.');
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('링크가 복사되었어요! 카카오톡에 붙여넣기 해주세요.');
  }
}

// Calculate quiz score
export function calculateScore(answers: number[], correctAnswers: number[]): number {
  let correct = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === correctAnswers[i]) {
      correct++;
    }
  }
  return correct;
}

// Get score grade
export function getScoreGrade(score: number, total: number): { grade: string; message: string } {
  const percentage = (score / total) * 100;

  if (percentage === 100) {
    return { grade: 'S', message: '완벽해요! 진정한 소울메이트!' };
  } else if (percentage >= 80) {
    return { grade: 'A', message: '대단해요! 정말 잘 알고 있네요!' };
  } else if (percentage >= 60) {
    return { grade: 'B', message: '꽤 잘 알고 있어요!' };
  } else if (percentage >= 40) {
    return { grade: 'C', message: '조금 더 관심을 가져볼까요?' };
  } else {
    return { grade: 'D', message: '아직 알아갈 게 많네요!' };
  }
}
