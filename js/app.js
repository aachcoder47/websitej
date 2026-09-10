/**
 * ORBITAL VAULT — Premium Interactive Controller
 * Handles: scroll-spy, market word rotator, menu, modals,
 *          aurora, reveal, orb canvas, stat counters, card tilt
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────────────────────
     1. ROTATING MARKET WORD
  ───────────────────────────────────────────────────────────────────────── */
  const marketWordEl = document.getElementById('hero-market-word');
  const MARKET_WORDS = [
    { text: 'Auto-DCA',            color: '#00D95A' },
    { text: 'Mean Reversion',      color: '#00EFFF' },
    { text: "Shannon's Demon",     color: '#3B82F6' },
    { text: 'Portfolio Rebalance', color: '#A855F7' },
    { text: 'Alpha Harvest',       color: '#FBBF24' },
    { text: '0-Gas Execution',     color: '#00D95A' },
    { text: 'Risk-Adjusted',       color: '#EC4899' },
  ];
  let mIdx = 0;

  if (marketWordEl) {
    setInterval(() => {
      mIdx = (mIdx + 1) % MARKET_WORDS.length;
      const { text, color } = MARKET_WORDS[mIdx];

      marketWordEl.style.opacity  = '0';
      marketWordEl.style.transform = 'translateY(10px)';

      setTimeout(() => {
        marketWordEl.innerHTML = `<span class="market-word-inner" style="color:${color}">${text}</span>`;
        marketWordEl.style.opacity  = '1';
        marketWordEl.style.transform = 'translateY(0)';
      }, 230);
    }, 2800);
  }

  /* ─────────────────────────────────────────────────────────────────────────
     2. SCROLL SPY — active section + side nav + phone screen switcher
  ───────────────────────────────────────────────────────────────────────── */
  const SECTIONS    = ['hero', 'simulator', 'vaults', 'tokenomics', 'infrastructure'];
  const navLinks    = document.querySelectorAll('.scroll-nav__link');
  const phoneScreens = document.querySelectorAll('.phone-rail .phone-screen');

  function getActiveSection() {
    const mid = window.scrollY + window.innerHeight * 0.42;
    let active = SECTIONS[0];
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el && mid >= el.offsetTop) active = id;
    });
    return active;
  }

  function updateScrollSpy() {
    const active = getActiveSection();

    // Side nav
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.dataset.target === active);
    });

    // Phone rail screens
    phoneScreens.forEach(screen => {
      screen.classList.toggle('is-active', screen.id === `screen-${active}`);
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  /* ─────────────────────────────────────────────────────────────────────────
     3. HAMBURGER MENU
  ───────────────────────────────────────────────────────────────────────── */
  const menuBtn      = document.getElementById('menu-btn');
  const menuOverlay  = document.getElementById('menu-overlay');
  const menuBackdrop = document.getElementById('menu-backdrop');

  function openMenu()  {
    menuBtn.classList.add('is-open');
    menuOverlay.classList.add('is-open');
    menuOverlay.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuBtn.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    menuOverlay.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      if (menuOverlay.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
  }

  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('.menu-nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      closeAllModals();
    }
  });

  /* ─────────────────────────────────────────────────────────────────────────
     4. MODALS
  ───────────────────────────────────────────────────────────────────────── */
  const walletModal  = document.getElementById('wallet-modal-overlay');
  const depositModal = document.getElementById('deposit-modal-overlay');

  function openModal(modal)  {
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    closeModal(walletModal);
    closeModal(depositModal);
  }

  // Connect wallet triggers
  document.querySelectorAll('.connect-wallet-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal(walletModal);
    });
  });

  // Deposit triggers
  document.querySelectorAll('.deposit-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal(depositModal);
    });
  });

  // Click outside to close
  [walletModal, depositModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Wallet option click
  document.querySelectorAll('.modal-wallet-btn[data-wallet]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.wallet || 'Robinhood Wallet';
      closeModal(walletModal);
      const connectBtn = document.getElementById('header-connect-btn');
      if (connectBtn) {
        connectBtn.innerHTML = `<span class="pulse"></span> 0x742d…44e8`;
      }
      showToast(`✅ Connected via ${name} to Robinhood Chain (#77701)`);
    });
  });

  // Confirm deposit
  const confirmDepBtn = document.getElementById('confirm-deposit-btn');
  if (confirmDepBtn) {
    confirmDepBtn.addEventListener('click', () => {
      const amount = document.getElementById('modal-deposit-amount')?.value || '1000';
      confirmDepBtn.innerHTML = `<span class="pulse"></span> Batching Rollup Tx…`;
      confirmDepBtn.disabled = true;

      setTimeout(() => {
        confirmDepBtn.innerHTML = 'Confirm & Automate Vault';
        confirmDepBtn.disabled = false;
        closeModal(depositModal);
        showToast(`🎉 Automated $${parseFloat(amount).toLocaleString()} USDC on Robinhood Chain!`);
      }, 1300);
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     5. PHONE SIM SLIDER
  ───────────────────────────────────────────────────────────────────────── */
  const slider = document.getElementById('phone-sim-slider');
  const simVal = document.getElementById('phone-sim-val');
  const simEst = document.getElementById('phone-sim-est');

  if (slider) {
    slider.addEventListener('input', () => {
      const v = parseFloat(slider.value);
      if (simVal) simVal.textContent = `$${v.toLocaleString()}`;
      if (simEst) simEst.textContent = `$${Math.round(v * 12 * 1.38).toLocaleString()}`;
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     6. ACTION HANDLERS
  ───────────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.trigger-rebalance-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('⚡ Algorithmic Rebalance Executed! Sub-second finality, $0.0004 gas on RH Chain.');
    });
  });

  ['harvest-alpha-btn', 'mobile-harvest-btn'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      showToast('💰 Harvested +$4,180.50 Mean-Reversion Alpha into your Robinhood Wallet!');
    });
  });

  /* ─────────────────────────────────────────────────────────────────────────
     7. QR CORNER TOGGLE
  ───────────────────────────────────────────────────────────────────────── */
  const qrOrbit   = document.getElementById('qr-btn-orbit');
  const qrRelayer = document.getElementById('qr-btn-relayer');

  if (qrOrbit && qrRelayer) {
    [qrOrbit, qrRelayer].forEach(btn => {
      btn.addEventListener('click', () => {
        qrOrbit.classList.toggle('is-active');
        qrRelayer.classList.toggle('is-active');
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     8. INTERSECTION OBSERVER — scroll reveal
  ───────────────────────────────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────────────────────────────────────
     9. AURORA BOREALIS CANVAS
  ───────────────────────────────────────────────────────────────────────── */
  const auroraCanvas = document.getElementById('aurora-canvas');
  if (auroraCanvas) {
    const ctx = auroraCanvas.getContext('2d');
    let W = auroraCanvas.width  = auroraCanvas.parentElement.clientWidth;
    let H = auroraCanvas.height = auroraCanvas.parentElement.clientHeight;

    const resizeAurora = () => {
      if (!auroraCanvas.parentElement) return;
      W = auroraCanvas.width  = auroraCanvas.parentElement.clientWidth;
      H = auroraCanvas.height = auroraCanvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resizeAurora, { passive: true });

    const AURORA_COLORS = [
      'rgba(0, 217, 90,  0.20)',
      'rgba(0, 239, 255, 0.18)',
      'rgba(59, 130, 246, 0.16)',
      'rgba(168, 85, 247, 0.13)',
      'rgba(251, 191, 36, 0.16)',
    ];

    let t = 0;
    const renderAurora = () => {
      t += 0.011;
      ctx.clearRect(0, 0, W, H);

      AURORA_COLORS.forEach((col, i) => {
        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.moveTo(0, H);

        const freq  = 0.0022 + i * 0.0005;
        const phase = t + i * 0.85;
        const amp   = 38 + i * 14;

        for (let x = 0; x <= W; x += 12) {
          const y = H - 50
            - Math.sin(x * freq + phase) * amp
            - Math.cos(x * 0.003 + t * 0.55) * 22;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
      });

      requestAnimationFrame(renderAurora);
    };
    renderAurora();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     10. AMBIENT ORB CANVAS — drifting soft glows behind everything
  ───────────────────────────────────────────────────────────────────────── */
  const orbCanvas = document.getElementById('orb-canvas');
  if (orbCanvas) {
    const oc = orbCanvas.getContext('2d');
    let OW = orbCanvas.width  = window.innerWidth;
    let OH = orbCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      OW = orbCanvas.width  = window.innerWidth;
      OH = orbCanvas.height = window.innerHeight;
    }, { passive: true });

    const ORBS = [
      { x: 0.15, y: 0.2,  r: 320, vx:  0.18, vy:  0.12, col: 'rgba(0,217,90,' },
      { x: 0.75, y: 0.35, r: 260, vx: -0.14, vy:  0.08, col: 'rgba(59,130,246,' },
      { x: 0.5,  y: 0.8,  r: 300, vx:  0.10, vy: -0.16, col: 'rgba(0,239,255,' },
      { x: 0.85, y: 0.7,  r: 200, vx: -0.20, vy:  0.10, col: 'rgba(168,85,247,' },
      { x: 0.3,  y: 0.6,  r: 180, vx:  0.12, vy: -0.14, col: 'rgba(251,191,36,' },
    ].map(o => ({ ...o, cx: o.x * window.innerWidth, cy: o.y * window.innerHeight }));

    const drawOrbs = () => {
      OW = orbCanvas.width;
      OH = orbCanvas.height;
      oc.clearRect(0, 0, OW, OH);

      ORBS.forEach(orb => {
        orb.cx += orb.vx;
        orb.cy += orb.vy;

        // Bounce off edges
        if (orb.cx - orb.r < 0 || orb.cx + orb.r > OW) orb.vx *= -1;
        if (orb.cy - orb.r < 0 || orb.cy + orb.r > OH) orb.vy *= -1;

        const grad = oc.createRadialGradient(orb.cx, orb.cy, 0, orb.cx, orb.cy, orb.r);
        grad.addColorStop(0,   orb.col + '0.07)');
        grad.addColorStop(0.5, orb.col + '0.04)');
        grad.addColorStop(1,   orb.col + '0)');

        oc.beginPath();
        oc.arc(orb.cx, orb.cy, orb.r, 0, Math.PI * 2);
        oc.fillStyle = grad;
        oc.fill();
      });

      requestAnimationFrame(drawOrbs);
    };
    drawOrbs();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     11. ANIMATED STAT COUNTERS
  ───────────────────────────────────────────────────────────────────────── */
  const statEls = document.querySelectorAll('.stat-value[data-count]');

  const animateCounter = (el, target, prefix, suffix, duration = 1800) => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // ease out cubic
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = Math.round(target * ease);
      const formatted = val >= 1000000
        ? (val / 1000000).toFixed(2) + 'M'
        : val >= 1000
        ? (val / 1000).toFixed(0) + 'k'
        : val.toString();
      el.textContent = prefix + formatted + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseFloat(el.dataset.count);
          const prefix = el.dataset.prefix ?? '$';
          const suffix = el.dataset.suffix ?? '';
          animateCounter(el, target, prefix, suffix);
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    statEls.forEach(el => statObserver.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────────────────
     12. 3D CARD TILT on feature cards (desktop mouse parallax)
  ───────────────────────────────────────────────────────────────────────── */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.feature-card, .mosaic-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2);
        const dy   = (e.clientY - cy) / (rect.height / 2);
        const rx   = dy * -6;
        const ry   = dx *  6;
        card.style.transform    = `translateY(-5px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        card.style.transition   = 'transform 0.08s ease';
        card.style.perspective  = '600px';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform   = '';
        card.style.transition  = 'transform 0.5s var(--ease-out-expo)';
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     10. TOAST NOTIFICATION
  ───────────────────────────────────────────────────────────────────────── */
  function showToast(msg, duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D95A" stroke-width="2.5" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${msg}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity  = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  window.showToast = showToast;

  /* ─────────────────────────────────────────────────────────────────────────
     11. MOBILE TOUCH — close menu on outside tap
  ───────────────────────────────────────────────────────────────────────── */
  document.addEventListener('touchstart', e => {
    if (menuOverlay?.classList.contains('is-open')) {
      if (!menuOverlay.contains(e.target) && e.target !== menuBtn) {
        closeMenu();
      }
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────────────────────────────────
     12. PREVENT BODY SCROLL BLEED UNDER MODALS (iOS)
  ───────────────────────────────────────────────────────────────────────── */
  document.addEventListener('touchmove', e => {
    const openModal = document.querySelector('.modal-overlay.is-open');
    if (openModal && !openModal.querySelector('.modal-box').contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

});
