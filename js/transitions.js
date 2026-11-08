/**
 * Page Transition System — Modern Sleek Edition
 */
(function () {
  'use strict';

  /* ---------- Build Overlay DOM ---------- */
  const overlay = document.createElement('div');
  overlay.id = 'pts-overlay';
  overlay.innerHTML = `
    <div class="pts-wipe"></div>
    <div class="pts-logo-container">
      <div class="pts-logo">SR</div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ---------- Trigger Transition ---------- */
  function trigger(href) {
    if (overlay.classList.contains('pts-active')) return;
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    overlay.classList.add('pts-active');

    // Navigate after exit animation
    setTimeout(() => {
      window.location.href = href;
    }, 600);
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
        // Clean up enter classes after animation
        setTimeout(() => {
          document.body.classList.remove('pts-enter', 'pts-entered');
        }, 800);
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

  /* Handle BFCache (Back/Forward Cache) to prevent frozen states */
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.body.style.overflow = '';
      if (overlay) overlay.classList.remove('pts-active');
      document.body.classList.remove('pts-enter', 'pts-entered');
    }
  });

})();
