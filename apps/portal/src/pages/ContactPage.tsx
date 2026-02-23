import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 이메일 발송 또는 폼 제출 로직 구현
    // 현재는 mailto 링크로 대체
    const mailtoLink = `mailto:thf5662@gmail.com?subject=${encodeURIComponent(
      `[FunLab 문의] ${formData.subject}`
    )}&body=${encodeURIComponent(
      `이름: ${formData.name}\n이메일: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
    setIsSubmitted(true);
  };

  const faqs = [
    {
      question: '카카오톡 대화는 어떻게 내보내나요?',
      answer:
        '카카오톡 앱에서 대화방 > 메뉴(≡) > 대화 내보내기 > 텍스트로 저장을 선택하면 TXT 파일로 저장됩니다. iOS와 Android 모두 지원합니다.',
    },
    {
      question: '대화 내용이 저장되나요?',
      answer:
        '아니요. 업로드된 대화 파일은 분석 후 즉시 삭제됩니다. 서버에 대화 내용이 영구적으로 저장되지 않으며, AI 분석을 위해 일시적으로만 사용됩니다.',
    },
    {
      question: '분석 결과는 정확한가요?',
      answer:
        'AI 분석 결과는 참고용으로만 활용해 주세요. 재미와 인사이트를 위한 서비스이며, 중요한 의사결정의 근거로 사용하기에는 적합하지 않습니다.',
    },
    {
      question: '무료로 이용할 수 있나요?',
      answer:
        '네, 기본 분석 서비스는 무료로 제공됩니다. 일부 고급 기능은 추후 유료로 전환될 수 있습니다.',
    },
    {
      question: '그룹 대화방도 분석할 수 있나요?',
      answer:
        '네, 맨헤라 분석기 등 일부 서비스는 그룹 대화방 분석을 지원합니다. 각 서비스 페이지에서 지원 여부를 확인해 주세요.',
    },
    {
      question: '분석 결과를 공유할 수 있나요?',
      answer:
        '네, 분석 결과 페이지에서 공유 버튼을 통해 링크를 생성하고 친구들에게 공유할 수 있습니다. 공유 링크에는 원본 대화 내용이 포함되지 않습니다.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        문의하기
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            문의 양식
          </h2>

          {isSubmitted ? (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-800 dark:text-green-200">
                  이메일 앱이 열렸습니다. 문의 내용을 전송해 주세요.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                새 문의 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="문의 제목"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  문의 내용
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="문의하실 내용을 작성해 주세요."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                문의 보내기
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            연락처 정보
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
                <a href="mailto:thf5662@gmail.com" className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                  thf5662@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">응답 시간</p>
                <p className="text-gray-900 dark:text-white">
                  영업일 기준 1-2일 내 답변
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>버그 제보 및 기능 제안</strong>도 환영합니다!
              서비스 이용 중 불편한 점이나 개선 아이디어가 있으시면 언제든 문의해 주세요.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          자주 묻는 질문
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
