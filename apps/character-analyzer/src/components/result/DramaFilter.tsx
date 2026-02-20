import { motion } from 'framer-motion';
import { getDramaStats } from '../../data/characters';

interface DramaFilterProps {
  selectedDrama: string | null;
  onSelectDrama: (drama: string | null) => void;
}

export function DramaFilter({ selectedDrama, onSelectDrama }: DramaFilterProps) {
  const dramaStats = getDramaStats();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
        특정 드라마 캐릭터만 보기
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* 전체 보기 버튼 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectDrama(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedDrama === null
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          전체
        </motion.button>

        {/* 드라마별 필터 버튼 */}
        {dramaStats.map(drama => (
          <motion.button
            key={drama.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectDrama(drama.name)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedDrama === drama.name
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {drama.name}
            <span className="ml-1 text-xs opacity-70">({drama.count})</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
