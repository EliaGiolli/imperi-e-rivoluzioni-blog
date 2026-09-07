# Elia Giolli · Portfolio

Portfolio personale di Elia Giolli, tecnico IT Support orientato a troubleshooting, networking e infrastrutture Windows.

Il progetto racconta il lavoro attraverso case study tecnici: non solo cosa è stato costruito, ma come è stato diagnosticato, verificato e documentato.

## ✦ Esperienza

- **Hero**: ruolo professionale, competenze principali, CTA verso il CV e scroll diretto alla sezione progetti.
- **Profilo**: esperienza in Help Desk, Service Desk, Microsoft 365, Windows e supporto enterprise.
- **Progetti**: carousel accessibile alimentato dalla content collection `projects`, con pannelli tab in home page.
- **Case study**: route dinamiche con causa, metodo di troubleshooting, verifica e documentazione completa; il ritorno porta alla home.
- **CV**: pagina dedicata con layout minimale, branding del portfolio e pulsante per tornare alla home.
- **Certificazioni**: carousel con immagini ottimizzate tramite Astro Image.
- **Contatti**: form accessibile con EmailJS e fallback diretto via client email.
- **Navigazione**: smooth scroll per ancore interne, navbar sticky e supporto a `prefers-reduced-motion`.

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
