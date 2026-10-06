import React from 'react';
import { Asset, Market } from '../types/asset';
import { ALL_ASSETS, getAssetById } from '../data/universe';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import { TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Activity, Globe, Compass, Star } from 'lucide-react';

interface DashboardPageProps {
  onSelectAsset: (asset: Asset) => void;
  onNavigate: (page: string) => void;
  watchlistItems: string[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectAsset,
  onNavigate,
  watchlistItems
}) => {
  // Key Benchmark Indices / Core Assets for global overview
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Welcome / Market Regime Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-background-card via-background-elevated to-background-card border border-background-border shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-brand-400 font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Multi-Market Intelligence Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              Analyze. Predict. Understand.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Institutional-grade market analysis, feature engineering, and probabilistic ML forecasting for Nepal (NEPSE), India (NSE), US Equities, and Cryptocurrencies.
            </p>
          </div>

          {/* Quick Regime Tag */}
          <div className="flex flex-col sm:items-end gap-1 font-mono text-xs">
            <span className="text-[10px] uppercase text-slate-400">Prevailing Global Regime:</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                RISK-ON (Easing Liquidity)
              </span>
              <span className="px-2.5 py-1 rounded bg-background-secondary border border-background-border text-slate-300">
                Vol: Normal
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Cross-asset correlation moderate</span>
          </div>
        </div>
      </div>

      {/* Global Benchmark Overview Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-400" />
            Global Market Barometer
          </h2>
          <button
            onClick={() => onNavigate('markets')}
            className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore All 26+ Assets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredAssets.map((asset) => {
            const baseline = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 0, high: 100, low: 100 };
            const changePercent = Number(((baseline.dailyChange / (baseline.price - baseline.dailyChange)) * 100).toFixed(2));
            const isUp = changePercent >= 0;

            return (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="p-4 rounded-xl bg-background-card border border-background-border hover:border-brand-500/50 hover:bg-background-elevated cursor-pointer transition-all duration-150 shadow-md group flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base group-hover:text-brand-400 transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background-secondary text-slate-400 border border-background-border">
                        {asset.market}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[180px] mt-0.5">
                      {asset.name}
                    </p>
                  </div>

                  <div className={`p-1.5 rounded-lg border ${
                    isUp ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-background-border/60 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">LAST PRICE</span>
                    <span className="text-base font-extrabold text-white">
                      {asset.currency} {baseline.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">24H CHANGE</span>
                    <span className={`text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? '+' : ''}{changePercent}% ({baseline.dailyChange > 0 ? '+' : ''}{baseline.dailyChange})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Watchlist Highlights */}
      {watchlistItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Your Monitored Watchlist ({watchlistItems.length})
            </h2>
            <button
              onClick={() => onNavigate('watchlist')}
              className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>Manage Watchlist</span>
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
                  className="p-3 rounded-lg bg-background-card border border-background-border hover:border-brand-500/40 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-white">{asset.symbol}</span>
                    <span className={changePct >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {changePct >= 0 ? '+' : ''}{changePct}%
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    {asset.currency} {baseline.price.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => onNavigate('predictions')}
          className="p-4 rounded-xl bg-background-secondary border border-background-border hover:border-brand-500 cursor-pointer transition-colors group"
        >
          <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
            <span>Probabilistic ML Forecasts</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Scan multi-factor predictions and direction probabilities across all 4 markets.
          </p>
        </div>

        <div
          onClick={() => onNavigate('performance')}
          className="p-4 rounded-xl bg-background-secondary border border-background-border hover:border-brand-500 cursor-pointer transition-colors group"
        >
          <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
            <span>Model Performance Dashboard</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Empirical historical directional accuracy, calibration curves, and error tracking.
          </p>
        </div>

        <div
          onClick={() => onNavigate('backtesting')}
          className="p-4 rounded-xl bg-background-secondary border border-background-border hover:border-brand-500 cursor-pointer transition-colors group"
        >
          <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
            <span>Strategy Backtesting Studio</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Simulate ML and technical breakout strategies with transaction costs and drawdown curves.
          </p>
        </div>
      </div>
    </div>
  );
};
