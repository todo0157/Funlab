import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CharacterTraits } from '../../types/character';

interface TraitRadarChartProps {
  userTraits: CharacterTraits;
  characterTraits: CharacterTraits;
  characterName: string;
  userName?: string;
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

export function TraitRadarChart({
  userTraits,
  characterTraits,
  characterName,
  userName = '나',
}: TraitRadarChartProps) {
  const data = Object.keys(traitLabels).map(key => ({
    trait: traitLabels[key as keyof CharacterTraits],
    user: userTraits[key as keyof CharacterTraits],
    character: characterTraits[key as keyof CharacterTraits],
  }));

  return (
    <div className="w-full h-[300px] sm:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
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
            name={userName}
            dataKey="user"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name={characterName}
            dataKey="character"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
