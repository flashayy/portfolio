export const langs = ['sk', 'en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'sk';

/** Názov sekcie s projektmi v URL pre každý jazyk */
const workSegment: Record<Lang, string> = { sk: 'projekty', en: 'work' };

const prefix = (lang: Lang) => (lang === defaultLang ? '' : `/${lang}`);

export const paths = {
  home: (lang: Lang) => `${prefix(lang)}/`,
  work: (lang: Lang) => `${prefix(lang)}/${workSegment[lang]}/`,
  project: (lang: Lang, slug: string) => `${prefix(lang)}/${workSegment[lang]}/${slug}/`,
};

export const otherLang = (lang: Lang): Lang => (lang === 'sk' ? 'en' : 'sk');

export const htmlLang: Record<Lang, string> = { sk: 'sk-SK', en: 'en' };
