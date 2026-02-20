import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import type { MatchResult } from '../../types/character';

interface ShareCardProps {
  match: MatchResult;
  targetName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareCard({ match, targetName, isOpen, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#1a1a1a',
      });

      const link = document.createElement('a');
      link.download = `${match.character.name}-캐릭터결과.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Card content */}
            <div
              ref={cardRef}
              className="relative overflow-hidden rounded-3xl"
              style={{
                aspectRatio: '9/16',
                background: `linear-gradient(180deg, ${match.character.color}33 0%, ${match.character.color}11 50%, #1a1a1a 100%)`,
              }}
            >
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(${match.character.color} 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-between p-6 text-white">
                {/* Header */}
                <div className="text-center pt-8">
                  <p className="text-sm font-medium opacity-70">나와 닮은 드라마 캐릭터는?</p>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  {/* Emoji */}
                  <div
                    className="text-8xl"
                    style={{
                      textShadow: `0 0 40px ${match.character.color}80`,
                    }}
                  >
                    {match.character.emoji}
                  </div>

                  {/* Character name */}
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold">{match.character.name}</h2>
                    <p className="text-lg opacity-70">{match.character.drama}</p>
                  </div>

                  {/* Similarity badge */}
                  <div
                    className="px-6 py-2 rounded-full font-bold text-xl"
                    style={{
                      backgroundColor: `${match.character.color}33`,
                      borderColor: match.character.color,
                      borderWidth: '2px',
                    }}
                  >
                    {match.similarity}% 일치
                  </div>

                  {/* Target name if exists */}
                  {targetName && (
                    <p className="text-sm opacity-60 mt-2">
                      {targetName}님의 결과
                    </p>
                  )}

                  {/* Keywords */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {match.character.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-white/10"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer / Watermark */}
                <div className="text-center pb-4">
                  <p className="text-xs opacity-50">funlab.kr/character</p>
                </div>
              </div>
            </div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="mt-4 w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isDownloading ? '저장 중...' : '이미지로 저장하기'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
