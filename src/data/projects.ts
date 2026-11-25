import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';

export type Project = CollectionEntry<'projects'> & { slug: string };

/** Projekty jazyka, zoradené podľa poradia a roku. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection(
    'projects',
    ({ id, data }) => id.startsWith(`${lang}/`) && (import.meta.env.DEV || !data.draft),
  );
  return entries
    .map((entry) => ({ ...entry, slug: entry.id.slice(lang.length + 1) }))
    .sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}
