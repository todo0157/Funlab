import { motion } from 'framer-motion';
import { MenheraScore } from '../../types/menhera';

interface MenheraRankingProps {
  rankings: MenheraScore[];
  winner: { name: string; score: number; title: string };
}

const gradeColors: Record<string, string> = {
  S: 'from-purple-500 to-pink-500',
  A: 'from-red-500 to-orange-500',
  B: 'from-yellow-500 to-amber-500',
  C: 'from-green-500 to-teal-500',
  D: 'from-blue-500 to-cyan-500',
};

const rankEmojis = ['👑', '🥈', '🥉'];

export function MenheraRanking({ rankings, winner }: MenheraRankingProps) {
  return (
    <div className="space-y-6">
      {/* Winner announcement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center"
      >
        <div className="text-4xl mb-3">😈</div>
        <h2 className="text-2xl font-bold mb-2">
          맨헤라 1위: {winner.name}
        </h2>
        <p className="text-purple-100 mb-3">{winner.title}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
          <span className="text-3xl font-bold">{winner.score}%</span>
          <span className="text-sm">맨헤라력</span>
        </div>
      </motion.div>

      {/* Rankings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📊</span> 전체 순위
        </h3>

        <div className="space-y-4">
          {rankings.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative"
            >
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                {/* Rank */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {index < 3 ? (
                    <span className="text-2xl">{rankEmojis[index]}</span>
                  ) : (
                    <span className="text-lg font-bold text-gray-400">{person.rank}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {person.name}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-bold text-white rounded bg-gradient-to-r ${gradeColors[person.grade]}`}>
                      {person.grade}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {person.title}
                  </p>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {person.score}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${person.score}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${gradeColors[person.grade]}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metrics explanation */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">분석 지표:</p>
        <ul className="grid grid-cols-2 gap-2">
          <li>😤 감정 기복 지수</li>
          <li>🌙 심야 활동 빈도</li>
          <li>😢 부정적 표현 사용률</li>
          <li>👀 관심 요구 패턴</li>
          <li>💔 의존성 표현</li>
        </ul>
      </div>
    </div>
  );
}
