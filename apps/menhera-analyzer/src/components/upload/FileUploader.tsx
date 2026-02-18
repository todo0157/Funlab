import { useCallback, useState } from 'react';
import { DragDropZone } from './DragDropZone';

interface FileUploaderProps {
  onFileSelect: (content: string) => void;
  isLoading?: boolean;
}

export function FileUploader({ onFileSelect, isLoading = false }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file
      if (!file.name.endsWith('.txt')) {
        setError('카카오톡 대화 내보내기 파일(.txt)만 업로드 가능해요');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('파일 크기는 10MB 이하여야 해요');
        return;
      }

      try {
        const content = await file.text();

        // Basic validation - check if it looks like a KakaoTalk export
        if (!content.includes('[') || content.length < 100) {
          setError('올바른 카카오톡 대화 파일이 아닌 것 같아요');
          return;
        }

        onFileSelect(content);
      } catch {
        setError('파일을 읽는 중 오류가 발생했어요');
      }
    },
    [onFileSelect]
  );

  return (
    <div className="space-y-6">
      <DragDropZone onFile={handleFile} isLoading={isLoading} />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          카카오톡 대화 내보내기 방법
        </h3>
        <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>카카오톡에서 분석하고 싶은 <strong>단체 채팅방</strong>에 들어가세요</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>우측 상단 메뉴(≡) → 설정(⚙) → 대화 내보내기</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>내보낸 .txt 파일을 여기에 업로드하세요</span>
          </li>
        </ol>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p>
          업로드된 대화 내용은 분석 후 즉시 삭제되며, 서버에 저장되지 않아요.
          개인정보는 안전하게 보호됩니다.
        </p>
      </div>
    </div>
  );
}
