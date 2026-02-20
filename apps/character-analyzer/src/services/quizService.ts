import type { CharacterTraits, QuizAnswer, AnalysisResult, ShareData, AnalysisMode } from '../types/character';
import { quizQuestions } from '../data/quizQuestions';
import { characters } from '../data/characters';
import { matchCharacters, generateAnalysisText } from './matchingService';

// 퀴즈 응답으로부터 특성 계산
export function calculateTraitsFromAnswers(answers: QuizAnswer[]): CharacterTraits {
  const traitSums: CharacterTraits = {
    warmth: 0,
    energy: 0,
    directness: 0,
    humor: 0,
    initiative: 0,
    emotion: 0,
    loyalty: 0,
    ambition: 0,
  };

  const traitCounts: CharacterTraits = {
    warmth: 0,
    energy: 0,
    directness: 0,
    humor: 0,
    initiative: 0,
    emotion: 0,
    loyalty: 0,
    ambition: 0,
  };

  for (const answer of answers) {
    const question = quizQuestions.find(q => q.id === answer.questionId);
    if (!question) continue;

    const selectedOption = question.options[answer.selectedIndex];
    if (!selectedOption) continue;

    const traits = selectedOption.traits;
    for (const [key, value] of Object.entries(traits)) {
      const traitKey = key as keyof CharacterTraits;
      if (value !== undefined) {
        traitSums[traitKey] += value;
        traitCounts[traitKey] += 1;
      }
    }
  }

  // 평균 계산
  const result: CharacterTraits = {
    warmth: 50,
    energy: 50,
    directness: 50,
    humor: 50,
    initiative: 50,
    emotion: 50,
    loyalty: 50,
    ambition: 50,
  };

  for (const key of Object.keys(result) as (keyof CharacterTraits)[]) {
    if (traitCounts[key] > 0) {
      result[key] = Math.round(traitSums[key] / traitCounts[key]);
    }
  }

  return result;
}

// 퀴즈 결과 분석
export function analyzeQuizResult(answers: QuizAnswer[]): AnalysisResult {
  const userTraits = calculateTraitsFromAnswers(answers);
  const matches = matchCharacters(userTraits, 5);
  const analysis = generateAnalysisText(userTraits, matches[0]);

  return {
    mode: 'quiz',
    userTraits,
    matches,
    analysis,
    analyzedAt: new Date(),
  };
}

// 캐릭터 ID로 캐릭터 찾기
export function getCharacterById(id: string) {
  return characters.find(c => c.id === id);
}

// URL-safe base64 인코딩
function toUrlSafeBase64(str: string): string {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// URL-safe base64 디코딩
function fromUrlSafeBase64(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

// 결과 공유 URL 생성
export function generateShareUrl(result: AnalysisResult): string {
  const topMatch = result.matches[0];
  const data = {
    c: topMatch.character.id,
    s: topMatch.similarity,
    t: result.userTraits,
    m: result.mode,
    n: result.targetName,
  };

  const encoded = toUrlSafeBase64(JSON.stringify(data));

  const baseUrl = import.meta.env.DEV
    ? 'http://localhost:3010/character/'
    : '/character/';

  return `${baseUrl}?r=${encoded}`;
}

// URL에서 결과 복원
export function parseResultFromUrl(): ShareData | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('r');

  if (!encoded) return null;

  try {
    const jsonStr = fromUrlSafeBase64(encoded);
    const decoded = JSON.parse(jsonStr);

    return {
      characterId: decoded.c,
      similarity: decoded.s,
      traits: decoded.t,
      mode: (decoded.m as AnalysisMode) || 'quiz',
      targetName: decoded.n,
    };
  } catch {
    return null;
  }
}

// 공유 데이터로부터 결과 재구성
export function reconstructResultFromShare(data: ShareData): AnalysisResult | null {
  const character = getCharacterById(data.characterId);
  if (!character) return null;

  const matches = matchCharacters(data.traits, 5);
  const analysis = generateAnalysisText(data.traits, matches[0]);

  return {
    mode: data.mode,
    targetName: data.targetName,
    userTraits: data.traits,
    matches,
    analysis,
    analyzedAt: new Date(),
  };
}

// 카카오톡 공유
export async function shareToKakao(result: AnalysisResult): Promise<void> {
  const topMatch = result.matches[0];
  const shareUrl = generateShareUrl(result);

  const shareData = {
    title: `나와 닮은 드라마 캐릭터: ${topMatch.character.name}`,
    text: `${topMatch.character.drama}의 ${topMatch.character.name}와(과) ${topMatch.similarity}% 닮았어요!`,
    url: shareUrl,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      await copyToClipboard(shareUrl);
    }
  } else {
    await copyToClipboard(shareUrl);
  }
}

// 클립보드에 복사
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    alert('링크가 복사되었어요! 친구에게 공유해보세요!');
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('링크가 복사되었어요! 친구에게 공유해보세요!');
  }
}
