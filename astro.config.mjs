// @ts-check
import { defineConfig } from 'astro/config';

// Verejná adresa (canonical a hreflang). Pri vlastnej doméne ju zmeň.
export default defineConfig({
  site: 'https://portfolio-beta-self-68.vercel.app',
  trailingSlash: 'ignore',
  // Prednačítanie stránok, aby sa po kliknutí otvorili hneď
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { format: 'directory' },
});
