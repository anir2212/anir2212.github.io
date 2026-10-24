// Project showcase: selected-work tiles, a filterable archive table and a case-study dialog.
// Data: window.PROJECTS (assets/data/projects.js), generated from the project ledger.
(() => {
  'use strict';
  const ALL = window.PROJECTS || [];
  if (!ALL.length) return;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Tiles shown large under "selected work"; everything else lives in the archive.
  const SELECTED = ['p01-pocketlm', 'p09-payguard', 'p08-modelaudit', 'p02-opspilot', 'p10-finrecon', 'risk-monitor'];
  // Each area borrows an MRT line colour.
  const AREA_LINE = { 'AI & ML': 'ne', 'Data engineering': 'dt', 'Backend & systems': 'ns', 'Full-stack': 'cc', 'Mobile': 'ew', 'Finance & risk': 'te', 'Research': 'ink' };
  const lineOf = (p) => AREA_LINE[p.domain] || 'ink';
  const shot = (p) => `assets/projects/${p.id}.jpg`;
  const hostOf = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch (e) { return u; } };
  const GH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>';

  const links = (p, cls = '') => {
    const out = [];
    if (p.featured) out.push(`<a class="px-link ${cls}" href="${esc(p.featured)}" data-close>Full story ↑</a>`);
    if (p.live) out.push(`<a class="px-link ${cls}" href="${esc(p.live)}" target="_blank" rel="noopener">${esc(hostOf(p.live))} ↗</a>`);
    if (p.repo) out.push(`<a class="px-link ${cls}" href="${esc(p.repo)}" target="_blank" rel="noopener">${GH}<span>GitHub</span></a>`);
    return out.join('');
  };

  // Screenshot if one exists, otherwise a typographic poster built from the headline result.
  function media(p, big = false) {
    const poster = `<div class="px-poster" data-line="${lineOf(p)}" aria-hidden="true">
        <span class="px-poster-name">${esc(p.name)}</span>
        ${p.headline ? `<b>${esc(p.headline.value)}</b><small>${esc(p.headline.label)}</small>` : ''}
      </div>`;
    return `<div class="px-media${big ? ' big' : ''}" data-src="${shot(p)}" data-label="${esc(p.name)}">${poster}</div>`;
  }
  function hydrateMedia(root) {
    $$('.px-media[data-src]', root).forEach((m) => {
      const img = new Image();
      img.alt = `${m.dataset.label} screenshot`;
      img.decoding = 'async';
      img.onload = () => { m.classList.add('has-shot'); m.prepend(img); };
      img.src = m.dataset.src;
      m.removeAttribute('data-src');
    });
  }

const playable = (p) => (window.DEMOS && window.DEMOS[p.id] ? '<span class="px-play">▶ Playable</span>' : '');

  /* ── Selected work ───────────────────────────────────── */
  const grid = $('#px-grid');
  const selected = SELECTED.map((id) => ALL.find((p) => p.id === id)).filter(Boolean);
  grid.innerHTML = selected.map((p) => `
    <article class="px-tile" data-line="${lineOf(p)}">
      <button type="button" class="px-open" data-id="${esc(p.id)}" aria-label="Open ${esc(p.name)} case study">
        ${media(p)}
      </button>
      <div class="px-tile-body">
        <p class="px-area">${esc(p.domain)} ${playable(p)}</p>
        <h3><button type="button" class="px-open px-title" data-id="${esc(p.id)}">${esc(p.name)}</button></h3>
        <p class="px-tag">${esc(p.tagline)}</p>
        <ul class="px-stack">${(p.stack || []).slice(0, 5).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <div class="px-links">${links(p)}</div>
      </div>
    </article>`).join('');
  hydrateMedia(grid);

  /* ── Archive ─────────────────────────────────────────── */
  const rows = $('#px-rows');
  const filters = $('#px-filters');
  const areas = [...new Set(ALL.map((p) => p.domain))];
  let area = 'All';
  filters.innerHTML = ['All', ...areas].map((a) => `<button type="button" aria-pressed="${a === 'All'}" data-area="${esc(a)}">${esc(a)}</button>`).join('');
  function renderRows() {
    const list = ALL.filter((p) => area === 'All' || p.domain === area);
    rows.innerHTML = list.map((p) => `
      <tr data-line="${lineOf(p)}">
        <th scope="row"><button type="button" class="px-open px-row-name" data-id="${esc(p.id)}"><i aria-hidden="true"></i>${esc(p.name)}</button>${playable(p)}</th>
        <td class="col-what">${esc(p.tagline)}</td>
        <td class="col-stack"><ul class="px-stack">${(p.stack || []).slice(0, 4).map((t) => `<li>${esc(t)}</li>`).join('')}</ul></td>
        <td class="col-link">${links(p, 'sm') || '<span class="px-none">—</span>'}</td>
      </tr>`).join('');
  }
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-area]');
    if (!b) return;
    area = b.dataset.area;
    $$('button', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderRows();
  });
  renderRows();

  /* ── Case-study dialog ───────────────────────────────── */
  const dlg = $('#px-dialog');
  const body = $('#pxd-body');
  const pos = $('#pxd-pos');
  const inner = $('.pxd-inner', dlg);
  let order = ALL.map((p) => p.id);
  let cur = -1;
  const list = (items) => `<ul>${(items || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

  function show(id, push = true) {
    const i = order.indexOf(id);
    if (i < 0) return;
    cur = i;
    const p = ALL.find((x) => x.id === id);
    inner.dataset.line = lineOf(p);
    pos.textContent = `${i + 1} / ${order.length}`;
    body.innerHTML = `
      <header class="pxd-head">
        <p class="px-area">${esc(p.domain)}${p.tags?.length ? ' · ' + p.tags.map(esc).join(' · ') : ''}</p>
        <h2 id="pxd-title">${esc(p.name)}</h2>
        <p class="pxd-tagline">${esc(p.tagline)}</p>
        <div class="px-links">${links(p)}</div>
      </header>
      <div class="px-media big shot-only" data-src="${shot(p)}" data-label="${esc(p.name)}"></div>
      <div class="pxd-grid">
        <section><h3>The problem</h3><p>${esc(p.problem)}</p></section>
        ${p.headline ? `<aside class="pxd-metric"><b>${esc(p.headline.value)}</b><span>${esc(p.headline.label)}</span></aside>` : ''}
      </div>
      ${window.DEMOS && window.DEMOS[p.id] ? `<section class="pxd-demo"><h3>Try it · ${esc(window.DEMOS[p.id].title)}</h3><div class="dm" id="pxd-demo-root"></div><p class="dm-note">A simplified in-browser version of this project's real logic.</p></section>` : ''}
      <section><h3>What I built</h3>${list(p.built)}</section>
      <section><h3>Results</h3>${list(p.results)}</section>
      <section><h3>Built with</h3><ul class="px-stack">${(p.stack || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>
      <details class="pxd-scope"><summary>Scope and caveats${p.dataNote ? ` · ${esc(p.dataNote)}` : ''}</summary>${list(p.limits)}</details>`;
    hydrateMedia(body);
    if (window.DEMOS && window.DEMOS[p.id]) window.DEMOS[p.id].run($('#pxd-demo-root', body));
    if (!dlg.open) dlg.showModal();
    body.scrollTop = 0;
    dlg.scrollTop = 0;
    if (push) history.replaceState(null, '', `#p/${id}`);
  }
  function close() {
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener('close', () => {
    if (location.hash.startsWith('#p/')) history.replaceState(null, '', '#projects');
  });

  document.addEventListener('click', (e) => {
    const open = e.target.closest('.px-open[data-id]');
    if (open) { e.preventDefault(); show(open.dataset.id); return; }
    if (e.target.closest('[data-close]')) close();
  });
  $('.pxd-close', dlg).addEventListener('click', close);
  $$('.pxd-nav', dlg).forEach((b) => b.addEventListener('click', () => show(order[(cur + +b.dataset.dir + order.length) % order.length])));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); }); // backdrop
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(order[(cur + 1) % order.length]);
    if (e.key === 'ArrowLeft') show(order[(cur - 1 + order.length) % order.length]);
  });

  window.openProject = (id) => show(id);

  // Deep links: #p/<id>
  const fromHash = () => { const m = location.hash.match(/^#p\/(.+)$/); if (m) show(decodeURIComponent(m[1]), false); };
  addEventListener('hashchange', fromHash);
  fromHash();
})();
