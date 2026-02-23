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
├── mockexam-analyzer/   # 연인 모의고사 (localhost:3005)
├── bestfriend-analyzer/ # 찐친 테스트 (localhost:3006)
├── greenlight-analyzer/ # 그린라이트 판독기 (localhost:3007)
├── chattype-analyzer/   # 말투 유형 테스트 (localhost:3008)
├── balance-analyzer/    # 밸런스게임 생성기 (localhost:3009)
└── character-analyzer/  # 드라마 캐릭터 분석 (localhost:3010)

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
  - `/api/generate-bestfriend` - 찐친 테스트 생성
  - `/api/analyze-greenlight` - 그린라이트 판독
  - `/api/analyze-chattype` - 말투 유형 분석
  - `/api/generate-balance` - 밸런스게임 생성
  - `/api/analyze-character` - 드라마 캐릭터 매칭 분석

## 개발 명령어

```bash
pnpm dev              # 전체 개발 서버
pnpm dev:portal       # 포털만
pnpm dev:katalk       # 카톡 분석기만
pnpm dev:menhera      # 맨헤라 분석기만
pnpm dev:mbti         # MBTI 분석기만
pnpm dev:relationship # 관계 분석기만
pnpm dev:mockexam     # 연인 모의고사만
pnpm dev:bestfriend   # 찐친 테스트만
pnpm dev:greenlight   # 그린라이트 판독기만
pnpm dev:chattype     # 말투 유형 테스트만
pnpm dev:balance      # 밸런스게임 생성기만
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

## 현재 작업 상태 (2026-02-23)

### 완료된 작업
- ✅ iOS/Android 카카오톡 내보내기 파싱 지원 추가 (katalk, menhera, mbti 모두)
- ✅ MBTI 분석기 구현 완료 (`apps/mbti-analyzer/`)
- ✅ 연인 모의고사 구현 완료 (`apps/mockexam-analyzer/`)
- ✅ 관계 점수 측정기 구현 완료 (`apps/relationship-analyzer/`)
- ✅ 찐친 테스트 구현 완료 (`apps/bestfriend-analyzer/`)
- ✅ 그린라이트 판독기 구현 완료 (`apps/greenlight-analyzer/`)
- ✅ 말투 유형 테스트 구현 완료 (`apps/chattype-analyzer/`)
- ✅ 밸런스게임 생성기 구현 완료 (`apps/balance-analyzer/`)
- ✅ 드라마 캐릭터 분석기 구현 완료 (`apps/character-analyzer/`)
- ✅ Google AdSense 승인용 필수 페이지 추가 (2026-02-23)

### Google AdSense 승인용 페이지 추가 (2026-02-23)

**추가된 페이지:**
- `/privacy` - 개인정보처리방침 (8개 섹션)
- `/terms` - 이용약관 (10개 조항)
- `/about` - 서비스 소개, 사용법, 개인정보 보호 설명
- `/contact` - 문의 폼 + FAQ 6개

**수정된 파일:**
- `apps/portal/src/App.tsx` - react-router-dom 라우터 추가
- `apps/portal/src/components/layout/Header.tsx` - 네비게이션 메뉴 추가 (홈/소개/문의)
- `apps/portal/src/components/layout/Footer.tsx` - 4열 구조, Link 컴포넌트 사용
- `apps/portal/src/components/home/HeroSection.tsx` - 허위 통계 제거 → 실제 기능 표시
- `apps/portal/index.html` - SEO 메타 태그, Open Graph, 구조화된 데이터 추가

**SEO 관련 파일:**
- `apps/portal/public/robots.txt` - 크롤러 허용 설정
- `apps/portal/public/sitemap.xml` - 15개 페이지 URL 포함
- `apps/portal/public/_redirects` - SPA 라우팅 지원

**연락처:**
- 문의 이메일: thf5662@gmail.com

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

### 드라마 캐릭터 분석기 (`apps/character-analyzer/`) - 완료

**기능:**
- 퀴즈 모드: 10문항 설문으로 캐릭터 매칭
- 카톡 분석 모드: 대화 파일 업로드 → AI 분석 → 캐릭터 매칭
- 44개 캐릭터 (15개 드라마): 오징어게임, 더글로리, 무빙, 킹덤 등
- 8가지 특성 기반 매칭 알고리즘 (warmth, energy, directness, humor, initiative, emotion, loyalty, ambition)

**핵심 파일:**
- `src/data/characters.ts` - 44개 캐릭터 데이터
- `src/data/quizQuestions.ts` - 10개 퀴즈 문항
- `src/services/matchingService.ts` - 특성 유사도 계산
- `src/services/quizService.ts` - URL 공유, 결과 복원

**주요 기능:**
- URL 기반 결과 공유 (base64 인코딩)
- 인스타 스토리용 결과 카드 (html-to-image)
- 특성 비교 레이더 차트 (recharts)
- 캐릭터 도감/갤러리 (검색, 필터링)
- 드라마별 필터링

**컴포넌트 구조:**
- `src/components/result/` - CharacterResult, TraitRadarChart, ShareCard, DramaFilter
- `src/components/gallery/` - GalleryView, GalleryCard, CharacterDetail
- `src/components/quiz/` - QuizQuestion, QuizProgress
- `src/components/upload/` - FileUploader, TargetSelector

**Workers:**
- `/api/analyze-character` 엔드포인트 추가 완료

### 이후 구현 순서
1. ✅ MBTI 대화 스타일 분석 (완료)
2. ❌ 이모티콘 성격 분석 (폐기 - 카톡 내보내기 시 기본 이모티콘만 지원)
3. ✅ 연인 모의고사 (완료)
4. ✅ 관계 점수 측정 (완료)

## 서비스 현황

구현 완료:
- `/katalk` - 카톡 호감도 분석기
- `/menhera` - 맨헤라 분석기
- `/mbti` - MBTI 대화 스타일 분석
- `/mockexam` - 연인 모의고사
- `/relationship` - 관계 점수 측정
- `/bestfriend` - 찐친 테스트
- `/greenlight` - 그린라이트 판독기
- `/chattype` - 말투 유형 테스트
- `/balance` - 밸런스게임 생성기
- `/character` - 드라마 캐릭터 분석기 (테스트/카톡 분석 모드 지원)

## 향후 콘텐츠 아이디어

### 우선순위 높음 (바이럴성 ⭐⭐⭐⭐⭐)

### 우선순위 중간 (바이럴성 ⭐⭐⭐⭐)

#### 1. 대화 온도계 (`/temperature`)
- **컨셉**: 두 사람 사이의 "대화 온도" 시각화
- **기능**: 시간대별 대화 열기 그래프, 최고 온도 순간 하이라이트
- **시각화**: 온도계 UI + 타임라인

### 우선순위 낮음 (구현 난이도 높음)

#### 2. 대화 리포트 카드 (`/report`)
- **컨셉**: 월간/연간 대화 통계 인포그래픽
- **기능**: "올해 가장 많이 한 말", "새벽 대화 빈도" 등
- **바이럴 포인트**: 연말 결산 스타일 공유용 카드

#### 3. 싸움 패턴 분석기 (`/fight`)
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

새 콘텐츠 구현 시 참고할 기존 코드:
- `apps/character-analyzer/` - 최신 패턴 (퀴즈 + 카톡 분석 듀얼모드, 레이더차트, 갤러리)
- `apps/mockexam-analyzer/` - URL 공유 패턴 (통계/행동 패턴 추출)
- `apps/katalk-analyzer/src/components/` - 기본 UI 컴포넌트
- `workers/api-proxy/src/index.ts` - API 엔드포인트 패턴
