import type { CharacterTraits, AnalysisResult, AnalysisTier } from '../types/character';
import { matchCharacters, generateAnalysisText } from './matchingService';

const API_URL = import.meta.env.DEV ? 'http://localhost:8787' : '';

interface AnalyzeCharacterRequest {
  tier: AnalysisTier;
  targetName: string;
  messages: string;
  stats: string;
}

interface AnalyzeCharacterResponse {
  targetName: string;
  traits: CharacterTraits;
  analysis: string;
}

export async function analyzeCharacter(
  request: AnalyzeCharacterRequest
): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/api/analyze-character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '분석 중 오류가 발생했어요' }));
    throw new Error(error.error || error.message || '분석 중 오류가 발생했어요');
  }

  const data: AnalyzeCharacterResponse = await response.json();

  // Get character matches based on traits
  const matches = matchCharacters(data.traits);

  // Generate analysis text
  const analysisText = matches.length > 0
    ? generateAnalysisText(data.traits, matches[0])
    : data.analysis;

  return {
    mode: 'chat',
    targetName: data.targetName,
    userTraits: data.traits,
    matches,
    analysis: analysisText,
    analyzedAt: new Date(),
  };
}

// Tier configuration
export const TIER_CONFIG = {
  free: {
    maxMessages: 300,
    model: 'GPT-3.5',
    description: '빠른 분석',
  },
  premium: {
    maxMessages: 1000,
    model: 'GPT-4 Turbo',
    description: '정밀 분석',
  },
} as const;
