import type { Lang } from '../i18n/utils';

/** Texty webu (SK a EN) */
const sk = {
  meta: {
    title: 'Web developer & grafický dizajnér',
    description:
      'Weby na mieru, UI/UX dizajn, vizuálne identity a grafika. Čistý kód a výrazný vizuál.',
  },
  nav: {
    work: 'Práce',
    about: 'O mne',
    services: 'Služby',
    contact: 'Kontakt',
    menu: 'Menu',
    theme: 'Prepnúť tému',
    lang: 'Switch to English',
  },
  hero: {
    role: ['Web developer', '& grafický dizajnér'],
    tagline:
      'Navrhujem a programujem weby a vizuálne identity, ktoré vyzerajú dobre a fungujú ešte lepšie.',
  },
  marquee: ['Web development', 'UI/UX dizajn', 'Vizuálna identita', 'Grafický dizajn', 'Motion', 'Frontend'],
  about: {
    label: 'O mne',
    statement:
      'Spájam čistý, rýchly kód s premysleným vizuálom. Postarám sa o všetko od prvého náčrtu loga až po spustenie webu.',
    body: [
      'Som web developer a grafický dizajnér. Baví ma, keď dizajn a technológia nie sú dva oddelené svety, ale jeden celok. Preto si projekty robím od návrhu až po finálny kód.',
      'Zakladám si na detailoch: plynulých animáciách, typografii, rýchlosti načítania a prístupnosti. Výsledkom sú weby a identity, ktoré majú charakter a zároveň fungujú.',
    ],
    toolsLabel: 'Nástroje',
    tools: [
      { group: 'Vývoj', items: ['HTML & CSS', 'JavaScript / TypeScript', 'Astro', 'React', 'GSAP'] },
      { group: 'Dizajn', items: ['Figma', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects'] },
    ],
  },
  services: {
    label: 'Služby',
    title: 'Čo robím',
    cta: 'Mám záujem',
    items: [
      {
        title: 'Web development',
        text: 'Rýchle, prístupné a responzívne weby na mieru. Od prezentačných stránok až po interaktívne webové zážitky.',
        list: ['Frontend na mieru', 'Astro / React', 'Animácie & motion', 'Výkon & SEO'],
      },
      {
        title: 'UI/UX dizajn',
        text: 'Rozhrania, ktoré sú intuitívne, konzistentné a zároveň majú vlastný charakter.',
        list: ['Wireframy & prototypy', 'Webdizajn vo Figme', 'Dizajn systémy', 'Responzívny dizajn'],
      },
      {
        title: 'Grafika & branding',
        text: 'Logá, vizuálne identity a grafika, ktorú si ľudia zapamätajú. Online aj v tlači.',
        list: ['Logo & identita', 'Sociálne siete', 'Tlačoviny', 'Plagáty & ilustrácie'],
      },
    ],
  },
  work: {
    label: 'Vybrané práce',
    title: 'Vybrané práce',
    all: 'Všetky projekty',
    view: 'Pozrieť',
    empty: 'Projekty pribúdajú. Čoskoro tu uvidíš viac.',
    indexTitle: 'Projekty',
    indexIntro: 'Výber webov, dizajnu a grafiky, na ktorých som pracoval.',
    filters: { all: 'Všetko', web: 'Web', graphic: 'Grafika' },
    categories: { web: 'Web', graphic: 'Grafika' },
  },
  project: {
    back: 'Späť na projekty',
    client: 'Klient',
    year: 'Rok',
    role: 'Rola',
    stack: 'Nástroje',
    live: 'Pozrieť naživo',
    next: 'Ďalší projekt',
  },
  contact: {
    label: 'Kontakt',
    title: ['Máš nápad?', 'Poďme ho', 'zrealizovať.'],
    text: 'Napíš mi pár viet o svojom projekte a ozvem sa ti čo najskôr.',
    copy: 'Kopírovať e-mail',
    copied: 'Skopírované!',
    socials: 'Sociálne siete',
    orEmail: 'Radšej e-mail?',
    form: {
      greeting: 'Ahoj {name},',
      nameLead: 'volám sa',
      nameLabel: 'Tvoje meno',
      namePh: 'tvoje meno',
      emailLead: 'a môj e-mail je',
      emailLabel: 'Tvoj e-mail',
      emailPh: 'tvoj@email.sk',
      servicesLead: 'Mám záujem o',
      services: ['Web', 'UI/UX dizajn', 'Grafiku & branding', 'Niečo iné'],
      budgetLead: 'Predstava o rozpočte',
      budgets: ['do 1 000 €', '1 000 až 3 000 €', '3 000 € +', 'Ešte neviem'],
      optional: 'nepovinné',
      messageLabel: 'Správa',
      messagePh: 'Povedz mi viac o projekte, termíne a o tom, čo od spolupráce očakávaš…',
      submit: 'Odoslať správu',
      sending: 'Odosielam…',
      privacy: 'Údaje použijem iba na odpoveď na tvoju správu.',
      subject: 'Nová správa z portfólia',
      successTitle: 'Ďakujem, {name}!',
      successText: 'Správa je na ceste. Ozvem sa ti čo najskôr.',
      again: 'Napísať ďalšiu správu',
      mailto: 'Otváram tvoj e-mailový program…',
      error: 'Niečo sa pokazilo. Skús to znova alebo mi napíš priamo na e-mail.',
      errors: {
        name: 'Napíš mi, prosím, ako sa voláš.',
        email: 'Skontroluj, prosím, e-mailovú adresu.',
        message: 'Pridaj aspoň pár slov o projekte.',
      },
    },
  },
  footer: {
    made: 'Navrhnuté a naprogramované mnou',
    top: 'Späť hore',
  },
  notFound: {
    title: 'Stránka sa nenašla',
    text: 'Táto stránka neexistuje alebo bola presunutá.',
    home: 'Späť na úvod',
  },
};

type Content = typeof sk;

const en: Content = {
  meta: {
    title: 'Web developer & graphic designer',
    description:
      'Custom websites, UI/UX design, visual identities and graphics. Clean code and bold visuals.',
  },
  nav: {
    work: 'Work',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    menu: 'Menu',
    theme: 'Toggle theme',
    lang: 'Prepnúť do slovenčiny',
  },
  hero: {
    role: ['Web developer', '& graphic designer'],
    tagline: 'I design and build websites and visual identities that look good and work even better.',
  },
  marquee: ['Web development', 'UI/UX design', 'Visual identity', 'Graphic design', 'Motion', 'Frontend'],
  about: {
    label: 'About',
    statement:
      'I combine clean, fast code with thoughtful visuals. I take care of everything from the first logo sketch to the website launch.',
    body: [
      'I’m a web developer and graphic designer. I enjoy it when design and technology aren’t two separate worlds but one whole. That’s why I take projects from concept all the way to production code.',
      'I care about the details: smooth motion, typography, load speed and accessibility. The result is websites and identities with character that also simply work.',
    ],
    toolsLabel: 'Toolkit',
    tools: [
      { group: 'Development', items: ['HTML & CSS', 'JavaScript / TypeScript', 'Astro', 'React', 'GSAP'] },
      { group: 'Design', items: ['Figma', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects'] },
    ],
  },
  services: {
    label: 'Services',
    title: 'What I do',
    cta: 'I’m interested',
    items: [
      {
        title: 'Web development',
        text: 'Fast, accessible and responsive custom websites. From company sites to interactive web experiences.',
        list: ['Custom frontend', 'Astro / React', 'Animation & motion', 'Performance & SEO'],
      },
      {
        title: 'UI/UX design',
        text: 'Interfaces that are intuitive and consistent, yet have a character of their own.',
        list: ['Wireframes & prototypes', 'Web design in Figma', 'Design systems', 'Responsive design'],
      },
      {
        title: 'Graphics & branding',
        text: 'Logos, visual identities and graphics people remember. Online and in print.',
        list: ['Logo & identity', 'Social media', 'Print', 'Posters & illustration'],
      },
    ],
  },
  work: {
    label: 'Selected work',
    title: 'Selected work',
    all: 'All projects',
    view: 'View',
    empty: 'Projects are on their way. More coming soon.',
    indexTitle: 'Work',
    indexIntro: 'A selection of websites, design and graphics I’ve worked on.',
    filters: { all: 'All', web: 'Web', graphic: 'Graphics' },
    categories: { web: 'Web', graphic: 'Graphics' },
  },
  project: {
    back: 'Back to work',
    client: 'Client',
    year: 'Year',
    role: 'Role',
    stack: 'Tools',
    live: 'Visit live site',
    next: 'Next project',
  },
  contact: {
    label: 'Contact',
    title: ['Got an idea?', 'Let’s make', 'it happen.'],
    text: 'Send me a few lines about your project and I’ll get back to you as soon as possible.',
    copy: 'Copy e-mail',
    copied: 'Copied!',
    socials: 'Socials',
    orEmail: 'Prefer e-mail?',
    form: {
      greeting: 'Hi {name},',
      nameLead: 'my name is',
      nameLabel: 'Your name',
      namePh: 'your name',
      emailLead: 'and my e-mail is',
      emailLabel: 'Your e-mail',
      emailPh: 'you@email.com',
      servicesLead: 'I’m interested in',
      services: ['Web', 'UI/UX design', 'Graphics & branding', 'Something else'],
      budgetLead: 'Budget range',
      budgets: ['under €1,000', '€1,000 to 3,000', '€3,000 +', 'Not sure yet'],
      optional: 'optional',
      messageLabel: 'Message',
      messagePh: 'Tell me more about the project, the timeline and what you expect from working together…',
      submit: 'Send message',
      sending: 'Sending…',
      privacy: 'I’ll only use your details to reply to your message.',
      subject: 'New message from the portfolio',
      successTitle: 'Thank you, {name}!',
      successText: 'Your message is on its way. I’ll get back to you soon.',
      again: 'Write another message',
      mailto: 'Opening your e-mail app…',
      error: 'Something went wrong. Please try again or e-mail me directly.',
      errors: {
        name: 'Please tell me your name.',
        email: 'Please check your e-mail address.',
        message: 'Add at least a few words about the project.',
      },
    },
  },
  footer: {
    made: 'Designed & developed by me',
    top: 'Back to top',
  },
  notFound: {
    title: 'Page not found',
    text: 'This page doesn’t exist or has been moved.',
    home: 'Back home',
  },
};

export const content: Record<Lang, Content> = { sk, en };
export const t = (lang: Lang) => content[lang];
