import { motion } from 'framer-motion';
import { RelationshipScore } from '../../types/relationship';

interface RelationshipGaugeProps {
  score: RelationshipScore;
}

const GRADE_COLORS = {
  S: 'from-yellow-400 to-amber-500',
  A: 'from-teal-400 to-cyan-500',
  B: 'from-blue-400 to-indigo-500',
  C: 'from-purple-400 to-pink-500',
  D: 'from-gray-400 to-gray-500',
};

const GRADE_LABELS = {
  S: '최고의 케미',
  A: '좋은 관계',
  B: '괜찮은 관계',
  C: '발전 가능',
  D: '노력 필요',
};

export function RelationshipGauge({ score }: RelationshipGaugeProps) {
  const { overallScore, grade, relationshipType, typeDescription } = score;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="text-center">
        {/* Score Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 283' }}
              animate={{ strokeDasharray: `${(overallScore / 100) * 283} 283` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-5xl font-bold text-gray-900 dark:text-white"
            >
              {overallScore}
            </motion.span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/ 100</span>
          </div>
        </div>

        {/* Grade Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${GRADE_COLORS[grade]} text-white mb-4`}
        >
          <span className="text-2xl font-bold">{grade}</span>
          <span className="text-sm font-medium">{GRADE_LABELS[grade]}</span>
        </motion.div>

        {/* Relationship Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {relationshipType}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {typeDescription}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
