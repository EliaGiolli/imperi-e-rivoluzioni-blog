import { collection, config, fields } from "@keystatic/core";
import { BLOG_AUTHOR, BLOG_NAME, GITHUB_REPO } from "./src/shared/utils/constants";

/*
 * Mirrors the Zod schemas in src/content.config.ts field for field; Zod stays the source of
 * truth and re-validates everything Keystatic writes on the next build.
 *
 * Two things Keystatic does that the schemas below are shaped around:
 * - its `slugField` lives in the *filename*, never in frontmatter, and keys missing from this
 *   schema are stripped on save;
 * - `fields.markdoc` rewrites GFM tables into `{% table %}` tags, so bodies use `fields.mdx`
 *   with a `.md` extension, which round-trips plain Markdown.
 */

// This file is bundled into the admin UI as well, so only PUBLIC_ variables are readable here.
const storage =
	import.meta.env.PUBLIC_KEYSTATIC_STORAGE === "github"
		? ({ kind: "github", repo: GITHUB_REPO } as const)
		: ({ kind: "local" } as const);

/** Articles are rendered under their own H1, so the body starts at H2. */
const body = fields.mdx({
	label: "Testo",
	extension: "md",
	options: { heading: [2, 3, 4], image: false },
});

const tags = fields.array(fields.text({ label: "Tag", validation: { isRequired: true } }), {
	label: "Tag",
	description: "Rispetta maiuscole e minuscole dei tag esistenti: «Colonialismo» e «colonialismo» diventano due filtri diversi.",
	itemLabel: (props) => props.value,
});

export default config({
	storage,
	ui: { brand: { name: BLOG_NAME } },
	collections: {
		articles: collection({
			label: "Articoli",
			// Entries live in per-topic subfolders (giappone/…), hence the double star.
			path: "src/content/articles/**",
			slugField: "title",
			format: { contentField: "content", data: "yaml" },
			entryLayout: "content",
			columns: ["title", "pubDate"],
			schema: {
				title: fields.slug({
					name: { label: "Titolo", validation: { isRequired: true } },
					slug: {
						label: "Percorso del file",
						description: "Solo il nome del file sul disco. L'indirizzo pubblico è lo «Slug URL» più sotto.",
					},
				}),
				description: fields.text({ label: "Descrizione", multiline: true, validation: { isRequired: true } }),
				pubDate: fields.date({ label: "Data di pubblicazione", validation: { isRequired: true } }),
				updatedDate: fields.date({ label: "Data di aggiornamento" }),
				author: fields.text({ label: "Autore", defaultValue: BLOG_AUTHOR }),
				featured: fields.checkbox({ label: "In evidenza" }),
				order: fields.integer({
					label: "Ordine",
					description: "Posizione dell'articolo all'interno della sua categoria.",
					validation: { isRequired: true },
				}),
				tags,
				topic: fields.text({ label: "Tema", validation: { isRequired: true } }),
				category: fields.text({ label: "Categoria", validation: { isRequired: true } }),
				// The live URL. Deliberately a plain text field, separate from the filename:
				// two articles already have a slug that differs from their filename.
				slug: fields.text({
					label: "Slug URL",
					description: "Diventa /articles/<slug>. Non cambiarlo dopo la pubblicazione: romperebbe i link esistenti.",
					validation: { isRequired: true, pattern: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Solo lettere minuscole, numeri e trattini" } },
				}),
				content: body,
			},
		}),
		readings: collection({
			label: "Letture",
			path: "src/content/readings/*",
			slugField: "name",
			format: { contentField: "content", data: "yaml" },
			columns: ["name", "author", "addedDate"],
			schema: {
				name: fields.slug({
					name: { label: "Titolo", validation: { isRequired: true } },
					slug: { label: "Percorso del file", description: "Diventa anche l'indirizzo pubblico: /readings/<percorso>." },
				}),
				author: fields.text({ label: "Autore", validation: { isRequired: true } }),
				description: fields.text({ label: "Descrizione", multiline: true, validation: { isRequired: true } }),
				tags,
				topic: fields.text({ label: "Tema", validation: { isRequired: true } }),
				amazonUrl: fields.url({ label: "Link Amazon", validation: { isRequired: true } }),
				addedDate: fields.date({
					label: "Data di aggiunta",
					description: "Quando il libro è entrato in bibliografia: ordina la sezione della homepage.",
					validation: { isRequired: true },
				}),
				content: body,
			},
		}),
	},
});
