import { motion } from 'framer-motion';
import { QuizData, QuizResult as QuizResultType } from '../../types/mockexam';
import { getScoreGrade } from '../../services/quizService';

interface QuizResultProps {
  quizData: QuizData;
  result: QuizResultType;
  onRetry: () => void;
  onShare: () => void;
}

const GRADE_COLORS = {
  S: 'from-yellow-400 to-amber-500',
  A: 'from-pink-400 to-rose-500',
  B: 'from-blue-400 to-indigo-500',
  C: 'from-purple-400 to-pink-500',
  D: 'from-gray-400 to-gray-500',
};

export function QuizResultComponent({ quizData, result, onRetry }: QuizResultProps) {
  const { grade, message } = getScoreGrade(result.score, result.totalQuestions);
  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  const handleShare = async () => {
    const shareData = {
      title: `${quizData.targetName} 모의고사 결과`,
      text: `${quizData.targetName} 모의고사에서 ${result.totalQuestions}문제 중 ${result.score}문제 맞춤! (${percentage}%) - 나도 도전해보기!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('결과가 복사되었어요!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
        {/* Grade badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${GRADE_COLORS[grade as keyof typeof GRADE_COLORS]} text-white mb-4`}
        >
          <span className="text-4xl font-bold">{grade}</span>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {result.score} / {result.totalQuestions}
          </h2>
          <p className="text-lg text-pink-500 font-medium mb-1">{percentage}%</p>
          <p className="text-gray-500 dark:text-gray-400">{message}</p>
        </motion.div>

        {/* Quiz info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-pink-500">{quizData.targetName}</span>
            {' '}모의고사
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            출제자: {quizData.creatorName}
          </p>
        </motion.div>

        {/* Answer review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-left">
            정답 확인
          </h3>
          {quizData.questions.map((question, idx) => {
            const isCorrect = result.answers[idx] === result.correctAnswers[idx];
            return (
              <div
                key={question.id}
                className={`p-3 rounded-xl text-left text-sm ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`flex-shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? 'O' : 'X'}
                  </span>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Q{idx + 1}. {question.question}
                    </p>
                    <p className="text-xs mt-1">
                      <span className="text-gray-500 dark:text-gray-400">정답: </span>
                      <span className="text-green-600 dark:text-green-400">
                        {question.options[result.correctAnswers[idx]]}
                      </span>
                    </p>
                    {!isCorrect && result.answers[idx] >= 0 && (
                      <p className="text-xs mt-0.5">
                        <span className="text-gray-500 dark:text-gray-400">내 답: </span>
                        <span className="text-red-600 dark:text-red-400">
                          {question.options[result.answers[idx]]}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 space-y-3"
        >
          <button
            onClick={handleShare}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
          >
            결과 공유하기
          </button>
          <button
            onClick={onRetry}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            다시 풀기
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
