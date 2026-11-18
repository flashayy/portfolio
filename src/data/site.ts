/**
 * Globálne údaje o tebe, teda všetko, čo nie je závislé od jazyka.
 * Texty v SK/EN nájdeš v `src/data/content.ts`.
 */
export const site = {
  firstName: 'Samuel',
  lastName: 'Michalik', // TODO: overiť diakritiku
  email: 'samuel.michalik08@gmail.com',
  /** Farebná paleta: 'magenta' (magenta + charcoal), 'violet' (fialová + limetková) alebo 'orange' (oranžová). Definície sú v src/styles/palettes.css */
  palette: 'magenta' as 'magenta' | 'violet' | 'orange',
  /**
   * Povoliť indexovanie vo vyhľadávačoch (Google…).
   * Nechaj `false`, kým sú na webe ukážkové projekty a placeholdery.
   */
  indexable: false,
  /**
   * Kontaktný formulár cez Web3Forms (zadarmo, bez servera).
   * Kľúč získaš na https://web3forms.com, kde zadáš e-mail, kam majú správy chodiť.
   * Kľúč je verejný (patrí do HTML), nie je to heslo.
   * Kým je prázdny, formulár otvorí e-mailový program návštevníka (mailto).
   */
  contactForm: {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '7f689cfe-31d7-4bf3-a490-1d03cb95c735',
  },
  socials: [
    // Doplň odkaz na svoj profil, prázdne url sa nezobrazia (bez odkazov sa sekcia skryje)
    { label: 'Instagram', url: 'https://www.instagram.com/sxxmko/' },
    { label: 'GitHub', url: 'https://github.com/flashayy' },
  ],
} as const;

export const fullName = `${site.firstName} ${site.lastName}`;
