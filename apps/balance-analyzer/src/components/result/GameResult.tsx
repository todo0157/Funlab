import { motion } from 'framer-motion';
import type { BalanceGameData, GameResult as GameResultType } from '../../types/balance';
import { getScoreGrade, getShareUrl } from '../../services/analysisService';

interface GameResultProps {
  gameData: BalanceGameData;
  result: GameResultType;
  onReplay: () => void;
  onReset: () => void;
}

export function GameResult({ gameData, result, onReplay, onReset }: GameResultProps) {
  const grade = getScoreGrade(result.score);

  const handleCopyLink = () => {
    const shareUrl = getShareUrl(gameData);
    navigator.clipboard.writeText(shareUrl);
    alert('링크가 복사되었습니다!');
  };

  const handleShareResult = () => {
    const text = `${gameData.targetName}님의 밸런스게임에서 ${result.score}점을 받았어요! ${grade.emoji}\n` +
                 `${result.correctAnswers}/${result.totalQuestions} 정답\n` +
                 `내 등급: ${grade.grade}급 - ${grade.message}`;

    if (navigator.share) {
      navigator.share({
        title: '밸런스게임 결과',
        text,
        url: getShareUrl(gameData),
      });
    } else {
      navigator.clipboard.writeText(text + '\n' + getShareUrl(gameData));
      alert('결과가 복사되었습니다!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      {/* 결과 카드 */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 text-white text-center shadow-xl mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
          className="text-8xl mb-4"
        >
          {grade.emoji}
        </motion.div>

        <h2 className="text-3xl font-bold mb-2">{grade.grade}급</h2>
        <p className="text-white/90 text-lg mb-4">{grade.message}</p>

        <div className="bg-white/20 rounded-2xl p-4 mb-4">
          <div className="text-5xl font-bold mb-1">{result.score}점</div>
          <p className="text-white/80">
            {result.totalQuestions}문제 중 {result.correctAnswers}개 정답
          </p>
        </div>

        <p className="text-white/80">
          {gameData.targetName}님의 취향을 {result.score >= 50 ? '잘 알고 계시네요!' : '더 알아가보세요!'}
        </p>
      </motion.div>

      {/* 문제별 결과 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">📊 문제별 결과</h3>
        <div className="space-y-2">
          {result.answers.map((answer, index) => {
            const question = gameData.questions.find((q) => q.id === answer.questionId)!;
            return (
              <motion.div
                key={answer.questionId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg flex items-center justify-between
                  ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {answer.isCorrect ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-700 text-sm">{question.question}</span>
                </div>
                <div className="text-right text-sm">
                  <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {answer.userAnswer === 'A' ? question.optionA : question.optionB}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShareResult}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white
                     rounded-xl font-bold text-lg shadow-lg"
        >
          🎉 결과 공유하기
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyLink}
          className="w-full py-4 bg-white text-amber-600 border-2 border-amber-500
                     rounded-xl font-bold hover:bg-amber-50"
        >
          🔗 게임 링크 복사
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReplay}
          className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
        >
          🔄 다시 풀기
        </motion.button>

        <button
          onClick={onReset}
          className="w-full py-3 text-gray-500 hover:text-gray-700"
        >
          새 밸런스게임 만들기
        </button>
      </div>
    </motion.div>
  );
}
