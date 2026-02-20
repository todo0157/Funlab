import { motion } from 'framer-motion';
import type { TierType } from '../../types/balance';

interface TierSelectorProps {
  targetName: string;
  onSelect: (tier: TierType) => void;
  onBack: () => void;
}

export function TierSelector({ targetName, onSelect, onBack }: TierSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          분석 옵션을 선택하세요
        </h2>
        <p className="text-gray-600">
          <span className="font-semibold text-amber-600">{targetName}</span>님의 밸런스게임을 만듭니다
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Tier */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => onSelect('free')}
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg border-2 border-gray-200
                     hover:border-amber-400 transition-all text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-bl-lg">
            FREE
          </div>
          <div className="mb-4">
            <span className="text-4xl">🎮</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">무료 분석</h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              밸런스게임 5문제 생성
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              최근 메시지 200개 분석
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              기본 카테고리 질문
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-amber-600 font-semibold group-hover:underline">
              무료로 시작하기 →
            </span>
          </div>
        </motion.button>

        {/* Premium Tier */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onSelect('premium')}
          className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-md
                     hover:shadow-lg border-2 border-amber-300 hover:border-amber-500
                     transition-all text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500
                          text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            PREMIUM
          </div>
          <div className="mb-4">
            <span className="text-4xl">👑</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">프리미엄 분석</h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-amber-500">★</span>
              밸런스게임 10문제 생성
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">★</span>
              전체 대화 500개 분석
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">★</span>
              맞춤형 심층 질문
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">★</span>
              난이도별 분류
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-amber-200">
            <span className="text-amber-600 font-semibold group-hover:underline">
              프리미엄으로 시작하기 →
            </span>
          </div>
        </motion.button>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onBack}
        className="mt-8 w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
      >
        ← 다른 대상 선택하기
      </motion.button>
    </motion.div>
  );
}
