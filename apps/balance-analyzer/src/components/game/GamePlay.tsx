import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BalanceGameData, GameResult } from '../../types/balance';
import { getDifficultyEmoji, getCategoryEmoji } from '../../services/analysisService';

interface GamePlayProps {
  gameData: BalanceGameData;
  onComplete: (result: GameResult) => void;
}

export function GamePlay({ gameData, onComplete }: GamePlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; userAnswer: 'A' | 'B' }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<'A' | 'B' | null>(null);

  const currentQuestion = gameData.questions[currentIndex];
  const progress = ((currentIndex) / gameData.questions.length) * 100;

  const handleAnswer = (answer: 'A' | 'B') => {
    setLastAnswer(answer);
    setShowFeedback(true);

    const newAnswers = [...answers, { questionId: currentQuestion.id, userAnswer: answer }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setShowFeedback(false);
      setLastAnswer(null);

      if (currentIndex < gameData.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // 게임 종료
        const result: GameResult = {
          totalQuestions: gameData.questions.length,
          correctAnswers: 0,
          wrongAnswers: 0,
          score: 0,
          answers: newAnswers.map((a) => {
            const question = gameData.questions.find((q) => q.id === a.questionId)!;
            const isCorrect = a.userAnswer === question.answer;
            return {
              ...a,
              correctAnswer: question.answer,
              isCorrect,
            };
          }),
        };
        result.correctAnswers = result.answers.filter((a) => a.isCorrect).length;
        result.wrongAnswers = result.answers.filter((a) => !a.isCorrect).length;
        result.score = Math.round((result.correctAnswers / result.totalQuestions) * 100);
        onComplete(result);
      }
    }, 1500);
  };

  const isCorrect = lastAnswer === currentQuestion.answer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto"
    >
      {/* 진행 상황 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{currentIndex + 1} / {gameData.questions.length}</span>
          <span>{gameData.targetName}님의 취향</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 질문 카드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* 카테고리/난이도 헤더 */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <span className="text-xl">{getCategoryEmoji(currentQuestion.category)}</span>
              <span className="font-medium">{currentQuestion.category}</span>
            </div>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              {getDifficultyEmoji(currentQuestion.difficulty)}
              <span>
                {currentQuestion.difficulty === 'easy' ? '쉬움' :
                 currentQuestion.difficulty === 'medium' ? '보통' : '어려움'}
              </span>
            </div>
          </div>

          {/* 질문 */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-8">
              {currentQuestion.question}
            </h2>

            {/* 선택지 */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                onClick={() => !showFeedback && handleAnswer('A')}
                disabled={showFeedback}
                className={`w-full p-5 rounded-xl font-medium text-lg transition-all
                  ${showFeedback && lastAnswer === 'A'
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : showFeedback && currentQuestion.answer === 'A'
                    ? 'bg-green-500 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
              >
                A. {currentQuestion.optionA}
              </motion.button>

              <motion.button
                whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                onClick={() => !showFeedback && handleAnswer('B')}
                disabled={showFeedback}
                className={`w-full p-5 rounded-xl font-medium text-lg transition-all
                  ${showFeedback && lastAnswer === 'B'
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : showFeedback && currentQuestion.answer === 'B'
                    ? 'bg-green-500 text-white'
                    : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  }`}
              >
                B. {currentQuestion.optionB}
              </motion.button>
            </div>

            {/* 피드백 */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 text-center"
                >
                  <p className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '🎉 정답!' : '😅 아쉬워요!'}
                  </p>
                  <p className="text-gray-600 mt-2 text-sm">
                    💬 "{currentQuestion.evidence}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
