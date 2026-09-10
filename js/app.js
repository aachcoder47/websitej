/**
 * ORBITAL VAULT - Rainbow.me Design Controller
 * Sticky Phone Screen Switcher, Market Word Rotator, Math Simulator, Modals & Aurora Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Rotating Dynamic Market Word
  const marketWordEl = document.getElementById('hero-market-word');
  const marketWords = [
    { text: 'Auto-DCA', color: '#00D95A' },
    { text: 'Mean Reversion', color: '#00F2FE' },
    { text: "Shannon's Demon", color: '#3B82F6' },
    { text: 'Portfolio Rebalance', color: '#AF52DE' },
    { text: 'Alpha Harvest', color: '#FFD60A' },
    { text: '0-Gas Execution', color: '#00D95A' }
  ];

  let currentMarketIdx = 0;
  if (marketWordEl) {
    setInterval(() => {
      currentMarketIdx = (currentMarketIdx + 1) % marketWords.length;
      const m = marketWords[currentMarketIdx];
      marketWordEl.style.opacity = '0';
      marketWordEl.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        marketWordEl.innerHTML = `<span class="market-word_item" style="color: ${m.color};">${m.text}</span>`;
        marketWordEl.style.opacity = '1';
        marketWordEl.style.transform = 'translateY(0)';
      }, 250);
    }, 2800);
  }

  // 2. Sticky Phone Rail Screen Switcher on Scroll (Desktop)
  const sections = ['hero', 'simulator', 'vaults', 'tokenomics', 'infrastructure'];
  const scrollNavLinks = document.querySelectorAll('.scroll_nav_link');

  function updateActiveSection() {
    const scrollPos = window.scrollY + window.innerHeight * 0.45;
    let activeSecId = 'hero';

    sections.forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          activeSecId = secId;
        }
      }
    });

    // Update sticky phone screens in desktop rail
    const allPhoneScreens = document.querySelectorAll('.phone_rail .phone_screen');
    allPhoneScreens.forEach((screen) => {
      if (screen.id === `screen-${activeSecId}`) {
        screen.classList.add('is-active');
      } else {
        screen.classList.remove('is-active');
      }
    });

    // Update floating scroll nav
    scrollNavLinks.forEach((link) => {
      if (link.getAttribute('data-target') === activeSecId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // 3. Corner Menu Popup Scrim
  const menuBtn = document.getElementById('menu-btn');
  const menuPopup = document.getElementById('menu-popup');
  const menuScrim = document.getElementById('menu-scrim');

  if (menuBtn && menuPopup) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playClick();
      menuPopup.classList.toggle('is-open');
    });

    if (menuScrim) {
      menuScrim.addEventListener('click', () => {
        menuPopup.classList.remove('is-open');
      });
    }

    document.querySelectorAll('.menu_link').forEach((link) => {
      link.addEventListener('click', () => {
        menuPopup.classList.remove('is-open');
      });
    });
  }

  // 4. Modals (Wallet & Deposit)
  const walletModal = document.getElementById('wallet-modal-overlay');
  const depositModal = document.getElementById('deposit-modal-overlay');
  const connectWalletBtns = document.querySelectorAll('.connect-wallet-trigger');
  const depositBtns = document.querySelectorAll('.deposit-trigger');

  connectWalletBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playClick();
      if (walletModal) {
        walletModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  depositBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playClick();
      if (depositModal) {
        depositModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  [walletModal, depositModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // Wallet item click
  document.querySelectorAll('.download_modal_link[data-wallet]').forEach((item) => {
    item.addEventListener('click', (e) => {
      const wName = e.currentTarget.getAttribute('data-wallet') || 'Robinhood Wallet';
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (walletModal) walletModal.classList.remove('is-open');
      document.body.style.overflow = '';

      const headerConnect = document.getElementById('header-connect-btn');
      if (headerConnect) {
        headerConnect.innerHTML = `<span class="pulse-dot"></span> 0x742d...44e8`;
      }

      showToast(`Connected via ${wName} to Robinhood Chain (#77701)`);
    });
  });

  // Confirm Deposit button
  const confirmDepositBtn = document.getElementById('confirm-deposit-btn');
  if (confirmDepositBtn) {
    confirmDepositBtn.addEventListener('click', () => {
      const depAmount = document.getElementById('modal-deposit-amount').value || '1000';
      confirmDepositBtn.innerHTML = `<span class="pulse-dot"></span> Batching Robinhood Rollup Tx...`;
      confirmDepositBtn.disabled = true;

      setTimeout(() => {
        confirmDepositBtn.innerHTML = `Confirm & Automate Vault`;
        confirmDepositBtn.disabled = false;
        if (depositModal) depositModal.classList.remove('is-open');
        document.body.style.overflow = '';

        if (window.soundEngine) window.soundEngine.playSuccess();
        showToast(`🎉 Successfully automated $${parseFloat(depAmount).toLocaleString()} USDC on Robinhood Chain!`);
      }, 1200);
    });
  }

  // 5. Phone Simulator Slider
  const phoneSimSlider = document.getElementById('phone-sim-slider');
  const phoneSimVal = document.getElementById('phone-sim-val');
  const phoneSimEst = document.getElementById('phone-sim-est');

  if (phoneSimSlider) {
    phoneSimSlider.addEventListener('input', () => {
      const v = parseFloat(phoneSimSlider.value);
      if (phoneSimVal) phoneSimVal.textContent = `$${v.toLocaleString()}`;
      const projected = v * 12 * 1.38;
      if (phoneSimEst) phoneSimEst.textContent = `$${Math.round(projected).toLocaleString()}`;
    });
  }

  // 6. Rebalance Trigger Simulation
  document.querySelectorAll('.trigger-rebalance-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playRebalancePulse();
      showToast(`⚡ Algorithmic Mean-Reversion Rebalance Executed! Sub-second finality with $0.0004 gas on Robinhood Chain.`);
    });
  });

  // Harvest Alpha click
  ['harvest-alpha-btn', 'mobile-harvest-btn'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSuccess();
        showToast(`💰 Harvested +$4,180.50 in Mean-Reversion Alpha into your Robinhood Wallet!`);
      });
    }
  });

  // 7. Interactive 3D Rewards Coin Flip
  const coinFlip = document.getElementById('rewards-coin-flip');
  if (coinFlip) {
    coinFlip.addEventListener('click', () => {
      coinFlip.classList.toggle('is-spinning');
      if (window.soundEngine) window.soundEngine.playHover();
    });
  }

  // 8. Toast Notifications
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: rgba(15, 21, 35, 0.95);
      border: 1px solid rgba(0, 217, 90, 0.35);
      border-radius: 12px;
      padding: 12px 18px;
      color: #FFFFFF;
      font-size: 0.82rem;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,217,90,0.15);
      backdrop-filter: blur(20px);
      pointer-events: auto;
      animation: marketFlip 0.3s ease;
    `;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D95A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${msg}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  window.showToast = showToast;

  // 9. Shimmering Emerald & Cyan Aurora Borealis Canvas
  const auroraCanvas = document.getElementById('aurora-canvas');
  if (auroraCanvas) {
    const ctx = auroraCanvas.getContext('2d');
    let width = (auroraCanvas.width = auroraCanvas.parentElement.clientWidth);
    let height = (auroraCanvas.height = auroraCanvas.parentElement.clientHeight);

    window.addEventListener('resize', () => {
      if (!auroraCanvas.parentElement) return;
      width = auroraCanvas.width = auroraCanvas.parentElement.clientWidth;
      height = auroraCanvas.height = auroraCanvas.parentElement.clientHeight;
    });

    let time = 0;
    function renderAurora() {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Emerald, Cyan, Lapis & Gold light ribbons
      const colors = [
        'rgba(0, 217, 90, 0.22)',   // Robinhood Emerald
        'rgba(0, 242, 254, 0.20)',  // Cyan
        'rgba(59, 130, 246, 0.18)',  // Lapis Blue
        'rgba(175, 82, 222, 0.16)', // Purple
        'rgba(245, 158, 11, 0.18)'   // Amber
      ];

      colors.forEach((col, idx) => {
        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.moveTo(0, height);

        const freq = 0.0025 + idx * 0.0006;
        const phase = time + idx * 0.8;
        const amplitude = 40 + idx * 12;

        for (let x = 0; x <= width; x += 15) {
          const y = height - 60 - Math.sin(x * freq + phase) * amplitude - Math.cos(x * 0.004 + time * 0.5) * 20;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      });

      requestAnimationFrame(renderAurora);
    }

    renderAurora();
  }

  // 10. Scroll-Reveal Observer (reveal-on-scroll elements)
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // 11. Tile hover reveal (all tiles get reveal-on-scroll treatment too)
  const allTiles = document.querySelectorAll('.tile:not(.reveal-on-scroll)');
  if (allTiles.length > 0) {
    const tileObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
          }, i * 60);
          tileObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    allTiles.forEach((tile) => {
      tile.style.opacity = '0';
      tile.style.transform = 'translateY(24px)';
      tile.style.transition = 'opacity 0.6s var(--ease-apple), transform 0.6s var(--ease-apple)';
      tileObserver.observe(tile);
    });
  }

  // 12. QR Corner Toggle (Orbit Rollup / 0-Gas Relayer)
  const qrBtnOrbit = document.getElementById('qr-btn-orbit');
  const qrBtnRelayer = document.getElementById('qr-btn-relayer');
  const qrCard = document.querySelector('.qr_card');

  if (qrBtnOrbit && qrBtnRelayer) {
    [qrBtnOrbit, qrBtnRelayer].forEach((btn) => {
      btn.addEventListener('click', () => {
        qrBtnOrbit.classList.toggle('is-active');
        qrBtnRelayer.classList.toggle('is-active');
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });
  }

  // 13. Mobile: close menu on outside tap
  document.addEventListener('touchstart', (e) => {
    const popup = document.getElementById('menu-popup');
    const menuBtn = document.getElementById('menu-btn');
    if (popup && popup.classList.contains('is-open')) {
      if (!popup.contains(e.target) && e.target !== menuBtn) {
        popup.classList.remove('is-open');
      }
    }
  }, { passive: true });

  // 14. Prevent body scroll when modal is open (iOS fix)
  const preventBodyScroll = (e) => {
    const modals = document.querySelectorAll('.download_modal_overlay.is-open');
    modals.forEach((modal) => {
      if (modal.contains(e.target)) {
        // allow scroll within modal
      } else {
        e.preventDefault();
      }
    });
  };

  document.addEventListener('touchmove', (e) => {
    const openModal = document.querySelector('.download_modal_overlay.is-open');
    if (openModal && !openModal.querySelector('.download_modal').contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

});
