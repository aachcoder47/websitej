/**
 * ORBITAL VAULT - Core Data, Strategies & Math Models
 * Native to Robinhood Chain (Arbitrum Orbit EVM)
 */

const VAULTS_DATA = [
  {
    id: 'vault-prime-bluechip',
    name: 'Robinhood Prime Bluechip',
    tagline: 'Automated Mean-Reversion across Tier-1 Digital Stores of Value',
    badge: 'Most Popular',
    badgeColor: 'cyan',
    apy: '24.8%',
    baseYield: '4.2% (Native Staking)',
    tvl: '$48,920,400',
    totalUsers: '3,842',
    minDeposit: '$50 USDC',
    dcaFrequency: 'Daily (Every 24h at 00:00 UTC)',
    rebalanceThreshold: '±3.5% Deviation Band',
    riskScore: 'Low - Medium',
    chain: 'Robinhood Chain',
    assets: [
      { symbol: 'BTC', name: 'Bitcoin (WBTC)', weight: 40, color: '#F7931A', icon: '₿' },
      { symbol: 'ETH', name: 'Ethereum (WETH)', weight: 35, color: '#627EEA', icon: 'Ξ' },
      { symbol: 'SOL', name: 'Solana (WSOL)', weight: 25, color: '#14F195', icon: '◎' }
    ],
    historicalReturn1Y: '+142.6%',
    maxDrawdown: '-14.2%',
    sharpeRatio: '2.41',
    description: 'Continuously accumulates Bitcoin, Ethereum, and Solana at sub-second micro-intervals. Automatically takes profit on whichever asset outperforms and accumulates the lagging asset, delivering optimal mean-reversion alpha with zero emotion.'
  },
  {
    id: 'vault-rwa-yield',
    name: 'Institutional RWA & Super-Yield',
    tagline: 'Tokenized US Treasuries + Delta-Neutral Arbitrum Orbit Yield',
    badge: 'Capital Preservation',
    badgeColor: 'emerald',
    apy: '16.4%',
    baseYield: '11.8% (T-Bill + Basis Trade)',
    tvl: '$62,150,000',
    totalUsers: '1,920',
    minDeposit: '$500 USDC',
    dcaFrequency: 'Every 12 Hours',
    rebalanceThreshold: '±2.0% Deviation Band',
    riskScore: 'Conservative',
    chain: 'Robinhood Chain',
    assets: [
      { symbol: 'USDY', name: 'Ondo US Dollar Yield', weight: 45, color: '#10B981', icon: '$' },
      { symbol: 'sUSDe', name: 'Ethena Staked USDe', weight: 30, color: '#38BDF8', icon: '◈' },
      { symbol: 'ETH', name: 'LST Liquid Restaked ETH', weight: 25, color: '#A855F7', icon: 'Ξ' }
    ],
    historicalReturn1Y: '+21.4%',
    maxDrawdown: '-1.8%',
    sharpeRatio: '4.88',
    description: 'Designed for family offices and cautious crypto allocators. Auto-compounds high real-world yield into tokenized treasury positions, capturing delta-neutral basis funding rates on Robinhood Chain with sub-cent gas execution.'
  },
  {
    id: 'vault-ai-depin',
    name: 'Frontier AI & DePIN Compute Index',
    tagline: 'Algorithmic High-Alpha Basket of GPU Infrastructure & Decentralized Intelligence',
    badge: 'High Alpha',
    badgeColor: 'purple',
    apy: '48.2%',
    baseYield: '6.5% (Compute Node Staking)',
    tvl: '$29,480,000',
    totalUsers: '5,110',
    minDeposit: '$100 USDC',
    dcaFrequency: 'Daily (Every 24h)',
    rebalanceThreshold: '±5.0% Dynamic Volatility Band',
    riskScore: 'High Growth',
    chain: 'Robinhood Chain',
    assets: [
      { symbol: 'NEAR', name: 'NEAR Protocol', weight: 30, color: '#00EC97', icon: 'Ⓝ' },
      { symbol: 'RENDER', name: 'Render Network', weight: 25, color: '#E53E3E', icon: '☵' },
      { symbol: 'FET', name: 'Artificial Superintelligence', weight: 25, color: '#3B82F6', icon: '⎈' },
      { symbol: 'TAO', name: 'Bittensor', weight: 20, color: '#F59E0B', icon: 'τ' }
    ],
    historicalReturn1Y: '+268.4%',
    maxDrawdown: '-24.6%',
    sharpeRatio: '1.92',
    description: 'Captures the fastest expanding sector in Web3. Automated volatility trimming sells local tops into stable collateral and buys dips across high-compute AI protocols without human panic.'
  },
  {
    id: 'vault-robinhood-l2',
    name: 'Robinhood Ecosystem Multi-Chain Matrix',
    tagline: 'The Layer-2 & Layer-3 Rollup Execution Powerhouse',
    badge: 'Ecosystem Native',
    badgeColor: 'amber',
    apy: '36.9%',
    baseYield: '5.1% (Sequencer Fee Share)',
    tvl: '$34,120,500',
    totalUsers: '2,490',
    minDeposit: '$100 USDC',
    dcaFrequency: 'Every 6 Hours',
    rebalanceThreshold: '±4.0% Deviation Band',
    riskScore: 'Medium - High',
    chain: 'Robinhood Chain',
    assets: [
      { symbol: 'ARB', name: 'Arbitrum One', weight: 35, color: '#28A0F0', icon: '◆' },
      { symbol: 'ETH', name: 'Ethereum Gas Token', weight: 35, color: '#627EEA', icon: 'Ξ' },
      { symbol: 'LINK', name: 'Chainlink Data Feed', weight: 30, color: '#375BD2', icon: '⬡' }
    ],
    historicalReturn1Y: '+185.0%',
    maxDrawdown: '-18.1%',
    sharpeRatio: '2.18',
    description: 'Capitalizes on the surge in Arbitrum Orbit / Robinhood EVM execution flow. Automated smart contracts leverage low rollup fees to execute micro-rebalances multiple times a day.'
  }
];

const TOKEN_TIERS = [
  {
    tier: 0,
    name: 'Explorer',
    requirement: '0 $ORBIT',
    reqAmount: 0,
    fee: '0.35%',
    yieldMultiplier: '1.0x Base',
    perks: ['Standard Daily DCA', 'Public Batch Pool', 'Community Support'],
    glow: 'rgba(255, 255, 255, 0.1)'
  },
  {
    tier: 1,
    name: 'Pioneer',
    requirement: '1,000 $ORBIT',
    reqAmount: 1000,
    fee: '0.20%',
    yieldMultiplier: '1.15x Boost',
    perks: ['12h DCA Interval', 'Custom Asset Weightings', 'Priority Gas Relayers'],
    glow: 'rgba(56, 189, 248, 0.4)'
  },
  {
    tier: 2,
    name: 'Architect',
    requirement: '10,000 $ORBIT',
    reqAmount: 10000,
    fee: '0.08%',
    yieldMultiplier: '1.35x Boost',
    perks: ['1h Sub-Interval DCA', 'Automated Stop-Loss Collateral Guard', 'VIP Protocol Telemetry'],
    glow: 'rgba(168, 85, 247, 0.5)'
  },
  {
    tier: 3,
    name: 'Sovereign Whale',
    requirement: '50,000 $ORBIT',
    reqAmount: 50000,
    fee: '0.00% Zero-Fee',
    yieldMultiplier: '1.60x Max Boost',
    perks: ['100% Free Zero-Fee Execution', 'Private MEV-Proof Flashblock Batching', 'Direct OTC Rebalancer Access', 'Governance Voting Weight x2'],
    glow: 'rgba(0, 242, 254, 0.8)'
  }
];

const SIMULATED_TRANSACTIONS = [
  { time: '1s ago', vault: 'Robinhood Prime Bluechip', type: 'DCA Batch', amount: '$4,250 USDC', txHash: '0x8f3c...b12a', chain: 'Robinhood Chain', status: 'Settled' },
  { time: '4s ago', vault: 'Frontier AI & DePIN', type: 'Auto-Rebalance', amount: 'Sold 1.4 TAO → Bought NEAR', txHash: '0x3a91...e45f', chain: 'Robinhood Chain', status: 'Settled' },
  { time: '9s ago', vault: 'Institutional RWA', type: 'Yield Compound', amount: '+$842.10 USDC (4.8% APY)', txHash: '0x71dc...298b', chain: 'Robinhood Chain', status: 'Settled' },
  { time: '14s ago', vault: 'Robinhood Prime Bluechip', type: 'DCA Auto-Buy', amount: '$1,200 USDC → BTC/ETH', txHash: '0x99a2...fe10', chain: 'Robinhood Chain', status: 'Settled' },
  { time: '19s ago', vault: 'Robinhood Ecosystem L2', type: 'Auto-Rebalance', amount: 'Trimmed +4.2% ARB → ETH', txHash: '0x23f8...66bb', chain: 'Robinhood Chain', status: 'Settled' }
];

window.VAULTS_DATA = VAULTS_DATA;
window.TOKEN_TIERS = TOKEN_TIERS;
window.SIMULATED_TRANSACTIONS = SIMULATED_TRANSACTIONS;
