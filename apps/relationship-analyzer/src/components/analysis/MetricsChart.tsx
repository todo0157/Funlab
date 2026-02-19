import { motion } from 'framer-motion';
import { ParticipantRelationship } from '../../types/relationship';

interface MetricsChartProps {
  participants: ParticipantRelationship[];
  delay?: number;
}

const METRIC_LABELS: Record<string, { label: string; icon: string }> = {
  responseSpeed: { label: '응답 속도', icon: '⚡' },
  conversationBalance: { label: '대화 균형', icon: '⚖️' },
  emotionalSupport: { label: '정서적 지지', icon: '💝' },
  sharedInterests: { label: '공통 관심사', icon: '🎯' },
  communicationQuality: { label: '소통 품질', icon: '💬' },
};

export function MetricsChart({ participants, delay = 0 }: MetricsChartProps) {
  const metricKeys = Object.keys(METRIC_LABELS) as Array<keyof typeof METRIC_LABELS>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span>📊</span> 관계 지표 분석
      </h3>

      <div className="space-y-4">
        {metricKeys.map((key, index) => {
          const { label, icon } = METRIC_LABELS[key];
          // Calculate average if multiple participants
          const avgScore = participants.reduce((sum, p) => sum + (p.metrics[key as keyof typeof p.metrics] || 0), 0) / participants.length;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.1 * index, duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>{icon}</span>
                  {label}
                </span>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {Math.round(avgScore)}점
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${avgScore}%` }}
                  transition={{ delay: delay + 0.2 + 0.1 * index, duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Per-participant breakdown */}
      {participants.length > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">참여자별 특성</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {participants.map((participant, idx) => (
              <div
                key={participant.name}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {participant.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {participant.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {participant.characteristics.map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded-full text-xs"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
