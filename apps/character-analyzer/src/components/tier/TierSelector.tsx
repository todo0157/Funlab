import { motion } from 'framer-motion';
import type { AnalysisTier } from '../../types/character';
import { TIER_CONFIG } from '../../services/analysisService';

interface TierSelectorProps {
  targetName: string;
  onSelectTier: (tier: AnalysisTier) => void;
  onCancel: () => void;
}

export function TierSelector({ targetName, onSelectTier, onCancel }: TierSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          분석 티어를 선택하세요
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          <span className="font-medium text-red-600 dark:text-red-400">{targetName}</span>님의 캐릭터를 분석합니다
        </p>

        {/* Tier options */}
        <div className="space-y-4">
          {/* Free tier */}
          <motion.button
            onClick={() => onSelectTier('free')}
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-transparent hover:border-red-300 dark:hover:border-red-500 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900 dark:text-white">Free</span>
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                무료
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>- 최대 {TIER_CONFIG.free.maxMessages}개 메시지 분석</p>
              <p>- {TIER_CONFIG.free.model} 모델</p>
              <p>- {TIER_CONFIG.free.description}</p>
            </div>
          </motion.button>

          {/* Premium tier */}
          <motion.button
            onClick={() => onSelectTier('premium')}
            className="w-full p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl hover:from-red-500/20 hover:to-orange-500/20 border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 transition-all text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900 dark:text-white">Premium</span>
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full">
                추천
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>- 최대 {TIER_CONFIG.premium.maxMessages}개 메시지 분석</p>
              <p>- {TIER_CONFIG.premium.model} 모델</p>
              <p>- {TIER_CONFIG.premium.description}</p>
            </div>
          </motion.button>
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="mt-6 w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
        >
          뒤로 가기
        </button>
      </div>
    </motion.div>
  );
}
