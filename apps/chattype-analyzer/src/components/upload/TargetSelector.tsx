import { motion } from 'framer-motion';
import { ParsedChat } from '../../types/chattype';

interface TargetSelectorProps {
  parsedChat: ParsedChat;
  onSelectTarget: (name: string) => void;
  onCancel: () => void;
}

export function TargetSelector({ parsedChat, onSelectTarget, onCancel }: TargetSelectorProps) {
  const participants = parsedChat.participants;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-3xl">💬</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            누구의 말투를 분석할까요?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            분석할 대상을 선택해주세요
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {participants.map((participant) => {
            const stats = parsedChat.participantStats.get(participant);
            return (
              <motion.button
                key={participant}
                onClick={() => onSelectTarget(participant)}
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-left hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 hover:ring-2 hover:ring-fuchsia-500 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {participant}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      메시지 {stats?.messageCount || 0}개 · 평균 {Math.round(stats?.avgMessageLength || 0)}자
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            총 {parsedChat.totalMessageCount.toLocaleString()}개의 메시지 발견
          </p>
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            다른 파일 선택하기
          </button>
        </div>
      </div>
    </motion.div>
  );
}
