/**
 * Page Transition System — Smoke & Card Drift
 * Sajith Rahman Portfolio
 */
(function () {
  'use strict';

  /* ---------- Build Overlay DOM ---------- */
  const overlay = document.createElement('div');
  overlay.id = 'pts-overlay';
  overlay.innerHTML = `
    <canvas id="pts-canvas"></canvas>
    <div class="pts-cards">
      <div class="pts-card card-1"></div>
      <div class="pts-card card-2"></div>
      <div class="pts-card card-3"></div>
      <div class="pts-card card-4"></div>
      <div class="pts-card card-5"></div>
    </div>
    <div class="pts-logo">
      <div class="pts-logo-inner">SR</div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ---------- Canvas Smoke ---------- */
  const canvas = document.getElementById('pts-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let running = false;
  let rafId = null;
  let spawnInterval = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class SmokeParticle {
    constructor() {
      this.reset();
    }
    reset() {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight + 20;
      this.x = cx + (Math.random() - 0.5) * 300;
      this.y = cy;
      this.vx = (Math.random() - 0.5) * 2.5;
      this.vy = -(Math.random() * 5 + 3);
      this.radius = Math.random() * 60 + 30;
      this.alpha = Math.random() * 0.22 + 0.06;
      this.decay = Math.random() * 0.006 + 0.002;
      this.hue = Math.random() > 0.55 ? 248 : 195;
      this.sat = Math.random() * 30 + 60;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.radius += 1.2;
      this.alpha -= this.decay;
      this.vx *= 0.99;
      this.vy *= 0.99;
    }
    draw() {
      if (this.alpha <= 0) return;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      g.addColorStop(0, `hsla(${this.hue},${this.sat}%,65%,${this.alpha})`);
      g.addColorStop(0.6, `hsla(${this.hue},${this.sat}%,50%,${this.alpha * 0.4})`);
      g.addColorStop(1, `hsla(${this.hue},${this.sat}%,50%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function spawnParticles() {
    for (let i = 0; i < 4; i++) particles.push(new SmokeParticle());
  }

  function renderSmoke() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    if (running) rafId = requestAnimationFrame(renderSmoke);
  }

  /* ---------- Trigger Transition ---------- */
  function trigger(href) {
    if (overlay.classList.contains('pts-active')) return;
    running = true;
    particles = [];
    overlay.classList.add('pts-active');
    spawnInterval = setInterval(spawnParticles, 16);
    renderSmoke();

    // Navigate after reveal animation
    setTimeout(() => {
      clearInterval(spawnInterval);
      window.location.href = href;
    }, 720);
  }

  /* ---------- Intercept Nav Clicks ---------- */
  function attachLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('http') &&
        !href.startsWith('mailto') &&
        !href.startsWith('tel') &&
        !link.dataset.ptsAttached &&
        (href.endsWith('.html') || href === './' || href === '/')
      ) {
        link.dataset.ptsAttached = '1';
        link.addEventListener('click', e => {
          e.preventDefault();
          trigger(href);
        });
      }
    });
  }

  /* ---------- Page Enter Animation ---------- */
  function pageEnter() {
    document.body.classList.add('pts-enter');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('pts-entered');
      });
    });
  }

  /* ---------- Init ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { attachLinks(); pageEnter(); });
  } else {
    attachLinks();
    pageEnter();
  }

})();
