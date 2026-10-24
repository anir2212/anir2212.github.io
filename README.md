# Portfolio: Anirudh Mothiki

A static site with no build step: `index.html`, `styles.css`, `main.js`, and `assets/`.

## Preview locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Adding photos and your résumé (no tools needed)

The site is live at https://anir2212.github.io and is served from this GitHub repo. Uploading a file through the GitHub website updates the live site in about a minute.

1. Go to https://github.com/anir2212/anir2212.github.io and open the `assets` folder.
2. For photos, open the `photos` folder and use **Add file → Upload files**. For the résumé, upload straight into `assets`.
3. Rename each file **before** uploading so it matches a name below exactly: lowercase and ending in `.jpg`.
4. Click **Commit changes**. Wait about a minute, then refresh the site.

The galleries adapt to however many photos exist: 1, 2, 3 or up to 6 per section, in a layout that keeps each photo's shape. A section with no photos hides its gallery. Missing numbers are fine (for example `jakarta-1` and `jakarta-3` only).

| File names (in `assets/photos/`) | Section |
|---|---|
| `easyboard-1.jpg`, `easyboard-2.jpg`, … | EasyBoard |
| `unicon-1.jpg`, `unicon-2.jpg`, … | UNICON 2026 |
| `jakarta-1.jpg`, `jakarta-2.jpg`, … | Jakarta Winter Programme |
| `rusa-1.jpg`, `rusa-2.jpg`, … | Rusa House |
| `assets/Anirudh_Mothiki_Resume.pdf` | Résumé buttons. They stay hidden until this file exists. |

Visitors can click any photo to enlarge it and flip through with the arrow keys.

Tips:
- **iPhone photos (HEIC):** open in Preview → File → Export → JPEG. Around 1600px wide (Tools → Adjust Size) keeps the site fast.
- **Shapes:** portrait, landscape or square all work. Nothing is cropped.
- **Captions (optional):** in `index.html`, each gallery has an optional `data-captions="first|second|third"`, in photo-number order. Edit it on GitHub with the pencil icon, then commit.
- **Replacing a photo:** upload a new file with the same name. If your browser still shows the old one, do a hard refresh (Cmd+Shift+R).

**From your Mac instead** (if you'd rather use git): copy files into `~/Desktop/Projects/portfolio/assets/photos/`, then run

```bash
cd ~/Desktop/Projects/portfolio && git add -A && git commit -m "Add photos" && git push
```

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
