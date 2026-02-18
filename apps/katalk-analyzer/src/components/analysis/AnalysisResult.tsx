import { motion } from 'framer-motion';
import { AnalysisResult as AnalysisResultType } from '../../types/katalk';
import { LoveGauge } from './LoveGauge';
import { ScoreCard } from './ScoreCard';

// In production, use relative paths. In development, use full URLs for separate apps.
const PORTAL_URL = import.meta.env.DEV ? 'http://localhost:3000' : '/';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
}

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  const { love, teto, aegyo, summary } = result;
  const participants = Object.keys(teto);

  const handleShare = async () => {
    const shareData = {
      title: '카톡 호감도 분석 결과',
      text: `${love.winner}님이 ${Math.max(love.overallScore.personA, love.overallScore.personB)}% 더 좋아해요! 나도 분석해보기 👉`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('링크가 복사되었어요!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Love gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoveGauge analysis={love} />
      </motion.div>

      {/* Teto & Aegyo scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Person A scores */}
        <div className="space-y-4">
          <ScoreCard
            title="테토력"
            icon="💬"
            personName={participants[0]}
            analysis={teto[participants[0]]}
            type="teto"
            delay={0.2}
          />
          <ScoreCard
            title="에겐력"
            icon="🥰"
            personName={participants[0]}
            analysis={aegyo[participants[0]]}
            type="aegyo"
            delay={0.4}
          />
        </div>

        {/* Person B scores */}
        <div className="space-y-4">
          <ScoreCard
            title="테토력"
            icon="💬"
            personName={participants[1]}
            analysis={teto[participants[1]]}
            type="teto"
            delay={0.3}
          />
          <ScoreCard
            title="에겐력"
            icon="🥰"
            personName={participants[1]}
            analysis={aegyo[participants[1]]}
            type="aegyo"
            delay={0.5}
          />
        </div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>🔮</span> AI 종합 분석
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          공유하기
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          다시 분석하기
        </button>

        <a
          href={PORTAL_URL}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          홈으로
        </a>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        이 분석 결과는 AI가 대화 패턴을 기반으로 예측한 것으로, 재미로만 참고해주세요.
      </p>
    </div>
  );
}
