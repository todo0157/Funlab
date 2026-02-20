import { motion } from 'framer-motion';

interface TargetSelectorProps {
  participants: string[];
  onSelect: (name: string) => void;
  onBack: () => void;
}

export function TargetSelector({ participants, onSelect, onBack }: TargetSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          누구의 취향을 맞춰볼까요?
        </h2>
        <p className="text-gray-600">
          밸런스게임을 만들 대상을 선택하세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {participants.map((participant, index) => (
          <motion.button
            key={participant}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(participant)}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg
                       border-2 border-transparent hover:border-amber-400
                       transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500
                              flex items-center justify-center text-white text-xl font-bold
                              group-hover:scale-110 transition-transform">
                {participant.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">{participant}</p>
                <p className="text-gray-500 text-sm">의 취향 밸런스게임</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onBack}
        className="mt-8 w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
      >
        ← 다시 선택하기
      </motion.button>
    </motion.div>
  );
}
