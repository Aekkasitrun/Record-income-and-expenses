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
DESIGN.md         ← brand colors, theme rules, component patterns
DECISIONS.md      ← why we chose each technology (do not re-debate)
GOTCHAS.md        ← known traps and non-obvious behaviors
```

Do not skip this step even if you remember the project from a previous session. These files may have changed.

---

## Documentation Auto-Update Rules

After completing any significant work, **proactively update the relevant files without waiting to be asked.** Apply these rules after every change that is confirmed working:

| Change Made | Files to Update |
|------------|----------------|
| New feature implemented | `ROADMAP.md` (mark task done) + `CHANGELOG.md` (Unreleased section) |
| New database table or column | `ARCHITECTURE.md` (ER diagram + table list) |
| New API endpoint added | `ARCHITECTURE.md` (API routes table) |
| New environment variable | `ARCHITECTURE.md` (env vars table) + `.env.example` |
| New naming rule established | `CONVENTIONS.md` |
| New UI/theme decision | `DESIGN.md` (Updates table) |
| New technology decision made | `DECISIONS.md` (add DECISION-NNN entry) |
| Tricky bug fixed or non-obvious behavior found | `GOTCHAS.md` (add GOTCHA-NNN entry) |
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
├── DESIGN.md                    ← Brand colors, theme, component patterns
├── DECISIONS.md                 ← Technology decision log (why we chose X)
├── GOTCHAS.md                   ← Known traps and non-obvious behaviors
├── CHANGELOG.md                 ← Completed work log (updated by Reporter)
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
| **Transactions** | `backend/src/modules/transactions/` | CRUD, summary, filters (type, category, sub-category, year/month), pagination; filter state persisted to localStorage (`txFilters`) |
| **Categories** | `backend/src/modules/categories/` | CRUD, type filter, `isFavourite` toggle, guarded delete |
| **Sub-categories** | `backend/src/modules/sub-categories/` | CRUD, `categoryId` filter, guarded delete |
| **Reports** | `backend/src/modules/reports/` | monthly, yearly, by-category aggregation with sub-category breakdown |

---

## Code Standards

> Full rules live in dedicated files — read them at session start.
> - **Naming, TypeScript, MUI v7, patterns, commits** → `CONVENTIONS.md`
> - **Colors, theme, dark/light mode, component patterns** → `DESIGN.md`
> - **API endpoints, env vars** → `ARCHITECTURE.md`

### i18n — Checklist for every new feature

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

**Currency** — always use `@/utils/locale` (never hardcode `'th-TH'`):
```typescript
import { formatCurrency, formatCurrencyCompact } from '@/utils/locale'
```

**Per-feature checklist:**
- [ ] Add all new strings to `en.json` AND `th.json`
- [ ] Use `t('key')` in components, `i18n.t('key')` in stores
- [ ] Use `formatCurrency` from `@/utils/locale`, not `Intl.NumberFormat` directly

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

> Full API reference → `ARCHITECTURE.md` | Commit format → `CONVENTIONS.md` | Brand colors → `DESIGN.md`
