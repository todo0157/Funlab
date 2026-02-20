import { motion } from 'framer-motion';
import { AnalysisTier } from '../../types/greenlight';

interface TierSelectorProps {
  targetName: string;
  onSelectTier: (tier: AnalysisTier) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function TierSelector({ targetName, onSelectTier, onCancel, isLoading }: TierSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          <span className="text-green-500">{targetName}</span>님의 그린라이트 분석
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          분석 티어를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Free tier */}
        <motion.button
          onClick={() => onSelectTier('free')}
          disabled={isLoading}
          className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all text-left shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🆓</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">무료 분석</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">GPT-3.5 Turbo</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              최근 500개 메시지 분석
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              그린라이트/레드플래그 TOP 3
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              종합 판독 결과
            </li>
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-lg font-bold text-green-500">무료</span>
          </div>
        </motion.button>

        {/* Premium tier */}
        <motion.button
          onClick={() => onSelectTier('premium')}
          disabled={isLoading}
          className="relative p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-left shadow-lg overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold text-white">
              추천
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👑</span>
            <div>
              <h3 className="font-bold text-white">프리미엄 분석</h3>
              <p className="text-xs text-green-100">GPT-4 Turbo</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-green-50">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              최근 3000개 메시지 분석
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              그린라이트/레드플래그 TOP 5
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              상세한 근거와 조언
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              더 정확한 AI 분석
            </li>
          </ul>

          <div className="mt-4 pt-4 border-t border-white/20">
            <span className="text-lg font-bold text-white">프리미엄</span>
          </div>
        </motion.button>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          다른 대상 선택하기
        </button>
      </div>
    </motion.div>
  );
}
