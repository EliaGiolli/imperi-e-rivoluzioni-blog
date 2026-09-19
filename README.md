<div align="center">

# 🏛️ Imperi e Rivoluzioni

**Piattaforma di analisi storica e geopolitica per saggi long-form, ricostruzioni di lungo periodo e commento strutturale.**

[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Alpine.js](https://img.shields.io/badge/Alpine.js-3-77C1D2?style=flat-square&logo=alpinedotjs&logoColor=white)](https://alpinejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%E2%89%A522.12-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

---

Sito statico costruito con Astro, senza integrazioni UI framework e con zero JavaScript di default. I contenuti vivono in content collection tipizzate; l'interattività è affidata ad Alpine.js dove serve davvero.

> **Focus editoriale** — come le democrazie vengono svuotate dall'interno, militarismo di Stato, transizioni autoritarie e dinamiche geopolitiche trascurate: Giappone Meiji e Shōwa, Germania di Weimar, autoritarismi tra le due guerre, Medio Oriente post-coloniale.

## 📑 Indice

- [Le pagine del sito](#-le-pagine-del-sito)
- [Struttura del progetto](#-struttura-del-progetto)
- [Content collections](#-content-collections)
- [Architettura e convenzioni](#-architettura-e-convenzioni)
- [Design system](#-design-system)
- [Stack](#-stack)
- [Avvio locale](#-avvio-locale)
- [Test e verifica](#-test-e-verifica)
- [Configurazione EmailJS](#-configurazione-emailjs)
- [Accessibilità](#-accessibilità)

## 🧭 Le pagine del sito

| Route | Pagina | Cosa fa |
| --- | --- | --- |
| `/` | 🏠 Home | Hero, promessa editoriale, letture, articoli e form di contatto in un'unica pagina |
| `/articles` | 📜 Archivio | Articoli raggruppati per tema e categoria, ordinati per sequenza del ciclo |
| `/articles/[id]` | 📖 Articolo | Testo completo con indice laterale sticky, data, autore e tempo di lettura |
| `/readings` | 📚 Letture consigliate | Bibliografia filtrabile per tag lato client |
| `/readings/[id]` | 🔖 Scheda lettura | Scheda estesa del libro con link Amazon |
| `/topics` | 🗺️ Temi | Indice tematico che incrocia articoli e letture, più un indice analitico per tag |
| `/about` | 👤 Chi sono | Bio, metodo di lavoro e linea editoriale |
| `/contacts` | ✉️ Contatti | Form con invio EmailJS e fallback `mailto:` |
| `/404`, `/500` | ⚠️ Errori | Pagine d'errore in italiano, coerenti con l'identità del sito |

## 🗂️ Struttura del progetto

Il progetto segue un layout **feature-based**: le route non contengono logica riutilizzabile, i domini stanno in `features/`, ciò che è trasversale in `shared/` e `core/`.

```text
.
├── public/                       # Asset statici serviti così come sono
├── src/
│   ├── content/
│   │   ├── articles/             # Saggi in Markdown, in sottocartelle per tema
│   │   └── readings/             # Schede delle letture consigliate
│   ├── content.config.ts         # Schemi Zod delle collection
│   ├── core/
│   │   ├── helpers/              # Funzioni pure, riesportate da index.ts
│   │   └── layouts/              # MainLayout: l'unico layout del sito
│   ├── features/
│   │   ├── articles/             # ArticlesSection + ArticleCard
│   │   ├── contact/              # ContactMe e handler EmailJS
│   │   ├── home/                 # HeroSection + AboutSection
│   │   └── readings/             # ReadingSection, ReadingCard, ReadingTagFilters
│   ├── pages/                    # Solo route: compongono le sezioni
│   ├── shared/
│   │   ├── components/           # Navbar, Footer
│   │   ├── forms/                # Form, Input
│   │   ├── lib/                  # cn(): clsx + tailwind-merge
│   │   ├── ui/                   # Button, Card
│   │   └── utils/                # Costanti e varianti CVA
│   └── styles/                   # global.css: unico entry Tailwind
├── tests/
│   ├── unit/                     # Vitest sugli helper
│   ├── integration/              # Vitest su una build reale
│   └── e2e/                      # Playwright sul sito servito
├── astro.config.mjs
├── playwright.config.ts
└── package.json
```

Gli import sono **relativi** ovunque: non sono configurati alias di percorso.

## 📚 Content collections

Due collection caricate da glob e validate con Zod in [`src/content.config.ts`](src/content.config.ts).

### 📜 `articles`

```text
src/content/articles/**/*.md
          │
          ▼
   content.config.ts  ──  validazione dello schema
          │
          ├── ArticlesSection → ArticleCard          (home, dal più recente)
          ├── /articles        → ArticleCard          (archivio, per sequenza)
          ├── /articles/[id]   → Markdown + indice    (routing sul campo slug)
          └── /topics          → indice tematico      (incrociato con le letture)
```

| Campo | Tipo | Note |
| --- | --- | --- |
| `title`, `description` | `string` | |
| `pubDate` | `date` | Obbligatoria |
| `updatedDate` | `date?` | Mostrata nell'header solo se presente |
| `author` | `string` | Default `"Elia Giolli"` |
| `featured` | `boolean` | Default `false` |
| `order` | `number` | Sequenza all'interno di un ciclo in più parti |
| `tags` | `string[]` | Alimentano l'indice analitico di `/topics` |
| `topic`, `category` | `string` | Governano il raggruppamento nell'archivio |
| `slug` | `string` | **È il parametro `[id]` della route**, non l'id generato |

> ⚠️ La sottocartella sotto `src/content/articles/` è solo organizzativa: il raggruppamento nell'interfaccia dipende da `topic` e `category`.

### 📚 `readings`

```text
src/content/readings/*.md
          │
          ▼
   content.config.ts
          │
          ├── ReadingSection    → ReadingCard → /readings/[id]
          ├── ReadingTagFilters → filtro per tag lato client (Alpine)
          └── /topics           → incrociate con gli articoli per tema e tag
```

| Campo | Tipo | Note |
| --- | --- | --- |
| `name`, `author`, `description` | `string` | |
| `tags` | `string[]` | |
| `topic` | `string` | |
| `amazonUrl` | `string` | Validato come URL |

Il routing delle letture usa l'**id generato da Astro**, non un campo della frontmatter.

## 🧩 Architettura e convenzioni

### 🧠 Logica negli helper, non nei componenti

Le funzioni pure stanno in `core/helpers/` e sono riesportate da `helpers/index.ts`:

| Helper | Scopo |
| --- | --- |
| `formatDate` | Date nel formato lungo italiano |
| `capitalizeFirstLetter` | Iniziale maiuscola |
| `readingTime` | Stima il tempo di lettura sul conteggio parole, ignorando codice, diagrammi e sintassi Markdown |
| `byReadingOrder` / `byMostRecent` | Comparatori per l'ordinamento degli elenchi |
| `buildThemeIndex` | Costruisce l'indice di `/topics` incrociando articoli e letture |

### ⚡ Interattività

Nessuna integrazione UI framework. Solo due meccanismi:

- **Alpine.js** per tutto ciò che è in-page: menu mobile, filtro per tag, stato attivo delle card. Alpine viene importato e avviato con un solo `Alpine.start()` dentro `Navbar.astro` — che, comparendo su ogni pagina tramite `MainLayout`, lo attiva su tutto il sito. **Non aggiungere un secondo `Alpine.start()`.**
- **Moduli `<script>` semplici** per il lavoro non-UI, come l'handler EmailJS in `ContactMe.astro`.

### 🔘 Componenti UI

I bottoni passano da `shared/ui/Button.astro`, che unisce le varianti `cva` definite in `utils/variants.ts` tramite `cn()`, e rende `<a>` o `<button>` a seconda della presenza di `href`. Le nuove varianti vanno aggiunte a `variants.ts`, non scritte come classi ad-hoc.

### 🌍 Lingua

Tutti i testi, i contenuti e i metadati rivolti all'utente sono **in italiano**; identificatori e commenti nel codice sono **in inglese**.

## 🎨 Design system

Tailwind v4 tramite il plugin `@tailwindcss/vite`, senza `tailwind.config`: l'unico entry è `src/styles/global.css`.

### Palette

La palette è espressa con utility Tailwind native, non con nomi di colore custom.

| | Colore | Hex | Utility |
| --- | --- | --- | --- |
| ![#EFE6D3](https://img.shields.io/badge/-EFE6D3-EFE6D3?style=flat-square) | Crema / carta | `#EFE6D3` | `stone-100` |
| ![#2B2622](https://img.shields.io/badge/-2B2622-2B2622?style=flat-square) | Carbone | `#2B2622` | `stone-900` |
| ![#B98B3E](https://img.shields.io/badge/-B98B3E-B98B3E?style=flat-square) | Oro antico | `#B98B3E` | `amber-700` |
| ![#A13D2C](https://img.shields.io/badge/-A13D2C-A13D2C?style=flat-square) | Rosso ruggine | `#A13D2C` | `red-700` |

### Tipografia

| Uso | Font |
| --- | --- |
| Titoli e logotipo | **Playfair Display** — impostato globalmente su `h1`–`h6` |
| Corpo del testo | **Lora** |
| Accento "da dispaccio" | **Special Elite**, tramite la classe `.font-dispatch` |

### Lettura long-form

`@tailwindcss/typography` è registrato con la direttiva `@plugin` di Tailwind v4 e il tema `prose` è mappato sulla palette del sito: titoli carbone in Playfair, link rosso ruggine, elenchi e bordi delle citazioni in oro antico, blockquote resi come riquadri staccati. Le pagine di dettaglio lasciano che sia il plugin a governare la lunghezza di riga.

## 🛠️ Stack

| Tecnologia | Ruolo |
| --- | --- |
| [Astro](https://astro.build/) | Rendering statico, routing, content collections |
| [Tailwind CSS](https://tailwindcss.com/) | Stili responsive |
| [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography) | Tema di lettura per il Markdown renderizzato |
| [Alpine.js](https://alpinejs.dev/) | Menu mobile, filtri, interazioni locali |
| [TypeScript](https://www.typescriptlang.org/) | Configurazione, helper, contratti dei componenti |
| [EmailJS](https://www.emailjs.com/) | Invio del form di contatto dal browser |
| [`sharp`](https://sharp.pixelplumbing.com/) | Ottimizzazione immagini di Astro |
| `cva`, `clsx`, `tailwind-merge` | Composizione delle classi UI |
| [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | Test unitari, di integrazione ed end-to-end |

## 🚀 Avvio locale

**Requisiti:** Node.js `>=22.12.0`.

```sh
npm install
npm run dev
```

Il sito è disponibile su `http://localhost:4321`.

| Comando | Scopo |
| --- | --- |
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build statica in `dist/` |
| `npm run preview` | Serve la build locale |
| `npx astro check` | Diagnostica su template e tipi |
| `npx astro dev --background` | Server di sviluppo in background |
| `npx astro dev stop` \| `status` \| `logs` | Controllo del server in background |

## 🧪 Test e verifica

Tre livelli di controllo, separati per cartella:

```sh
npm run test:unit          # Vitest sugli helper
npm run test:integration   # Vitest su una build Astro reale
npm run test:e2e           # Playwright sul sito servito
npm test                   # Tutte e tre in sequenza
```

Per lanciare un singolo test:

```sh
npx vitest run tests/unit/helpers.test.ts -t "formats a Date"
npx playwright test -g "opens the mobile navigation"
```

> ⚠️ **Playwright non avvia il sito da solo.** La configurazione non ha un `webServer` e punta a `http://127.0.0.1:4321`: prima di `test:e2e` serve un server già attivo in un altro processo.
>
> ```sh
> npm run build && npx astro preview --host 127.0.0.1 --background
> npm run test:e2e
> ```

> ℹ️ `tests/integration/build.test.ts` esegue una vera `astro build` al caricamento del modulo: è lento e **sovrascrive `dist/`**.

Criterio di uscita per ogni modifica:

```sh
npx astro check   # deve chiudere con 0 errori
npm run build     # deve completare pulita
```

## ✉️ Configurazione EmailJS

Il form usa EmailJS quando queste variabili pubbliche sono presenti. In loro assenza ricade silenziosamente sull'azione `mailto:` del form.

```env
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Il template EmailJS deve prevedere almeno i campi `from_name`, `reply_to`, `subject` e `message`.

## ♿ Accessibilità

Le pagine seguono convenzioni che i test end-to-end verificano attivamente:

- 🏗️ landmark semantici: `header`, `main`, `nav`, `section`, `article`, `footer`;
- 🔗 `aria-labelledby` che collega ogni sezione al proprio titolo (es. `#articles-title`);
- 🎛️ `aria-expanded` sul toggle del menu mobile;
- 📢 `role="status"` e `aria-live` per il feedback del form;
- 🏷️ `aria-label` in italiano su link e controlli;
- ⌨️ focus visibile su link e controlli interattivi;
- 🖼️ testo alternativo su tutte le immagini;
- 🕰️ elemento `<time datetime>` per le date degli articoli.
