import React, { useState } from 'react';
import { Search, Sparkles, Moon, Sun, Menu, X, TrendingUp } from 'lucide-react';
import { OfflineBadge } from './OfflineBadge';
import { Asset, Market } from '../../types/asset';
import { ALL_ASSETS } from '../../data/universe';

interface HeaderProps {
  isOnline: boolean;
  offlineSince: number | null;
  currentMarket: Market | 'ALL';
  onSelectMarket: (market: Market | 'ALL') => void;
  onSelectAsset: (asset: Asset) => void;
  onToggleChat: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
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
  onToggleTheme,
  onToggleSidebar
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredAssets = query.trim()
    ? ALL_ASSETS.filter(
        (a) =>
          a.symbol.toLowerCase().includes(query.toLowerCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-background-border px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-background-elevated"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-terminal-green flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-400">
                TradePredict
              </span>
              <span className="text-[10px] font-mono px-1 rounded bg-brand-500/20 text-brand-400 font-bold border border-brand-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Analyze. Predict. Understand.</p>
          </div>
        </div>
      </div>

      {/* Market Selector Chips */}
      <div className="hidden lg:flex items-center gap-1 bg-background-secondary p-1 rounded-lg border border-background-border text-xs">
        <button
          onClick={() => onSelectMarket('ALL')}
          className={`px-2.5 py-1 rounded font-medium transition-colors ${
            currentMarket === 'ALL'
              ? 'bg-background-elevated text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Markets
        </button>
        <button
          onClick={() => onSelectMarket('NEPSE')}
          className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
            currentMarket === 'NEPSE'
              ? 'bg-background-elevated text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🇳🇵</span> NEPSE
        </button>
        <button
          onClick={() => onSelectMarket('NSE')}
          className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
            currentMarket === 'NSE'
              ? 'bg-background-elevated text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🇮🇳</span> India
        </button>
        <button
          onClick={() => onSelectMarket('NASDAQ')}
          className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
            currentMarket === 'NASDAQ'
              ? 'bg-background-elevated text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🇺🇸</span> US Equities
        </button>
        <button
          onClick={() => onSelectMarket('CRYPTO')}
          className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
            currentMarket === 'CRYPTO'
              ? 'bg-background-elevated text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>₿</span> Crypto
        </button>
      </div>

      {/* Right Controls: Search, Online Status, AI Chat, Theme */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-secondary border border-background-border text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search Asset...</span>
            <kbd className="hidden sm:inline text-[10px] font-mono px-1 py-0.5 rounded bg-background-elevated border border-background-border text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Search Dropdown Dialog */}
          {searchOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg bg-background-secondary border border-background-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center px-4 border-b border-background-border">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search NEPSE, NSE, US stocks, or crypto pairs (e.g., NABIL, AAPL, BTC)..."
                    autoFocus
                    className="w-full py-3.5 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 font-mono"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery('');
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => {
                          onSelectAsset(asset);
                          setSearchOpen(false);
                          setQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-background-elevated text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white group-hover:text-brand-400">
                            {asset.symbol}
                          </span>
                          <span className="text-xs text-slate-400 truncate max-w-[220px]">
                            {asset.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-card text-slate-400 border border-background-border">
                            {asset.market}
                          </span>
                          <span className="text-xs font-mono text-slate-300">{asset.currency}</span>
                        </div>
                      </button>
                    ))
                  ) : query.trim() ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No assets found matching "{query}".
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-slate-500 text-center font-mono">
                      Type symbol or company name across Nepal, India, US, or Crypto universe.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <OfflineBadge isOnline={isOnline} offlineSince={offlineSince} />

        {/* AI Research Assistant Button */}
        <button
          onClick={onToggleChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-400 hover:bg-brand-500/20 text-xs font-medium transition-colors"
          title="Open AI Analyst Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">AI Analyst</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg bg-background-secondary border border-background-border text-slate-400 hover:text-white transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
