import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DragDropZoneProps {
  onFileSelect: (content: string) => void;
  isLoading: boolean;
}

export function DragDropZone({ onFileSelect, isLoading }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.txt')) {
        alert('TXT 파일만 업로드할 수 있어요');
        return;
      }

      const content = await file.text();
      onFileSelect(content);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
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

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <motion.div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
        isDragging
          ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-900/20'
          : 'border-gray-300 dark:border-gray-700 hover:border-fuchsia-400 dark:hover:border-fuchsia-600 hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-900/10'
      } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDragging
              ? 'bg-fuchsia-100 dark:bg-fuchsia-800'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <svg
            className={`w-8 h-8 ${
              isDragging
                ? 'text-fuchsia-500'
                : 'text-gray-400 dark:text-gray-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {isDragging ? '여기에 놓아주세요!' : '카카오톡 대화 파일을 올려주세요'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            TXT 파일을 드래그하거나 클릭해서 선택
          </p>
        </div>
      </div>
    </motion.div>
  );
}
