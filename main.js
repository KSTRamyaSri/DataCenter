/* ============================================================
   GODAVARI DIGITAL CORRIDOR — Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Progress Bar ──────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  const updateProgress = () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrolled / total) * 100}%`;
  };

  // ── Sticky Nav Scrolled Class ────────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('[data-section]');

  const updateNav = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Active nav highlight
    let currentSection = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentSection = section.getAttribute('data-section');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  };

  // ── Section Reveal (Intersection Observer) ───────────────
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger child cards if present
        const cards = entry.target.querySelectorAll('.adv-card, .energy-card, .sec-card, .circular-card, .pillar');
        cards.forEach((card, idx) => {
          card.style.transitionDelay = `${idx * 0.07}s`;
        });
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.section').forEach(s => revealObs.observe(s));

  // ── Animated Stat Counter ────────────────────────────────
  const animateCounter = (el, target, suffix = '', duration = 2000) => {
    const start    = performance.now();
    const isFloat  = target % 1 !== 0;
    const update   = (now) => {
      const elapsed  = Math.min(now - start, duration);
      const progress = elapsed / duration;
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = isFloat
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      el.textContent = current + suffix;
      if (elapsed < duration) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const target  = parseFloat(el.dataset.count);
        const suffix  = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        statObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => statObs.observe(el));

  // ── Dark Mode Toggle ─────────────────────────────────────
  const darkToggle  = document.getElementById('dark-toggle');
  const darkIcon    = document.getElementById('dark-icon');
  const savedTheme  = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (darkIcon) darkIcon.textContent = '☀️';
  }

  darkToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (darkIcon) darkIcon.textContent = isDark ? '☀️' : '🌙';
  });

  // ── Mobile Navigation ────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-overlay a');

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    document.body.classList.toggle('nav-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  });

  // ── Scroll Listener (throttled) ──────────────────────────
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial calls
  updateProgress();
  updateNav();

  // ── Smooth scroll for all anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Hero stat count-up on load ───────────────────────────
  setTimeout(() => {
    document.querySelectorAll('.hero-stat-value[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix, 1600);
    });
  }, 800);

  // ── Card tilt micro-interaction ──────────────────────────
  document.querySelectorAll('.adv-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  console.log('🌊 Godavari Digital Corridor — Initialized');
});
