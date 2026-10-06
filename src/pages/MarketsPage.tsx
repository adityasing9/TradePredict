import React, { useState } from 'react';
import { Asset, Market, AssetType } from '../types/asset';
import { ALL_ASSETS, filterAssets, SUPPORTED_MARKETS } from '../data/universe';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import { Search, Star, Filter, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

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
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-background-border pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white font-mono tracking-tight">
            Market Asset Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Searchable registry across Nepal (NEPSE), India (NSE), US Equities, and Cryptocurrencies.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> of {ALL_ASSETS.length} assets
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-background-card p-3 rounded-xl border border-background-border">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by symbol, company name, or sector..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background-secondary border border-background-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>

        {/* Market Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setSelectedMarket('ALL')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              selectedMarket === 'ALL'
                ? 'bg-brand-500 text-white font-bold'
                : 'bg-background-secondary text-slate-400 hover:text-white border border-background-border'
            }`}
          >
            All Markets
          </button>
          {SUPPORTED_MARKETS.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMarket(m.key)}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                selectedMarket === m.key
                  ? 'bg-brand-500 text-white font-bold'
                  : 'bg-background-secondary text-slate-400 hover:text-white border border-background-border'
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
              className={`px-2 py-1 rounded text-[11px] transition-colors ${
                selectedType === t
                  ? 'bg-background-elevated text-brand-400 border border-brand-500/40 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Table / Cards */}
      <div className="bg-background-card rounded-xl border border-background-border overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-background-secondary border-b border-background-border text-slate-400 uppercase text-[10px]">
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
            <tbody className="divide-y divide-background-border/60">
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
                    className="hover:bg-background-elevated transition-colors group cursor-pointer"
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
                        className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                        title={watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star
                          className={`w-4 h-4 ${watched ? 'fill-amber-400 text-amber-400' : ''}`}
                        />
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white group-hover:text-brand-400 transition-colors">
                        {asset.symbol}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {asset.name}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-background-secondary border border-background-border text-slate-300 text-[10px]">
                        {asset.market}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 truncate max-w-[160px]">
                      {asset.sector}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-white">
                      {asset.currency} {baseline.price.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isUp ? 'text-emerald-400' : 'text-rose-400'
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
                        className="px-2.5 py-1 rounded bg-brand-500/10 hover:bg-brand-500 hover:text-white border border-brand-500/30 text-brand-400 transition-colors inline-flex items-center gap-1 font-semibold"
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
      </div>
    </div>
  );
};
