# Elia Giolli · Portfolio

Portfolio personale di Elia Giolli, tecnico IT Support orientato a troubleshooting, networking e infrastrutture Windows.

Il progetto racconta il lavoro attraverso case study tecnici: non solo cosa è stato costruito, ma come è stato diagnosticato, verificato e documentato.

## ✦ Esperienza

- **Hero**: ruolo professionale, competenze principali e accesso al CV.
- **Profilo**: esperienza in Help Desk, Service Desk, Microsoft 365, Windows e supporto enterprise.
- **Progetti**: carousel accessibile alimentato dalla content collection `projects`.
- **Case study**: route dinamiche con causa, metodo di troubleshooting, verifica e documentazione completa.
- **Certificazioni**: carousel con immagini ottimizzate tramite Astro Image.
- **Contatti**: form accessibile con EmailJS e fallback diretto via client email.
- **Navigazione**: smooth scroll con offset per la navbar sticky e supporto a `prefers-reduced-motion`.

## 🧭 Architettura

Il progetto usa Astro per il rendering statico, Alpine.js per le interazioni leggere e una content collection tipizzata per i progetti.

```text
portfolio-astro/
├── components/                 # UI condivisa e componenti di feature
│   ├── AboutSection.astro
│   ├── CertificateCard.astro
│   ├── CertificatesSection.astro
│   ├── ContactMe.astro
│   ├── Form.astro
│   ├── Input.astro
│   ├── ProjectCard.astro
│   ├── ProjectComponent.astro
│   ├── ProjectsSection.astro
│   └── SmoothScroll.astro
├── public/                     # Asset statici serviti senza trasformazione
├── src/
│   ├── assets/images/          # Immagini gestite dalla pipeline Astro
│   │   ├── certificates/
│   │   ├── foto-elia.jpg
│   │   └── foto-laurea.jpg
│   ├── content/projects/       # Markdown dei progetti e case study
│   ├── content.config.ts       # Schema tipizzato della collection projects
│   ├── helpers/                # Helper riutilizzabili per testo e date
│   ├── layouts/                # MainLayout e sezioni/layout legacy
│   ├── lib/                    # Utility di composizione classi
│   ├── pages/                  # Route Astro e route dinamiche /projects/[...slug]
│   ├── styles/                 # Tailwind e stili globali
│   └── utils/                  # Costanti e varianti dei componenti
├── astro.config.mjs
├── package.json
├── PALETTE.md
└── ROADMAP.md
```

### Flusso dei progetti

```text
src/content/projects/*.md
          │
          ▼
   content.config.ts
          │
          ├── ProjectsSection → ProjectCard → /projects/:slug
          │                                  │
          │                                  ▼
          └────────────────────────── ProjectComponent
                                             │
                                             └── markdown completo + case study
```

## 🛠️ Stack

- [Astro](https://astro.build/) · rendering statico e routing
- [Tailwind CSS](https://tailwindcss.com/) · sistema visuale e responsive layout
- [Alpine.js](https://alpinejs.dev/) · carousel, menu mobile e stato locale
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

Le fasi 1–7 del [ROADMAP.md](ROADMAP.md) sono completate. Le fasi successive riguardano l’analisi finale del codice e una futura riorganizzazione feature-based della struttura.

## 🔗 Riferimenti

- [Profilo GitHub di Elia Giolli](https://github.com/EliaGiolli)
- [Documentazione Astro](https://docs.astro.build/)
- [Documentazione Alpine.js](https://alpinejs.dev/start-here)
