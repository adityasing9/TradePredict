import React, { useState } from 'react';
import { Asset, Market, AssetType } from '../types/asset';
import { ALL_ASSETS, filterAssets, SUPPORTED_MARKETS } from '../data/universe';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import { Search, Star, TrendingUp, TrendingDown, ArrowUpRight, Compass, Filter } from 'lucide-react';

interface MarketsPageProps {
  onSelectAsset: (asset: Asset) => void;
  isWatched: (assetId: string) => boolean;
  onToggleWatchlist: (assetId: string) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({
  onSelectAsset,
  isWatched,
  onToggleWatchlist
}) => {
  const [selectedMarket, setSelectedMarket] = useState<Market | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<AssetType | 'ALL'>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique sectors for the sector filter
  const sectors = ['ALL', ...Array.from(new Set(ALL_ASSETS.map((a) => a.sector)))];

  const filtered = filterAssets({
    market: selectedMarket,
    assetType: selectedType,
    sector: selectedSector,
    searchQuery
  });

  return (
    <div className="space-y-5">
      {/* 1. TITLE & SUMMARY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-background-border pb-3">
        <div>
          <h1 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-400" />
            <span>Market Asset Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional coverage across Nepal (NEPSE), India (NSE), US Equities, and Cryptocurrencies.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1 rounded-lg border border-background-border w-fit">
          Showing <span className="text-white font-bold">{filtered.length}</span> / {ALL_ASSETS.length} assets
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="terminal-panel p-3 space-y-3">
        {/* Top: Search bar & Market Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbol, company name, crypto, or exchange..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background-secondary border border-background-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono transition-colors"
            />
          </div>

          {/* Market Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedMarket('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                selectedMarket === 'ALL'
                  ? 'bg-brand-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              All
            </button>
            {SUPPORTED_MARKETS.map((m) => (
              <button
                key={m.key}
                onClick={() => setSelectedMarket(m.key)}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
                  selectedMarket === m.key
                    ? 'bg-brand-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{m.flag}</span>
                <span>{m.key}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary: Type & Sector filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-background-border text-xs font-mono">
          {/* Asset Type */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500 uppercase mr-1">Type:</span>
            {(['ALL', 'STOCK', 'CRYPTO', 'INDEX', 'ETF'] as (AssetType | 'ALL')[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  selectedType === t
                    ? 'bg-white/[0.1] text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sector Selector */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[10px] text-slate-500 uppercase mr-1">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-background-secondary border border-background-border text-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-500"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Sectors' : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. DESKTOP VIEW: High-density Table */}
      <div className="hidden md:block terminal-panel overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/[0.02] border-b border-background-border text-slate-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-3 w-8"></th>
              <th className="py-2.5 px-3">Asset</th>
              <th className="py-2.5 px-3">Market / Exchange</th>
              <th className="py-2.5 px-3">Sector</th>
              <th className="py-2.5 px-3 text-right">Last Price</th>
              <th className="py-2.5 px-3 text-right">24h Change</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-border">
            {filtered.map((asset) => {
              const watched = isWatched(asset.id);
              const baseline = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 0 };
              const changePct = Number(
                ((baseline.dailyChange / (baseline.price - baseline.dailyChange)) * 100).toFixed(2)
              );
              const isUp = changePct >= 0;

              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <td
                    className="py-2.5 px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(asset.id);
                    }}
                  >
                    <button
                      className="p-1 rounded text-slate-500 hover:text-amber-400 transition-colors"
                      title={watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          watched ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="font-bold text-white group-hover:text-brand-300 transition-colors block">
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[200px] block">
                      {asset.name}
                    </span>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="text-slate-300">{asset.market}</span>
                    <span className="text-slate-500 text-[10px] block">{asset.exchange}</span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-400 truncate max-w-[150px]">
                    {asset.sector}
                  </td>

                  <td className="py-2.5 px-3 text-right font-bold text-white">
                    {asset.currency} {baseline.price.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isUp ? '+' : ''}{changePct}%
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAsset(asset);
                      }}
                      className="px-2.5 py-1 rounded bg-brand-500/15 hover:bg-brand-500 hover:text-white text-brand-300 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
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

      {/* 4. MOBILE VIEW: Compact Cards */}
      <div className="md:hidden space-y-2">
        {filtered.map((asset) => {
          const watched = isWatched(asset.id);
          const baseline = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 0 };
          const changePct = Number(
            ((baseline.dailyChange / (baseline.price - baseline.dailyChange)) * 100).toFixed(2)
          );
          const isUp = changePct >= 0;

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="p-3 rounded-lg terminal-panel flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(asset.id);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-amber-400"
                >
                  <Star className={`w-4 h-4 ${watched ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-white text-xs">{asset.symbol}</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-white/[0.04] text-slate-400">
                      {asset.market}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{asset.name}</p>
                </div>
              </div>

              <div className="text-right font-mono shrink-0">
                <div className="text-xs font-bold text-white">
                  {asset.currency} {baseline.price.toLocaleString()}
                </div>
                <div
                  className={`text-[10px] font-bold ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? '+' : ''}{changePct}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
