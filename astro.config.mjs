// @ts-check
import { defineConfig } from 'astro/config';

// Verejná adresa webu
export default defineConfig({
  site: 'https://portfolio-beta-self-68.vercel.app',
  trailingSlash: 'ignore',
  // Prednačítanie stránok
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { format: 'directory' },
});
