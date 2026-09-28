<div align="center">

# 🏛️ Imperi e Rivoluzioni

**A historical and geopolitical analysis platform for long-form essays, long-period reconstructions and structural commentary.**

[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Alpine.js](https://img.shields.io/badge/Alpine.js-3-77C1D2?style=flat-square&logo=alpinedotjs&logoColor=white)](https://alpinejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%E2%89%A522.12-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

---

A static site built with Astro, with no UI-framework integrations on the public pages and zero JavaScript by default. Content lives in typed content collections, edited as Markdown or through a git-backed Keystatic admin; interactivity is handed to Alpine.js only where it genuinely earns its place.

> **Editorial focus** — how democracies are hollowed out from within, state militarism, authoritarian transitions and neglected geopolitical dynamics: Meiji and Shōwa Japan, Weimar Germany, interwar autocracies, the post-colonial Middle East.

## 📑 Contents

- [Site pages](#-site-pages)
- [Project structure](#-project-structure)
- [Content collections](#-content-collections)
- [Architecture and conventions](#-architecture-and-conventions)
- [Design system](#-design-system)
- [SEO and discoverability](#-seo-and-discoverability)
- [Analytics](#-analytics)
- [Content management (Keystatic)](#%EF%B8%8F-content-management-keystatic)
- [Stack](#-stack)
- [Running locally](#-running-locally)
- [Testing and verification](#-testing-and-verification)
- [Environment variables](#-environment-variables)
- [Accessibility](#-accessibility)

## 🧭 Site pages

| Route | Page | What it does |
| --- | --- | --- |
| `/` | 🏠 Front page | Masthead with the issue number and dateline, the latest article as the lead story with its series, the author's note, the latest readings, the Substack box and the letters to the editors |
| `/about` | 👤 About | Bio, working method and editorial line — labelled "Chi sono", the first item in the navbar |
| `/articles` | 📜 Archive | A newspaper index: topics, then series, then parts in reading order, grouped from the content itself |
| `/articles/[id]` | 📖 Article | Series kicker, byline, cover photo, a single justified column with a drop cap, numbered sources with inline `[n]` markers, the whole series, and a reading-progress hairline |
| `/readings` | 📚 Recommended readings | Bibliography, filterable by tag on the client |
| `/readings/[id]` | 🔖 Reading sheet | Extended book entry with an Amazon link |
| `/topics` | 🗺️ Themes | Thematic index crossing articles and readings, plus an analytical index by tag |
| `/contacts` | ✉️ Contacts | Form submitted through EmailJS, with a `mailto:` fallback |
| `/rss.xml` | 📡 Feed | RSS feed of the `articles` collection, newest first |
| `/sitemap-index.xml` | 🗺️ Sitemap | Generated at build time by `@astrojs/sitemap` |
| `/404`, `/500` | ⚠️ Errors | Error pages in Italian, consistent with the site's identity |
| `/keystatic` | ✏️ Admin | Keystatic CMS — only in CMS-enabled builds, disallowed in `robots.txt` and left out of the sitemap |

## 🗂️ Project structure

The project follows a **feature-based** layout: routes hold no reusable logic, domains live in `features/`, and anything cross-cutting sits in `shared/` and `core/`.

```text
.
├── public/
│   ├── googleebfa12ca84c3f0f0.html # Google Search Console ownership proof
│   ├── logo.svg                  # Favicon
│   ├── og-image.png              # Social preview card (1200×630)
│   └── robots.txt                # Points crawlers at the sitemap, keeps them off /keystatic
├── src/
│   ├── content/
│   │   ├── articles/             # Markdown essays, in per-topic subfolders
│   │   └── readings/             # Recommended-reading entries
│   ├── content.config.ts         # Zod schemas for the collections
│   ├── core/
│   │   ├── config/               # envParser: loads and validates the environment
│   │   ├── helpers/              # Pure functions, re-exported from index.ts
│   │   ├── layouts/              # MainLayout: the site's only layout
│   │   └── schemas/              # envSchema: Zod schema for every environment variable
│   ├── features/
│   │   ├── articles/             # LeadStory, SeriesBox
│   │   ├── contact/              # ContactMe and the EmailJS handler
│   │   ├── home/                 # AuthorNote, SubscribeBox
│   │   └── readings/             # ReadingEntry, ReadingTagFilters
│   ├── pages/
│   │   ├── articles/             # index.astro + [id].astro
│   │   ├── readings/             # index.astro + [id].astro
│   │   ├── rss.xml.ts            # RSS endpoint
│   │   └── *.astro               # Routes only: they compose the sections
│   ├── shared/
│   │   ├── components/           # Navbar (masthead + compact, theme store), EditionSwitch, PageHeader, SectionHeading, Footer
│   │   ├── forms/                # Form, Input
│   │   ├── lib/                  # cn(): clsx + tailwind-merge
│   │   ├── types/                # Every type and interface in the codebase
│   │   ├── ui/                   # Button
│   │   └── utils/                # Constants and CVA variants
│   └── styles/                   # global.css: the single Tailwind entry
├── tests/
│   ├── unit/                     # Vitest over the helpers
│   ├── integration/              # Vitest over a real build
│   └── e2e/                      # Playwright over the served site
├── .env.example                  # Every environment variable, documented
├── astro.config.mjs              # Validates the env; adds the CMS only when enabled
├── keystatic.config.ts           # Keystatic schema, mirroring content.config.ts
├── playwright.config.ts
└── package.json
```

Imports are **relative** throughout: no path aliases are configured.

## 📚 Content collections

Two glob-loaded collections, validated with Zod in [`src/content.config.ts`](src/content.config.ts).

### 📜 `articles`

```text
src/content/articles/**/*.md
          │
          ▼
   content.config.ts  ──  schema validation
          │
          ├── /                → LeadStory + SeriesBox (the latest issue)
          ├── /articles        → archiveOf             (topic → series → parts)
          ├── /articles/[id]   → Markdown + sources    (routed on the slug field)
          ├── /topics          → thematic index       (crossed with the readings)
          └── /rss.xml         → feed                 (newest first)
```

| Field | Type | Notes |
| --- | --- | --- |
| `title`, `description` | `string` | |
| `pubDate` | `date` | Required |
| `updatedDate` | `date?` | Shown in the header only when present |
| `author` | `string` | Defaults to `"Elia Giolli"` |
| `featured` | `boolean` | Defaults to `false` |
| `order` | `number` | Sequence within a multi-part cycle |
| `tags` | `string[]` | Feed the analytical index on `/topics` |
| `topic`, `category` | `string` | Drive the grouping in the archive |
| `slug` | `string` | **This is the route's `[id]` parameter**, not the generated id |
| `cover` | `image?` | Optimised by Astro; stored by Keystatic as `@assets/articles/<slug>/cover.jpg`. Never enlarged past its own width |
| `coverAlt` | `string?` | **Required when there is a cover** — the schema refuses one without it |
| `coverCaption`, `coverCredit` | `string?` | Shown under the photo |
| `sources` | `{ author, title, publisher }[]` | Numbered Fonti with ids `fonte-1…n`; the body cites them as `[2](#fonte-2)`, drawn as a superscript `[2]` |

> ⚠️ The subfolder under `src/content/articles/` is organisational only: the grouping in the UI comes from `topic` and `category`.

> ⚠️ Two articles have a `slug` that differs from their filename. Those slugs are live URLs: never rename one after publication.

### 📚 `readings`

```text
src/content/readings/*.md
          │
          ▼
   content.config.ts
          │
          ├── / and /readings   → ReadingEntry       (newest added first)
          ├── ReadingTagFilters → client-side tag filter (Alpine)
          └── /topics           → crossed with the articles by topic and tag
```

| Field | Type | Notes |
| --- | --- | --- |
| `name`, `author`, `description` | `string` | |
| `tags` | `string[]` | |
| `topic` | `string` | |
| `amazonUrl` | `string` | Validated as a URL |
| `addedDate` | `date` | When the book entered the bibliography — orders the homepage section, not the publication date |

Reading routes use the **id Astro generates**, not a frontmatter field.

## 🧩 Architecture and conventions

### 🧠 Logic in helpers, not in components

Pure functions live in `core/helpers/` and are re-exported from `helpers/index.ts`:

| Helper | Purpose |
| --- | --- |
| `formatDate` | Dates in the long Italian format |
| `capitalizeFirstLetter` | Leading capital |
| `readingTime` | Word-count reading estimate, ignoring code, diagrams and Markdown syntax |
| `byReadingOrder` / `byMostRecent` | Comparators for ordering the article listings |
| `byMostRecentlyAdded` | Newest-added-first comparator for the readings, tie-broken on the Italian-collated title |
| `seriesOf` | An article's series (same topic and category) in reading order, with its part and neighbours |
| `editionOf` | The newspaper numbering — one issue per article by publication date, a new year every twelve months |
| `archiveOf` | The archive index: topic → series → parts |
| `leadParagraphs` | The opening prose paragraphs of a Markdown body, as plain text, for the front page |
| `formatDateline`, `toRoman` | "Domenica 13 settembre 2026"; "Parte III", "Anno I" |
| `buildThemeIndex`, `slugifyTheme` | Build the `/topics` index by crossing articles and readings |
| `navLinkCurrent` | The `aria-current` value a navbar link deserves for the current route |
| `validateContactForm`, `contactErrorSummary` | Contact-form rules and the single line announced to screen readers |
| `buildArticleSchema` | The JSON-LD `BlogPosting` payload for article pages |

### 🏷️ Types

Every `type` and `interface` lives in `shared/types/`, split by domain — `content.ts`, `env.ts`, `navigation.ts`, `contact.ts`, `ui.ts` — behind a type-only barrel. Components keep just the local alias Astro needs:

```astro
---
import type { ButtonProps } from "../types";

type Props = ButtonProps;
---
```

### ⚡ Interactivity

No UI-framework integrations on the public pages — React is loaded only inside the `/keystatic` admin. Two mechanisms only:

- **Alpine.js** for anything in-page: the evening-edition switch and the readings tag filter. Alpine is imported and started with a single `Alpine.start()` inside `Navbar.astro` — which, appearing on every page through `MainLayout`, bootstraps it site-wide. **Do not add a second `Alpine.start()`.**
- **Plain `<script>` modules** for non-UI work, such as the EmailJS handler in `ContactMe.astro`.

### 📰 The newspaper layout

- **Header.** The front page prints the full masthead: issue number and the "Edizione della sera" switch, the wordmark as the page's only `h1`, and a dateline whose edition name follows the switch. Every other page gets the compact strip (issue · wordmark · switch). Both end with the section nav, one row at every width that scrolls sideways on a phone — there is no hamburger menu.
- **Issue number.** "Anno I · N. 3" comes from `editionOf`: the latest issue everywhere, the article's own on an article page.
- **Toggled states** are drawn from the attribute Alpine flips (`aria-pressed:bg-ink`), because Alpine's `:class` adds to the server-rendered classes instead of replacing them. Content is never `x-cloak`ed when it should be readable without JavaScript.
- **Reading progress** on article pages is a CSS scroll timeline, no script; browsers without scroll timelines simply don't show it.

### 🔀 View transitions

`<ClientRouter />` sits in `MainLayout`'s head, so navigation happens client-side. Two consequences worth knowing before touching the layout:

- Astro copies the incoming document's `<html>` attributes over the live ones, which drops any class set at runtime. The theme class is re-applied on `astro:after-swap`, an event that fires before the new page paints.
- Alpine's mutation observer picks up the swapped-in `<body>` on its own, so in-page interactivity keeps working without re-initialising it by hand.

### 🌗 Morning and evening editions

The evening edition ("Edizione della sera") is class-driven rather than media-query-only, so the switch in the header can override the OS preference:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

It defaults to `prefers-color-scheme` and persists an explicit choice in `localStorage`; while no choice has been made, it keeps following the OS live. An inline script in the head applies the stored theme **before the first paint**, so there is no flash of the wrong palette. Every `localStorage` access is wrapped in `try`/`catch` — it throws in some privacy modes, and the light theme is the safe fallback.

### 🔘 UI components

Buttons go through `shared/ui/Button.astro`, which merges the `cva` variants defined in `utils/variants.ts` through `cn()`, and renders `<a>` or `<button>` depending on whether `href` is passed. New variants belong in `variants.ts`, not in ad-hoc classes. Every variant is drawn, never filled: `primary` is the accent outline, `secondary` the ink outline, `ghost` a text link.

### 🌍 Language

All user-facing copy, content and content metadata is **in Italian**; code identifiers, comments, commit messages and this README are **in English**.

## 🎨 Design system

"La Gazzetta": the site is set as a period newspaper — a masthead, datelines, double rules, justified columns. Tailwind v4 runs through the `@tailwindcss/vite` plugin, with no `tailwind.config`: the single entry is `src/styles/global.css`.

### Palette

Colours are **semantic tokens**, declared once with `@theme inline` over `--gz-*` variables. The evening edition redefines the variables on `.dark`, so a component writes `text-ink` or `border-rule` and never pairs `dark:` colours.

| Token | Mattino | Sera | Use |
| --- | --- | --- | --- |
| `paper` | ![#efe6d3](https://img.shields.io/badge/-efe6d3-efe6d3?style=flat-square) `#efe6d3` | ![#1f1d1b](https://img.shields.io/badge/-1f1d1b-1f1d1b?style=flat-square) `#1f1d1b` | Page |
| `ink` | `#201f1d` | `#efe6d3` | Headlines, rules |
| `ink-2` | `#444141` | `#d7d3d3` | Body copy |
| `mute` | `#605d5d` | `#bab6b6` | Datelines, captions, labels |
| `accent` | ![#7d5411](https://img.shields.io/badge/-7d5411-7d5411?style=flat-square) `#7d5411` | ![#e1ad66](https://img.shields.io/badge/-e1ad66-e1ad66?style=flat-square) `#e1ad66` | Kickers, numerals, source markers, the accent button |
| `mark` | `#b68235` | `#c28d41` | Accent outlines, focus rings, reading progress |
| `rule` | `rgba(32,31,29,.2)` | `rgba(239,230,211,.2)` | Faint rules inside sections |

Every text pair clears WCAG AA on its paper. Colour is only ever a line or text, never a filled block — the one inversion is a pressed tag, drawn paper-on-ink. Invalid form fields keep a red edge: an error signal, not a brand colour.

### Rules and frame

| Weight | Utility | Where |
| --- | --- | --- |
| 3px double | `rule-double`, `rule-t-double`, `rule-b-double` | Masthead, section openings, boxes |
| 1px ink | `border-ink` | Datelines, tables, cards of a series |
| 1px faint | `border-rule` | Inside sections, column rules |

`page-frame` is the 1240px broadsheet frame every block sits in; `kicker` is the letter-spaced small-capital label ("In primo piano", "Rubrica").

### Typography

| Use | Font |
| --- | --- |
| Masthead and headlines | **Cormorant Garamond** (`font-heading`) — regular weight at display sizes, italic for deks and quotes |
| Body copy | **Lora** (`font-body`) |

Fonts are loaded from `MainLayout`'s `<head>` with `preconnect` hints, **not** with an `@import` in `global.css` — an `@import` inside the bundled CSS serialises the requests, so the fonts cannot start downloading until the stylesheet has arrived and parsed.

### Long-form reading

`@tailwindcss/typography` is registered with Tailwind v4's `@plugin` directive and its `prose` theme reads the tokens, so one block serves both editions. Running text is justified and hyphenated (the page is `lang="it"`); each `h2` opens with a faint rule, and a Markdown `---` right before a heading is hidden so the two don't stack; tables get ink rules around the header; fenced blocks become double-ruled "schede", kept monospace because the ASCII diagrams align with spaces. The opt-in `.drop-cap` sets the first letter of the opening paragraph.

### 🏃 Motion

Smooth scrolling is opt-in, behind `prefers-reduced-motion: no-preference`. The header is not sticky, so in-page jumps (source markers, the `/topics` index, the series links) need only a small `scroll-padding-top`.

## 🔍 SEO and discoverability

`site` in [`astro.config.mjs`](astro.config.mjs) is the production origin, and everything below is derived from it — canonical URLs, Open Graph tags, the sitemap and the feed all agree on trailing slashes.

| Piece | Where |
| --- | --- |
| Canonical `<link>` | `MainLayout`, built from `Astro.site` with a fallback to `Astro.url` so dev and previews never claim the production URL |
| Open Graph + Twitter Card | `MainLayout`, with `og:type="article"` and published/modified times on article pages |
| `noindex` | An opt-in prop, used by `/404` and `/500` |
| Sitemap | `@astrojs/sitemap`, emitted as `sitemap-index.xml` |
| RSS | `@astrojs/rss` in [`src/pages/rss.xml.ts`](src/pages/rss.xml.ts), advertised with `<link rel="alternate">` |
| JSON-LD | `BlogPosting` on article pages, built by `buildArticleSchema` from the frontmatter rather than from the rendered markup |
| `robots.txt` | `public/robots.txt`, pointing at the sitemap |

## 📈 Analytics

[Vercel Web Analytics](https://vercel.com/docs/analytics) is rendered by `<Analytics />` in `MainLayout`'s head. It is cookieless, so there is no consent banner. The script only reports from a Vercel production deployment; locally it is inert.

Google Search Console ownership is proven by `public/googleebfa12ca84c3f0f0.html`, which the build copies to the site root.

## ✏️ Content management (Keystatic)

[Keystatic](https://keystatic.com/) provides an admin UI at `/keystatic` that reads and writes the same Markdown files as the rest of the site. It is **git-backed**: locally it writes to `src/content/`, and in production it commits to this repository through a GitHub App, so every edit is an ordinary, reviewable commit.

```sh
npm run dev:cms   # then open http://localhost:4321/keystatic
```

`keystatic.config.ts` mirrors the Zod schemas in `content.config.ts` field for field, **in the same order** — change the two together. Zod remains the source of truth and re-validates everything Keystatic writes on the next build.

| Keystatic behaviour | How the config deals with it |
| --- | --- |
| The `slugField` is stored in the **filename**, never in frontmatter | The article URL is a separate, required `slug` text field; `fields.slug` on the title only names the file |
| Frontmatter keys missing from its schema are **stripped on save** | Every Zod field has a Keystatic counterpart |
| `fields.markdoc` rewrites GFM tables into `{% table %}` tags | Bodies use `fields.mdx({ extension: "md" })`, which round-trips plain Markdown |
| Its editor has no indented-code node | Code blocks and ASCII diagrams must be **fenced**, or the next save flattens them |
| It re-serialises YAML in its own style | All content is already normalised, so an edit is a one-line diff |

> ⚠️ Tags are a free-text list per entry: there is no shared vocabulary or autocomplete. `Colonialismo` and `colonialismo` become two different filters, so match the case of existing tags.

### How the CMS is switched on

The CMS needs server routes, hence the Vercel adapter. Both are added **only** when `isCmsEnabled()` says so:

| Context | CMS | Output |
| --- | --- | --- |
| `npm run dev` / `build` / `preview`, both test suites | off | static `dist/` |
| `npm run dev:cms` (`KEYSTATIC=1`) | on, local storage | dev server |
| Vercel without `PUBLIC_KEYSTATIC_STORAGE=github` | off | static — the site deploys as before |
| Vercel with `PUBLIC_KEYSTATIC_STORAGE=github` | on, GitHub storage | `.vercel/output/`; only `/keystatic` and `/api/keystatic` are server-rendered |

### Production setup (one-off)

1. Audit the repository's collaborators with write access — they are exactly the people who can sign in to `/keystatic`.
2. Locally, set `PUBLIC_KEYSTATIC_STORAGE=github` in `.env`, run `npm run dev:cms`, open `/keystatic` and follow Keystatic's *Create GitHub App* flow. It writes the four `KEYSTATIC_*` credentials into `.env` — never commit them.
3. In the GitHub App's settings, add the production callback `https://imperi-e-rivoluzioni-blog.vercel.app/api/keystatic/github/oauth/callback` and install it on **this repository only**, with Contents read/write and Metadata read.
4. In Vercel (Production), set `PUBLIC_KEYSTATIC_STORAGE=github` plus the four credentials, and redeploy.
5. Enable two-factor authentication on the Vercel account: it is now part of the repository's security boundary.

## 🛠️ Stack

| Technology | Role |
| --- | --- |
| [Astro](https://astro.build/) | Static rendering, routing, content collections, view transitions |
| [Tailwind CSS](https://tailwindcss.com/) | Responsive styling, dark mode |
| [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography) | Reading theme for the rendered Markdown |
| [Alpine.js](https://alpinejs.dev/) | Mobile menu, filters, theme store, local interactions |
| [TypeScript](https://www.typescriptlang.org/) | Configuration, helpers, component contracts |
| [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/) + [`@astrojs/rss`](https://docs.astro.build/en/recipes/rss/) | Sitemap and feed |
| [EmailJS](https://www.emailjs.com/) | Contact-form delivery from the browser |
| [Keystatic](https://keystatic.com/) + React | Git-backed admin UI at `/keystatic` (React is confined to the admin) |
| [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/) | Adapter for the CMS routes, added only in CMS-enabled builds |
| [Vercel Web Analytics](https://vercel.com/docs/analytics) | Cookieless page-view analytics |
| [Zod](https://zod.dev/) | Content schemas and environment validation |
| [`sharp`](https://sharp.pixelplumbing.com/) | Astro's image optimisation |
| `cva`, `clsx`, `tailwind-merge` | UI class composition |
| [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | Unit, integration and end-to-end tests |

## 🚀 Running locally

**Requirements:** Node.js `>=22.12.0`.

```sh
npm install
npm run dev
```

The site is served at `http://localhost:4321`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run dev:cms` | Development server with the Keystatic admin at `/keystatic` |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the local build |
| `npx astro check` | Template and type diagnostics |
| `npx astro dev --background` | Development server as a background process |
| `npx astro dev stop` \| `status` \| `logs` | Control the background dev server |
| `npx astro preview --background` | Preview server as a background process, with the same subcommands |

## 🧪 Testing and verification

Three levels, separated by directory. There is no Vitest config file — Vitest runs on defaults and the npm scripts split the suites by path.

```sh
npm run test:unit          # Vitest over the helpers
npm run test:integration   # Vitest over a real Astro build
npm run test:e2e           # Playwright over the served site
npm test                   # All three in sequence
```

| Suite | Covers |
| --- | --- |
| 🔬 Unit | `formatDate`, `capitalizeFirstLetter`, `readingTime`, the sort comparators, `buildThemeIndex`, `navLinkCurrent`, the contact-form rules, the JSON-LD builder, `cn()`, and the environment schema with the CMS gate |
| 🔗 Integration | A real `astro build`, asserting on the emitted `dist/` HTML: the article route, the Search Console file, the front page (one `h1`, the lead story and its link, the series, `HOME_PREVIEW_COUNT` readings, the Substack form) and the article page (one `h1`, every source marker resolving, the series with the current part, the cover's alt text, the issue number) |
| 🎭 End-to-end | Every navbar link resolving to the right page, every section reachable at phone width, `aria-current`, the front page leading to its article, the evening-edition switch surviving navigation and reloads, and Alpine still driving markup that view transitions swap in |

Running a single test:

```sh
npx vitest run tests/unit/helpers.test.ts -t "formats a Date"
npx playwright test -g "resolves every link in the navbar"
```

> ⚠️ **Playwright does not start the site for you.** The config has no `webServer` and targets `http://127.0.0.1:4321`, so a server has to already be running in another process before `test:e2e`.
>
> ```sh
> npm run build && npx astro preview --host 127.0.0.1 --background
> npm run test:e2e
> ```

> ℹ️ `tests/integration/build.test.ts` shells out to a real `astro build` at module load: it is slow and it **overwrites `dist/`**. It forces `NODE_ENV=production` on that build — Vitest's own `NODE_ENV=test` would otherwise leak in, and Vercel Analytics would compile to its external debug script and stall page loads in any e2e run served from that `dist/`.

> ℹ️ While a view transition animates, clicks land on the transition overlay and are silently dropped. End-to-end tests that click again right after a client-side navigation first wait on `transitionFinished(page)`.

> ℹ️ Playwright is pinned to `workers: 2`. Each worker launches its own headless Chromium, and the default (a quarter of the cores) starves them on a dev machine that already has a browser open — the workers then die with an out-of-memory crash rather than a test failure.

Exit criterion for every change:

```sh
npx astro check   # must finish with 0 errors
npm run build     # must complete cleanly
```

## 🔐 Environment variables

Every variable is listed in [`.env.example`](.env.example) and validated at config time by the Zod schema in [`src/core/schemas/envSchema.ts`](src/core/schemas/envSchema.ts). `astro.config.mjs` runs before Vite loads `.env`, so `parseEnv()` reads the files itself; real process variables (Vercel's dashboard, `cross-env` in the npm scripts) take precedence. An invalid set fails the build with the offending names listed.

| Variable | Needed | Purpose |
| --- | --- | --- |
| `PUBLIC_EMAILJS_SERVICE_ID`, `PUBLIC_EMAILJS_TEMPLATE_ID`, `PUBLIC_EMAILJS_PUBLIC_KEY` | All three, or none | Contact-form delivery — a partial set is rejected |
| `PUBLIC_KEYSTATIC_STORAGE` | Optional, `local` by default | `github` switches Keystatic to GitHub storage, and on Vercel enables the CMS |
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | On Vercel in GitHub mode | GitHub App credentials, created by Keystatic's setup flow |
| `KEYSTATIC`, `VERCEL` | Set by the tooling | `"1"` enables the CMS locally (`dev:cms`) / marks a Vercel build |

### ✉️ EmailJS

The form uses EmailJS when its three variables are present. Without them it falls back silently to the form's `mailto:` action.

The EmailJS template needs at least the fields `from_name`, `reply_to`, `subject` and `message`.

Because the EmailJS path never reaches the browser's own validation, the submit handler takes validation over entirely: the rules live in `validateContactForm` so they can be unit-tested, and the result is announced through the form's `role="status"` region.

## ♿ Accessibility

The pages follow conventions the end-to-end tests actively verify:

- 🏗️ semantic landmarks: `header`, `main`, `nav`, `section`, `article`, `footer`;
- 🔗 `aria-labelledby` linking every section to its own heading (e.g. `#articles-title`);
- 🧭 `aria-current` on the active navbar link — `page` for the exact route, `true` for a section ancestor;
- 🎛️ `aria-pressed` on the "Edizione della sera" switch and on the reading tags;
- 📰 one `h1` per page — the masthead wordmark on the front page, the page title everywhere else;
- 📢 `role="status"` and `aria-live` for form feedback;
- 🏷️ Italian `aria-label`s on links and controls;
- ⌨️ visible focus on links and interactive controls;
- 🎨 the current page is marked by an underline, not by colour alone;
- 🖼️ alternative text on every image;
- 🕰️ a `<time datetime>` element for article dates.
