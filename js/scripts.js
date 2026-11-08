/**
 * SAJITH RAHMAN — PORTFOLIO CORE SCRIPT
 * Strict adherence to Landing Page Design Rules (Part B)
 * Motion curve: cubic-bezier(0.22, 1, 0.36, 1)
 * Enhanced Scrolling Animations:
 *   - Pinned reading progress indicator
 *   - Dynamic nav bar elevation on scroll
 *   - Staggered card and section reveals
 *   - Mandatory B11 word by word scroll tagline reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initNavigation();
  initHeroEntrance();
  initScrollReveals();
  initTaglineReveal();
  initFormValidation();
});

/**
 * 1. Pinned Reading Progress Bar (Scrolling Animation)
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const percentage = Math.min((scrollTop / scrollHeight) * 100, 100);
      progressBar.style.width = `${percentage}%`;
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * 2.5 Hero Fullscreen Entrance Animation
 * Each element slides and fades in with staggered delays
 * on the cubic-bezier(0.22, 1, 0.36, 1) curve.
 */
function initHeroEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hero-anim-ready').forEach(el => {
      el.classList.add('hero-anim-in');
      el.style.opacity = '1';
    });
    return;
  }

  const portrait   = document.getElementById('heroPortrait');
  const infoPanel  = document.getElementById('heroInfoPanel');
  const headline   = document.getElementById('heroHeadline');
  const cta        = document.getElementById('heroCta');
  const card       = document.getElementById('heroProjectCard');
  const socialRail = document.getElementById('heroSocialRail');

  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // Set initial off-screen state
  if (portrait) {
    portrait.style.transform = 'translateX(-50%) translateY(28px)';
  }
  if (infoPanel) {
    infoPanel.style.transform = 'translateX(-28px)';
  }
  if (headline) {
    headline.style.transform = 'translateY(36px)';
  }
  if (cta) {
    // keep translateX(-50%) and add Y offset
    cta.style.transform = 'translateX(-50%) translateY(20px)';
  }
  if (card) {
    card.style.transform = 'translateX(28px)';
  }
  if (socialRail) {
    socialRail.style.transform = 'translateY(-50%) translateX(20px)';
  }

  // Timeline: { element, delay ms, transform to restore }
  const timeline = [
    { el: portrait,   delay: 80,  transform: 'translateX(-50%) translateY(0)' },
    { el: infoPanel,  delay: 300, transform: 'translateX(0)' },
    { el: headline,   delay: 450, transform: 'translateY(0)' },
    { el: cta,        delay: 620, transform: 'translateX(-50%) translateY(0)' },
    { el: card,       delay: 700, transform: 'translateX(0)' },
    { el: socialRail, delay: 500, transform: 'translateY(-50%) translateX(0)' },
  ];

  timeline.forEach(({ el, delay, transform }) => {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = `opacity 750ms ${ease}, transform 750ms ${ease}`;
      el.style.opacity = '1';
      if (transform) el.style.transform = transform;
      el.classList.add('hero-anim-in');
    }, delay);
  });
}


function initNavigation() {
  const navFloatingBar = document.getElementById('navFloatingBar');
  const menuToggleBtn = document.getElementById('navMenuToggle');
  const mobileNavPanel = document.getElementById('mobileNavPanel');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  // Elevation change on scroll
  if (navFloatingBar) {
    function handleNavScroll() {
      if (window.scrollY > 30) {
        navFloatingBar.classList.add('scrolled');
      } else {
        navFloatingBar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  if (menuToggleBtn && mobileNavPanel) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = mobileNavPanel.classList.toggle('is-open');
      menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen) {
        document.body.style.overflow = 'hidden';
        mobileNavItems.forEach((item, index) => {
          const delay = Math.min(index * 60, 400);
          item.style.transitionDelay = `${delay}ms`;
        });
      } else {
        document.body.style.overflow = '';
        mobileNavItems.forEach(item => {
          item.style.transitionDelay = '0ms';
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavPanel.classList.contains('is-open')) {
        mobileNavPanel.classList.remove('is-open');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * 3. Section & Staggered Scroll Reveals (B7)
 */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-section');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/**
 * 4. Tagline Reveal Section (B11 - Mandatory)
 * Words activate individually from muted (0.3) to 1.0 on scroll
 */
function initTaglineReveal() {
  const taglineEl = document.getElementById('taglineRevealText');
  if (!taglineEl) return;

  const text = taglineEl.innerText.trim();
  const words = text.split(/\s+/);
  taglineEl.innerHTML = words.map(word => `<span class="reveal-word">${word}</span>`).join(' ');

  const wordSpans = taglineEl.querySelectorAll('.reveal-word');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wordSpans.forEach(span => span.classList.add('active'));
    return;
  }

  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = taglineEl.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const start = windowHeight * 0.85;
        const end = windowHeight * 0.25;
        const current = rect.top;

        if (current > start) {
          wordSpans.forEach(span => span.classList.remove('active'));
        } else if (current < end) {
          wordSpans.forEach(span => span.classList.add('active'));
        } else {
          const ratio = (start - current) / (start - end);
          const activeCount = Math.floor(ratio * wordSpans.length);
          wordSpans.forEach((span, i) => {
            if (i <= activeCount) {
              span.classList.add('active');
            } else {
              span.classList.remove('active');
            }
          });
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 5. Client Side Form Validation (B8, B9, B10)
 * Calm, specific system messages
 */
function initFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusBox = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    if (!nameVal) {
      showFormStatus('Please enter your full name.', 'error');
      if (nameInput) nameInput.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      showFormStatus('Please provide a valid corporate or personal email address.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!messageVal || messageVal.length < 15) {
      showFormStatus('Please enter project specifications or inquiry details of at least 15 characters.', 'error');
      if (messageInput) messageInput.focus();
      return;
    }

    showFormStatus('Inquiry submitted successfully. Sajith will review your requirements and respond within one business day.', 'success');
    form.reset();
  });

  function showFormStatus(msg, type) {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.className = `form-status status-${type}`;
  }
}
