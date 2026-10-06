import React, { useState } from 'react';
import { Search, Sparkles, Moon, Sun, Monitor, Menu, X, Settings as SettingsIcon, Database, ArrowRight, Pin } from 'lucide-react';
import { OfflineBadge } from './OfflineBadge';
import { MarketStatus } from './MarketStatus';
import { Asset, Market } from '../../types/asset';
import { ALL_ASSETS } from '../../data/universe';

interface HeaderProps {
  isOnline: boolean;
  offlineSince: number | null;
  currentMarket: Market | 'ALL';
  onSelectMarket: (market: Market | 'ALL') => void;
  onSelectAsset: (asset: Asset) => void;
  onToggleChat: () => void;
  theme: 'dark' | 'light' | 'system';
  onSelectTheme: (theme: 'dark' | 'light' | 'system') => void;
  onOpenSettings?: () => void;
  onToggleSidebar?: () => void;
  isPinned?: (assetId: string) => boolean;
  onTogglePin?: (assetId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isOnline,
  offlineSince,
  currentMarket,
  onSelectMarket,
  onSelectAsset,
  onToggleChat,
  theme,
  onSelectTheme,
  onOpenSettings,
  onToggleSidebar,
  isPinned,
  onTogglePin
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = searchQuery.trim()
    ? ALL_ASSETS.filter((a) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          a.symbol.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.market.toLowerCase().includes(q) ||
          a.exchange.toLowerCase().includes(q) ||
          a.sector.toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  const handleNextTheme = () => {
    if (theme === 'dark') onSelectTheme('light');
    else if (theme === 'light') onSelectTheme('system');
    else onSelectTheme('dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-12 bg-background-deep/95 backdrop-blur-md border-b border-border px-3 sm:px-4 flex items-center justify-between gap-3 select-none">
      {/* LEFT: Mobile toggle & Brand Monogram */}
      <div className="flex items-center gap-2.5 shrink-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded text-slate-400 hover:text-white hover:bg-surface transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div
          onClick={() => onSelectMarket('ALL')}
          className="flex items-center gap-2 cursor-pointer group"
          title="TradePredict AI — Analyze. Predict. Understand."
        >
          <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-white font-mono font-black text-xs shadow-md shadow-cyan-500/25 shrink-0 force-white">
            TP
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white font-mono group-hover:text-accent-cyan transition-colors">
              TradePredict
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-xs force-white">
              AI
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: Compact Global Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full h-8 flex items-center justify-between px-2.5 rounded-md bg-surface border border-border hover:border-accent-cyan text-xs text-slate-600 dark:text-slate-400 transition-colors group shadow-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-accent-cyan transition-colors shrink-0" />
            <span className="truncate text-[11px] font-mono font-medium">Search stocks, crypto, indices...</span>
          </div>
          <kbd className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-secondary border border-border text-slate-500 dark:text-slate-400 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* RIGHT: Market Status, AI trigger, Theme toggle, Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Compact Market Session Dots */}
        <div className="hidden lg:block">
          <MarketStatus compact />
        </div>

        {/* Offline Badge */}
        <OfflineBadge isOnline={isOnline} offlineSince={offlineSince} />

        {/* AI Analyst Trigger */}
        <button
          onClick={onToggleChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs shadow-sm shadow-cyan-500/25 transition-all force-white"
          title="Open AI Analyst Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">AI Analyst</span>
        </button>

        {/* Theme Toggle (Dark / Light / System) */}
        <button
          onClick={handleNextTheme}
          className="p-1.5 rounded-md bg-surface border border-border hover:border-slate-500 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
          title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
        >
          {theme === 'dark' ? (
            <Moon className="w-3.5 h-3.5 text-slate-300" />
          ) : theme === 'light' ? (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Monitor className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Settings Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded bg-surface border border-border hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
            title="Application Settings"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Local Storage Indicator */}
        <div
          className="hidden xl:flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-slate-400"
          title="All market models and predictions run in browser via IndexedDB"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-market-bullish" />
          <span>Local Engine</span>
        </div>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-xl bg-surface border border-border rounded-lg shadow-modal overflow-hidden animate-in zoom-in-95 duration-100">
            {/* Search Input Bar */}
            <div className="flex items-center px-3.5 py-2.5 border-b border-border bg-surface-secondary">
              <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol, company name, crypto, or exchange..."
                autoFocus
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-500 font-mono"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-elevated"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick suggested assets */}
            {!searchQuery.trim() && (
              <div className="p-3 border-b border-border bg-surface">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2 px-1">
                  Core Benchmarks & Popular Assets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['NEPSE:NEPSE', 'NSE:RELIANCE', 'NASDAQ:AAPL', 'NASDAQ:NVDA', 'NASDAQ:META', 'CRYPTO:BTCUSDT', 'CRYPTO:NEARUSDT'].map((id) => {
                    const asset = ALL_ASSETS.find((a) => a.id === id);
                    if (!asset) return null;
                    const pinned = isPinned ? isPinned(asset.id) : false;
                    return (
                      <div
                        key={asset.id}
                        className="flex items-center gap-1 rounded bg-surface-secondary border border-border hover:border-accent-cyan/50 text-xs font-mono"
                      >
                        <button
                          onClick={() => {
                            onSelectAsset(asset);
                            setSearchOpen(false);
                          }}
                          className="px-2 py-1 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-accent-cyan transition-colors flex items-center gap-1.5"
                        >
                          <span className="font-bold">{asset.symbol}</span>
                          <span className="text-[10px] text-slate-500">{asset.market}</span>
                        </button>
                        {onTogglePin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePin(asset.id);
                            }}
                            className={`p-1 pr-1.5 transition-colors ${
                              pinned
                                ? 'text-cyan-500 fill-cyan-500 hover:text-cyan-400'
                                : 'text-slate-400 hover:text-cyan-500'
                            }`}
                            title={pinned ? 'Unpin ticker' : 'Pin ticker to quick bar'}
                          >
                            <Pin className={`w-3 h-3 ${pinned ? 'fill-cyan-500' : ''}`} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search Results list */}
            <div className="max-h-72 overflow-y-auto p-1.5">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => {
                  const pinned = isPinned ? isPinned(asset.id) : false;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => {
                        onSelectAsset(asset);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-surface-secondary text-left transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-accent-cyan transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[240px]">
                          {asset.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-elevated text-slate-700 dark:text-slate-300 border border-border">
                          {asset.market}
                        </span>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{asset.currency}</span>
                        {onTogglePin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePin(asset.id);
                            }}
                            className={`p-1 rounded hover:bg-surface-elevated transition-colors ${
                              pinned
                                ? 'text-cyan-500 hover:text-cyan-400'
                                : 'text-slate-400 hover:text-cyan-500'
                            }`}
                            title={pinned ? 'Unpin from quick bar' : 'Pin to quick bar'}
                          >
                            <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-cyan-500' : ''}`} />
                          </button>
                        )}
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-accent-cyan transition-colors" />
                      </div>
                    </div>
                  );
                })
              ) : searchQuery.trim() ? (
                <div className="p-6 text-center text-xs text-slate-500 font-mono">
                  No assets found matching "{searchQuery}".
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
