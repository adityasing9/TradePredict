import React from 'react';
import { Asset, Market } from '../types/asset';
import { ALL_ASSETS, getAssetById } from '../data/universe';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Activity,
  Globe,
  Compass,
  Star,
  Zap,
  BarChart2,
  Binary,
  Layers
} from 'lucide-react';

interface DashboardPageProps {
  onSelectAsset: (asset: Asset) => void;
  onNavigate: (page: string) => void;
  watchlistItems: string[];
}

// Mini SVG Sparkline generator
const MiniSparkline: React.FC<{ isUp: boolean }> = ({ isUp }) => {
  const color = isUp ? '#10b981' : '#f43f5e';
  const points = isUp
    ? "0,28 10,24 20,26 30,18 40,20 50,14 60,16 70,8 80,10 90,4 100,2"
    : "0,4 10,8 20,6 30,16 40,14 50,22 60,18 70,25 80,22 90,28 100,28";

  return (
    <svg viewBox="0 0 100 32" className="w-24 h-7 stroke-current overflow-visible">
      <defs>
        <linearGradient id={`grad-${isUp ? 'up' : 'down'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectAsset,
  onNavigate,
  watchlistItems
}) => {
  const featuredIds = [
    'NEPSE:NEPSE',
    'NSE:NIFTY50',
    'NASDAQ:SPY',
    'CRYPTO:BTCUSDT',
    'CRYPTO:ETHUSDT',
    'NASDAQ:NVDA'
  ];

  const featuredAssets = featuredIds
    .map((id) => getAssetById(id))
    .filter((a): a is Asset => !!a);

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* 1. HERO BANNER: Institutional Market Regime */}
      <div className="relative rounded-2xl p-6 sm:p-7 overflow-hidden glass-card border border-white/[0.08] shadow-2xl">
        {/* Subtle Ambient Decorative Gradient Highlights */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-brand-500/15 via-terminal-cyan/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-300 font-bold bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/25">
                Multi-Market Intelligence Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Analyze. Predict. Understand.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Mathematical feature engineering, econometric volatility cones, and ensemble probabilistic forecasts across Nepal (NEPSE), India (NSE), US Equities, and Cryptocurrencies.
            </p>
          </div>

          {/* Institutional Regime Widget */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md flex flex-col gap-2 min-w-[280px]">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="uppercase font-semibold tracking-wider">Global Macro Regime</span>
              <span className="text-emerald-400 font-bold">CALIBRATED</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-sm">
                RISK-ON (Easing Liquidity)
              </span>
              <span className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono text-xs">
                Vol: 18.2%
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/[0.05]">
              <span>Cross-Asset Correlation: Moderate (0.34)</span>
              <span className="text-brand-300 font-semibold">1D Window</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GLOBAL BENCHMARK BAROMETER CARDS */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Core Benchmark Barometer
            </h2>
          </div>

          <button
            onClick={() => onNavigate('markets')}
            className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All 26+ Assets</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredAssets.map((asset) => {
            const baseline = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 0, high: 105, low: 95 };
            const changePercent = Number(((baseline.dailyChange / (baseline.price - baseline.dailyChange)) * 100).toFixed(2));
            const isUp = changePercent >= 0;

            // Range calculation for 24h high/low bar
            const rangeSpan = Math.max(0.1, baseline.high - baseline.low);
            const currentPositionPct = Math.min(100, Math.max(0, ((baseline.price - baseline.low) / rangeSpan) * 100));

            return (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="p-4 rounded-xl glass-card-hover cursor-pointer group flex flex-col justify-between gap-3 relative overflow-hidden"
              >
                {/* Top Row: Symbol, Market Tag & Sparkline */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base group-hover:text-brand-400 transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                        {asset.market}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[170px] mt-0.5">
                      {asset.name}
                    </p>
                  </div>

                  {/* Sparkline mini-graph */}
                  <div className="flex flex-col items-end">
                    <MiniSparkline isUp={isUp} />
                    <span
                      className={`text-[11px] font-mono font-bold mt-1 px-1.5 py-0.2 rounded ${
                        isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {isUp ? '+' : ''}{changePercent}%
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-white/[0.06] font-mono">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">LAST PRICE</span>
                      <span className="text-lg font-black text-white">
                        {asset.currency} {baseline.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">24H RANGE</span>
                      <span className="text-[11px] text-slate-300">
                        {baseline.low} – {baseline.high}
                      </span>
                    </div>
                  </div>

                  {/* 24H Price Slider Range Bar */}
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full mt-2 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${currentPositionPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MONITORED WATCHLIST SECTION */}
      {watchlistItems.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Your Monitored Watchlist ({watchlistItems.length})
              </h2>
            </div>

            <button
              onClick={() => onNavigate('watchlist')}
              className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1.5"
            >
              <span>Manage List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {watchlistItems.slice(0, 4).map((assetId) => {
              const asset = getAssetById(assetId);
              if (!asset) return null;
              const baseline = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 0 };
              const changePct = Number(((baseline.dailyChange / (baseline.price - baseline.dailyChange)) * 100).toFixed(2));

              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="p-3.5 rounded-xl glass-card-hover cursor-pointer"
                >
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-white">{asset.symbol}</span>
                    <span className={changePct >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {changePct >= 0 ? '+' : ''}{changePct}%
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 font-semibold mt-1">
                    {asset.currency} {baseline.price.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. QUANT & PREDICTIVE SUITE SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        <div
          onClick={() => onNavigate('predictions')}
          className="p-5 rounded-xl glass-card-hover cursor-pointer group flex flex-col justify-between gap-3"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3 group-hover:scale-105 transition-transform">
              <Binary className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
              <span>Probabilistic ML Forecasts</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ensemble gradient boosted trees, directional probabilities, and 68%/95% statistical price cones.
            </p>
          </div>
          <span className="text-[10px] font-mono text-brand-400 font-bold">Launch Scanner →</span>
        </div>

        <div
          onClick={() => onNavigate('performance')}
          className="p-5 rounded-xl glass-card-hover cursor-pointer group flex flex-col justify-between gap-3"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
              <span>Model Performance & Truth</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Empirical historical accuracy derived strictly from verified outcomes with zero simulated inflation.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Audit Calibration →</span>
        </div>

        <div
          onClick={() => onNavigate('backtesting')}
          className="p-5 rounded-xl glass-card-hover cursor-pointer group flex flex-col justify-between gap-3"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
              <span>Strategy Backtesting Studio</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Simulate quantitative rules and ML breakout strategies with realistic slippage and equity curves.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold">Simulate Strategies →</span>
        </div>
      </div>
    </div>
  );
};
