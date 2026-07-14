/* ============================================================
   JENIS LATHIYA PORTFOLIO — JavaScript
   Version: 2.0 | Premium Interactions
   ============================================================ */

'use strict';

/* ===== UTILITIES ===== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/* ===== PRELOADER ===== */
(function initPreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      // Init animations after preloader
      initScrollAnimations();
    }, 400);
  });
  document.body.style.overflow = 'hidden';
})();

/* ===== CUSTOM CURSOR ===== */
(function initCursor() {
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let animFrame;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    // Mouse light
    const ml = $('.mouse-light');
    if (ml) { ml.style.left = mouseX + 'px'; ml.style.top = mouseY + 'px'; }
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    animFrame = requestAnimationFrame(animateRing);
  })();

  // Expand on interactive elements
  const interactives = $$('a, button, .project-card, .service-card, .skill-card, .bento-item');
  interactives.forEach(el => {
    on(el, 'mouseenter', () => ring.classList.add('expand'));
    on(el, 'mouseleave', () => ring.classList.remove('expand'));
  });
})();

/* ===== SCROLL PROGRESS ===== */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }, { passive: true });
})();

/* ===== NAVBAR ===== */
(function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;
  let lastScroll = 0;
  let scrollTimer;
  const THRESHOLD = 120;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current <= THRESHOLD) {
      nav.classList.remove('hidden');
    } else if (current > lastScroll && current > THRESHOLD) {
      nav.classList.add('hidden');
    } else if (current < lastScroll) {
      nav.classList.remove('hidden');
    }
    lastScroll = current;
    updateActiveNav(current);
  }, { passive: true });

  function updateActiveNav(scrollY) {
    const sections = $$('section[id], div[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (scrollY >= top) current = sec.id;
    });
    $$('.nav-links a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }

  // Smooth scroll on nav links
  $$('.nav-links a, .mobile-menu a').forEach(a => {
    on(a, 'click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = $(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // Close mobile menu
        closeMobileMenu();
      }
    });
  });
})();

/* ===== MOBILE MENU ===== */
let mobileMenuOpen = false;
function openMobileMenu() {
  const menu = $('.mobile-menu');
  const btn = $('.nav-hamburger');
  if (!menu || !btn) return;
  menu.classList.add('open');
  btn.classList.add('open');
  document.body.style.overflow = 'hidden';
  mobileMenuOpen = true;
}
function closeMobileMenu() {
  const menu = $('.mobile-menu');
  const btn = $('.nav-hamburger');
  if (!menu || !btn) return;
  menu.classList.remove('open');
  btn.classList.remove('open');
  document.body.style.overflow = '';
  mobileMenuOpen = false;
}
(function initMobileMenu() {
  const hamburger = $('.nav-hamburger');
  const closeBtn = $('.mobile-menu-close');
  on(hamburger, 'click', () => mobileMenuOpen ? closeMobileMenu() : openMobileMenu());
  on(closeBtn, 'click', closeMobileMenu);
})();

/* ===== TYPING EFFECT ===== */
(function initTyped() {
  const el = $('.typed-text');
  if (!el) return;
  const roles = ['Shopify Developer', 'Frontend Developer', 'WordPress Developer', 'UI Developer'];
  let roleIdx = 0, charIdx = 0, isDeleting = false;
  const TYPING_SPEED = 90, DELETING_SPEED = 50, PAUSE = 2000;

  function type() {
    const currentRole = roles[roleIdx];
    if (!isDeleting) {
      el.textContent = currentRole.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentRole.length) {
        isDeleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = currentRole.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }
  setTimeout(type, 800);
})();

/* ===== PARTICLE BACKGROUND ===== */
(function initParticles() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  const PARTICLE_COUNT = Math.min(80, Math.floor((W * H) / 15000));

  canvas.width = W;
  canvas.height = H;

  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.4 + 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.01,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;
      const a = p.alpha + Math.sin(p.pulse) * 0.15;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,191,255,${clamp(a, 0, 0.6)})`;
      ctx.fill();
    });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,191,255,${(1 - dist / 120) * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();

/* ===== COUNTER ANIMATION ===== */
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      function tick(now) {
        const elapsed = now - start;
        const progress = clamp(elapsed / duration, 0, 1);
        const val = Math.round(easeOut(progress) * target);
        el.textContent = val + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ===== SKILL BAR ANIMATION ===== */
(function initSkillBars() {
  const cards = $$('.skill-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(c => observer.observe(c));
})();

/* ===== SKILL TABS ===== */
(function initSkillTabs() {
  const tabs = $$('.skill-tab-btn');
  const groups = $$('.skills-group');
  tabs.forEach(btn => {
    on(btn, 'click', () => {
      const target = btn.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      groups.forEach(g => g.classList.remove('active'));
      btn.classList.add('active');
      const group = $(`[data-group="${target}"]`);
      if (group) {
        group.classList.add('active');
        // Re-trigger skill bars
        $$('.skill-card', group).forEach(c => {
          c.classList.remove('animate');
          setTimeout(() => c.classList.add('animate'), 50);
        });
      }
    });
  });
})();

/* ===== PROJECT FILTER ===== */
(function initProjectFilter() {
  const filterBtns = $$('.filter-btn');
  const cards = $$('.project-card');
  filterBtns.forEach(btn => {
    on(btn, 'click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cards.forEach(card => {
        const type = card.dataset.type;
        if (filter === 'all' || type === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ===== VANILLA TILT (lightweight) ===== */
(function initTilt() {
  const cards = $$('[data-tilt]');
  cards.forEach(card => {
    let bounds;
    function getBounds() { bounds = card.getBoundingClientRect(); }
    function onMouseMove(e) {
      if (!bounds) getBounds();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const cx = bounds.width / 2, cy = bounds.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    }
    function onMouseLeave() {
      card.style.transform = '';
    }
    on(card, 'mouseenter', getBounds);
    on(card, 'mousemove', onMouseMove);
    on(card, 'mouseleave', onMouseLeave);
  });
})();

/* ===== HERO MOUSE PARALLAX ===== */
(function initHeroParallax() {
  const hero = $('#hero');
  const profileWrap = $('.profile-card-wrap');
  if (!hero || !profileWrap) return;
  if (window.matchMedia('(hover: none)').matches) return;

  on(hero, 'mousemove', (e) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    profileWrap.style.transform = `translate(${x * 12}px, ${y * 8}px)`;
  });
  on(hero, 'mouseleave', () => {
    profileWrap.style.transform = '';
  });
})();

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  // Observe elements with data-aos
  const els = $$('[data-aos]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    const delay = el.dataset.aosDelay || (i % 4) * 80;
    el.style.opacity = '0';
    el.style.transitionDelay = delay + 'ms';
    switch (el.dataset.aos) {
      case 'fade-up':
        el.style.transform = 'translateY(40px)';
        break;
      case 'fade-left':
        el.style.transform = 'translateX(40px)';
        break;
      case 'fade-right':
        el.style.transform = 'translateX(-40px)';
        break;
      case 'fade-down':
        el.style.transform = 'translateY(-40px)';
        break;
      case 'zoom-in':
        el.style.transform = 'scale(0.9)';
        break;
      default:
        el.style.transform = 'translateY(20px)';
    }
    observer.observe(el);
  });
}

/* ===== CONTACT FORM ===== */
(function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  on(form, 'submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1500);
  });
})();

/* ===== BACK TO TOP ===== */
(function initBackToTop() {
  const btn = $('.back-to-top');
  if (!btn) return;
  on(btn, 'click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== MAGNETIC BUTTONS ===== */
(function initMagneticButtons() {
  const btns = $$('.btn-primary, .nav-cta');
  if (window.matchMedia('(hover: none)').matches) return;
  btns.forEach(btn => {
    on(btn, 'mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    on(btn, 'mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ===== NAVBAR SCROLL ANIMATION (initial) ===== */
(function heroReveal() {
  const heroEls = $$('#hero [data-aos]');
  // Hero elements animate immediately on load
  setTimeout(() => {
    heroEls.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, i * 120);
    });
  }, 500);
})();

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  on(a, 'click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});
