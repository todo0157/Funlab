# Content Portal (FunLab)

재미있는 콘텐츠 분석 서비스를 모아놓은 포털 사이트입니다.

## 프로젝트 구조

```
content-portal/
├── apps/
│   ├── portal/           # 메인 포털 사이트
│   └── katalk-analyzer/  # 카톡 호감도 분석기
├── packages/
│   └── ui/               # 공유 UI 컴포넌트
└── workers/
    └── api-proxy/        # Cloudflare Workers API
```

## 기술 스택

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Cloudflare Workers
- **AI**: OpenAI GPT-3.5-turbo
- **Deployment**: Cloudflare Pages

## 시작하기

### 1. 의존성 설치

```bash
# pnpm이 없다면 설치
npm install -g pnpm

# 의존성 설치
pnpm install
```

### 2. 환경 변수 설정

```bash
# apps/katalk-analyzer/.env.local
VITE_API_URL=http://localhost:8787
```

### 3. 개발 서버 실행

```bash
# 모든 앱 동시 실행
pnpm dev

# 또는 개별 실행
pnpm dev:portal    # 포털 (http://localhost:3000)
pnpm dev:katalk    # 카톡 분석기 (http://localhost:3001)
```

### 4. Workers 로컬 실행

```bash
cd workers/api-proxy

# OpenAI API 키 설정
wrangler secret put OPENAI_API_KEY

# 로컬 서버 실행
pnpm dev  # http://localhost:8787
```

## 빌드

```bash
# 모든 앱 빌드
pnpm build
```

## 배포

### Cloudflare Pages

1. Cloudflare 대시보드에서 Pages 프로젝트 생성
2. Git 저장소 연결
3. 빌드 설정:
   - 빌드 명령어: `pnpm turbo run build --filter=portal`
   - 출력 디렉토리: `apps/portal/dist`

### Cloudflare Workers

```bash
cd workers/api-proxy

# 프로덕션 배포
wrangler deploy

# API 키 설정
wrangler secret put OPENAI_API_KEY
```

## 서비스 소개

### 1. 카톡 호감도 분석기

카카오톡 대화를 AI가 분석하여:
- **호감도**: 누가 더 좋아하는지 백분율로 표시
- **테토력**: 텍스트 대화 능력 측정
- **에겐력**: 애교 표현력 측정

## 라이선스

MIT License
