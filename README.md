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

A static site built with Astro, with no UI-framework integrations and zero JavaScript by default. Content lives in typed content collections; interactivity is handed to Alpine.js only where it genuinely earns its place.

> **Editorial focus** — how democracies are hollowed out from within, state militarism, authoritarian transitions and neglected geopolitical dynamics: Meiji and Shōwa Japan, Weimar Germany, interwar autocracies, the post-colonial Middle East.

## 📑 Contents

- [Site pages](#-site-pages)
- [Project structure](#-project-structure)
- [Content collections](#-content-collections)
- [Architecture and conventions](#-architecture-and-conventions)
- [Design system](#-design-system)
- [SEO and discoverability](#-seo-and-discoverability)
- [Stack](#-stack)
- [Running locally](#-running-locally)
- [Testing and verification](#-testing-and-verification)
- [EmailJS configuration](#-emailjs-configuration)
- [Accessibility](#-accessibility)

## 🧭 Site pages

| Route | Page | What it does |
| --- | --- | --- |
| `/` | 🏠 Home | Hero, editorial promise, readings, articles and contact form on a single page |
| `/about` | 👤 About | Bio, working method and editorial line — labelled "Chi sono", the first item in the navbar |
| `/articles` | 📜 Archive | Articles grouped by topic and category, ordered by cycle sequence |
| `/articles/[id]` | 📖 Article | Full text with a sticky side table of contents, date, author and reading time |
| `/readings` | 📚 Recommended readings | Bibliography, filterable by tag on the client |
| `/readings/[id]` | 🔖 Reading sheet | Extended book entry with an Amazon link |
| `/topics` | 🗺️ Themes | Thematic index crossing articles and readings, plus an analytical index by tag |
| `/contacts` | ✉️ Contacts | Form submitted through EmailJS, with a `mailto:` fallback |
| `/rss.xml` | 📡 Feed | RSS feed of the `articles` collection, newest first |
| `/sitemap-index.xml` | 🗺️ Sitemap | Generated at build time by `@astrojs/sitemap` |
| `/404`, `/500` | ⚠️ Errors | Error pages in Italian, consistent with the site's identity |

## 🗂️ Project structure

The project follows a **feature-based** layout: routes hold no reusable logic, domains live in `features/`, and anything cross-cutting sits in `shared/` and `core/`.

```text
.
├── public/
│   ├── logo.svg                  # Favicon
│   ├── og-image.png              # Social preview card (1200×630)
│   └── robots.txt                # Points crawlers at the sitemap
├── src/
│   ├── content/
│   │   ├── articles/             # Markdown essays, in per-topic subfolders
│   │   └── readings/             # Recommended-reading entries
│   ├── content.config.ts         # Zod schemas for the collections
│   ├── core/
│   │   ├── helpers/              # Pure functions, re-exported from index.ts
│   │   └── layouts/              # MainLayout: the site's only layout
│   ├── features/
│   │   ├── articles/             # ArticlesSection + ArticleCard
│   │   ├── contact/              # ContactMe and the EmailJS handler
│   │   ├── home/                 # HeroSection + AboutSection
│   │   └── readings/             # ReadingSection, ReadingCard, ReadingTagFilters
│   ├── pages/
│   │   ├── articles/             # index.astro + [id].astro
│   │   ├── readings/             # index.astro + [id].astro
│   │   ├── rss.xml.ts            # RSS endpoint
│   │   └── *.astro               # Routes only: they compose the sections
│   ├── shared/
│   │   ├── components/           # Navbar (+ theme store), Footer
│   │   ├── forms/                # Form, Input
│   │   ├── lib/                  # cn(): clsx + tailwind-merge
│   │   ├── types/                # Every type and interface in the codebase
│   │   ├── ui/                   # Button, Card
│   │   └── utils/                # Constants and CVA variants
│   └── styles/                   # global.css: the single Tailwind entry
├── tests/
│   ├── unit/                     # Vitest over the helpers
│   ├── integration/              # Vitest over a real build
│   └── e2e/                      # Playwright over the served site
├── astro.config.mjs
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
          ├── ArticlesSection → ArticleCard          (home, newest first)
          ├── /articles        → ArticleCard          (archive, by cycle sequence)
          ├── /articles/[id]   → Markdown + TOC       (routed on the slug field)
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

> ⚠️ The subfolder under `src/content/articles/` is organisational only: the grouping in the UI comes from `topic` and `category`.

### 📚 `readings`

```text
src/content/readings/*.md
          │
          ▼
   content.config.ts
          │
          ├── ReadingSection    → ReadingCard → /readings/[id]
          ├── ReadingTagFilters → client-side tag filter (Alpine)
          └── /topics           → crossed with the articles by topic and tag
```

| Field | Type | Notes |
| --- | --- | --- |
| `name`, `author`, `description` | `string` | |
| `tags` | `string[]` | |
| `topic` | `string` | |
| `amazonUrl` | `string` | Validated as a URL |

Reading routes use the **id Astro generates**, not a frontmatter field.

## 🧩 Architecture and conventions

### 🧠 Logic in helpers, not in components

Pure functions live in `core/helpers/` and are re-exported from `helpers/index.ts`:

| Helper | Purpose |
| --- | --- |
| `formatDate` | Dates in the long Italian format |
| `capitalizeFirstLetter` | Leading capital |
| `readingTime` | Word-count reading estimate, ignoring code, diagrams and Markdown syntax |
| `byReadingOrder` / `byMostRecent` | Comparators for ordering the listings |
| `buildThemeIndex`, `slugifyTheme` | Build the `/topics` index by crossing articles and readings |
| `navLinkCurrent` | The `aria-current` value a navbar link deserves for the current route |
| `validateContactForm`, `contactErrorSummary` | Contact-form rules and the single line announced to screen readers |
| `buildArticleSchema` | The JSON-LD `BlogPosting` payload for article pages |

### 🏷️ Types

Every `type` and `interface` lives in `shared/types/`, split by domain — `content.ts`, `navigation.ts`, `contact.ts`, `ui.ts` — behind a type-only barrel. Components keep just the local alias Astro needs:

```astro
---
import type { CardProps } from "../types";

type Props = CardProps;
---
```

### ⚡ Interactivity

No UI-framework integrations. Two mechanisms only:

- **Alpine.js** for anything in-page: mobile menu, tag filter, active card state, theme toggle. Alpine is imported and started with a single `Alpine.start()` inside `Navbar.astro` — which, appearing on every page through `MainLayout`, bootstraps it site-wide. **Do not add a second `Alpine.start()`.**
- **Plain `<script>` modules** for non-UI work, such as the EmailJS handler in `ContactMe.astro`.

### 🔀 View transitions

`<ClientRouter />` sits in `MainLayout`'s head, so navigation happens client-side. Two consequences worth knowing before touching the layout:

- Astro copies the incoming document's `<html>` attributes over the live ones, which drops any class set at runtime. The theme class is re-applied on `astro:after-swap`, an event that fires before the new page paints.
- Alpine's mutation observer picks up the swapped-in `<body>` on its own, so in-page interactivity keeps working without re-initialising it by hand.

### 🌗 Theme toggle

Dark mode is class-driven rather than media-query-only, so the navbar button can override the OS preference:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

It defaults to `prefers-color-scheme` and persists an explicit choice in `localStorage`; while no choice has been made, it keeps following the OS live. An inline script in the head applies the stored theme **before the first paint**, so there is no flash of the wrong palette. Every `localStorage` access is wrapped in `try`/`catch` — it throws in some privacy modes, and the light theme is the safe fallback.

### 🔘 UI components

Buttons go through `shared/ui/Button.astro`, which merges the `cva` variants defined in `utils/variants.ts` through `cn()`, and renders `<a>` or `<button>` depending on whether `href` is passed. New variants belong in `variants.ts`, not in ad-hoc classes.

### 🌍 Language

All user-facing copy, content and content metadata is **in Italian**; code identifiers, comments, commit messages and this README are **in English**.

## 🎨 Design system

Tailwind v4 through the `@tailwindcss/vite` plugin, with no `tailwind.config`: the single entry is `src/styles/global.css`.

### Palette

The palette is expressed with native Tailwind utilities, not custom colour names.

| | Colour | Hex | Utility |
| --- | --- | --- | --- |
| ![#EFE6D3](https://img.shields.io/badge/-EFE6D3-EFE6D3?style=flat-square) | Cream / paper | `#EFE6D3` | `stone-100` |
| ![#2B2622](https://img.shields.io/badge/-2B2622-2B2622?style=flat-square) | Charcoal | `#2B2622` | `stone-900` |
| ![#B98B3E](https://img.shields.io/badge/-B98B3E-B98B3E?style=flat-square) | Antique gold | `#B98B3E` | `amber-700` |
| ![#A13D2C](https://img.shields.io/badge/-A13D2C-A13D2C?style=flat-square) | Rust red | `#A13D2C` | `red-700` |

### Dark palette

The same identity turned over — charcoal page, parchment ink — with one deliberate substitution.

| Role | Light | Dark |
| --- | --- | --- |
| Page background | `#EFE6D3` paper | `stone-900` |
| Elevated surfaces (cards, TOC) | `white` | `stone-800` |
| Recessed bands (hero, footer, alternating sections) | `stone-200` | `stone-950` |
| Body ink | `stone-700` / `#2B2622` | `stone-300` / `#EFE6D3` |
| Accent | `red-700` rust | `amber-500` gold |

> ℹ️ Rust red reaches only **2.6:1** against charcoal, so antique gold (~7.9:1) carries the accents in dark mode — which is also what the hero already did on its own dark background. Required-field asterisks and invalid-input rings stay red (`red-400`): they are error affordances, not brand accents.

### Typography

| Use | Font |
| --- | --- |
| Headings and logotype | **Playfair Display** — set globally on `h1`–`h6` |
| Body copy | **Lora** |
| "Dispatch" accent | **Special Elite**, through the `.font-dispatch` class |

Fonts are loaded from `MainLayout`'s `<head>` with `preconnect` hints, **not** with an `@import` in `global.css` — an `@import` inside the bundled CSS serialises the requests, so the fonts cannot start downloading until the stylesheet has arrived and parsed.

### Long-form reading

`@tailwindcss/typography` is registered with Tailwind v4's `@plugin` directive, and the `prose` theme is mapped onto the site's palette twice — once per mode. On paper: charcoal Playfair headings and rust-red links. On charcoal: parchment headings and gold links. Gold list markers and quote borders, and blockquotes rendered as set-apart panels, hold in both. Detail pages let the plugin govern the measure.

### 🏃 Motion

Smooth scrolling is opt-in, behind `prefers-reduced-motion: no-preference`. `scroll-padding-top: 5.5rem` stays unconditional so that the article table of contents and the `/topics` jump links clear the sticky header in either motion mode.

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
| 🔬 Unit | `formatDate`, `capitalizeFirstLetter`, `readingTime`, the sort comparators, `buildThemeIndex`, `navLinkCurrent`, the contact-form rules, the JSON-LD builder and `cn()` |
| 🔗 Integration | A real `astro build`, asserting on the emitted `dist/` HTML |
| 🎭 End-to-end | Every navbar link resolving to the right page, the mobile menu, `aria-current`, the theme toggle surviving navigation and reloads, and Alpine still driving markup that view transitions swap in |

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

> ℹ️ `tests/integration/build.test.ts` shells out to a real `astro build` at module load: it is slow and it **overwrites `dist/`**.

> ℹ️ Playwright is pinned to `workers: 2`. Each worker launches its own headless Chromium, and the default (a quarter of the cores) starves them on a dev machine that already has a browser open — the workers then die with an out-of-memory crash rather than a test failure.

Exit criterion for every change:

```sh
npx astro check   # must finish with 0 errors
npm run build     # must complete cleanly
```

## ✉️ EmailJS configuration

The form uses EmailJS when these public variables are present. Without them it falls back silently to the form's `mailto:` action.

```env
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

The EmailJS template needs at least the fields `from_name`, `reply_to`, `subject` and `message`.

Because the EmailJS path never reaches the browser's own validation, the submit handler takes validation over entirely: the rules live in `validateContactForm` so they can be unit-tested, and the result is announced through the form's `role="status"` region.

## ♿ Accessibility

The pages follow conventions the end-to-end tests actively verify:

- 🏗️ semantic landmarks: `header`, `main`, `nav`, `section`, `article`, `footer`;
- 🔗 `aria-labelledby` linking every section to its own heading (e.g. `#articles-title`);
- 🧭 `aria-current` on the active navbar link — `page` for the exact route, `true` for a section ancestor;
- 🎛️ `aria-expanded` on the mobile menu toggle, `aria-pressed` on the theme toggle;
- 📢 `role="status"` and `aria-live` for form feedback;
- 🏷️ Italian `aria-label`s on links and controls;
- ⌨️ visible focus on links and interactive controls;
- 🎨 the current page is marked by an underline, not by colour alone;
- 🖼️ alternative text on every image;
- 🕰️ a `<time datetime>` element for article dates.
