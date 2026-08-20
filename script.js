/* ============================================================
   entro technology — v4
   script.js
   ============================================================ */

'use strict';

const qs = (sel, ctx) => (ctx || document).querySelector(sel);
const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

/* Meni preko ekrana */
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


/* Akordeon: u grupi je otvorena najvise jedna stavka */
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
      btn.addEventListener('click', () => paint(item.classList.contains('is-open') ? -1 : i));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-on');
  initMenu();
  initAccordions();
});
