# CONVENTIONS.md

## Project: Finance Tracker (Record-income-and-expenses)

---

## File & Directory Naming

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `TransactionForm.tsx`, `StatCard.tsx` |
| Hooks | camelCase with `use` prefix | `useTransactions.ts` |
| Services | camelCase with `Service` suffix | `transactionService.ts` |
| Stores | camelCase with `Store` suffix | `transactionStore.ts` |
| Utilities / helpers | camelCase | `locale.ts`, `iconMap.tsx` |
| Types | camelCase | `transaction.ts`, `category.ts` |
| Zod schemas | camelCase with `Schema` suffix | `transactionSchema.ts` |
| Test files | same name + `.test` or `.spec` | `TransactionForm.test.tsx` |
| NestJS modules | kebab-case directories | `sub-categories/` |
| NestJS files | `name.type.ts` | `transactions.service.ts`, `transactions.controller.ts` |
| NestJS DTOs | kebab-case | `create-transaction.dto.ts` |

---

## TypeScript

- Strict mode enabled (`"strict": true` in all tsconfig files)
- Prefer `interface` for object shapes, `type` for unions and aliases
- No `any` — use `unknown` and narrow with type guards
- Zod v4: use `error:` (not `required_error:`) in schema options
- Convert Prisma `Decimal` → `number` in backend service `serialize()` before returning

---

## MUI v7 Breaking Changes (Required)

- `fontWeight` is NOT a direct prop on `<Typography>` — use `sx={{ fontWeight: 'bold' }}`
- `InputLabelProps` is deprecated — use `slotProps={{ inputLabel: { shrink: true } }}`
- `inputProps` is deprecated — use `slotProps={{ input: { inputProps: { ... } } }}`
- Grid v2: `size={{ xs: 12, sm: 6, md: 4 }}` — no `item` or `xs` direct props

---

## React Component Patterns

- Functional components only (no class components)
- One component per file
- No inline styles — use `sx` prop or Tailwind utility classes
- Avoid prop drilling beyond 2 levels — use Zustand stores

```tsx
// Zustand store access
const { transactions, fetchTransactions } = useTransactionStore()

// sx prop for layout
<Box sx={{ display: 'flex', gap: 2 }}>

// Form pattern
const { control, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

---

## Imports Order

1. React and React-related (`react`, `react-dom`, `react-router-dom`)
2. Third-party libraries (`@mui/material`, `axios`, `i18next`, `zod`)
3. Internal modules via `@/` alias (`@/hooks/`, `@/components/`, `@/stores/`, `@/utils/`)
4. Relative imports (`./`, `../`)
5. Type imports (`import type ...`)

Always use `@/` alias for frontend src imports — never use `../../`.

---

## i18n Rules

- Every hardcoded user-facing string MUST have a translation key in both `en.json` and `th.json`
- Thai (`th`) is the default locale; English (`en`) is secondary
- In components: use `useTranslation()` hook → `t('key')`
- In Zustand stores: import `i18n` singleton directly → `i18n.t('key')` (hooks not allowed outside React)
- Currency: always use `formatCurrency` / `formatCurrencyCompact` from `@/utils/locale` — never `Intl.NumberFormat` directly

```typescript
// In stores
import i18n from '@/i18n/index'
useUiStore.getState().showSnackbar(i18n.t('store.transactionAdded'), 'success')

// In components
const { t } = useTranslation()
<Typography>{t('dashboard.title')}</Typography>
```

**i18n key namespaces:**
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

---

## Dark / Light Mode

- Always use MUI semantic tokens: `background.default`, `background.paper`, `text.primary`
- Never hardcode hex colors that only work in one mode
- Theme is set via `createAppTheme(mode)` in `src/theme/theme.ts`
- Mode toggled via `useUiStore().toggleThemeMode()`, persisted in `localStorage`

---

## Backend Patterns

```typescript
// Thin controllers — DTO in, response out
@Post()
create(@Body() dto: CreateTransactionDto) {
  return this.transactionsService.create(dto)
}

// Service holds all Prisma queries
// Convert Decimal → number in every response
private serialize(tx: { amount: Prisma.Decimal }) {
  return { ...tx, amount: Number(tx.amount) }
}
```

---

## API & Route Naming

- Routes: lowercase, hyphen-separated, plural nouns — `/api/sub-categories`
- No versioning prefix in this project (`/api/resource`, not `/api/v1/resource`)
- HTTP methods follow REST semantics: GET=read, POST=create, PATCH=update, DELETE=remove
- NestJS DTOs: PascalCase with suffix — `CreateTransactionDto`, `UpdateCategoryDto`, `QueryTransactionDto`

---

## Git Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/short-description` | `feature/sub-categories` |
| Bug fix | `fix/short-description` | `fix/decimal-rounding` |
| Documentation | `docs/short-description` | `docs/architecture` |
| Refactor | `refactor/short-description` | `refactor/report-service` |
| Release | `release/version` | `release/1.0.0` |

---

## Commit Message Format (Conventional Commits)

```
<type>(<scope>): <short summary>
```

**Types:**

| Type | Use for |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Restructuring without behavior change |
| `style` | Formatting, UI tweaks |
| `test` | Adding or fixing tests |
| `docs` | Documentation |
| `chore` | Build, deps, CI |
| `db` | Prisma schema or migration |

**Scopes:** `frontend`, `backend`, `docker`, `prisma`, `docs`

Examples:
```
feat(backend): add monthly report endpoint with income/expense breakdown
fix(frontend): correct decimal amount parsing in TransactionForm
db(prisma): add index on transactions.date for report performance
feat(frontend): implement yearly bar chart on ReportsPage
```

---

## Environment Variables

- All secrets in `.env` (never committed to git)
- Template in `.env.example` (always committed, placeholder values only)
- NestJS reads via `ConfigModule` — avoid `process.env` directly in services

---

## Modules in This Project

| Module | Scope | Key Features |
|--------|-------|-------------|
| `transactions` | `backend/src/modules/transactions/` | CRUD, summary aggregation, filters (type, category, date range), pagination |
| `categories` | `backend/src/modules/categories/` | CRUD, type filter, isFavourite toggle, guarded delete (fails if transactions exist) |
| `sub-categories` | `backend/src/modules/sub-categories/` | CRUD, categoryId filter, guarded delete |
| `reports` | `backend/src/modules/reports/` | monthly, yearly, by-category aggregation with sub-category breakdown |

---

## Testing

- Backend unit tests: co-located with source — `*.spec.ts` (Jest + Supertest)
- Frontend component tests: co-located — `*.test.tsx` (Vitest + React Testing Library)
- E2E tests: `backend/test/` and `frontend/e2e/`
- Minimum coverage target: 70% for backend service layer
- Use factory functions for test data — no hardcoded magic values
