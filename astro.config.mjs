// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'; // Gunakan plugin Vite

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rezcode.agency',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['axobject-query', 'aria-query'], // Tambahkan ini
    },
  },
});