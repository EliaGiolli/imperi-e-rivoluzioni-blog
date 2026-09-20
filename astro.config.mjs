// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Production origin. Canonical URLs, Open Graph tags, the sitemap and the RSS feed
  // are all built from it, so it has to match the deployed domain exactly.
  site: "https://imperi-e-rivoluzioni-blog.vercel.app",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
