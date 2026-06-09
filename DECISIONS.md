# DECISIONS.md

## Project: Finance Tracker (Record-income-and-expenses)

> Architecture and technology decisions log. Every significant "why did we choose X?" must be recorded here.
> Purpose: prevent revisiting settled decisions, onboard new team members, help Claude understand constraints.
> Update this file whenever a new decision is made — do not ask the user to remind you.

---

## How to Add a Decision

Copy this template and fill it in:

```
### [DECISION-NNN] Title
- **Date:** YYYY-MM-DD
- **Status:** Accepted | Superseded by DECISION-XXX | Deprecated
- **Decision:** What was decided (1–2 sentences)
- **Reason:** Why this was chosen over alternatives
- **Alternatives considered:** What else was evaluated
- **Consequences:** What this means for the project going forward
```

---

## Decisions

### [DECISION-001] Frontend: React 19 + Vite over Next.js
- **Date:** 2026-06-09
- **Status:** Accepted
- **Decision:** Use React 19 + Vite as the frontend framework instead of Next.js.
- **Reason:** This project is a SPA with a separate NestJS backend. SSR/SSG (Next.js strengths) provide no benefit here. Vite gives faster dev builds and simpler configuration.
- **Alternatives considered:** Next.js (rejected — SSR overhead for API-backed SPA), Create React App (rejected — no longer maintained)
- **Consequences:** No server-side rendering. All routing is client-side via react-router-dom. API calls always go to the NestJS backend.

---

### [DECISION-002] Backend: NestJS 11 over Express/Fastify
- **Date:** 2026-06-09
- **Status:** Accepted
- **Decision:** Use NestJS 11 as the backend framework.
- **Reason:** TypeScript-first, built-in DI container, decorators, guards, pipes, and excellent Prisma integration. Enforces consistent module structure.
- **Alternatives considered:** Express + TypeScript (rejected — too much boilerplate, no structure enforcement), Fastify + Zod (rejected — lighter but lacks NestJS ecosystem)
- **Consequences:** All modules follow NestJS module/controller/service pattern. Use NestJS-native features (Guards, Pipes, Filters) instead of raw middleware.

---

### [DECISION-003] ORM: Prisma v5 over TypeORM
- **Date:** 2026-06-09
- **Status:** Accepted
- **Decision:** Use Prisma v5 as the ORM for PostgreSQL access.
- **Reason:** Type-safe generated client, excellent migration tooling, readable schema language, and better DX than TypeORM decorators. Prisma Studio is useful for debugging.
- **Alternatives considered:** TypeORM (rejected — decorator-heavy, migration reliability issues), Drizzle (rejected — less ecosystem maturity)
- **Consequences:** Schema lives in `prisma/schema.prisma`. Never write raw SQL. Migrations run via `npm run prisma:migrate` inside the container.

---

### [DECISION-004] No authentication — single-user personal app
- **Date:** 2026-06-09
- **Status:** Accepted
- **Decision:** This app has no login/auth system. It is a personal finance tracker for a single user, run locally or on a private server.
- **Reason:** Adding JWT auth would add complexity (token management, refresh flow, guards) with zero benefit since there is only one user and no sensitive multi-user data isolation required.
- **Alternatives considered:** JWT auth (rejected — unnecessary complexity for single-user), Basic Auth (rejected — same reasoning)
- **Consequences:** No auth guards on any endpoint. No user model in Prisma. If deployed publicly, protect via network/reverse-proxy access control instead.

---

### [DECISION-005] State Management: Zustand v5 over React Query / Context
- **Date:** 2026-06-09
- **Status:** Accepted
- **Decision:** Use Zustand v5 for all global client state, including server-fetched data.
- **Reason:** Zustand is lightweight, simple API, no boilerplate. Since there's no complex server-state caching requirement (single-user, no real-time updates), full React Query setup is unnecessary overhead.
- **Alternatives considered:** React Query (rejected — overkill for single-user CRUD with no cache invalidation complexity), React Context (rejected — verbose, causes excessive re-renders for app-wide state)
- **Consequences:** All server data lives in Zustand stores (`transactionStore`, `categoryStore`, etc.). Stores manually trigger re-fetches after mutations. Use `i18n.t()` singleton (not hook) inside stores.

---

### [DECISION-006] CSS: Tailwind CSS v4 + MUI v7 together
- **Date:** 2026-06-09
- **Status:** Accepted
- **Decision:** Use MUI v7 components as the base with Tailwind CSS v4 for layout/utility classes.
- **Reason:** MUI provides accessible, theme-aware components. Tailwind handles spacing and layout without writing CSS files. Both work together when used for different concerns.
- **Alternatives considered:** MUI only (rejected — limited utility class flexibility), Tailwind only (rejected — building accessible components from scratch is expensive)
- **Consequences:** Use `sx` prop or `styled()` for MUI component customization. Use Tailwind only for layout/positioning on wrapper elements. Do not mix both for the same property on the same element. Note MUI v7 breaking changes documented in CONVENTIONS.md.

---

### [DECISION-007] i18n: react-i18next with dayjs locale binding
- **Date:** 2026-06-09
- **Status:** Accepted
- **Decision:** Use react-i18next for frontend i18n. Thai is the default locale.
- **Reason:** Simple `useTranslation()` hook API, JSON translation files, good TypeScript support. dayjs locale is auto-switched in `src/i18n/index.ts` so month names always match the active language.
- **Alternatives considered:** react-intl (rejected — more complex ICU format API for simple use cases)
- **Consequences:** All strings in `th.json` and `en.json`. Components use `useTranslation()` hook. Zustand stores use `i18n.t()` singleton directly. Currency uses `formatCurrency` from `@/utils/locale`, never `Intl.NumberFormat` directly.

---

<!-- Add new decisions below this line -->
