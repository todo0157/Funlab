import { motion } from 'framer-motion';
import type { Character } from '../../types/character';

interface GalleryCardProps {
  character: Character;
  onClick: () => void;
}

export function GalleryCard({ character, onClick }: GalleryCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-colors"
    >
      <div className="flex items-start space-x-4">
        {/* Emoji */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: `${character.color}20` }}
        >
          {character.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white truncate">
            {character.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {character.drama}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-1 mt-2">
            {character.keywords.slice(0, 2).map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.button>
  );
}
