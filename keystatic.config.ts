import { collection, config, fields } from "@keystatic/core";

// SPIKE: local storage, readings only. Mirrors the Zod schema in src/content.config.ts.
export default config({
  storage: { kind: "local" },
  collections: {
    // SPIKE: temporary, only to probe the markdoc body round-trip
    articles: collection({
      label: "Articoli",
      slugField: "fileName",
      path: "src/content/articles/**",
      format: { contentField: "content", data: "yaml" },
      schema: {
        fileName: fields.slug({ name: { label: "Nome file" } }),
        title: fields.text({ label: "Titolo" }),
        description: fields.text({ label: "Descrizione", multiline: true }),
        pubDate: fields.date({ label: "Data" }),
        updatedDate: fields.date({ label: "Aggiornato" }),
        author: fields.text({ label: "Autore" }),
        featured: fields.checkbox({ label: "In evidenza" }),
        order: fields.integer({ label: "Ordine" }),
        tags: fields.array(fields.text({ label: "Tag" }), { label: "Tag", itemLabel: (p) => p.value }),
        topic: fields.text({ label: "Tema" }),
        category: fields.text({ label: "Categoria" }),
        slug: fields.text({ label: "Slug URL", validation: { isRequired: true } }),
        content: fields.mdx({ label: "Testo", extension: "md" }),
      },
    }),
    readings: collection({
      label: "Letture",
      slugField: "name",
      path: "src/content/readings/*",
      format: { contentField: "content", data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Titolo" } }),
        author: fields.text({ label: "Autore", validation: { isRequired: true } }),
        description: fields.text({ label: "Descrizione", multiline: true, validation: { isRequired: true } }),
        tags: fields.array(fields.text({ label: "Tag" }), { label: "Tag", itemLabel: (p) => p.value }),
        topic: fields.text({ label: "Tema", validation: { isRequired: true } }),
        amazonUrl: fields.url({ label: "Link Amazon", validation: { isRequired: true } }),
        addedDate: fields.date({ label: "Data di aggiunta", validation: { isRequired: true } }),
        content: fields.markdoc({ label: "Testo", extension: "md" }),
      },
    }),
  },
});
