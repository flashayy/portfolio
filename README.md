# Portfólio

Astro + GSAP (ScrollTrigger, SplitText) + Lenis. SK/EN, tmavá a svetlá téma.

```bash
npm run dev      # vývoj na http://localhost:4321
npm run build    # produkčný build do dist/
npm run deploy   # nasadenie na Vercel (produkcia)
```

Web beží na **https://portfolio-beta-self-68.vercel.app**. Kým je v `src/data/site.ts`
`indexable: false`, vyhľadávače ho neindexujú — prepni na `true`, keď budú reálne projekty.

## Kde čo upraviť

| Čo | Súbor |
| --- | --- |
| Meno, e-mail, sociálne siete, dostupnosť | `src/data/site.ts` |
| Všetky texty (SK + EN) | `src/data/content.ts` |
| Farby, typografia | `src/styles/global.css` (`:root`) |
| Animácie pri scrollovaní | `src/scripts/main.ts` |
| Doména (SEO, hreflang) | `astro.config.mjs` → `site` |
| Kontaktný formulár (kľúč) | `src/data/site.ts` → `contactForm.accessKey` |

## Kontaktný formulár

Správy sa posielajú cez [Web3Forms](https://web3forms.com) (zadarmo, bez vlastného servera).
Na ich stránke zadaj e-mail, kam majú správy chodiť, a dostaneš *access key* — vlož ho do
`src/data/site.ts`. Kým je kľúč prázdny, formulár otvorí e-mailový program návštevníka s predvyplnenou správou.

## Pridanie projektu

1. Obrázky daj do `src/assets/projects/<nazov-projektu>/` (JPG/PNG/WebP, Astro ich sám optimalizuje).
2. Vytvor `src/content/projects/sk/<slug>.md` a `src/content/projects/en/<slug>.md` (rovnaký `slug` = ten istý projekt).
3. Frontmatter:

```yaml
---
title: Názov projektu
summary: Jedna-dve vety o projekte.
category: web        # web | graphic
year: 2026
client: Klient       # nepovinné
role: Dizajn & vývoj
stack: [Figma, Astro]
cover: ../../../assets/projects/<nazov-projektu>/cover.jpg
coverAlt: Popis obrázka
detailCover: ../../../assets/projects/<nazov-projektu>/detail.jpg   # nepovinné, iný obrázok v detaile projektu
accent: lime         # lime | pink
url: https://...     # nepovinné, odkaz na živý web
featured: true       # zobraziť na úvode
order: 1             # poradie
draft: false         # true = skryté v produkcii
---
```

4. Pod frontmatter píš case study v Markdowne (`## Nadpisy`, odseky, obrázky `![popis](../../../assets/projects/...)`).

Ukážkové projekty `ukazka-*.md` a `src/assets/projects/placeholder-*.svg` zmaž, keď pridáš reálne práce.
