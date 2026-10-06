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
  Activity
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
  price: string;
  change: string;
  changePercent: number;
  isUp: boolean;
}

const BENCHMARKS: BenchmarkItem[] = [
  { id: 'NEPSE:NEPSE', symbol: 'NEPSE', name: 'Nepal Stock Exchange Index', market: 'NEPSE', price: '2,684.20', change: '+22.30', changePercent: 0.84, isUp: true },
  { id: 'NSE:NIFTY50', symbol: 'NIFTY', name: 'NIFTY 50 Index', market: 'NSE', price: '24,980.50', change: '-52.40', changePercent: -0.21, isUp: false },
  { id: 'NASDAQ:SPY', symbol: 'S&P 500', name: 'S&P 500 ETF Trust', market: 'NASDAQ', price: '5,751.10', change: '+24.60', changePercent: 0.43, isUp: true },
  { id: 'NASDAQ:QQQ', symbol: 'NASDAQ', name: 'Invesco QQQ Trust', market: 'NASDAQ', price: '489.20', change: '+3.01', changePercent: 0.62, isUp: true },
  { id: 'CRYPTO:BTCUSDT', symbol: 'BTC', name: 'Bitcoin / Tether', market: 'CRYPTO', price: '$64,250.00', change: '+$1,510.00', changePercent: 2.41, isUp: true },
  { id: 'CRYPTO:ETHUSDT', symbol: 'ETH', name: 'Ethereum / Tether', market: 'CRYPTO', price: '$3,480.00', change: '+$62.10', changePercent: 1.82, isUp: true },
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
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            {getGreeting()} — Market Intelligence Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Coverage across Nepal (NEPSE), India (NSE), US Equities, and Cryptocurrencies.
          </p>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          Last Synchronized: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* 2. MARKET PULSE (Horizontal Data Strip) */}
      <div className="terminal-panel p-3.5 space-y-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Market Pulse & Core Benchmarks
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-accent-cyan border border-border">
              Global Indices
            </span>
          </div>
          <button
            onClick={() => onNavigate('markets')}
            className="text-[11px] font-mono text-accent-cyan hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>All Markets</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {BENCHMARKS.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                const asset = getAssetById(b.id);
                if (asset) onSelectAsset(asset);
              }}
              className="p-2.5 rounded bg-surface-secondary border border-border hover:border-slate-600 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-xs group-hover:text-accent-cyan transition-colors">
                  {b.symbol}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${
                    b.isUp ? 'text-market-bullish' : 'text-market-bearish'
                  }`}
                >
                  {b.isUp ? '+' : ''}{b.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="font-mono font-bold text-slate-200 text-xs mt-1 truncate">
                {b.price}
              </div>
              <div className="text-[9px] text-slate-500 truncate mt-0.2 font-mono">
                {b.market}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MARKET ENVIRONMENT */}
      <div className="terminal-panel p-3.5 space-y-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-border">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Market Environment & Macro Regime
          </span>
          <span className="text-[10px] font-mono text-market-bullish font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-market-bullish animate-pulse" />
            Empirically Calibrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded bg-surface-secondary border border-border flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Risk Appetite</span>
              <span className="text-xs font-bold text-white mt-0.5 block">Moderate</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-accent-cyan border border-border font-bold">
              Balanced
            </span>
          </div>

          <div className="p-2.5 rounded bg-surface-secondary border border-border flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Volatility Regime</span>
              <span className="text-xs font-bold text-white mt-0.5 block">Elevated (18.2% Ann.)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-market-warning/10 text-market-warning border border-market-warning/20 font-bold">
              Compression Zone
            </span>
          </div>

          <div className="p-2.5 rounded bg-surface-secondary border border-border flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Trend Posture</span>
              <span className="text-xs font-bold text-white mt-0.5 block">Mixed / Selective</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-slate-300 border border-border font-bold">
              Stock-Specific
            </span>
          </div>
        </div>
      </div>

      {/* 4. WATCHLIST & RECENT PREDICTIONS (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monitored Watchlist */}
        <div className="terminal-panel p-3.5 space-y-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Monitored Watchlist
              </span>
              <span className="text-[10px] font-mono px-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                {watchlistItems.length}
              </span>
            </div>
            <button
              onClick={() => onNavigate('watchlist')}
              className="text-[11px] font-mono text-accent-cyan hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {watchlistItems.length > 0 ? (
            <div className="divide-y divide-border">
              {watchlistItems.slice(0, 5).map((assetId) => {
                const asset = getAssetById(assetId);
                if (!asset) return null;
                return (
                  <div
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="py-2 px-1.5 flex items-center justify-between hover:bg-surface-secondary rounded cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-xs group-hover:text-accent-cyan transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{asset.market}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate max-w-[180px] block">
                        {asset.name}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-white block">{asset.currency}</span>
                      <span className="text-[10px] text-accent-cyan font-medium">Analyze →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              <Star className="w-5 h-5 mx-auto mb-1.5 text-slate-600" />
              <span>No assets saved to watchlist yet.</span>
              <button
                onClick={() => onNavigate('markets')}
                className="block mx-auto mt-1.5 text-accent-cyan hover:underline text-[11px]"
              >
                Browse assets to monitor →
              </button>
            </div>
          )}
        </div>

        {/* Recent Model Predictions */}
        <div className="terminal-panel p-3.5 space-y-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Binary className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Latest Model Forecasts
              </span>
            </div>
            <button
              onClick={() => onNavigate('predictions')}
              className="text-[11px] font-mono text-accent-cyan hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-border">
            {recentPredictions.slice(0, 5).map((p) => {
              const asset = getAssetById(p.assetId);
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (asset) onSelectAsset(asset);
                  }}
                  className="py-2 px-1.5 flex items-center justify-between hover:bg-surface-secondary rounded cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white text-xs group-hover:text-accent-cyan transition-colors">
                        {p.symbol}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{p.market} • {p.timeframe}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.2">
                      Conf: {p.predictedConfidence}% • Exp: [{p.predictedPriceRange[0]} - {p.predictedPriceRange[1]}]
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        p.predictedDirection === 'BULLISH'
                          ? 'text-market-bullish bg-market-bullish/10'
                          : p.predictedDirection === 'BEARISH'
                          ? 'text-market-bearish bg-market-bearish/10'
                          : 'text-slate-300 bg-surface-elevated'
                      }`}
                    >
                      {p.predictedDirection}
                    </span>
                    {p.evaluated && p.outcome && (
                      <span className="block text-[9px] text-slate-500 mt-0.2">
                        {p.outcome === 'CORRECT' ? '✓ Verified' : 'Evaluated'}
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
        <div className="flex items-center justify-between pb-1.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Macro Catalysts & Event Telemetry
            </span>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-[11px] font-mono text-accent-cyan hover:text-cyan-300 flex items-center gap-1"
          >
            <span>News Stream</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-accent-cyan font-bold">🇳🇵 NEPSE • Monetary Policy Review</span>
              <span className="text-slate-500">Scheduled</span>
            </div>
            <h4 className="text-xs font-bold text-white font-mono">
              Nepal Rastra Bank Liquidity & CD Ratio Status
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Interbank rates steady at 3.0%. Commercial banks report credit expansion in commercial and energy sectors with positive CD ratios.
            </p>
          </div>

          <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-accent-cyan font-bold">🇮🇳 NSE • Monetary Policy Committee</span>
              <span className="text-slate-500">Live</span>
            </div>
            <h4 className="text-xs font-bold text-white font-mono">
              RBI MPC Keeps Repo Rate Unchanged at 6.50%
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Monetary policy stance maintained as 'withdrawal of accommodation'. Bank NIFTY and industrial staples trade with selective institutional inflows.
            </p>
          </div>

          <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-accent-cyan font-bold">🇺🇸 US Equities • FOMC Rate Path</span>
              <span className="text-slate-500">Upcoming</span>
            </div>
            <h4 className="text-xs font-bold text-white font-mono">
              Federal Reserve Easing Cycle & Core PCE Trends
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Semiconductor demand resilience balances cautious corporate guidance across discretionary sectors.
            </p>
          </div>

          <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-accent-cyan font-bold">₿ Crypto • Institutional Flows</span>
              <span className="text-slate-500">Continuous</span>
            </div>
            <h4 className="text-xs font-bold text-white font-mono">
              Institutional Spot ETF Custody Accumulation
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Bitcoin exchange reserves drop to multi-year lows as institutional custody inflows continue. Volatility compression signals potential directional breakout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
