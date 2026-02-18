import { motion } from 'framer-motion';
import { DragDropZone } from './DragDropZone';

interface FileUploaderProps {
  onFileSelect: (content: string) => void;
  isLoading: boolean;
}

export function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
  return (
    <div className="space-y-6">
      <DragDropZone onFileSelect={onFileSelect} isLoading={isLoading} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          카톡 대화 내보내기 방법
        </h3>
        <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>카카오톡 채팅방 열기 → 우측 상단 메뉴 (≡) 클릭</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>대화 내보내기 → 텍스트로 저장</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>저장된 .txt 파일을 여기에 업로드</span>
          </li>
        </ol>
      </motion.div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500">
        업로드된 파일은 분석 후 즉시 삭제되며, 어디에도 저장되지 않아요.
      </p>
    </div>
  );
}
