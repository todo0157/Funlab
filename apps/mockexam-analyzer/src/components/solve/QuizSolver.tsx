import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizData, QuizResult } from '../../types/mockexam';
import { calculateScore } from '../../services/quizService';

interface QuizSolverProps {
  quizData: QuizData;
  onComplete: (result: QuizResult) => void;
}

export function QuizSolver({ quizData, onComplete }: QuizSolverProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quizData.questions.length).fill(-1));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = quizData.questions[currentIndex];
  const isLastQuestion = currentIndex === quizData.questions.length - 1;
  const progress = ((currentIndex + 1) / quizData.questions.length) * 100;

  const handleSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOption;
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Complete quiz
      const correctAnswers = quizData.questions.map(q => q.correctAnswer);
      const score = calculateScore(newAnswers, correctAnswers);
      onComplete({
        score,
        totalQuestions: quizData.questions.length,
        answers: newAnswers,
        correctAnswers,
      });
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          <span className="text-pink-500">{quizData.targetName}</span> 모의고사
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {quizData.creatorName}님이 만든 퀴즈
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>문제 {currentIndex + 1} / {quizData.questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          {/* Question number */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-full font-bold text-sm">
              Q{currentIndex + 1}
            </span>
          </div>

          {/* Question text */}
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            {currentQuestion.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedOption === index
                    ? 'bg-pink-100 dark:bg-pink-900/30 border-2 border-pink-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-pink-300 dark:hover:border-pink-700'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm ${
                    selectedOption === index
                      ? 'border-pink-500 bg-pink-500 text-white'
                      : 'border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`${
                    selectedOption === index
                      ? 'text-pink-700 dark:text-pink-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {option}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <motion.button
        onClick={handleNext}
        disabled={selectedOption === null}
        className={`w-full mt-6 py-4 rounded-xl font-bold transition-all ${
          selectedOption === null
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-lg'
        }`}
        whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
        whileTap={selectedOption !== null ? { scale: 0.98 } : {}}
      >
        {isLastQuestion ? '결과 보기' : '다음 문제'}
      </motion.button>
    </div>
  );
}
