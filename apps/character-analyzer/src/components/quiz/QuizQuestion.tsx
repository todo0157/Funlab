import { motion } from 'framer-motion';
import type { QuizQuestion as QuizQuestionType } from '../../types/character';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (selectedIndex: number) => void;
  onBack?: () => void;
  questionNumber: number;
  canGoBack?: boolean;
}

export function QuizQuestion({ question, onAnswer, onBack, questionNumber, canGoBack = false }: QuizQuestionProps) {
  const categoryEmojis: Record<string, string> = {
    communication: '💬',
    energy: '⚡',
    relationship: '💕',
    values: '💎',
  };

  const categoryLabels: Record<string, string> = {
    communication: '대화 스타일',
    energy: '에너지',
    relationship: '관계',
    values: '가치관',
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Category badge */}
      <div className="flex items-center justify-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
          {categoryEmojis[question.category]} {categoryLabels[question.category]}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white">
        Q{questionNumber}. {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onAnswer(index)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-4 text-left bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <div className="flex items-center space-x-3">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-gray-800 dark:text-gray-200">{option.text}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Back button */}
      {canGoBack && onBack && (
        <div className="pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mx-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 문항으로
          </button>
        </div>
      )}
    </motion.div>
  );
}
