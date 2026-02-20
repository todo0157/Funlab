import { motion } from 'framer-motion';
import { DragDropZone } from './DragDropZone';

interface FileUploaderProps {
  onFileSelect: (content: string) => void;
  isLoading: boolean;
}

export function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <DragDropZone onFileSelect={onFileSelect} isLoading={isLoading} />

      {/* Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-xl">📱</span>
          카카오톡 대화 내보내기 방법
        </h3>
        <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center font-medium text-xs">
              1
            </span>
            <span>분석하고 싶은 1:1 채팅방에 들어가세요</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center font-medium text-xs">
              2
            </span>
            <span>우측 상단 메뉴(≡) → 설정(⚙️) → 대화 내보내기</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center font-medium text-xs">
              3
            </span>
            <span>TXT 파일을 저장하고 여기에 업로드하세요</span>
          </li>
        </ol>

        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <span className="font-semibold">안심하세요!</span> 대화 내용은 분석 후 저장되지 않아요.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
