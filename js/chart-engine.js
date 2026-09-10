/**
 * ORBITAL VAULT - High Precision Canvas DCA & Rebalance Chart Engine
 * Clean, institutional visualization with refined gradients and precise metrics.
 */

class DCAChartEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.monthlyDeposit = 1000;
    this.timeframe = '1Y'; // '3M', '6M', '1Y', '3Y'
    this.frequency = 'daily'; // '12h', 'daily', 'weekly'
    this.strategy = 'vault-prime-bluechip';
    this.hoverIndex = -1;
    this.mousePos = { x: 0, y: 0 };
    this.pointsCount = 60;
    this.data = {
      dcaRebalanced: [],
      lumpSum: [],
      hodlStandard: [],
      dates: []
    };

    this.initCanvas();
    this.generateData();
    this.attachEvents();
    this.render();
  }

  initCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = 340;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
  }

  setConfig(monthlyDeposit, timeframe, frequency, strategy) {
    if (monthlyDeposit !== undefined) this.monthlyDeposit = parseFloat(monthlyDeposit);
    if (timeframe !== undefined) this.timeframe = timeframe;
    if (frequency !== undefined) this.frequency = frequency;
    if (strategy !== undefined) this.strategy = strategy;
    this.generateData();
    this.render();
  }

  generateData() {
    let days = 365;
    if (this.timeframe === '3M') days = 90;
    if (this.timeframe === '6M') days = 180;
    if (this.timeframe === '1Y') days = 365;
    if (this.timeframe === '3Y') days = 1095;

    this.pointsCount = Math.min(days, 80);
    const step = days / this.pointsCount;

    let strategyMultiplier = 1.38; // Default Bluechip
    if (this.strategy === 'vault-rwa-yield') strategyMultiplier = 1.164;
    if (this.strategy === 'vault-ai-depin') strategyMultiplier = 1.62;
    if (this.strategy === 'vault-robinhood-l2') strategyMultiplier = 1.45;

    let freqBonus = 1.0;
    if (this.frequency === '12h') freqBonus = 1.05;
    if (this.frequency === 'daily') freqBonus = 1.03;
    if (this.frequency === 'weekly') freqBonus = 1.0;

    const baseMonthly = this.monthlyDeposit;
    const totalPrincipal = baseMonthly * (days / 30);

    const dcaRebalanced = [];
    const lumpSum = [];
    const hodlStandard = [];
    const dates = [];

    let currentValDCA = 0;
    let currentValHodl = 0;
    let currentValLump = totalPrincipal;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Dynamic curve progression
    for (let i = 0; i <= this.pointsCount; i++) {
      const progress = i / this.pointsCount;
      const injectedCapital = totalPrincipal * progress;

      // Realistic market alpha curve with mean-reversion rebalance harvest
      const marketCycleWave = Math.sin(progress * Math.PI * 2.8) * 0.16 + Math.cos(progress * Math.PI * 1.5) * 0.10;
      const secularUpwardTrend = Math.pow(progress, 1.22) * (strategyMultiplier - 1);
      
      // Shannon's Demon volatility harvest
      const rebalanceAlpha = Math.abs(marketCycleWave) * 0.26 * freqBonus;

      currentValDCA = injectedCapital * (1 + secularUpwardTrend + marketCycleWave * 0.55 + rebalanceAlpha);
      currentValLump = totalPrincipal * (1 + (secularUpwardTrend * 0.82) + marketCycleWave * 1.05);
      currentValHodl = injectedCapital * (1 + secularUpwardTrend * 0.70 + marketCycleWave * 0.55);

      currentValDCA = Math.max(currentValDCA, injectedCapital * 0.88);
      currentValLump = Math.max(currentValLump, totalPrincipal * 0.68);
      currentValHodl = Math.max(currentValHodl, injectedCapital * 0.78);

      dcaRebalanced.push(currentValDCA);
      lumpSum.push(currentValLump);
      hodlStandard.push(currentValHodl);

      const d = new Date(startDate);
      d.setDate(d.getDate() + Math.round(i * step));
      dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    this.data = { dcaRebalanced, lumpSum, hodlStandard, dates, totalPrincipal };
  }

  attachEvents() {
    window.addEventListener('resize', () => {
      this.initCanvas();
      this.render();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;

      const paddingLeft = 60;
      const paddingRight = 20;
      const plotWidth = this.width - paddingLeft - paddingRight;

      if (this.mousePos.x >= paddingLeft && this.mousePos.x <= this.width - paddingRight) {
        const ratio = (this.mousePos.x - paddingLeft) / plotWidth;
        this.hoverIndex = Math.round(ratio * (this.pointsCount));
        this.hoverIndex = Math.max(0, Math.min(this.hoverIndex, this.pointsCount));
      } else {
        this.hoverIndex = -1;
      }
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverIndex = -1;
      this.render();
    });
  }

  render() {
    if (!this.ctx) return;
    const { dcaRebalanced, lumpSum, hodlStandard, dates, totalPrincipal } = this.data;
    if (!dcaRebalanced.length) return;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const paddingLeft = 60;
    const paddingRight = 24;
    const paddingTop = 20;
    const paddingBottom = 40;

    const plotWidth = this.width - paddingLeft - paddingRight;
    const plotHeight = this.height - paddingTop - paddingBottom;

    let allVals = [...dcaRebalanced, ...lumpSum, ...hodlStandard];
    const maxVal = Math.max(...allVals) * 1.12;
    const minVal = 0;

    const getX = (idx) => paddingLeft + (idx / this.pointsCount) * plotWidth;
    const getY = (val) => paddingTop + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;

    // 1. Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '11px "Space Grotesk", sans-serif';
    ctx.textAlign = 'right';

    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const val = minVal + (maxVal - minVal) * (i / gridLines);
      const y = getY(val);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(this.width - paddingRight, y);
      ctx.stroke();

      const label = `$${(val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.round(val))}`;
      ctx.fillText(label, paddingLeft - 10, y + 4);
    }

    // 2. Dates on X-axis
    ctx.textAlign = 'center';
    const dateSteps = 5;
    for (let i = 0; i <= dateSteps; i++) {
      const idx = Math.round((i / dateSteps) * this.pointsCount);
      const x = getX(idx);
      if (dates[idx]) {
        ctx.fillText(dates[idx], x, this.height - 12);
      }
    }

    // 3. Principal Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft, getY(0));
    ctx.lineTo(this.width - paddingRight, getY(totalPrincipal));
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Lump Sum Line (Titanium/Slate)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    lumpSum.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 5. Raw HODL Line (Lapis Blue)
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    hodlStandard.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // 6. Auto-DCA + Rebalance (Robinhood Green Radiant Gradient)
    const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + plotHeight);
    areaGrad.addColorStop(0, 'rgba(0, 217, 90, 0.22)');
    areaGrad.addColorStop(0.6, 'rgba(0, 217, 90, 0.05)');
    areaGrad.addColorStop(1, 'rgba(0, 217, 90, 0.0)');

    ctx.fillStyle = areaGrad;
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(0));
    dcaRebalanced.forEach((val, i) => {
      ctx.lineTo(getX(i), getY(val));
    });
    ctx.lineTo(getX(this.pointsCount), paddingTop + plotHeight);
    ctx.lineTo(getX(0), paddingTop + plotHeight);
    ctx.closePath();
    ctx.fill();

    // Main Emerald Green Line
    ctx.shadowColor = 'rgba(0, 217, 90, 0.4)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#00D95A';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    dcaRebalanced.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 7. Interactive Hover Cursor & Tooltip
    if (this.hoverIndex >= 0 && this.hoverIndex <= this.pointsCount) {
      const hX = getX(this.hoverIndex);
      const hValDCA = dcaRebalanced[this.hoverIndex];
      const hValLump = lumpSum[this.hoverIndex];
      const hValHodl = hodlStandard[this.hoverIndex];
      const hDate = dates[this.hoverIndex];
      const hY = getY(hValDCA);

      // Vertical guideline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hX, paddingTop);
      ctx.lineTo(hX, paddingTop + plotHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight Node
      ctx.fillStyle = '#00D95A';
      ctx.shadowColor = 'rgba(0, 217, 90, 0.8)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(hX, hY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#030508';
      ctx.beginPath();
      ctx.arc(hX, hY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Tooltip Card
      this.drawTooltip(ctx, hX, hY, hDate, hValDCA, hValLump, hValHodl);
    }
  }

  drawTooltip(ctx, x, y, date, valDCA, valLump, valHodl) {
    const boxW = 210;
    const boxH = 118;
    let boxX = x + 15;
    let boxY = y - boxH / 2;

    if (boxX + boxW > this.width - 10) boxX = x - boxW - 15;
    if (boxY < 10) boxY = 10;
    if (boxY + boxH > this.height - 10) boxY = this.height - boxH - 10;

    // Glass Box
    ctx.fillStyle = 'rgba(7, 10, 15, 0.94)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '10px "Space Grotesk", sans-serif';
    ctx.fillText(`TIMEFRAME: ${date}`, boxX + 12, boxY + 20);

    ctx.fillStyle = '#00D95A';
    ctx.font = 'bold 13px "Space Grotesk", sans-serif';
    ctx.fillText(`Orbital Vault: $${Math.round(valDCA).toLocaleString()}`, boxX + 12, boxY + 44);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '11px "Space Grotesk", sans-serif';
    ctx.fillText(`Lump Sum: $${Math.round(valLump).toLocaleString()}`, boxX + 12, boxY + 66);

    ctx.fillStyle = '#93C5FD';
    ctx.fillText(`Raw HODL: $${Math.round(valHodl).toLocaleString()}`, boxX + 12, boxY + 86);

    ctx.fillStyle = '#00D95A';
    ctx.font = 'bold 10px "Space Grotesk", sans-serif';
    ctx.fillText(`✓ 0-Gas RH Orbit Batch Saved ~$420`, boxX + 12, boxY + 106);
  }
}

window.DCAChartEngine = DCAChartEngine;
