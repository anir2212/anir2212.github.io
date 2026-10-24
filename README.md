# Portfolio: Anirudh Mothiki

A static site with no build step: `index.html`, `styles.css`, `main.js`, and `assets/`.

## Preview locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Adding photos

Drop images into `assets/photos/` using these exact names. Each slot shows a dashed placeholder until its file exists. JPGs about 1600px wide work best.

| File | Where it shows |
|---|---|
| `easyboard-1.jpg` | EasyBoard: team photo |
| `easyboard-2.jpg` | EasyBoard: user trials with the Down Syndrome Association |
| `easyboard-3.jpg` | EasyBoard: award or pitch day |
| `unicon-1.jpg` (large) · `unicon-2.jpg` · `unicon-3.jpg` | UNICON 2026 |
| `jakarta-1.jpg` (large) · `jakarta-2.jpg` · `jakarta-3.jpg` | NUS Enterprise Winter Programme, Jakarta |
| `rusa-1.jpg` (large) · `rusa-2.jpg` · `rusa-3.jpg` | Ridge View RC, Rusa House |

The caption on each slot comes from its `data-label` in `index.html`.

ScreenExplain demo video: put a phone screen recording at `assets/video/screenexplain.mp4`. To convert a `.mov`:

```bash
ffmpeg -i input.mov -vf "scale=720:-2" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an assets/video/screenexplain.mp4
```

Résumé: put the PDF at `assets/Anirudh_Mothiki_Resume.pdf`.

## Project screenshots (optional)

Each project in the Projects section shows a screenshot from `assets/projects/<id>.jpg` when one exists. Otherwise it shows a coloured poster with its headline number, which looks finished on its own. Screenshots that already exist (taken from the repos): `risk-monitor`, `p02-opspilot`, `nextbite`, `p07-playtestrl`, `p05-fabsense`.

Still missing, most valuable first (16:10 landscape, about 1600px wide): `p01-pocketlm`, `p09-payguard`, `p08-modelaudit`, `p10-finrecon`, then `p04-gamerec`, `p03-gamestream`, `p06-claimflow`, `p11-miniplay`, `screenexplain`, `easyboard`, `cs3263-llm-z3`.

Project text lives in `assets/data/projects.js`. It's generated from `~/Desktop/Projects/Tracked/entries/*.md`, so edit the ledger entry and regenerate rather than hand-editing. Which six projects appear as large tiles is set by `SELECTED` at the top of `projects.js`.

## Extras

- **Playable demos** (`demos.js`): PayGuard, FinRecon and ModelAudit each have a "Try it" panel in their project window. The logic is ported from each repo:
  - **PayGuard:** `ControlEvaluator.declines`. Passes the repo's "every rule can decline" test case.
  - **FinRecon:** `reconcile_engine._classify`. Matches the Python original on 2,000 of 2,000 random cases.
  - **ModelAudit:** uses the real fitted German Credit scorecard, exported to `assets/data/modelaudit-scorecard.js`, and reproduces `scorecard.points()` to within 0.003.

  If a project's logic changes, update its port and re-check it.
- **⌘K / Ctrl+K command menu** (`palette.js`): search projects, sections and actions.
- **Ride the line** (`whimsy.js`): tap a station on the hero timeline to send the train there. It plays a synthesised door chime and offers "Alight here".
- **Caching:** the CSS and JS links in `index.html` end in `?v=3`. Bump the number after editing those files so returning visitors get the new version.

## Deploy (free)

**GitHub Pages:** push this folder to a repo named `anir2212.github.io`. It's then live at `https://anir2212.github.io`.

**Vercel / Netlify:** import the repo, or drag this folder onto https://app.netlify.com/drop.

After deploying, change the `og:image` meta tag in `index.html` to an absolute URL (for example `https://anir2212.github.io/assets/img/og.jpg`). LinkedIn needs an absolute URL to show the preview card.

## Where the EasyBoard demo data comes from

`assets/data/easyboard-demo.js` is generated from the EasyBoard repo. It runs the real `buildSteps()` from `supabase/functions/_shared/core/steps.ts` over `mobile/src/demo/data/demo-trips.json`, with polylines already decoded. Regenerate it if the step engine changes.
