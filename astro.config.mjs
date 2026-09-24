// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import vercel from "@astrojs/vercel";

import { isCmsEnabled, parseEnv } from "./src/core/config/envParser.ts";

// The CMS needs on-demand routes, hence an adapter. Gate both so the default build,
// `astro preview` and the test suites stay on the plain static path. Output stays
// 'static': Keystatic injects its own routes already marked `prerender: false`.
const withCms = isCmsEnabled(parseEnv());

// https://astro.build/config
export default defineConfig({
  // Production origin. Canonical URLs, Open Graph tags, the sitemap and the RSS feed
  // are all built from it, so it has to match the deployed domain exactly.
  site: "https://imperi-e-rivoluzioni-blog.vercel.app",

  ...(withCms ? { adapter: vercel() } : {}),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({ filter: (page) => !page.includes("/keystatic") }),
    // react() must precede keystatic()
    ...(withCms ? [react(), keystatic()] : []),
  ],
});
