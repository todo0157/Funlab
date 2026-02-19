import { DragDropZone } from './DragDropZone';

interface FileUploaderProps {
  onFileSelect: (content: string) => void;
  isLoading: boolean;
}

export function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
  return (
    <div className="space-y-6">
      <DragDropZone onFileSelect={onFileSelect} isLoading={isLoading} />

      {/* Instructions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          카카오톡 대화 내보내기 방법
        </h3>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <span>카카오톡 채팅방 열기</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>우측 상단 메뉴 (≡) 클릭</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>"대화 내보내기" 선택 후 저장</span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          * 대화 내용은 분석 후 즉시 삭제되며, 서버에 저장되지 않아요
        </p>
      </div>
    </div>
  );
}
