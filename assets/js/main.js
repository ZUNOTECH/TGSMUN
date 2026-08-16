/* ==========================================================================
   TGSMUN — motion engine (anime.js v4)

   One shared scroll pipeline (single passive listener → rAF batch) feeds every
   scroll-linked effect, so adding sections never adds listeners.

   Contents:
     0  env + shared scroll ticker
     1  preloader / curtain page transitions
     2  custom cursor · nav · mobile menu
     3  split-text + reveal observers
     4  stat counters (scroll-triggered, staggered)
     5  odometer countdown
     6  statement scrub
     7  pinned committees strip (smoothed scrub, rendered from committee data)
     8  FAQ
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
const seen = sessionStorage.getItem("tgsmun-seen");

function pageIn() {
  document.documentElement.classList.add("ready");
  document.querySelectorAll(".hero .split, .page-hero .split, .land .split").forEach((el) => el.classList.add("in"));
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
  if (curtain && !reduced) {
    curtain.classList.add("leave");
    setTimeout(pageIn, 140);
    setTimeout(() => curtain.classList.remove("leave"), 780);
  } else {
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
  document.querySelectorAll("a, button, .com-card, .sec-card, .dir-row").forEach(hot);
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
document.querySelectorAll(".rv, .clip, .sec-head, .split:not(.hero .split):not(.page-hero .split):not(.land .split)")
  .forEach((el) => io.observe(el));

/* ============ 4. stat counters — scroll-triggered, staggered ============ */
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

/* ============ 5. odometer countdown ============ */
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

/* ============ 5b. landing — single element, 3D scroll hand-off ============
   The whole landing is one mark. Scrolling tips it back in perspective and
   pushes it away from the camera, so the next section arrives *through* it
   rather than under it. Everything is driven off the shared scroll ticker. */
(function () {
  const land = document.getElementById("land");
  const mark = document.getElementById("land-mark");
  if (!land || !mark) return;
  const hint = document.getElementById("land-hint");
  if (reduced) return;

  addScrollTask(() => {
    const total = land.offsetHeight - innerHeight;
    if (total <= 0) return;
    const p = Math.max(0, Math.min(1, -land.getBoundingClientRect().top / total));
    // ease the tail so the mark lingers a beat before it goes
    const e = p * p * (3 - 2 * p);
    const rotX = e * -62;          // tips away from the viewer
    const z = e * -560;            // recedes into the stage
    const y = e * -12;             // drifts up as it goes
    const blur = e * 6;
    mark.style.transform = `translateY(${y}vh) translateZ(${z}px) rotateX(${rotX}deg)`;
    mark.style.opacity = String(Math.max(0, 1 - Math.max(0, e - 0.6) / 0.4));
    mark.style.filter = blur > 0.4 ? `blur(${blur.toFixed(2)}px)` : "none";
    if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 4));
  });
})();

/* ============ 6. statement scrub (word-by-word fill) ============ */
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

/* ============ 7. pinned committees strip — smoothed scroll scrub ============
   Previously the transform was written straight from raw scroll position, which
   made fast flicks jump. Now scroll sets a *target* and a rAF loop eases toward
   it, so the strip stays smooth at any scroll speed. */
const hpin = document.querySelector(".hpin");
if (hpin) {
  const track = hpin.querySelector(".hpin-track");

  // cards come from assets/js/committees.js so the strip always shows every
  // committee — senior and junior — and can never drift from the data
  const comData = window.TGSMUN_COMMITTEES;
  if (track && comData && !track.children.length) {
    track.innerHTML = comData.map((c, i) => `
      <a class="com-card" href="committees.html#${c.id}">
        <span class="no">C·${String(i + 1).padStart(2, "0")}</span>
        <span class="abbr">${c.abbr}</span>
        <span class="full">${c.name}</span>
        <p class="agenda">${c.agenda}</p>
        <span class="foot"><span>${c.wing === "junior" ? "Junior Wing" : c.tags[0] || "Senior Wing"}</span><span class="arr">→</span></span>
      </a>`).join("");
    if (window.tgsmunCursorHot) track.querySelectorAll(".com-card").forEach(window.tgsmunCursorHot);
  }
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

/* ============ 8. FAQ ============ */
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
