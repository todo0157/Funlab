import { ServiceCard } from './ServiceCard';

// In production, use relative paths. In development, use full URLs for separate apps.
const KATALK_URL = import.meta.env.DEV ? 'http://localhost:3001' : '/katalk';
const MENHERA_URL = import.meta.env.DEV ? 'http://localhost:3002' : '/menhera';

const services = [
  {
    id: 'katalk',
    title: '카톡 호감도 분석',
    description: 'AI가 카카오톡 대화를 분석해서 누가 더 좋아하는지, 테토력과 에겐력까지 측정해드려요.',
    href: KATALK_URL,
    isNew: true,
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    id: 'menhera',
    title: '맨헤라 분석기',
    description: '단체 톡방에서 누가 가장 맨헤라인지 AI가 분석해드려요. 감정 기복, 심야 활동 등을 측정!',
    href: MENHERA_URL,
    isNew: true,
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 'mbti-chat',
    title: 'MBTI 대화 스타일',
    description: '대화 패턴을 분석해서 당신의 MBTI 유형을 예측해드려요.',
    href: '/mbti',
    isComingSoon: true,
    gradient: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    id: 'emoji-analysis',
    title: '이모티콘 성격 분석',
    description: '자주 사용하는 이모티콘으로 당신의 숨겨진 성격을 분석해드려요.',
    href: '/emoji',
    isComingSoon: true,
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 'relationship',
    title: '관계 점수 측정',
    description: '친구, 연인, 가족과의 대화를 분석해서 관계 점수를 측정해드려요.',
    href: '/relationship',
    isComingSoon: true,
    gradient: 'bg-gradient-to-br from-teal-500 to-cyan-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
];

export function ServiceGrid() {
  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            재미있는 분석 서비스
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            AI 기술로 당신의 일상을 새롭게 분석해드려요
          </p>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              href={service.href}
              isNew={service.isNew}
              isComingSoon={service.isComingSoon}
              gradient={service.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
