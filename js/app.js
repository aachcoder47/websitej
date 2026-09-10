/**
 * ORBITAL VAULT - Main Application Controller
 * High-performance state management, 5-slice quantum aperture transition, interactive simulators, wallet integration, and Robinhood Chain execution
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Unique 5-Slice Quantum Aperture Opening Transition
  const apertureOverlay = document.getElementById('quantum-aperture-overlay');
  const hudCounter = document.getElementById('hud-counter');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 16) + 7;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);

      if (hudCounter) hudCounter.textContent = '100%';
      if (apertureOverlay) apertureOverlay.classList.add('ignited');

      setTimeout(() => {
        if (apertureOverlay) apertureOverlay.classList.add('unfurled');
        document.body.classList.add('page-ready');
        if (window.soundEngine && !appState.audioMuted) {
          window.soundEngine.playSuccess();
        }
      }, 350);
    } else {
      if (hudCounter) hudCounter.textContent = `${loadProgress}%`;
    }
  }, 45);

  // 2. Initialize State
  const appState = {
    walletConnected: false,
    walletAddress: null,
    walletType: null,
    network: 'Robinhood Chain (77701)',
    balanceUSDC: 25420.00,
    balanceORBIT: 12500,
    activeVaults: [
      {
        id: 'vault-prime-bluechip',
        name: 'Robinhood Prime Bluechip',
        deposited: 5000,
        currentValue: 6240.50,
        profit: '+24.81%',
        nextDCA: '04h 12m',
        rebalancesCount: 42
      }
    ],
    simulator: {
      deposit: 1000,
      timeframe: '1Y',
      frequency: 'daily',
      strategy: 'vault-prime-bluechip'
    },
    audioMuted: false
  };

  // 3. Initialize WebGL 3D Scene
  if (window.WebGLAccretionScene) {
    window.accretionScene = new WebGLAccretionScene('webgl-canvas-container');
  }

  // 4. Initialize DCA Chart Engine
  let chartEngine = null;
  if (window.DCAChartEngine) {
    chartEngine = new DCAChartEngine('dca-chart-canvas');
  }

  // 5. Cursor Glow Tracker & Dynamic 3D Card Tilt
  const cursorGlow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }

    document.querySelectorAll('.interactive-card').forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      } else {
        card.style.transform = '';
      }
    });
  });

  // 6. Scroll Header State & Section HUD Tracker Spy
  const siteHeader = document.getElementById('site-header');
  const hudItems = document.querySelectorAll('.hud-dot-item');
  const sections = ['hero', 'simulator', 'vaults', 'tokenomics', 'infrastructure'];

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Scroll spy for left HUD
    const scrollPos = window.scrollY + window.innerHeight * 0.4;
    sections.forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          hudItems.forEach((item) => {
            if (item.getAttribute('data-section') === secId) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      }
    });
  });

  // Staggered Scroll Reveal
  const observerOptions = { threshold: 0.08 };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => revealObserver.observe(el));

  // 7. Sound Engine Audio Toggle
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (window.soundEngine) {
        const isMuted = window.soundEngine.toggleMute();
        appState.audioMuted = isMuted;
        audioBtn.innerHTML = isMuted
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        showToast(isMuted ? 'Sound FX Muted' : 'Sound FX Enabled (Tactile Feedback On)');
      }
    });
  }

  // 8. Interactive DCA Simulator Binding
  const depositSlider = document.getElementById('sim-deposit-slider');
  const depositValDisplay = document.getElementById('sim-deposit-val');
  const simStrategySelect = document.getElementById('sim-strategy-select');

  function updateSimulator() {
    if (!chartEngine) return;
    const deposit = parseFloat(depositSlider ? depositSlider.value : 1000);
    const timeframe = appState.simulator.timeframe;
    const frequency = appState.simulator.frequency;
    const strategy = simStrategySelect ? simStrategySelect.value : 'vault-prime-bluechip';

    appState.simulator.deposit = deposit;
    appState.simulator.strategy = strategy;

    if (depositValDisplay) {
      depositValDisplay.textContent = `$${deposit.toLocaleString()}`;
    }

    chartEngine.setConfig(deposit, timeframe, frequency, strategy);

    const estValEl = document.getElementById('sim-metric-est-val');
    const estProfitEl = document.getElementById('sim-metric-profit');
    const gasSavedEl = document.getElementById('sim-metric-gas-saved');

    let mult = 1.38;
    if (strategy === 'vault-rwa-yield') mult = 1.164;
    if (strategy === 'vault-ai-depin') mult = 1.62;
    if (strategy === 'vault-robinhood-l2') mult = 1.45;

    let timeMult = 1.0;
    if (timeframe === '3M') timeMult = 0.25;
    if (timeframe === '6M') timeMult = 0.5;
    if (timeframe === '1Y') timeMult = 1.0;
    if (timeframe === '3Y') timeMult = 3.2;

    const totalPrincipal = deposit * 12 * timeMult;
    const projectedVal = totalPrincipal * (1 + (mult - 1) * timeMult);
    const profit = projectedVal - totalPrincipal;
    const profitPct = ((profit / totalPrincipal) * 100).toFixed(1);

    if (estValEl) estValEl.textContent = `$${Math.round(projectedVal).toLocaleString()}`;
    if (estProfitEl) estProfitEl.textContent = `+$${Math.round(profit).toLocaleString()} (+${profitPct}%)`;
    if (gasSavedEl) gasSavedEl.textContent = `~$${Math.round(totalPrincipal * 0.042 + 160).toLocaleString()} (0-Gas RH Orbit)`;
  }

  if (depositSlider) {
    depositSlider.addEventListener('input', () => {
      if (window.soundEngine) window.soundEngine.playHover();
      updateSimulator();
    });
  }

  if (simStrategySelect) {
    simStrategySelect.addEventListener('change', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      updateSimulator();
    });
  }

  // Timeframe and Frequency pill toggles
  document.querySelectorAll('.timeframe-pill').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.timeframe-pill').forEach((b) => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      appState.simulator.timeframe = e.currentTarget.getAttribute('data-timeframe');
      if (window.soundEngine) window.soundEngine.playClick();
      updateSimulator();
    });
  });

  document.querySelectorAll('.frequency-pill').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.frequency-pill').forEach((b) => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      appState.simulator.frequency = e.currentTarget.getAttribute('data-freq');
      if (window.soundEngine) window.soundEngine.playClick();
      updateSimulator();
    });
  });

  // 9. Render Strategy Vaults Cards
  const vaultsGrid = document.getElementById('vaults-grid');
  if (vaultsGrid && window.VAULTS_DATA) {
    vaultsGrid.innerHTML = window.VAULTS_DATA.map((v) => {
      const assetSegments = v.assets.map((a) => `<div class="asset-segment" style="width: ${a.weight}%; background-color: ${a.color};" title="${a.symbol} ${a.weight}%"></div>`).join('');
      const assetLegends = v.assets.map((a) => `
        <div class="asset-badge-item">
          <span class="asset-color-pip" style="background-color: ${a.color};"></span>
          <span>${a.symbol} <strong>${a.weight}%</strong></span>
        </div>
      `).join('');

      let pillColor = 'green';
      if (v.badgeColor === 'purple') pillColor = 'blue';
      if (v.badgeColor === 'amber') pillColor = 'amber';

      return `
        <div class="glass-panel vault-card interactive-card reveal-on-scroll">
          <div class="vault-card-top">
            <div class="vault-title-wrap">
              <span class="badge-pill ${pillColor}"><span class="pulse-dot"></span>${v.badge}</span>
              <h3 class="vault-title">${v.name}</h3>
              <p class="vault-tagline">${v.tagline}</p>
            </div>
            <div class="vault-apy-box">
              <div class="vault-apy-label">Projected APY</div>
              <div class="vault-apy-num">${v.apy}</div>
            </div>
          </div>

          <div class="asset-split-container">
            <div class="asset-bar">${assetSegments}</div>
            <div class="asset-legend-row">${assetLegends}</div>
          </div>

          <div class="vault-specs-grid">
            <div class="spec-item">
              <span class="spec-k">TVL</span>
              <span class="spec-v">${v.tvl}</span>
            </div>
            <div class="spec-item">
              <span class="spec-k">DCA Cycle</span>
              <span class="spec-v">${v.dcaFrequency.split('(')[0]}</span>
            </div>
            <div class="spec-item">
              <span class="spec-k">Rebalance Band</span>
              <span class="spec-v">${v.rebalanceThreshold.split(' ')[0]}</span>
            </div>
          </div>

          <div class="vault-actions-row">
            <button class="btn-primary deposit-vault-trigger" data-vault-id="${v.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              Deposit & Automate
            </button>
            <button class="btn-secondary simulate-rebalance-trigger" data-vault-id="${v.id}" title="Simulate Real-Time Rebalance Execution">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Trigger Rebalance
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 10. Render Token Tier Ladder
  const tiersGrid = document.getElementById('tiers-ladder-grid');
  if (tiersGrid && window.TOKEN_TIERS) {
    tiersGrid.innerHTML = window.TOKEN_TIERS.map((t, idx) => `
      <div class="glass-panel tier-card interactive-card reveal-on-scroll ${t.tier === 3 ? 'featured anim-glow-pulse' : ''}">
        <div>
          <div class="tier-num-badge">TIER 0${t.tier} STAKE</div>
          <h3 class="tier-name">${t.name}</h3>
          <div style="font-size: 0.85rem; color: var(--rh-green); font-family: var(--font-mono); margin-top: 4px;">${t.requirement}</div>
        </div>

        <div class="tier-fee-box">
          <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.04em;">Platform Fee</div>
          <div class="tier-fee-rate">${t.fee}</div>
          <div style="font-size: 0.75rem; color: var(--rh-green); font-family: var(--font-mono);">${t.yieldMultiplier}</div>
        </div>

        <ul class="tier-perks-list">
          ${t.perks.map((p) => `
            <li class="tier-perk-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${p}</span>
            </li>
          `).join('')}
        </ul>

        <button class="btn-secondary select-tier-btn" data-tier="${t.tier}">
          ${t.tier === 3 ? 'Stake for Zero Fees' : 'Select Tier'}
        </button>
      </div>
    `).join('');
  }

  // 11. Dynamic Token Staking Savings Calculator
  const stakeSlider = document.getElementById('stake-calc-slider');
  const stakeAmountDisplay = document.getElementById('stake-calc-amount');
  const stakeFeeRateDisplay = document.getElementById('stake-calc-fee-rate');
  const stakeAnnualSavingsDisplay = document.getElementById('stake-calc-savings');
  const stakeTierNameDisplay = document.getElementById('stake-calc-tier-name');

  function updateStakingCalc() {
    const val = parseFloat(stakeSlider ? stakeSlider.value : 10000);
    if (stakeAmountDisplay) stakeAmountDisplay.textContent = `${val.toLocaleString()} $ORBIT`;

    let tierName = 'Explorer';
    let feeRate = '0.35%';
    let feeDecimal = 0.0035;

    if (val >= 50000) {
      tierName = 'Sovereign Whale (Tier 3)';
      feeRate = '0.00% Zero-Fee';
      feeDecimal = 0.0;
    } else if (val >= 10000) {
      tierName = 'Architect (Tier 2)';
      feeRate = '0.08%';
      feeDecimal = 0.0008;
    } else if (val >= 1000) {
      tierName = 'Pioneer (Tier 1)';
      feeRate = '0.20%';
      feeDecimal = 0.0020;
    }

    if (stakeTierNameDisplay) stakeTierNameDisplay.textContent = tierName;
    if (stakeFeeRateDisplay) stakeFeeRateDisplay.textContent = feeRate;

    const standardFeePaid = 120000 * 0.0035;
    const tieredFeePaid = 120000 * feeDecimal;
    const savings = standardFeePaid - tieredFeePaid + 850;

    if (stakeAnnualSavingsDisplay) {
      stakeAnnualSavingsDisplay.textContent = `+$${Math.round(savings).toLocaleString()} / yr`;
    }
  }

  if (stakeSlider) {
    stakeSlider.addEventListener('input', () => {
      if (window.soundEngine) window.soundEngine.playHover();
      updateStakingCalc();
    });
  }

  // 12. Live Simulated Transaction Ticker Stream
  const tickerTrack = document.getElementById('live-ticker-track');
  if (tickerTrack && window.SIMULATED_TRANSACTIONS) {
    const renderTicker = () => {
      const allTx = [...window.SIMULATED_TRANSACTIONS, ...window.SIMULATED_TRANSACTIONS];
      tickerTrack.innerHTML = allTx.map((tx) => `
        <div class="ticker-item">
          <span class="ticker-tag">${tx.chain}</span>
          <span><strong>${tx.vault}</strong></span>
          <span style="color: var(--rh-green);">${tx.type}</span>
          <span>${tx.amount}</span>
          <span style="color: var(--rh-green);">✓ ${tx.status}</span>
        </div>
      `).join('');
    };
    renderTicker();

    setInterval(() => {
      const randomAmounts = ['$1,850 USDC', '$7,400 USDC', '$350 USDC', '$12,000 USDC'];
      const randomTypes = ['DCA Micro-Buy', 'Algorithmic Rebalance', 'Yield Auto-Compound', 'Volatility Trim'];
      const randomVaults = ['Robinhood Prime Bluechip', 'Frontier AI & DePIN', 'Institutional RWA', 'Robinhood Ecosystem L2'];

      const newTx = {
        time: 'Just now',
        vault: randomVaults[Math.floor(Math.random() * randomVaults.length)],
        type: randomTypes[Math.floor(Math.random() * randomTypes.length)],
        amount: randomAmounts[Math.floor(Math.random() * randomAmounts.length)],
        txHash: '0x' + Math.random().toString(16).substr(2, 8) + '...',
        chain: 'Robinhood Chain',
        status: 'Settled'
      };

      window.SIMULATED_TRANSACTIONS.unshift(newTx);
      if (window.SIMULATED_TRANSACTIONS.length > 8) window.SIMULATED_TRANSACTIONS.pop();
      renderTicker();
    }, 6000);
  }

  // 13. Modal Handlers
  const walletModal = document.getElementById('wallet-modal');
  const depositModal = document.getElementById('deposit-modal');
  const connectWalletBtns = document.querySelectorAll('.connect-wallet-btn');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  connectWalletBtns.forEach((b) => {
    b.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      if (walletModal) walletModal.classList.add('open');
    });
  });

  modalCloseBtns.forEach((b) => {
    b.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.remove('open'));
    });
  });

  // Wallet Selection
  document.querySelectorAll('.wallet-option-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      const wName = e.currentTarget.getAttribute('data-wallet') || 'Robinhood Wallet';
      appState.walletConnected = true;
      appState.walletType = wName;
      appState.walletAddress = '0x742d...44e8';

      if (window.soundEngine) window.soundEngine.playSuccess();
      if (walletModal) walletModal.classList.remove('open');

      connectWalletBtns.forEach((b) => {
        b.innerHTML = `
          <span class="pulse-dot" style="background-color: var(--rh-green); box-shadow: 0 0 8px var(--rh-green);"></span>
          ${appState.walletAddress}
        `;
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });

      showToast(`Connected via ${wName} to Robinhood Chain (#77701)`);
    });
  });

  // Vault Deposit click
  document.addEventListener('click', (e) => {
    const depBtn = e.target.closest('.deposit-vault-trigger');
    if (depBtn) {
      const vId = depBtn.getAttribute('data-vault-id');
      const vault = (window.VAULTS_DATA || []).find((v) => v.id === vId) || window.VAULTS_DATA[0];
      
      const modalVaultTitle = document.getElementById('modal-deposit-vault-title');
      if (modalVaultTitle) modalVaultTitle.textContent = vault.name;

      if (window.soundEngine) window.soundEngine.playClick();
      if (depositModal) depositModal.classList.add('open');
    }

    const rebBtn = e.target.closest('.simulate-rebalance-trigger');
    if (rebBtn) {
      const vId = rebBtn.getAttribute('data-vault-id');
      const vault = (window.VAULTS_DATA || []).find((v) => v.id === vId) || window.VAULTS_DATA[0];

      if (window.soundEngine) window.soundEngine.playRebalancePulse();
      showToast(`⚡ Algorithmic Rebalance Triggered on ${vault.name} — Mean reversion executed with $0.0004 gas on Robinhood Chain!`);
    }
  });

  // Confirm Deposit Execution Form
  const confirmDepositBtn = document.getElementById('confirm-deposit-btn');
  if (confirmDepositBtn) {
    confirmDepositBtn.addEventListener('click', () => {
      const depAmount = document.getElementById('modal-deposit-amount').value || '1,000';
      confirmDepositBtn.innerHTML = `<span class="pulse-dot"></span> Batching Robinhood Chain Tx...`;
      confirmDepositBtn.disabled = true;

      setTimeout(() => {
        confirmDepositBtn.innerHTML = `Confirm & Deploy Automated Vault`;
        confirmDepositBtn.disabled = false;
        if (depositModal) depositModal.classList.remove('open');

        if (window.soundEngine) window.soundEngine.playSuccess();
        showToast(`🎉 Successfully deployed $${depAmount} USDC into Automated DCA & Rebalancing Vault!`);
      }, 1400);
    });
  }

  // Toast Notifications
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D95A" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>${msg}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  window.showToast = showToast;

  // Initial runs
  updateSimulator();
  updateStakingCalc();
});
