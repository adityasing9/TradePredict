import {
  CryptoTokenomics,
  CryptoProtocolEconomics,
  CryptoNetworkMetrics,
  OnChainAnalysis
} from '../../types/fundamental';

export const CRYPTO_FUNDAMENTALS_DATABASE: Record<
  string,
  {
    tokenomics: CryptoTokenomics;
    protocol: CryptoProtocolEconomics;
    network: CryptoNetworkMetrics;
    onchain: OnChainAnalysis;
  }
> = {
  'CRYPTO:BTCUSDT': {
    tokenomics: {
      circulatingSupply: 19780000,
      totalSupply: 19780000,
      maxSupply: 21000000,
      circulatingPercent: 94.19,
      fdv: 1400000000000,
      fdvToMarketCapRatio: 1.06,
      annualInflationRate: 0.84, // Post-4th halving (3.125 BTC per block)
      nextHalvingOrUnlockDate: 'April 2028',
      emissionSchedule: 'Programmatic 4-year geometric halving with absolute 21M hard cap'
    },
    protocol: {
      fees24h: 2150000, // USD
      revenue30d: 68500000,
      tvl: undefined,
      treasuryBalance: undefined
    },
    network: {
      activeAddresses24h: 840000,
      dailyTransactions: 520000,
      developerCommits30d: 142,
      consensusMechanism: 'Proof of Work (SHA-256)'
    },
    onchain: {
      exchangeNetFlow24hUsd: -48500000, // $48.5M Net Outflow
      whaleTransactions24h: 3120, // > $100k
      top10HoldersPercent: 5.4,
      top100HoldersPercent: 14.8,
      mvrvZScore: 1.85,
      nvtRatio: 48.2,
      metrics: [
        {
          metric: 'Exchange Net Flow',
          value: '-$48.5M',
          observation: 'Net exchange reserves decreased by 740 BTC over the last 24 hours.',
          interpretation: 'Coins moving into cold storage typically reflect reduced immediate sell-side inventory.',
          signal: 'BULLISH'
        },
        {
          metric: 'Active Addresses',
          value: '840,000 / day',
          observation: 'Unique sending and receiving addresses remained steady (+2.4% week-on-week).',
          interpretation: 'Sustained user participation confirms organic network transactional baseline.',
          signal: 'NEUTRAL'
        },
        {
          metric: 'MVRV Z-Score',
          value: '1.85',
          observation: 'Ratio of market value to realized value stands in the middle valuation band.',
          interpretation: 'Historical cycles suggest the market is not yet in an over-extended bubble territory (> 4.0).',
          signal: 'BULLISH'
        },
        {
          metric: 'Whale Large Transfers',
          value: '3,120 txs',
          observation: 'Transactions exceeding $100,000 increased by 8% over the 7-day average.',
          interpretation: 'Elevated large-value velocity indicates heightened institutional rebalancing activity.',
          signal: 'NEUTRAL'
        }
      ]
    }
  },
  'CRYPTO:ETHUSDT': {
    tokenomics: {
      circulatingSupply: 120400000,
      totalSupply: 120400000,
      maxSupply: null, // Dynamic supply
      circulatingPercent: 100.0,
      fdv: 320000000000,
      fdvToMarketCapRatio: 1.0,
      annualInflationRate: 0.28, // Ultra-sound burn vs issuance
      emissionSchedule: 'Proof of Stake issuance offset by EIP-1559 base fee burning'
    },
    protocol: {
      fees24h: 3450000,
      revenue30d: 94000000,
      tvl: 48500000000, // $48.5B DeFi TVL
      marketCapToTvl: 6.6,
      treasuryBalance: 850000000
    },
    network: {
      activeAddresses24h: 420000,
      dailyTransactions: 1150000,
      developerCommits30d: 890,
      validatorCount: 1045000,
      consensusMechanism: 'Proof of Stake (Casper FFG / LMD-GHOST)'
    },
    onchain: {
      exchangeNetFlow24hUsd: -18200000,
      whaleTransactions24h: 2450,
      top10HoldersPercent: 8.2,
      top100HoldersPercent: 28.5,
      mvrvZScore: 1.42,
      nvtRatio: 54.1,
      metrics: [
        {
          metric: 'Staking Validator Participation',
          value: '1,045,000 validators',
          observation: 'Over 34.2 million ETH (~28.4% of total supply) is locked in consensus staking.',
          interpretation: 'High staking participation constrains liquid float available on spot order books.',
          signal: 'BULLISH'
        },
        {
          metric: 'Layer 2 Blob Usage',
          value: 'Full Target Capacity',
          observation: 'Dencun EIP-4844 data blobs are operating near optimal capacity for Arbitrum and Base.',
          interpretation: 'L2 fee revenues lower L1 burning slightly but drive aggregate ecosystem throughput.',
          signal: 'NEUTRAL'
        },
        {
          metric: 'Exchange Inflow Ratio',
          value: '-$18.2M Net Outflow',
          observation: 'Net exchange deposits have contracted for 4 consecutive daily cycles.',
          interpretation: 'Indicates muted immediate liquid liquidation risk from long-term holders.',
          signal: 'BULLISH'
        }
      ]
    }
  },
  'CRYPTO:SOLUSDT': {
    tokenomics: {
      circulatingSupply: 468000000,
      totalSupply: 585000000,
      maxSupply: null,
      circulatingPercent: 80.0,
      fdv: 89000000000,
      fdvToMarketCapRatio: 1.25,
      annualInflationRate: 5.1, // Disinflationary curve reducing by 15% annually to 1.5%
      emissionSchedule: 'Disinflationary staking rewards reducing towards 1.5% terminal rate'
    },
    protocol: {
      fees24h: 2800000,
      revenue30d: 72000000,
      tvl: 5400000000,
      marketCapToTvl: 13.2,
      treasuryBalance: 450000000
    },
    network: {
      activeAddresses24h: 1250000,
      dailyTransactions: 38500000,
      developerCommits30d: 620,
      validatorCount: 1540,
      consensusMechanism: 'Proof of Stake + Proof of History'
    },
    onchain: {
      exchangeNetFlow24hUsd: 12400000, // +$12.4M Net Inflow
      whaleTransactions24h: 1850,
      top10HoldersPercent: 10.5,
      top100HoldersPercent: 32.1,
      mvrvZScore: 2.1,
      nvtRatio: 32.5,
      metrics: [
        {
          metric: 'DEX Volume Dominance',
          value: '$2.1B / 24h',
          observation: 'Solana DEX volume briefly matched or exceeded Ethereum mainnet decentralized exchange turnover.',
          interpretation: 'Strong retail meme coin and DeFi liquidity velocity driving demand for SOL gas fees.',
          signal: 'BULLISH'
        },
        {
          metric: 'Exchange Net Flow',
          value: '+$12.4M Net Inflow',
          observation: 'Net $12.4M worth of SOL transferred onto centralized exchanges in the last 24h.',
          interpretation: 'Modest increase in exchange deposits may exert near-term short resistance.',
          signal: 'BEARISH'
        }
      ]
    }
  },
  'CRYPTO:NEARUSDT': {
    tokenomics: {
      circulatingSupply: 1210000000,
      totalSupply: 1220000000,
      maxSupply: null,
      circulatingPercent: 99.18,
      fdv: 5900000000,
      fdvToMarketCapRatio: 1.01,
      annualInflationRate: 5.0,
      emissionSchedule: '5% annual network emission with 70% of transactional gas fees programmatically burned'
    },
    protocol: {
      fees24h: 380000,
      revenue30d: 9500000,
      tvl: 250000000,
      marketCapToTvl: 23.6,
      treasuryBalance: 320000000
    },
    network: {
      activeAddresses24h: 2150000,
      dailyTransactions: 6200000,
      developerCommits30d: 310,
      consensusMechanism: 'Proof of Stake + Nightshade Sharding'
    },
    onchain: {
      exchangeNetFlow24hUsd: -3200000, // -$3.2M Net Outflow
      whaleTransactions24h: 420,
      top10HoldersPercent: 8.4,
      top100HoldersPercent: 24.5,
      mvrvZScore: 1.45,
      nvtRatio: 28.4,
      metrics: [
        {
          metric: 'Daily Active Accounts',
          value: '2.15M / day',
          observation: 'NEAR maintains industry-leading daily active user onboarding via Chain Signatures and key abstraction.',
          interpretation: 'High consumer transactional velocity reduces circulating liquid float.',
          signal: 'BULLISH'
        },
        {
          metric: 'Exchange Net Flow',
          value: '-$3.2M Outflow',
          observation: 'Net withdrawal of NEAR tokens from centralized exchanges into native non-custodial staking.',
          interpretation: 'Accumulation into staking validators absorbs sell-side pressure.',
          signal: 'BULLISH'
        }
      ]
    }
  },
  'CRYPTO:ANKRUSDT': {
    tokenomics: {
      circulatingSupply: 10000000000,
      totalSupply: 10000000000,
      maxSupply: 10000000000,
      circulatingPercent: 100.0,
      fdv: 284000000,
      fdvToMarketCapRatio: 1.0,
      annualInflationRate: 0.0,
      emissionSchedule: '100% fully unlocked max supply with zero future token unlock dilution'
    },
    protocol: {
      fees24h: 95000,
      revenue30d: 2850000,
      tvl: 92000000,
      marketCapToTvl: 3.08,
      treasuryBalance: 45000000
    },
    network: {
      activeAddresses24h: 38000,
      dailyTransactions: 145000,
      developerCommits30d: 185,
      consensusMechanism: 'Proof of Stake & Distributed RPC Nodes'
    },
    onchain: {
      exchangeNetFlow24hUsd: -450000,
      whaleTransactions24h: 85,
      top10HoldersPercent: 14.2,
      top100HoldersPercent: 41.5,
      mvrvZScore: 0.95,
      nvtRatio: 18.2,
      metrics: [
        {
          metric: 'RPC Request Volume',
          value: '8.4B requests / mo',
          observation: 'DePIN node providers handle multi-chain developer throughput across 40+ networks.',
          interpretation: 'Steady enterprise utility revenue reinforces token staking utility.',
          signal: 'BULLISH'
        },
        {
          metric: 'Token Float Status',
          value: '100% Circulating',
          observation: 'Zero overhang from VC or team token vesting unlocks.',
          interpretation: 'Eliminates structural dilution risk common to newer infrastructure tokens.',
          signal: 'BULLISH'
        }
      ]
    }
  }
};

export function evaluateCryptoFundamentals(assetId: string) {
  return CRYPTO_FUNDAMENTALS_DATABASE[assetId] || null;
}
