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

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-on');
  initMenu();
});
