# Build prompt — TGSMUN-structure conference site, advanced motion

Paste everything below the line into a fresh session (or another agent/tool) to
rebuild the site on the same structure with a much deeper motion layer.

Fill in the two bracketed blanks at the top before sending.

---

Build a **static conference website** — plain HTML, CSS and JavaScript, no
bundler, no framework, no build step. It deploys by serving the folder.
Vercel-ready.

The event: **[EVENT NAME]**, **[dates · venue · edition · delegate count]**.
Treat every fact I have not given you as `TBA` in the copy — never invent
dates, names, fees or agendas.

## 1. Non-negotiable architecture

- Six pages, each a standalone `.html` file: `index.html`, `committees.html`,
  `rop.html`, `whatsapp.html`, `secretariat.html`, `register.html`.
- One shared stylesheet, `assets/css/style.css`. The whole palette and type
  scale live in CSS custom properties at the top of it. No second stylesheet.
- One shared motion engine, `assets/js/main.js`.
- **Vendor the animation library locally** — download it into
  `assets/js/vendor/`. No CDN links anywhere, no network dependency at runtime.
  Use anime.js v4 (`animate`, `createTimeline`, `createDrawable`, `stagger`,
  `onScroll`, `utils`, `eases`) unless you have a concrete reason not to.
- **One scroll pipeline, site-wide.** Exactly one passive `scroll` listener
  feeding a single `requestAnimationFrame` batch, which walks an array of
  registered tasks. Expose `addScrollTask(fn)`; every scroll-linked effect on
  every page registers through it. Adding a section must never add a listener.
  Same rule for `resize`.
- Committee data is a **single source of truth**: `assets/js/committees.js`
  exports one array, and `committees.html`, `whatsapp.html` and the homepage
  strip all render from it. Adding a committee, a guide URL or a chat invite is
  a one-line edit in that file.
- Quiz questions live in their own data file, `assets/js/rop-quiz.js`, keyed by
  committee, with per-option feedback strings. Markup renders from the data.
- Nav, loader, page-transition curtain, mobile menu overlay and footer are
  duplicated per page (no templating layer) — keep them byte-identical and
  state clearly in the project notes that all six need editing together.
- Write a `CLAUDE.md` at the root documenting the architecture, the design
  tokens, the motion conventions, the deploy flow and every remaining
  placeholder.

## 2. Page structure

**`index.html`** — in order:
1. `.land` — the landing is **one element**: the event wordmark on a tall
   sticky stage. See §4.1 for its mechanic.
2. `.land-next` — the band the landing hands off to: dates, venue, delegate
   count, and the two primary CTAs.
3. `#countdown` — a live countdown to the opening gavel, as its own section.
4. A scrubbed statement section — a single sentence that fills in word by word
   as you scroll through it.
5. A stats band — animated counters.
6. `#committees` — a horizontally pinned committee strip (see §4.3).
7. A constant-speed marquee.
8. `#schedule` — the two-day itinerary.
9. `#faq` — accordion, on a full-bleed accent-colour ground.
10. `#contact` — contact strip. Then the footer.

**`committees.html`** — a directory, not a card grid. A numbered index of
committee acronyms grouped by wing, driving **one** sticky detail panel
(agenda, format, resources). No full committee names anywhere on the site.
On narrow screens the panel moves above the list and stays pinned.

**`rop.html`** — two tabbed rules-of-procedure primers, one per special-format
committee. Each panel is a document: lede, a key/value facts table, a
numbered "how a session runs" flow, a glossary, and a clearly reserved slot for
the official rules to be pasted in later. A contents rail beside it is
**generated at runtime from the section headings**, so dropping in new sections
needs no other edit. At the foot of each primer, a button opens the quiz (§3).

**`whatsapp.html`** — one chat-group row per committee, split senior/junior,
rendered from the committee data. Disabled state when an invite URL is null.

**`secretariat.html`** — the secretariat, one card per person.

**`register.html`** — fee tiers, a numbered "how it works" sequence, and a
registration-form slot.

Every page but the homepage opens on a shared `.page-hero`: kicker labels, a
large split-reveal headline, a standfirst, and an oversized watermark numeral
or word bled off the top.

## 3. The quiz room

The quiz is **not** inline on the page. The button opens a full-screen overlay
on the accent colour with nothing in it but one question, a thin progress bar
and an exit control.

- Typeform behaviour: one question on screen at a time, click an option, get
  feedback written for **that specific choice** (not just "the answer was B"),
  then Next.
- Ends on a score screen with a verdict, Retake, and a way back.
- Escape exits.
- **The site nav is parked off-frame while the overlay is open** and slides
  back in when the pointer reaches the top strip; a visible handle doubles as
  the tap target for touch. Achieve this by giving the overlay a z-index
  *below* the nav rather than juggling stacking contexts.

## 4. Motion — this is the point of the build

Go well past fade-up-on-scroll. I want mechanics, not decoration: motion that
tells you where you are in the document and what just changed. Build all of it
on the shared pipeline from §1.

### 4.1 The landing hand-off
The wordmark sits on a sticky stage under CSS `perspective`. Scroll progress
drives `rotateX`, `translateZ` and a slight blur so the mark tips back and
recedes *away from the camera*, and the next section arrives **through** it
rather than sliding up under it. Time the opacity so it reaches zero exactly as
the stage releases — any earlier and you open a dead black gap.

### 4.2 Scroll-driven CSS where the browser supports it
Use native `animation-timeline: view()` and `scroll()` for reveal and progress
effects, feature-detected via `CSS.supports`, with the JS pipeline as the
fallback path. Native scroll-driven animations run off the main thread — prefer
them for anything purely decorative.

### 4.3 Pinned horizontal scrub
The committee strip pins while the page scrolls and translates horizontally.
Scroll sets a *target*; a rAF loop eases the current value toward it
(`current += (target - current) * 0.12`) so fast flicks glide instead of
snapping. Under the mobile breakpoint, fall back to native scroll-snap — do not
try to pin on touch.

### 4.4 Text mechanics
- Word-mask reveals: wrap words in overflow-hidden spans, translate the inner
  span up from below, stagger by index.
- Per-character reveals on the biggest headlines only.
- Line-by-line `clip-path` wipes for pull quotes.
- If you use a variable font, interpolate weight or width against scroll
  velocity on one hero element — once per site, as a signature, not everywhere.

### 4.5 Depth and parallax
Layer sections at different `translateZ` under a shared perspective so
backgrounds drift slower than foregrounds. Keep the total displacement small;
parallax reads as quality at 20px and as cheap at 120px.

### 4.6 Cursor
A custom cursor: a dot that tracks exactly, plus a ring that lags behind with
its own easing. The ring grows and changes state over interactive elements.
Add magnetic pull on primary buttons — the button nudges a few pixels toward
the pointer. Disable the whole thing on coarse pointers.

### 4.7 Layout transitions
Use FLIP (measure first, transform, then release) for any filter, sort or
tab change, so items travel to their new positions instead of popping. Never
animate `width`, `height`, `top` or `left`.

### 4.8 SVG
Draw line art on scroll with `stroke-dasharray`/`stroke-dashoffset`
(anime.js `createDrawable`). Good candidates: a scroll progress indicator, a
section divider that draws itself, an underline that traces on hover.

### 4.9 Page transitions
Use the **View Transitions API** where available for cross-document
transitions, falling back to a coloured curtain that wipes out on click and in
on load. A preloader with a counting percentage plays **once per tab**, gated
on `sessionStorage`.

### 4.10 Counters and countdowns
Digit-roll odometers, not text swaps: each digit column translates vertically
to its new value. Counters trigger on scroll into view and **cascade** — each
stat starts slightly after the last, so four numbers don't tick as one.

### 4.11 State feedback
Every interactive element earns a transition: rows shift and grow a coloured
rule when selected, tabs slide an underline rather than jumping it, accordions
animate real measured heights, correct/incorrect quiz options resolve with
distinct treatments. Motion should confirm that the thing you clicked is the
thing that changed.

### Motion rules — hold these
- **Transform and opacity only** in anything scroll-linked. Never animate a
  property that triggers layout.
- Read all geometry, then write all styles. No interleaved
  `getBoundingClientRect` and style writes inside a frame.
- `will-change` goes on the handful of elements that actually need it, and comes
  off when the animation ends.
- **One thing must NOT be scroll-coupled: the marquee.** Constant CSS animation
  only. Velocity-reactive marquees look broken on trackpads.
- Every effect respects `prefers-reduced-motion: reduce` — collapse to the end
  state, don't just shorten the duration.
- Budget: hold 60fps on a mid-range phone. Test with CPU throttling, not just
  on desktop.

## 5. Design system

- Single theme, committed to — no light/dark variants.
- Define the entire palette as custom properties at the top of the stylesheet:
  a near-black ground, a lifted second surface, warm off-white text at three
  opacities, a hairline rule colour, one saturated accent for plates and one
  lighter cut of it for small text on dark, one metallic accent, and one ivory
  for text sitting on accent plates.
- Two typefaces, maximum: one condensed display face for headlines and numerals
  and one clean sans for body. **If the display face ships in a single weight,
  never set it above 400** or browsers synthesise a fake bold. No script or
  cursive faces. No italics.
- Tight vertical rhythm — sections in the 34–60px range, not the 120px default
  every template ships with. Put the air *inside* components instead.
- Oversized numerals as a recurring device: section indices, watermarks, step
  numbers, committee counts.

## 6. Accessibility and correctness

- Semantic landmarks, real `<button>` for buttons and `<a>` for links, visible
  focus states, correct `aria-selected` / `aria-expanded` / `aria-controls` on
  tabs and accordions, `aria-modal` on the quiz overlay with focus moved in and
  restored on exit.
- Deep links work: `committees.html#unsc` selects that committee,
  `rop.html#rop-nba` opens that tab.
- No horizontal overflow at any width from 320px up. Wide content scrolls
  inside its own container, never the page body.

## 7. Before you tell me it is done

- Drive the real site in a headless browser at 1440px **and** 390px. Click
  through every tab, accordion, filter and the full quiz to the score screen.
- Report the console: zero page errors.
- Screenshot each page at both widths and actually look at them.
- If webfonts cannot load in your environment, say so plainly — you have
  verified layout and behaviour, not typography.
