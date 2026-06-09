# ROADMAP.md

## Project: Finance Tracker (Record-income-and-expenses)

> This roadmap reflects the actual implemented state. Update as features are completed or priorities change.

---

## Phase 0 — Foundation
**Goal:** Working development environment, all tooling configured

- [x] Scaffold frontend (React 19 + Vite + TypeScript + Tailwind CSS v4 + MUI v7)
- [x] Scaffold backend (NestJS 11 + Prisma v5)
- [x] PostgreSQL 16 via Docker Compose (dev + prod compose files)
- [x] i18n setup (Thai + English via react-i18next, dayjs locale auto-switching)
- [x] MUI v7 theme with brand colors + dark/light mode toggle (persisted in localStorage)
- [x] Base layout: AppLayout, Sidebar, ThemeModeToggle, LanguageToggle
- [x] Zustand stores: transactionStore, categoryStore, uiStore
- [x] Axios service layer: api.ts, transactionService, categoryService
- [x] CONVENTIONS.md, CLAUDE.md, ARCHITECTURE.md, ROADMAP.md

---

## Phase 1 — Core CRUD
**Goal:** Primary user workflows functional end-to-end

- [x] Categories: create, edit, delete, list with optional type filter (INCOME/EXPENSE/INVESTMENT)
- [x] Categories: default seed data (12 categories via `prisma:seed`)
- [x] Categories: guarded delete (fails if transactions reference the category)
- [x] Transactions: create, edit, delete
- [x] Transactions: list with filters (type, categoryId, date range, pagination)
- [x] Transactions: summary endpoint (totalIncome, totalExpense, totalInvestment, balance)
- [x] Dashboard page with summary StatCards
- [x] TransactionForm with category selector and amount validation

### Definition of Done for Phase 1
- All listed features implemented and manually tested
- API endpoints documented in Swagger (`/api/docs`)
- Thai + English translations for all new UI text
- Works correctly in both dark and light mode

---

## Phase 2 — Extended Features
**Goal:** Complete feature set with reporting and sub-categories

- [x] INVESTMENT transaction type (3rd type alongside INCOME/EXPENSE)
- [x] Sub-categories (หมวดหมู่ย่อย): CRUD, linked to parent category
- [x] Sub-categories: guarded delete (fails if transactions reference sub-category)
- [x] Sub-categories: optional filter in transaction list
- [x] Favourite categories: star toggle, sorted to top of category lists
- [x] TransactionForm: favourite categories shown first
- [x] Reports page: monthly breakdown (income/expense/investment by month)
- [x] Reports page: yearly summary (12-month chart data)
- [x] Reports page: by-category breakdown with sub-category nesting
- [x] Date filter on TransactionsPage (year/month selects; replaced date range pickers)

### Definition of Done for Phase 2
- All Phase 1 criteria met
- Sub-category relationships correctly handled in all CRUD flows
- Report aggregations tested against real data

---

## Phase 3 — Polish & Quality
**Goal:** Production-ready, tested, documented

- [ ] TypeScript strict check passes on all packages (`npx tsc --noEmit`)
- [ ] Unit tests for backend service layer — transactions, categories, sub-categories (Jest)
- [ ] Frontend component tests for TransactionForm, CategoryForm (Vitest + RTL)
- [ ] E2E test for critical path: create → list → edit → delete transaction
- [ ] Production build verification (docker-compose build + up)
- [ ] README.md user-facing documentation update (TH)
- [ ] Performance audit: minimize unnecessary re-renders in transaction list

### Definition of Done for Phase 3
- `npx tsc --noEmit` exits with 0 errors on both frontend and backend
- All service-layer functions have at least one unit test
- Docker production build starts and serves correctly

---

## Backlog (Future / Nice-to-have)

- Recurring transactions / scheduled entries
- CSV / Excel export of transactions
- Budget planning with monthly limits and alerts
- Charts and trend visualization on Dashboard (Recharts or Chart.js)
- Multi-currency support
- Bulk import from bank statements
- Print / PDF report generation

---

## Progress Tracking

| Phase | Status | Target | Actual |
|-------|--------|--------|--------|
| Phase 0 — Foundation | Complete | 2025-Q4 | 2025-Q4 |
| Phase 1 — Core CRUD | Complete | 2026-Q1 | 2026-Q1 |
| Phase 2 — Extended Features | Complete | 2026-Q2 | 2026-Q2 |
| Phase 3 — Polish & Quality | In Progress | 2026-Q3 | — |

---

## Known Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Decimal precision bugs in reports | Low | High | Always use `Decimal(15,2)` in Prisma; serialize to `Number` only in API response layer |
| Migration conflicts when adding columns | Low | Medium | One migration per feature branch; never squash migrations |
| i18n key drift (EN/TH out of sync) | Medium | Low | Checklist in CLAUDE.md enforced per PR |
