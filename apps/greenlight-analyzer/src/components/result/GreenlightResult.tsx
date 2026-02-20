import { motion } from 'framer-motion';
import { GreenlightResult as GreenlightResultType, SignalItem } from '../../types/greenlight';
import { getVerdictInfo } from '../../services/analysisService';

interface GreenlightResultProps {
  result: GreenlightResultType;
  onReset: () => void;
}

function SignalCard({ signal, index }: { signal: SignalItem; index: number }) {
  const isGreenlight = signal.type === 'greenlight';

  return (
    <motion.div
      initial={{ opacity: 0, x: isGreenlight ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className={`p-4 rounded-xl ${
        isGreenlight
          ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
          : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">
          {isGreenlight ? '💚' : '🚩'}
        </span>
        <div className="flex-1">
          <h4 className={`font-semibold ${
            isGreenlight
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            {signal.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {signal.description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
            "{signal.evidence}"
          </p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < signal.severity
                  ? isGreenlight
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function GreenlightResultComponent({ result, onReset }: GreenlightResultProps) {
  const verdictInfo = getVerdictInfo(result.verdict);

  const handleShare = async () => {
    const shareText = `${result.targetName}님의 그린라이트 판독 결과: ${result.overallScore}점! ${verdictInfo.emoji} ${result.verdictMessage}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '그린라이트 판독기 결과',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('결과가 복사되었어요!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className={`inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br ${verdictInfo.gradient} text-white mb-4`}
        >
          <span className="text-5xl">{verdictInfo.emoji}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {result.overallScore}점
          </h2>
          <p className={`text-lg font-semibold ${verdictInfo.color} mb-2`}>
            {result.verdictMessage}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{result.targetName}</span>님의 그린라이트 점수
          </p>
        </motion.div>

        {/* Score bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full relative">
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: `${result.overallScore}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center"
            >
              <div className="w-3 h-3 rounded-full bg-gray-800" />
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>레드플래그</span>
            <span>그린라이트</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Green Lights */}
      {result.greenlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💚</span>
            그린라이트 신호
          </h3>
          <div className="space-y-3">
            {result.greenlights.map((signal, idx) => (
              <SignalCard key={idx} signal={signal} index={idx} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Red Flags */}
      {result.redflags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🚩</span>
            레드플래그 신호
          </h3>
          <div className="space-y-3">
            {result.redflags.map((signal, idx) => (
              <SignalCard key={idx} signal={signal} index={idx} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Advice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          AI의 조언
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {result.advice}
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={handleShare}
          className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
        >
          결과 공유하기
        </button>
        <button
          onClick={onReset}
          className="py-4 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          다시 분석하기
        </button>
      </motion.div>
    </motion.div>
  );
}
