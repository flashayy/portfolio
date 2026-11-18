import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type ScrollFn = (target: HTMLElement, offset?: number) => void;

const EASE = 'expo.out';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Interaktívny kontaktný formulár:
 * - polia rastú s textom (vetný formulár)
 * - validácia s „zatrasením“ chybného poľa
 * - odoslanie cez Web3Forms (fetch), bez kľúča fallback na mailto
 * - animovaný stav odosielania a poďakovania
 */
export function setupContact(scrollTo: ScrollFn, reduceMotion: boolean) {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  if (!form || !success) return;

  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const submitText = label.textContent ?? '';
  const d = form.dataset;

  /* ── Auto-grow ── */
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.grow > input, .grow > textarea').forEach((field) => {
    const wrap = field.parentElement as HTMLElement;
    const sync = () => (wrap.dataset.grow = field.value || field.placeholder);
    field.addEventListener('input', () => {
      sync();
      if (field.getAttribute('aria-invalid') === 'true' && isValid(field)) clearError(field);
    });
    sync();
  });

  /* ── Chips: malé „pop“ pri označení ── */
  form.querySelectorAll<HTMLInputElement>('.chip input').forEach((input) => {
    input.addEventListener('change', () => {
      if (reduceMotion || !input.checked) return;
      gsap.fromTo(input.nextElementSibling, { scale: 0.9 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    });
  });

  /* ── Tlačidlá „Mám záujem“ v službách → predvyplnenie ── */
  document.querySelectorAll<HTMLElement>('[data-prefill-service]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const chip = form.querySelector<HTMLInputElement>(`[data-service-index="${btn.dataset.prefillService}"]`);
      if (chip && !chip.checked) {
        chip.checked = true;
        chip.dispatchEvent(new Event('change'));
      }
      scrollTo(form);
      setTimeout(() => form.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true }), 1400);
    });
  });

  /* ── Validácia ── */
  function isValid(field: HTMLInputElement | HTMLTextAreaElement) {
    const v = field.value.trim();
    if (field.name === 'email') return EMAIL_RE.test(v);
    if (field.name === 'message') return v.length >= 10;
    return v.length >= 2;
  }
  function clearError(field: Element) {
    field.removeAttribute('aria-invalid');
    if (status.dataset.tone === 'error') setStatus('');
  }
  function setStatus(text: string, tone: 'error' | 'info' = 'info') {
    status.textContent = text;
    status.dataset.tone = tone;
    if (text && !reduceMotion) gsap.fromTo(status, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE });
  }
  function validate() {
    const fields = ['name', 'email', 'message'].map(
      (n) => form!.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${n}"]`)!,
    );
    const invalid = fields.filter((f) => !isValid(f));
    fields.forEach((f) => (invalid.includes(f) ? f.setAttribute('aria-invalid', 'true') : f.removeAttribute('aria-invalid')));
    if (!invalid.length) return true;

    const first = invalid[0];
    setStatus(d[`err${first.name[0].toUpperCase()}${first.name.slice(1)}`] ?? '', 'error');
    first.focus({ preventScroll: true });
    if (!reduceMotion) {
      invalid.forEach((f) =>
        gsap.fromTo(f.parentElement, { x: 0 }, { keyframes: { x: [-10, 9, -6, 4, 0] }, duration: 0.5, ease: 'power2.out' }),
      );
    }
    return false;
  }

  /* ── Odoslanie ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.dataset.state === 'sending' || !validate()) return;

    const data = new FormData(form);
    if (data.get('botcheck')) return; // spam bot

    const name = String(data.get('name') ?? '').trim();
    const payload: Record<string, string> = {};
    data.forEach((value, key) => {
      if (key === 'botcheck') return;
      payload[key] = payload[key] ? `${payload[key]}, ${value}` : String(value);
    });
    payload.subject = `${d.subject}: ${name}`;

    // Bez nastaveného kľúča: otvor e-mailového klienta s pripravenou správou
    if (!d.endpoint) {
      const body = [
        payload.message,
        '',
        `${name} <${payload.email}>`,
        payload.services && `• ${payload.services}`,
        payload.budget && `• ${payload.budget}`,
      ]
        .filter((l) => l !== undefined && l !== '')
        .join('\n');
      setStatus(d.msgMailto ?? '');
      window.location.href = `mailto:${d.email}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    form.dataset.state = 'sending';
    label.textContent = d.msgSending ?? '';
    setStatus('');

    try {
      const res = await fetch(d.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || res.statusText);
      showSuccess(name);
    } catch (err) {
      console.error('[contact]', err);
      form.dataset.state = 'error';
      label.textContent = submitText;
      setStatus(d.msgError ?? '', 'error');
    }
  });

  /* ── Poďakovanie ── */
  function showSuccess(name: string) {
    const title = success!.querySelector<HTMLElement>('[data-success-title]')!;
    title.textContent = (title.dataset.template ?? '').replace('{name}', name.split(' ')[0]);

    const reveal = () => {
      form!.hidden = true;
      form!.dataset.state = 'sent';
      success!.hidden = false;
      success!.focus({ preventScroll: true });
      // Posuň stránku k poďakovaniu (inak by ostala na mieste tlačidla, kde je teraz prázdno)
      scrollTo(success!, -120);
      ScrollTrigger.refresh();
      if (reduceMotion) return;
      const check = success!.querySelectorAll<SVGGeometryElement>('circle, path');
      check.forEach((el) => {
        const len = el.getTotalLength();
        gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: 'power3.inOut', delay: el.tagName === 'path' ? 0.45 : 0 });
      });
      gsap.from(success!.querySelectorAll('.csuccess__title, .csuccess__text, .csuccess__again'), {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: EASE,
        delay: 0.2,
      });
    };

    if (reduceMotion) return reveal();
    gsap.to(form, { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in', onComplete: reveal });
  }

  /* ── Napísať ďalšiu ── */
  success.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.grow > input, .grow > textarea').forEach((f) =>
      f.dispatchEvent(new Event('input')),
    );
    delete form.dataset.state;
    label.textContent = submitText;
    setStatus('');
    success.hidden = true;
    form.hidden = false;
    gsap.fromTo(form, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.8, ease: EASE });
    ScrollTrigger.refresh();
    form.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  });
}
