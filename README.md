# Elia Giolli · Portfolio

Portfolio personale di Elia Giolli, tecnico IT Support orientato a troubleshooting, networking e infrastrutture Windows.

Il progetto racconta il lavoro attraverso case study tecnici: non solo cosa è stato costruito, ma come è stato diagnosticato, verificato e documentato.

## ✦ Esperienza


## 🧭 Architettura

Il progetto usa Astro per il rendering statico, Alpine.js per le interazioni leggere e una content collection tipizzata per i progetti.

```text
portfolio-astro/
├── public/                     # Asset statici serviti senza trasformazione
├── src/
│   ├── core/layouts/           # Shell globale, layout principale e layout CV dedicato
│   │   ├── MainLayout.astro
│   │   └── CvLayout.astro
│   ├── features/               # Slice per dominio: home, CV, progetti, certificati, contatti
│   │   ├── certificates/assets/
│   │   ├── cv/
│   │   ├── home/assets/
│   │   ├── home/
│   │   ├── projects/
│   │   └── contact/
│   ├── shared/                 # UI, form, utility e componenti riutilizzabili
│   │   ├── components/
│   │   ├── forms/
│   │   ├── lib/
│   │   ├── ui/
│   │   └── utils/
│   ├── content/projects/       # Markdown dei progetti e case study
│   ├── content.config.ts       # Schema tipizzato della collection projects
│   ├── helpers/                 # Helper condivisi per testo e date
│   ├── pages/                  # Route Astro: home, /cv e /projects/[...slug]
│   ├── styles/                 # Stili globali del portfolio
├── tsconfig.json               # Configurazione TypeScript ereditata da Astro
├── astro.config.mjs
├── package.json
├── PALETTE.md
├── ROADMAP.md
├── FINAL-REVISION.md
└── README.md
# Imperi e Rivoluzioni

Blog personale dedicato alla storia contemporanea e alla geopolitica. Il progetto raccoglie articoli, letture consigliate e approfondimenti sui rapporti tra imperi, ideologie, conflitti e ordine internazionale.

## Contenuti

- **Homepage**: presenta il progetto, i temi principali, le letture consigliate e i contatti.
- **Articoli**: sezione blog attualmente predisposta con contenuti di esempio e una route dinamica per il dettaglio.
- **Letture consigliate**: libri organizzati per autore, argomento, descrizione e tag, con una pagina di dettaglio e link ad Amazon.
- **Temi**: pagina `/about` dedicata ai temi e alle chiavi di lettura del progetto.
- **Contatti**: form di contatto con invio tramite EmailJS quando configurato e fallback `mailto:`.
- **Navigazione**: navbar responsive con menu mobile gestito da Alpine.js.

## Struttura

Il progetto segue una struttura feature-based: i layout e gli elementi condivisi sono separati dalle sezioni specifiche della homepage.

```text
.
├── public/                         # Asset statici pubblici
├── src/
│   ├── content/
│   │   ├── projects/               # Progetti tecnici documentati in Markdown
│   │   └── readings/               # Schede e approfondimenti sui libri
│   ├── content.config.ts           # Collection tipizzate projects e readings
│   ├── core/
│   │   ├── helpers/                # Helper condivisi
│   │   └── layouts/                # MainLayout.astro
│   ├── features/
│   │   ├── certificates/           # Sezione certificazioni
│   │   ├── contact/                # Sezione contatti
│   │   ├── home/                   # Hero e profilo
│   │   ├── projects/               # Cards e sezione progetti
│   │   └── readings/               # Cards e sezione letture
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── about.astro             # Temi del progetto
│   │   ├── articles/               # Indice e dettaglio articoli
│   │   └── readings/               # Indice e dettaglio letture
│   ├── shared/
│   │   ├── components/             # Navbar e footer
│   │   ├── forms/                  # Form e input riutilizzabili
│   │   ├── lib/                    # Utility generiche
│   │   ├── ui/                     # Primitive UI, card e button
│   │   └── utils/                  # Costanti e varianti
│   └── styles/                     # Stili globali
├── astro.config.mjs
├── package.json
├── PALETTE.md
├── ROADMAP.md
└── tsconfig.json
```

## Flusso dei contenuti

### Progetti

```text
src/content/projects/*.md
          │
          ▼
   content.config.ts
          │
          ▼
   ProjectsSection → ProjectCard
          │
          └── link al repository GitHub
```

I progetti sono mostrati nella homepage attraverso pannelli tab gestiti da Alpine.js. Ogni scheda contiene titolo, tag, descrizione e link GitHub.

### Letture

```text
src/content/readings/*.md
          │
          ▼
   content.config.ts
          │
          ├── ReadingSection → ReadingCard → /readings/:id
          │
          └── pagina completa con contenuto Markdown renderizzato
```

La collection `readings` valida nome, autore, descrizione, tag, argomento e URL Amazon per ogni lettura.

## Stack

- [Astro](https://astro.build/) per rendering, routing e content collections
- [Tailwind CSS](https://tailwindcss.com/) per gli stili responsive
- [Alpine.js](https://alpinejs.dev/) per menu, tab e interazioni locali
- TypeScript per configurazione, helper e contratti dei componenti
- [EmailJS](https://www.emailjs.com/) per il form di contatto
- `sharp` per l'elaborazione delle immagini Astro
- `class-variance-authority`, `clsx` e `tailwind-merge` per le utility UI

La direzione visiva usa una palette ispirata alla carta, al carbone, all'oro antico e al rosso ruggine. I riferimenti sono raccolti in [PALETTE.md](PALETTE.md).

## Avvio locale

Requisiti: Node.js `>=22.12.0`.

```sh
npm install
npm run dev
```

Per usare il server Astro in background:

```sh
npx astro dev --background
```

Il sito è disponibile su `http://localhost:4321`.

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

Il form usa EmailJS quando sono presenti queste variabili pubbliche. Senza configurazione, mantiene un fallback diretto tramite `mailto:`.

```env
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Il template EmailJS deve prevedere almeno i campi `from_name`, `reply_to`, `subject` e `message`.

## Accessibilità

- landmark semantici come `header`, `main`, `nav`, `section`, `article` e `footer`;
- relazioni esplicite tra tab e pannelli tramite `aria-controls`, `aria-labelledby` e `aria-selected`;
- label associate ai campi del form e messaggi live per gli stati di invio;
- focus visibile per link e controlli interattivi;
- testo alternativo per logo, immagini e certificati;
- supporto a `prefers-reduced-motion` negli elementi animati.

## Verifica

Per controllare template, tipi e diagnostica Astro:

```sh
npx astro check
```

Per verificare la generazione statica:

```sh
npm run build
```

La build verifica collection, route, immagini e bundle client. La route dinamica degli articoli è ancora un'area in evoluzione: prima della pubblicazione è necessario collegarla a una collection di articoli e aggiungere i relativi `getStaticPaths()`.

## Riferimenti

- [Documentazione Astro](https://docs.astro.build/)
- [Documentazione Alpine.js](https://alpinejs.dev/start-here)
- [ROADMAP.md](ROADMAP.md)
- [PALETTE.md](PALETTE.md)
```

### Flusso dei progetti

```text
src/content/projects/*.md
          │
          ▼
   content.config.ts
          │
          ├── Home page → ProjectsSection → tabbed carousel
          │
          └── ProjectCard → /projects/:slug
                                             │
                                             ▼
                                  ProjectDetail
                                             │
                                             └── markdown completo + case study
```

Nota: la home page contiene la sezione progetti; il CTA del hero usa un link anchor verso `#projects` invece di una route dedicata a `/projects`.

## 🛠️ Stack

- [Astro](https://astro.build/) · rendering statico e routing
- [Tailwind CSS](https://tailwindcss.com/) · sistema visuale e responsive layout
- [Alpine.js](https://alpinejs.dev/) · carousel, menu mobile e stato locale
- `Card.astro`, `Button.astro`, `Input.astro` e `Form.astro` · primitive UI condivise
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) · contenuti progetto tipizzati
- [Astro Image](https://docs.astro.build/en/guides/images/) + `sharp` · ottimizzazione immagini
- [EmailJS](https://www.emailjs.com/) · invio del form di contatto
- TypeScript · helper e contratti dei componenti

## 🚀 Avvio locale

Requisiti: Node.js `>=22.12.0`.

```sh
npm install
npm run dev
```

Per avviare il server nella modalità background prevista dal progetto:

```sh
npx astro dev --background
```

Il sito è disponibile su `http://localhost:4321`.

Comandi utili:

| Comando | Scopo |
| --- | --- |
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Genera il sito statico di produzione |
| `npm run preview` | Serve la build locale |
| `npm run astro` | Esegue comandi Astro |
| `npx astro dev stop` | Arresta il server background |
| `npx astro dev status` | Controlla lo stato del server |
| `npx astro dev logs` | Legge i log del server background |

## ✉️ Configurazione EmailJS

Il form usa EmailJS quando sono presenti queste variabili pubbliche. In assenza della configurazione, mantiene un fallback `mailto:` per non interrompere il contatto.

```env
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Il template EmailJS deve prevedere almeno i campi `from_name`, `reply_to`, `subject` e `message`.

## ♿ Accessibilità

- landmark semantici: `header`, `main`, `nav`, `section`, `article`, `footer`;
- relazioni esplicite tra tab e pannelli con `aria-controls`, `aria-labelledby` e `aria-selected`;
- label associate ai campi, stati obbligatori e messaggi live per il form;
- focus visibile per link, pulsanti e controlli interattivi;
- testo alternativo per fotografie e certificati;
- supporto a `prefers-reduced-motion` nello smooth scroll.

## 🧪 Verifica

Prima di una modifica importante:

```sh
npm run build
```

La build verifica content collection, route dinamiche, trasformazione delle immagini e bundle client delle interazioni.

## 📌 Stato del progetto

Le fasi 1–9 del [ROADMAP.md](ROADMAP.md) sono completate. La struttura segue una separazione feature-based tra `core`, `features` e `shared`.

In particolare, la pagina CV è disponibile in `/cv`, usa un layout dedicato con branding minimale e torna alla home tramite pulsante dedicato; i link interni del navbar e i CTA della homepage puntano alla sezione corretta in home page senza creare route non esistenti.

## 🔗 Riferimenti

- [Profilo GitHub di Elia Giolli](https://github.com/EliaGiolli)
- [Documentazione Astro](https://docs.astro.build/)
- [Documentazione Alpine.js](https://alpinejs.dev/start-here)
