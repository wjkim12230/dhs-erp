# DHS ERP System

대현센서(DHS) 수주/제품/직원 관리 ERP 시스템. 레거시 Spring Boot + Freemarker를 React + Node/Express로 재설계.

## 프로젝트 구조

모노레포 (npm workspaces + Turborepo)

```
dhs/
├── packages/shared/          # 공유 타입, 상수, 유틸 (TypeScript)
├── apps/backend/             # Express + Prisma + PostgreSQL API
├── apps/frontend/            # React + MUI + TanStack Query SPA
└── legacy/dhs-api-admin/     # 레거시 Spring Boot (참고용, 배포 X)
```

## 기술 스택

### Backend
- **Runtime**: Node.js + TypeScript (tsx로 직접 실행, tsc 빌드 X)
- **Framework**: Express
- **ORM**: Prisma (PostgreSQL)
- **Auth**: JWT (access + refresh token), bcrypt
- **Validation**: Zod
- **File Storage**: Cloudflare R2 (S3 호환 API)
- **Port**: 3000

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: MUI (Material UI) v6 — antd에서 전환함
- **Data Grid**: @mui/x-data-grid
- **Date Picker**: @mui/x-date-pickers + dayjs
- **State**: Zustand (auth, sidebar, ordering wizard) + TanStack Query (서버 상태)
- **Notifications**: notistack
- **Build**: Vite
- **Port**: 5173 (dev)

### 배포
- **Frontend**: Vercel (https://dhs-xi.vercel.app)
- **Backend**: Railway (https://dhs-erp-production.up.railway.app)
- **DB**: Railway PostgreSQL
- **GitHub**: https://github.com/wjkim12230/dhs-erp (public)

## 백엔드 모듈 구조

`apps/backend/src/modules/` 아래 각 모듈은 `service.ts`, `controller.ts`, `routes.ts` 패턴:

| 모듈 | API 경로 | 설명 |
|------|----------|------|
| auth | `/api/v1/auth` | 로그인, 토큰 갱신, 내 정보 |
| employee | `/api/v1/employees` | 직원 CRUD + 사번 중복체크 |
| model | `/api/v1/models`, `/api/v1/model-groups` | 제품 모델/그룹/상세 CRUD |
| specification | `/api/v1/specifications` | 사양 + 사양 상세 CRUD |
| drawing | `/api/v1/drawings` | 도면 CRUD |
| check-item | `/api/v1/check-items` | 검사항목 + 상세 CRUD |
| ordering | `/api/v1/orderings` | 수주 CRUD + 완료/삭제/복구/복사 |
| file | `/api/v1/files` | 파일 업로드 (Cloudflare R2) |
| admin | `/api/v1/admins` | 관리자 CRUD + 비밀번호 초기화 (SUPER 전용) |
| settings | `/api/v1/settings` | 앱 설정 조회/수정 |

### 공통 패턴
- 소프트 삭제 (`isDeleted` 필드)
- 낙관적 락 (`version` 필드, 충돌 시 409)
- 감사 필드 (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`)
- 페이지네이션: `?page=1&limit=20` (1-indexed)
- 응답 형식: `{ success: true, data: T, meta?: { page, limit, total, totalPages } }`

## 프론트엔드 구조

### Feature 모듈 패턴

`apps/frontend/src/features/{domain}/` 아래:
- `api/` — API 호출 함수 (apiClient 사용)
- `hooks/` — TanStack Query 훅 (useQuery, useMutation)
- `components/` — 테이블, 폼 컴포넌트
- `pages/` — 라우트에 연결되는 페이지 컴포넌트

### 주요 컴포넌트

| 컴포넌트 | 경로 | 설명 |
|----------|------|------|
| DataTable | `components/common/DataTable.tsx` | MUI DataGrid 래퍼, 커스텀 페이지네이션 |
| StickyActions | `components/common/StickyActions.tsx` | 폼 상단 고정 액션 버튼 |
| EmployeeSelect | `components/common/EmployeeSelect.tsx` | 직원 자동완성 (MUI Autocomplete) |
| DaumAddressSearch | `components/common/DaumAddressSearch.tsx` | 다음 주소 검색 API |
| ImageUpload | `components/common/ImageUpload.tsx` | 이미지 업로드 → R2 |
| StatusTag | `components/common/StatusTag.tsx` | 수주 상태 Chip |
| AdminLayout | `components/layout/AdminLayout.tsx` | 사이드바 + 상단바 + 반응형 |

### DataTable 사용법

```tsx
// columns: GridColDef[] (MUI DataGrid 형식)
// rows: any[] (id 필드 필수)
// page: 0-indexed!
// onPaginationChange: (model: GridPaginationModel) => void
<DataTable
  columns={columns}
  rows={data}
  total={100}
  page={0}         // 0-indexed
  pageSize={20}
  loading={false}
  onPaginationChange={(m) => setFilters({ page: m.page + 1, limit: m.pageSize })}
/>
```

### 폼 패턴

- `useState`로 폼 상태 관리 (antd Form 사용 X)
- `StickyActions`로 등록/수정/취소 버튼 상단 고정
- `useSnackbar()`로 성공/에러 알림
- `Grid container spacing={3}`으로 레이아웃

### 라우팅

`apps/frontend/src/app/App.tsx`에서 React Router v6, lazy loading:
- `/login` — 로그인
- `/dashboard` — 대시보드
- `/employees` — 직원 관리
- `/models`, `/model-groups` — 모델 관리
- `/specifications` — 사양 관리
- `/drawings` — 도면 관리
- `/check-items` — 검사항목
- `/orderings` — 수주 관리 (탭: 진행중/완료/삭제)
- `/admins` — 관리자 (SUPER 전용)
- `/settings` — 앱 설정

## Prisma 스키마

`apps/backend/prisma/schema.prisma` — 18개 모델:
Admin, Employee, ModelGroup, Model, ModelDetail, Specification, SpecificationDetail, Drawing, DrawingToSpecification, CheckItem, CheckItemDetail, Ordering, OrderingToSpecification, OrderingToCheck, OrderForm, OrderFormEmployee, FileEntity, AppSetting

## 환경변수

### Backend (Railway)
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_ACCESS_EXPIRY=12h
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=https://dhs-xi.vercel.app
NODE_ENV=production
PORT=3000
R2_ACCOUNT_ID=...          # Cloudflare R2 (선택)
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=dhs-files
R2_PUBLIC_URL=...
```

### Frontend (Vercel)
```
VITE_API_URL=https://dhs-erp-production.up.railway.app/api/v1
```

## 로컬 개발

```bash
npm install
cd apps/backend && cp .env.example .env  # DB URL 설정
npx prisma db push                       # 스키마 적용
npx tsx prisma/seed.ts                   # 초기 데이터
cd ../..
npm run dev:backend                      # localhost:3000
npm run dev:frontend                     # localhost:5173
```

로그인: `superadmin` / `admin1234`

## 배포

```bash
# Frontend → Vercel
vercel --prod

# Backend → Railway (CLI 업로드)
railway up --service dhs-erp
```

Railway 빌드 설정:
- Root Directory: (비움, 모노레포 루트)
- Build Command: `npm run build:backend`
- Start Command: `npm run start:backend`

## 주요 결정 사항

- **OrderForm(발주서) 기능 제거** — 사용자 요청으로 제외
- **tsc 빌드 대신 tsx 런타임** — Railway 배포 시 모노레포 타입 충돌 회피
- **CORS**: `origin: true` (모든 오리진 허용 + credentials)
- **Prisma migrate 대신 db push** — migration 파일 없이 스키마 직접 적용
- **UI: Ant Design → MUI 전환** — 사용자 요청으로 전환
- **사이드바 흰색 배경** — 로고 배경이 흰색이라 맞춤
- **브랜드 컬러**: `#005BAC` (DHS 로고 파란색)
