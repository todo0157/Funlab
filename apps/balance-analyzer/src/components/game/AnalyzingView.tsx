import { motion } from 'framer-motion';

interface AnalyzingViewProps {
  targetName: string;
}

export function AnalyzingView({ targetName }: AnalyzingViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto text-center py-12"
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-7xl mb-8"
      >
        ⚖️
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {targetName}님의 취향을 분석 중...
      </h2>

      <div className="space-y-3 text-gray-600">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          대화에서 취향 키워드를 추출하고 있어요
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          밸런스게임 질문을 만들고 있어요
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          재미있는 선택지를 고민 중이에요
        </motion.p>
      </div>

      <motion.div
        className="mt-8"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 15, ease: 'linear' }}
      >
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 15, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
