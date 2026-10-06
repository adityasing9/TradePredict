import React, { useState } from 'react';
import { Asset, Market, AssetType } from '../types/asset';
import { ALL_ASSETS, filterAssets, SUPPORTED_MARKETS } from '../data/universe';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import { Search, Star, TrendingUp, TrendingDown, ArrowUpRight, Compass, Pin } from 'lucide-react';

interface MarketsPageProps {
  onSelectAsset: (asset: Asset) => void;
  isWatched: (assetId: string) => boolean;
  onToggleWatchlist: (assetId: string) => void;
  isPinned?: (assetId: string) => boolean;
  onTogglePin?: (assetId: string) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({
  onSelectAsset,
  isWatched,
  onToggleWatchlist,
  isPinned,
  onTogglePin
}) => {
  const [selectedMarket, setSelectedMarket] = useState<Market | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<AssetType | 'ALL'>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'PINNED' | 'WATCHLIST'>('ALL');

  const sectors = ['ALL', ...Array.from(new Set(ALL_ASSETS.map((a) => a.sector)))];

  let filtered = filterAssets({
    market: selectedMarket,
    assetType: selectedType,
    sector: selectedSector,
    searchQuery
  });

  if (scopeFilter === 'PINNED' && isPinned) {
    filtered = filtered.filter((a) => isPinned(a.id));
  } else if (scopeFilter === 'WATCHLIST') {
    filtered = filtered.filter((a) => isWatched(a.id));
  } else if (isPinned) {
    // Sort pinned assets towards the top for fast discovery
    filtered = [...filtered].sort((a, b) => {
      const aPin = isPinned(a.id) ? 1 : 0;
      const bPin = isPinned(b.id) ? 1 : 0;
      return bPin - aPin;
    });
  }

  return (
    <div className="space-y-4">
      {/* 1. TITLE & SUMMARY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-500" />
            <span>Market Asset Catalog & Telemetry</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono">
            Coverage across Nepal (NEPSE), India (NSE), US Equities, and Cryptocurrencies.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-surface px-3 py-1.5 rounded-md border border-border shadow-xs w-fit">
          Showing <span className="text-slate-950 dark:text-white font-black">{filtered.length}</span> / {ALL_ASSETS.length} assets
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="terminal-panel p-3.5 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbol, company name, crypto, or exchange..."
              className="w-full pl-9 pr-3 py-1.5 rounded-md bg-surface-secondary border border-border text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-cyan font-mono transition-colors shadow-xs"
            />
          </div>

          {/* Market Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedMarket('ALL')}
              className={`px-3 py-1 rounded-md transition-all font-bold shrink-0 ${
                selectedMarket === 'ALL'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs force-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-secondary'
              }`}
            >
              All Markets
            </button>
            {SUPPORTED_MARKETS.map((m) => {
              const isActive = selectedMarket === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setSelectedMarket(m.key)}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all font-bold shrink-0 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-secondary'
                  }`}
                >
                  <span>{m.flag}</span>
                  <span>{m.key}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary: Type & Sector filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black mr-1">View:</span>
            <button
              onClick={() => setScopeFilter('ALL')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                scopeFilter === 'ALL'
                  ? 'bg-surface-secondary text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setScopeFilter('PINNED')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
                scopeFilter === 'PINNED'
                  ? 'bg-cyan-500/15 text-cyan-600 dark:text-accent-cyan border border-cyan-500/40 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Pin className="w-3 h-3 fill-cyan-500 text-cyan-500" />
              <span>Pinned</span>
            </button>
            <button
              onClick={() => setScopeFilter('WATCHLIST')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
                scopeFilter === 'WATCHLIST'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>Watchlist</span>
            </button>

            <span className="text-slate-400 mx-1">|</span>

            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black mr-1">Type:</span>
            {(['ALL', 'STOCK', 'CRYPTO', 'INDEX', 'ETF'] as (AssetType | 'ALL')[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  selectedType === t
                    ? 'bg-surface-secondary text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black mr-1">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-surface-secondary border border-border text-slate-800 dark:text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-accent-cyan font-mono shadow-xs font-semibold"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. ASSETS TABLE (DESKTOP) */}
      <div className="terminal-panel overflow-hidden hidden md:block">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-secondary border-b border-border text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-wider">
            <tr>
              <th className="py-2.5 px-2 w-8 text-center" title="Pin to top bar">Pin</th>
              <th className="py-2.5 px-2 w-8 text-center" title="Save to watchlist">Watch</th>
              <th className="py-2.5 px-3">Symbol & Name</th>
              <th className="py-2.5 px-3">Market</th>
              <th className="py-2.5 px-3">Sector</th>
              <th className="py-2.5 px-3 text-right">Last Price</th>
              <th className="py-2.5 px-3 text-right">24h Change</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((asset) => {
              const baseline = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 0, high: 100, low: 100, vol: 1000 };
              const changePercent = baseline.price ? (baseline.dailyChange / baseline.price) * 100 : 0;
              const isUp = baseline.dailyChange >= 0;
              const changePct = Math.abs(changePercent).toFixed(2);
              const watched = isWatched(asset.id);
              const pinned = isPinned ? isPinned(asset.id) : false;

              const marketBadge =
                asset.market === 'NEPSE'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                  : asset.market === 'NSE'
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25'
                  : asset.market === 'NASDAQ'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';

              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-surface-secondary/80 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                    {onTogglePin && (
                      <button
                        onClick={() => onTogglePin(asset.id)}
                        className={`p-1 rounded transition-colors ${
                          pinned
                            ? 'text-cyan-500 fill-cyan-500 hover:text-cyan-400'
                            : 'text-slate-400 hover:text-cyan-500'
                        }`}
                        title={pinned ? 'Unpin from Quick Bar' : 'Pin to Quick Bar'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-cyan-500' : ''}`} />
                      </button>
                    )}
                  </td>

                  <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleWatchlist(asset.id)}
                      className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
                      title={watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          watched ? 'fill-amber-500 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-950 dark:text-white group-hover:text-accent-cyan transition-colors text-xs">
                        {asset.symbol}
                      </span>
                      {pinned && (
                        <span
                          className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-0.5"
                          title="Pinned to Quick Bar"
                        >
                          <Pin className="w-2.5 h-2.5 fill-cyan-500" />
                          <span>PINNED</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[200px] block font-medium">
                      {asset.name}
                    </span>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className={`inline-block px-1.5 py-0.2 rounded border text-[9px] font-bold ${marketBadge}`}>
                      {asset.market}
                    </span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">{asset.exchange}</span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 truncate max-w-[150px] font-medium">
                    {asset.sector}
                  </td>

                  <td className="py-2.5 px-3 text-right font-black text-slate-950 dark:text-white tabular-nums">
                    {asset.currency} {baseline.price.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-black px-2 py-0.5 rounded-full text-[10px] ${
                        isUp
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30'
                          : 'text-rose-700 dark:text-rose-300 bg-rose-500/15 border border-rose-500/30'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isUp ? '+' : '-'}{changePct}%
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAsset(asset);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500 hover:text-white text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 transition-all inline-flex items-center gap-1 text-[11px] font-bold shadow-xs"
                    >
                      <span>Analyze</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. ASSETS LIST (MOBILE CARDS) */}
      <div className="md:hidden space-y-2">
        {filtered.map((asset) => {
          const baseline = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 0, high: 100, low: 100, vol: 1000 };
          const changePercent = baseline.price ? (baseline.dailyChange / baseline.price) * 100 : 0;
          const isUp = baseline.dailyChange >= 0;
          const changePct = Math.abs(changePercent).toFixed(2);
          const watched = isWatched(asset.id);
          const pinned = isPinned ? isPinned(asset.id) : false;

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="p-3 rounded-lg terminal-panel flex items-center justify-between gap-2.5 cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleWatchlist(asset.id)}
                    className="p-1 rounded text-slate-400 hover:text-amber-500"
                    title={watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    <Star className={`w-3.5 h-3.5 ${watched ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                  {onTogglePin && (
                    <button
                      onClick={() => onTogglePin(asset.id)}
                      className={`p-1 rounded ${
                        pinned ? 'text-cyan-500 fill-cyan-500' : 'text-slate-400 hover:text-cyan-500'
                      }`}
                      title={pinned ? 'Unpin ticker' : 'Pin ticker'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-cyan-500' : ''}`} />
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-slate-950 dark:text-white text-xs">{asset.symbol}</span>
                    <span className="text-[9px] font-mono font-bold px-1 rounded bg-surface-secondary text-slate-600 dark:text-slate-400 border border-border">
                      {asset.market}
                    </span>
                    {pinned && (
                      <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                        PINNED
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate mt-0.5">{asset.name}</p>
                </div>
              </div>

              <div className="text-right font-mono shrink-0">
                <div className="text-xs font-black text-slate-950 dark:text-white">
                  {asset.currency} {baseline.price.toLocaleString()}
                </div>
                <div
                  className={`text-[10px] font-black mt-0.5 ${
                    isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isUp ? '+' : '-'}{changePct}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
