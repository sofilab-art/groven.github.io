/* ═══════════════════════════════════════════════
   GROVEN · MAIN.JS
   ═══════════════════════════════════════════════ */

'use strict';

// ── NAV SCROLL STATE ──────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── MOBILE NAV TOGGLE ─────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
});
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navToggle.classList.remove('open');
    navLinks.classList.remove('mobile-open');
  }
});

// ── SCROLL REVEAL ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 80, 400);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── HERO CANVAS — ANIMATED NODE GRAPH ────────────────────────────
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const C = {
    node:   '#74C69D',
    edge:   '#2D6A4F',
    nodeAlt: '#40916C',
  };

  let W, H, nodes, edges, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    init();
  }

  function init() {
    const count = Math.min(Math.floor((W * H) / 18000), 55);
    nodes = [];

    // Create a tree-like structure starting from a root
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        opacity: Math.random() * 0.5 + 0.25,
        type: i < 3 ? 'seed' : (i < 15 ? 'branch' : 'leaf'),
      });
    }

    // Connect nodes to nearby parents to simulate tree
    edges = [];
    for (let i = 1; i < nodes.length; i++) {
      // Connect to a random ancestor node
      const parentIdx = Math.floor(Math.random() * Math.min(i, 5));
      edges.push({ a: i, b: parentIdx });
    }
  }

  let raf;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw edges
    ctx.lineWidth = 0.6;
    edges.forEach(e => {
      const a = nodes[e.a], b = nodes[e.b];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > W * 0.45) return;
      const alpha = Math.max(0, 0.18 - dist / (W * 2.5));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(45,106,79,${alpha})`;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      const col = n.type === 'seed' ? C.node : (n.type === 'branch' ? C.nodeAlt : C.edge);
      ctx.fillStyle = col + Math.floor(n.opacity * 255).toString(16).padStart(2, '0');
      ctx.fill();

      // Seed nodes get a subtle glow ring
      if (n.type === 'seed') {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(116,198,157,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Move
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    });

    raf = requestAnimationFrame(draw);
  }

  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  });
  resizeObserver.observe(canvas.parentElement);

  resize();
  draw();
})();

// ── CLOSING CANVAS — same effect, lighter ────────────────────────
(function initClosingCanvas() {
  const canvas = document.getElementById('closing-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes, dpr, raf;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      op: Math.random() * 0.3 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach((n, i) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(116,198,157,${n.op})`;
      ctx.fill();
      if (i > 0) {
        const prev = nodes[i - 1];
        const d = Math.hypot(n.x - prev.x, n.y - prev.y);
        if (d < W * 0.3) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y); ctx.lineTo(prev.x, prev.y);
          ctx.strokeStyle = `rgba(45,106,79,${0.12 - d / (W * 2.5)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    raf = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); resize(); draw(); });
  ro.observe(canvas.parentElement);
  resize(); draw();
})();

// ── SMOOTH ACTIVE NAV HIGHLIGHTING ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--mint)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
