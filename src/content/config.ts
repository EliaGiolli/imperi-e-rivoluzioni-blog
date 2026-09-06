import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const projectsCollection = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: './src/content/projects'
    }),
    schema: z.object({
        title: z.string(),
        githubUrl: z.string(),
        tags: z.array(z.string()),
        slug: z.string(),
    })
});

export const collections = {
    projects: projectsCollection,
}