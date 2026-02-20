import { motion } from 'framer-motion';
import type { AnalysisMode } from '../../types/character';

interface ModeSelectorProps {
  onSelectMode: (mode: AnalysisMode) => void;
}

export function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          분석 방법을 선택하세요
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          카톡 대화 분석 또는 간단한 테스트로 나와 닮은 캐릭터를 찾아보세요!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* 설문 테스트 모드 */}
        <motion.button
          onClick={() => onSelectMode('quiz')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all text-left group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl">
              📝
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">
                성격 테스트
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                12문항 · 약 2분
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            간단한 질문에 답하면 나와 닮은 드라마 캐릭터를 찾아드려요!
          </p>
          <div className="mt-4 flex items-center text-red-500 text-sm font-medium">
            <span>테스트 시작하기</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.button>

        {/* 카톡 분석 모드 */}
        <motion.button
          onClick={() => onSelectMode('chat')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all text-left group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center text-white text-2xl">
              💬
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                카톡 대화 분석
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI 분석 · 더 정확
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            카카오톡 대화 파일을 업로드하면 AI가 대화 스타일을 분석해요!
          </p>
          <div className="mt-4 flex items-center text-orange-500 text-sm font-medium">
            <span>파일 업로드하기</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
