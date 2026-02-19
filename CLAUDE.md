# CLAUDE.md - FunLab 프로젝트 컨텍스트

이 파일은 Claude Code가 이 프로젝트를 이해하는 데 필요한 정보를 담고 있습니다.

## 프로젝트 개요

**FunLab**은 AI 기반 콘텐츠 분석 서비스 포털입니다. 카카오톡 대화 파일을 업로드하면 AI가 다양한 관점에서 분석해줍니다.

## 아키텍처

### 모노레포 구조 (pnpm + Turborepo)

```
apps/
├── portal/              # 메인 포털 (localhost:3000)
├── katalk-analyzer/     # 카톡 호감도 분석기 (localhost:3001)
├── menhera-analyzer/    # 맨헤라 분석기 (localhost:3002)
├── mbti-analyzer/       # MBTI 분석기 (localhost:3003)
├── relationship-analyzer/ # 관계 점수 분석기 (localhost:3004)
└── mockexam-analyzer/   # 연인 모의고사 (localhost:3005)

workers/
└── api-proxy/           # Cloudflare Workers API (localhost:8787)
```

### 배포 구조

- **Cloudflare Pages**: 정적 사이트 (portal, katalk, menhera 병합)
- **Cloudflare Workers**: API 프록시 (OpenAI 호출)
- **빌드**: `pnpm build:pages` → `scripts/merge-builds.js`로 dist 병합

## 핵심 파일

### 프론트엔드
- `apps/*/src/App.tsx` - 메인 앱 컴포넌트
- `apps/*/src/services/analysisService.ts` - API 호출
- `apps/*/src/services/*Parser.ts` - 카톡 파일 파싱
- `apps/*/src/types/*.ts` - TypeScript 타입 정의

### 백엔드
- `workers/api-proxy/src/index.ts` - Workers 엔트리포인트
- `workers/api-proxy/wrangler.toml` - Workers 설정

### 빌드
- `scripts/merge-builds.js` - 빌드 병합 스크립트
- `package.json` - 루트 스크립트

## 주요 기능

### 1. 티어 시스템 (Free/Premium)
- Free: 샘플 메시지 200-300개, GPT-3.5
- Premium: 전체 메시지 5000개, GPT-4-turbo
- 파일: `apps/*/src/components/tier/TierSelector.tsx`

### 2. 카톡 파싱
- 카카오톡 내보내기 TXT 파일 파싱
- 패턴: `[이름] [시간] 내용` 또는 날짜 구분선
- 파일: `apps/*/src/services/*Parser.ts`

### 3. API 프록시
- OpenAI API 호출 (CORS 우회)
- Rate limiting: Free 10/min, Premium 5/min
- 엔드포인트:
  - `/api/analyze` - 호감도 분석
  - `/api/analyze-menhera` - 맨헤라 분석
  - `/api/analyze-mbti` - MBTI 분석
  - `/api/analyze-relationship` - 관계 분석
  - `/api/generate-mockexam` - 연인 모의고사 생성

## 개발 명령어

```bash
pnpm dev              # 전체 개발 서버
pnpm dev:portal       # 포털만
pnpm dev:katalk       # 카톡 분석기만
pnpm dev:menhera      # 맨헤라 분석기만
pnpm dev:mbti         # MBTI 분석기만
pnpm dev:relationship # 관계 분석기만
pnpm dev:mockexam     # 연인 모의고사만
pnpm build:pages      # Cloudflare Pages 빌드
pnpm type-check       # TypeScript 검사
```

## 환경 변수

### Workers (.dev.vars)
```
OPENAI_API_KEY=sk-...
```

### 프론트엔드 (.env.local)
```
VITE_API_URL=http://localhost:8787
```

## 배포 프로세스

1. `git push origin main` → Cloudflare Pages 자동 빌드
2. `cd workers/api-proxy && npx wrangler deploy` → Workers 배포

## 현재 작업 상태 (2026-02-19)

### 완료된 작업
- ✅ iOS/Android 카카오톡 내보내기 파싱 지원 추가 (katalk, menhera, mbti 모두)
- ✅ MBTI 분석기 구현 완료 (`apps/mbti-analyzer/`)
- ✅ 연인 모의고사 구현 완료 (`apps/mockexam-analyzer/`)

### 연인 모의고사 (`apps/mockexam-analyzer/`) - 완료

**기능:**
- 카카오톡 대화 업로드 → AI 분석 → 퀴즈 생성 → 링크 공유
- Free: 5문제 (GPT-3.5) / Premium: 10문제 (GPT-4-turbo)
- URL 기반 공유 (base64 인코딩, DB 불필요)

**핵심 파일:**
- `src/types/mockexam.ts` - QuizQuestion, QuizData 타입 정의
- `src/services/chatParser.ts` - 카톡 파싱 + 통계/행동 패턴 추출
- `src/services/quizService.ts` - 퀴즈 생성/인코딩/공유
- `src/components/upload/` - 파일 업로드, 대상 선택
- `src/components/quiz/` - 퀴즈 에디터, 공유
- `src/components/solve/` - 퀴즈 풀기, 결과

**퀴즈 품질 개선:**
- 통계 분석: 자주 쓰는 단어, 활발한 시간대, 대화 시작 비율
- 행동 패턴 추출: 사과/애교/감정 표현, 대화 시작·끝 패턴
- 프롬프트: 인스타 릴스/밸런스 게임 스타일, evidence 필드 필수

**Workers:**
- `/api/generate-mockexam` 엔드포인트 추가 완료

### 이후 구현 순서
1. ✅ MBTI 대화 스타일 분석 (완료)
2. ❌ 이모티콘 성격 분석 (폐기 - 카톡 내보내기 시 기본 이모티콘만 지원)
3. ✅ 연인 모의고사 (완료)
4. ⏳ 관계 점수 측정 (`/relationship`) - 기본 구조 생성됨

## 서비스 현황

구현 완료:
- `/katalk` - 카톡 호감도 분석기
- `/menhera` - 맨헤라 분석기
- `/mbti` - MBTI 대화 스타일 분석
- `/mockexam` - 연인 모의고사

구현 예정:
- `/relationship` - 관계 점수 측정 (기본 구조 생성됨)

## 향후 콘텐츠 아이디어

### 우선순위 높음 (바이럴성 ⭐⭐⭐⭐⭐)

#### 1. 찐친 테스트 (`/bestfriend`)
- **컨셉**: 친구가 나를 얼마나 아는지 테스트 (HolaQuiz 스타일)
- **기능**: 대화 분석 → 나에 대한 퀴즈 자동 생성 → 링크 공유 → 점수 확인
- **차별점**: 기존 서비스는 수동 질문 입력 → 대화 기반 자동 생성
- **예시 문제**: "내가 자주 쓰는 말은?", "내가 화났을 때 하는 말은?"

#### 2. 레드플래그/그린플래그 분석기 (`/redflag`)
- **컨셉**: 대화에서 연인/친구의 위험 신호와 좋은 신호 분석
- **기능**: 레드플래그 감지 (답장 지연, 단답, 부정적 표현) / 그린플래그 점수
- **결과**: "이 대화의 레드플래그 TOP 3" 카드
- **바이럴 포인트**: SNS에서 "레드플래그" 밈 매우 인기

### 우선순위 중간 (바이럴성 ⭐⭐⭐⭐)

#### 3. 카톡 말투 유형 테스트 (`/chattype`)
- **컨셉**: 대화 스타일을 16가지 유형으로 진단
- **유형 예시**: "센스쟁이형", "읽씹러형", "폭풍답장형", "새벽감성형"
- **결과**: 유형 카드 + 궁합 맞는 유형 안내
- **바이럴 포인트**: MBTI처럼 유형 카드 공유

#### 4. 대화 온도계 (`/temperature`)
- **컨셉**: 두 사람 사이의 "대화 온도" 시각화
- **기능**: 시간대별 대화 열기 그래프, 최고 온도 순간 하이라이트
- **시각화**: 온도계 UI + 타임라인

### 우선순위 낮음 (구현 난이도 높음)

#### 5. 밸런스게임 생성기 (`/balance`)
- **컨셉**: 대화 기반 맞춤 밸런스게임 자동 생성
- **기능**: 대화에서 취향/선호도 추출 → "이 사람은 치킨 vs 피자?"

#### 6. 대화 리포트 카드 (`/report`)
- **컨셉**: 월간/연간 대화 통계 인포그래픽
- **기능**: "올해 가장 많이 한 말", "새벽 대화 빈도" 등
- **바이럴 포인트**: 연말 결산 스타일 공유용 카드

#### 7. 대화 캐릭터 분석기 (`/character`)
- **컨셉**: 대화 스타일을 애니/드라마 캐릭터로 매칭
- **기능**: "당신은 ~~ 캐릭터와 비슷해요!" + 케미 조합

#### 8. 싸움 패턴 분석기 (`/fight`)
- **컨셉**: 갈등 대화 패턴 분석
- **기능**: 누가 먼저 화해하는지, 싸움 시 말투 변화, 개선 팁

### 구현 시 참고사항
- 모든 콘텐츠는 mockexam-analyzer 패턴 참고 (통계/행동 패턴 추출)
- URL 기반 공유 방식 유지 (DB 불필요)
- 인스타 스토리/릴스 공유에 최적화된 결과 카드 디자인

## 코드 컨벤션

- TypeScript strict mode
- Tailwind CSS utility-first
- Framer Motion 애니메이션
- 한국어 UI/UX
- 컴포넌트: PascalCase
- 파일: kebab-case 또는 camelCase

## 주의사항

- Windows 환경에서 빌드 시 메모리 이슈 가능 (`NODE_OPTIONS="--max-old-space-size=8192"`)
- 각 앱의 `vite.config.ts`에서 `base` 경로 설정 필요
- `_redirects` 파일로 SPA 라우팅 처리

## 작업 재개 방법

관계 분석기 구현을 계속하려면:
```
관계 분석기 구현을 이어서 진행해줘.
```

참고할 기존 코드:
- `apps/mockexam-analyzer/` - 최신 패턴 (통계/행동 패턴 추출)
- `apps/katalk-analyzer/src/components/` - 기본 UI 컴포넌트
- `workers/api-proxy/src/index.ts` - API 엔드포인트 패턴
