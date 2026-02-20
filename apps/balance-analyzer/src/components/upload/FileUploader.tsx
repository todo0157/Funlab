import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import type { ParsedChat } from '../../types/balance';
import { parseKakaoChat } from '../../services/chatParser';

interface FileUploaderProps {
  onParsed: (result: ParsedChat) => void;
  onError: (error: string) => void;
}

export function FileUploader({ onParsed, onError }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.txt')) {
        onError('텍스트 파일(.txt)만 업로드 가능합니다');
        return;
      }

      setIsProcessing(true);
      try {
        const content = await file.text();
        const parsed = parseKakaoChat(content);

        if (parsed.messages.length === 0) {
          onError('카카오톡 대화를 찾을 수 없습니다. 올바른 내보내기 파일인지 확인해주세요.');
          return;
        }

        if (parsed.participants.length < 2) {
          onError('대화 참여자가 2명 이상이어야 합니다.');
          return;
        }

        onParsed(parsed);
      } catch {
        onError('파일을 읽는 중 오류가 발생했습니다');
      } finally {
        setIsProcessing(false);
      }
    },
    [onParsed, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto"
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept=".txt"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="space-y-4">
          <div className="text-6xl">⚖️</div>
          <div>
            <p className="text-xl font-semibold text-gray-800">
              {isProcessing ? '분석 중...' : '카카오톡 대화 파일을 올려주세요'}
            </p>
            <p className="text-gray-500 mt-2">
              클릭하거나 파일을 드래그해서 업로드하세요
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <details className="text-gray-600">
          <summary className="cursor-pointer text-sm hover:text-amber-600">
            카카오톡 대화 내보내기 방법
          </summary>
          <div className="mt-3 text-left bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <p>
              <strong>PC 카카오톡:</strong> 채팅방 → 우측 상단 메뉴 → 대화 내보내기
            </p>
            <p>
              <strong>모바일:</strong> 채팅방 → 설정(⚙️) → 대화 내보내기 → 텍스트만
            </p>
          </div>
        </details>
      </div>
    </motion.div>
  );
}
