# TGSMUN Conference Website — Project Notes

Static site (plain HTML/CSS/JS, no build step) for the TGS Model United Nations conference.

## Architecture

- 5 pages: `index.html`, `committees.html`, `rop.html` (ROP Academy), `secretariat.html`, `register.html`
- Shared styles: `assets/css/style.css` — the design system lives here
- Shared motion engine: `assets/js/main.js` — all animation is hand-rolled vanilla JS (no libraries)
- Nav / loader / curtain / menu-overlay / footer markup is duplicated per page — edit all 5 pages when changing any of them
- `index.html` has no loader — it opens with a scroll intro (`.intro`, sticky red plate) that reveals the page; subpages keep the loader

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
- Live site: https://tgsmun.startupsling.com/
- Verify changes with Playwright screenshots (Chromium at `/opt/pw-browsers/chromium`) before pushing.

## Conference facts (confirmed)

The Gaudium School, Kollur Campus, Hyderabad · Fifth Edition · 29–30 Aug 2026 · 700 delegates ·
25+ schools · tgs.mun@thegaudium.com · Instagram @tgs.mun.
Committees — senior (Gr 9–12): UNSC (double del), UNHRC, DISEC, AIPPM, HCC, OAS, OPEC (crisis),
NBA All-Time Greats Draft (semi-crisis), International Press; junior: UNICEF, UNESCO, WHO, CSW, UNOOSA.
Secretariat: SG Sneha Kolluri, Co-SG Varun Lingamallu, DGs Afraz Aboobacker & Aditi Guddanti,
CdA Myra Taneja, USG Finance Anant.

## Remaining placeholders

Agendas & committee sizes (all "TBA"), fees, registration form link, background-guide PDFs,
WhatsApp group links, exact itinerary timings, further secretariat appointments.
AIPPM/NBA ROP primers + quizzes on `committees.html` are drafts — refine against the real ROP.
