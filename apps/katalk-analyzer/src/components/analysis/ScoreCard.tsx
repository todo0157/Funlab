import { motion } from 'framer-motion';
import { TetoAnalysis, AegyoAnalysis } from '../../types/katalk';

interface ScoreCardProps {
  title: string;
  icon: string;
  personName: string;
  analysis: TetoAnalysis | AegyoAnalysis;
  type: 'teto' | 'aegyo';
  delay?: number;
}

const gradeColors: Record<string, string> = {
  S: 'from-yellow-400 to-orange-500',
  A: 'from-green-400 to-emerald-500',
  B: 'from-blue-400 to-indigo-500',
  C: 'from-purple-400 to-violet-500',
  D: 'from-gray-400 to-gray-500',
};

export function ScoreCard({ title, icon, personName, analysis, type, delay = 0 }: ScoreCardProps) {
  const description = type === 'aegyo'
    ? (analysis as AegyoAnalysis).typeDescription
    : (analysis as TetoAnalysis).gradeDescription;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{personName}</span>
      </div>

      {/* Score circle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(analysis.score / 100) * 226} 226`}
              initial={{ strokeDasharray: '0 226' }}
              animate={{ strokeDasharray: `${(analysis.score / 100) * 226} 226` }}
              transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {analysis.score}
            </motion.span>
          </div>
        </div>

        {/* Grade badge */}
        <div className="flex-1">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${
              gradeColors[analysis.grade]
            } text-white text-sm font-bold mb-2`}
          >
            {analysis.grade}등급
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>

      {/* Metrics bars */}
      <div className="space-y-2">
        {Object.entries(analysis.metrics).slice(0, 3).map(([key, value], idx) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 w-20 truncate">
              {getMetricLabel(key)}
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ delay: delay + 0.5 + idx * 0.1, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-right">
              {Math.round(value)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function getMetricLabel(key: string): string {
  const labels: Record<string, string> = {
    leadingPower: '대화 리드력',
    topicChangingAbility: '화제 전환',
    responseVariety: '반응 다양성',
    humorSense: '유머 감각',
    empathyExpression: '공감 표현',
    waveUsage: '물결 사용',
    cuteEmoticonUsage: '이모티콘',
    cuteEndingUsage: '애교 어미',
    onomatopoeiaUsage: '의성어',
    slangUsage: '신조어',
  };
  return labels[key] || key;
}
