import { motion } from 'framer-motion';
import { ChatTypeResult as ChatTypeResultType } from '../../types/chattype';
import { CHAT_TYPES } from '../../services/analysisService';

interface ChatTypeResultProps {
  result: ChatTypeResultType;
  onReset: () => void;
}

export function ChatTypeResultComponent({ result, onReset }: ChatTypeResultProps) {
  const { type, scores, details, tips, targetName } = result;
  const bestMatchType = CHAT_TYPES[type.bestMatch];
  const worstMatchType = CHAT_TYPES[type.worstMatch];

  const handleShare = async () => {
    const shareText = `${targetName}님의 카톡 말투 유형은 "${type.emoji} ${type.title}"! ${type.description}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '카톡 말투 유형 테스트 결과',
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
      {/* Type Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br ${type.gradient} rounded-2xl p-8 shadow-lg text-white text-center`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-7xl mb-4"
        >
          {type.emoji}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/80 text-sm mb-2">{targetName}님의 말투 유형</p>
          <h2 className="text-3xl font-bold mb-3">{type.title}</h2>
          <p className="text-white/90 leading-relaxed">{type.description}</p>
        </motion.div>

        {/* Characteristics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mt-6"
        >
          {type.characteristics.map((char, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
            >
              #{char}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Score Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span>
          말투 분석 점수
        </h3>
        <div className="space-y-4">
          {[
            { label: '답장 속도', value: scores.responseSpeed, color: 'fuchsia' },
            { label: '메시지 길이', value: scores.messageLength, color: 'purple' },
            { label: '감정 표현', value: scores.emotionExpression, color: 'pink' },
            { label: '활동 시간대', value: scores.activityTime, color: 'violet' },
            { label: '대화 스타일', value: scores.conversationStyle, color: 'indigo' },
          ].map((metric, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{metric.value}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                  className={`h-full bg-${metric.color}-500 rounded-full`}
                  style={{ backgroundColor: `var(--tw-gradient-from, #d946ef)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Details */}
      {details.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🔍</span>
            상세 분석
          </h3>
          <div className="space-y-4">
            {details.map((detail, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {detail.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Compatibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-xl">💕</span>
          궁합 유형
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">찰떡궁합</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{bestMatchType.emoji}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{bestMatchType.title}</span>
            </div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-2">상극유형</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{worstMatchType.emoji}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{worstMatchType.title}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      {tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span>
            소통 꿀팁
          </h3>
          <ul className="space-y-2">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-fuchsia-500 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={handleShare}
          className="flex-1 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold rounded-xl hover:from-fuchsia-600 hover:to-purple-600 transition-all shadow-lg"
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
