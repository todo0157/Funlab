import { motion } from 'framer-motion';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-6 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <a
            href={import.meta.env.DEV ? 'http://localhost:3000' : '/'}
            className="text-white/80 hover:text-white text-sm mb-2 inline-block"
          >
            ← FunLab 홈으로
          </a>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">⚖️ 밸런스게임 생성기</h1>
          <p className="text-white/90 text-lg">대화 기반 맞춤 밸런스게임을 자동으로 생성해요!</p>
        </motion.div>
      </div>
    </header>
  );
}
