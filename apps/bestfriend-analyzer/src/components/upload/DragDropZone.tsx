import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DragDropZoneProps {
  onFileSelect: (content: string) => void;
  isLoading: boolean;
}

export function DragDropZone({ onFileSelect, isLoading }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.txt')) {
        alert('TXT 파일만 업로드 가능해요!');
        return;
      }

      try {
        const content = await file.text();
        onFileSelect(content);
      } catch {
        alert('파일을 읽는 중 오류가 발생했어요');
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500 bg-white dark:bg-gray-800'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={{ scale: isLoading ? 1 : 1.01 }}
      whileTap={{ scale: isLoading ? 1 : 0.99 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleInputChange}
        className="hidden"
        disabled={isLoading}
      />

      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
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
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            카카오톡 대화 파일을 업로드하세요
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            파일을 드래그하거나 클릭하여 선택
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>.txt 파일만 지원</span>
        </div>
      </div>

      {isDragging && (
        <div className="absolute inset-0 bg-violet-500/10 rounded-2xl flex items-center justify-center">
          <p className="text-violet-600 dark:text-violet-400 font-semibold">여기에 놓아주세요!</p>
        </div>
      )}
    </motion.div>
  );
}
