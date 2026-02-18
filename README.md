# FunLab - AI 콘텐츠 분석 포털

재미있는 AI 기반 콘텐츠 분석 서비스를 모아놓은 포털 사이트입니다.

## 라이브 서비스

- **메인 사이트**: https://funlab.pages.dev
- **카톡 호감도 분석기**: https://funlab.pages.dev/katalk/
- **맨헤라 분석기**: https://funlab.pages.dev/menhera/

## 프로젝트 구조

```
content-portal/
├── apps/
│   ├── portal/              # 메인 포털 사이트 (/)
│   ├── katalk-analyzer/     # 카톡 호감도 분석기 (/katalk)
│   └── menhera-analyzer/    # 맨헤라 분석기 (/menhera)
├── packages/
│   └── ui/                  # 공유 UI 컴포넌트
├── workers/
│   └── api-proxy/           # Cloudflare Workers API
└── scripts/
    └── merge-builds.js      # 빌드 병합 스크립트
```

## 기술 스택

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS 3
- **Animation**: Framer Motion
- **Backend**: Cloudflare Workers
- **AI**: OpenAI GPT-3.5-turbo (Free) / GPT-4-turbo (Premium)
- **Deployment**: Cloudflare Pages + Workers
- **Monorepo**: pnpm + Turborepo

## 서비스 소개

### 1. 카톡 호감도 분석기 (/katalk)
카카오톡 1:1 대화를 AI가 분석하여:
- **호감도**: 누가 더 좋아하는지 백분율로 표시
- **테토력**: 텍스트 대화 능력 측정
- **에겐력**: 애교 표현력 측정

### 2. 맨헤라 분석기 (/menhera)
단체 톡방 대화를 분석하여:
- **맨헤라 순위**: 참여자별 맨헤라력 랭킹
- **5가지 지표**: 감정기복, 심야활동, 부정표현, 관심요구, 의존성
- **재미있는 칭호**: 새벽감성 맨헤라, 관종 맨헤라 등

### 3. Coming Soon
- MBTI 대화 스타일 분석
- 이모티콘 성격 분석
- 관계 점수 측정

## 유료 기능 (Premium)

| 구분 | Free | Premium (3,900원) |
|------|------|-------------------|
| 메시지 분석 | 200~300개 샘플 | 최대 5,000개 전체 |
| AI 모델 | GPT-3.5-turbo | GPT-4-turbo |
| 분석 품질 | 기본 | 정밀 분석 |

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

```bash
# workers/api-proxy/.dev.vars
OPENAI_API_KEY=sk-...
```

### 3. 개발 서버 실행

```bash
# 모든 앱 동시 실행
pnpm dev

# 개별 실행
pnpm dev:portal    # 포털 (http://localhost:3000)
pnpm dev:katalk    # 카톡 분석기 (http://localhost:3001)
pnpm dev:menhera   # 맨헤라 분석기 (http://localhost:3002)
```

### 4. Workers 로컬 실행

```bash
cd workers/api-proxy
pnpm dev  # http://localhost:8787
```

## 빌드 & 배포

```bash
# 전체 빌드 (Cloudflare Pages용)
pnpm build:pages

# Workers 배포
cd workers/api-proxy && npx wrangler deploy
```

## API 엔드포인트

- `GET /api/health` - 헬스 체크
- `POST /api/analyze` - 카톡 호감도 분석
- `POST /api/analyze-menhera` - 맨헤라 분석

## 라이선스

MIT License
