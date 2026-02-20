import { motion } from 'framer-motion';
import { ParsedChat } from '../../types/bestfriend';

interface TargetSelectorProps {
  parsedChat: ParsedChat;
  onSelectTarget: (targetName: string) => void;
  onCancel: () => void;
}

export function TargetSelector({ parsedChat, onSelectTarget, onCancel }: TargetSelectorProps) {
  const { participants, totalMessageCount, dateRange, messageCountBySender } = parsedChat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          누구에 대한 퀴즈를 만들까요?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          친구들에게 테스트할 "나"를 선택해주세요
        </p>

        {/* Chat summary */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400">총 메시지</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {totalMessageCount.toLocaleString()}개
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">대화 기간</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {dateRange.start.toLocaleDateString()} ~ {dateRange.end.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Participant selection */}
        <div className="space-y-3">
          {participants.map((name) => (
            <motion.button
              key={name}
              onClick={() => onSelectTarget(name)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 border-2 border-transparent hover:border-violet-300 dark:hover:border-violet-500 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {name.charAt(0)}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{name}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {messageCountBySender[name]?.toLocaleString()}개 메시지
              </div>
            </motion.button>
          ))}
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="mt-6 w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
        >
          다른 파일 선택하기
        </button>
      </div>
    </motion.div>
  );
}
