/* ==========================================================================
   TGSMUN — motion engine (anime.js v4)

   One shared scroll pipeline (single passive listener → rAF batch) feeds every
   scroll-linked effect, so adding sections never adds listeners.

   Contents:
     0  env + shared scroll ticker
     1  preloader / curtain page transitions
     2  custom cursor · nav · mobile menu
     3  split-text + reveal observers
     4  gavel INTRO overlay (timed, not scroll-scrubbed)
     5  stat counters (scroll-triggered, staggered)
     6  odometer countdown
     7  statement scrub
     8  pinned committees strip (smoothed scrub)
     9  FAQ
   The marquee runs on a constant CSS animation and is deliberately NOT
   coupled to scroll velocity — see .marquee-track in style.css.
   ========================================================================== */

/* ---- conference date (edit here) ---- */
const CONFERENCE_DATE = new Date("2026-08-29T08:00:00+05:30");

/* ============ 0. environment + shared scroll ticker ============ */
const A = window.anime || {};
const animate = A.animate;
const createTimeline = A.createTimeline;
const createDrawable = A.createDrawable;
const stagger = A.stagger;
const hasAnime = typeof animate === "function" && typeof createTimeline === "function";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(pointer: coarse)").matches;
const mqMobile = matchMedia("(max-width: 860px)");
const isMobile = () => mqMobile.matches;

const scrollTasks = [];
let ticking = false;
function runScrollTasks() {
  ticking = false;
  const y = window.scrollY;
  for (let i = 0; i < scrollTasks.length; i++) scrollTasks[i](y);
}
addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(runScrollTasks); }
}, { passive: true });
addEventListener("resize", () => requestAnimationFrame(runScrollTasks), { passive: true });
function addScrollTask(fn) { scrollTasks.push(fn); fn(window.scrollY); }

/* ============ 1. preloader + curtain page transitions ============ */
const loader = document.querySelector(".loader");
const curtain = document.querySelector(".curtain");
const introOv = document.querySelector(".intro-ov");
const seen = sessionStorage.getItem("tgsmun-seen");

function pageIn() {
  document.documentElement.classList.add("ready");
  document.querySelectorAll(".hero .split, .page-hero .split").forEach((el) => el.classList.add("in"));
}

if (loader && !seen && !reduced) {
  sessionStorage.setItem("tgsmun-seen", "1");
  const count = loader.querySelector(".loader-count");
  let n = 0;
  const iv = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 16));
    if (count) count.textContent = "Convening — " + String(n).padStart(3, "0") + "%";
    if (n >= 100) {
      clearInterval(iv);
      setTimeout(() => { loader.classList.add("done"); pageIn(); }, 220);
    }
  }, 80);
} else {
  if (loader) loader.remove();
  sessionStorage.setItem("tgsmun-seen", "1");
  // the intro overlay owns the reveal on the homepage; don't double-fire
  const introWillRun = introOv && !reduced && !sessionStorage.getItem("tgsmun-intro");
  if (curtain && !reduced) {
    curtain.classList.add("leave");
    if (!introWillRun) setTimeout(pageIn, 140);
    setTimeout(() => curtain.classList.remove("leave"), 780);
  } else if (!introWillRun) {
    pageIn();
  }
}

if (curtain && !reduced) {
  document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      curtain.classList.add("enter");
      setTimeout(() => (location.href = a.href), 540);
    });
  });
}

/* ============ 2. cursor · nav · mobile menu ============ */
if (!isTouch && !reduced) {
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot"; ring.className = "cursor-ring";
  document.body.append(dot, ring);
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, { passive: true });
  (function follow() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(follow);
  })();
  const hot = (el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hot"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hot"));
  };
  document.querySelectorAll("a, button, .com-card, .sec-card, .ccard").forEach(hot);
  window.tgsmunCursorHot = hot; // for dynamically rendered cards
}

const nav = document.querySelector(".nav");
if (nav) {
  let lastY = 0;
  addScrollTask((y) => {
    nav.classList.toggle("scrolled", y > 30);
    nav.classList.toggle("hidden", y > 260 && y > lastY && !document.querySelector(".menu-overlay.open"));
    lastY = y;
  });
}

const toggle = document.querySelector(".nav-toggle");
const overlay = document.querySelector(".menu-overlay");
if (toggle && overlay) {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    overlay.classList.toggle("open");
    document.body.style.overflow = overlay.classList.contains("open") ? "hidden" : "";
  });
  overlay.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    })
  );
}

/* ============ 3. split text + reveals ============ */
document.querySelectorAll(".split").forEach((el) => {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3 && child.textContent.trim()) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) { frag.append(part); return; }
          const w = document.createElement("span");
          w.className = "w";
          const inner = document.createElement("span");
          inner.textContent = part;
          w.append(inner);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && !child.classList.contains("w")) {
        walk(child);
      }
    });
  };
  walk(el);
  el.querySelectorAll(".w > span").forEach((s, i) => (s.style.transitionDelay = 0.04 * i + "s"));
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
document.querySelectorAll(".rv, .clip, .sec-head, .split:not(.hero .split):not(.page-hero .split)")
  .forEach((el) => io.observe(el));

/* ============ 4. GAVEL INTRO — black → gold draw → bang → timed circle wipe ============
   One-time per tab. Fixed overlay above everything; hidden when done.
   The circle wipe runs on its own clock (>=1000ms) — never scroll-scrubbed. */
if (introOv) {
  const alreadyPlayed = sessionStorage.getItem("tgsmun-intro");
  if (reduced || alreadyPlayed || !hasAnime) {
    introOv.hidden = true;
    pageIn();
  } else {
    sessionStorage.setItem("tgsmun-intro", "1");
    document.body.style.overflow = "hidden"; // no scrolling behind the overlay

    const strokes = introOv.querySelectorAll(".gavel-svg .ln");
    const swing = introOv.querySelector(".g-swing");
    const rings = introOv.querySelectorAll(".shock circle");
    const cap = introOv.querySelector(".intro-cap");
    const wipe = { r: 0 };
    const REST = 12, LIFT = 32, HIT = -22; // deg: +raises the head, -drives it down
    const mob = isMobile();

    // mobile: fewer simultaneous strokes + shorter draw, so mid-range phones stay at 60fps
    const drawDur = mob ? 950 : 1250;
    const stepGap = mob ? 70 : 95;

    if (swing) swing.style.transform = "rotate(" + REST + "deg)";

    const tl = createTimeline({
      defaults: { ease: "outQuad" },
      onComplete: () => {
        introOv.hidden = true;
        document.body.style.overflow = "";
        requestAnimationFrame(runScrollTasks);
      },
    });

    // 1 · draw the gavel from nothing, stroke by stroke
    tl.add(createDrawable(strokes), {
      draw: ["0 0", "0 1"],
      duration: drawDur,
      ease: "inOutQuad",
      delay: stagger(stepGap),
    })
      .add(cap, { opacity: [0, 1], duration: 420 }, "-=500")
      // 2 · wind up
      .add(swing, { rotate: [REST, LIFT], duration: 340, ease: "outQuad" }, "+=120")
      // 3 · BANG
      .add(swing, { rotate: HIT, duration: 190, ease: "inExpo" })
      .call(() => {
        introOv.classList.add("shake");
        setTimeout(() => introOv.classList.remove("shake"), 340);
      })
      // 4 · impact rings
      .add(rings, {
        opacity: [{ to: 0.9, duration: 60 }, { to: 0, duration: 700 }],
        scale: [0.2, 2.5],
        duration: 760,
        ease: "outQuad",
        delay: stagger(110),
      }, "<")
      .add(swing, { rotate: HIT - 5, duration: 240, ease: "outElastic(1, .5)" }, "<")
      .add(cap, { opacity: 0, duration: 320 }, "<")
      // 5 · circular wipe — fixed 1200ms, independent of scroll
      .add(wipe, {
        r: 155,
        duration: 1200,
        ease: "inOutQuad",
        onUpdate: () => introOv.style.setProperty("--holeR", wipe.r.toFixed(2) + "vmax"),
      }, "+=140")
      .call(() => pageIn(), "-=900");
  }
}

/* ============ 5. stat counters — scroll-triggered, staggered ============ */
const statEls = [...document.querySelectorAll("[data-count]")];
if (statEls.length) {
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");
  const sio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      sio.unobserve(el);
      const target = parseInt(el.dataset.count, 10);
      const order = statEls.indexOf(el);
      const delay = order * 130; // cascade rather than four numbers ticking as one
      if (!hasAnime) { el.textContent = fmt(target); return; }
      const proxy = { v: 0 };
      animate(proxy, {
        v: target,
        duration: 1500,
        delay,
        ease: "outExpo",
        onUpdate: () => { el.textContent = fmt(proxy.v); },
        onComplete: () => { el.textContent = fmt(target); },
      });
    });
  }, { threshold: 0.4 });
  statEls.forEach((el) => sio.observe(el));
}

/* ============ 6. odometer countdown ============ */
const cd = document.querySelector(".countdown");
if (cd) {
  const cells = { d: 3, h: 2, m: 2, s: 2 };
  const cols = {};
  Object.entries(cells).forEach(([k, len]) => {
    const wrap = cd.querySelector(`[data-cd="${k}"] .digits`);
    if (!wrap) return;
    cols[k] = [];
    for (let i = 0; i < len; i++) {
      const col = document.createElement("div");
      col.className = "digit-col";
      const stack = document.createElement("div");
      stack.className = "stack";
      for (let n = 0; n <= 9; n++) {
        const d = document.createElement("span");
        d.textContent = n;
        stack.append(d);
      }
      col.append(stack);
      wrap.append(col);
      cols[k].push(stack);
    }
  });
  const set = (k, val) => {
    if (!cols[k]) return;
    const str = String(val).padStart(cols[k].length, "0");
    cols[k].forEach((stack, i) => {
      stack.style.transform = `translateY(-${parseInt(str[i], 10) * 10}%)`;
    });
  };
  const tick = () => {
    const diff = Math.max(0, CONFERENCE_DATE - Date.now());
    set("d", Math.min(999, Math.floor(diff / 864e5)));
    set("h", Math.floor(diff / 36e5) % 24);
    set("m", Math.floor(diff / 6e4) % 60);
    set("s", Math.floor(diff / 1e3) % 60);
  };
  tick();
  setInterval(tick, 1000);
}

/* ============ 7. statement scrub (word-by-word fill) ============ */
document.querySelectorAll("[data-scrub]").forEach((el) => {
  const text = el.querySelector(".statement-text");
  if (!text) return;
  text.innerHTML = text.textContent.trim().split(/\s+/).map((word) => {
    const accent = word.startsWith("*");
    const clean = accent ? word.slice(1) : word;
    return `<span class="sw${accent ? " accent" : ""}">${clean}</span>`;
  }).join(" ");
  const words = [...text.querySelectorAll(".sw")];
  if (reduced) { words.forEach((w) => w.classList.add("lit")); return; }
  const sticky = el.querySelector(".statement-sticky");
  addScrollTask(() => {
    const total = el.offsetHeight - innerHeight;
    if (total <= 0) return;
    const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / total));
    const lit = Math.floor(p * 1.25 * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    if (sticky) sticky.classList.toggle("meta-in", p > 0.55);
  });
});

/* ============ 8. pinned committees strip — smoothed scroll scrub ============
   Previously the transform was written straight from raw scroll position, which
   made fast flicks jump. Now scroll sets a *target* and a rAF loop eases toward
   it, so the strip stays smooth at any scroll speed. */
const hpin = document.querySelector(".hpin");
if (hpin) {
  const track = hpin.querySelector(".hpin-track");
  const bar = hpin.querySelector(".hpin-progress i");
  let targetX = 0, currentX = 0, dist = 0, raf = null;

  const measure = () => {
    if (isMobile()) {
      hpin.style.height = "";
      track.style.transform = "";
      dist = 0;
      return;
    }
    dist = Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft) * 2);
    hpin.style.height = dist + innerHeight * 1.15 + "px";
  };

  const loop = () => {
    const diff = targetX - currentX;
    currentX += diff * 0.14;              // eased catch-up
    if (Math.abs(diff) < 0.3) { currentX = targetX; raf = null; }
    else raf = requestAnimationFrame(loop);
    track.style.transform = `translate3d(${-currentX}px,0,0)`;
  };

  addScrollTask(() => {
    if (isMobile() || dist <= 0) return;
    const total = hpin.offsetHeight - innerHeight;
    const p = Math.max(0, Math.min(1, -hpin.getBoundingClientRect().top / total));
    targetX = p * dist;
    if (bar) bar.style.width = p * 100 + "%";
    if (!raf) raf = requestAnimationFrame(loop);
  });

  measure();
  addEventListener("resize", () => { measure(); requestAnimationFrame(runScrollTasks); }, { passive: true });
  mqMobile.addEventListener("change", measure);
}

/* ============ 9. FAQ ============ */
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  if (!q || !a) return;
  q.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
    q.setAttribute("aria-expanded", open);
  });
});
