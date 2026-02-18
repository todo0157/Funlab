import { motion } from 'framer-motion';
import { LoveAnalysis } from '../../types/katalk';

interface LoveGaugeProps {
  analysis: LoveAnalysis;
}

export function LoveGauge({ analysis }: LoveGaugeProps) {
  const { overallScore, personAName, personBName, winner, interpretation } = analysis;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
        <span className="text-2xl">💕</span> 호감도 분석 결과
      </h2>

      {/* Main gauge */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {personAName}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {personBName}
          </span>
        </div>

        {/* Gauge bar */}
        <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${overallScore.personA}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-l-full"
          />
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${overallScore.personB}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-500 to-indigo-500 rounded-r-full"
          />

          {/* Center divider */}
          <div className="absolute left-1/2 top-0 w-1 h-full bg-white dark:bg-gray-800 transform -translate-x-1/2 z-10" />
        </div>

        {/* Percentage labels */}
        <div className="flex justify-between mt-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-pink-500"
          >
            {overallScore.personA}%
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-blue-500"
          >
            {overallScore.personB}%
          </motion.span>
        </div>
      </div>

      {/* Winner announcement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center p-4 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 rounded-xl mb-6"
      >
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          <span className="text-2xl mr-2">✨</span>
          <span className="gradient-text">{winner}</span>님이 더 좋아하는 것 같아요!
        </p>
      </motion.div>

      {/* Interpretation */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {interpretation}
        </p>
      </div>
    </div>
  );
}
