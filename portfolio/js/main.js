/* =========================================
   CHARLES TAYLOR PORTFOLIO — main.js
   ========================================= */

/* ── Custom Cursor ───────────────────────── */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverTargets = 'a, button, .project-card, .deliverable-item, .linkedin-link-card, .nav-cta, .try-widget-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));
})();

/* ── Nav scroll behavior ─────────────────── */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile menu ─────────────────────────── */
(function initMobileMenu() {
  const btn  = document.querySelector('.nav-menu-btn');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    btn.querySelectorAll('span').forEach((s, i) => {
      if (open) {
        if (i === 0) { s.style.transform = 'rotate(45deg) translate(5px, 5px)'; }
        if (i === 1) { s.style.opacity = '0'; s.style.transform = 'scaleX(0)'; }
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      menu.classList.remove('open');
      document.body.style.overflow = '';
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

/* ── Scroll Reveal (Intersection Observer) ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── Active nav link on scroll ───────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

/* ── Try It Out Widget (US Open page) ───── */
(function initTryWidget() {
  const widget = document.querySelector('.try-widget');
  if (!widget) return;

  let hideTimer;
  const show = () => {
    widget.classList.add('visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => widget.classList.remove('visible'), 2500);
  };

  window.addEventListener('scroll',    show, { passive: true });
  window.addEventListener('mousemove', show, { passive: true });
  window.addEventListener('touchstart', show, { passive: true });

  const btn = widget.querySelector('.try-widget-btn');
  if (btn) {
    btn.addEventListener('click', () => window.open('https://3d.usopen.org/?matchId=1701', '_blank'));
  }
})();

/* ── Smooth page transition ──────────────── */
(function initPageTransition() {
  // Add class to body on load
  document.body.classList.add('page-loaded');

  // Transition out on internal link click
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => window.location.href = href, 300);
    });
  });
})();

/* ── Video autoplay on scroll ────────────── */
(function initVideoAutoplay() {
  const videos = document.querySelectorAll('video[data-autoplay]');
  if (!videos.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.play().catch(() => {});
      else e.target.pause();
    });
  }, { threshold: 0.4 });

  videos.forEach(v => observer.observe(v));
})();

/* ── Stagger children on reveal ─────────── */
(function initStaggerReveal() {
  const parents = document.querySelectorAll('[data-stagger]');
  parents.forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // Then trigger intersection observer (already set up above)
})();

/* ── Count-up animation ──────────────────── */
(function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 2500;
      const startTime = performance.now();

      function update(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
})();

/* Entry animation */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.4s ease';
});
