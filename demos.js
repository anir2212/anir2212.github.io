// Playable project demos, rendered inside the project dialog by projects.js.
// Each one ports the real project's logic to plain JS (see the source notes on each).
(() => {
  'use strict';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sgd = (minor) => `S$${(minor / 100).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const toMinor = (v) => Math.round(Number(v || 0) * 100);

  /* ── PayGuard: ControlEvaluator.declines (p09_payguard/src/main/kotlin/com/payguard/domain/Card.kt) ── */
  function declines(policy, ctx) {
    const out = [];
    if (policy.allowedMccs.length && !policy.allowedMccs.includes(ctx.mcc)) out.push('mcc_not_allowed');
    if (policy.deniedMccs.includes(ctx.mcc)) out.push('mcc_denied');
    if (policy.blockedMerchants.includes(ctx.merchantId)) out.push('merchant_blocked');
    if (policy.allowedCountries.length && !policy.allowedCountries.includes(ctx.country)) out.push('country_not_allowed');
    if (policy.cardDailyMinor != null && ctx.amountMinor > policy.cardDailyMinor - ctx.cardDaySpend) out.push('card_daily_limit');
    if (policy.cardMonthlyMinor != null && ctx.amountMinor > policy.cardMonthlyMinor - ctx.cardMonthSpend) out.push('card_monthly_limit');
    if (policy.companyDailyMinor != null && ctx.amountMinor > policy.companyDailyMinor - ctx.companyDaySpend) out.push('company_daily_limit');
    if (policy.companyMonthlyMinor != null && ctx.amountMinor > policy.companyMonthlyMinor - ctx.companyMonthSpend) out.push('company_monthly_limit');
    if (ctx.recentAttempts >= policy.velocityCount) out.push('velocity');
    return out;
  }
  const REASON = {
    mcc_not_allowed: 'Merchant category is not on the card’s allow-list',
    mcc_denied: 'Merchant category is blocked for this card',
    merchant_blocked: 'This merchant is blocked',
    country_not_allowed: 'Card is not allowed in this country',
    card_daily_limit: 'Over the card’s daily limit',
    card_monthly_limit: 'Over the card’s monthly limit',
    company_daily_limit: 'Over the company’s daily limit',
    company_monthly_limit: 'Over the company’s monthly limit',
    velocity: 'Too many attempts in the last 60 seconds',
    insufficient_available: 'Not enough available balance on the card',
  };

  function payguard(root) {
    // Sample card policy for the demo; the rule logic above is the project's.
    const policy = {
      cardDailyMinor: 50000, cardMonthlyMinor: 200000, companyDailyMinor: 500000, companyMonthlyMinor: 2000000,
      allowedMccs: [], deniedMccs: ['7995'], blockedMerchants: ['quickcash-electronics'], allowedCountries: ['SG', 'MY'],
      velocityCount: 5,
    };
    const spent = { cardDay: 12000, cardMonth: 64000, companyDay: 210000, companyMonth: 1180000 };
    const availableMinor = 100000;
    const MERCHANTS = [
      { id: 'fairprice', name: 'FairPrice (groceries)', mcc: '5411' },
      { id: 'grab', name: 'Grab (rides)', mcc: '4121' },
      { id: 'luckybet', name: 'LuckyBet (gambling)', mcc: '7995' },
      { id: 'quickcash-electronics', name: 'QuickCash Electronics', mcc: '5732' },
    ];
    root.innerHTML = `
      <div class="dm-grid">
        <form class="dm-form" onsubmit="return false">
          <label>Amount (S$)<input type="number" name="amount" min="0.01" step="0.01" value="42.80"></label>
          <label>Merchant<select name="merchant">${MERCHANTS.map((m) => `<option value="${m.id}">${esc(m.name)} · MCC ${m.mcc}</option>`).join('')}</select></label>
          <label>Country<select name="country"><option>SG</option><option>MY</option><option>US</option></select></label>
          <label>Attempts in the last minute <output name="att_out">1</output><input type="range" name="attempts" min="0" max="8" value="1"></label>
          <button type="button" class="dm-btn" data-act="auth">Authorise</button>
        </form>
        <div class="dm-out" aria-live="polite"><p class="dm-hint">Pick a payment and press <b>Authorise</b>.</p></div>
      </div>
      <p class="dm-policy">Sample card: daily limit ${sgd(policy.cardDailyMinor)} (${sgd(spent.cardDay)} used), monthly ${sgd(policy.cardMonthlyMinor)} (${sgd(spent.cardMonth)} used), available balance ${sgd(availableMinor)}, allowed in SG and MY, gambling blocked, 5 attempts a minute.</p>`;
    const f = root.querySelector('form');
    const out = root.querySelector('.dm-out');
    f.attempts.addEventListener('input', () => { f.att_out.value = f.attempts.value; });
    root.querySelector('[data-act="auth"]').addEventListener('click', () => {
      const m = MERCHANTS.find((x) => x.id === f.merchant.value);
      const amountMinor = toMinor(f.amount.value);
      if (!(amountMinor > 0)) { out.innerHTML = '<p class="dm-hint">Enter an amount above zero.</p>'; return; }
      const ctx = { amountMinor, mcc: m.mcc, merchantId: m.id, country: f.country.value, cardDaySpend: spent.cardDay, cardMonthSpend: spent.cardMonth,
        companyDaySpend: spent.companyDay, companyMonthSpend: spent.companyMonth, recentAttempts: +f.attempts.value };
      const reasons = declines(policy, ctx);
      if (amountMinor > availableMinor) reasons.push('insufficient_available'); // PaymentService available-balance check
      const ok = reasons.length === 0;
      out.innerHTML = `
        <div class="dm-verdict ${ok ? 'ok' : 'no'}">${ok ? 'APPROVED' : 'DECLINED'}</div>
        ${ok ? `<p>A hold of <b>${sgd(amountMinor)}</b> is placed on the card's available balance. Nothing moves in the ledger until the payment is captured.</p>
          <button type="button" class="dm-btn ghost" data-act="capture">Capture payment</button><div class="dm-journal"></div>`
        : `<ul class="dm-reasons">${reasons.map((r) => `<li><code>${r}</code>${esc(REASON[r])}</li>`).join('')}</ul>
          <p class="dm-sub">The decline is still written to the outbox, so analysts see it in the case stream.</p>`}`;
      const cap = out.querySelector('[data-act="capture"]');
      if (cap) cap.addEventListener('click', () => {
        // PaymentService capture: card funding -X, merchant clearing +X (must balance).
        const legs = [[`card:demo:funding`, -amountMinor], [`merchant:${m.id}:clearing:SGD`, amountMinor]];
        const balanced = legs.reduce((a, [, v]) => a + v, 0) === 0;
        out.querySelector('.dm-journal').innerHTML = `<table class="dm-table"><thead><tr><th>Account</th><th>Debit</th><th>Credit</th></tr></thead><tbody>
          ${legs.map(([acc, v]) => `<tr><td><code>${esc(acc)}</code></td><td>${v > 0 ? sgd(v) : ''}</td><td>${v < 0 ? sgd(-v) : ''}</td></tr>`).join('')}
          </tbody></table><p class="dm-sub">${balanced ? '✓ Journal balances to zero, as every posting must.' : 'Unbalanced journal: rejected.'}</p>`;
        cap.remove();
      });
    });
  }

  /* ── FinRecon: _classify (p10_finrecon/reconcile_engine.py), fee tolerance 100 cents, window 3 days ── */
  function classify(left, cands, feeTol = 100, windowDays = 3) {
    if (!cands.length) return ['missing_in_bank', 'No bank row has this reference and currency.'];
    const far = Math.max(...cands.map((r) => Math.abs(left.day - r.day)));
    if (far > windowDays) return ['unexplained', `Bank posting is ${far} day(s) apart, beyond the window.`];
    const amounts = cands.map((r) => r.cents);
    if (cands.length > 1) {
      if (new Set(amounts).size === 1 && amounts[0] === left.cents) return ['duplicate', 'Two or more bank rows repeat the full ledger amount.'];
      if (cands.length <= 4 && amounts.reduce((a, b) => a + b, 0) === left.cents) return ['many_to_one', 'Bank rows with the same reference sum to the ledger amount.'];
      return ['unexplained', 'Multiple bank rows do not form a bounded exact settlement.'];
    }
    const delta = Math.abs(left.cents - cands[0].cents);
    if (delta === 0) return far ? ['timing_difference', `Amounts agree; bank posting is ${far} day(s) apart.`] : ['matched', 'Reference, currency, amount, and posting date agree.'];
    if (delta <= feeTol) return ['fee_fx_difference', `Amount differs by ${delta} SGD cents within fee tolerance.`];
    return ['unexplained', `Amount differs by ${delta} SGD cents beyond fee tolerance.`];
  }

  function finrecon(root) {
    const left = { ref: 'PAY-00029', cents: 125000, day: 0, counterparty: 'Acme Supplies Pte Ltd' };
    const PRESETS = {
      Matched: [{ cents: 125000, day: 0 }],
      Timing: [{ cents: 125000, day: 2 }],
      'Bank fee': [{ cents: 124935, day: 0 }],
      'Split payment': [{ cents: 75000, day: 0 }, { cents: 50000, day: 1 }],
      Duplicate: [{ cents: 125000, day: 0 }, { cents: 125000, day: 0 }],
      Missing: [],
    };
    let bank = PRESETS.Matched.map((r) => ({ ...r }));
    root.innerHTML = `
      <div class="dm-presets" role="group" aria-label="Scenarios">${Object.keys(PRESETS).map((k) => `<button type="button" data-p="${esc(k)}">${esc(k)}</button>`).join('')}</div>
      <div class="dm-grid">
        <div>
          <p class="dm-label">Ledger row</p>
          <div class="dm-row ledger"><code>${left.ref}</code><span>${esc(left.counterparty)}</span><b>${sgd(left.cents)}</b><span>posted day 0</span></div>
          <p class="dm-label">Bank rows with the same reference</p>
          <div class="dm-bank"></div>
          <button type="button" class="dm-btn ghost sm" data-act="add">+ Add bank row</button>
        </div>
        <div class="dm-out" aria-live="polite"></div>
      </div>`;
    const list = root.querySelector('.dm-bank');
    const out = root.querySelector('.dm-out');
    function draw() {
      list.innerHTML = bank.length ? bank.map((r, i) => `<div class="dm-row">
          <label>S$<input type="number" step="0.01" min="0" data-i="${i}" data-k="cents" value="${(r.cents / 100).toFixed(2)}"></label>
          <label>day<input type="number" step="1" min="-9" max="9" data-i="${i}" data-k="day" value="${r.day}"></label>
          <button type="button" class="dm-x" data-del="${i}" aria-label="Remove bank row">✕</button></div>`).join('') : '<p class="dm-hint">No bank rows.</p>';
      root.querySelector('[data-act="add"]').hidden = bank.length >= 4;
      result();
    }
    function result() {
      const [status, why] = classify(left, bank);
      const diff = left.cents - bank.reduce((a, r) => a + r.cents, 0);
      out.innerHTML = `<div class="dm-verdict ${status === 'matched' ? 'ok' : status === 'unexplained' || status === 'missing_in_bank' ? 'no' : 'warn'}">${status.replace(/_/g, ' ')}</div>
        <p>${esc(why)}</p><p class="dm-sub">Difference: ${diff === 0 ? 'none' : sgd(Math.abs(diff)) + (diff > 0 ? ' short in the bank' : ' extra in the bank')}. Every break keeps a figure ID that traces back to the original CSV rows.</p>`;
    }
    root.addEventListener('input', (e) => {
      const t = e.target.closest('input[data-i]');
      if (!t) return;
      const r = bank[+t.dataset.i];
      r[t.dataset.k] = t.dataset.k === 'cents' ? toMinor(t.value) : Math.trunc(+t.value || 0);
      result();
    });
    root.addEventListener('click', (e) => {
      const p = e.target.closest('[data-p]');
      if (p) { bank = PRESETS[p.dataset.p].map((r) => ({ ...r })); draw(); }
      const d = e.target.closest('[data-del]');
      if (d) { bank.splice(+d.dataset.del, 1); draw(); }
      if (e.target.closest('[data-act="add"]')) { bank.push({ cents: 0, day: 0 }); draw(); }
    });
    draw();
  }

  /* ── ModelAudit: real fitted WoE scorecard (UCI German Credit), exported from scorecard.joblib ── */
  const FEATURES = [
    { key: 'A01', label: 'Checking account', opts: [['A11', 'Overdrawn (below 0 DM)'], ['A12', '0 to 200 DM'], ['A13', '200 DM or more'], ['A14', 'No checking account']] },
    { key: 'A03', label: 'Credit history', opts: [['A30', 'No credits, or all paid back'], ['A31', 'All credits at this bank paid back'], ['A32', 'Existing credits paid on time'], ['A33', 'Late payments in the past'], ['A34', 'Critical account / credits elsewhere']] },
    { key: 'A02', label: 'Loan duration', opts: [['0', 'Up to 12 months'], ['1', '13 to 15 months'], ['2', '16 to 24 months'], ['3', '25 to 30 months'], ['4', 'Over 30 months']] },
    { key: 'A05', label: 'Loan amount', opts: [['0', 'Up to 1,275 DM'], ['1', '1,275 to 1,921 DM'], ['2', '1,921 to 2,926 DM'], ['3', '2,926 to 4,789 DM'], ['4', 'Over 4,789 DM']] },
    { key: 'A06', label: 'Savings', opts: [['A61', 'Below 100 DM'], ['A62', '100 to 500 DM'], ['A63', '500 to 1,000 DM'], ['A64', '1,000 DM or more'], ['A65', 'Unknown / none']] },
    { key: 'A07', label: 'Time in current job', opts: [['A71', 'Unemployed'], ['A72', 'Under 1 year'], ['A73', '1 to 4 years'], ['A74', '4 to 7 years'], ['A75', '7 years or more']] },
    { key: 'A04', label: 'Purpose', opts: [['A40', 'New car'], ['A41', 'Used car'], ['A42', 'Furniture'], ['A43', 'Radio / TV'], ['A46', 'Education'], ['A49', 'Business']] },
  ];
  function modelaudit(root) {
    const S = window.MODELAUDIT_SCORECARD;
    if (!S) { root.textContent = 'Scorecard data missing.'; return; }
    const choice = { A01: 'A12', A03: 'A32', A02: '2', A05: '2', A06: 'A61', A07: 'A73', A04: 'A43' };
    root.innerHTML = `
      <div class="dm-grid">
        <form class="dm-form" onsubmit="return false">${FEATURES.map((f) => `<label>${esc(f.label)}<select name="${f.key}">${f.opts.map(([v, t]) => `<option value="${v}"${choice[f.key] === v ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`).join('')}</form>
        <div class="dm-out" aria-live="polite"></div>
      </div>
      <p class="dm-policy">The other 13 attributes stay neutral (0 points). Fitted on the public UCI German Credit data, test AUC ${S.test_auc.toFixed(3)}. Scale: ${S.pdo} points double the odds, ${S.base_score} = ${S.base_good_odds}:1 good-to-bad. <a href="assets/workpapers/german_scorecard.html" target="_blank" rel="noopener">See the audit workpaper this project generated ↗</a></p>`;
    const out = root.querySelector('.dm-out');
    function draw() {
      const parts = FEATURES.map((f) => ({ label: f.label, pts: S.features[f.key].points[choice[f.key]] ?? 0 }));
      const score = S.offset + parts.reduce((a, p) => a + p.pts, 0);
      const odds = S.base_good_odds * Math.pow(2, (score - S.base_score) / S.pdo);
      const pd = 1 / (1 + odds);
      const max = Math.max(...parts.map((p) => Math.abs(p.pts)), 1);
      out.innerHTML = `<div class="dm-score"><b>${Math.round(score)}</b><span>points · estimated default risk ${(pd * 100).toFixed(1)}%</span></div>
        <ul class="dm-bars">${parts.sort((a, b) => b.pts - a.pts).map((p) => `<li><span>${esc(p.label)}</span>
          <i class="${p.pts >= 0 ? 'pos' : 'neg'}" style="--w:${(Math.abs(p.pts) / max) * 50}%"></i><em>${p.pts >= 0 ? '+' : '−'}${Math.abs(p.pts).toFixed(1)}</em></li>`).join('')}</ul>`;
    }
    root.querySelector('form').addEventListener('change', (e) => { choice[e.target.name] = e.target.value; draw(); });
    draw();
  }

  window.DEMOS = {
    'p09-payguard': { title: 'Authorise a card', run: payguard },
    'p10-finrecon': { title: 'Reconcile a payment', run: finrecon },
    'p08-modelaudit': { title: 'Score a loan applicant', run: modelaudit },
  };
  // Exposed for verification against the projects' own test cases.
  window.__demoLogic = { declines, classify };
})();
