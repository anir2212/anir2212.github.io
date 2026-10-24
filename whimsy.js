// MRT whimsy: tap a station on the hero line and a train glides there, plays a door chime
// and announces the station. The chime is synthesised (WebAudio), only ever on a click.
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ctx = null;

  // Two soft bell tones, high then low.
  window.mrtChime = () => {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      [[784, 0], [587.33, 0.42]].forEach(([freq, at]) => {
        const t = ctx.currentTime + at;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
        gain.connect(ctx.destination);
        [1, 2.01].forEach((mult, k) => { // fundamental plus a faint overtone for a bell-like ring
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = freq * mult;
          const g = ctx.createGain();
          g.gain.value = k ? 0.18 : 1;
          o.connect(g).connect(gain);
          o.start(t);
          o.stop(t + 1.2);
        });
      });
    } catch (e) { /* audio unavailable: stay silent */ }
  };

  const track = $('.journey-track');
  const stops = [...document.querySelectorAll('.journey-stops li')];
  if (!track || !stops.length) return;

  // Where each station's "Alight here" link goes.
  const TARGET = { 'EasyBoard': '#easyboard', 'Jakarta': '#leadership', 'UNICON 2026': '#leadership' };
  const targetOf = (name) => TARGET[name] || '#experience';

  const train = document.createElement('div');
  train.className = 'journey-train';
  train.setAttribute('aria-hidden', 'true');
  train.innerHTML = '<i></i><i></i><i></i>';
  track.appendChild(train);
  // Park the train at the first station; it only appears once someone taps a stop.
  let at = parseFloat(stops[0].style.getPropertyValue('--x'));
  train.style.left = `${at}%`;
  const bubble = document.createElement('div');
  bubble.className = 'journey-bubble';
  bubble.setAttribute('role', 'status');
  track.appendChild(bubble);

  function go(li) {
    const x = parseFloat(li.style.getPropertyValue('--x'));
    const name = li.querySelector('b').textContent;
    const from = at;
    const dist = Math.abs(x - from);
    train.style.transitionDuration = reduce ? '0s' : `${Math.min(2.2, 0.5 + dist / 40)}s`;
    train.classList.add('on');
    train.classList.toggle('flip', x < from);
    requestAnimationFrame(() => { train.style.left = `${x}%`; });
    at = x;
    stops.forEach((s) => s.classList.toggle('arrived', s === li));
    bubble.classList.remove('show');
    clearTimeout(go.t);
    go.t = setTimeout(() => {
      window.mrtChime();
      bubble.style.left = `${x}%`;
      bubble.style.setProperty('--shift', x < 12 ? '-14%' : x > 88 ? '-86%' : '-50%');
      bubble.innerHTML = `<span>Arriving at</span><b>${name}</b><a href="${targetOf(name)}">Alight here →</a>`;
      bubble.classList.add('show');
    }, reduce ? 0 : Math.min(2200, 500 + dist * 25));
  }

  stops.forEach((li) => {
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `Ride to ${li.querySelector('b').textContent}`);
    li.addEventListener('click', () => go(li));
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(li); } });
  });
  bubble.addEventListener('click', (e) => { if (e.target.closest('a')) bubble.classList.remove('show'); });

  const hint = document.createElement('p');
  hint.className = 'journey-hint';
  hint.textContent = 'Tap a station to ride the line';
  track.parentElement.appendChild(hint);
})();
