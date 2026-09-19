# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Imperi e Rivoluzioni" — a static Astro blog on contemporary history and geopolitics. All user-facing copy, content and content metadata is **in Italian**; code identifiers and comments are mostly English. Keep that split when adding code.

## Commands

```sh
npm run dev                  # dev server on http://localhost:4321
npx astro dev --background   # preferred per AGENTS.md; stop/status/logs subcommands
npm run build                # static build into dist/
npm run preview              # serve dist/ (needed before e2e)
npx astro check              # template + type diagnostics

npm run test:unit            # vitest, tests/unit
npm run test:integration     # vitest, tests/integration — runs a real `astro build`
npm run test:e2e             # playwright, tests/e2e
npm test                     # all three in sequence
```

Single test: `npx vitest run tests/unit/helpers.test.ts -t "formats a Date"`, or `npx playwright test -g "opens the mobile navigation"`.

There is no vitest config file — vitest runs on defaults and the suites are separated by directory path in the npm scripts.

Playwright has **no `webServer`**; it targets `http://127.0.0.1:4321`, so start `npm run dev` or `npm run build && npm run preview` in another process before `test:e2e`.

`tests/integration/build.test.ts` shells out to `node_modules/astro/bin/astro.mjs build` at module load and asserts on emitted `dist/` HTML, so it is slow and it overwrites `dist/`.

## Architecture

Feature-based, four top-level source areas under `src/`:

- `pages/` — routes only. Page files fetch collections with `getCollection` and compose feature sections; they hold no reusable logic.
- `features/<domain>/` — domain sections + cards (`ArticlesSection` + `ArticleCard`, `ReadingSection` + `ReadingCard` + `ReadingTagFilters`, …), each with its own `assets/` where needed.
- `shared/` — cross-domain pieces: `ui/` (Button, Card), `forms/`, `components/` (Navbar, Footer), `lib/cn.ts`, `utils/constants.ts` (blog name, social URLs, contact mail), `utils/variants.ts` (CVA definitions).
- `core/` — `layouts/MainLayout.astro` (the only layout: html shell, global.css import, Navbar/slot/Footer) and `helpers/` (pure functions, re-exported from `helpers/index.ts`).

Imports are relative throughout — no path aliases are configured.

### Content collections

`src/content.config.ts` defines three glob-loaded collections with Zod schemas: `articles`, `readings`, `projects`.

- `articles` frontmatter: `title, description, tags[], topic, category, slug`. Routing uses the **explicit `slug` field** as the `[id]` param. Files live in topic subfolders (`src/content/articles/giappone/…`); the subfolder is organizational only — grouping in the UI comes from `topic` + `category`.
- `readings` frontmatter: `name, author, description, tags[], topic, amazonUrl` (validated as a URL). Routing uses the **auto-generated `reading.id`**, not a frontmatter field.
- `projects` is declared in the schema but `src/content/projects/` does not exist. `features/projects/` and `features/certificates/` are leftovers from the pre-rebrand portfolio site and are not referenced by any page. Don't wire them back in without being asked; a `getCollection("projects")` call will fail the build.

`src/pages/articles/index.astro` currently hardcodes its topic/category sections and filters the collection inline. Adding a new topic means adding a section there.

### Interactivity

No Astro UI-framework integrations. Two mechanisms only:

- **Alpine.js** for anything in-page (mobile menu, tag filtering, active-card state) via `x-data` on markup. Alpine is imported and `Alpine.start()`ed in a single `<script>` in `shared/components/Navbar.astro` — since Navbar renders on every page via MainLayout, that one call bootstraps Alpine site-wide. Do not add a second `Alpine.start()`. The import needs `// @ts-expect-error` (the package ships no declarations). `[x-cloak]` is handled in `global.css`.
- Plain `<script>` modules for non-UI browser work, e.g. the EmailJS submit handler in `features/contact/ContactMe.astro`, which reads config from `data-*` attributes and silently falls back to the form's `mailto:` action when `PUBLIC_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` are unset.

Per AGENTS.md: prefer Alpine over vanilla JS for interactivity, and move business logic out of components into `core/helpers/`.

### Styling

Tailwind v4 through the `@tailwindcss/vite` plugin (no `tailwind.config`); the single entry is `src/styles/global.css`, imported by MainLayout.

The palette is expressed as **built-in Tailwind utilities**, not custom color names — paper `stone-100`, charcoal `stone-900`, antique gold `amber-700`, rust red `red-700`. Fonts: Playfair Display (headings, set globally on `h1`–`h6`), Lora (body), Special Elite via the `.font-dispatch` class. The raw hexes and a few `!important` hero overrides live in `global.css`.

Buttons go through `shared/ui/Button.astro`, which merges `cva` variants from `utils/variants.ts` with `cn()` (clsx + tailwind-merge) and renders `<a>` or `<button>` depending on whether `href` is passed. Add new variants to `variants.ts` rather than ad-hoc classes.

`PALETTE.md` (referenced by AGENTS.md) and `ROADMAP.md` exist locally but are **gitignored**, so they may be absent in a fresh clone — the palette/typography facts above are the fallback.

### Accessibility

The existing pages follow conventions the e2e tests assert on: semantic landmarks, `aria-labelledby` linking sections to their heading ids (e.g. `#articles-title`), `aria-expanded` on the mobile menu toggle, `role="status"` + `aria-live` for form feedback, Italian `aria-label`s. Match these when adding sections.
