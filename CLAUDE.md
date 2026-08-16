# TGSMUN Conference Website — Project Notes

Static site (plain HTML/CSS/JS, no build step) for the TGS Model United Nations conference.

## Architecture

- 6 pages: `index.html`, `committees.html`, `rop.html` (ROP Academy), `whatsapp.html`, `secretariat.html`, `register.html`
- Shared styles: `assets/css/style.css` — the design system lives here
- Shared motion engine: `assets/js/main.js`, built on anime.js v4 vendored at `assets/js/vendor/anime.umd.min.js` (MIT, no CDN)
- Committee data: `assets/js/committees.js` is the SINGLE SOURCE OF TRUTH — `committees.html` and `whatsapp.html` both render from it. Add a committee, a guide URL or a WhatsApp invite there only.
- One shared scroll pipeline in `main.js` (single passive listener → rAF batch); register new effects with `addScrollTask()` rather than adding listeners
- Nav / loader / curtain / menu-overlay / footer markup is duplicated per page — edit all 6 pages when changing any of them
- All 6 pages share the red `.loader` (TGSMUN + convening percentage), once per tab
- `index.html` landing is `.land` — ONE element (the TGSMUN 2026 wordmark) on a 170vh sticky stage. A scroll task in `main.js` tips it in perspective (`rotateX`/`translateZ`/blur) so it recedes and hands off to `.land-next`, which carries the date, venue and CTAs. Keep the fade finishing at p≈1 or a black dead-zone opens up.
- `committees.html` is a directory, not a card grid: `.dir-list` (number + acronym only, grouped by wing) drives one sticky `.dir-panel`. No full committee names anywhere on the site. Rows reveal on scroll via `data-in`; on ≤860px the panel moves above the list and stays sticky.
- No italics and no pink anywhere — `.serif-i` survives only as a neutered no-op hook.

## Design system (event theme: black & red with gold accents)

All colors are CSS variables at the top of `style.css`:
`--paper` (lacquer black ground), `--paper-2` (lifted black), `--ink` (warm off-white text),
`--red` (crimson plates), `--red-lite` (red for small text on black), `--gold` (accents),
`--ivory` (text on red plates; also the inverted footer/marquee strips).

Fonts via Google Fonts: Bodoni Moda (display serif + its italic for emphasis) and Archivo (body).
No script/cursive faces anywhere. Deliberately single-theme (no light/dark variants).
Spacing scale is deliberately tight (sections ~34–60px) — keep new sections on it.

## Motion conventions

- `.split` = word-mask headline reveal (JS wraps words in spans)
- `.rv` (+ `.rv-d1..d3`) = scroll fade-up reveal; `.clip` = clip-path reveal
- Preloader plays once per tab (sessionStorage `tgsmun-seen`); curtain transition between pages
- Countdown date: `CONFERENCE_DATE` at the top of `main.js`
- Pinned horizontal committees track on the homepage (`.hpin`): scroll sets a target, rAF eases toward it (smooth at any speed); falls back to scroll-snap under 860px
- The marquee is a constant CSS animation and must NOT be coupled to scroll velocity
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
AIPPM/NBA ROP primers + 6-question scenario quizzes on `rop.html` are Secretariat drafts — have the EB verify them.
Committee crests: `logo` is null for all 14, so styled acronym badges render — drop real files in `assets/img/committees/`.
