import { useCallback, useState, useRef } from 'react';

interface DragDropZoneProps {
  onFile: (file: File) => void;
  isLoading?: boolean;
}

export function DragDropZone({ onFile, isLoading = false }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

      const file = e.dataTransfer.files[0];
      if (file) {
        onFile(file);
      }
    },
    [onFile]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFile(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-300
        ${
          isDragging
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 scale-[1.02]'
            : 'border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
        ${isLoading ? 'pointer-events-none opacity-60' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        onChange={handleChange}
        className="hidden"
        disabled={isLoading}
      />

      {isLoading ? (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto">
            <svg className="animate-spin w-full h-full text-red-500" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">분석 중...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upload icon */}
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              카카오톡 대화 파일을 업로드하세요
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              파일을 드래그하거나 클릭해서 선택하세요
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span>.txt 파일</span>
            <span>-</span>
            <span>최대 5MB</span>
          </div>
        </div>
      )}
    </div>
  );
}
