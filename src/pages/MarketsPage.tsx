import React, { useState } from 'react';
import { Asset, Market, AssetType } from '../types/asset';
import { ALL_ASSETS, filterAssets, SUPPORTED_MARKETS } from '../data/universe';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import { Search, Star, Filter, TrendingUp, TrendingDown, ArrowUpRight, Compass } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = filterAssets({
    market: selectedMarket,
    assetType: selectedType,
    searchQuery
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-400" />
            <span>Market Asset Explorer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional asset catalog across Nepal (NEPSE), India (NSE), US Equities, and Cryptocurrencies.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06] w-fit">
          Displaying <span className="text-brand-300 font-bold">{filtered.length}</span> / {ALL_ASSETS.length} assets
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 glass-card p-3.5 rounded-2xl border border-white/[0.08] shadow-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by symbol, company name, or sector..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 font-mono transition-all"
          />
        </div>

        {/* Market Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono p-1 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <button
            onClick={() => setSelectedMarket('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
              selectedMarket === 'ALL'
                ? 'bg-brand-500 text-white font-bold shadow-sm shadow-brand-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            All Markets
          </button>
          {SUPPORTED_MARKETS.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMarket(m.key)}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-150 ${
                selectedMarket === m.key
                  ? 'bg-brand-500 text-white font-bold shadow-sm shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{m.flag}</span>
              <span>{m.key}</span>
            </button>
          ))}
        </div>

        {/* Asset Type Filter */}
        <div className="flex items-center gap-1 text-xs font-mono">
          {(['ALL', 'STOCK', 'CRYPTO', 'INDEX', 'ETF'] as (AssetType | 'ALL')[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-150 ${
                selectedType === t
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Table / Cards */}
      <div className="glass-card rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Asset / Name</th>
                <th className="py-3 px-4">Market</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4 text-right">Last Price</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
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
                    className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                    onClick={() => onSelectAsset(asset)}
                  >
                    <td
                      className="py-3 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(asset.id);
                      }}
                    >
                      <button
                        className="p-1 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-white/[0.04] transition-colors"
                        title={watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star
                          className={`w-4 h-4 ${watched ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''}`}
                        />
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white group-hover:text-brand-300 transition-colors text-sm">
                        {asset.symbol}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {asset.name}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-[10px]">
                        {asset.market}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 truncate max-w-[160px]">
                      {asset.sector}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-white text-sm">
                      {asset.currency} {baseline.price.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg ${
                          isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}
                      >
                        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {isUp ? '+' : ''}{changePct}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500 hover:text-white border border-brand-500/30 text-brand-300 transition-all inline-flex items-center gap-1 font-semibold hover:shadow-glow-indigo text-[11px]"
                      >
                        <span>Analyze</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
