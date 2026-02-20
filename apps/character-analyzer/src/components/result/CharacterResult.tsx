import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '../../types/character';
import { CharacterCard } from './CharacterCard';
import { DramaFilter } from './DramaFilter';
import { ShareCard } from './ShareCard';
import { TraitRadarChart } from './TraitRadarChart';
import { shareToKakao, generateShareUrl } from '../../services/quizService';
import { matchCharacters, generateAnalysisText } from '../../services/matchingService';

interface CharacterResultProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function CharacterResult({ result, onReset }: CharacterResultProps) {
  const [selectedDrama, setSelectedDrama] = useState<string | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);

  // 드라마 필터가 적용된 결과 계산
  const filteredResult = useMemo(() => {
    if (!selectedDrama) {
      return {
        matches: result.matches,
        analysis: result.analysis,
      };
    }

    const filteredMatches = matchCharacters(result.userTraits, 5, selectedDrama);
    if (filteredMatches.length === 0) {
      return {
        matches: result.matches,
        analysis: result.analysis,
      };
    }

    const newAnalysis = generateAnalysisText(result.userTraits, filteredMatches[0]);
    return {
      matches: filteredMatches,
      analysis: newAnalysis,
    };
  }, [result, selectedDrama]);

  const topMatch = filteredResult.matches[0];
  const otherMatches = filteredResult.matches.slice(1, 4);

  const handleShare = async () => {
    await shareToKakao(result);
  };

  const handleCopyLink = async () => {
    const url = generateShareUrl(result);
    try {
      await navigator.clipboard.writeText(url);
      alert('링크가 복사되었어요!');
    } catch {
      alert('링크 복사에 실패했어요.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-5xl mb-4 float-animation">{topMatch.character.emoji}</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {result.targetName ? `${result.targetName}님은` : '당신은'}
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
          {topMatch.character.name}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          와(과) <span className="font-bold text-red-500">{topMatch.similarity}%</span> 닮았어요!
        </p>
      </motion.div>

      {/* Top match card */}
      <CharacterCard match={topMatch} rank={1} isTop />

      {/* Trait comparison radar chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
          특성 비교
        </h3>
        <TraitRadarChart
          userTraits={result.userTraits}
          characterTraits={topMatch.character.traits}
          characterName={topMatch.character.name}
          userName={result.targetName || '나'}
        />
      </motion.div>

      {/* Drama filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
      >
        <DramaFilter
          selectedDrama={selectedDrama}
          onSelectDrama={setSelectedDrama}
        />
      </motion.div>

      {/* Analysis text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-2xl border border-red-200 dark:border-red-800"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          AI 분석 결과
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {filteredResult.analysis}
        </p>
      </motion.div>

      {/* Other matches */}
      {otherMatches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            다른 닮은 캐릭터
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherMatches.map((match, index) => (
              <CharacterCard key={match.character.id} match={match} rank={index + 2} />
            ))}
          </div>
        </div>
      )}

      {/* Share buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>결과 공유하기</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>링크 복사</span>
          </button>
        </div>

        {/* Image save button */}
        <button
          onClick={() => setShowShareCard(true)}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>인스타 스토리용 이미지 저장</span>
        </button>
      </motion.div>

      {/* Share card modal */}
      <ShareCard
        match={topMatch}
        targetName={result.targetName}
        isOpen={showShareCard}
        onClose={() => setShowShareCard(false)}
      />

      {/* Retry button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          다시 테스트하기 →
        </button>
      </div>
    </div>
  );
}
