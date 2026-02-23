export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        개인정보처리방침
      </h1>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <p className="text-gray-600 dark:text-gray-400">
          최종 수정일: 2024년 2월 20일
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            1. 개인정보의 수집 및 이용 목적
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            FunLab(이하 "서비스")은 다음의 목적을 위해 개인정보를 처리합니다.
            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
            이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>카카오톡 대화 분석 서비스 제공</li>
            <li>서비스 이용 통계 및 분석</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            2. 수집하는 개인정보 항목
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스는 다음과 같은 정보를 수집할 수 있습니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>카카오톡 대화 파일:</strong> 사용자가 직접 업로드하는 대화 내용
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-600 dark:text-gray-400">
                <li>업로드된 파일은 분석 후 즉시 삭제됩니다</li>
                <li>서버에 대화 내용이 저장되지 않습니다</li>
              </ul>
            </li>
            <li>
              <strong>자동 수집 정보:</strong> 서비스 이용 기록, 접속 로그, 브라우저 종류
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            3. 개인정보의 처리 및 보유 기간
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에
            동의 받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>카카오톡 대화 파일:</strong> 분석 완료 즉시 삭제 (보관하지 않음)
            </li>
            <li>
              <strong>서비스 이용 기록:</strong> 서비스 종료 시까지
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            4. 제3자 제공
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
            다만, 아래의 경우에는 예외로 합니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>AI 분석 서비스 이용 안내:</strong> 대화 분석을 위해 OpenAI API를 사용합니다.
              분석 요청 시 대화 내용이 암호화되어 전송되며, OpenAI는 API를 통해 전송된 데이터를
              모델 학습에 사용하지 않습니다. 자세한 내용은 OpenAI의 개인정보처리방침을 참고해 주세요.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            5. 쿠키(Cookie)의 사용
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 쿠키를 사용합니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>다크모드 설정 저장</li>
            <li>서비스 이용 통계 (Google Analytics)</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다.
            웹브라우저 설정을 통해 쿠키 허용, 차단 등의 설정을 할 수 있습니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            6. 정보주체의 권리·의무 및 행사방법
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            7. 개인정보 보호책임자
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
            개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
            아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>개인정보 보호책임자</strong><br />
              이메일: thf5662@gmail.com
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            8. 개인정보처리방침의 변경
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가,
            삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>
      </div>
    </div>
  );
}
