# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Before doing anything, check:
1. PROJECT_OVERVIEW.md
2. PALETTE.md
3. ROADMAP.md
So that you'll have a complete overview of the project's current state

## Project

"Imperi e Rivoluzioni" — a static Astro blog on contemporary history and geopolitics. All user-facing copy, content and content metadata is **in Italian**; code identifiers and comments are mostly English. Keep that split when adding code.

## Commands

```sh
npm run dev                  # dev server on http://localhost:4321
npx astro dev --background   # background dev server; stop/status/logs subcommands
npm run dev:cms              # dev server + Keystatic admin at /keystatic (KEYSTATIC=1 via cross-env)
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

Playwright has **no `webServer`**; it targets `http://127.0.0.1:4321`, so start `npm run build && npx astro preview --host 127.0.0.1 --background` before `test:e2e`.

`tests/integration/build.test.ts` shells out to `node_modules/astro/bin/astro.mjs build` at module load and asserts on emitted `dist/` HTML, so it is slow and it **overwrites `dist/`**. It forces `NODE_ENV=production` on that child build: vitest's `NODE_ENV=test` would otherwise leak in and compile Vercel Analytics to its external debug script, which stalls page loads for any e2e run served from that `dist/`.

In e2e tests, call `transitionFinished(page)` after a client-side navigation before clicking again: while a view transition animates, clicks hit the transition overlay and are silently dropped.

## Architecture

Feature-based, four top-level source areas under `src/`:

- `pages/` — routes only. Page files fetch collections with `getCollection` and compose feature sections; they hold no reusable logic.
- `features/<domain>/` — domain sections + cards (`ArticlesSection` + `ArticleCard`, `ReadingSection` + `ReadingCard` + `ReadingTagFilters`, …), each with its own `assets/` where needed.
- `shared/` — cross-domain pieces: `ui/` (Button, Card, Tabs, TabPanel), `forms/`, `components/` (Navbar, Footer), `lib/cn.ts`, `types/` (every type and interface, behind a type-only barrel), `utils/constants.ts` (blog name, social URLs, contact mail, `HOME_PREVIEW_COUNT`, `GITHUB_REPO`), `utils/variants.ts` (CVA definitions).
- `core/` — `layouts/MainLayout.astro` (the only layout: html shell, global.css import, Navbar/slot/Footer, Vercel Analytics), `helpers/` (pure functions, re-exported from `helpers/index.ts`), `schemas/envSchema.ts` and `config/envParser.ts` (environment validation, see below).

Imports are relative throughout — no path aliases are configured.

### Content collections

`src/content.config.ts` defines two glob-loaded collections with Zod schemas: `articles` and `readings`.

- `articles` frontmatter: `title, description, pubDate, updatedDate?, author (default "Elia Giolli"), featured (default false), order, tags[], topic, category, slug`. Routing uses the **explicit `slug` field** as the `[id]` param — two articles have a `slug` that differs from their filename, and those are live URLs. Files live in topic subfolders (`src/content/articles/giappone/…`); the subfolder is organizational only — grouping in the UI comes from `topic` + `category`.
- `readings` frontmatter: `name, author, description, tags[], topic, amazonUrl` (validated as a URL), `addedDate` (when the book entered the bibliography; orders the homepage). Routing uses the **auto-generated `reading.id`**, not a frontmatter field.

`src/pages/articles/index.astro` currently hardcodes its topic/category sections and filters the collection inline. Adding a new topic means adding a section there.

### CMS (Keystatic) and environment

`keystatic.config.ts` mirrors both Zod schemas **field for field, in the same order** — change them together. Zod stays the source of truth and re-validates whatever Keystatic writes. Constraints it is shaped around:

- Keystatic's `slugField` lives in the filename, and keys missing from its schema are **stripped on save**. The article URL is therefore a separate `slug` text field; `fields.slug` on `title` only names the file.
- Bodies are `fields.mdx({ extension: "md" })`, never `fields.markdoc` (which rewrites GFM tables into `{% table %}` tags). The editor has no indented-code node: write code blocks and ASCII diagrams **fenced**, or they are flattened on the next save.
- All content is already in Keystatic's serialization, so a CMS edit is a one-line diff. Hand edits in a different YAML style will be rewritten on the next CMS save.

`astro.config.mjs` validates the environment through `parseEnv()` (Zod schema in `core/schemas/envSchema.ts`; it reads `.env` itself because the config runs before Vite loads it) and adds the Vercel adapter plus the `react()`/`keystatic()` integrations only when `isCmsEnabled()`: `KEYSTATIC=1`, or `VERCEL=1` with `PUBLIC_KEYSTATIC_STORAGE=github`. Everything else — `npm run build`, `astro preview`, both test suites — stays a plain static build in `dist/`. A CMS-enabled build writes to `.vercel/output/` instead. `.env.example` lists every variable; add new ones to `envSchema` too.

### Interactivity

No UI-framework integrations on the public site (React exists only inside the `/keystatic` admin). Two mechanisms only:

- **Alpine.js** for anything in-page (mobile menu, tag filtering, homepage tab carousels, theme toggle) via `x-data` on markup. Alpine is imported and `Alpine.start()`ed in a single `<script>` in `shared/components/Navbar.astro` — since Navbar renders on every page via MainLayout, that one call bootstraps Alpine site-wide. Do not add a second `Alpine.start()`. The import needs `// @ts-expect-error` (the package ships no declarations). `[x-cloak]` is handled in `global.css`.
- Plain `<script>` modules for non-UI browser work, e.g. the EmailJS submit handler in `features/contact/ContactMe.astro`, which reads config from `data-*` attributes and silently falls back to the form's `mailto:` action when `PUBLIC_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` are unset.

`shared/ui/Tabs.astro` + `TabPanel.astro` implement the WAI-ARIA tabs pattern (roving tabindex, arrow keys with wrap, Home/End) with one Alpine scope per `idPrefix`. Tab 0's active state is server-rendered and panel 0 is never cloaked, so a group renders correctly before Alpine starts and without JavaScript.

Prefer Alpine over vanilla JS for interactivity, and move business logic out of components into `core/helpers/`.

### Styling

Tailwind v4 through the `@tailwindcss/vite` plugin (no `tailwind.config`); the single entry is `src/styles/global.css`, imported by MainLayout.

The palette is expressed as **built-in Tailwind utilities**, not custom color names — paper `stone-100`, charcoal `stone-900`, antique gold `amber-700`, rust red `red-700`. Fonts: Playfair Display (headings, set globally on `h1`–`h6`), Lora (body), Special Elite via the `.font-dispatch` class. The raw hexes and a few `!important` hero overrides live in `global.css`.

Buttons go through `shared/ui/Button.astro`, which merges `cva` variants from `utils/variants.ts` with `cn()` (clsx + tailwind-merge) and renders `<a>` or `<button>` depending on whether `href` is passed. Add new variants to `variants.ts` rather than ad-hoc classes.

`PALETTE.md` and `PROJECT_OVERVIEW.md` exist locally but are **gitignored**, so they may be absent in a fresh clone — the palette/typography facts above are the fallback. `ROADMAP.md` **is** tracked: tick items off in the same PR that completes them.

### Accessibility

The existing pages follow conventions the e2e tests assert on: semantic landmarks, `aria-labelledby` linking sections to their heading ids (e.g. `#articles-title`), `aria-expanded` on the mobile menu toggle, `role="status"` + `aria-live` for form feedback, the WAI-ARIA tabs keyboard pattern on the homepage, Italian `aria-label`s. Match these when adding sections.
