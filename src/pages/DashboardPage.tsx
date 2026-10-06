import React, { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { getAssetById, ALL_ASSETS } from '../data/universe';
import { getAllPredictions, seedInitialHistoricalPredictions } from '../db/predictionStore';
import { TrackedPrediction } from '../types/tracking';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  Activity,
  Star,
  Binary,
  Newspaper,
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink
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

  // Calculate dynamic greeting based on local time
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
    <div className="space-y-6">
      {/* 1. GREETING & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-background-border pb-4">
        <div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global market intelligence overview across Nepal (NEPSE), India (NSE), US Equities, and Cryptocurrencies.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Last Synchronized: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* 2. MARKET OVERVIEW (Compact Metric Rows) */}
      <div className="terminal-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-background-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Market Overview
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400">
              Core Benchmarks
            </span>
          </div>
          <button
            onClick={() => onNavigate('markets')}
            className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <span>All Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BENCHMARKS.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                const asset = getAssetById(b.id);
                if (asset) onSelectAsset(asset);
              }}
              className="p-3 rounded-lg bg-background-secondary border border-background-border hover:border-slate-600 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-xs group-hover:text-brand-300 transition-colors">
                  {b.symbol}
                </span>
                <span
                  className={`text-[11px] font-mono font-bold flex items-center gap-0.5 ${
                    b.isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {b.isUp ? '+' : ''}{b.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="font-mono font-semibold text-slate-200 text-xs mt-1 truncate">
                {b.price}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {b.market}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MARKET REGIME / ENVIRONMENT */}
      <div className="terminal-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-background-border">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Market Environment
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Calibrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-background-secondary border border-background-border flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Risk Appetite</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Moderate</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              Balanced
            </span>
          </div>

          <div className="p-3 rounded-lg bg-background-secondary border border-background-border flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Volatility</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Elevated</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              18.2% Ann.
            </span>
          </div>

          <div className="p-3 rounded-lg bg-background-secondary border border-background-border flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Trend Structure</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Mixed</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-500/10 text-slate-300 border border-slate-500/20 font-bold">
              Selective
            </span>
          </div>
        </div>
      </div>

      {/* 4. WATCHLIST & RECENT PREDICTIONS (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Watchlist */}
        <div className="terminal-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-background-border">
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Monitored Watchlist
              </span>
              <span className="text-[10px] font-mono px-1.5 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                {watchlistItems.length}
              </span>
            </div>
            <button
              onClick={() => onNavigate('watchlist')}
              className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {watchlistItems.length > 0 ? (
            <div className="divide-y divide-background-border">
              {watchlistItems.slice(0, 5).map((assetId) => {
                const asset = getAssetById(assetId);
                if (!asset) return null;
                return (
                  <div
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-white/[0.02] rounded cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">{asset.symbol}</span>
                        <span className="text-[10px] font-mono text-slate-500">{asset.market}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate max-w-[180px] block">
                        {asset.name}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-white block">{asset.currency}</span>
                      <span className="text-[10px] text-brand-400 font-medium">Analyze →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              <Star className="w-6 h-6 mx-auto mb-2 text-slate-600" />
              <span>No assets saved to your watchlist yet.</span>
              <button
                onClick={() => onNavigate('markets')}
                className="block mx-auto mt-2 text-brand-400 hover:underline"
              >
                Browse assets to monitor →
              </button>
            </div>
          )}
        </div>

        {/* Recent Predictions */}
        <div className="terminal-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-background-border">
            <div className="flex items-center gap-2">
              <Binary className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Recent Model Predictions
              </span>
            </div>
            <button
              onClick={() => onNavigate('predictions')}
              className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-background-border">
            {recentPredictions.slice(0, 5).map((p) => {
              const asset = getAssetById(p.assetId);
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (asset) onSelectAsset(asset);
                  }}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-white/[0.02] rounded cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs">{p.symbol}</span>
                      <span className="text-[10px] font-mono text-slate-500">{p.market} • {p.timeframe}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      Conf: {p.predictedConfidence}% • Exp: [{p.predictedPriceRange[0]} - {p.predictedPriceRange[1]}]
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        p.predictedDirection === 'BULLISH'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : p.predictedDirection === 'BEARISH'
                          ? 'text-rose-400 bg-rose-500/10'
                          : 'text-slate-300 bg-white/[0.05]'
                      }`}
                    >
                      {p.predictedDirection}
                    </span>
                    {p.evaluated && p.outcome && (
                      <span className="block text-[9px] font-mono text-slate-500 mt-0.5">
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

      {/* 5. IMPORTANT MARKET EVENTS */}
      <div className="terminal-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-background-border">
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Important Market Events & Macro Catalysts
            </span>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>News Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background-secondary border border-background-border space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-brand-400 font-bold">🇳🇵 NEPSE • Monetary Policy</span>
              <span className="text-slate-500">Scheduled Today</span>
            </div>
            <h4 className="text-xs font-bold text-white font-mono">
              Nepal Rastra Bank Liquidity & Credit Review
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Interbank rates steady at 3.0%. Commercial banks report credit expansion in commercial and energy sectors with positive CD ratios.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-background-secondary border border-background-border space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-brand-400 font-bold">🇮🇳 NSE • Macro Data</span>
              <span className="text-slate-500">Live</span>
            </div>
            <h4 className="text-xs font-bold text-white font-mono">
              RBI MPC Keeps Repo Rate Unchanged at 6.50%
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Monetary policy stance maintained as 'withdrawal of accommodation'. Bank NIFTY and industrial staples trade with selective institutional inflows.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-background-secondary border border-background-border space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-brand-400 font-bold">🇺🇸 US Equities • FOMC Rate Path</span>
              <span className="text-slate-500">Upcoming</span>
            </div>
            <h4 className="text-xs font-bold text-white font-mono">
              Federal Reserve Easing Cycle & Core PCE Trends
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Semiconductor demand resilience led by AI server architectures balances cautious corporate guidance across discretionary sectors.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-background-secondary border border-background-border space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-brand-400 font-bold">₿ Crypto • On-Chain Telemetry</span>
              <span className="text-slate-500">Continuous</span>
            </div>
            <h4 className="text-xs font-bold text-white font-mono">
              Institutional Spot ETF Accumulation & Exchange Outflows
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
