/* ==========================================================================
   TGSMUN — motion engine
   preloader · curtain transitions · inertia scroll · split-text reveals
   parallax · canvas globe · odometer countdown · pinned horizontal track
   ========================================================================== */

// ---- conference date (edit here) ----
const CONFERENCE_DATE = new Date("2026-08-29T08:00:00+05:30");

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(pointer: coarse)").matches;

/* ============ preloader (full on first visit, quick curtain after) ============ */
const loader = document.querySelector(".loader");
const curtain = document.querySelector(".curtain");
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
    n = Math.min(100, n + Math.ceil(Math.random() * 14));
    if (count) count.textContent = "Convening — " + String(n).padStart(3, "0") + "%";
    if (n >= 100) {
      clearInterval(iv);
      setTimeout(() => { loader.classList.add("done"); pageIn(); }, 250);
    }
  }, 90);
} else {
  if (loader) loader.remove();
  sessionStorage.setItem("tgsmun-seen", "1");
  const introWaits = document.querySelector(".intro-ov") && !reduced; // opening calls pageIn itself
  if (curtain && !reduced) {
    curtain.classList.add("leave");
    if (!introWaits) setTimeout(pageIn, 150);
    setTimeout(() => curtain.classList.remove("leave"), 800);
  } else if (!introWaits) {
    pageIn();
  }
}

/* ============ curtain page transitions ============ */
if (curtain && !reduced) {
  document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return; // same-page anchor
      e.preventDefault();
      curtain.classList.add("enter");
      setTimeout(() => (location.href = a.href), 560);
    });
  });
}

/* ============ inertia smooth scroll (desktop wheel only) ============ */
if (!reduced && !isTouch) {
  let target = window.scrollY, current = target, raf = null;
  const max = () => document.documentElement.scrollHeight - innerHeight;
  addEventListener("wheel", (e) => {
    if (e.ctrlKey) return; // pinch zoom
    e.preventDefault();
    target = Math.max(0, Math.min(max(), target + e.deltaY));
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: false });
  function loop() {
    current += (target - current) * 0.11;
    if (Math.abs(target - current) < 0.5) { current = target; raf = null; }
    else raf = requestAnimationFrame(loop);
    scrollTo(0, current);
  }
  // resync when scroll happens outside the wheel (keys, anchors, drag)
  addEventListener("scroll", () => { if (!raf) target = current = window.scrollY; });
}

/* ============ custom cursor ============ */
if (!isTouch && !reduced) {
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot"; ring.className = "cursor-ring";
  document.body.append(dot, ring);
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
  (function follow() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(follow);
  })();
  document.querySelectorAll("a, button, .com-card, .sec-card").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hot"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hot"));
  });
}

/* ============ nav: solid + hide on scroll down ============ */
const nav = document.querySelector(".nav");
let lastY = 0;
const introEl = document.querySelector(".opening");
function navUpdate() {
  const y = window.scrollY;
  const floor = (introEl ? introEl.offsetHeight - innerHeight : 0) + 300;
  nav.classList.toggle("scrolled", y > 40);
  nav.classList.toggle("hidden", y > floor && y > lastY && !document.querySelector(".menu-overlay.open"));
  lastY = y;
}
addEventListener("scroll", navUpdate, { passive: true });
navUpdate();

/* mobile overlay menu */
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

/* ============ split-text: wrap words in masks ============ */
document.querySelectorAll(".split").forEach((el) => {
  el.querySelectorAll(":scope .row, :scope").forEach(() => {});
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
  // stagger
  el.querySelectorAll(".w > span").forEach((s, i) => (s.style.transitionDelay = 0.045 * i + "s"));
});

/* ============ scroll-triggered reveals ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".rv, .clip, .split:not(.hero .split):not(.page-hero .split)").forEach((el) => io.observe(el));

/* ============ counters ============ */
const cio = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const t = parseInt(el.dataset.count, 10);
    const start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / 1500);
      el.firstChild.textContent = Math.round(t * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

/* ============ odometer countdown ============ */
const cd = document.querySelector(".countdown");
if (cd) {
  const cells = { d: 3, h: 2, m: 2, s: 2 };
  const cols = {};
  Object.entries(cells).forEach(([k, len]) => {
    const wrap = cd.querySelector(`[data-cd="${k}"] .digits`);
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

/* ============ FAQ ============ */
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  q.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
    q.setAttribute("aria-expanded", open);
  });
});

/* ============ parallax [data-plx="speed"] ============ */
const plx = [...document.querySelectorAll("[data-plx]")];
if (plx.length && !reduced) {
  const apply = () => {
    const vh = innerHeight;
    plx.forEach((el) => {
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translateY(${mid * -parseFloat(el.dataset.plx)}px)`;
    });
  };
  addEventListener("scroll", apply, { passive: true });
  apply();
}

/* ============ pinned horizontal committees track ============ */
const hpin = document.querySelector(".hpin");
if (hpin) {
  const track = hpin.querySelector(".hpin-track");
  const bar = hpin.querySelector(".hpin-progress i");
  const mq = matchMedia("(max-width: 860px)");
  const size = () => {
    if (mq.matches) { hpin.style.height = ""; track.style.transform = ""; return; }
    hpin.style.height = track.scrollWidth - innerWidth + innerHeight * 1.9 + "px";
  };
  const run = () => {
    if (mq.matches) return;
    const r = hpin.getBoundingClientRect();
    const total = hpin.offsetHeight - innerHeight;
    const p = Math.max(0, Math.min(1, -r.top / total));
    const dist = track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft) * 2;
    track.style.transform = `translateX(${-p * dist}px)`;
    if (bar) bar.style.width = p * 100 + "%";
  };
  size();
  addEventListener("resize", size);
  addEventListener("scroll", run, { passive: true });
  run();
}

/* ============ magnetic buttons (desktop) ============ */
if (!isTouch && !reduced) {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });
}

/* ============ scroll-scrub engine (statement section) ============ */
const scrubEls = [...document.querySelectorAll("[data-scrub]")];
scrubEls.forEach((el) => {
  const text = el.querySelector(".statement-text");
  if (!text) return;
  const words = [];
  text.innerHTML = text.textContent.trim().split(/\s+/).map((word) => {
    const accent = word.startsWith("*");
    const clean = accent ? word.slice(1) : word;
    return `<span class="sw${accent ? " accent" : ""}">${clean}</span>`;
  }).join(" ");
  el._words = [...text.querySelectorAll(".sw")];
});
if (scrubEls.length && !reduced) {
  const scrubTick = () => {
    scrubEls.forEach((el) => {
      const total = el.offsetHeight - innerHeight;
      if (total <= 0) return;
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / total));
      if (el._words) {
        const lit = Math.floor(p * 1.25 * el._words.length);
        el._words.forEach((w, i) => w.classList.toggle("lit", i < lit));
      }
      const sticky = el.querySelector(".statement-sticky");
      if (sticky) sticky.classList.toggle("meta-in", p > 0.55);
    });
  };
  addEventListener("scroll", scrubTick, { passive: true });
  scrubTick();
} else {
  // reduced motion: show everything lit
  scrubEls.forEach((el) => el._words && el._words.forEach((w) => w.classList.add("lit")));
}

/* ============ velocity-reactive marquee ============ */
const mTracks = [...document.querySelectorAll(".marquee-track")];
if (mTracks.length && !reduced) {
  let lastScrollY = window.scrollY, vel = 0;
  addEventListener("scroll", () => {
    vel += Math.min(60, Math.abs(window.scrollY - lastScrollY));
    lastScrollY = window.scrollY;
  }, { passive: true });
  (function mLoop() {
    vel *= 0.92;
    const boost = 1 + vel * 0.05;
    const skew = Math.min(6, vel * 0.08);
    mTracks.forEach((t) => {
      t.style.animationDuration = 28 / boost + "s";
      t.style.transform = `skewX(${-skew}deg)`;
    });
    requestAnimationFrame(mLoop);
  })();
}

/* ============ gavel opening: scroll-traced outline -> strike -> wipe ============ */
const opening = document.querySelector(".opening");
const ov = document.querySelector(".intro-ov");
if (opening && ov && !reduced) {
  const seen = sessionStorage.getItem("tgsmun-gavel");
  opening.style.height = seen ? "230vh" : "300vh";
  sessionStorage.setItem("tgsmun-gavel", "1");

  const swing = ov.querySelector(".g-swing");
  const tag = ov.querySelector(".ov-tag");
  const hint = ov.querySelector(".ov-hint");
  // pencil-trace order: grip -> handle -> head -> bands -> puck -> base
  const SEGS = [
    ["t1", 0.00, 0.09], ["t2", 0.06, 0.34], ["t3", 0.30, 0.62],
    ["t4", 0.60, 0.70], ["t5", 0.67, 0.77], ["t6", 0.75, 0.89], ["t8", 0.83, 0.95], ["t7", 0.88, 1.00],
  ].map(([c, a, b]) => [ov.querySelector("." + c), a, b]);

  const TRACE_END = 0.55;   // scroll fraction spent tracing
  const STRIKE_AT = 0.64;
  let struck = false, shown = false, tease = 0;

  const render = (p) => {
    // tracing, scrubbed: each segment draws across its slice of the trace phase
    const tp = Math.min(1, Math.max(p, tease) / TRACE_END);
    SEGS.forEach(([el, a, b]) => {
      const k = Math.min(1, Math.max(0, (tp - a) / (b - a)));
      el.style.strokeDashoffset = 1 - k;
    });
    // anticipation lift between trace end and the strike
    if (!struck) {
      const w = Math.min(1, Math.max(0, (p - TRACE_END) / (STRIKE_AT - TRACE_END)));
      swing.style.transform = `rotate(${w * 7}deg)`;
    }
    if (hint) hint.style.opacity = Math.max(0, 1 - p * 4);
    if (tag) tag.style.opacity = Math.max(0, 1 - Math.max(0, p - 0.5) * 4);

    if (p >= STRIKE_AT && !struck) {
      struck = true;
      ov.classList.add("struck");
      if (!shown) { shown = true; pageIn(); }
    }
    if (p < 0.5 && struck) { struck = false; ov.classList.remove("struck"); }

    // slow circular wipe from the impact point
    const w2 = Math.pow(Math.max(0, (p - 0.7) / 0.3), 1.6);
    ov.style.setProperty("--holeR", (w2 * 145) + "vmax");
    ov.classList.toggle("gone", p >= 0.995);
  };
  const prog = () => Math.max(0, Math.min(1, scrollY / (opening.offsetHeight - innerHeight)));
  addEventListener("scroll", () => render(prog()), { passive: true });
  addEventListener("resize", () => render(prog()));

  // small on-load tease so the page never looks empty: first strokes appear on their own
  const t0 = performance.now();
  (function teaseStep(now) {
    tease = Math.min(0.07, ((now - t0) / 1400) * 0.07);
    render(prog());
    if (tease < 0.07) requestAnimationFrame(teaseStep);
  })(t0);
} else if (ov && reduced) {
  pageIn();
}
