# DESIGN.md

## Project: Finance Tracker (Record-income-and-expenses)

> Design system and UI rules for this project. All UI work must follow these standards.
> Update this file whenever a new UI decision is made — do not ask the user to remind you.

---

## Brand Identity

### Color Palette (use ONLY these — no exceptions)

| Token | Hex | Usage |
|-------|-----|-------|
| `navy` | `#003C71` | Primary (light mode): buttons, headers, sidebar |
| `blue` | `#009CDE` | Primary (dark mode): buttons, links, highlights |
| `royal` | `#315DAE` | Secondary buttons, active nav items |
| `teal` | `#0085AD` | Success states, badges, data visualizations |
| `sky` | `#59CBE8` | Hover states, light accents, chip backgrounds |
| `lavender` | `#B6B8DC` | Disabled states, borders, subtle backgrounds |
| `white` | `#FFFFFF` | Page background (light mode), card surfaces |

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Heading 1 | Sarabun | 700 | 2rem |
| Heading 2 | Sarabun | 600 | 1.5rem |
| Body | Sarabun | 400 | 1rem |
| Caption | Sarabun | 400 | 0.75rem |
| Code | JetBrains Mono | 400 | 0.875rem |

> Use **Sarabun** font (supports Thai + Latin) — available via Google Fonts.

---

## Theme: Dark / Light Mode

All components must work correctly in both modes. Test both before marking a feature done.

| Element | Light | Dark |
|---------|-------|------|
| Page background | `#FFFFFF` | `#0a1929` |
| Card/surface | `#F5F7FA` | `#132f4c` |
| Primary text | `#003C71` (navy) | `#FFFFFF` |
| Secondary text | `#5C6B7A` | `#B6B8DC` (lavender) |
| Border | `#B6B8DC` | `#315DAE` |
| Primary button | `#003C71` bg + white text (light) | `#009CDE` bg + white text (dark) |
| Disabled | `#B6B8DC` bg + white text | same |

Theme is created via `createAppTheme(mode)` in `src/theme/theme.ts`.
Mode toggled via `useUiStore().toggleThemeMode()`, persisted in `localStorage`.

**Rule:** Always use MUI semantic tokens (`background.default`, `background.paper`, `text.primary`) — never hardcode hex colors that only work in one mode.

---

## Responsive Breakpoints (MUI defaults — do not override)

| Breakpoint | Width | Target |
|-----------|-------|--------|
| `xs` | 0px | Mobile portrait |
| `sm` | 600px | Mobile landscape / small tablet |
| `md` | 900px | Tablet |
| `lg` | 1200px | Desktop |
| `xl` | 1536px | Large desktop |

---

## Layout Rules

- **AppLayout:** persistent sidebar (lg+), responsive on smaller screens, header always visible
- **Max content width:** 1400px, centered
- **Page padding:** `24px` desktop / `16px` mobile
- **Card radius:** `8px`
- **Button radius:** `6px`
- **Input height:** `40px` default

---

## Accessibility

- All interactive elements must have `aria-label` or visible label
- Color contrast ratio ≥ 4.5:1 for normal text (WCAG AA)
- Focus indicator must be visible (do not suppress `:focus-visible`)
- Icons used as buttons must have `title` or `aria-label`

---

## Component Design Patterns

### Data Tables / Lists
- Always show loading skeleton while fetching
- Empty state: icon + Thai message + optional action button

### Forms
- Label above input (not placeholder-only)
- Show validation errors below the field
- Submit button disabled while submitting (show spinner)
- Use `react-hook-form` + `zodResolver` for all forms

### Modals / Dialogs
- Max width `600px` for forms
- Always have a close button (X) and a Cancel button
- Confirm destructive actions — use `ConfirmDialog` component

### Navigation (Sidebar)
- Active route highlighted with primary color left border + background tint
- Icons from `@mui/icons-material`
- Icon map defined in `src/utils/iconMap.tsx`

### Amount Display
- Use `AmountChip` component — color-coded by transaction type (INCOME=green, EXPENSE=red, INVESTMENT=blue)
- Always use `formatCurrency` / `formatCurrencyCompact` from `@/utils/locale`

### Category Display
- Use `CategoryBadge` component with icon + color dot
- Favourite categories shown first (sorted by `isFavourite DESC`)

---

## Localization UI Rules

- All UI text must exist in both `th.json` and `en.json`
- Thai (`th`) is the default locale; English (`en`) is secondary
- Currency: Thai Baht (THB) — formatted via `formatCurrency` which adapts to active locale
- dayjs locale is set automatically in `src/i18n/index.ts` — month names appear in the correct language
- Language toggle: persisted to `localStorage`

---

## Updates

| Date | Change | Author |
|------|--------|--------|
| 2026-06-09 | Initial design system from project setup | PM Agent |
