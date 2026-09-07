## Development
Before doing anything, always check the following documentation's pages:
- ASTRO DOCS: https://docs.astro.build/en/getting-started/
- ALPINE.JS DOCS: https://alpinejs.dev/start-here


And then follow the @ROADMAP.md
---

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

# UI and styling
Always prefere Alping.js over vanilla Javascript for browser interactivity

Create small components that follow the SoC and DRY principle (Separation of Concerns, Do not repeat yourself)

Separate the UI from the logic: when you can, outsource business logic inside the /helpers folder

## Color palette
Always check @PALETTE.md file before styling components

## Typography
font - Noto Sans