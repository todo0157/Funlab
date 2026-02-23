export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        이용약관
      </h1>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <p className="text-gray-600 dark:text-gray-400">
          최종 수정일: 2024년 2월 20일
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제1조 (목적)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 약관은 FunLab(이하 "서비스")이 제공하는 AI 기반 대화 분석 서비스의 이용과 관련하여
            서비스와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제2조 (정의)
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>"서비스"</strong>란 FunLab이 제공하는 카카오톡 대화 분석, 호감도 측정,
              MBTI 분석 등 AI 기반 콘텐츠 분석 서비스를 말합니다.
            </li>
            <li>
              <strong>"이용자"</strong>란 본 약관에 따라 서비스가 제공하는 서비스를 이용하는 자를 말합니다.
            </li>
            <li>
              <strong>"콘텐츠"</strong>란 이용자가 서비스에 업로드하는 카카오톡 대화 파일 및
              서비스가 생성하는 분석 결과물을 말합니다.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제3조 (약관의 효력 및 변경)
          </h2>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
            <li>서비스는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.</li>
            <li>약관이 변경되는 경우 서비스는 변경 내용과 시행일을 서비스 내 공지사항에 게시합니다.</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제4조 (서비스의 제공)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스는 다음과 같은 서비스를 제공합니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>카카오톡 대화 호감도 분석</li>
            <li>맨헤라 지수 분석</li>
            <li>MBTI 대화 스타일 분석</li>
            <li>관계 점수 측정</li>
            <li>여친/남친 모의고사</li>
            <li>찐친 테스트</li>
            <li>그린라이트 판독기</li>
            <li>말투 유형 테스트</li>
            <li>밸런스게임 생성기</li>
            <li>드라마 캐릭터 분석</li>
            <li>기타 AI 기반 콘텐츠 분석 서비스</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제5조 (서비스 이용)
          </h2>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>서비스는 별도의 회원가입 없이 이용할 수 있습니다.</li>
            <li>이용자는 서비스 이용 시 본 약관 및 관련 법령을 준수해야 합니다.</li>
            <li>서비스의 분석 결과는 AI에 의해 생성되며, 참고용으로만 활용해야 합니다.</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제6조 (이용자의 의무)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            이용자는 다음 행위를 하여서는 안 됩니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>타인의 동의 없이 타인의 대화 내용을 업로드하는 행위</li>
            <li>서비스의 운영을 방해하는 행위</li>
            <li>서비스를 이용하여 얻은 정보를 서비스의 사전 동의 없이 상업적으로 이용하는 행위</li>
            <li>서비스의 시스템에 무단으로 접근하거나 해킹을 시도하는 행위</li>
            <li>악성코드, 바이러스 등을 유포하는 행위</li>
            <li>기타 관련 법령에 위배되는 행위</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제7조 (콘텐츠의 관리)
          </h2>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>이용자가 업로드하는 대화 파일의 저작권 및 책임은 이용자에게 있습니다.</li>
            <li>서비스는 업로드된 대화 파일을 분석 목적으로만 사용하며, 분석 완료 후 즉시 삭제합니다.</li>
            <li>서비스는 이용자의 콘텐츠를 저장하거나 제3자에게 제공하지 않습니다.</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제8조 (면책조항)
          </h2>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              서비스가 제공하는 분석 결과는 AI에 의해 생성된 것으로,
              그 정확성이나 신뢰성을 보장하지 않습니다.
            </li>
            <li>
              이용자가 서비스 분석 결과를 활용하여 내린 판단이나 결정에 대해
              서비스는 책임을 지지 않습니다.
            </li>
            <li>
              서비스는 천재지변, 시스템 장애 등 불가항력적인 사유로 인한
              서비스 중단에 대해 책임을 지지 않습니다.
            </li>
            <li>
              이용자 간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대해
              서비스는 개입하지 않으며 책임을 지지 않습니다.
            </li>
          </ol>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              <strong>주의:</strong> 본 서비스의 분석 결과는 재미와 참고 목적으로만 제공됩니다.
              중요한 의사결정에는 전문가의 조언을 구하시기 바랍니다.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제9조 (지적재산권)
          </h2>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              서비스가 제공하는 서비스, 디자인, 로고, 상표 등에 대한 지적재산권은 서비스에 귀속됩니다.
            </li>
            <li>
              이용자는 서비스의 사전 동의 없이 서비스의 지적재산을 복제, 배포, 방송 등의 방법으로
              이용하거나 제3자에게 이용하게 할 수 없습니다.
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            제10조 (분쟁해결)
          </h2>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>서비스와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법원을 관할법원으로 합니다.</li>
            <li>서비스와 이용자 간에 제기된 소송에는 대한민국 법을 적용합니다.</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            부칙
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 약관은 2024년 2월 20일부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
