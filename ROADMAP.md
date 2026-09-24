# ROADMAP.md

You will use these instructions to carry out the project.
You must follow them one by one.
When you complete a task, do not proceed without my authorization. Always ask for permission.
After you complete the task, come back here and mark it as completed

---

# Fourth round — analytics, admin CMS & homepage scaling

Grounded in the four questions raised after the third round closed. Full design, code sketches and risk table live in the approved plan at `C:\Users\elia_\.claude\plans\i-d-like-to-plan-pure-lovelace.md`.

**Decisions taken:** Vercel Web Analytics (cookieless, no consent banner) over GA4 · **keep Alpine** — four trivial behaviours don't justify a React/Vue runtime; React enters for the admin route only · Keystatic in GitHub mode over a hand-rolled `/api/dashboard` · readings get an `addedDate` ordering key · both homepage sections become tab carousels capped at the latest 3.

**Verified while planning:** Keystatic *does* support Astro 7 (`@keystatic/astro@6.0.0` peers `astro: '5 || 6 || 7'`) — the earlier compatibility worry was wrong. The real risks are the Vercel adapter breaking `astro preview`/`dist/`, and Keystatic stripping the frontmatter `slug` key that two live article URLs depend on.

## Phase 1 — Analytics & Search Console
- [ x ] - move `googleebfa12ca84c3f0f0.html` from the project root into `public/` — it is never copied to `dist/` today, which is the whole reason verification fails
- [x] - install `@vercel/analytics` and render `<Analytics />` from `@vercel/analytics/astro` in `MainLayout`'s `<head>`, before `<slot name="head" />`
- [x] - add `Disallow: /keystatic` and `Disallow: /api/keystatic` to `public/robots.txt` (harmless before the CMS exists)

## Phase 2 — Homepage: shared accessible tabs & latest-N
- [x] - add `addedDate: z.date()` to the readings schema, backfill the 3 existing files preserving today's order, and delete the hardcoded `readingOrder` array from `ReadingSection.astro`
- [x] - add `SortableReading` to `shared/types/content.ts` and a `byMostRecentlyAdded` comparator in `core/helpers/sortReadings.ts` (tie-break on `name.localeCompare(…, "it")`), re-exported from `helpers/index.ts` — do **not** generalise `byMostRecent`, which is typed to articles' `order`/`pubDate`
- [x] - build `shared/ui/Tabs.astro` + `shared/ui/TabPanel.astro` implementing the WAI-ARIA tabs pattern properly: arrow keys with wrap, Home/End, roving tabindex, one Alpine scope per group via `idPrefix`. Types go in `shared/types/ui.ts`
- [x] - server-render tab 0's active classes and leave panel 0 uncloaked, so the sections are not blank before Alpine hydrates and still render without JavaScript
- [x] - delete `ReadingSection.astro`'s `<style>` block in the process — line 70 reads `<style is="global">`, a plain HTML attribute rather than Astro's `is:global` directive, and works only by accident of scoping
- [x] - add `HOME_PREVIEW_COUNT = 3` to `shared/utils/constants.ts` and rewire both sections to `.slice(0, HOME_PREVIEW_COUNT)` through `Tabs`/`TabPanel`, each with a CTA to its archive ("Tutti gli articoli" / "Tutte le letture")
- [x] - unify the card surface (`ArticleCard` is `bg-white`, `ReadingCard` is `bg-stone-100` — drop both and let `Card.astro` govern) and alternate the two adjacent identical `bg-stone-200` bands

## Phase 3 — Keystatic go/no-go spike
- [x] - timeboxed spike on a throwaway branch with `storage: { kind: 'local' }` and the readings collection only. Gates: `npm run build` exits 0 → record where static output lands → `test:integration` still passes → no React in `dist/index.html` → `/keystatic` renders → editing a reading produces a one-line `git diff` → rebuild still validates against Zod
  - **Spike results** (branch `spike/keystatic`, uncommitted; `@keystatic/core` + `@keystatic/astro@6.0.0`, `@astrojs/react@7`, `@astrojs/vercel@11.0.11`):
    - ✅ default build (gate off): exit 0, 14 pages, output in `dist/` exactly as before
    - ✅ `KEYSTATIC=1` build: exit 0, but output **moves** — static pages to `.vercel/output/static`, `dist/` holds only `client/`. The env gate is therefore mandatory, not optional
    - ✅ only `/keystatic`, `/api/keystatic` and `/_image` route to the function; every public page stays static
    - ✅ `test:integration` 2/2 and `test:unit` 52/52 pass on the gated-off path
    - ✅ no React in any public HTML page; sitemap excludes `/keystatic`
    - ✅ `/keystatic` renders under `KEYSTATIC=1 astro dev`, all reading fields load correctly
    - ⚠️ one-line diff: **fails on the first save only** — Keystatic re-serialises the whole YAML frontmatter (single quotes, folded `description`, block-list `tags`, drops the blank line after `---`). A second save is exactly one line. One-time normalisation, not recurring churn
    - ✅ rebuild after saves validates against Zod and renders the edited value
  - **Extra probe — Risk B on an article body:**
    - ❌ `fields.markdoc`: GFM table → `{% table %}` tag (would render as literal text), indented block flattened, a line moved, `## Fonti` renumbered `1. 1. 1.`. Not usable
    - ✅ `fields.mdx({ extension: "md" })`: tables stay GFM (only column padding), ordered lists kept, trailing spaces trimmed. Only lossy change: the **indented code block** (the Tōjō career box in `il-governo-dei-generali.md`) becomes paragraph + list — convert it to a fenced block first
    - ✅ frontmatter `slug:` as a plain `fields.text` survives the save; URL unchanged
    - ⚠️ a separate `fields.slug` named `fileName` wrote a stray `fileName: ''` key (harmless to Zod, but noise) — put `fields.slug` on `title` instead, as the plan says. Keystatic also writes `featured: false` explicitly
    - ⚠️ `npm audit`: 3 high, all `path-to-regexp` ReDoS via `@astrojs/vercel` → `@vercel/routing-utils` (build-time route generation)
- [x] - decide go/no-go. **Decision: go**, with three amendments to Phase 4: article/reading bodies use `fields.mdx({ extension: "md" })`, not `fields.markdoc`; convert the indented Tōjō code block to a fenced one, then land a single normalisation commit re-serialising all 6 content files as Keystatic writes them; `fields.slug` goes on `title` (no separate slug-named field). Fallback if it fails: Sveltia CMS on a static `public/admin/` page — no adapter, no React, no rendering-mode change

## Phase 4 — Keystatic (GitHub mode)
- [ ] - install `@keystatic/core`, `@keystatic/astro`, `@astrojs/react`, `react`, `react-dom`, `@astrojs/vercel`
- [ ] - to better sanitize the env (.env), create a core/config folder and inside of it create envParser.ts that relies on a core/schemas/envSchema.ts with Zod
- [ ] - env-gate the adapter and the CMS integrations in `astro.config.mjs` (`VERCEL=1 || KEYSTATIC=1`) so the default build, `astro preview` and both test suites stay on the plain static path; leave `output` unset and write no `prerender` lines — the integration injects its routes already marked `prerender: false`
- [ ] - write `keystatic.config.ts` mirroring both Zod schemas field-for-field: articles at `src/content/articles/**`, readings flat at `src/content/readings/*`
- [ ] - declare the articles `slug` as an ordinary required `fields.text`, with a *separate* `fields.slug` for the file path — two articles have a frontmatter slug that differs from their filename, and those are the live URLs
- [ ] - set up the GitHub App via Keystatic's own flow, installed on this repo only (Contents R/W, Metadata R), the four env vars in Vercel, and a committed `.env.example` listing their names
- [ ] - accept `fields.array(fields.text())` for tags: real CRUD per entry, but no shared vocabulary, autocomplete or rename-everywhere until tags become a real collection

## Phase 5 — Verification & docs
- [ ] - add `tests/unit/sortReadings.test.ts`, mirroring `sortArticles.test.ts`
- [ ] - extend `tests/integration/build.test.ts`: the Search Console file reaches `dist/`, the homepage has 2 tablists and `HOME_PREVIEW_COUNT * 2` tabpanels, exactly 2 tabs carry `tabindex="0"`, both CTAs render. Leave the existing `dist/articles/…` assertion untouched — it is the canary for the adapter relocating output
- [ ] - add e2e coverage for keyboard tab navigation on both homepage groups
- [ ] - fix the fragile locator in "navigates from the homepage to an article": `getByRole("link", { name: "Articoli" }).first()` is a substring match the new CTA would also match
- [ ] - update `CLAUDE.md` (it still claims three collections including the deleted `projects`) and the README's analytics and CMS sections
- [ ] - confirm `npx astro check` and `npm run build` run clean as the exit criterion for each phase above
- [ ] - update the `README.md`

---

# Third round — audit-driven improvements

The site has moved on from the old one-page portfolio (Phases 1–9 and the CV task above are obsolete and kept only as history). It is now "Imperi e Rivoluzioni", a multi-page historical/geopolitical blog. This round is grounded in a deep codebase audit (Astro/TypeScript/SEO/perf best practices + UX/accessibility review) plus `PROJECT_OVERVIEW.md`'s editorial and technical vision.

**Palette decision:** keep the current stone/amber/red "old paper" identity (`PALETTE.md`, Playfair Display / Lora / Special Elite). The indigo/slate palette proposed in `public/color-palette.md` is discarded — it contradicted both the site's existing identity and `PROJECT_OVERVIEW.md`'s own "earthy, parchment" description.

## Phase 1 — Bug fixes & dead code
- [x] - rewrite `src/pages/500.astro`: on-brand styling (matching `404.astro`), a proper heading, Italian copy, and a "Torna alla home" CTA; stop rendering the raw `error.message` to visitors
- [x] - delete `src/features/projects/**` and `src/features/certificates/**` (including their `assets/` images) and remove the orphaned `projectsCollection` from `src/content.config.ts` (it points at `src/content/projects`, which doesn't exist and would break `getCollection("projects")` if ever called)
- [x] - remove the unused asset `src/features/home/assets/foto-elia.jpg` (never imported anywhere)
- [x] - add `/about` to `Navbar.astro` (desktop and mobile menus) — the page exists but is unreachable from navigation today
- [x] - replace the English lorem-ipsum placeholder copy in `src/pages/about.astro` ("This is a placeholder About page...") with real Italian bio / editorial-mission content, drawing on `PROJECT_OVERVIEW.md`'s mission section
- [x] - fix the dead `href="#"` "Tiktok" link in `src/shared/components/Footer.astro` (point it at a real profile or remove it)
- [x] - repurpose `/topics` (`src/pages/topics.astro`) into a real cross-collection theme index (grouping both `articles.topic` and `readings.topic`/tags) instead of duplicating `/readings`'s tag filter
- [x] - remove `public/color-palette.md` (superseded proposal; being inside `public/` also makes it publicly downloadable from the live site)
- [x] - set a real `name` in `package.json` (currently `""`)

## Phase 2 — Content model upgrade
- [x] - extend the `articlesCollection` schema in `src/content.config.ts` with `pubDate: z.date()`, `updatedDate: z.date().optional()`, `author` (with a sensible default), `featured: z.boolean().default(false)`, and `order: z.number()` for sequencing multi-part cycles
- [x] - backfill frontmatter on the 3 existing Giappone articles: add the missing `pubDate` (one file lacks it while the other two already have an ad-hoc, currently-unschema'd one) and an `order` (1/2/3, matching the Meiji → Taishō → Shōwa-generals chronology)
- [x] - add a `readingTime` helper to `src/core/helpers/` (word-count based estimate), re-exported from `helpers/index.ts` alongside `formatDate`/`capitalizeFirstLetter`
- [x] - remove the literal unprocessed `[cite: 1]`-style citation markers currently visible in article Markdown bodies; adopt a simple numbered-footnote convention (a `## Fonti` section at the end of each article)
- [x] - surface the new metadata: publish/updated date and reading time in `articles/[id].astro`'s header, and sort `articles/index.astro`'s listings by `order`/`pubDate` instead of relying on file-discovery order

## Phase 3 — Typography & long-form reading UX
- [x] - install `@tailwindcss/typography` and wire it into `src/styles/global.css` (Tailwind v4 `@plugin` directive) — today's `prose` classes on `articles/[id].astro` and `readings/[id].astro` are dead/no-op without it
- [x] - tune the `prose` theme to the site's palette and fonts (Playfair/Lora) rather than accepting Typography's defaults
- [x] - add a lightweight sticky/floating Table of Contents to `articles/[id].astro`, generated from the rendered article's H2/H3 headings
- [x] - reconsider the `max-w-none` override on the `.prose` container now that the plugin will govern measure/line-length

## Phase 4 — Accessibility & interaction fixes
- [x] - add `aria-current="page"` to the active link in `Navbar.astro` (desktop and mobile), derived from `Astro.url.pathname`
- [x] - fix contact-form validation: `Form.astro` sets `novalidate` whenever EmailJS env vars are configured, which removes all native validation with nothing replacing it — add real required/email-format checks wired into the existing `#contact-status` `aria-live` region
- [x] - normalize the heading level mismatch between `ArticleCard.astro` (`h4`) and `ReadingCard.astro` (`h2`) to a consistent `h3`, since both nest under a page-level `h2` section title
- [x] - address the borderline-contrast `amber-700`-on-`stone-100` text pairing used for eyebrow/label text (~4.6:1, essentially no safety margin above WCAG AA)
- [x] - strengthen `.hero-secondary`'s border/background opacity in `global.css` so the button reads as a distinct interactive control against the dark hero background

## Phase 5 — SEO & discoverability
- [x] - set `site` in `astro.config.mjs` to the production domain (prerequisite for sitemap/RSS/canonical URLs)
- [x] - pass explicit `title`/`description` props to `MainLayout` from every page that doesn't yet (`index`, `about`, `articles/index`, `readings/index`, `readings/[id]`, `404`) — today only `articles/[id]`, `topics`, and `contacts` do
- [x] - add a canonical `<link>` tag plus Open Graph and Twitter Card meta tags to `MainLayout.astro`, and add `public/robots.txt`
- [x] - add the `@astrojs/sitemap` integration and an RSS feed (`@astrojs/rss`) for the `articles` collection
- [x] - add JSON-LD `BlogPosting` structured data to article pages, using the Phase 2 metadata (`pubDate`, `author`, etc.)

## Phase 6 — Performance & polish
- [x] - replace the render-blocking Google Fonts `@import` in `global.css` with `<link rel="preconnect">` + `<link rel="stylesheet">` in `MainLayout`'s `<head>` (or self-host via `@fontsource`)
- [x] - add Astro View Transitions (`<ClientRouter />`) for smoother multi-page navigation, respecting `prefers-reduced-motion`
- [x] - implement the light/dark theme toggle `PROJECT_OVERVIEW.md` calls for, staying within the old-paper palette (dark charcoal background / parchment text), defaulting to `prefers-color-scheme` and persisted via Alpine + `localStorage`
- [x] - remove or repurpose the leftover global `scroll-behavior: smooth` / `scroll-padding-top` rule (a one-page-portfolio leftover with no in-page anchors left to target) — reuse it for Phase 3's TOC jump links, or drop it
- [x] - move every type and interface inside a shared/types folder

## Phase 7 — Verification
- [x] - unit-test the new `readingTime` helper alongside the existing helper tests
- [x] - extend `tests/e2e/site.spec.ts` to click through every navbar link (including the newly-added `/about`) and assert each one resolves
- [x] - confirm `npx astro check` and `npm run build` run clean as the exit criterion for each phase above, per the project's existing convention

---

# Historical rounds (obsolete — kept for reference only)

## First round — original portfolio build

Always refere to https://github.com/EliaGiolli/EliaGiolli

### Phase 1 - the hero section
- [x] - create a custom UI component called <HeroSection>
- [x] - use the "Tech stack" text from the repo I provided you and translate it to italian. Use icons as well
- [x] - insert 2 buttons with links (see @Button and @variants) that point to /cv and /projects
- [x] - make sure to use the correct a11y accessibility (aria-*, HTML tags, css classes, ecc)

### Phase 2 - the about section
- [x] - create a custom UI component called <AboutSection>
- [x] - use the "About me" text from the repo I provided you and translate it to italian. Use icons as well
- [x] - the layout must be of 3 columns: 1 column is used for the image (assets/images/foto-laurea.jpg) and the other 2 for the text with icons
- [x] - make sure to use the correct a11y accessibility (aria-*, HTML tags, css classes, ecc)

### Phase 3 - the projects section
- [x] - create a custom UI component called <ProjectsSection>
- [x] - use the "Featured Projects" text from the repo I provided you and translate it to italian. Use icons as well
- [x] - create a custom reusable Card component with slots and icons
- [x] - the layout must be a collection of Cards with toggle buttons to make it look like a carousel of projects. Use the /content/project/**.md files for the texts
- [x] - make sure to use the correct a11y accessibility (aria-*, HTML tags, css classes, ecc)

### Phase 4 - the projects:id section
- [x] - create a custom UI component called <ProjectComponent>
- [x] - the layout must be a single project selected by :id / params. The main goal of this component is to show how I troubleshoot problems, so, read carefully the makdown files for each project and write in italian the cause of the problem and how I troubleshoot it
- [x] - make sure to use the correct a11y accessibility (aria-*, HTML tags, css classes, ecc)

### Phase 5 - the certificates section
- [x] - create a custom UI component called <CertificatesSection>
- [x] - use the "Education and certification" text from the repo I provided you and translate it to italian. Use icons as well
- [x] - create a custom reusable Card component with slots and icons
- [x] - the layout must be a collection of Cards with toggle buttons to make it look like a carousel of certifications. Use the /assets/images/certificates path for the images
- [x] - make sure to use the correct a11y accessibility (aria-*, HTML tags, css classes, ecc)

### Phase 6 - the contacts section
- [x] - create a custom UI component called <ContactMe>
- [x] - create a custom reusable Input and Form components with slots and icons that accept props
- [x] - as for the layout and interactivity, you have the freedom of choice: if you think Alpine.js does it job just fine, use it, otherwise I already installed a Vue plugin for Astro. Feel free to use it inside an Island
- [x] - the form submission should use either email.js or nodemailer
- [x] - make sure to use the correct a11y accessibility (aria-*, HTML tags, css classes, ecc)

### Phase 7 - smooth scroll
- [x] - use Astro's built-in capabilities to perform smooth scrolling from the navbar to each section of the page. When a user clicks one of the navbar's link, it will be smoothly redirected to the corresponding section. Use either vanilla javascript or Alpine.js
- [x] - make sure to use the correct a11y accessibility (aria-*, HTML tags, css classes, ecc)

### Phase 8 - overall analysis and fixes
- [x] - deeply analyze each component inside /pages, /components and /layouts
- [x] - deeply analyze each constant and function inside /lib, /helpers and /utils
- [x] - for each file analyzed, create and entry inside a file called "FINAL-REVISION.md" inside the root directory of the project. Write only possible and needed improvements to be done right away. The portfolio must look modern and conform to the newest best practices of front-end, full-stack and Astro and accessible for every user

### Phase 9 - refactor of the project structure
- [x] - search on the internet the "feature-based layout"
- [x] - refactor the folder structure, creating /core, /features/, shared/ and the Astro's pages/ by inserting the correct file inside the right folder
- [x] - finish off by create custom components with the variants (card, buttons, inputs,...). Do not repeat the same component like you did with the cards (project card, certificate card)

## Second round

### CV
- [x] - add the missing `/cv` route or replace the `Scarica il CV` link with an existing CV asset. The current primary action leads to a 404. - create the component inside the feature/cv/ path. Use https://github.com/EliaGiolli/portfolio-elia-angular/blob/main/src/app/features/cv/cv.html as reference
