import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { setupContact } from './contact';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const qs = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const qsa = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'expo.out';
const DESKTOP = '(min-width: 901px) and (prefers-reduced-motion: no-preference)';

let lenis: Lenis | null = null;
let intro: gsap.core.Timeline | null = null;

/* ───────────────────────── Boot ───────────────────────── */

export async function boot() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  if (!reduceMotion) setupLenis();
  setupHeader();
  setupMenu();
  setupTheme();
  setupCopy();
  setupNavigation();
  setupIndexFilter();
  setupContact((el, offset) => scrollTo(el, false, offset), reduceMotion);
  if (finePointer && !reduceMotion) {
    setupCursor();
    setupMagnetic();
    setupIndexPreview();
    setupHeroPointer();
  }

  await document.fonts.ready;

  if (reduceMotion) {
    gsap.set('[data-reveal], [data-intro], [data-hero-row], [data-intro-title]', { autoAlpha: 1 });
    qs('[data-preloader]')?.remove();
    finishTransitionInstantly();
    scrollToHash(true);
    return;
  }

  prepareIntro();
  setupScrollAnimations();
  await enterPage();
  intro?.play();
  ScrollTrigger.refresh();
  scrollToHash(true);
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ───────────────────────── Smooth scroll ───────────────────────── */

function setupLenis() {
  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  if (import.meta.env.DEV) Object.assign(window, { __lenis: lenis, __st: ScrollTrigger });
}

function scrollTo(target: HTMLElement | number, immediate = false, offset = 0) {
  if (lenis) lenis.scrollTo(target, { immediate, duration: 1.1, force: true, offset });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
  else target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
}

function scrollToHash(immediate = false) {
  if (!location.hash) return;
  const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (el) requestAnimationFrame(() => scrollTo(el, immediate));
}

/* ───────────────────────── Page enter / leave ───────────────────────── */

async function enterPage() {
  try {
    sessionStorage.setItem('visited', '1');
    sessionStorage.removeItem('pt');
  } catch {}

  if (root.classList.contains('is-first')) return runPreloader();

  if (root.classList.contains('is-transitioning')) {
    const curtain = qs('[data-curtain]');
    if (!curtain) return;
    gsap.set(curtain, { yPercent: 0 });
    root.classList.remove('is-transitioning');
    const tl = gsap.timeline();
    tl.to(qs('.curtain__logo', curtain), { autoAlpha: 0, y: -20, duration: 0.25, ease: 'power2.in' }).to(
      curtain,
      { yPercent: -101, duration: 0.65, ease: 'expo.inOut' },
      0.05,
    );
    await new Promise<void>((resolve) => tl.call(resolve, [], 0.35));
    tl.eventCallback('onComplete', () => {
      gsap.set(curtain, { yPercent: 101 });
      gsap.set(qs('.curtain__logo', curtain), { clearProps: 'all' });
    });
  }
}

function finishTransitionInstantly() {
  try {
    sessionStorage.setItem('visited', '1');
    sessionStorage.removeItem('pt');
  } catch {}
  root.classList.remove('is-transitioning', 'is-first');
}

function runPreloader(): Promise<void> {
  const pre = qs('[data-preloader]');
  if (!pre) return Promise.resolve();
  lenis?.stop();

  const paths = qsa<HTMLElement>('path', pre);
  const counter = qs('[data-preloader-count]', pre);
  const progress = { v: 0 };

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        pre.remove();
        root.classList.remove('is-first');
        lenis?.start();
      },
    });
    tl.from(paths, {
      autoAlpha: 0,
      scale: 0.4,
      y: (i) => [-60, 60, -60][i] ?? 0,
      duration: 1.1,
      stagger: 0.12,
      ease: EASE,
    })
      .to(
        progress,
        {
          v: 100,
          duration: 1.5,
          ease: 'power3.inOut',
          onUpdate: () => {
            if (counter) counter.textContent = String(Math.round(progress.v));
          },
        },
        0,
      )
      .to(qs('.preloader__logo', pre), { scale: 0.8, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, '+=0.05')
      .to(qs('.preloader__bar', pre), { autoAlpha: 0, duration: 0.3 }, '<')
      .to(pre, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
      .call(resolve, [], '-=0.65');
  });
}

function leaveTo(href: string) {
  const curtain = qs('[data-curtain]');
  if (!curtain || reduceMotion) {
    location.href = href;
    return;
  }
  try {
    sessionStorage.setItem('pt', '1');
  } catch {}
  lenis?.stop();
  gsap
    .timeline({ onComplete: () => (location.href = href) })
    .fromTo(curtain, { yPercent: 101 }, { yPercent: 0, duration: 0.5, ease: 'expo.inOut' })
    .fromTo(
      qs('.curtain__logo', curtain),
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE },
      '-=0.2',
    );
}

function setupNavigation() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest('a');
    if (!a || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;

    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;

    // Kotva na tej istej stránke → plynulý scroll
    if (url.pathname === location.pathname && url.hash) {
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (el) {
        e.preventDefault();
        history.replaceState(null, '', url.hash);
        scrollTo(el);
      }
      return;
    }
    if (url.pathname === location.pathname && !url.hash) {
      e.preventDefault();
      scrollTo(0);
      return;
    }

    e.preventDefault();
    leaveTo(url.href);
  });

  // Návrat cez tlačidlo späť (bfcache): odkry stránku
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    const curtain = qs('[data-curtain]');
    if (curtain) gsap.set(curtain, { yPercent: 101 });
    root.classList.remove('is-transitioning');
    lenis?.start();
  });

  qsa('[data-scroll-top]').forEach((btn) => btn.addEventListener('click', () => scrollTo(0)));
}

/* ───────────────────────── Header & menu ───────────────────────── */

function setupHeader() {
  const header = qs('[data-header]');
  const toTop = qs('[data-to-top]');
  if (!header) return;
  let last = 0;
  const update = (y: number) => {
    header.classList.toggle('is-scrolled', y > 30);
    toTop?.classList.toggle('is-visible', y > window.innerHeight * 0.7);
    if (Math.abs(y - last) < 6) return;
    const hide = y > last && y > 240 && !root.classList.contains('menu-open');
    header.classList.toggle('is-hidden', hide);
    last = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }: { scroll: number }) => update(scroll));
  else window.addEventListener('scroll', () => update(window.scrollY), { passive: true });
  update(window.scrollY);
}

function setupMenu() {
  const btn = qs('[data-menu-toggle]');
  const menu = qs('[data-menu]');
  if (!btn || !menu) return;
  const labels = qsa('.menu__label', menu);
  const links = qsa('[data-menu-link]', menu);
  let open = false;

  const tl = gsap
    .timeline({ paused: true, onReverseComplete: () => (menu.hidden = true) })
    .fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
    .fromTo(labels, { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.05, ease: EASE }, 0.05);

  const set = (value: boolean) => {
    open = value;
    btn.setAttribute('aria-expanded', String(value));
    root.classList.toggle('menu-open', value);
    if (value) {
      menu.hidden = false;
      lenis?.stop();
      tl.timeScale(1).play();
    } else {
      lenis?.start();
      tl.timeScale(2.2).reverse();
    }
  };

  btn.addEventListener('click', () => set(!open));
  links.forEach((l) => l.addEventListener('click', () => set(false)));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && open && set(false));
  matchMedia('(min-width: 901px)').addEventListener('change', (e) => e.matches && open && set(false));
}

/* ───────────────────────── Theme ───────────────────────── */

function setupTheme() {
  const btn = qs('[data-theme-toggle]');
  if (!btn) return;
  const meta = document.querySelector('meta[name="theme-color"]');

  type Theme = 'light' | 'dark';
  const systemQuery = matchMedia('(prefers-color-scheme: light)');
  const systemTheme = (): Theme => (systemQuery.matches ? 'light' : 'dark');
  const savedTheme = (): Theme | null => {
    try {
      const v = localStorage.getItem('theme-choice');
      return v === 'light' || v === 'dark' ? v : null;
    } catch {
      return null;
    }
  };

  const apply = (theme: Theme) => {
    root.dataset.theme = theme;
    meta?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim() || '#000000');
  };

  /** Ručná voľba sa uloží; ak sa zhoduje so systémom, zmaže sa a téma znova sleduje systém. */
  const choose = (theme: Theme) => {
    apply(theme);
    try {
      if (theme === systemTheme()) localStorage.removeItem('theme-choice');
      else localStorage.setItem('theme-choice', theme);
    } catch {}
  };

  apply(root.dataset.theme === 'light' ? 'light' : 'dark');

  // Keď sa zmení systémové nastavenie a používateľ nemá vlastnú voľbu, prispôsob sa
  systemQuery.addEventListener('change', () => {
    if (!savedTheme()) apply(systemTheme());
  });

  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    if (!document.startViewTransition || reduceMotion) return choose(next);

    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.classList.add('theme-vt');
    const vt = document.startViewTransition(() => choose(next));
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
    vt.finished.finally(() => root.classList.remove('theme-vt'));
  });
}

/* ───────────────────────── Small UI ───────────────────────── */

function setupCopy() {
  qsa('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
      } catch {
        return;
      }
      const spans = qsa('.roll > span', btn);
      const original = spans[0]?.textContent ?? '';
      spans.forEach((s) => (s.textContent = btn.dataset.copied ?? ''));
      setTimeout(() => spans.forEach((s) => (s.textContent = original)), 2200);
    });
  });
}

function setupCursor() {
  const cursor = qs('[data-cursor-el]');
  const labelEl = qs('[data-cursor-label-el]');
  const label = qs('[data-cursor-label]');
  if (!cursor || !labelEl || !label) return;
  root.classList.add('has-cursor');

  const layers = [cursor, labelEl];
  const xTo = layers.map((el) => gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }));
  const yTo = layers.map((el) => gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' }));
  let shown = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (!shown) {
        gsap.set(layers, { x: e.clientX, y: e.clientY });
        shown = true;
      }
      xTo.forEach((fn) => fn(e.clientX));
      yTo.forEach((fn) => fn(e.clientY));
    },
    { passive: true },
  );

  document.addEventListener('pointerover', (e) => {
    const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor], a, button');
    const text = target?.dataset.cursor;
    cursor.classList.toggle('has-label', !!text);
    labelEl.classList.toggle('has-label', !!text);
    cursor.classList.toggle('is-hover', !!target && !text);
    // Plochy vo farbe značky: kontakt, tlačidlá s výplňou, „Všetky projekty“, karta služieb
    const onBrand = !!(e.target as Element | null)?.closest(
      '[data-footer-panel], .work__more, .btn, .to-top, .card--brand',
    );
    cursor.classList.toggle('on-brand', onBrand);
    if (text) label.textContent = text;
  });
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.documentElement.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
}

function setupMagnetic() {
  qsa('[data-cursor-stick], .theme-toggle, .btn').forEach((el) => {
    const strength = el.classList.contains('btn') ? 0.25 : 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

function setupHeroPointer() {
  const glow = qs('.hero__glow');
  if (!glow) return;
  const xTo = gsap.quickTo(glow, 'x', { duration: 2, ease: 'power3' });
  const yTo = gsap.quickTo(glow, 'y', { duration: 2, ease: 'power3' });
  window.addEventListener(
    'pointermove',
    (e) => {
      xTo((e.clientX / innerWidth - 0.5) * 80);
      yTo((e.clientY / innerHeight - 0.5) * 60);
    },
    { passive: true },
  );
}

/* ───────────────────────── Work index ───────────────────────── */

function setupIndexFilter() {
  const list = qs('[data-index-list]');
  const buttons = qsa('[data-filter]');
  if (!list || !buttons.length) return;
  const items = qsa('[data-category]', list);

  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      gsap.to(list, {
        autoAlpha: 0,
        y: 16,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          items.forEach((it) =>
            it.classList.toggle('is-hidden', filter !== 'all' && it.dataset.category !== filter),
          );
          gsap.set(items, { autoAlpha: 1, y: 0 });
          gsap.to(list, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE });
          ScrollTrigger.refresh();
        },
      });
    }),
  );
}

function setupIndexPreview() {
  const box = qs('[data-preview-box]');
  const inner = qs('[data-preview-inner]');
  if (!box || !inner) return;
  const images = qsa('img', inner);
  const xTo = gsap.quickTo(box, 'x', { duration: 0.7, ease: 'power3' });
  const yTo = gsap.quickTo(box, 'y', { duration: 0.7, ease: 'power3' });
  const rTo = gsap.quickTo(inner, 'rotation', { duration: 0.8, ease: 'power3' });
  let lastX = 0;
  let moved = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (!moved) {
        gsap.set(box, { x: e.clientX, y: e.clientY });
        moved = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4));
      lastX = e.clientX;
    },
    { passive: true },
  );

  qsa('[data-preview]').forEach((row) => {
    const index = Number(row.dataset.preview);
    row.addEventListener('pointerenter', (e) => {
      if (!moved) {
        gsap.set(box, { x: e.clientX, y: e.clientY });
        moved = true;
      }
      gsap.to(inner, { scale: 1, duration: 0.6, ease: EASE, overwrite: 'auto' });
      images.forEach((img, i) => gsap.to(img, { autoAlpha: i === index ? 1 : 0, duration: 0.35, overwrite: 'auto' }));
    });
    row.addEventListener('pointerleave', () => gsap.to(inner, { scale: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' }));
  });
}

/* ───────────────────────── Intro (on page enter) ───────────────────────── */

function prepareIntro() {
  intro = gsap.timeline({ paused: true, defaults: { ease: EASE } });

  const rows = qsa('[data-hero-row]');
  if (rows.length) {
    const split = new SplitText(rows, { type: 'chars', mask: 'chars', charsClass: 'split-char' });
    gsap.set(rows, { autoAlpha: 1 });
    intro.from(split.chars, { yPercent: 160, duration: 1.5, stagger: 0.04 }, 0);
  }

  const title = qs('[data-intro-title]');
  if (title) {
    const split = new SplitText(title, { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' });
    gsap.set(title, { autoAlpha: 1 });
    intro.from(split.chars, { yPercent: 160, duration: 1.3, stagger: 0.025 }, 0);
  }

  const items = qsa('[data-intro]');
  if (items.length) intro.from(items, { y: 24, autoAlpha: 0, duration: 1.2, stagger: 0.07 }, 0.4);
}

/* ───────────────────────── Scroll animations ───────────────────────── */

function setupScrollAnimations() {
  heroScroll();
  parallax();
  splitLines();
  scrubWords();
  reveals();
  stackCards();
  workGallery();
  projectCover();
  footerReveal();
}

function heroScroll() {
  const hero = qs('[data-hero]');
  if (!hero) return;
  const name = qs('[data-hero-name]', hero);
  const [row1, row2] = qsa('[data-hero-row]', hero);
  const bottom = qs('.hero__bottom', hero);
  const blobs = qsa('[data-blob]', hero);
  const mm = gsap.matchMedia();

  // Desktop: meno sa pri scrolle zužuje (mení sa šírka písma)
  mm.add(DESKTOP, () => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    if (name) tl.to(name, { '--stretch': 62, yPercent: 30 }, 0);
    if (row1) tl.to(row1, { xPercent: -6 }, 0);
    if (row2) tl.to(row2, { xPercent: 6 }, 0);
    if (bottom) tl.to(bottom, { yPercent: -40, autoAlpha: 0 }, 0);
    tl.to(blobs, { yPercent: (i) => -50 - i * 40 }, 0);
  });

  // Mobil: iba posuny (transform), žiadne prepočítavanie textu
  mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    if (name) tl.to(name, { yPercent: 25 }, 0);
    if (bottom) tl.to(bottom, { yPercent: -20, autoAlpha: 0 }, 0);
    tl.to(blobs, { yPercent: -30 }, 0);
  });
}

/** Jemný posun prvkov s data-parallax="yPercent" pri scrolle (iba transform). */
function parallax() {
  qsa('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) || -20;
    const trigger = el.closest('section') ?? el;
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      { yPercent: amount / 2, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

function splitLines() {
  qsa('[data-split-lines]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 135,
          duration: 1.3,
          stagger: 0.09,
          ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
  });
}

function scrubWords() {
  qsa('[data-scrub-words]').forEach((el) => {
    const split = new SplitText(el, { type: 'words' });
    gsap.fromTo(
      split.words,
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true },
      },
    );
  });
}

function reveals() {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08, ease: EASE, overwrite: true },
      ),
  });

  qsa('[data-stagger]').forEach((list) => {
    gsap.from(list.children, {
      y: 20,
      autoAlpha: 0,
      duration: 1,
      stagger: 0.06,
      ease: EASE,
      scrollTrigger: { trigger: list, start: 'top 90%', once: true },
    });
  });
}

function stackCards() {
  const cards = qsa('[data-stack-card]');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, {
      scale: 0.94,
      ease: 'power1.in',
      scrollTrigger: { trigger: next, start: 'top 75%', end: 'top 15%', scrub: true },
    });
  });
}

function workGallery() {
  const pin = qs('[data-work-pin]');
  const track = qs('[data-work-track]');
  const bar = qs('[data-work-progress]');
  if (!pin || !track) return;

  const mm = gsap.matchMedia();
  mm.add(DESKTOP, () => {
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
      },
    });

    qsa('[data-work-img]', track).forEach((img) => {
      gsap.fromTo(
        img,
        { xPercent: -15 },
        {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('[data-work-card]'),
            containerAnimation: tween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        },
      );
    });

    qsa('[data-work-card]', track).forEach((card) => {
      gsap.from(card, {
        yPercent: 12,
        rotation: 2.5,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: 'left right',
          end: 'left 55%',
          scrub: true,
        },
      });
    });
  });

  mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    qsa('[data-work-card]', track).forEach((card) => {
      gsap.from(card, {
        y: 60,
        autoAlpha: 0,
        duration: 1,
        ease: EASE,
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      });
    });
  });
}

function projectCover() {
  const frame = qs('[data-cover-frame]');
  const img = qs('[data-cover-img]');
  if (!frame || !img) return;
  const mm = gsap.matchMedia();

  mm.add(DESKTOP, () => {
    gsap.fromTo(
      frame,
      { clipPath: 'inset(10% 6% 10% 6% round 22px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 22px)',
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 20%', scrub: true },
      },
    );
    gsap.fromTo(
      img,
      { scale: 1.25, yPercent: -6 },
      {
        scale: 1,
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
    qsa('.prose img').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(8% 4% 8% 4% round 22px)', scale: 0.96 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 22px)',
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 40%', scrub: true },
        },
      );
    });
  });

  // Mobil: jednorazové odhalenie bez prekresľovania pri každom pohybe
  mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    [frame, ...qsa('.prose img')].forEach((el) =>
      gsap.from(el, {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      }),
    );
  });
}

function footerReveal() {
  const panel = qs('[data-footer-panel]');
  if (!panel) return;
  gsap.matchMedia().add(DESKTOP, () => {
    gsap.fromTo(
      panel,
      { scale: 0.94, transformOrigin: '50% 0%' },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 30%', scrub: true },
      },
    );
  });
}
