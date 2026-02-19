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
└── menhera-analyzer/    # 맨헤라 분석기 (localhost:3002)

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
- 엔드포인트: `/api/analyze`, `/api/analyze-menhera`

## 개발 명령어

```bash
pnpm dev              # 전체 개발 서버
pnpm dev:portal       # 포털만
pnpm dev:katalk       # 카톡 분석기만
pnpm dev:menhera      # 맨헤라 분석기만
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

### MBTI 분석기 (`apps/mbti-analyzer/`) - 완료

**모든 파일 완료:**
- `package.json`, `vite.config.ts` (port 3003, base: '/mbti/')
- `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`
- `index.html`, `public/favicon.svg`
- `src/types/mbti.ts` - 타입 정의
- `src/services/chatParser.ts` - 카톡 파싱 (iOS/Android 지원)
- `src/services/analysisService.ts` - API 호출
- `src/components/layout/Header.tsx`
- `src/components/upload/DragDropZone.tsx`
- `src/components/upload/FileUploader.tsx`
- `src/components/tier/TierSelector.tsx` - 티어 선택 UI
- `src/components/analysis/MBTIChart.tsx` - MBTI 4축 시각화
- `src/components/analysis/AnalysisResult.tsx` - 결과 화면
- `src/App.tsx` - 메인 앱
- `src/index.css` - 스타일시트

**Workers:**
- `/api/analyze-mbti` 엔드포인트 추가 완료

**포털 연동:**
- ServiceGrid에서 MBTI 서비스 활성화 완료

**빌드 설정:**
- `scripts/merge-builds.js`에 mbti-analyzer 추가 완료
- `package.json`에 `dev:mbti` 스크립트 추가 완료

### 이후 구현 순서
1. ✅ MBTI 대화 스타일 분석 (완료)
2. ❌ 이모티콘 성격 분석 (폐기 - 카톡 내보내기 시 기본 이모티콘만 지원)
3. ⏳ 관계 점수 측정 (`/relationship`)

## Coming Soon 서비스

구현 예정 서비스 (ServiceGrid.tsx 참조):
- `/mbti` - MBTI 대화 스타일 분석 (현재 구현 중)
- `/emoji` - 이모티콘 성격 분석
- `/relationship` - 관계 점수 측정

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

MBTI 분석기 구현을 계속하려면:
```
MBTI 분석기 구현을 이어서 진행해줘. CLAUDE.md에서 "아직 생성 필요한 파일" 목록부터 시작해.
```

참고할 기존 코드:
- `apps/katalk-analyzer/src/components/tier/TierSelector.tsx` - 티어 선택 UI
- `apps/katalk-analyzer/src/components/analysis/AnalysisResult.tsx` - 결과 화면
- `apps/katalk-analyzer/src/App.tsx` - 상태 관리 패턴
