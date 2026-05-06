# agri-finance-admin

A full-stack admin platform for managing agricultural finance — banks, cooperatives, farms, loan programs, and loan applications across multiple organisation types.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 + TypeScript, Vuetify, Pinia, Vue Router, ApexCharts |
| Build | Vite |
| API | Vercel Functions (Node.js, `@vercel/node`) |
| Database | PostgreSQL (`pg`) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Hosting | Vercel (primary), GitHub Pages (alt SPA build) |

## Domain Model

The app serves three organisation types with role-scoped views:

- **Dimitra** — platform admins; manage banks, cooperatives, users, and loan programs.
- **Bank** — manage their own loan programs and review applications.
- **Cooperative / Farmer** — register farms, browse available loans, submit applications, track their own loans.

Core entities: `User`, `Bank`, `Cooperative`, `Farm`, `LoanProgram`, `LoanApplication`.

## Repository Layout

```
agri-finance-admin/
├── api/                       # Vercel serverless functions
│   ├── _lib/                  # db client, request handler, auth helpers
│   ├── auth/                  # login, me
│   ├── banks.ts               # /api/banks (+ /api/banks/:id via vercel.json rewrite)
│   ├── cooperatives.ts
│   ├── farms.ts
│   ├── users.ts
│   ├── loan-programs.ts
│   ├── loan-applications.ts
│   ├── application-form.ts
│   └── dashboard.ts
├── src/
│   ├── App.vue, main.ts
│   ├── router/                # route table with role-based meta guards
│   ├── stores/                # Pinia stores per resource (auth, banks, farms, …)
│   ├── views/
│   │   ├── LoginView.vue, ProfileView.vue, SettingsView.vue
│   │   └── finance/           # dashboard + CRUD views per resource
│   ├── layouts/               # DefaultLayout shell
│   ├── components/            # shared UI (StatusChip, etc.)
│   ├── composables/           # useTranslation, etc.
│   ├── locales/               # en / es / fr translation bundles
│   ├── plugins/vuetify.ts
│   ├── services/api.ts        # fetch wrapper + token store
│   └── types/                 # shared TypeScript types
├── scripts/
│   ├── schema.sql             # PostgreSQL DDL
│   ├── seed.ts / seed.sql     # data seeding
│   └── generate-seed-sql.ts
├── public/                    # static assets (favicon, icons)
├── vercel.json                # framework config + /api/:resource/:id rewrites
└── vite.config.ts             # base path switches on `--mode ghpages`
```

## API Surface

All endpoints live under `/api`. Resource collections use a single file (`api/banks.ts`); single-record routes (`/api/banks/:id`) are implemented via `vercel.json` rewrites to `?id=:id` query params.

| Endpoint | Methods |
|---|---|
| `/api/auth/login`, `/api/auth/me` | POST, GET |
| `/api/banks`, `/api/cooperatives`, `/api/farms`, `/api/users` | GET / POST / PATCH / DELETE |
| `/api/loan-programs`, `/api/loan-applications` | GET / POST / PATCH / DELETE |
| `/api/application-form` | POST |
| `/api/dashboard` | GET |

## Frontend Routing

`createWebHistory` + role-aware guards. Top-level routes:

- `/login` (public)
- `/finance/dashboard` (default after auth)
- `/finance/{banks,cooperatives,users,loan-programs,loan-applications}` — Dimitra/Bank scoped CRUD
- `/finance/{my-farms,my-loans,available-loans}` — Cooperative/Farmer views
- `/profile`, `/settings`

Guards check `meta.allowedOrgTypes` against `authStore.userRole`.

## Local Development

```bash
npm install
npm run dev          # Vite dev server (frontend only)
npm run dev:api      # vercel dev (frontend + serverless API)
npm run seed         # populate PostgreSQL via scripts/seed.ts
npm run build        # type-check + production build
```

Required env vars (see `.env.example`): `DATABASE_URL`, `JWT_SECRET`.

## Deployment

- **Vercel** — push to a branch; preview deployments build with `base: '/'`.
- **GitHub Pages** — `npm run deploy` runs `vite build --mode ghpages` so assets are emitted under `/FiscalFarmFrontend/`, then publishes `dist/` via `gh-pages`.

The split is handled in `vite.config.ts`:

```ts
base: mode === 'ghpages' ? '/FiscalFarmFrontend/' : '/'
```
