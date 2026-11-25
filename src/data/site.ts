/** Údaje nezávislé od jazyka (texty sú v content.ts). */
export const site = {
  firstName: 'Samuel',
  lastName: 'Michalik',
  email: 'samuel.michalik08@gmail.com',
  /** Aktívna paleta (palettes.css) */
  palette: 'magenta' as 'magenta' | 'violet' | 'orange',
  /** Indexovanie vo vyhľadávačoch */
  indexable: false,
  /** Web3Forms (bez kľúča formulár použije mailto) */
  contactForm: {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '7f689cfe-31d7-4bf3-a490-1d03cb95c735',
  },
  socials: [
    // Prázdne url sa nezobrazí
    { label: 'Instagram', url: 'https://www.instagram.com/sxxmko/' },
    { label: 'GitHub', url: 'https://github.com/flashayy' },
  ],
} as const;

export const fullName = `${site.firstName} ${site.lastName}`;
