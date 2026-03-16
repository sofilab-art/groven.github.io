/* ═══════════════════════════════════════════════
   GROVEN v6 · MAIN.JS
   Grove Hero + Page Interactions
   ═══════════════════════════════════════════════ */

'use strict';

// ── NAV SCROLL STATE ──────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── SCROLL REVEAL ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 80, 400);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ══════════════════════════════════════════════════════════════════
// GROVE HERO
// ══════════════════════════════════════════════════════════════════

(function initGroveHero() {
  var heroSection = document.getElementById('grove-hero');
  if (!heroSection) return;

  // ── DATA ──────────────────────────────────────────────────────
  var PLANTS = [
    {
      id: "p1", layer: "far",
      x: 18, y: 88, baseScale: 0.28,
      stage: "seed",
      type: "Open thought",
      typeColor: "#74C69D",
      fragment: "Do we even need a time limit if we can regulate the model itself?",
      author: "anonymous \u00b7 unlinked",
      context: null
    },
    {
      id: "p2", layer: "far",
      x: 72, y: 90, baseScale: 0.22,
      stage: "seed",
      type: "Open thought",
      typeColor: "#74C69D",
      fragment: "What happens with works that were never cleared for training but were used anyway?",
      author: "anonymous \u00b7 unlinked",
      context: null
    },
    {
      id: "p3", layer: "mid",
      x: 35, y: 92, baseScale: 0.55,
      stage: "seedling",
      type: "Question",
      typeColor: "#3B82F6",
      fragment: "How long does a licence last once granted \u2014 and who decides on renewals?",
      author: "Yuki \u00b7 CORPUS discourse",
      context: "Following up on time-limited licensing. Two related thoughts were merged here."
    },
    {
      id: "p4", layer: "mid",
      x: 78, y: 94, baseScale: 0.48,
      stage: "seedling",
      type: "Claim",
      typeColor: "#40916C",
      fragment: "Equal shares per author sounds fair \u2014 but it rewards quantity over depth.",
      author: "Lena \u00b7 Royalty Pool",
      context: "Contradiction to the seed on equal distribution. The AI classified this as a Contradiction."
    },
    {
      id: "p5", layer: "mid",
      x: 55, y: 91, baseScale: 0.62,
      stage: "shrub",
      type: "Experience",
      typeColor: "#D4A373",
      fragment: "In practice, we have seen that blanket framework agreements completely undermine time-limit clauses.",
      author: "Fatima \u00b7 AI Licences",
      context: "Supplements the contradiction with concrete observation from practice. Table: Should AI training licences be time-limited?"
    },
    {
      id: "p6", layer: "near",
      x: 22, y: 96, baseScale: 1.1,
      stage: "tree",
      type: "Discourse \u00b7 active",
      typeColor: "#74C69D",
      fragment: "Should AI training licences be time-limited?",
      author: "Amara \u00b7 6 contributions \u00b7 4 participants",
      context: "Started as Seed. Grew through Clarification, Contradiction, Extension, Reframing, Synthesis. The Table is open."
    },
    {
      id: "p7", layer: "near",
      x: 62, y: 97, baseScale: 0.85,
      stage: "shrub",
      type: "Discourse \u00b7 active",
      typeColor: "#40916C",
      fragment: "How should the royalty pool be split between authors?",
      author: "Kwame \u00b7 5 contributions \u00b7 4 participants",
      context: "Seed: Equal shares per author. Two contradictions, one reframing. No synthesis yet."
    },
    {
      id: "p8", layer: "near",
      x: 85, y: 95, baseScale: 0.72,
      stage: "shrub",
      type: "Discourse \u00b7 ready",
      typeColor: "#D4A373",
      fragment: "Who gets to sit on the governance jury?",
      author: "Nadia \u00b7 6 contributions \u00b7 ready for decision",
      context: "Sortition with stratification from 100 contributors. Transition rule for Phase 1. Status: Ready \u2014 awaiting vote."
    }
  ];

  var DEPTH_STEPS = 8;
  var currentDepth = 0;
  var lateralOffset = 0;
  var targetDepth = 0;
  var targetLateral = 0;
  var hintHidden = false;
  var lastTouchY = 0, lastTouchX = 0;
  var groveActive = true;
  var plantEls = {};

  // ── DOM REFS ──────────────────────────────────────────────────
  var layerFar  = document.getElementById('layer-far');
  var layerMid  = document.getElementById('layer-mid');
  var layerNear = document.getElementById('layer-near');
  var sky       = document.getElementById('sky');

  // ── LOCK SCROLL ───────────────────────────────────────────────
  document.documentElement.classList.add('grove-locked');

  // ── INIT ──────────────────────────────────────────────────────
  buildStars();
  buildFog();
  buildDepthDots();
  buildPlants();
  bindEvents();
  requestAnimationFrame(loop);

  // ── STARS ─────────────────────────────────────────────────────
  function buildStars() {
    for (var i = 0; i < 60; i++) {
      var s = document.createElement('div');
      s.className = 'star';
      var sz = Math.random() * 1.5 + 0.5;
      s.style.cssText =
        'width:' + sz + 'px;height:' + sz + 'px;' +
        'left:' + (Math.random()*100) + '%;' +
        'top:' + (Math.random()*55) + '%;' +
        'opacity:' + (Math.random()*0.4+0.1) + ';';
      sky.appendChild(s);
    }
  }

  // ── FOG ───────────────────────────────────────────────────────
  function buildFog() {
    var fogs = [
      { bottom: '28%', h: '18%', op: 0.18 },
      { bottom: '18%', h: '22%', op: 0.25 },
      { bottom:  '8%', h: '16%', op: 0.30 }
    ];
    fogs.forEach(function(f) {
      var el = document.createElement('div');
      el.className = 'fog-band';
      el.style.cssText =
        'bottom:' + f.bottom + ';height:' + f.h + ';' +
        'background:radial-gradient(ellipse at 50% 50%,' +
        'rgba(45,106,79,' + f.op + ') 0%,transparent 70%);' +
        'z-index:2;';
      sky.appendChild(el);
    });
  }

  // ── DEPTH DOTS ────────────────────────────────────────────────
  function buildDepthDots() {
    var el = document.getElementById('depth-indicator');
    for (var i = 0; i < DEPTH_STEPS; i++) {
      var d = document.createElement('div');
      d.className = 'depth-dot';
      d.dataset.idx = i;
      el.appendChild(d);
    }
  }

  function updateDepthDots() {
    var idx = Math.round(currentDepth);
    document.querySelectorAll('.depth-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === idx);
    });
  }

  // ── PLANT SVGs ────────────────────────────────────────────────
  function makePlantSVG(stage) {
    var c = '#40916C';
    var c2 = '#2D6A4F';
    var c3 = '#74C69D';

    if (stage === 'seed') {
      return '<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="30" y1="75" x2="30" y2="50" stroke="' + c2 + '" stroke-width="2"/>' +
        '<ellipse cx="30" cy="42" rx="10" ry="14" fill="' + c + '" opacity="0.7"/>' +
        '<ellipse cx="22" cy="52" rx="7" ry="10" fill="' + c2 + '" opacity="0.6" transform="rotate(-30 22 52)"/>' +
        '</svg>';
    }
    if (stage === 'seedling') {
      return '<svg viewBox="0 0 80 120" width="80" height="120" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="40" y1="115" x2="40" y2="65" stroke="' + c2 + '" stroke-width="2.5"/>' +
        '<ellipse cx="40" cy="55" rx="16" ry="22" fill="' + c + '" opacity="0.75"/>' +
        '<ellipse cx="26" cy="72" rx="12" ry="16" fill="' + c2 + '" opacity="0.6" transform="rotate(-35 26 72)"/>' +
        '<ellipse cx="54" cy="70" rx="11" ry="15" fill="' + c + '" opacity="0.55" transform="rotate(30 54 70)"/>' +
        '<ellipse cx="40" cy="40" rx="8" ry="11" fill="' + c3 + '" opacity="0.4"/>' +
        '</svg>';
    }
    if (stage === 'shrub') {
      return '<svg viewBox="0 0 140 180" width="140" height="180" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="70" y1="175" x2="70" y2="110" stroke="' + c2 + '" stroke-width="4"/>' +
        '<line x1="70" y1="140" x2="45" y2="120" stroke="' + c2 + '" stroke-width="2.5"/>' +
        '<line x1="70" y1="130" x2="95" y2="112" stroke="' + c2 + '" stroke-width="2.5"/>' +
        '<ellipse cx="70" cy="88" rx="34" ry="44" fill="' + c + '" opacity="0.7"/>' +
        '<ellipse cx="40" cy="105" rx="26" ry="34" fill="' + c2 + '" opacity="0.65" transform="rotate(-25 40 105)"/>' +
        '<ellipse cx="100" cy="102" rx="24" ry="32" fill="' + c + '" opacity="0.6" transform="rotate(20 100 102)"/>' +
        '<ellipse cx="55" cy="68" rx="20" ry="26" fill="' + c3 + '" opacity="0.35"/>' +
        '<ellipse cx="85" cy="72" rx="18" ry="24" fill="' + c3 + '" opacity="0.3"/>' +
        '</svg>';
    }
    if (stage === 'tree') {
      return '<svg viewBox="0 0 200 280" width="200" height="280" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="85" y="220" width="30" height="60" rx="4" fill="#1a3a1a"/>' +
        '<line x1="100" y1="220" x2="65" y2="175" stroke="' + c2 + '" stroke-width="3"/>' +
        '<line x1="100" y1="200" x2="135" y2="162" stroke="' + c2 + '" stroke-width="3"/>' +
        '<line x1="100" y1="185" x2="60" y2="145" stroke="' + c2 + '" stroke-width="2"/>' +
        '<line x1="100" y1="175" x2="140" y2="138" stroke="' + c2 + '" stroke-width="2"/>' +
        '<ellipse cx="100" cy="115" rx="55" ry="70" fill="' + c + '" opacity="0.72"/>' +
        '<ellipse cx="60" cy="148" rx="40" ry="52" fill="' + c2 + '" opacity="0.6" transform="rotate(-20 60 148)"/>' +
        '<ellipse cx="140" cy="143" rx="38" ry="50" fill="' + c + '" opacity="0.58" transform="rotate(18 140 143)"/>' +
        '<ellipse cx="78" cy="82" rx="32" ry="42" fill="' + c3 + '" opacity="0.32"/>' +
        '<ellipse cx="120" cy="86" rx="30" ry="40" fill="' + c3 + '" opacity="0.28"/>' +
        '<ellipse cx="100" cy="68" rx="28" ry="36" fill="' + c3 + '" opacity="0.22"/>' +
        '</svg>';
    }
    return '';
  }

  // ── BUILD PLANTS ──────────────────────────────────────────────
  function buildPlants() {
    PLANTS.forEach(function(p) {
      var layerEl = p.layer === 'far' ? layerFar :
                    p.layer === 'mid' ? layerMid : layerNear;

      var wrap = document.createElement('div');
      wrap.className = 'plant-wrap';
      wrap.id = p.id;
      wrap.style.cssText = 'left:' + p.x + '%;bottom:' + (100 - p.y) + '%;';

      // SVG
      var svgWrap = document.createElement('div');
      svgWrap.innerHTML = makePlantSVG(p.stage);
      svgWrap.style.cssText =
        'position:relative;display:flex;justify-content:center;' +
        'filter:drop-shadow(0 4px 12px rgba(0,0,0,0.5));';
      wrap.appendChild(svgWrap);

      // Fragment card
      var frag = document.createElement('div');
      frag.className = 'fragment' + (p.context ? ' full' : '');
      var html = '<div class="frag-type" style="color:' + p.typeColor + '">' + p.type + '</div>' +
        '<div class="frag-body">' + p.fragment + '</div>' +
        '<div class="frag-author">' + p.author + '</div>';
      if (p.context) {
        html += '<div class="frag-context">' + p.context + '</div>';
      }
      frag.innerHTML = html;
      wrap.appendChild(frag);

      layerEl.appendChild(wrap);
      plantEls[p.id] = { wrap: wrap, frag: frag, data: p };
    });
  }

  // ── LAYER PARALLAX ────────────────────────────────────────────
  function applyDepth(depth, lateral) {
    var t = depth / DEPTH_STEPS; // 0..1

    // Sky
    sky.style.transform = 'scale(' + (1 + t * 0.08) + ')';

    // Far layer
    var farLat = lateral * 0.3;
    layerFar.style.transform = 'translateX(' + farLat + '%) translateY(' + (t * -8) + '%) scale(' + (1 + t * 0.6) + ')';

    // Mid layer
    var midLat = lateral * 0.7;
    layerMid.style.transform = 'translateX(' + midLat + '%) translateY(' + (t * -18) + '%) scale(' + (1 + t * 1.4) + ')';

    // Near layer
    var nearLat = lateral * 1.2;
    layerNear.style.transform = 'translateX(' + nearLat + '%) translateY(' + (t * -32) + '%) scale(' + (1 + t * 2.8) + ')';

    // Ground
    document.getElementById('ground').style.transform = 'translateY(' + (t * -15) + '%)';

    updateFragments(t);
    updateDepthDots();
  }

  function updateFragments(t) {
    PLANTS.forEach(function(p) {
      var el = plantEls[p.id];
      var frag = el.frag;
      var contextEl = frag.querySelector('.frag-context');

      var showFrag = false;
      var showContext = false;

      if (p.layer === 'far') {
        showFrag = t > 0.55;
        showContext = t > 0.78;
      } else if (p.layer === 'mid') {
        showFrag = t > 0.3;
        showContext = t > 0.55;
      } else {
        showFrag = t > 0.08;
        showContext = t > 0.35;
      }

      frag.classList.toggle('visible', showFrag);
      if (contextEl) contextEl.classList.toggle('visible', showContext);
    });
  }

  // ── ANIMATION LOOP ────────────────────────────────────────────
  function loop() {
    var lerpSpeed = 0.08;
    currentDepth  += (targetDepth  - currentDepth)  * lerpSpeed;
    lateralOffset += (targetLateral - lateralOffset) * lerpSpeed;

    applyDepth(currentDepth, lateralOffset);

    // Hide scroll prompt when deep enough
    document.getElementById('scroll-prompt').classList.toggle('hidden', currentDepth > 1.2);

    // Show lateral hint when mid-deep
    document.getElementById('lateral-hint').classList.toggle('visible',
      currentDepth > 2 && currentDepth < DEPTH_STEPS - 1);

    requestAnimationFrame(loop);
  }

  // ── SCROLL LOCK/UNLOCK ────────────────────────────────────────
  function lockScroll() {
    groveActive = true;
    document.documentElement.classList.add('grove-locked');
  }

  function unlockScroll() {
    groveActive = false;
    document.documentElement.classList.remove('grove-locked');
    window.scrollTo(0, 1); // tiny scroll to ensure page is scrollable
  }

  // Re-enter grove when user scrolls back to top
  window.addEventListener('scroll', function() {
    if (!groveActive && window.scrollY <= 0) {
      lockScroll();
      targetDepth = DEPTH_STEPS;
    }
  }, { passive: true });

  // ── EVENTS ────────────────────────────────────────────────────
  function bindEvents() {
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('keydown', onKey);

    // Hide hint on first interaction
    window.addEventListener('wheel',      hideHint, { once: true });
    window.addEventListener('touchstart', hideHint, { once: true });
    window.addEventListener('keydown',    hideHint, { once: true });
  }

  function hideHint() {
    if (hintHidden) return;
    hintHidden = true;
    document.getElementById('hint').classList.add('hidden');
  }

  function onWheel(e) {
    if (!groveActive) {
      // Check if user scrolled back to top
      if (window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault();
        lockScroll();
        targetDepth = DEPTH_STEPS;
      }
      return;
    }

    e.preventDefault();

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      var newDepth = targetDepth + e.deltaY * 0.012;

      // Exit grove when scrolling past max depth
      if (newDepth >= DEPTH_STEPS && e.deltaY > 0) {
        targetDepth = DEPTH_STEPS;
        unlockScroll();
        return;
      }

      targetDepth = clamp(newDepth, 0, DEPTH_STEPS);
    } else {
      targetLateral = clamp(targetLateral - e.deltaX * 0.03, -25, 25);
    }
  }

  function onTouchStart(e) {
    lastTouchY = e.touches[0].clientY;
    lastTouchX = e.touches[0].clientX;
  }

  function onTouchMove(e) {
    var dy = lastTouchY - e.touches[0].clientY;
    var dx = lastTouchX - e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
    lastTouchX = e.touches[0].clientX;

    if (!groveActive) {
      if (window.scrollY <= 0 && dy < -10) {
        lockScroll();
        targetDepth = DEPTH_STEPS;
      }
      return;
    }

    e.preventDefault();

    if (Math.abs(dy) > Math.abs(dx)) {
      var newDepth = targetDepth + dy * 0.035;

      if (newDepth >= DEPTH_STEPS && dy > 0) {
        targetDepth = DEPTH_STEPS;
        unlockScroll();
        return;
      }

      targetDepth = clamp(newDepth, 0, DEPTH_STEPS);
    } else {
      targetLateral = clamp(targetLateral - dx * 0.08, -25, 25);
    }
  }

  function onKey(e) {
    if (!groveActive) return;

    if (e.key === 'ArrowDown' || e.key === 's') {
      var newDepth = targetDepth + 0.6;
      if (newDepth >= DEPTH_STEPS) {
        targetDepth = DEPTH_STEPS;
        unlockScroll();
        return;
      }
      targetDepth = clamp(newDepth, 0, DEPTH_STEPS);
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
      targetDepth = clamp(targetDepth - 0.6, 0, DEPTH_STEPS);
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      targetLateral = clamp(targetLateral - 5, -25, 25);
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      targetLateral = clamp(targetLateral + 5, -25, 25);
    }
  }

  // ── UTIL ──────────────────────────────────────────────────────
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

})();
