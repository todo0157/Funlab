import { motion } from 'framer-motion';
import { ParsedChat, AnalysisTier, TIER_INFO } from '../../types/katalk';

interface TierSelectorProps {
  parsedChat: ParsedChat;
  onSelectTier: (tier: AnalysisTier) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function TierSelector({ parsedChat, onSelectTier, onCancel, isLoading }: TierSelectorProps) {
  const { participants, totalMessageCount, dateRange, messageCountBySender } = parsedChat;

  const handlePremiumClick = () => {
    // 외부 결제 링크로 이동
    window.open('https://toss.me/funlab/3900', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* 대화 요약 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          대화 분석 준비 완료
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">참여자</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {participants.join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">총 메시지</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {totalMessageCount.toLocaleString()}개
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">기간</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {dateRange.start.toLocaleDateString()} ~ {dateRange.end.toLocaleDateString()}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            {Object.entries(messageCountBySender).map(([name, count]) => (
              <div key={name} className="flex justify-between text-xs mt-1">
                <span className="text-gray-400">{name}</span>
                <span className="text-gray-500">{count.toLocaleString()}개</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 티어 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free 티어 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTier('free')}
          disabled={isLoading}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-500 transition-colors text-left disabled:opacity-50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {TIER_INFO.free.name}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
              무료
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              최대 <span className="font-semibold text-gray-700 dark:text-gray-300">{TIER_INFO.free.maxMessages}개</span> 메시지 분석
            </p>
            <p className="text-xs text-gray-400">
              {TIER_INFO.free.model} 모델 사용
            </p>
          </div>

          <ul className="space-y-1.5">
            {TIER_INFO.free.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-center">
            무료로 시작하기
          </div>
        </motion.button>

        {/* Premium 티어 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg text-left"
        >
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
              PREMIUM
            </span>
          </div>

          <div className="mb-4">
            <span className="text-lg font-bold text-white">
              {TIER_INFO.premium.name}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-white/80">
              최대 <span className="font-semibold text-white">{TIER_INFO.premium.maxMessages.toLocaleString()}개</span> 메시지 분석
            </p>
            <p className="text-xs text-white/60">
              {TIER_INFO.premium.model} 모델 사용
            </p>
          </div>

          <ul className="space-y-1.5">
            {TIER_INFO.premium.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-white/90">
                <svg className="w-4 h-4 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={handlePremiumClick}
            className="mt-6 w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            {TIER_INFO.premium.price?.toLocaleString()}원 결제하기
          </button>

          <p className="mt-2 text-xs text-white/60 text-center">
            토스로 결제 후 이용 가능
          </p>
        </motion.div>
      </div>

      {/* 취소 버튼 */}
      <button
        onClick={onCancel}
        className="mt-6 w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
      >
        다른 파일 선택하기
      </button>
    </motion.div>
  );
}
