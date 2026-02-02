# SOJ Backoffice

SQL Practice 관리자 백오피스 웹 애플리케이션

## Build Commands

- `npm run dev` - 개발 서버 실행
- `npm run build` - TypeScript 컴파일 및 프로덕션 빌드
- `npm run lint` - ESLint 실행
- `npm run preview` - 프로덕션 빌드 미리보기

## Tech Stack

- **Framework:** React 18 + TypeScript 5
- **Build:** Vite 5
- **UI:** Ant Design 5
- **State:** Zustand (인증), TanStack Query (서버 상태)
- **HTTP:** Axios
- **Form:** React Hook Form + Zod
- **Editor:** @uiw/react-md-editor, @uiw/react-codemirror

## Architecture

```
src/
├── api/           # API 클라이언트 및 엔드포인트
├── components/    # 재사용 컴포넌트
├── hooks/         # 커스텀 훅 (React Query)
├── pages/         # 페이지 컴포넌트
├── stores/        # Zustand 스토어
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

## Environment Variables

```env
VITE_API_BASE_URL=https://api.example.com
VITE_ES_BASE_URL=https://elasticsearch.example.com
VITE_KIBANA_URL=https://kibana.example.com
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/login` | LoginPage | 관리자 로그인 |
| `/` | DashboardPage | 대시보드 |
| `/problems` | ProblemListPage | 문제 목록 |
| `/problems/create` | ProblemCreatePage | 문제 생성 |
| `/problems/:id` | ProblemDetailPage | 문제 상세/수정 |
| `/submissions` | SubmissionListPage | 제출 목록 |
| `/submissions/:problemId/:submissionId` | SubmissionDetailPage | 제출 상세 |
| `/logs` | LogMonitorPage | 로그 모니터링 |

## API Endpoints

- `POST /admin/login` - 관리자 로그인
- `GET/POST /problems` - 문제 목록/생성
- `GET/PATCH/DELETE /problems/:id` - 문제 조회/수정/삭제
- `GET/POST /problems/:id/testcases` - 테스트케이스 목록/생성
- `GET/PATCH/DELETE /problems/:id/testcases/:id` - 테스트케이스 조회/수정/삭제
- `GET /problems/:id/submissions` - 제출 목록
- `GET /problems/:id/submissions/:id` - 제출 상세

## Deployment

Vercel 배포 설정 완료 (`vercel.json`)
