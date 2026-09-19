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