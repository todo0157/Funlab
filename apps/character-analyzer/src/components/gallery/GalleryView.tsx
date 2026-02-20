import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types/character';
import { characters, getDramaStats } from '../../data/characters';
import { GalleryCard } from './GalleryCard';

interface GalleryViewProps {
  onSelectCharacter: (character: Character) => void;
  onBack: () => void;
}

type PlatformFilter = 'all' | 'netflix' | 'tvn' | 'jtbc' | 'disney' | 'other';

const platformLabels: Record<PlatformFilter, string> = {
  all: '전체',
  netflix: 'Netflix',
  tvn: 'tvN',
  jtbc: 'JTBC',
  disney: 'Disney+',
  other: '기타',
};

export function GalleryView({ onSelectCharacter, onBack }: GalleryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrama, setSelectedDrama] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all');

  const dramaStats = getDramaStats();

  const filteredCharacters = useMemo(() => {
    let filtered = [...characters];

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.drama.toLowerCase().includes(query) ||
          c.keywords.some(k => k.toLowerCase().includes(query))
      );
    }

    // 드라마 필터
    if (selectedDrama) {
      filtered = filtered.filter(c => c.drama === selectedDrama);
    }

    // 플랫폼 필터
    if (selectedPlatform !== 'all') {
      if (selectedPlatform === 'other') {
        filtered = filtered.filter(
          c => !['netflix', 'tvn', 'jtbc', 'disney'].includes(c.platform)
        );
      } else {
        filtered = filtered.filter(c => c.platform === selectedPlatform);
      }
    }

    return filtered;
  }, [searchQuery, selectedDrama, selectedPlatform]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          뒤로
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          캐릭터 도감
        </h1>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="캐릭터, 드라마, 키워드 검색..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Platform filter */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(platformLabels) as PlatformFilter[]).map(platform => (
          <button
            key={platform}
            onClick={() => {
              setSelectedPlatform(platform);
              setSelectedDrama(null);
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedPlatform === platform
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {platformLabels[platform]}
          </button>
        ))}
      </div>

      {/* Drama filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedDrama(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedDrama === null
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          모든 드라마
        </button>
        {dramaStats.map(drama => (
          <button
            key={drama.name}
            onClick={() => setSelectedDrama(drama.name)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedDrama === drama.name
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {drama.name}
            <span className="ml-1 opacity-70">({drama.count})</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filteredCharacters.length}명의 캐릭터
      </p>

      {/* Character grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredCharacters.map((character, index) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <GalleryCard
              character={character}
              onClick={() => onSelectCharacter(character)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* No results */}
      {filteredCharacters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 dark:text-gray-400">
            검색 결과가 없어요
          </p>
        </div>
      )}
    </div>
  );
}
