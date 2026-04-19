/* ============================================================
   DevStash Homepage — script.js
   ============================================================ */

// ─── Footer year ────────────────────────────────────────────
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ─── Navbar scroll opacity ──────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── Mobile menu toggle ──────────────────────────────────────
(function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu   = document.getElementById('mobileMenu');
  const navbar = document.getElementById('navbar');

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    navbar.classList.toggle('menu-open', open);
    navbar.classList.toggle('scrolled', open);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      navbar.classList.remove('menu-open');
    });
  });
})();

// ─── Scroll fade-in (IntersectionObserver) ──────────────────
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

// ─── Chaos icon animation ────────────────────────────────────
(function initChaos() {
  const stage = document.getElementById('chaosStage');
  if (!stage) return;

  const icons = Array.from(stage.querySelectorAll('.chaos-icon'));
  const stageW = () => stage.clientWidth;
  const stageH = () => stage.clientHeight;

  // Each icon: { el, x, y, vx, vy, rot, rotV, scale, scaleDir, w, h }
  const particles = icons.map((el) => {
    const rect = el.getBoundingClientRect();
    const w = rect.width  || 50;
    const h = rect.height || 50;

    const speed = 0.4 + Math.random() * 0.5;
    const angle = Math.random() * Math.PI * 2;

    return {
      el,
      x: Math.random() * (stageW() - w),
      y: Math.random() * (stageH() - h),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 0.3,
      scale: 1,
      scalePhase: Math.random() * Math.PI * 2,
      w,
      h,
    };
  });

  // Mouse position relative to stage
  let mouseX = -9999;
  let mouseY = -9999;
  const REPEL_RADIUS = 90;
  const REPEL_FORCE  = 2.5;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  stage.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  let t = 0;
  function tick() {
    t += 0.016;
    const sw = stageW();
    const sh = stageH();

    particles.forEach((p) => {
      // Scale pulse
      p.scalePhase += 0.012;
      p.scale = 0.88 + Math.sin(p.scalePhase) * 0.12;

      // Rotation drift
      p.rot += p.rotV;

      // Mouse repulsion
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h / 2;
      const dx = cx - mouseX;
      const dy = cy - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Dampen velocity to a reasonable max
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const maxSpeed = 2.2;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      // Apply velocity
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
      if (p.x + p.w > sw) { p.x = sw - p.w; p.vx = -Math.abs(p.vx); }
      if (p.y + p.h > sh) { p.y = sh - p.h; p.vy = -Math.abs(p.vy); }

      // Gently restore to natural speed when far from mouse
      const naturalSpeed = 0.45;
      if (dist > REPEL_RADIUS) {
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > naturalSpeed) {
          p.vx *= 0.985;
          p.vy *= 0.985;
        } else if (currentSpeed < 0.1) {
          // Nudge if nearly stopped
          const a = Math.random() * Math.PI * 2;
          p.vx += Math.cos(a) * 0.1;
          p.vy += Math.sin(a) * 0.1;
        }
      }

      // Apply transform
      p.el.style.transform =
        `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`;
    });

    requestAnimationFrame(tick);
  }

  // Wait one frame for layout to settle, then start
  requestAnimationFrame(() => {
    // Re-measure icon sizes now that they're in the DOM
    particles.forEach(p => {
      const rect = p.el.getBoundingClientRect();
      p.w = rect.width  || 50;
      p.h = rect.height || 50;
      // Clamp initial position with measured size
      p.x = Math.min(p.x, stageW() - p.w);
      p.y = Math.min(p.y, stageH() - p.h);
    });
    tick();
  });
})();

// ─── Pricing toggle ─────────────────────────────────────────
(function initPricing() {
  const btn        = document.getElementById('billingToggle');
  const proPrice   = document.getElementById('proPrice');
  const proPeriod  = document.getElementById('proPeriod');
  const priceNote  = document.getElementById('priceNote');
  const monthLabel = document.getElementById('monthlyLabel');
  const yearLabel  = document.getElementById('yearlyLabel');

  let yearly = false;

  btn.addEventListener('click', () => {
    yearly = !yearly;
    btn.classList.toggle('on', yearly);
    btn.setAttribute('aria-checked', String(yearly));

    if (yearly) {
      proPrice.textContent  = '$6';
      proPeriod.textContent = '/month';
      priceNote.textContent = 'Billed $72/year — save 25%';
      priceNote.style.opacity = '1';
      monthLabel.classList.remove('active');
      yearLabel.classList.add('active');
    } else {
      proPrice.textContent  = '$8';
      proPeriod.textContent = '/month';
      priceNote.textContent = '';
      priceNote.style.opacity = '0';
      monthLabel.classList.add('active');
      yearLabel.classList.remove('active');
    }
  });
})();
