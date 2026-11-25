import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Projekty: src/content/projects/<jazyk>/<slug>.md */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.enum(['web', 'graphic']),
      year: z.number(),
      client: z.string().optional(),
      role: z.string(),
      stack: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string().default(''),
      /** Obrázok v detaile projektu (inak cover) */
      detailCover: image().optional(),
      detailCoverAlt: z.string().optional(),
      /** Farba akcentu */
      accent: z.enum(['primary', 'secondary']).default('primary'),
      url: z.url().optional(),
      /** Zobraziť na úvodnej stránke */
      featured: z.boolean().default(true),
      /** Poradie */
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
