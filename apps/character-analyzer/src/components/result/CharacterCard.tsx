import { motion } from 'framer-motion';
import type { MatchResult } from '../../types/character';

interface CharacterCardProps {
  match: MatchResult;
  rank: number;
  isTop?: boolean;
}

export function CharacterCard({ match, rank, isTop = false }: CharacterCardProps) {
  const { character, similarity, matchedTraits } = match;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`
        relative overflow-hidden rounded-2xl border-2 transition-all
        ${isTop
          ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-300 dark:border-red-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
      `}
    >
      {/* Rank badge */}
      <div
        className={`
          absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-bold
          ${rank === 1
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
            : rank === 2
              ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
              : rank === 3
                ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }
        `}
      >
        {rank}
      </div>

      <div className="p-6">
        {/* Character info */}
        <div className="flex items-start space-x-4 mb-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${character.color}20` }}
          >
            {character.emoji}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {character.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {character.drama} ({character.year})
            </p>
          </div>
        </div>

        {/* Similarity score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">유사도</span>
            <span className={`text-lg font-bold ${isTop ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
              {similarity}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${similarity}%` }}
              transition={{ duration: 0.8, delay: rank * 0.1 }}
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {character.description}
        </p>

        {/* Matched traits */}
        {matchedTraits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {matchedTraits.map((trait, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
              >
                {trait}
              </span>
            ))}
          </div>
        )}

        {/* Quote (only for top match) */}
        {isTop && character.quotes[0] && (
          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              "{character.quotes[0]}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
