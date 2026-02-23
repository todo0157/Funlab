export function AboutPage() {
  const services = [
    {
      name: '카톡 호감도 분석',
      description: '두 사람의 대화 패턴을 분석해 호감도를 측정합니다.',
      icon: '💕',
    },
    {
      name: '맨헤라 분석기',
      description: '단체 톡방에서 감정 기복과 대화 패턴을 분석합니다.',
      icon: '🎭',
    },
    {
      name: 'MBTI 대화 스타일',
      description: '대화 패턴으로 MBTI 유형을 예측합니다.',
      icon: '🧠',
    },
    {
      name: '관계 점수 측정',
      description: '대화의 친밀도와 관계 건강도를 분석합니다.',
      icon: '📊',
    },
    {
      name: '여친/남친 모의고사',
      description: '연인 퀴즈를 자동 생성하고 공유할 수 있습니다.',
      icon: '📝',
    },
    {
      name: '찐친 테스트',
      description: '친구와의 대화로 퀴즈를 만들어 우정을 테스트합니다.',
      icon: '👯',
    },
    {
      name: '그린라이트 판독기',
      description: '썸 대화에서 긍정/부정 신호를 분석합니다.',
      icon: '🚦',
    },
    {
      name: '말투 유형 테스트',
      description: '16가지 말투 유형 중 나의 스타일을 찾습니다.',
      icon: '💬',
    },
    {
      name: '밸런스게임 생성기',
      description: '대화 기반 맞춤 밸런스게임을 생성합니다.',
      icon: '⚖️',
    },
    {
      name: '드라마 캐릭터 분석',
      description: '나와 닮은 넷플릭스 드라마 캐릭터를 찾습니다.',
      icon: '🎬',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mb-6">
          <span className="text-white font-bold text-4xl">F</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          FunLab
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          당신의 일상을 재미있게 분석해드려요
        </p>
      </div>

      {/* About Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          FunLab이란?
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            FunLab은 AI 기술을 활용해 일상의 대화를 재미있게 분석해주는 서비스입니다.
            카카오톡 대화 파일을 업로드하면 AI가 다양한 관점에서 분석해
            새로운 인사이트를 제공합니다.
          </p>
          <p>
            호감도 분석부터 MBTI 예측, 관계 점수 측정까지 -
            평소 궁금했지만 직접 물어보기 어려웠던 것들을
            AI를 통해 재미있게 확인해보세요.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          어떻게 사용하나요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              대화 내보내기
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              카카오톡에서 대화 내보내기 기능을 사용해 TXT 파일을 저장합니다.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              파일 업로드
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              원하는 분석 서비스를 선택하고 대화 파일을 업로드합니다.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              결과 확인
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI가 분석한 결과를 확인하고 친구들과 공유해보세요!
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          제공 서비스
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <span className="text-2xl">{service.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & Trust */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          개인정보 보호
        </h2>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                대화 내용은 저장되지 않습니다
              </h3>
              <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                <li>• 업로드된 대화 파일은 분석 후 즉시 삭제됩니다</li>
                <li>• 서버에 대화 내용이 영구 저장되지 않습니다</li>
                <li>• AI 분석은 암호화된 연결을 통해 수행됩니다</li>
                <li>• 분석 결과는 URL을 통해 공유되며, 원본 대화는 포함되지 않습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          기술 스택
        </h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'TypeScript', 'Tailwind CSS', 'OpenAI GPT-4', 'Cloudflare Pages', 'Cloudflare Workers'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
