import React, { useState, useEffect } from 'react';
import {
  Pin,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Plus,
  Search,
  X,
  Binary,
  BarChart2,
  Sparkles,
  Activity
} from 'lucide-react';
import { Asset, Market } from '../../types/asset';
import { Quote } from '../../types/marketData';
import { getAssetById, ALL_ASSETS, filterAssets } from '../../data/universe';
import {
  ASSET_PRICE_BASELINES,
  getMarketQuote,
  subscribeToLiveQuote
} from '../../services/marketDataProvider';

interface PinnedAssetsGridProps {
  pinnedIds: string[];
  onSelectAsset: (asset: Asset) => void;
  onNavigate: (page: string) => void;
  onTogglePin?: (assetId: string) => void;
}

interface PinnedCardProps {
  assetId: string;
  onSelect: (asset: Asset) => void;
  onNavigate: (page: string) => void;
  onTogglePin?: (assetId: string) => void;
}

function formatCurrency(val: number, currency: string): string {
  const symbol =
    currency === 'USD' || currency === 'USDT' ? '$' :
    currency === 'INR' ? '₹' :
    currency === 'NPR' ? 'NPR ' : '';

  if (val >= 1000) {
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (val >= 1) {
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  }
}

function formatVolume(val: number): string {
  if (!val || val === 0) return '—';
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toLocaleString();
}

const PinnedCard: React.FC<PinnedCardProps> = ({
  assetId,
  onSelect,
  onNavigate,
  onTogglePin
}) => {
  const asset = getAssetById(assetId);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [flash, setFlash] = useState<'UP' | 'DOWN' | null>(null);

  if (!asset) return null;

  const baseline = ASSET_PRICE_BASELINES[asset.id] || {
    price: 100,
    dailyChange: 0,
    high: 105,
    low: 95,
    vol: 1000000
  };

  const currentPrice = quote?.price ?? baseline.price;
  const changeValue = quote?.change ?? baseline.dailyChange;
  const changePercent = quote?.changePercent ?? (baseline.price ? (baseline.dailyChange / baseline.price) * 100 : 0);
  const isUp = changePercent >= 0;
  const dayHigh = quote?.high24h ?? baseline.high;
  const dayLow = quote?.low24h ?? baseline.low;
  const volume24h = quote?.volume24h ?? baseline.vol;

  // Day range progress calculation (0% to 100%)
  const rangeSpan = dayHigh - dayLow;
  const rangePercent = rangeSpan > 0
    ? Math.max(0, Math.min(100, ((currentPrice - dayLow) / rangeSpan) * 100))
    : 50;

  useEffect(() => {
    let isMounted = true;
    let prevPrice = currentPrice;

    getMarketQuote(asset, true).then((q) => {
      if (isMounted) setQuote(q);
    });

    const unsub = subscribeToLiveQuote(asset, (newQuote) => {
      if (!isMounted) return;
      if (newQuote.price > prevPrice) {
        setFlash('UP');
        setTimeout(() => setFlash(null), 700);
      } else if (newQuote.price < prevPrice) {
        setFlash('DOWN');
        setTimeout(() => setFlash(null), 700);
      }
      prevPrice = newQuote.price;
      setQuote(newQuote);
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [asset.id]);

  const flag =
    asset.market === 'NEPSE' ? '🇳🇵' :
    asset.market === 'NSE' ? '🇮🇳' :
    asset.market === 'NASDAQ' ? '🇺🇸' : '₿';

  const marketBadge =
    asset.market === 'NEPSE'
      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
      : asset.market === 'NSE'
      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25'
      : asset.market === 'NASDAQ'
      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25'
      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';

  // Bias indicator tag
  const bias =
    changePercent >= 2.0
      ? { label: 'STRONG MOMENTUM', style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30' }
      : changePercent > 0.4
      ? { label: 'BULLISH BIAS', style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25' }
      : changePercent > -0.4 && changePercent <= 0.4
      ? { label: 'CONSOLIDATION', style: 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 border-cyan-500/25' }
      : changePercent > -2.0
      ? { label: 'PULLBACK ZONE', style: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/25' }
      : { label: 'BEARISH PRESSURE', style: 'text-rose-700 dark:text-rose-400 bg-rose-500/15 border-rose-500/30' };

  return (
    <div
      onClick={() => onSelect(asset)}
      className={`rounded-xl p-3.5 bg-surface border border-border hover:border-cyan-500/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between relative overflow-hidden ${
        flash === 'UP' ? 'ring-2 ring-emerald-500/60 bg-emerald-500/5' : ''
      } ${
        flash === 'DOWN' ? 'ring-2 ring-rose-500/60 bg-rose-500/5' : ''
      }`}
    >
      {/* Top market direction accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${
          isUp ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-orange-400'
        }`}
      />

      {/* Row 1: Identity & Unpin action */}
      <div>
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm shrink-0" role="img" aria-label={asset.market}>
              {flag}
            </span>
            <span className="font-mono font-black text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors tracking-tight truncate">
              {asset.symbol}
            </span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${marketBadge} shrink-0`}>
              {asset.market}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            {onTogglePin && (
              <button
                onClick={() => onTogglePin(asset.id)}
                className="p-1 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-rose-500/15 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                title="Unpin from top grid"
              >
                <Pin className="w-3.5 h-3.5 fill-cyan-500" />
              </button>
            )}
          </div>
        </div>

        {/* Company Name & Sector */}
        <div className="flex items-baseline justify-between gap-2 text-[11px] mb-2.5">
          <span className="text-slate-600 dark:text-slate-300 font-medium truncate flex-1" title={asset.name}>
            {asset.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono shrink-0">
            {asset.sector}
          </span>
        </div>

        {/* Row 2: Dominant Price & 24h Change Badge */}
        <div className="flex items-baseline justify-between gap-2 pb-2.5 border-b border-border/70">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Live Price
            </span>
            <div className="font-mono font-black text-lg text-slate-950 dark:text-white tabular-nums tracking-tight">
              {formatCurrency(currentPrice, asset.currency)}
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 font-mono font-black text-[11px] px-2 py-0.5 rounded-full border tabular-nums ${
                isUp
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
              }`}
            >
              {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isUp ? '+' : ''}{changePercent.toFixed(2)}%</span>
            </span>
            <div className={`text-[10px] font-mono font-semibold mt-0.5 ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isUp ? '+' : ''}{changeValue >= 0 ? formatCurrency(changeValue, asset.currency) : `-${formatCurrency(Math.abs(changeValue), asset.currency)}`}
            </div>
          </div>
        </div>

        {/* Row 3: Day Range Bar (Visual Detail) */}
        <div className="py-2.5 space-y-1 border-b border-border/70">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <span>Day Range</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {rangePercent.toFixed(0)}% of range
            </span>
          </div>
          
          <div className="relative h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isUp ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${rangePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono tabular-nums">
            <span className="text-slate-500">L: {formatCurrency(dayLow, asset.currency)}</span>
            <span className="text-slate-500">H: {formatCurrency(dayHigh, asset.currency)}</span>
          </div>
        </div>

        {/* Row 4: Key Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 py-2 text-[10px] font-mono">
          <div className="p-1.5 rounded bg-surface-secondary/70 border border-border/50">
            <span className="text-slate-500 block">24h Volume</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">
              {formatVolume(volume24h)} {asset.market === 'CRYPTO' ? asset.symbol.split('/')[0] : ''}
            </span>
          </div>

          <div className="p-1.5 rounded bg-surface-secondary/70 border border-border/50">
            <span className="text-slate-500 block">Posture</span>
            <span className={`font-black text-[9px] px-1 py-0.2 rounded border inline-block truncate max-w-full ${bias.style}`}>
              {bias.label}
            </span>
          </div>
        </div>
      </div>

      {/* Row 5: Action Footers */}
      <div className="pt-2 mt-1 border-t border-border/50 flex items-center justify-between gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(asset);
          }}
          className="flex-1 py-1 px-2 rounded-md bg-cyan-500/10 hover:bg-cyan-500 hover:text-white text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
        >
          <BarChart2 className="w-3 h-3" />
          <span>Analyze</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(asset);
            onNavigate('prediction');
          }}
          className="py-1 px-2 rounded-md bg-surface-secondary hover:bg-surface-tertiary border border-border text-slate-700 dark:text-slate-300 text-[10px] font-mono font-semibold transition-all flex items-center justify-center gap-1"
          title="Jump to AI Prediction Scenarios"
        >
          <Binary className="w-3 h-3 text-cyan-500" />
          <span>Forecast</span>
        </button>
      </div>
    </div>
  );
};

export const PinnedAssetsGrid: React.FC<PinnedAssetsGridProps> = ({
  pinnedIds,
  onSelectAsset,
  onNavigate,
  onTogglePin
}) => {
  const [marketFilter, setMarketFilter] = useState<Market | 'ALL'>('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [searchAddQuery, setSearchAddQuery] = useState('');

  // Resolve pinned asset objects
  const pinnedAssets = pinnedIds
    .map((id) => getAssetById(id))
    .filter((a): a is Asset => Boolean(a));

  const filteredPinned = pinnedAssets.filter((a) => {
    if (marketFilter === 'ALL') return true;
    return a.market === marketFilter;
  });

  // Assets available to add (not yet pinned)
  const addCandidates = isAdding
    ? filterAssets({ searchQuery: searchAddQuery })
        .filter((a) => !pinnedIds.includes(a.id))
        .slice(0, 6)
    : [];

  // Recommended default pins if none pinned
  const recommendedPins = [
    'NEPSE:NABIL',
    'NEPSE:HBL',
    'NSE:RELIANCE',
    'NSE:NIFTY50',
    'CRYPTO:BTCUSDT',
    'CRYPTO:ETHUSDT',
    'NASDAQ:NVDA',
    'NASDAQ:AAPL'
  ];

  return (
    <div className="terminal-panel p-3.5 space-y-3">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
            <Pin className="w-3.5 h-3.5 fill-cyan-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Pinned Assets Radar
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/30">
                {pinnedAssets.length} {pinnedAssets.length === 1 ? 'Asset' : 'Assets'} Active
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>REAL-TIME</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Live price feeds, day range telemetry, and quantitative posture for your pinned securities.
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Add Pin Toggle */}
          {onTogglePin && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border transition-all flex items-center gap-1.5 ${
                isAdding
                  ? 'bg-cyan-500 text-white border-cyan-500 shadow-xs'
                  : 'bg-surface hover:bg-surface-secondary border-border text-slate-700 dark:text-slate-300'
              }`}
            >
              {isAdding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3 text-cyan-500" />}
              <span>{isAdding ? 'Close' : 'Pin Asset'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('markets')}
            className="text-[11px] font-mono font-bold text-accent-cyan hover:underline flex items-center gap-1 transition-colors"
          >
            <span>Catalog</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Quick-Pin Drawer (if user clicks 'Pin Asset') */}
      {isAdding && onTogglePin && (
        <div className="p-3 rounded-lg bg-surface-secondary border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-500" />
              <span>Search any ticker to pin to top grid:</span>
            </span>
            <span className="text-[10px] text-slate-500">Press pin to add</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchAddQuery}
              onChange={(e) => setSearchAddQuery(e.target.value)}
              placeholder="Type symbol or name (e.g. HBL, NABIL, NVDA, RELIANCE, BTC)..."
              autoFocus
              className="w-full pl-3 pr-8 py-1.5 rounded-md bg-surface border border-border text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchAddQuery && (
              <button
                onClick={() => setSearchAddQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick matches */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {addCandidates.length > 0 ? (
              addCandidates.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => {
                    onTogglePin(cand.id);
                    setSearchAddQuery('');
                  }}
                  className="px-2 py-1 rounded bg-surface hover:bg-cyan-500/20 border border-border hover:border-cyan-500/50 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Plus className="w-3 h-3 text-cyan-500" />
                  <span>{cand.symbol}</span>
                  <span className="text-[9px] text-slate-500">({cand.market})</span>
                </button>
              ))
            ) : searchAddQuery ? (
              <span className="text-xs font-mono text-slate-500 py-1">
                No matching unpinned assets found for "{searchAddQuery}".
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* 3. Market Filter Strip (if more than 3 pinned assets) */}
      {pinnedAssets.length > 3 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
          <span className="text-slate-500 font-semibold text-[10px] uppercase shrink-0">Filter:</span>
          {(['ALL', 'NEPSE', 'NSE', 'NASDAQ', 'CRYPTO'] as const).map((m) => {
            const count = m === 'ALL' ? pinnedAssets.length : pinnedAssets.filter((a) => a.market === m).length;
            if (m !== 'ALL' && count === 0) return null;

            return (
              <button
                key={m}
                onClick={() => setMarketFilter(m)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all shrink-0 ${
                  marketFilter === m
                    ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 shadow-2xs'
                    : 'bg-surface hover:bg-surface-secondary text-slate-600 dark:text-slate-400 border-border'
                }`}
              >
                {m} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* 4. PINNED GRID */}
      {filteredPinned.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredPinned.map((asset) => (
            <PinnedCard
              key={asset.id}
              assetId={asset.id}
              onSelect={onSelectAsset}
              onNavigate={onNavigate}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      ) : pinnedAssets.length > 0 ? (
        <div className="p-6 text-center text-xs font-mono text-slate-500">
          No pinned assets match the selected market filter "{marketFilter}".
        </div>
      ) : (
        /* Empty State with 1-click Pin suggestions */
        <div className="p-6 rounded-xl border border-dashed border-border bg-surface-secondary/40 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 flex items-center justify-center mx-auto">
            <Pin className="w-5 h-5" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
              No Assets Pinned to Front Page Yet
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Pin your key stocks, crypto, or indices for instant real-time telemetry, day ranges, and quantitative signals right at the top.
            </p>
          </div>

          {onTogglePin && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Quick 1-Click Pin Suggestions:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {recommendedPins.map((id) => {
                  const asset = getAssetById(id);
                  if (!asset) return null;

                  return (
                    <button
                      key={id}
                      onClick={() => onTogglePin(id)}
                      className="px-2.5 py-1 rounded-md bg-surface hover:bg-cyan-500/15 border border-border hover:border-cyan-500/40 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-cyan-500" />
                      <span>{asset.symbol}</span>
                      <span className="text-[10px] text-slate-500">({asset.market})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
