import React, { useState, useEffect } from 'react';
import { Pin, PinOff, Plus, ChevronUp, ChevronDown, X, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { Asset } from '../../types/asset';
import { Quote } from '../../types/marketData';
import { getAssetById, ALL_ASSETS } from '../../data/universe';
import { ASSET_PRICE_BASELINES, getMarketQuote, subscribeToLiveQuote } from '../../services/marketDataProvider';

interface PinnedTickerBarProps {
  pinnedIds: string[];
  activeAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
  onTogglePin: (assetId: string) => void;
  isPinned: (assetId: string) => boolean;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

interface TickerItemProps {
  asset: Asset;
  isActive: boolean;
  onSelect: () => void;
  onUnpin: (e: React.MouseEvent) => void;
}

const TickerItem: React.FC<TickerItemProps> = ({ asset, isActive, onSelect, onUnpin }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [flash, setFlash] = useState<'UP' | 'DOWN' | null>(null);

  const baseline = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 0 };
  const currentPrice = quote?.price ?? baseline.price;
  const changePercent = quote?.changePercent ?? (baseline.price ? (baseline.dailyChange / baseline.price) * 100 : 0);
  const isUp = changePercent >= 0;

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
        setTimeout(() => setFlash(null), 800);
      } else if (newQuote.price < prevPrice) {
        setFlash('DOWN');
        setTimeout(() => setFlash(null), 800);
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

  return (
    <div
      onClick={onSelect}
      className={`relative group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer shrink-0 border ${
        isActive
          ? 'bg-cyan-500/15 border-cyan-500 text-slate-900 dark:text-white shadow-xs font-bold'
          : 'bg-surface hover:bg-surface-secondary border-border hover:border-slate-400 dark:hover:border-slate-500 text-slate-800 dark:text-slate-200'
      } ${
        flash === 'UP' ? 'ring-1 ring-emerald-500 bg-emerald-500/20' : ''
      } ${
        flash === 'DOWN' ? 'ring-1 ring-rose-500 bg-rose-500/20' : ''
      }`}
      title={`${asset.name} (${asset.exchange}) — Click to view`}
    >
      <span className="text-[11px] shrink-0">{flag}</span>
      <span className="font-black text-[11px] tracking-tight">{asset.symbol}</span>

      <span className="text-[11px] font-bold tabular-nums text-slate-900 dark:text-white">
        {asset.currency === 'USD' || asset.currency === 'USDT' ? '$' : ''}
        {currentPrice.toLocaleString(undefined, {
          minimumFractionDigits: currentPrice < 10 ? 4 : 2,
          maximumFractionDigits: currentPrice < 10 ? 4 : 2
        })}
      </span>

      <span
        className={`flex items-center text-[10px] font-black tabular-nums ${
          isUp ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
        }`}
      >
        {isUp ? '+' : ''}{changePercent.toFixed(2)}%
      </span>

      {/* Unpin button on hover */}
      <button
        onClick={onUnpin}
        className="opacity-0 group-hover:opacity-100 p-0.5 ml-0.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-opacity"
        title="Unpin ticker"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export const PinnedTickerBar: React.FC<PinnedTickerBarProps> = ({
  pinnedIds,
  activeAsset,
  onSelectAsset,
  onTogglePin,
  isPinned,
  isVisible,
  onToggleVisibility
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const activeIsPinned = isPinned(activeAsset.id);

  const pinnedAssets = pinnedIds
    .map((id) => getAssetById(id))
    .filter((a): a is Asset => a !== undefined);

  const unpinnedAssets = ALL_ASSETS.filter((a) => !pinnedIds.includes(a.id)).filter((a) => {
    if (!pickerSearch.trim()) return true;
    const q = pickerSearch.toLowerCase().trim();
    return (
      a.symbol.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.market.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  if (!isVisible) {
    return (
      <div className="w-full bg-background-deep border-b border-border px-3 py-0.5 flex items-center justify-between text-[10px] font-mono select-none">
        <button
          onClick={onToggleVisibility}
          className="flex items-center gap-1.5 text-slate-500 hover:text-accent-cyan transition-colors"
          title="Show Pinned Quick Ticker Bar"
        >
          <Pin className="w-3 h-3 text-cyan-500" />
          <span>Show Pinned Tickers ({pinnedIds.length})</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-background-deep/95 border-b border-border px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto select-none no-scrollbar">
      {/* LEFT: Pinned Label & Tickers list */}
      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto no-scrollbar">
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono font-black text-cyan-600 dark:text-accent-cyan shrink-0"
          title="Pinned Tickers Quick Access Bar"
        >
          <Pin className="w-3 h-3 fill-cyan-500 text-cyan-500" />
          <span className="hidden sm:inline">PINNED</span>
          <span className="text-slate-500">({pinnedAssets.length})</span>
        </div>

        {/* List of Pinned Tickers */}
        {pinnedAssets.map((asset) => (
          <TickerItem
            key={asset.id}
            asset={asset}
            isActive={asset.id === activeAsset.id}
            onSelect={() => onSelectAsset(asset)}
            onUnpin={(e) => {
              e.stopPropagation();
              onTogglePin(asset.id);
            }}
          />
        ))}

        {/* Quick Button to Pin Active Asset if not pinned */}
        {!activeIsPinned && (
          <button
            onClick={() => onTogglePin(activeAsset.id)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300 transition-colors shrink-0"
            title={`Pin current asset (${activeAsset.symbol}) to Quick Bar`}
          >
            <Pin className="w-3 h-3" />
            <span>+ Pin {activeAsset.symbol}</span>
          </button>
        )}

        {/* Add Pin Search Dropdown Trigger */}
        <div className="relative shrink-0">
          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-surface hover:bg-surface-secondary border border-border text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Search and pin more assets"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">Add Pin</span>
          </button>

          {/* Quick Picker Dropdown */}
          {pickerOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-surface border border-border rounded-lg shadow-modal p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center px-2 py-1 bg-surface-secondary rounded border border-border mb-1.5">
                <Search className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search to pin..."
                  autoFocus
                  className="w-full bg-transparent text-[11px] font-mono text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-500"
                />
                <button
                  onClick={() => {
                    setPickerOpen(false);
                    setPickerSearch('');
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {unpinnedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      onTogglePin(asset.id);
                      setPickerOpen(false);
                      setPickerSearch('');
                    }}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-surface-secondary text-xs font-mono cursor-pointer transition-colors group"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-accent-cyan">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1.5">
                        {asset.market}
                      </span>
                    </div>
                    <Pin className="w-3 h-3 text-slate-400 group-hover:text-accent-cyan" />
                  </div>
                ))}
                {unpinnedAssets.length === 0 && (
                  <div className="text-[10px] text-slate-500 p-2 text-center font-mono">
                    All matching assets are pinned.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Collapse / Minimize Toggle */}
      <div className="flex items-center shrink-0 pl-1 border-l border-border/60">
        <button
          onClick={onToggleVisibility}
          className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-surface transition-colors"
          title="Minimize Pinned Ticker Bar"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
