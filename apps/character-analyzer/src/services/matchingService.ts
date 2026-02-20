import type { CharacterTraits, MatchResult } from '../types/character';
import { characters } from '../data/characters';

// 두 특성 간의 유사도 계산 (0-100)
export function calculateSimilarity(
  userTraits: CharacterTraits,
  characterTraits: CharacterTraits
): number {
  const traitKeys: (keyof CharacterTraits)[] = [
    'warmth',
    'energy',
    'directness',
    'humor',
    'initiative',
    'emotion',
    'loyalty',
    'ambition',
  ];

  let totalDifference = 0;
  let weightSum = 0;

  // 가중치 설정 (일부 특성에 더 큰 가중치)
  const weights: Record<keyof CharacterTraits, number> = {
    warmth: 1.2,
    energy: 1.0,
    directness: 1.1,
    humor: 0.9,
    initiative: 1.1,
    emotion: 1.0,
    loyalty: 1.2,
    ambition: 1.0,
  };

  for (const key of traitKeys) {
    const diff = Math.abs(userTraits[key] - characterTraits[key]);
    const weight = weights[key];
    totalDifference += diff * weight;
    weightSum += 100 * weight;
  }

  // 유사도로 변환 (100 - 평균 차이)
  const similarity = Math.round(100 - (totalDifference / weightSum) * 100);
  return Math.max(0, Math.min(100, similarity));
}

// 매칭된 특성 찾기
export function findMatchedTraits(
  userTraits: CharacterTraits,
  characterTraits: CharacterTraits,
  threshold: number = 15
): string[] {
  const traitLabels: Record<keyof CharacterTraits, string> = {
    warmth: '다정함',
    energy: '에너지',
    directness: '솔직함',
    humor: '유머',
    initiative: '주도성',
    emotion: '감정',
    loyalty: '의리',
    ambition: '열정',
  };

  const matched: string[] = [];
  const traitKeys = Object.keys(traitLabels) as (keyof CharacterTraits)[];

  for (const key of traitKeys) {
    const diff = Math.abs(userTraits[key] - characterTraits[key]);
    if (diff <= threshold) {
      matched.push(traitLabels[key]);
    }
  }

  return matched.slice(0, 3); // 상위 3개만 반환
}

// 캐릭터 매칭 (TOP N 반환, 드라마 필터 지원)
export function matchCharacters(
  userTraits: CharacterTraits,
  topN: number = 5,
  dramaFilter?: string
): MatchResult[] {
  // 필터링된 캐릭터 목록
  const filteredCharacters = dramaFilter
    ? characters.filter(c => c.drama === dramaFilter)
    : characters;

  const results: MatchResult[] = filteredCharacters.map(character => ({
    character,
    similarity: calculateSimilarity(userTraits, character.traits),
    matchedTraits: findMatchedTraits(userTraits, character.traits),
  }));

  // 유사도 내림차순 정렬
  results.sort((a, b) => b.similarity - a.similarity);

  return results.slice(0, topN);
}

// 특성 분석 텍스트 생성
export function generateAnalysisText(
  userTraits: CharacterTraits,
  topMatch: MatchResult
): string {
  const traits: string[] = [];

  if (userTraits.warmth >= 70) traits.push('따뜻한 마음');
  else if (userTraits.warmth <= 30) traits.push('냉철한 판단력');

  if (userTraits.energy >= 70) traits.push('넘치는 에너지');
  else if (userTraits.energy <= 30) traits.push('차분한 성격');

  if (userTraits.directness >= 70) traits.push('솔직한 표현');
  else if (userTraits.directness <= 30) traits.push('신중한 표현');

  if (userTraits.initiative >= 70) traits.push('주도적인 성향');
  if (userTraits.loyalty >= 70) traits.push('강한 의리');
  if (userTraits.ambition >= 70) traits.push('목표 지향적');
  if (userTraits.humor >= 70) traits.push('유머 감각');

  const traitText = traits.slice(0, 3).join(', ');

  return `당신은 ${traitText}을 가진 분이시네요! ` +
    `${topMatch.character.drama}의 ${topMatch.character.name}와(과) ${topMatch.similarity}% 유사해요. ` +
    `${topMatch.matchedTraits.join(', ')} 면에서 특히 닮았어요.`;
}
