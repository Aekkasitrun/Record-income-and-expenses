# GOTCHAS.md

## Project: Finance Tracker (Record-income-and-expenses)

> Known problems, traps, and non-obvious behaviors encountered in this project.
> When you fix a tricky bug or discover a non-obvious behavior — add it here immediately.
> This file is for future-you and the team. Write it like you're warning a colleague.

---

## How to Add a Gotcha

```
### [GOTCHA-NNN] Short title describing the trap
- **Area:** Frontend | Backend | Database | Docker | i18n | Other
- **Symptom:** What you saw / what broke
- **Root cause:** Why it happened
- **Fix / Workaround:** What solved it
- **Date found:** YYYY-MM-DD
```

---

## Gotchas

### [GOTCHA-001] Prisma migrate must run inside Docker
- **Area:** Database
- **Symptom:** `prisma migrate dev` fails with connection error when run from host machine
- **Root cause:** The PostgreSQL service is only accessible inside the Docker network. The host machine cannot reach it on the default port unless you expose it explicitly.
- **Fix / Workaround:** Always run migrations inside the container: `docker-compose exec backend npm run prisma:migrate -- --name <description>` or use `docker-compose -f docker-compose.dev.yml exec backend ...`
- **Date found:** 2026-06-09

---

### [GOTCHA-002] MUI v7 + Tailwind CSS class conflicts
- **Area:** Frontend
- **Symptom:** Tailwind utility classes (e.g. `p-4`, `text-sm`) sometimes get overridden by MUI's injected CSS
- **Root cause:** MUI injects its styles with higher specificity than Tailwind utilities at runtime
- **Fix / Workaround:** For MUI components, use the `sx` prop instead of Tailwind utilities. Use Tailwind only for layout/positioning on non-MUI wrapper elements.
- **Date found:** 2026-06-09

---

### [GOTCHA-003] MUI v7 breaking changes — props that no longer work
- **Area:** Frontend
- **Symptom:** TypeScript errors or silent style failures when using old MUI prop patterns
- **Root cause:** MUI v7 removed/deprecated several commonly used props
- **Fix / Workaround:**
  - `fontWeight` on `<Typography>` → use `sx={{ fontWeight: 'bold' }}`
  - `InputLabelProps` on inputs → use `slotProps={{ inputLabel: { shrink: true } }}`
  - `inputProps` on inputs → use `slotProps={{ input: { inputProps: { ... } } }}`
  - Grid v2: no `item` or `xs` direct props → use `size={{ xs: 12, sm: 6 }}`
- **Date found:** 2026-06-09

---

### [GOTCHA-004] Zod v4: use `error:` not `required_error:`
- **Area:** Frontend / Backend
- **Symptom:** Zod validation messages don't appear; TypeScript may show a type error on the schema option key
- **Root cause:** Zod v4 changed the option key from `required_error` to `error`
- **Fix / Workaround:** Use `z.string({ error: 'กรุณากรอกข้อมูล' })` — not `required_error`
- **Date found:** 2026-06-09

---

### [GOTCHA-005] Prisma Decimal is not a plain number — must serialize
- **Area:** Backend
- **Symptom:** `amount` field comes back as a Prisma `Decimal` object, not a number. JSON serialization produces `{}` or unexpected format.
- **Root cause:** Prisma stores `Decimal(15,2)` as a custom `Decimal` class, not a JS `number`
- **Fix / Workaround:** Always call `Number(tx.amount)` in the service's `serialize()` method before returning to the controller. Never return raw Prisma objects directly.
- **Date found:** 2026-06-09

---

### [GOTCHA-006] react-i18next not re-rendering outside React components
- **Area:** Frontend / i18n
- **Symptom:** Snackbar messages or store-triggered text don't update when language is switched
- **Root cause:** `t()` from `useTranslation()` only works inside React components. Zustand store functions run outside the component tree and don't react to language changes via the hook.
- **Fix / Workaround:** In Zustand stores, import `i18n` singleton directly and use `i18n.t('key')` — not the `useTranslation` hook.
  ```typescript
  import i18n from '@/i18n/index'
  useUiStore.getState().showSnackbar(i18n.t('store.transactionAdded'), 'success')
  ```
- **Date found:** 2026-06-09

---

### [GOTCHA-007] Sub-category selector must clear when parent category changes
- **Area:** Frontend
- **Symptom:** Stale sub-category value remains selected after switching to a different category, causing a mismatch (sub-category doesn't belong to the new category)
- **Root cause:** react-hook-form field value is not automatically reset when a dependency field changes
- **Fix / Workaround:** Watch the `categoryId` field and call `setValue('subCategoryId', null)` in a `useEffect` when it changes. Already implemented in `TransactionForm.tsx`.
- **Date found:** 2026-06-09

---

<!-- Add new gotchas below this line as they are discovered -->
