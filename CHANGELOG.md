# CHANGELOG.md

## Project: Finance Tracker (Record-income-and-expenses)

> Human-readable log of completed work. Updated by the Reporter Agent after every merged feature.
> Format: newest entries at the top. Use semantic versioning for releases.
> Do NOT just copy git log — write what changed from the user's perspective.

---

## Unreleased

> Work completed but not yet in a versioned release.

### Added
- **Clone transaction** — copy icon on each table row pre-fills a new form with the same type/category/amount for fast retroactive batch entry
- **"Add another" mode** — checkbox in TransactionForm keeps the form open after submit (retains all fields, clears only description) for entering consecutive similar transactions
- **Filter persistence** — transaction filter state (type, category, year, month) saved to localStorage (`txFilters`) and restored on page load; "Clear filters" button resets all filters at once

### Changed
- **Transaction date filter** — replaced Start/End date pickers with Year and Month dropdowns for one-click date filtering

### Added
- **Favourite categories** — star toggle on categories; favourites sorted to top of all category selectors
- **INVESTMENT transaction type** — third transaction type alongside INCOME and EXPENSE; tracked separately in summary and reports
- **Date range filter** on Transactions page (startDate / endDate)
- **Sub-category filter** in transaction list
- **Sub-categories (หมวดหมู่ย่อย)** — CRUD for sub-categories linked to parent categories; optional selection in TransactionForm; guarded delete
- **Reports page** — monthly breakdown, yearly summary (12-month), by-category with sub-category nesting
- **Date range filter** on Transactions page
- **Transaction summary** — income / expense / investment / balance stats on Dashboard
- **Transactions CRUD** — create, edit, delete transactions with type, category, sub-category, date, description, amount
- **Categories CRUD** — create, edit, delete categories; type filter (INCOME / EXPENSE / INVESTMENT); guarded delete; 12 seeded defaults
- **Dashboard page** — summary StatCards showing balance, total income, total expense, total investment
- **Bilingual UI (TH/EN)** — react-i18next with Thai as default; language toggle persisted to localStorage; dayjs locale auto-switches
- **Dark / Light mode** — MUI v7 theme with PSU brand colors; toggle persisted to localStorage
- **Base layout** — AppLayout with sidebar navigation, ThemeModeToggle, LanguageToggle
- **Project documentation** — CLAUDE.md, ARCHITECTURE.md, CONVENTIONS.md, ROADMAP.md, DESIGN.md, DECISIONS.md, GOTCHAS.md, CHANGELOG.md
- **Docker Compose setup** — dev (hot reload) and production compose files

---

## How to Add a Changelog Entry

When completing a feature, add it under **Unreleased** in the appropriate category:

- **Added** — new feature or capability
- **Changed** — change to existing behavior
- **Fixed** — bug fix
- **Removed** — removed feature or code
- **Security** — security patch
- **Performance** — performance improvement

When cutting a release, move Unreleased entries under a new versioned section:

```markdown
## [1.0.0] — YYYY-MM-DD

### Added
- ...

### Fixed
- ...
```

---

<!-- Versioned releases appear below as the project progresses -->
