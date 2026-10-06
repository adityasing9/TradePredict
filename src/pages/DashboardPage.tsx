import React, { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { getAssetById } from '../data/universe';
import { getAllPredictions, seedInitialHistoricalPredictions } from '../db/predictionStore';
import { TrackedPrediction } from '../types/tracking';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Star,
  Binary,
  Newspaper,
  Activity,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface DashboardPageProps {
  onSelectAsset: (asset: Asset) => void;
  onNavigate: (page: string) => void;
  watchlistItems: string[];
}

interface BenchmarkItem {
  id: string;
  symbol: string;
  name: string;
  market: string;
  flag: string;
  price: string;
  change: string;
  changePercent: number;
  isUp: boolean;
  accentBorder: string;
}

const BENCHMARKS: BenchmarkItem[] = [
  { id: 'NEPSE:NEPSE', symbol: 'NEPSE', name: 'Nepal Stock Exchange Index', market: 'NEPSE', flag: '🇳🇵', price: '2,684.20', change: '+22.30', changePercent: 0.84, isUp: true, accentBorder: 'border-t-rose-500' },
  { id: 'NSE:NIFTY50', symbol: 'NIFTY 50', name: 'NIFTY 50 Index', market: 'NSE', flag: '🇮🇳', price: '24,980.50', change: '-52.40', changePercent: -0.21, isUp: false, accentBorder: 'border-t-orange-500' },
  { id: 'NASDAQ:SPY', symbol: 'S&P 500', name: 'S&P 500 ETF Trust', market: 'NASDAQ', flag: '🇺🇸', price: '5,751.10', change: '+24.60', changePercent: 0.43, isUp: true, accentBorder: 'border-t-blue-500' },
  { id: 'NASDAQ:QQQ', symbol: 'NASDAQ', name: 'Invesco QQQ Trust', market: 'NASDAQ', flag: '🇺🇸', price: '489.20', change: '+3.01', changePercent: 0.62, isUp: true, accentBorder: 'border-t-sky-500' },
  { id: 'CRYPTO:BTCUSDT', symbol: 'BTC / USDT', name: 'Bitcoin / Tether', market: 'CRYPTO', flag: '₿', price: '$64,250.00', change: '+$1,510.00', changePercent: 2.41, isUp: true, accentBorder: 'border-t-amber-500' },
  { id: 'CRYPTO:ETHUSDT', symbol: 'ETH / USDT', name: 'Ethereum / Tether', market: 'CRYPTO', flag: '⟠', price: '$3,480.00', change: '+$62.10', changePercent: 1.82, isUp: true, accentBorder: 'border-t-purple-500' },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectAsset,
  onNavigate,
  watchlistItems
}) => {
  const [recentPredictions, setRecentPredictions] = useState<TrackedPrediction[]>([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    async function loadPredictions() {
      await seedInitialHistoricalPredictions();
      const list = await getAllPredictions();
      setRecentPredictions(list.slice(0, 5));
    }
    loadPredictions();
  }, []);

  return (
    <div className="space-y-4">
      {/* 1. GREETING & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Live Terminal
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
              Coverage: Nepal (NEPSE) • India (NSE) • US (NASDAQ/NYSE) • Crypto
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {getGreeting()} — <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400">Market Intelligence Terminal</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono font-medium">
            Quantitative analysis, feature engineering, and probabilistic forecasting pipeline.
          </p>
        </div>
        <div className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface-secondary border border-border text-slate-600 dark:text-slate-300 font-semibold shadow-xs">
          Last Synchronized: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* 2. MARKET PULSE (Horizontal Data Strip) */}
      <div className="terminal-panel p-3.5 space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">
              Market Pulse & Core Benchmarks
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/30">
              Global Indices
            </span>
          </div>
          <button
            onClick={() => onNavigate('markets')}
            className="text-[11px] font-mono font-bold text-accent-cyan hover:underline flex items-center gap-1 transition-colors"
          >
            <span>All Markets Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {BENCHMARKS.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                const asset = getAssetById(b.id);
                if (asset) onSelectAsset(asset);
              }}
              className={`p-3 rounded-lg bg-surface border border-border hover:border-accent-cyan shadow-xs hover:shadow-md transition-all cursor-pointer group border-t-2 ${b.accentBorder}`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs shrink-0">{b.flag}</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-xs truncate group-hover:text-accent-cyan transition-colors">
                    {b.symbol}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                    b.isUp
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {b.isUp ? '+' : ''}{b.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="font-mono font-black text-slate-950 dark:text-white text-sm mt-2 tracking-tight">
                {b.price}
              </div>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-border/50 text-[10px] font-mono">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">{b.market}</span>
                <span className={`font-semibold ${b.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {b.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MARKET ENVIRONMENT */}
      <div className="terminal-panel p-3.5 space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">
              Macro Environment & Volatility Regime
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Empirically Calibrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-surface border border-border border-l-4 border-l-blue-500 flex items-center justify-between font-mono shadow-xs">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold block">Risk Appetite</span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">Moderate</span>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 font-bold">
              Balanced
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border border-l-4 border-l-amber-500 flex items-center justify-between font-mono shadow-xs">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold block">Volatility Regime</span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">Elevated (18.2% Ann.)</span>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold">
              Compression Zone
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border border-l-4 border-l-purple-500 flex items-center justify-between font-mono shadow-xs">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold block">Trend Posture</span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">Mixed / Selective</span>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-bold">
              Stock-Specific
            </span>
          </div>
        </div>
      </div>

      {/* 4. WATCHLIST & RECENT PREDICTIONS (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monitored Watchlist */}
        <div className="terminal-panel p-3.5 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
              </div>
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">
                Monitored Watchlist
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500 text-white font-black shadow-xs">
                {watchlistItems.length}
              </span>
            </div>
            <button
              onClick={() => onNavigate('watchlist')}
              className="text-[11px] font-mono font-bold text-accent-cyan hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {watchlistItems.length > 0 ? (
            <div className="divide-y divide-border">
              {watchlistItems.slice(0, 5).map((assetId) => {
                const asset = getAssetById(assetId);
                if (!asset) return null;

                const marketBadge =
                  asset.market === 'NEPSE'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                    : asset.market === 'NSE'
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25'
                    : asset.market === 'NASDAQ'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';

                return (
                  <div
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 dark:text-white text-xs group-hover:text-accent-cyan transition-colors">
                          {asset.symbol}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${marketBadge}`}>
                          {asset.market}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[200px] block mt-0.5 font-medium">
                        {asset.name}
                      </span>
                    </div>
                    <div className="text-right font-mono flex items-center gap-3">
                      <span className="text-xs font-black text-slate-900 dark:text-white">{asset.currency}</span>
                      <span className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500 hover:text-white text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-[10px] font-bold transition-all shadow-xs">
                        Analyze →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              <Star className="w-6 h-6 mx-auto mb-2 text-amber-400/50" />
              <span className="font-semibold text-slate-600 dark:text-slate-400">No assets saved to watchlist yet.</span>
              <button
                onClick={() => onNavigate('markets')}
                className="block mx-auto mt-2 text-accent-cyan hover:underline text-xs font-bold"
              >
                Browse assets catalog to add →
              </button>
            </div>
          )}
        </div>

        {/* Recent Model Predictions */}
        <div className="terminal-panel p-3.5 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                <Binary className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">
                Latest Probabilistic Forecasts
              </span>
            </div>
            <button
              onClick={() => onNavigate('prediction')}
              className="text-[11px] font-mono font-bold text-accent-cyan hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-border">
            {recentPredictions.slice(0, 5).map((p) => {
              const asset = getAssetById(p.assetId);

              const dirBadge =
                p.predictedDirection === 'BULLISH'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : p.predictedDirection === 'BEARISH'
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                  : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (asset) onSelectAsset(asset);
                  }}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900 dark:text-white text-xs group-hover:text-accent-cyan transition-colors">
                        {p.symbol}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">{p.market} • {p.timeframe}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block mt-0.5">
                      Conf: <span className="font-bold text-slate-900 dark:text-white">{p.predictedConfidence}%</span> • Range: [{p.predictedPriceRange[0]} - {p.predictedPriceRange[1]}]
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black border ${dirBadge}`}
                    >
                      {p.predictedDirection === 'BULLISH' ? '▲ BULLISH' : p.predictedDirection === 'BEARISH' ? '▼ BEARISH' : '■ NEUTRAL'}
                    </span>
                    {p.evaluated && p.outcome && (
                      <span className="block text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        {p.outcome === 'CORRECT' ? '✓ Empirically Hit' : 'Evaluated'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. MACRO TELEMETRY & IMPORTANT EVENTS */}
      <div className="terminal-panel p-3.5 space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">
              Macro Catalysts & Event Telemetry
            </span>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-[11px] font-mono font-bold text-accent-cyan hover:underline flex items-center gap-1"
          >
            <span>News Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-surface border border-border border-l-4 border-l-rose-500 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-rose-600 dark:text-rose-400 font-bold">🇳🇵 NEPSE • Monetary Policy Review</span>
              <span className="text-slate-500 font-semibold">Scheduled</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white font-mono">
              Nepal Rastra Bank Liquidity & CD Ratio Status
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              Interbank rates steady at 3.0%. Commercial banks report credit expansion in commercial and energy sectors with positive CD ratios.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border border-l-4 border-l-orange-500 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-orange-600 dark:text-orange-400 font-bold">🇮🇳 NSE • Monetary Policy Committee</span>
              <span className="text-slate-500 font-semibold">Live</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white font-mono">
              RBI MPC Keeps Repo Rate Unchanged at 6.50%
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              Monetary policy stance maintained as 'withdrawal of accommodation'. Bank NIFTY and industrial staples trade with selective institutional inflows.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border border-l-4 border-l-blue-500 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-blue-600 dark:text-blue-400 font-bold">🇺🇸 US Equities • FOMC Rate Path</span>
              <span className="text-slate-500 font-semibold">Upcoming</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white font-mono">
              Federal Reserve Easing Cycle & Core PCE Trends
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              Semiconductor demand resilience balances cautious corporate guidance across discretionary sectors.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-border border-l-4 border-l-amber-500 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-amber-600 dark:text-amber-400 font-bold">₿ Crypto • Institutional Flows</span>
              <span className="text-slate-500 font-semibold">Continuous</span>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white font-mono">
              Institutional Spot ETF Custody Accumulation
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              Bitcoin exchange reserves drop to multi-year lows as institutional custody inflows continue. Volatility compression signals potential directional breakout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
