import { HeroSection } from '../components/home/HeroSection';
import { ServiceGrid } from '../components/home/ServiceGrid';

export function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Service Grid */}
      <ServiceGrid />

      {/* Feature Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="max-w-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                더 많은 서비스가 준비중이에요
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                새로운 분석 서비스가 곧 출시됩니다. 이메일을 등록하시면 새 서비스 출시 소식을 가장 먼저 받아보실 수 있어요.
              </p>
              <form className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  알림 받기
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
