/* ==========================================================================
   TGSMUN — motion engine
   preloader · curtain transitions · inertia scroll · split-text reveals
   parallax · canvas globe · odometer countdown · pinned horizontal track
   ========================================================================== */

// ---- conference date (edit here) ----
const CONFERENCE_DATE = new Date("2026-10-10T08:00:00+05:30");

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
  if (curtain && !reduced) {
    curtain.classList.add("leave");
    setTimeout(pageIn, 150);
    setTimeout(() => curtain.classList.remove("leave"), 800);
  } else {
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
function navUpdate() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 40);
  nav.classList.toggle("hidden", y > 300 && y > lastY && !document.querySelector(".menu-overlay.open"));
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

/* ============ hero canvas globe ============ */
const canvas = document.querySelector(".hero-canvas");
if (canvas && canvas.getContext && !reduced) {
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(2, devicePixelRatio || 1);
  let W, H;
  const fit = () => {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  fit();
  addEventListener("resize", fit);

  // fibonacci sphere points
  const N = 520;
  const pts = [];
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = GA * i;
    pts.push([Math.cos(th) * rad, y, Math.sin(th) * rad]);
  }
  // arcs between random point pairs
  const arcs = Array.from({ length: 7 }, (_, i) => ({
    a: pts[(i * 73) % N], b: pts[(i * 191 + 37) % N], t: i / 7,
  }));

  const ink = "18,22,31";
  const cobalt = "30,63,174";
  const verm = "217,58,23";
  let rot = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const R = Math.min(W, H) * 0.42;
    const cx = W / 2, cy = H / 2;
    rot += 0.0016;

    const proj = ([x, y, z]) => {
      const xr = x * Math.cos(rot) + z * Math.sin(rot);
      const zr = -x * Math.sin(rot) + z * Math.cos(rot);
      return [cx + xr * R, cy + y * R * 0.98, zr];
    };

    // dots
    pts.forEach((p) => {
      const [sx, sy, z] = proj(p);
      const a = 0.08 + ((z + 1) / 2) * 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.1 + ((z + 1) / 2) * 0.9, 0, 7);
      ctx.fillStyle = `rgba(${ink},${a.toFixed(3)})`;
      ctx.fill();
    });

    // outline ring
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 7);
    ctx.strokeStyle = `rgba(${ink},0.25)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // animated great arcs with traveling pulse
    arcs.forEach((arc) => {
      arc.t = (arc.t + 0.0022) % 1;
      const steps = 40;
      ctx.beginPath();
      let pulse = null;
      for (let i = 0; i <= steps; i++) {
        const f = i / steps;
        // slerp-ish midpoint lift
        const m = [
          arc.a[0] + (arc.b[0] - arc.a[0]) * f,
          arc.a[1] + (arc.b[1] - arc.a[1]) * f,
          arc.a[2] + (arc.b[2] - arc.a[2]) * f,
        ];
        const len = Math.hypot(...m) || 1;
        const lift = 1 + Math.sin(f * Math.PI) * 0.18;
        const p = m.map((v) => (v / len) * lift);
        const [sx, sy, z] = proj(p);
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        if (Math.abs(f - arc.t) < 1 / steps) pulse = [sx, sy, z];
      }
      ctx.strokeStyle = `rgba(${cobalt},0.35)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      if (pulse) {
        ctx.beginPath();
        ctx.arc(pulse[0], pulse[1], 2.6, 0, 7);
        ctx.fillStyle = `rgba(${verm},${(0.35 + ((pulse[2] + 1) / 2) * 0.65).toFixed(3)})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}
