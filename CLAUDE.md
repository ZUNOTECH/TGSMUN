# TGSMUN Conference Website — Project Notes

Static site (plain HTML/CSS/JS, no build step) for the TGS Model United Nations conference.

## Architecture

- 5 pages: `index.html`, `committees.html`, `secretariat.html`, `register.html`, `gallery.html`
- Shared styles: `assets/css/style.css` — the design system lives here
- Shared motion engine: `assets/js/main.js` — all animation is hand-rolled vanilla JS (no libraries)
- Nav / loader / curtain / menu-overlay / footer markup is duplicated per page — edit all 5 pages when changing any of them

## Design system (event theme: black & red with gold accents)

All colors are CSS variables at the top of `style.css`:
`--paper` (lacquer black ground), `--paper-2` (lifted black), `--ink` (warm off-white text),
`--red` (crimson plates), `--red-lite` (red for small text on black), `--gold` (accents),
`--ivory` (text on red plates; also the inverted footer/marquee strips).

Fonts via Google Fonts: Anton (display, uppercase), Archivo (body), Instrument Serif italic (accents).
Deliberately single-theme (no light/dark variants).

## Motion conventions

- `.split` = word-mask headline reveal (JS wraps words in spans)
- `.rv` (+ `.rv-d1..d3`) = scroll fade-up reveal; `.clip` = clip-path reveal
- Preloader plays once per tab (sessionStorage `tgsmun-seen`); curtain transition between pages
- Countdown date: `CONFERENCE_DATE` at the top of `main.js`
- Pinned horizontal committees track on the homepage (`.hpin`); falls back to scroll-snap under 860px
- Everything respects `prefers-reduced-motion`

## Git / deploy

- Single-branch flow: commit and push directly to `main` — Vercel deploys production from it.
- Verify changes with Playwright screenshots (Chromium at `/opt/pw-browsers/chromium`) before pushing.

## Remaining placeholders (see README.md for the full list)

School name ("TGS"), secretariat names, contact phone, social links, Google Form embed in
`register.html`, gallery photos (swap `.fill.ph-N` divs for `<img class="fill">`), conference dates.
