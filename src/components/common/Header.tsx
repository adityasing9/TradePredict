import React, { useState } from 'react';
import { Search, Sparkles, Moon, Sun, Monitor, Menu, X, Settings as SettingsIcon, Database, ArrowRight } from 'lucide-react';
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
  onToggleSidebar
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
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-background-border px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 select-none">
      {/* LEFT: Mobile toggle & Brand */}
      <div className="flex items-center gap-3 shrink-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div
          onClick={() => onSelectMarket('ALL')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-mono font-black text-xs shadow-panel">
            TP
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-sm tracking-wide text-white font-mono group-hover:text-brand-300 transition-colors">
              TradePredict
            </span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
              AI
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: Global Search */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.03] border border-background-border hover:border-slate-600 text-xs text-slate-400 transition-colors group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
            <span className="truncate">Search stocks, crypto, indices (e.g. NABIL, RELIANCE, BTC)...</span>
          </div>
          <kbd className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-400 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* RIGHT: Market Status, AI, Theme, Settings, DB indicator */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Market Status (compact) */}
        <div className="hidden lg:block">
          <MarketStatus compact />
        </div>

        {/* Offline Badge */}
        <OfflineBadge isOnline={isOnline} offlineSince={offlineSince} />

        {/* AI Analyst Trigger */}
        <button
          onClick={onToggleChat}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-mono font-semibold transition-colors"
          title="Open AI Analyst Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span className="hidden sm:inline">AI Analyst</span>
        </button>

        {/* Theme Toggle (Dark / Light / System) */}
        <button
          onClick={handleNextTheme}
          className="p-1.5 rounded-lg bg-white/[0.03] border border-background-border hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
          title={`Current Theme: ${theme.toUpperCase()} (Click to toggle)`}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-brand-300" />
          ) : theme === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Monitor className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Settings Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-white/[0.03] border border-background-border hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
            title="Application Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        )}

        {/* Local Storage Indicator */}
        <div
          className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.02] border border-background-border text-[10px] font-mono text-slate-500"
          title="All market models and predictions are saved locally in IndexedDB"
        >
          <Database className="w-3 h-3 text-emerald-400" />
          <span>Local Engine</span>
        </div>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-xl bg-background-card border border-white/[0.1] rounded-xl shadow-modal overflow-hidden animate-in zoom-in-95 duration-100">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-background-border">
              <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol, company name, crypto, or exchange..."
                autoFocus
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 font-mono"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick suggested assets if input is empty */}
            {!searchQuery.trim() && (
              <div className="p-3 border-b border-background-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2 px-1">
                  Popular Benchmarks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['NEPSE:NEPSE', 'NSE:RELIANCE', 'NASDAQ:AAPL', 'CRYPTO:BTCUSDT', 'CRYPTO:ETHUSDT'].map((id) => {
                    const asset = ALL_ASSETS.find((a) => a.id === id);
                    if (!asset) return null;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => {
                          onSelectAsset(asset);
                          setSearchOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] hover:border-brand-500/50 hover:bg-brand-500/10 text-xs font-mono text-slate-300 hover:text-brand-300 transition-colors flex items-center gap-1.5"
                      >
                        <span className="font-bold">{asset.symbol}</span>
                        <span className="text-[10px] text-slate-500">{asset.market}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search Results list */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      onSelectAsset(asset);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.04] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white group-hover:text-brand-300 transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-xs text-slate-400 truncate max-w-[240px]">
                        {asset.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                        {asset.market}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{asset.currency}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-400 transition-colors" />
                    </div>
                  </button>
                ))
              ) : searchQuery.trim() ? (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
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
