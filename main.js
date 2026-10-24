(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── Theme ─────────────────────────────────────────────── */
  $('.theme-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage unavailable */ }
  });

  /* ── Top bar, rail and section reveal ─────────────────── */
  const topbar = $('.topbar');
  const railLinks = $$('.rail a');
  const navLinks = $$('.topnav a');
  const railFill = $('.rail-fill');
  const sections = railLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);

  function onScroll() {
    topbar.classList.toggle('scrolled', scrollY > 8);
    const rail = $('.rail');
    if (rail) rail.classList.toggle('show', scrollY > $('#top').offsetHeight - innerHeight * 0.3);
    const mid = scrollY + innerHeight * 0.4;
    let active = 0;
    sections.forEach((s, i) => { if (s.offsetTop <= mid) active = i; });
    railLinks.forEach((a, i) => {
      a.classList.toggle('active', i === active);
      a.classList.toggle('passed', i < active);
    });
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + sections[active].id));
    if (railFill) {
      const doc = document.documentElement.scrollHeight - innerHeight;
      railFill.style.height = Math.min(100, (scrollY / Math.max(1, doc)) * 100) + '%';
      const color = getComputedStyle(railLinks[active]).getPropertyValue('--accent');
      railFill.style.setProperty('--rail-color', color);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $$('.journey-stops li').forEach((li, i) => li.style.setProperty('--i', i));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.classList.contains('line-section') ? 'inview' : 'shown');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$('.line-section').forEach((s) => io.observe(s));
  $$('.split, .demo, .then-now, .gallery, .pipeline, .sample, .se-foot, .role, .edu, .card, .lead-block, .skills').forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });

  /* ── Photo galleries ─────────────────────────────────────
     <div class="pgal" data-prefix="rusa"> shows assets/photos/rusa-1.jpg, rusa-2.jpg, … (up to 12).
     Missing numbers are skipped, and the layout follows the number of photos found.
     If none exist, the gallery is removed entirely. Optional data-captions="one|two|three". */
  $$('.pgal').forEach((g) => {
    const prefix = g.dataset.prefix;
    const alt = g.dataset.alt || prefix;
    const caps = (g.dataset.captions || '').split('|');
    const load = (n) => new Promise((res) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => res({ n, img });
      img.onerror = () => res(null);
      img.src = `assets/photos/${prefix}-${n}.jpg`;
    });
    Promise.all(Array.from({ length: 12 }, (_, i) => load(i + 1))).then((all) => {
      const found = all.filter(Boolean);
      if (!found.length) { g.remove(); return; }
      g.dataset.count = Math.min(found.length, 6);
      g.innerHTML = found.map(({ n, img }, i) => {
        const cap = caps[n - 1] || '';
        const ratio = (img.naturalWidth / img.naturalHeight).toFixed(3);
        return `<figure style="--r:${ratio}"><button type="button" class="pgal-open" data-i="${i}" aria-label="Enlarge photo ${i + 1} of ${found.length}${cap ? ': ' + esc(cap) : ''}">
          <img src="${img.src}" alt="${esc(cap || `${alt}, photo ${i + 1}`)}" width="${img.naturalWidth}" height="${img.naturalHeight}" loading="lazy"></button>${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;
      }).join('');
      g.__photos = found.map(({ n, img }) => ({ src: img.src, cap: caps[n - 1] || '', alt: caps[n - 1] || `${alt}, photo ${n}` }));
    });
  });

  // Lightbox
  const lb = document.createElement('dialog');
  lb.className = 'lightbox';
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = '<button type="button" class="lb-close" aria-label="Close">✕</button><button type="button" class="lb-nav prev" aria-label="Previous photo">←</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lb-nav next" aria-label="Next photo">→</button>';
  document.body.appendChild(lb);
  let lbSet = [], lbAt = 0;
  const lbShow = (i) => {
    lbAt = (i + lbSet.length) % lbSet.length;
    const p = lbSet[lbAt];
    $('img', lb).src = p.src; $('img', lb).alt = p.alt;
    $('figcaption', lb).textContent = p.cap;
    lb.classList.toggle('single', lbSet.length < 2);
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.pgal-open');
    if (b) { lbSet = b.closest('.pgal').__photos || []; lbShow(+b.dataset.i); lb.showModal(); return; }
    if (e.target === lb || e.target.closest('.lb-close')) lb.close();
    const nav = e.target.closest('.lb-nav');
    if (nav) lbShow(lbAt + (nav.classList.contains('next') ? 1 : -1));
  });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') lbShow(lbAt + 1);
    if (e.key === 'ArrowLeft') lbShow(lbAt - 1);
  });

  /* ═════════════════════════════════════════════════════════
     EasyBoard interactive trip
     ═════════════════════════════════════════════════════════ */
  const DEMO = window.EB_DEMO;
  if (DEMO) easyBoard(DEMO);

  function easyBoard(DEMO) {
    const W = 600, H = 460, PAD = 56;
    const LINE_COLORS = { DT: '#005EC4', EW: '#009645', NS: '#D42E12', NE: '#9900AA', CC: '#FA9E0D', TE: '#9D5B25' };
    const LINE_NAMES = { DT: 'Downtown Line', EW: 'East West Line', NS: 'North South Line', NE: 'North East Line', CC: 'Circle Line', TE: 'Thomson-East Coast Line' };
    const ICONS = {
      walk: '<circle cx="13" cy="4.5" r="2"/><path d="m9.5 21 2.2-6.5 2.8 2.5V21M7.5 12.5l2.8-3.6 3.3.6 1.9 3 3 1M10.3 8.9l-1 5.6"/>',
      card: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10.5h18M7 15h4"/>',
      gate: '<path d="M4 20V8h4v12M16 20V8h4v12M8 12.5h3M13 12.5h3"/><path d="M12 3v5"/>',
      exit: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
      platform: '<rect x="5" y="3" width="14" height="13" rx="4"/><path d="M5 9.5h14M8 21l2-4.5M16 21l-2-4.5"/><circle cx="9" cy="13" r=".8"/><circle cx="15" cy="13" r=".8"/>',
      change: '<path d="M7 4v13M7 17l-3-3M7 17l3-3M17 20V7M17 7l-3 3M17 7l3 3"/>',
      bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2Z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    };
    const svgIcon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;
    const pict = (k) => `<div class="pict">${svgIcon(k)}</div>`;
    const SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"/></svg>';

    const fmtDist = (m) => (m < 1000 ? `${Math.max(10, Math.round(m / 10) * 10)} m` : `${(m / 1000).toFixed(1)} km`);
    const walkMin = (m) => Math.max(1, Math.round(m / 60));
    const tidy = (n) => n.replace(/\s*MRT STATION$/i, '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

    const el = {
      root: $('#eb-demo'), body: $('#eb-body'), title: $('#eb-title'), count: $('#eb-count'), speech: $('#eb-speech'),
      next: $('#eb-next'), steps: $('#eb-steps'), map: $('#eb-map'), cap: $('#eb-mapcap'), voice: $('#eb-voice'), toast: $('#eb-toast'),
    };
    let trip, proj, legGeo, idx = 0, raf = 0, voiceOn = false, timer = 0, visible = false;

    /* Projection: equirectangular, fitted to the SVG box */
    function project(t) {
      const pts = t.legs.flatMap((l) => l.path);
      const lat0 = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const k = Math.cos((lat0 * Math.PI) / 180);
      const xs = pts.map((p) => p[1] * k), ys = pts.map((p) => -p[0]);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      const s = Math.min((W - 2 * PAD) / (maxX - minX || 1), (H - 2 * PAD) / (maxY - minY || 1));
      const ox = (W - (maxX - minX) * s) / 2, oy = (H - (maxY - minY) * s) / 2;
      return ([lat, lng]) => [ox + (lng * k - minX) * s, oy + (-lat - minY) * s];
    }

    function geo(leg) {
      const p = leg.path.map(proj);
      const cum = [0];
      for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
      const total = cum[cum.length - 1] || 1;
      const nearestFrac = (q) => {
        let best = 0, bd = Infinity;
        p.forEach((v, i) => { const d = Math.hypot(v[0] - q[0], v[1] - q[1]); if (d < bd) { bd = d; best = i; } });
        return cum[best] / total;
      };
      const stopFracs = leg.stops.map((s) => nearestFrac(proj(s.pt)));
      return { p, cum, total, stopFracs, at(f) {
        const d = Math.max(0, Math.min(1, f)) * total;
        let i = 1;
        while (i < cum.length - 1 && cum[i] < d) i++;
        const seg = cum[i] - cum[i - 1] || 1, r = (d - cum[i - 1]) / seg;
        return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * r, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * r];
      } };
    }

    const legColor = (l) => (l.mode === 'BUS' ? 'var(--ew)' : LINE_COLORS[l.route] || 'var(--ink)');

    function drawMap() {
      const grid = [];
      for (let x = 0; x <= W; x += 40) grid.push(`<line class="map-grid" x1="${x}" y1="0" x2="${x}" y2="${H}"/>`);
      for (let y = 0; y <= H; y += 40) grid.push(`<line class="map-grid" x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
      const legs = trip.legs.map((l, i) => {
        const d = 'M' + legGeo[i].p.map((q) => q.map((n) => n.toFixed(1)).join(' ')).join(' L');
        return `<path class="map-leg ${l.mode === 'WALK' ? 'walk' : 'ride'}" data-leg="${i}" d="${d}" ${l.mode !== 'WALK' ? `style="stroke:${legColor(l)}"` : ''}/>`;
      }).join('');
      const labels = [];
      const placed = [];
      const label = (pt, text, major, dy = -16) => {
        const [x, y] = proj(pt);
        if (placed.some(([px, py]) => Math.abs(px - x) < 90 && Math.abs(py - y) < 40)) return '';
        placed.push([x, y]);
        const anchor = x > W * 0.72 ? 'end' : x < W * 0.28 ? 'start' : 'middle';
        return `<text class="map-label ${major ? 'major' : ''}" x="${x.toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}">${esc(text)}</text>`;
      };
      const first = trip.legs[0], last = trip.legs[trip.legs.length - 1];
      const home = first.path[0], dest = last.path[last.path.length - 1];
      const [hx, hy] = proj(home), [dx, dy] = proj(dest);
      // Origin and destination labels first, so stop labels give way to them.
      labels.push(label(home, 'Home · ' + DEMO.home, true, -20), label(dest, trip.dest.replace(/ \(.*\)/, ''), true, 32));
      const stops = [];
      trip.legs.forEach((l) => {
        if (l.mode === 'WALK') return;
        l.stops.forEach((s, k) => {
          const [x, y] = proj(s.pt);
          const end = k === 0 || k === l.stops.length - 1;
          stops.push(`<circle class="map-stop" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${end ? 7 : 4.5}"/>`);
          if (end) labels.push(label(s.pt, tidy(s.name), false, k === 0 ? 24 : -14));
        });
      });
      el.map.innerHTML = `${grid.join('')}${legs}${stops.join('')}
        <rect x="${hx - 9}" y="${hy - 9}" width="18" height="18" rx="4" fill="var(--ink)"/>
        <circle cx="${dx}" cy="${dy}" r="11" fill="var(--surface)" stroke="var(--ink)" stroke-width="4"/><circle cx="${dx}" cy="${dy}" r="4" fill="var(--ink)"/>
        ${labels.join('')}
        <g id="eb-me"><circle class="me-halo" r="14"/><circle class="me-dot" r="9"/></g>`;
      el.cap.innerHTML = `<span>${esc(trip.signature.replace(/>/g, ' → '))}</span><span>${Math.round(trip.durationS / 60)} min · ${fmtDist(trip.walkM)} walk${trip.fare ? ' · ' + esc(trip.fare) : ''}</span>`;
    }

    function setMe([x, y]) {
      const g = $('#eb-me', el.map);
      if (g) g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    }

    function markLegs(legIndex) {
      $$('.map-leg', el.map).forEach((p) => p.classList.toggle('done', +p.dataset.leg < legIndex));
    }

    function renderSteps() {
      el.steps.innerHTML = trip.steps.map((s, i) => `<li class="${i < idx ? 'done' : ''}${i === idx ? ' current' : ''}">
        <button type="button" data-i="${i}" ${i === idx ? 'aria-current="step"' : ''}><span class="dot">${i < idx ? '✓' : i + 1}</span><span class="lbl">${esc(s.title)}</span></button></li>`).join('');
    }

    function speak(text) {
      if (!voiceOn || !('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      const v = speechSynthesis.getVoices().find((x) => /en[-_](SG|GB|AU)/i.test(x.lang)) || speechSynthesis.getVoices().find((x) => /^en/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    }

    function animate(legIndex, from, to, onFrame) {
      cancelAnimationFrame(raf);
      const g = legGeo[legIndex];
      const dur = reduceMotion || !visible ? 0 : Math.min(5200, Math.max(1600, (to - from) * g.total * 9));
      const t0 = performance.now();
      const tick = (now) => {
        const r = dur ? Math.min(1, (now - t0) / dur) : 1;
        const e = r < 0.5 ? 2 * r * r : 1 - Math.pow(-2 * r + 2, 2) / 2;
        const f = from + (to - from) * e;
        setMe(g.at(f));
        onFrame && onFrame(f, r);
        if (r < 1) raf = requestAnimationFrame(tick);
        else el.next.classList.add('nudge');
      };
      raf = requestAnimationFrame(tick);
    }

    function renderStep() {
      cancelAnimationFrame(raf);
      clearInterval(timer);
      el.next.classList.remove('nudge');
      const s = trip.steps[idx];
      const L = s.legIndex;
      const leg = trip.legs[Math.min(L, trip.legs.length - 1)];
      const g = legGeo[Math.min(L, trip.legs.length - 1)];
      el.title.textContent = s.title;
      el.count.textContent = `Step ${idx + 1} of ${trip.steps.length}`;
      el.speech.innerHTML = `${SPEAKER}<span>${esc(s.speech)}</span>`;
      el.next.textContent = idx === trip.steps.length - 1 ? 'Start again' : 'Next';
      markLegs(L);
      renderSteps();
      speak(s.speech);

      const lineOf = (l) => `<span class="line-chip" style="background:${LINE_COLORS[l.route] || '#333'}">${esc(l.route)} · ${esc(LINE_NAMES[l.route] || 'MRT')}</span>`;
      let html = '';
      switch (s.kind) {
        case 'WALK': {
          const ins = (s.instructions || []).map((t) => (/^You have arrived|^Your destination is/i.test(t) ? 'You are almost there.' : t));
          html = `${pict('walk')}<div class="walk-dist">${fmtDist(s.distanceM)}</div><div class="app-small">about ${walkMin(s.distanceM)} min</div><div class="app-big" id="eb-ins">${esc(ins[0] || '')}</div>`;
          el.body.innerHTML = html;
          const insEl = $('#eb-ins');
          animate(L, 0, 1, (f) => {
            const k = Math.min(ins.length - 1, Math.floor(f * ins.length));
            if (insEl && ins[k] && insEl.textContent !== ins[k]) insEl.textContent = ins[k];
          });
          return;
        }
        case 'WAIT_BUS': {
          let mins = 3;
          el.body.innerHTML = `<div class="bus-panel"><div class="num">${esc(s.serviceNo)}</div><div class="eta" id="eb-eta">comes in ${mins} min</div></div><div class="app-small">Live arrival time (simulated in this demo)</div>`;
          timer = setInterval(() => {
            mins -= 1;
            const eta = $('#eb-eta');
            if (!eta) return clearInterval(timer);
            eta.textContent = mins > 0 ? `comes in ${mins} min` : 'is arriving now';
            if (mins <= 0) { clearInterval(timer); el.next.classList.add('nudge'); }
          }, 1600);
          setMe(g.at(0));
          return;
        }
        case 'BOARD_BUS':
          html = `${pict('card')}<div class="app-big">Check the number is ${esc(s.serviceNo)}</div><div class="app-small">Get on at the front door.<br>Tap your card.</div>`;
          setMe(g.at(0));
          break;
        case 'RIDE_BUS':
        case 'RIDE_TRAIN': {
          const stops = (s.stops || []).map(tidy);
          const n = stops.length;
          const unit = s.kind === 'RIDE_BUS' ? 'stop' : 'station';
          el.body.innerHTML = `${s.kind === 'RIDE_TRAIN' ? lineOf(leg) : ''}<div><div class="togo" id="eb-togo">${n - 1}</div><div class="app-small" id="eb-unit">${unit}s to go</div></div>
            <div class="stop-bands"><div class="band band-next"><small>Next ${unit}</small><b id="eb-nextstop">${esc(stops[1] || stops[0] || '')}</b></div>
            <div class="band band-after"><small>After that</small><b id="eb-after">${esc(stops[2] || '—')}</b></div></div>`;
          const end = s.kind === 'RIDE_BUS' && n > 2 ? g.stopFracs[n - 2] : 1;
          let last = -1;
          animate(L, 0, end, (f) => {
            let cur = 0;
            g.stopFracs.forEach((sf, k) => { if (sf <= f + 1e-6) cur = k; });
            if (cur === last) return;
            last = cur;
            const togo = Math.max(0, n - 1 - cur);
            $('#eb-togo').textContent = togo;
            $('#eb-unit').textContent = `${togo === 1 ? unit : unit + 's'} to go`;
            $('#eb-nextstop').textContent = stops[cur + 1] || stops[n - 1];
            $('#eb-after').textContent = stops[cur + 2] || '—';
          });
          return;
        }
        case 'PRESS_BELL': {
          const stops = trip.steps.find((x) => x.kind === 'RIDE_BUS' && x.legIndex === L)?.stops || [];
          html = `<div class="bell">${svgIcon('bell')}</div><div class="app-big">Your stop is next</div><div class="app-small">${esc(tidy(stops[stops.length - 1] || ''))}</div>`;
          el.body.innerHTML = html;
          const n = stops.length;
          animate(L, n > 2 ? g.stopFracs[n - 2] : 0, 1);
          return;
        }
        case 'ALIGHT_BUS':
          html = `<div class="getoff">Get off now</div><div class="app-small">Tap your card at the back door.</div>`;
          setMe(g.at(1));
          break;
        case 'ENTER_STATION':
          html = `${pict('gate')}<div class="app-big">Tap your card at the gate</div>`;
          setMe(g.at(0));
          break;
        case 'FIND_PLATFORM':
          html = `${pict('platform')}${lineOf(leg)}<div class="app-small">Follow the signs for this line.</div>`;
          setMe(g.at(0));
          break;
        case 'CHANGE_LINE':
          html = `${pict('change')}${lineOf(leg)}<div class="app-small">Follow the signs to the new line.</div>`;
          setMe(g.at(0));
          break;
        case 'EXIT_STATION':
          html = `${pict('exit')}<div class="walk-dist">${s.exit ? 'Exit ' + esc(s.exit) : 'Go out'}</div><div class="app-small">Tap your card at the gate.</div>`;
          setMe(legGeo[L].at(1));
          break;
        case 'ARRIVED':
          html = `<div class="star" aria-hidden="true"><svg viewBox="0 0 24 24" width="96" height="96"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9Z" fill="#FFC21A" stroke="#0B1F2A" stroke-width="1.4" stroke-linejoin="round"/></svg></div><div class="app-big">Well done!</div><div class="app-small">Your caregiver gets a message that you arrived.</div>`;
          setMe(legGeo[legGeo.length - 1].at(1));
          markLegs(trip.legs.length);
          break;
      }
      el.body.innerHTML = html;
    }

    function go(i) {
      idx = (i + trip.steps.length) % trip.steps.length;
      renderStep();
    }

    function loadTrip(id) {
      trip = DEMO.trips.find((t) => t.id === id) || DEMO.trips[0];
      proj = project(trip);
      legGeo = trip.legs.map(geo);
      idx = 0;
      drawMap();
      renderStep();
    }

    el.next.addEventListener('click', () => go(idx + 1));
    el.steps.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-i]');
      if (b) go(+b.dataset.i);
    });
    $$('.seg button', el.root).forEach((b) => b.addEventListener('click', () => {
      $$('.seg button', el.root).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      loadTrip(b.dataset.trip);
    }));
    el.voice.addEventListener('click', () => {
      voiceOn = !voiceOn;
      el.voice.setAttribute('aria-pressed', String(voiceOn));
      el.voice.querySelector('span').textContent = voiceOn ? 'Voice on' : 'Voice off';
      if (voiceOn) speak(trip.steps[idx].speech); else if ('speechSynthesis' in window) speechSynthesis.cancel();
    });
    let toastT = 0;
    $$('[data-toast]', el.root).forEach((b) => b.addEventListener('click', () => {
      el.toast.textContent = b.dataset.toast;
      el.toast.classList.add('show');
      clearTimeout(toastT);
      toastT = setTimeout(() => el.toast.classList.remove('show'), 2600);
    }));

    // Only animate while the demo is on screen, and replay the current step when it first appears.
    new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) renderStep();
    }, { threshold: 0.25 }).observe(el.root);

    loadTrip('demo-bus34');
  }
  /* ── Résumé links appear only once the PDF exists ────── */
  const RESUME = 'assets/Anirudh_Mothiki_Resume.pdf';
  fetch(RESUME, { method: 'HEAD' }).then((r) => { if (!r.ok) throw 0; }).catch(() => {
    $$(`a[href="${RESUME}"]`).forEach((a) => { a.hidden = true; });
    document.documentElement.dataset.noResume = '';
  });
})();
