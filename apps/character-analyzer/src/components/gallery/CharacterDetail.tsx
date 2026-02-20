import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import type { Character, CharacterTraits } from '../../types/character';

interface CharacterDetailProps {
  character: Character;
  onBack: () => void;
  onStartQuiz: () => void;
}

const traitLabels: Record<keyof CharacterTraits, string> = {
  warmth: '다정함',
  energy: '에너지',
  directness: '솔직함',
  humor: '유머',
  initiative: '주도성',
  emotion: '감정',
  loyalty: '의리',
  ambition: '야망',
};

export function CharacterDetail({ character, onBack, onStartQuiz }: CharacterDetailProps) {
  const traitData = Object.keys(traitLabels).map(key => ({
    trait: traitLabels[key as keyof CharacterTraits],
    value: character.traits[key as keyof CharacterTraits],
  }));

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
          도감으로
        </button>
        <div className="w-16" />
      </div>

      {/* Character card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
        style={{ borderColor: `${character.color}40` }}
      >
        <div className="text-center">
          {/* Emoji */}
          <div
            className="inline-flex w-24 h-24 rounded-2xl items-center justify-center text-6xl mb-4"
            style={{ backgroundColor: `${character.color}20` }}
          >
            {character.emoji}
          </div>

          {/* Name & Drama */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {character.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {character.drama} ({character.year})
          </p>

          {/* Platform badge */}
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${character.color}20`, color: character.color }}
          >
            {character.platform.toUpperCase()}
          </span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-2xl border border-red-200 dark:border-red-800"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          캐릭터 소개
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {character.description}
        </p>
      </motion.div>

      {/* Keywords */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {character.keywords.map((keyword, index) => (
          <span
            key={index}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            #{keyword}
          </span>
        ))}
      </motion.div>

      {/* Trait radar chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
          캐릭터 특성
        </h2>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={traitData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="trait"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name={character.name}
                dataKey="value"
                stroke={character.color}
                fill={character.color}
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quotes */}
      {character.quotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            대표 대사
          </h2>
          <div className="space-y-3">
            {character.quotes.map((quote, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{quote}"
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <button
          onClick={onStartQuiz}
          className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          이 캐릭터와 나 비교하기
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          도감으로 돌아가기
        </button>
      </motion.div>
    </div>
  );
}
