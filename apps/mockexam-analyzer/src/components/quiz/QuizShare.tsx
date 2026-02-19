import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuizData } from '../../types/mockexam';
import { generateShareUrl, shareToKakao } from '../../services/quizService';

interface QuizShareProps {
  quizData: QuizData;
  onReset: () => void;
  onPreview: () => void;
}

export function QuizShare({ quizData, onReset, onPreview }: QuizShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = generateShareUrl(quizData);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('링크 복사에 실패했어요');
    }
  };

  const handleShare = async () => {
    await shareToKakao(quizData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          모의고사 완성!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          <span className="font-semibold text-pink-500">{quizData.targetName}</span> 모의고사가 준비되었어요
        </p>

        {/* Quiz info */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">문제 수</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {quizData.questions.length}문제
            </span>
          </div>
        </div>

        {/* Share URL */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">공유 링크</p>
          <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={handleShare}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.93 1.94 5.5 4.87 6.91-.21.77-.77 2.86-.89 3.31-.14.56.2.55.43.4.17-.12 2.77-1.87 3.9-2.64.54.08 1.1.12 1.69.12 5.52 0 10-3.82 10-8.5S17.52 2 12 2z"/>
            </svg>
            카카오톡으로 공유하기
          </motion.button>

          <button
            onClick={onPreview}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            미리보기
          </button>

          <button
            onClick={onReset}
            className="w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
          >
            새 모의고사 만들기
          </button>
        </div>
      </div>
    </motion.div>
  );
}
