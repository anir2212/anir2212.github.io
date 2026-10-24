// ⌘K / Ctrl+K command menu: jump to any project or section, or run a quick action.
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const EMAIL = 'anirudhnush@gmail.com';

  const goTo = (sel) => () => {
    const el = $(sel);
    if (!el) return;
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    window.mrtChime && window.mrtChime();
  };
  const ITEMS = [
    ...[['EasyBoard', '#easyboard'], ['Experience', '#experience'], ['Projects', '#projects'], ['Leadership', '#leadership'], ['Contact', '#contact']]
      .map(([label, sel]) => ({ group: 'Sections', label, hint: 'Jump to section', run: goTo(sel) })),
    { group: 'Actions', label: 'Copy email address', hint: EMAIL, run: async () => { try { await navigator.clipboard.writeText(EMAIL); toast('Email copied'); } catch (e) { location.href = `mailto:${EMAIL}`; } } },
    { group: 'Actions', label: 'Open résumé', hint: 'PDF', run: () => window.open('assets/Anirudh_Mothiki_Resume.pdf', '_blank', 'noopener') },
    { group: 'Actions', label: 'LinkedIn', hint: 'linkedin.com/in/anirudhmothiki', run: () => window.open('https://www.linkedin.com/in/anirudhmothiki', '_blank', 'noopener') },
    { group: 'Actions', label: 'GitHub', hint: 'github.com/anir2212', run: () => window.open('https://github.com/anir2212', '_blank', 'noopener') },
    { group: 'Actions', label: 'Toggle dark mode', hint: 'Theme', run: () => $('.theme-toggle').click() },
    ...(window.PROJECTS || []).map((p) => ({ group: 'Projects', label: p.name, hint: p.tagline, run: () => window.openProject && window.openProject(p.id) })),
  ];

  // Subsequence match; earlier and contiguous hits score higher.
  function score(q, text) {
    if (!q) return 1;
    const t = text.toLowerCase();
    let ti = 0, s = 0, run = 0;
    for (const ch of q) {
      const i = t.indexOf(ch, ti);
      if (i < 0) return 0;
      run = i === ti ? run + 1 : 0;
      s += 1 + run * 2 - Math.min(i - ti, 5) * 0.1;
      ti = i + 1;
    }
    return s + (t.startsWith(q) ? 5 : 0);
  }

  const dlg = document.createElement('dialog');
  dlg.className = 'cmdk';
  dlg.setAttribute('aria-label', 'Command menu');
  dlg.innerHTML = `
    <div class="cmdk-box">
      <div class="cmdk-search"><span aria-hidden="true">⌕</span>
        <input type="text" role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" placeholder="Search projects, sections or actions…" autocomplete="off" spellcheck="false">
        <kbd>esc</kbd></div>
      <ul class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Results"></ul>
      <p class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span></p>
    </div>`;
  document.body.appendChild(dlg);
  const input = $('input', dlg);
  const list = $('.cmdk-list', dlg);
  let results = [], active = 0;

  function render() {
    const q = input.value.trim().toLowerCase();
    const pool = 'noResume' in document.documentElement.dataset ? ITEMS.filter((it) => it.label !== 'Open résumé') : ITEMS;
    results = pool.map((it) => ({ it, s: Math.max(score(q, it.label), score(q, it.hint) * 0.6) })).filter((r) => r.s > 0)
      .sort((a, b) => (q ? b.s - a.s : 0)).map((r) => r.it);
    active = Math.min(active, Math.max(0, results.length - 1));
    let group = '';
    list.innerHTML = results.length ? results.map((it, i) => {
      const head = !q && it.group !== group ? `<li class="cmdk-group" role="presentation">${esc((group = it.group))}</li>` : '';
      return `${head}<li role="option" id="cmdk-${i}" data-i="${i}" aria-selected="${i === active}"><b>${esc(it.label)}</b><span>${esc(it.hint)}</span></li>`;
    }).join('') : '<li class="cmdk-empty" role="presentation">No matches</li>';
    input.setAttribute('aria-activedescendant', results.length ? `cmdk-${active}` : '');
    $(`#cmdk-${active}`, list)?.scrollIntoView({ block: 'nearest' });
  }
  function run(i) {
    const it = results[i];
    if (!it) return;
    dlg.close();
    it.run();
  }
  function open() {
    if (dlg.open) return;
    document.querySelector('#px-dialog')?.open && document.querySelector('#px-dialog').close();
    input.value = '';
    active = 0;
    render();
    dlg.showModal();
    input.focus();
  }

  input.addEventListener('input', () => { active = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(1, results.length); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + results.length) % Math.max(1, results.length); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); run(active); }
  });
  list.addEventListener('mousemove', (e) => {
    const li = e.target.closest('[data-i]');
    if (li && +li.dataset.i !== active) { active = +li.dataset.i; render(); }
  });
  list.addEventListener('click', (e) => { const li = e.target.closest('[data-i]'); if (li) run(+li.dataset.i); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.open ? dlg.close() : open(); }
  });

  // Top-bar trigger
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cmdk-trigger';
  btn.setAttribute('aria-label', 'Open command menu');
  btn.innerHTML = `<span>Search</span><kbd>${isMac ? '⌘' : 'Ctrl'} K</kbd>`;
  btn.addEventListener('click', open);
  $('.theme-toggle').before(btn);

  let tt = 0;
  function toast(msg) {
    let el = $('.site-toast');
    if (!el) { el = document.createElement('div'); el.className = 'site-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove('show'), 1800);
  }
})();
