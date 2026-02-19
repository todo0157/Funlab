import { motion } from 'framer-motion';
import { MBTIAnalysisResult } from '../../types/mbti';
import { MBTIChart } from './MBTIChart';

const PORTAL_URL = import.meta.env.DEV ? 'http://localhost:3000' : '/';

interface AnalysisResultProps {
  result: MBTIAnalysisResult;
  onReset: () => void;
}

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  const { participants, chatStyle } = result;

  const handleShare = async () => {
    const mbtiTypes = participants.map(p => `${p.name}: ${p.mbtiType}`).join(', ');
    const shareData = {
      title: 'MBTI 대화 스타일 분석 결과',
      text: `내 대화 스타일 MBTI는? ${mbtiTypes} - 나도 분석해보기!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('링크가 복사되었어요!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Participant MBTI Cards */}
      {participants.map((participant, index) => (
        <motion.div
          key={participant.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          {/* Name Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {participant.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {participant.name}
            </h2>
          </div>

          {/* MBTI Chart */}
          <MBTIChart
            axes={participant.axes}
            mbtiType={participant.mbtiType}
            delay={index * 0.2 + 0.1}
          />

          {/* Personality Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {participant.personality.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
              {participant.personality.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {participant.personality.traits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-purple-600 dark:text-purple-400"
                >
                  {trait}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Chat Style Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: participants.length * 0.2 + 0.2, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>💬</span> 대화 스타일 분석
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{chatStyle.summary}</p>
        <ul className="space-y-2">
          {chatStyle.patterns.map((pattern, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-purple-500 mt-0.5">•</span>
              {pattern}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Premium Upsell Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: participants.length * 0.2 + 0.4, duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-500 rounded-2xl p-6 text-white"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              PREMIUM
            </span>
            <span className="text-white/80 text-sm">더 정확한 분석을 원하신다면?</span>
          </div>

          <h3 className="text-xl font-bold mb-3">
            전체 대화 분석으로 정밀 MBTI를 확인해보세요
          </h3>

          <ul className="space-y-2 mb-4 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>전체 메시지</strong> 분석 (최대 5,000개)</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>GPT-4 Turbo</strong>로 정밀 분석</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>시간대별, 상황별 <strong>성격 변화 분석</strong></span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="https://toss.me/funlab/3900"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors text-center shadow-lg"
            >
              3,900원으로 업그레이드
            </a>
            <span className="text-white/60 text-sm">단 한 번의 결제로 이용 가능</span>
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: participants.length * 0.2 + 0.6, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-600 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          공유하기
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          다시 분석하기
        </button>

        <a
          href={PORTAL_URL}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
