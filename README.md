# Imperi e Rivoluzioni

Blog personale dedicato alla storia contemporanea e alla geopolitica. Il progetto raccoglie articoli, letture consigliate e approfondimenti sui rapporti tra imperi, ideologie, conflitti e ordine internazionale.

## Contenuti

- **Homepage** (`/`): presenta il progetto, i temi principali, le letture, gli articoli e i contatti.
- **Articoli** (`/articles`): archivio delle analisi storiche, con pagine di dettaglio generate dalla collection `articles`.
- **Letture consigliate** (`/readings`): libri organizzati per autore, argomento, descrizione e tag, con pagine di dettaglio e link ad Amazon.
- **Temi** (`/about`): le chiavi di lettura del progetto.
- **Contatti** (`/contacts`): form di contatto con invio tramite EmailJS quando configurato e fallback `mailto:`.
- **Navigazione**: navbar responsive con menu mobile gestito da Alpine.js.

## Struttura

Il progetto segue una struttura feature-based: layout, componenti condivisi e sezioni specifiche sono separati per responsabilità.

```text
.
├── public/                         # Asset statici pubblici
├── src/
│   ├── content/
│   │   ├── articles/               # Articoli e case study storici
│   │   └── readings/               # Schede delle letture consigliate
│   ├── content.config.ts           # Collection tipizzate
│   ├── core/
│   │   ├── helpers/                # Helper condivisi
│   │   └── layouts/                # Layout Astro
│   ├── features/
│   │   ├── articles/               # Cards e sezione articoli
│   │   ├── certificates/            # Certificati
│   │   ├── contact/                # Form e sezione contatti
│   │   ├── home/                   # Hero e profilo
│   │   └── readings/               # Cards, filtri e sezione letture
│   ├── pages/                      # Route Astro
│   ├── shared/                     # Componenti, form e utility riutilizzabili
│   └── styles/                     # Stili globali
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Flusso dei contenuti

### Articoli

```text
src/content/articles/*.md
          │
          ▼
   content.config.ts
          │
          ├── ArticlesSection → ArticleCard
          │
          └── /articles/[id] → contenuto Markdown completo
```

La collection `articles` valida titolo, descrizione, tag, tema, categoria e slug. Gli articoli sono raggruppati nella pagina archivio per tema e categoria.

### Letture

```text
src/content/readings/*.md
          │
          ▼
   content.config.ts
          │
          ├── ReadingSection → ReadingCard → /readings/[id]
          │
          └── ReadingTagFilters → filtro locale per tag
```

La collection `readings` valida nome, autore, descrizione, tag, argomento e URL Amazon. Il contenuto completo viene renderizzato nella pagina di dettaglio.

## Stack

- [Astro](https://astro.build/) per rendering statico, routing e content collections
- [Tailwind CSS](https://tailwindcss.com/) per gli stili responsive
- [Alpine.js](https://alpinejs.dev/) per menu mobile, filtri e interazioni locali
- TypeScript per configurazione, helper e contratti dei componenti
- [EmailJS](https://www.emailjs.com/) per il form di contatto
- `sharp` per l'elaborazione delle immagini Astro
- `class-variance-authority`, `clsx` e `tailwind-merge` per le utility UI

La direzione visiva usa una palette ispirata alla carta, al carbone, all'oro antico e al rosso ruggine.

## Avvio locale

Requisiti: Node.js `>=22.12.0`.

```sh
npm install
npm run dev
```

Il sito è disponibile su `http://localhost:4321`.

Per avviare Astro in background:

```sh
npx astro dev --background
```

| Comando | Scopo |
| --- | --- |
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Genera la build statica |
| `npm run preview` | Serve la build locale |
| `npm run astro` | Esegue i comandi Astro |
| `npx astro dev stop` | Arresta il server in background |
| `npx astro dev status` | Controlla lo stato del server |
| `npx astro dev logs` | Mostra i log del server in background |

## Configurazione EmailJS

Il form usa EmailJS quando sono presenti queste variabili pubbliche. In assenza della configurazione, mantiene un fallback diretto tramite `mailto:`.

```env
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Il template EmailJS deve prevedere almeno i campi `from_name`, `reply_to`, `subject` e `message`.

## Accessibilità

- landmark semantici come `header`, `main`, `nav`, `section`, `article` e `footer`;
- relazioni esplicite tra controlli e contenuti correlati;
- label associate ai campi e messaggi live per gli stati del form;
- focus visibile per link e controlli interattivi;
- testo alternativo per immagini e certificati;
- supporto a `prefers-reduced-motion` negli elementi animati.

## Test suite

Il progetto include tre livelli di controllo automatizzati:

```sh
npm run test:unit
npm run test:integration
npm run test:e2e
```

Per eseguire tutte le suite in sequenza:

```sh
npm test
```

## Verifica

Per controllare template, tipi e diagnostica Astro:

```sh
npx astro check
```

Per verificare la generazione statica:

```sh
npm run build
```

La build verifica collection, route, immagini e bundle client delle interazioni.
