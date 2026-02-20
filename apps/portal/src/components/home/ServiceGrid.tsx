import { ServiceCard } from './ServiceCard';

// In production, use relative paths. In development, use full URLs for separate apps.
const KATALK_URL = import.meta.env.DEV ? 'http://localhost:3001' : '/katalk';
const MENHERA_URL = import.meta.env.DEV ? 'http://localhost:3002' : '/menhera';
const MBTI_URL = import.meta.env.DEV ? 'http://localhost:3003' : '/mbti';
const RELATIONSHIP_URL = import.meta.env.DEV ? 'http://localhost:3004' : '/relationship';
const MOCKEXAM_URL = import.meta.env.DEV ? 'http://localhost:3005' : '/mockexam';
const BESTFRIEND_URL = import.meta.env.DEV ? 'http://localhost:3006' : '/bestfriend';
const GREENLIGHT_URL = import.meta.env.DEV ? 'http://localhost:3007' : '/greenlight';
const CHATTYPE_URL = import.meta.env.DEV ? 'http://localhost:3008' : '/chattype';
const BALANCE_URL = import.meta.env.DEV ? 'http://localhost:3009' : '/balance';

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
    href: MBTI_URL,
    isNew: true,
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
    id: 'relationship',
    title: '관계 점수 측정',
    description: '친구, 연인, 가족과의 대화를 분석해서 관계 점수를 측정해드려요.',
    href: RELATIONSHIP_URL,
    isNew: true,
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
  {
    id: 'mockexam',
    title: '여친/남친 모의고사',
    description: '카톡 대화로 연인 퀴즈를 만들고 공유해보세요! 얼마나 잘 알고 있는지 테스트!',
    href: MOCKEXAM_URL,
    isNew: true,
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 'bestfriend',
    title: '찐친 테스트',
    description: '친구가 나를 얼마나 아는지 테스트! 대화 기반으로 퀴즈를 자동 생성해요.',
    href: BESTFRIEND_URL,
    isNew: true,
    gradient: 'bg-gradient-to-br from-violet-500 to-indigo-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    id: 'greenlight',
    title: '그린라이트 판독기',
    description: '카톡 대화에서 그린라이트와 레드플래그를 분석해드려요! 썸남썸녀의 신호를 확인하세요.',
    href: GREENLIGHT_URL,
    isNew: true,
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 'chattype',
    title: '말투 유형 테스트',
    description: '대화 스타일을 16가지 유형으로 분석! 폭풍답장러? 읽씹마스터? 당신의 말투 유형은?',
    href: CHATTYPE_URL,
    isNew: true,
    gradient: 'bg-gradient-to-br from-fuchsia-500 to-purple-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    id: 'balance',
    title: '밸런스게임 생성기',
    description: '대화 기반 맞춤 밸런스게임 자동 생성! 친구의 취향을 맞춰보세요.',
    href: BALANCE_URL,
    isNew: true,
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
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
              gradient={service.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
