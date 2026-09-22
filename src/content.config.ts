import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const readingsCollection = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: './src/content/readings'
    }),
    schema: z.object({
        name: z.string(),
        author: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        topic: z.string(),
        amazonUrl: z.string().url(),
        addedDate: z.date(),
    })
});

const articlesCollection = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: './src/content/articles'
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        updatedDate: z.date().optional(),
        author: z.string().default("Elia Giolli"),
        featured: z.boolean().default(false),
        // Sequence inside a category, so a multi-part cycle reads in the intended order.
        order: z.number(),
        tags: z.array(z.string()),
        topic: z.string(),
        category: z.string(),
        slug: z.string(),
    })
});

export const collections = {
    readings: readingsCollection,
    articles: articlesCollection,
}