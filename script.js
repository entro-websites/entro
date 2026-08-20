/* ============================================================
   entro technology — web studio
   script.js
   ------------------------------------------------------------
   SADRZAJ
   01. Tekstovi koje JS ispisuje
   02. Pomocne funkcije
   03. Tekst iz recnika
   04. Preloader
   05. Mobilni meni
   06. Split naslovi i fill tekst
   07. Reveal animacije + brojaci
   08. Kursor, magnetna dugmad
   09. Marquee trake
   10. Hero animacija
   11. Before / after poredjenje
   12. Usluge (akordeon)
   13. FAQ
   14. Kontakt forma
   15. Satovi
   16. Kopiranje mejla
   17. Glavna scroll petlja
   18. Start
   ============================================================ */

'use strict';

/* ============================================================
   01. TEKSTOVI KOJE JS ISPISUJE
   Sve sto se vidi u HTML-u stoji u index.html; ovde su samo
   fraze koje skripta upisuje dinamicki.
   ============================================================ */
const UI = {
  menuOpen: 'Meni', menuClose: 'Zatvori',
  formHoldHint: 'Držite dugme jednu sekundu',
  formEnterHint: 'pritisnite enter za dalje',
  formErrEmail: 'Treba nam ispravan email',
  formErrShort: 'Napišite nekoliko reči',
  formSent: 'Poslato',
  formSentNote: 'Odgovaramo u roku od dva radna dana.',
  copyDone: 'kopirano ✓', copyIdle: 'kliknite da kopirate', copyLong: 'držite pa Kopiraj',
  city: 'Beograd '
};

const MAIL = 'zdravo@entro.rs';

/* ============================================================
   02. POMOCNE FUNKCIJE
   ============================================================ */
const qs = (sel, ctx) => (ctx || document).querySelector(sel);
const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

/* ============================================================
   03. TEKST IZ RECNIKA
   ============================================================ */
const i18n = {
  t(key) {
    return UI[key];
  }
};

/* ============================================================
   04. PRELOADER
   ============================================================ */
function initPreloader(onDone) {
  const box = qs('#preloader');
  const pct = qs('#preloader-pct');
  if (!box || !pct) { onDone(); return; }

  const start = performance.now();
  const duration = 1100;

  const tick = (t) => {
    const p = Math.min(1, (t - start) / duration);
    pct.textContent = Math.round(p * 100);
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        box.classList.add('is-hidden');
        onDone();
      }, 220);
    }
  };
  requestAnimationFrame(tick);
}

/* ============================================================
   05. MOBILNI MENI
   ============================================================ */
function initMobileMenu() {
  const burger = qs('#burger');
  const menu = qs('#mobile-menu');
  const label = qs('#burger-label');
  if (!burger || !menu) return;

  let open = false;

  const set = (value) => {
    open = value;
    menu.classList.toggle('is-open', value);
    burger.classList.toggle('is-open', value);
    burger.setAttribute('aria-expanded', String(value));
    if (label) label.textContent = value ? i18n.t('menuClose') : i18n.t('menuOpen');
  };

  set(false);
  burger.addEventListener('click', () => set(!open));
  qsa('.mobile-menu__link', menu).forEach(a => a.addEventListener('click', () => set(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && open) set(false); });
  window.addEventListener('resize', () => { if (open && window.innerWidth > 820) set(false); });
}

/* ============================================================
   06. SPLIT NASLOVI I FILL TEKST
   ============================================================ */

/* Naslovi se razlazu na reci koje ulaze odozdo */
function splitHeadings(force) {
  qsa('.js-split').forEach(h => {
    if (!force && h.dataset.splitDone === '1') return;

    const text = h.dataset.splitSource || h.textContent;
    h.dataset.splitSource = text;
    h.textContent = '';

    text.split(/(\s+)/).forEach((word, i) => {
      if (!word.trim()) { h.appendChild(document.createTextNode(word)); return; }
      const outer = document.createElement('span');
      outer.className = 'split-word';
      const inner = document.createElement('span');
      inner.className = 'split-word__inner';
      inner.style.transitionDelay = (i * 0.03).toFixed(3) + 's';
      inner.textContent = word;
      outer.appendChild(inner);
      h.appendChild(outer);
    });

    h.dataset.splitDone = '1';
    if (prefersReducedMotion) h.classList.add('is-animated');
  });
}

/* Recenica koja se pali rec po rec dok se skroluje */
function fillHeadings(force) {
  qsa('.js-fill').forEach(h => {
    if (!force && h.dataset.fillDone === '1') return;

    const text = h.dataset.fillSource || h.textContent;
    h.dataset.fillSource = text;
    h.textContent = '';

    text.split(/\s+/).filter(Boolean).forEach((word, i, arr) => {
      const span = document.createElement('span');
      span.className = 'fill-word';
      span.textContent = word;
      h.appendChild(span);
      if (i < arr.length - 1) h.appendChild(document.createTextNode(' '));
    });

    h.dataset.fillDone = '1';
  });
}

/* ============================================================
   07. REVEAL ANIMACIJE + BROJACI
   ============================================================ */
function animateCount(el) {
  if (el.dataset.counted === '1') return;
  el.dataset.counted = '1';

  const target = parseFloat(el.dataset.target) || 0;
  const start = performance.now();
  const duration = 1300;

  const step = (t) => {
    const p = Math.min(1, (t - start) / duration);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initReveals() {
  const targets = qsa('.reveal, .js-split');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-animated');
      qsa('.js-count', entry.target).forEach(animateCount);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(el => io.observe(el));
}

/* ============================================================
   08. KURSOR, MAGNETNA DUGMAD
   ============================================================ */
const pointer = { mx: -200, my: -200, cx: -200, cy: -200 };

function initCursor() {
  const dot = qs('#cursor-dot');
  const label = qs('#cursor-label');
  const magnets = qsa('.js-magnetic');

  window.addEventListener('mousemove', (e) => {
    pointer.mx = e.clientX;
    pointer.my = e.clientY;
    hero.spotAuto = false;

    magnets.forEach(m => {
      const r = m.getBoundingClientRect();
      const dx = pointer.mx - (r.left + r.width / 2);
      const dy = pointer.my - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 150) {
        m.style.transition = 'transform .18s ease-out';
        m.style.transform = 'translate(' + dx * 0.22 + 'px,' + dy * 0.22 + 'px)';
      } else if (m.style.transform) {
        m.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
        m.style.transform = 'translate(0,0)';
      }
    });
  }, { passive: true });

  const grow = () => { if (dot) { dot.style.width = '52px'; dot.style.height = '52px'; } };
  const reset = () => { if (dot) { dot.style.width = '14px'; dot.style.height = '14px'; } };
  const hide = () => { if (dot) { dot.style.width = '0px'; dot.style.height = '0px'; } };

  qsa('a, button, .service-row, #copy-band').forEach(el => {
    if (el.classList.contains('js-view')) return;
    el.addEventListener('mouseenter', grow);
    el.addEventListener('mouseleave', reset);
  });

  qsa('.js-view').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (label) label.style.opacity = '1';
      hide();
    });
    el.addEventListener('mouseleave', () => {
      if (label) label.style.opacity = '0';
      reset();
    });
  });
}

/* ============================================================
   09. MARQUEE TRAKE
   ============================================================ */
const marquees = [];

function initMarquees() {
  qsa('.js-marquee').forEach(track => {
    const half = qs('.marquee__half', track);
    if (!half) return;

    if (track.dataset.ready !== '1') {
      track.appendChild(half.cloneNode(true));
      track.appendChild(half.cloneNode(true));
      track.dataset.ready = '1';
    }

    marquees.push({
      track,
      half,
      x: 0,
      width: 0,
      paused: false,
      speed: parseFloat(track.dataset.speed) || 0.5
    });
  });

  const measure = () => marquees.forEach(m => { m.width = m.half.getBoundingClientRect().width; });
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.addEventListener('resize', measure);
}

/* ============================================================
   10. HERO ANIMACIJA
   ============================================================ */
const hero = { stack: null, base: null, lit: null, chars: [], spotAuto: true, ready: false };

function initHero() {
  hero.stack = qs('#hero-stack');
  if (!hero.stack) return;

  hero.base = qs('#hero-base');
  hero.lit = qs('#hero-lit');

  qsa('.js-hero-text', hero.stack).forEach(holder => {
    if (holder.dataset.split === '1') return;
    const text = holder.textContent;
    holder.textContent = '';

    Array.from(text).forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'hero__char';
      span.style.transitionDelay = (i * 0.035).toFixed(3) + 's';
      span.textContent = ch;
      holder.appendChild(span);
    });
    holder.dataset.split = '1';
  });

  hero.chars = qsa('.hero__char', hero.stack);
  const release = () => hero.chars.forEach(c => c.classList.add('is-in'));

  if (prefersReducedMotion) {
    release();
    hero.ready = true;
  } else {
    setTimeout(release, 120);
    /* reflektor pomera slova tek kad se zavrsi ulazna animacija */
    setTimeout(() => { hero.ready = true; }, 1600);
  }

  if (!canHover && hero.lit) hero.lit.style.clipPath = 'none';
}

/* ============================================================
   11. BEFORE / AFTER POREDJENJE
   ============================================================ */
const compare = { el: null, after: null, line: null, pos: 50, auto: true, dragging: false };

function initCompare() {
  compare.el = qs('#compare');
  if (!compare.el) return;

  compare.after = qs('#compare-after');
  compare.line = qs('#compare-line');
  const hint = qs('#compare-hint');

  const apply = () => {
    if (compare.after) compare.after.style.clipPath = 'inset(0 0 0 ' + compare.pos.toFixed(2) + '%)';
    if (compare.line) compare.line.style.left = compare.pos.toFixed(2) + '%';
  };
  compare.apply = apply;

  const setFromX = (clientX) => {
    const r = compare.el.getBoundingClientRect();
    compare.pos = clamp(((clientX - r.left) / r.width) * 100, 4, 96);
    apply();
  };

  const stopAuto = () => {
    if (!compare.auto) return;
    compare.auto = false;
    if (hint) hint.classList.add('is-hidden');
  };

  compare.el.addEventListener('pointerdown', (e) => {
    compare.dragging = true;
    stopAuto();
    setFromX(e.clientX);
  });
  window.addEventListener('pointerup', () => { compare.dragging = false; });
  window.addEventListener('pointermove', (e) => {
    if (compare.dragging) { setFromX(e.clientX); return; }
    if (compare.auto) return;
    const r = compare.el.getBoundingClientRect();
    if (e.clientY > r.top && e.clientY < r.bottom && e.clientX > r.left && e.clientX < r.right) setFromX(e.clientX);
  }, { passive: true });

  let lastX = null;
  compare.el.addEventListener('pointermove', (e) => {
    if (!compare.auto) return;
    if (lastX !== null && Math.abs(e.clientX - lastX) > 6) stopAuto();
    lastX = e.clientX;
  }, { passive: true });

  apply();
}

/* ============================================================
   12. USLUGE (AKORDEON)
   ============================================================ */
function initServices() {
  const list = qs('#services-list');
  const rows = qsa('.service-row');
  if (!list || !rows.length) return;

  let open = -1;
  let expandTimer = null;

  const paint = () => {
    if (expandTimer) { clearTimeout(expandTimer); expandTimer = null; }

    rows.forEach((row, i) => {
      const on = i === open;
      const panel = qs('.service-row__panel', row);
      row.classList.toggle('is-open', on);

      if (panel) {
        if (panel.style.maxHeight === 'none') {
          panel.style.maxHeight = panel.scrollHeight + 'px';
          void panel.offsetHeight;
        }
        panel.style.maxHeight = on ? panel.scrollHeight + 'px' : '0px';
      }
    });

    list.classList.toggle('has-open', open >= 0);

    if (open >= 0) {
      const panel = qs('.service-row__panel', rows[open]);
      expandTimer = setTimeout(() => { if (panel) panel.style.maxHeight = 'none'; }, 800);
    }
  };

  rows.forEach((row, i) => {
    const head = qs('.service-row__head', row);
    (head || row).addEventListener('click', (e) => {
      e.stopPropagation();
      open = open === i ? -1 : i;
      paint();
    });
    row.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' && open !== i) { open = i; paint(); }
    });
  });

  list.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') { open = -1; paint(); }
  });

  /* Prvi red se sam otvori kad sekcija udje u vidno polje */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && open === -1) { open = 0; paint(); io.disconnect(); }
    });
  }, { threshold: 0.4 });
  io.observe(rows[0]);

  window.addEventListener('resize', paint);
  paint();
}

/* ============================================================
   13. FAQ
   ============================================================ */
function initFaq() {
  const items = qsa('.faq-item');

  items.forEach(item => {
    const btn = qs('.faq-item__btn', item);
    const panel = qs('.faq-item__panel', item);
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');

      items.forEach(other => {
        other.classList.remove('is-open');
        const p = qs('.faq-item__panel', other);
        if (p) p.style.maxHeight = '0px';
        const b = qs('.faq-item__btn', other);
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      if (!wasOpen) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================================
   14. KONTAKT FORMA
   ============================================================ */
function initForm() {
  const form = qs('#contact-form');
  if (!form) return;

  const steps = qsa('.form__step', form);
  const inputs = steps.map(step => qs('.form__input', step));
  const segFills = qsa('.form__segment-fill', form);
  const done = qs('#form-done');
  const summary = qs('#form-summary');
  const backBtn = qs('#form-back');
  const nextBtn = qs('#form-next');
  const sendBtn = qs('#form-send');
  const sendFill = qs('#form-send-fill');
  const sendText = qs('#form-send-text');
  const note = qs('#form-note');

  let index = 0;
  let sent = false;
  let touched = false; /* fokus se hvata tek posle prve interakcije */

  const isValid = (i) => {
    const value = (inputs[i].value || '').trim();
    if (value.length < 2) return false;
    if (inputs[i].type === 'email') return /.+@.+\..+/.test(value);
    return true;
  };

  const labelText = (i) => {
    const el = qs('.form__label', steps[i]);
    return el ? el.textContent : '';
  };

  const paint = () => {
    const atEnd = index >= steps.length;

    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === index);
      step.classList.toggle('is-past', i < index);
    });

    if (done) done.classList.toggle('is-active', atEnd);

    segFills.forEach((fill, i) => {
      fill.style.width = (i < index || (i === index && isValid(i))) ? '100%' : '0%';
    });

    if (backBtn) backBtn.classList.toggle('is-visible', index > 0 && !sent);
    if (nextBtn) nextBtn.classList.toggle('is-hidden', atEnd);
    if (sendBtn) sendBtn.classList.toggle('is-visible', atEnd);

    if (note && !sent) note.textContent = atEnd ? i18n.t('formHoldHint') : i18n.t('formEnterHint');

    if (atEnd && summary) {
      summary.innerHTML = '';
      inputs.forEach((input, i) => {
        const row = document.createElement('div');
        row.className = 'form__summary-row';

        const key = document.createElement('span');
        key.className = 'form__summary-key';
        key.textContent = labelText(i).replace(/\?$/, '');

        const value = document.createElement('span');
        value.className = 'form__summary-value';
        value.textContent = input.value.trim();

        row.appendChild(key);
        row.appendChild(value);
        summary.appendChild(row);
      });
    }

    if (touched && !atEnd && inputs[index]) {
      setTimeout(() => inputs[index].focus({ preventScroll: true }), 60);
    }
  };

  const advance = () => {
    touched = true;
    if (index >= steps.length) return;
    if (!isValid(index)) {
      inputs[index].classList.add('is-error');
      if (note) note.textContent = inputs[index].type === 'email' ? i18n.t('formErrEmail') : i18n.t('formErrShort');
      return;
    }
    index++;
    paint();
  };

  inputs.forEach((input, i) => {
    input.addEventListener('blur', () => input.classList.remove('is-error'));
    input.addEventListener('input', () => {
      segFills[i].style.width = isValid(i) ? '100%' : '0%';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); advance(); }
    });
  });

  if (nextBtn) nextBtn.addEventListener('click', advance);
  if (backBtn) backBtn.addEventListener('click', () => {
    if (sent) return;
    if (index > 0) { index--; paint(); }
  });

  /* Drzi dugme da posalje */
  if (sendBtn && sendFill) {
    let raf = 0;
    let holdStart = 0;

    const finish = () => {
      sent = true;
      sendFill.style.width = '100%';
      if (sendText) sendText.textContent = i18n.t('formSent');
      if (note) { note.textContent = i18n.t('formSentNote'); note.classList.add('is-sent'); }
      sendBtn.style.cursor = 'default';
      if (backBtn) backBtn.classList.remove('is-visible');
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (!sent) sendFill.style.width = '0%';
    };

    const tick = (t) => {
      const p = Math.min(1, (t - holdStart) / 900);
      sendFill.style.width = (p * 100).toFixed(1) + '%';
      if (p < 1) raf = requestAnimationFrame(tick); else finish();
    };

    sendBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (sent) return;
      holdStart = performance.now();
      raf = requestAnimationFrame(tick);
    });
    window.addEventListener('pointerup', stop);
    sendBtn.addEventListener('pointerleave', stop);
  }

  form.addEventListener('submit', (e) => e.preventDefault());
  paint();
}

/* ============================================================
   15. SATOVI
   ============================================================ */
function initClocks() {
  const heroClock = qs('#hero-clock');
  const contactClock = qs('#contact-clock');

  const time = () => new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Belgrade' });

  const tick = () => {
    if (heroClock) heroClock.textContent = '44.7866° N, 20.4489° E — ' + time();
    if (contactClock) contactClock.textContent = i18n.t('city') + time();
  };

  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   16. KOPIRANJE MEJLA
   ============================================================ */
function initCopyBand() {
  const band = qs('#copy-band');
  if (!band) return;

  band.addEventListener('click', () => {
    const hints = qsa('.copy-band__hint', band);
    const say = (text) => hints.forEach(h => { h.textContent = text; });
    const revert = () => setTimeout(() => say(i18n.t('copyIdle')), 1800);

    const legacyCopy = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = MAIL;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, MAIL.length);
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch (err) {
        return false;
      }
    };

    const fallback = () => {
      marquees.forEach(m => { if (band.contains(m.track)) m.paused = true; });
      const target = qs('.copy-band__mail', band);
      if (target) {
        try {
          const sel = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(target);
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (err) { /* ignorisi */ }
      }
      say(i18n.t('copyLong'));
      setTimeout(() => {
        marquees.forEach(m => { if (band.contains(m.track)) m.paused = false; });
        say(i18n.t('copyIdle'));
      }, 6000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(MAIL)
        .then(() => { say(i18n.t('copyDone')); revert(); })
        .catch(() => { if (legacyCopy()) { say(i18n.t('copyDone')); revert(); } else fallback(); });
    } else if (legacyCopy()) {
      say(i18n.t('copyDone'));
      revert();
    } else {
      fallback();
    }
  });
}

/* ============================================================
   17. GLAVNA SCROLL PETLJA
   Sve sto zavisi od pozicije skrola racuna se u jednom rAF-u.
   ============================================================ */
function startLoop() {
  const dot = qs('#cursor-dot');
  const cursorLabel = qs('#cursor-label');
  const progress = qs('#scroll-progress');
  const glow = qs('#contact-glow');

  const heroCueFill = qs('#hero-cue-fill');

  const storyWrap = qs('#story');
  const storyTimer = qs('#story-timer');
  const storyBar = qs('#story-bar');
  const storyStages = qsa('.story__stage');
  const storyTicks = qsa('.story__tick');

  const railWrap = qs('#process-rail');
  const railFill = qs('#process-rail-fill');
  const procGhost = qs('#process-ghost');
  const procSteps = qsa('.process-step');

  const pinWrap = qs('#work-pin');
  const pinTrack = qs('#work-track');

  const parallaxEls = qsa('.js-parallax');
  const fillTargets = qsa('.js-fill');

  let scrollY = window.scrollY;
  let lastScrollY = scrollY;
  let velocity = 0;

  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  const loop = () => {
    velocity += ((scrollY - lastScrollY) - velocity) * 0.14;
    lastScrollY = scrollY;

    /* --- Tekst koji se pali rec po rec --- */
    fillTargets.forEach(el => {
      const words = qsa('.fill-word', el);
      const r = el.getBoundingClientRect();
      const startY = window.innerHeight * 0.86;
      const endY = window.innerHeight * 0.28;
      const p = clamp((startY - r.top) / Math.max(1, startY - endY), 0, 1);
      const lit = p * words.length;
      words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    });

    /* --- Before/after automatsko ljuljanje --- */
    if (compare.el && compare.auto && compare.apply) {
      const r = compare.el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        compare.pos = 50 + Math.sin(performance.now() / 1600) * 26;
        compare.apply();
      }
    }

    /* --- Sjaj u kontakt sekciji prati kursor --- */
    if (glow) glow.style.transform = 'translate3d(' + pointer.cx + 'px,' + (pointer.cy + window.scrollY) + 'px,0)';

    /* --- Hero reflektor --- */
    if (hero.stack && hero.lit && canHover) {
      const r = hero.stack.getBoundingClientRect();
      let sx, sy;

      if (hero.spotAuto) {
        const t = performance.now() / 2200;
        sx = r.width * (0.5 + Math.sin(t) * 0.32);
        sy = r.height * (0.5 + Math.cos(t * 1.4) * 0.22);
      } else {
        sx = pointer.cx - r.left;
        sy = pointer.cy - r.top;
      }

      const radius = clamp(r.width * 0.16, 120, 260);
      hero.lit.style.clipPath = 'circle(' + radius.toFixed(0) + 'px at ' + sx.toFixed(0) + 'px ' + sy.toFixed(0) + 'px)';

      if (!prefersReducedMotion && hero.ready) {
        hero.chars.forEach(char => {
          const cr = char.getBoundingClientRect();
          const dx = (cr.left + cr.width / 2) - (r.left + sx);
          const dy = (cr.top + cr.height / 2) - (r.top + sy);
          const d = Math.hypot(dx, dy);
          const k = d < radius * 1.5 ? (1 - d / (radius * 1.5)) : 0;
          char.style.transform = 'translate3d(0,' + (-k * 11).toFixed(2) + 'px,0)';
        });
      }
    }

    /* --- Hero bledi pri skrolovanju --- */
    if (hero.base) {
      const hr = hero.base.getBoundingClientRect();
      const out = clamp(-hr.top / Math.max(1, window.innerHeight * 0.7), 0, 1);
      hero.base.style.opacity = (1 - out * 0.75).toFixed(3);
      if (hero.lit) hero.lit.style.opacity = (1 - out).toFixed(3);
    }

    if (heroCueFill) {
      const c = (performance.now() / 1700) % 1;
      heroCueFill.style.transform = 'translateX(' + ((c * 200) - 100).toFixed(1) + '%)';
    }

    /* --- Process: linija i aktivni korak --- */
    if (railWrap && railFill) {
      const r = railWrap.getBoundingClientRect();
      const mark = window.innerHeight * 0.55;
      const h = clamp((mark - r.top) / Math.max(1, r.height), 0, 1);
      railFill.style.height = (h * 100).toFixed(2) + '%';

      let active = 0;
      procSteps.forEach((step, i) => {
        const on = step.getBoundingClientRect().top < mark;
        if (on) active = i;
        step.classList.toggle('is-active', on);
      });
      if (procGhost) procGhost.textContent = '0' + (active + 1);
    }

    /* --- Story: tajmer, faze i kvacice --- */
    if (storyWrap && storyStages.length) {
      const r = storyWrap.getBoundingClientRect();
      const span = storyWrap.offsetHeight - window.innerHeight;
      const p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
      const held = Math.min(1, p / 0.86);

      if (storyTimer) storyTimer.textContent = (held * 6).toFixed(1);
      if (storyBar) storyBar.style.width = (held * 100).toFixed(1) + '%';

      const n = storyStages.length;
      const fpos = Math.min(n - 1, p * (n - 0.15));

      storyStages.forEach((stage, i) => {
        const d = Math.abs(fpos - i);
        const o = d <= 0.42 ? 1 : Math.max(0, 1 - (d - 0.42) / 0.28);
        stage.style.opacity = o.toFixed(3);
        stage.style.transform = 'translate3d(0,' + ((fpos - i) * -22).toFixed(1) + 'px,0)';
        stage.style.filter = o < 0.99 ? 'blur(' + ((1 - o) * 2.5).toFixed(2) + 'px)' : 'none';
        stage.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
      });

      storyTicks.forEach((tick, i) => {
        tick.classList.toggle('is-on', held * 5 > i + 0.4);
      });
    }

    /* --- Radovi: horizontalni scroll --- */
    if (pinWrap && pinTrack) {
      const r = pinWrap.getBoundingClientRect();
      const span = pinWrap.offsetHeight - window.innerHeight;
      const p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
      const dist = Math.max(0, pinTrack.scrollWidth - window.innerWidth + 48);
      pinTrack.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
    }

    /* --- Marquee trake --- */
    marquees.forEach(m => {
      if (!m.width || m.paused) return;
      m.x -= m.speed + Math.abs(velocity) * 0.03;
      if (m.x <= -m.width) m.x += m.width;
      m.track.style.transform = 'translate3d(' + m.x.toFixed(2) + 'px,0,0)';
    });

    /* --- Kursor --- */
    pointer.cx += (pointer.mx - pointer.cx) * 0.22;
    pointer.cy += (pointer.my - pointer.cy) * 0.22;

    if (dot) {
      const r = dot.getBoundingClientRect();
      dot.style.transform = 'translate3d(' + (pointer.cx - r.width / 2) + 'px,' + (pointer.cy - r.height / 2) + 'px,0)';
    }
    if (cursorLabel) {
      cursorLabel.style.transform = 'translate3d(' + (pointer.cx + 18) + 'px,' + (pointer.cy + 18) + 'px,0)';
    }

    /* --- Traka napretka --- */
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    }

    /* --- Parallax --- */
    if (!prefersReducedMotion) {
      parallaxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - window.innerHeight / 2) * parseFloat(el.dataset.parallax || '0');
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    }

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

/* ============================================================
   18. START
   ============================================================ */
function init() {
  document.documentElement.classList.add('js-on');

  initMobileMenu();
  splitHeadings(false);
  fillHeadings(false);
  initReveals();
  initCursor();
  initMarquees();
  initHero();
  initCompare();
  initServices();
  initFaq();
  initForm();
  initClocks();
  initCopyBand();

  startLoop();
}

document.addEventListener('DOMContentLoaded', () => {
  initPreloader(init);
});
