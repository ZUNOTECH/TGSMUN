# TGSMUN — Conference Website

**Live:** https://tgsmun.startupsling.com/

Static website for the TGS Model United Nations conference. No build step, no dependencies — plain HTML/CSS/JS that deploys anywhere (GitHub Pages, Cloudflare Pages, Netlify).

**Design:** international-style diplomatic editorial in the event's colours — lacquer-black ground, crimson plates, gold accents, ivory contrast strips, condensed display type (Anton / Archivo / Instrument Serif via Google Fonts). All colours live as CSS variables at the top of `assets/css/style.css` (`--paper`, `--red`, `--gold`, `--ivory`…) for easy tuning.

**Motion:** preloader sequence (first visit per tab), cobalt curtain page transitions, inertia smooth-scrolling, split-text word reveals, canvas globe with animated connection arcs, pinned horizontal-scroll committees track, rolling odometer countdown, magnetic buttons, custom cursor, marquee, scroll-triggered reveals. All hand-rolled vanilla JS — no libraries. `prefers-reduced-motion` disables everything gracefully.

## Pages

| Page | Contents |
|---|---|
| `index.html` | Hero + globe + countdown + marquee, stats band, about + SG letter plate, pinned horizontal committees track, schedule, FAQs, CTA, contact, footer |
| `committees.html` | All 7 committees — agendas, difficulty tags, delegation sizes, guide slots |
| `secretariat.html` | Executive board + heads of department |
| `register.html` | Fees, four-step process, form embed slot, cancellation policy |
| `gallery.html` | Photo grid (placeholder plates ready for real images) + past-session index |

## Things to customize (placeholders)

1. **Conference date** — `CONFERENCE_DATE` at the top of `assets/js/main.js` (drives the countdown); also the dates written in `index.html` / `register.html`.
2. **School name** — the site says "TGS" throughout; search-and-replace with the full school name.
3. **Secretariat** — replace `Name Here` entries in `secretariat.html`.
4. **Registration form** — embed your Google Form in the marked block in `register.html`, or point the Register buttons at the form URL.
5. **Contact details** — email/phone/venue in `index.html` and footers.
6. **Social links** — Instagram/LinkedIn placeholders in every footer.
7. **Gallery photos** — swap each `<div class="fill ph-N">` in `gallery.html` for `<img class="fill" src="...">`.
8. **Committees, fees, stats, past-session themes** — plain HTML edits in the respective pages.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to GitHub Pages

Repo Settings → Pages → Deploy from branch → default branch, root folder.
