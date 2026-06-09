# Finance Tracker — Multi-Agent AI Workflow

## Project Overview
Personal finance tracking app for recording income and expenses.
Single-user, no authentication. Thai Baht (THB) currency.

**Repository**: https://github.com/Aekkasitrun/Record-income-and-expenses.git

---

## IMPORTANT: Session Start Protocol

**At the start of EVERY conversation in this project, read these files before doing anything else:**

```
ARCHITECTURE.md   ← system design, ER diagram, API routes, env vars
CONVENTIONS.md    ← naming rules, commit format, import order, patterns
ROADMAP.md        ← current phase, pending tasks, completion status
```

Do not skip this step even if you remember the project from a previous session. These files may have changed.

---

## Documentation Auto-Update Rules

After completing any significant work, **proactively update the relevant files without waiting to be asked.** Apply these rules after every change that is confirmed working:

| Change Made | Files to Update |
|------------|----------------|
| New feature implemented | `ROADMAP.md` (mark task done) + `CLAUDE.md` (Feature Modules if new module) |
| New database table or column | `ARCHITECTURE.md` (ER diagram + table list) |
| New API endpoint added | `ARCHITECTURE.md` (API routes table) |
| New environment variable | `ARCHITECTURE.md` (env vars table) + `.env.example` |
| New naming rule established | `CONVENTIONS.md` |
| New code pattern or architecture decision | `CLAUDE.md` (Code Standards section) |
| Phase completed | `ROADMAP.md` (progress table + actual date) |
| New module added | `CLAUDE.md` (Feature Modules) + `ARCHITECTURE.md` (Component Diagram) |

Update these files in the **same response** as the change — do not defer to a later turn.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS v4 + MUI v7 |
| Backend | NestJS 11 + TypeScript |
| ORM | Prisma v5 |
| Database | PostgreSQL 16 |
| State | Zustand v5 |
| Forms | react-hook-form v7 + zod v4 |
| HTTP | axios v1 |
| Infra | Docker + docker-compose |

**Ports**: Frontend: 3000 | Backend API: 4000 | PostgreSQL: 5432 | Swagger: `/api/docs`

---

## Project Structure

```
Record-income-and-expenses/
├── CLAUDE.md                    ← This file (AI workflow guide)
├── ARCHITECTURE.md              ← System design, ER diagram, API routes
├── CONVENTIONS.md               ← Naming rules, patterns, commit format
├── ROADMAP.md                   ← Feature phases and completion status
├── docker-compose.yml           ← Production
├── docker-compose.dev.yml       ← Development (hot reload)
├── .env.example
├── frontend/                    ← React SPA
│   ├── src/
│   │   ├── components/layout/   ← AppLayout
│   │   ├── components/ui/       ← StatCard, AmountChip, CategoryBadge, ConfirmDialog, LanguageToggle, ThemeModeToggle
│   │   ├── components/forms/    ← TransactionForm, CategoryForm, SubCategoryForm
│   │   ├── pages/               ← Dashboard, Transactions, Categories, Reports
│   │   ├── stores/              ← Zustand: transactionStore, categoryStore, subCategoryStore, uiStore
│   │   ├── services/            ← axios: api.ts, transactionService, categoryService, subCategoryService, reportService
│   │   ├── types/               ← TypeScript: transaction.ts, category.ts, report.ts
│   │   ├── schemas/             ← Zod: transactionSchema, categorySchema, subCategorySchema
│   │   ├── i18n/                ← react-i18next config + locales/en.json, locales/th.json
│   │   ├── utils/               ← locale.ts (formatCurrency), iconMap.tsx
│   │   └── theme/theme.ts       ← MUI v7 custom theme (createAppTheme(mode))
│   └── Dockerfile
└── backend/                     ← NestJS API
    ├── src/
    │   ├── prisma/              ← PrismaService, PrismaModule (Global)
    │   ├── modules/
    │   │   ├── transactions/    ← CRUD + summary endpoint
    │   │   ├── categories/      ← CRUD (guard: cannot delete if transactions exist)
    │   │   ├── sub-categories/  ← CRUD (guard: cannot delete if transactions exist)
    │   │   └── reports/         ← monthly, yearly, by-category
    │   └── common/filters/      ← HttpExceptionFilter
    ├── prisma/
    │   ├── schema.prisma        ← Category, SubCategory, Transaction models + TransactionType enum
    │   └── seed.ts              ← 12 default categories
    └── Dockerfile
```

---

## Multi-Agent AI Workflow

When working on this project, Claude follows a multi-agent PM pattern.
Each task flows through specialized agents:

```
User Request
    │
    ▼
┌─────────────┐
│  PM Agent   │  — Orchestrator: reads requirements, sequences agents
└──────┬──────┘
       │
       ├──► Agent 1: UX/UI      → invoke /frontend-design skill
       │                           Scope: components/layout/, components/ui/, theme/
       │                           Rules: MUI v7 as base, Tailwind utilities for spacing
       │
       ├──► Agent 2: Frontend   → invoke /senior-frontend skill
       │                           Scope: pages/, stores/, services/, hooks/
       │                           Rules: Zustand for state, @/ alias, no `any`
       │
       ├──► Agent 3: Backend    → invoke /senior-backend skill
       │                           Scope: backend/src/modules/, backend/prisma/
       │                           Rules: thin controllers, service holds Prisma
       │
       ├──► Agent 4: Tester     → Jest (backend) + Vitest + React Testing Library (frontend)
       │                           Backend: test/ folder, Supertest integration tests
       │                           Frontend: *.test.tsx alongside components
       │
       └──► Agent 5: Reporter   → invoke /git-commit-helper skill
                                   Output: change summary + git commit message
```

### When to invoke each agent

| Trigger | Agent | Skill |
|---|---|---|
| New page, layout change, color/theme | UX/UI | `/frontend-design` |
| New component, store, API integration | Frontend | `/senior-frontend` |
| New endpoint, DTO, Prisma schema change | Backend | `/senior-backend` |
| After any feature completion | Tester | (none) |
| After any code change | Reporter | `/git-commit-helper` |
| Architecture decision, new feature planning | Architect | `/senior-architect` |
| Pull request review | Reviewer | `/code-reviewer` |
| Performance audit | Perf | `/react-best-practices` |

---

## Feature Modules

| Module | Location | Description |
|--------|----------|-------------|
| **Transactions** | `backend/src/modules/transactions/` | CRUD, summary, filters (type, category, sub-category, date range), pagination |
| **Categories** | `backend/src/modules/categories/` | CRUD, type filter, `isFavourite` toggle, guarded delete |
| **Sub-categories** | `backend/src/modules/sub-categories/` | CRUD, `categoryId` filter, guarded delete |
| **Reports** | `backend/src/modules/reports/` | monthly, yearly, by-category aggregation with sub-category breakdown |

---

## Code Standards

### i18n (Bilingual TH/EN) — Required for all new UI text

The app supports Thai (default) and English via `react-i18next`.

**Rule: every hardcoded user-facing string MUST have a translation key.**

```
src/i18n/locales/en.json   ← English strings
src/i18n/locales/th.json   ← Thai strings
```

Key structure:
```
nav.*           — App name, nav labels
dashboard.*     — Dashboard page
transactions.*  — Transactions page
categories.*    — Categories page
reports.*       — Reports page
forms.*         — Shared form labels & buttons
ui.*            — Generic: cancel, confirm
store.*         — Snackbar messages from Zustand stores
language.*      — Language toggle label
```

**In components** — use the `useTranslation` hook:
```tsx
const { t } = useTranslation()
<Typography>{t('dashboard.title')}</Typography>
```

**In Zustand stores** — import i18n singleton directly (no hook):
```typescript
import i18n from '@/i18n/index'
useUiStore.getState().showSnackbar(i18n.t('store.transactionAdded'), 'success')
```

**Currency formatting** — always use `@/utils/locale` (adapts to active locale, never hardcode `'th-TH'`):
```typescript
import { formatCurrency, formatCurrencyCompact } from '@/utils/locale'
```

**dayjs** — locale is set automatically in `@/i18n/index.ts` on init and on language change. Use `dayjs` as normal; month names will appear in the correct language.

**Checklist when adding a new page or feature:**
- [ ] Add all new strings to `en.json` AND `th.json`
- [ ] Use `t('key')` in components, `i18n.t('key')` in stores
- [ ] Use `formatCurrency` from `@/utils/locale`, not `Intl.NumberFormat` directly

---

### Dark / Light Mode

Theme is created via `createAppTheme(mode)` in `src/theme/theme.ts`.
- Light: primary `#003C71`, background `#FFFFFF`
- Dark: primary `#009CDE`, background `#0a1929` (navy-dark), paper `#132f4c`

Mode is toggled via `useUiStore().toggleThemeMode()` and persisted in `localStorage`.
`App.tsx` calls `useMemo(() => createAppTheme(themeMode), [themeMode])`.

**When adding new components**, rely on MUI's `palette.mode` and semantic tokens (`background.default`, `background.paper`, `text.primary`) — avoid hardcoding hex colors that only work in one mode.

---

### TypeScript
- `strict: true` in all tsconfig files
- No `any` types — use `unknown` with type guards if needed
- Prefer `interface` for object shapes, `type` for unions/aliases
- Zod v4: use `error:` not `required_error:` in schema options

### MUI v7 Breaking Changes (Important)
- `fontWeight` is NOT a direct prop on `<Typography>` — use `sx={{ fontWeight: 'bold' }}`
- `InputLabelProps` is deprecated — use `slotProps={{ inputLabel: { shrink: true } }}`
- `inputProps` is deprecated — use `slotProps={{ input: { inputProps: { ... } } }}`
- Grid v2: `size={{ xs: 12, sm: 6, md: 4 }}` (no `item` or `xs` direct props)

### File Naming
- Components: PascalCase (`TransactionForm.tsx`)
- Hooks: camelCase with `use` prefix (`useTransactions.ts`)
- Services: camelCase with `Service` suffix (`transactionService.ts`)
- Stores: camelCase with `Store` suffix (`transactionStore.ts`)
- Types: camelCase (`transaction.ts`)
- DTOs: kebab-case (`create-transaction.dto.ts`)

### Import Style
- Always use `@/` alias for frontend src imports (never `../../`)
- Import order: external packages → internal `@/` → relative `./`

### Frontend Patterns
```tsx
// Zustand store access
const { transactions, fetchTransactions } = useTransactionStore()

// No inline styles — use sx prop or Tailwind classes
<Box sx={{ display: 'flex', gap: 2 }}>

// Form pattern: react-hook-form + zodResolver
const { control, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

### Backend Patterns
```typescript
// Thin controllers — DTO in, response out
@Post()
create(@Body() dto: CreateTransactionDto) {
  return this.transactionsService.create(dto)
}

// Service holds all Prisma queries
// Convert Decimal → number in responses
private serialize(tx: { amount: Prisma.Decimal }) {
  return { ...tx, amount: Number(tx.amount) }
}

// Migrations
npm run prisma:migrate -- --name <description>
```

---

## Git Commit Convention

Format: `<type>(<scope>): <description>`

| Type | Use for |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Restructuring without behavior change |
| `style` | Formatting, UI tweaks |
| `test` | Adding or fixing tests |
| `docs` | Documentation |
| `chore` | Build, deps, CI |
| `db` | Prisma schema or migration |

Scopes: `frontend`, `backend`, `docker`, `prisma`, `docs`

Examples:
```
feat(backend): add monthly report endpoint with income/expense breakdown
fix(frontend): correct decimal amount parsing in TransactionForm
db(prisma): add index on transactions.date for report performance
feat(frontend): implement yearly bar chart on ReportsPage
```

---

## Development Commands

```bash
# Start dev environment (all 3 services with hot reload)
docker-compose -f docker-compose.dev.yml up

# Or run individually:
# Database
docker run --rm -p 5432:5432 -e POSTGRES_DB=finance_tracker_dev -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=devpassword123 postgres:16-alpine

# Backend (from backend/)
npm install
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run start:dev

# Frontend (from frontend/)
npm install
npm run dev
```

```bash
# Database operations (from backend/)
npm run prisma:migrate -- --name <name>   # create & apply migration
npm run prisma:seed                        # seed default categories
npm run prisma:studio                      # visual DB browser (port 5555)
npx prisma migrate deploy                  # apply migrations in production
```

```bash
# Production Docker
docker-compose build
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed
```

```bash
# Type checking
cd frontend && npx tsc --noEmit -p tsconfig.app.json
cd backend && npx tsc --noEmit
```

---

## API Reference

### Transactions
| Method | Path | Description |
|---|---|---|
| GET | `/api/transactions` | List with filters: `?type=&categoryId=&startDate=&endDate=&page=&limit=` |
| GET | `/api/transactions/summary` | Balance summary `?startDate=&endDate=` |
| GET | `/api/transactions/:id` | Get single |
| POST | `/api/transactions` | Create |
| PATCH | `/api/transactions/:id` | Update |
| DELETE | `/api/transactions/:id` | Delete |

### Categories
| Method | Path | Description |
|---|---|---|
| GET | `/api/categories` | List all, optional `?type=INCOME` |
| GET | `/api/categories/:id` | Get single |
| POST | `/api/categories` | Create |
| PATCH | `/api/categories/:id` | Update |
| DELETE | `/api/categories/:id` | Delete (fails if transactions exist) |

### Reports
| Method | Path | Description |
|---|---|---|
| GET | `/api/reports/monthly` | `?year=2026&month=6` |
| GET | `/api/reports/yearly` | `?year=2026` |
| GET | `/api/reports/by-category` | `?type=EXPENSE&startDate=&endDate=` |

Swagger UI: http://localhost:4000/api/docs

---

## Brand Colors (use ONLY these)

```typescript
export const brandColors = {
  navy:     '#003C71',  // Light mode primary
  blue:     '#009CDE',  // Dark mode primary
  royal:    '#315DAE',
  teal:     '#0085AD',
  sky:      '#59CBE8',
  lavender: '#B6B8DC',
  white:    '#FFFFFF',
}
```

Dark theme backgrounds: `#0a1929` (default), `#132f4c` (paper).
Always use MUI semantic tokens (`background.default`, `text.primary`) — never hardcode hex colors that only work in one mode.
