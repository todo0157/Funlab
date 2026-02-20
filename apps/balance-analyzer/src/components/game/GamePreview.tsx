import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BalanceGameData } from '../../types/balance';
import { getDifficultyEmoji, getCategoryEmoji } from '../../services/analysisService';

interface GamePreviewProps {
  gameData: BalanceGameData;
  onShare: () => void;
  onPlay: () => void;
  onReset: () => void;
}

export function GamePreview({ gameData, onShare, onPlay, onReset }: GamePreviewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          밸런스게임이 완성되었어요!
        </h2>
        <p className="text-gray-600">
          <span className="font-semibold text-amber-600">{gameData.targetName}</span>님의
          취향 밸런스게임 {gameData.questions.length}문제
        </p>
      </div>

      {/* 질문 미리보기 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📝</span> 질문 미리보기
        </h3>
        <div className="space-y-3">
          {gameData.questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCategoryEmoji(q.category)}</span>
                    <span className="font-medium text-gray-800">Q{index + 1}. {q.question}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getDifficultyEmoji(q.difficulty)}</span>
                    <span className="text-gray-400">{expandedIndex === index ? '▲' : '▼'}</span>
                  </div>
                </div>
              </button>

              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="px-4 pb-4 bg-gray-50"
                >
                  <div className="flex gap-4 pt-2">
                    <div className="flex-1 p-3 bg-amber-100 rounded-lg text-center">
                      <span className="text-amber-700 font-medium">A. {q.optionA}</span>
                    </div>
                    <div className="flex-1 p-3 bg-orange-100 rounded-lg text-center">
                      <span className="text-orange-700 font-medium">B. {q.optionB}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-500 italic">
                    💬 근거: "{q.evidence}"
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShare}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white
                     rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          🔗 링크 공유하기
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlay}
          className="w-full py-4 bg-white text-amber-600 border-2 border-amber-500
                     rounded-xl font-bold text-lg hover:bg-amber-50 transition-colors"
        >
          🎮 직접 풀어보기
        </motion.button>

        <button
          onClick={onReset}
          className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          처음으로 돌아가기
        </button>
      </div>
    </motion.div>
  );
}
