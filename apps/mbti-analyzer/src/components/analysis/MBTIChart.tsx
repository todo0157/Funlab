import { motion } from 'framer-motion';
import { MBTIAxis } from '../../types/mbti';

interface MBTIChartProps {
  axes: MBTIAxis[];
  mbtiType: string;
  delay?: number;
}

export function MBTIChart({ axes, mbtiType, delay = 0 }: MBTIChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
    >
      {/* MBTI Type Badge */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl"
        >
          <span className="text-3xl font-bold text-white tracking-wider">{mbtiType}</span>
        </motion.div>
      </div>

      {/* MBTI Axes */}
      <div className="space-y-4">
        {axes.map((axis, index) => (
          <motion.div
            key={axis.dimension}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3 + index * 0.1, duration: 0.4 }}
            className="space-y-2"
          >
            {/* Labels */}
            <div className="flex justify-between text-sm">
              <span className={`font-medium ${axis.first.score > axis.second.score ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                {axis.first.letter} - {axis.first.label}
              </span>
              <span className={`font-medium ${axis.second.score > axis.first.score ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                {axis.second.label} - {axis.second.letter}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              {/* First side (left) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${axis.first.score}%` }}
                transition={{ delay: delay + 0.4 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-l-full"
              />
              {/* Second side (right) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${axis.second.score}%` }}
                transition={{ delay: delay + 0.4 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-indigo-500 to-indigo-400 rounded-r-full"
              />
              {/* Center marker */}
              <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-400 dark:bg-gray-500 transform -translate-x-1/2" />
            </div>

            {/* Scores */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{axis.first.score}%</span>
              <span>{axis.second.score}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
