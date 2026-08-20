/* ============================================================
   entro technology — v3
   script.js
   ------------------------------------------------------------
   01. Pomocne funkcije      05. Brojaci
   02. Meni                  06. Prekidac cena
   03. Akordeoni             07. Izdvojeni projekat
   04. Reveal                08. Utisci, vrh strane
   ============================================================ */

'use strict';

/* ============================================================
   01. POMOCNE FUNKCIJE
   ============================================================ */
const qs = (sel, ctx) => (ctx || document).querySelector(sel);
const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   02. MENI
   ============================================================ */
function initMenu() {
  const burger = qs('#burger');
  const menu = qs('#menu');
  if (!burger || !menu) return;

  const set = (open) => {
    burger.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => set(!menu.classList.contains('is-open')));
  qsa('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* ============================================================
   03. AKORDEONI
   Svaka grupa drzi otvorenu tacno jednu stavku.
   ============================================================ */
function initAccordions() {
  qsa('[data-acc]').forEach(group => {
    const items = qsa('[data-acc-item]', group);

    const paint = (openIndex) => {
      items.forEach((item, i) => {
        const on = i === openIndex;
        item.classList.toggle('is-open', on);
        const btn = qs('[data-acc-btn]', item);
        if (btn) btn.setAttribute('aria-expanded', String(on));
      });
    };

    items.forEach((item, i) => {
      const btn = qs('[data-acc-btn]', item);
      if (!btn) return;
      btn.addEventListener('click', () => {
        paint(item.classList.contains('is-open') ? -1 : i);
      });
    });
  });
}

/* ============================================================
   04. REVEAL
   ============================================================ */
function initReveal() {
  const targets = qsa('.sec-head, .acc, .stats, .quote, .timeline, .table, .feature, .steps, .plans, .review, .review-row, .ftr__main, .hero__main, .hero__side, .video__frame');
  targets.forEach(el => el.classList.add('reveal'));

  if (prefersReducedMotion) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  targets.forEach(el => io.observe(el));
}

/* ============================================================
   05. BROJACI
   ============================================================ */
function initCounters() {
  const nums = qsa('.js-count');
  if (!nums.length) return;

  const run = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (prefersReducedMotion || target === 0) { el.textContent = target; return; }

    const start = performance.now();
    const dur = 1400;

    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  nums.forEach(n => io.observe(n));
}

/* ============================================================
   06. PREKIDAC CENA
   ============================================================ */
function initPriceSwitch() {
  const box = qs('[data-switch]');
  if (!box) return;

  const buttons = qsa('button', box);

  const apply = (mode) => {
    buttons.forEach(b => b.classList.toggle('is-active', b.dataset.mode === mode));
    qsa('[data-price], [data-unit]').forEach(el => {
      const value = el.dataset[mode];
      if (value) el.textContent = value;
    });
  };

  buttons.forEach(b => b.addEventListener('click', () => apply(b.dataset.mode)));
}

/* ============================================================
   07. IZDVOJENI PROJEKAT
   ============================================================ */
const PROJECTS = [
  {
    mark: 'Auto škola Dule',
    title: 'Auto škola Dule - sajt koji vodi do upisa',
    services: 'Tekst<br />Dizajn<br />Izrada sajta',
    scope: 'Osam kategorija<br />Cenovnik<br />Forma za upis',
    time: '3 nedelje',
    ph: 'Screenshot sajta: Auto škola Dule',
    desc: 'Roditelj i osamnaestogodišnjak moraju za pet sekundi da vide cenu i kako se upisuje. Sve ostalo ide ispod toga.'
  },
  {
    mark: 'Pet Land',
    title: 'Pet Land - veterinarska ambulanta na Vidikovcu',
    services: 'Tekst<br />Dizajn<br />Izrada sajta',
    scope: 'Usluge ambulante<br />Radno vreme<br />Poziv jednim klikom',
    time: '3 nedelje',
    ph: 'Screenshot sajta: Pet Land',
    desc: 'Vlasnik traži veterinara kad je pas već bolestan. Broj telefona i radno vreme stoje na svakom ekranu.'
  },
  {
    mark: 'Medar stolarija',
    title: 'Medar stolarija - nameštaj po meri iz Smedereva',
    services: 'Tekst<br />Dizajn<br />Priprema slika',
    scope: 'Galerija radova<br />Upit za ponudu',
    time: '4 nedelje',
    ph: 'Screenshot sajta: Medar stolarija',
    desc: 'Kuhinja se ne kupuje iz kataloga. Sajt mora da pokaže radove i da čoveku bude lako da pošalje mere.'
  },
  {
    mark: 'Riva Atelier',
    title: 'Riva Atelier - iznajmljivanje svečanih haljina',
    services: 'Tekst<br />Dizajn<br />Izrada sajta',
    scope: 'Kolekcija<br />Rezervacija termina',
    time: '4 nedelje',
    ph: 'Screenshot sajta: Riva Atelier',
    desc: 'Devojka bira haljinu na telefonu, uveče. Kolekcija se pregleda palcem, a termin se rezerviše iz dva klika.'
  },
  {
    mark: 'Foto Jocković',
    title: 'Foto Jocković - foto radnja iz Beograda',
    services: 'Tekst<br />Dizajn<br />Lokalni SEO',
    scope: 'Usluge i cene<br />Adresa i mapa',
    time: '2 nedelje',
    ph: 'Screenshot sajta: Foto Jocković',
    desc: 'Slike za dokumenta, štampa i uramljivanje. Ljudi traže adresu i da li se radi za taj dan, i to je prvo što piše.'
  }
];

function initFeature() {
  const box = qs('[data-feature]');
  if (!box) return;

  const el = {
    mark: qs('[data-f-mark]', box),
    title: qs('[data-f-title]', box),
    services: qs('[data-f-services]', box),
    scope: qs('[data-f-scope]', box),
    time: qs('[data-f-time]', box),
    ph: qs('[data-f-ph]', box),
    desc: qs('[data-f-desc]', box),
    index: qs('[data-f-index]', box)
  };

  let i = 0;

  const paint = () => {
    const p = PROJECTS[i];
    el.mark.textContent = p.mark;
    el.title.textContent = p.title;
    el.services.innerHTML = p.services;
    el.scope.innerHTML = p.scope;
    el.time.textContent = p.time;
    el.ph.textContent = p.ph;
    el.desc.textContent = p.desc;
    el.index.textContent = String(i + 1).padStart(2, '0');
  };

  qs('[data-f-prev]', box).addEventListener('click', () => { i = (i - 1 + PROJECTS.length) % PROJECTS.length; paint(); });
  qs('[data-f-next]', box).addEventListener('click', () => { i = (i + 1) % PROJECTS.length; paint(); });

  paint();
}

/* ============================================================
   08. UTISCI I VRH STRANE
   ============================================================ */
const REVIEWS = [
  {
    text: 'Mesto za utisak klijenta. Kad dobijete prvu poruku od zadovoljnog vlasnika, ona ide ovde, sa imenom i firmom.',
    name: 'Ime klijenta',
    firm: 'Naziv firme'
  },
  {
    text: 'Mesto za drugi utisak. Najbolje prolazi rečenica u kojoj se vidi šta se konkretno promenilo posle sajta.',
    name: 'Ime klijenta',
    firm: 'Naziv firme'
  },
  {
    text: 'Mesto za treći utisak. Ako klijent pomene broj poziva ili upita, ostavite ga, to čita svako.',
    name: 'Ime klijenta',
    firm: 'Naziv firme'
  }
];

function initReviews() {
  const box = qs('[data-review]');
  if (!box) return;

  const text = qs('[data-r-text]', box);
  const name = qs('[data-r-name]', box);
  const firm = qs('[data-r-firm]', box);
  const index = qs('[data-r-index]', box);

  let i = 0;

  const paint = () => {
    text.textContent = REVIEWS[i].text;
    name.textContent = REVIEWS[i].name;
    firm.textContent = REVIEWS[i].firm;
    index.textContent = String(i + 1).padStart(2, '0');
  };

  qs('[data-r-prev]', box).addEventListener('click', () => { i = (i - 1 + REVIEWS.length) % REVIEWS.length; paint(); });
  qs('[data-r-next]', box).addEventListener('click', () => { i = (i + 1) % REVIEWS.length; paint(); });

  paint();
}

function initToTop() {
  const btn = qs('#totop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
}

/* ============================================================
   START
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-on');

  initMenu();
  initAccordions();
  initReveal();
  initCounters();
  initPriceSwitch();
  initFeature();
  initReviews();
  initToTop();
});
