import React, { useState } from 'react';
import { Search, Sparkles, Moon, Sun, Menu, X, TrendingUp, TrendingDown, Zap, Globe2 } from 'lucide-react';
import { OfflineBadge } from './OfflineBadge';
import { Asset, Market } from '../../types/asset';
import { ALL_ASSETS, getAssetById } from '../../data/universe';

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

// Live Benchmark Ticker data for high-frequency market strip
const TICKER_ITEMS = [
  { id: 'NEPSE:NEPSE', label: '🇳🇵 NEPSE', price: '2,684.20', change: '+1.15%', up: true },
  { id: 'NSE:NIFTY50', label: '🇮🇳 NIFTY 50', price: '24,980.50', change: '+0.42%', up: true },
  { id: 'NASDAQ:SPY', label: '🇺🇸 S&P 500', price: '5,751.10', change: '+0.38%', up: true },
  { id: 'CRYPTO:BTCUSDT', label: '₿ BTC/USDT', price: '$64,250.00', change: '+2.85%', up: true },
  { id: 'CRYPTO:ETHUSDT', label: '⟠ ETH/USDT', price: '$3,480.00', change: '+1.92%', up: true },
  { id: 'NEPSE:NABIL', label: '🇳🇵 NABIL', price: 'NPR 542.00', change: '+1.69%', up: true },
  { id: 'NSE:RELIANCE', label: '🇮🇳 RELIANCE', price: '₹2,940.00', change: '+0.75%', up: true },
  { id: 'NASDAQ:NVDA', label: '🇺🇸 NVDA', price: '$128.50', change: '+3.12%', up: true },
  { id: 'NEPSE:CHCL', label: '🇳🇵 CHCL', price: 'NPR 425.00', change: '-0.70%', up: false },
  { id: 'CRYPTO:SOLUSDT', label: '◎ SOL/USDT', price: '$152.40', change: '+4.20%', up: true },
];

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

  const popularAssets = ['NEPSE:NABIL', 'NSE:RELIANCE', 'NASDAQ:AAPL', 'CRYPTO:BTCUSDT', 'NASDAQ:NVDA']
    .map((id) => getAssetById(id))
    .filter((a): a is Asset => !!a);

  return (
    <div className="sticky top-0 z-40 w-full flex flex-col">
      {/* 1. TOP LIVE FINANCIAL TICKER TAPE */}
      <div className="w-full bg-[#050811]/95 border-b border-white/[0.05] overflow-hidden py-1 px-2 select-none">
        <div className="flex items-center gap-6 animate-ticker text-[10px] font-mono tracking-tight text-slate-400">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => {
                const asset = getAssetById(item.id);
                if (asset) onSelectAsset(asset);
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors shrink-0 group px-1"
            >
              <span className="font-semibold text-slate-300 group-hover:text-brand-400">{item.label}</span>
              <span className="text-white font-medium">{item.price}</span>
              <span className={`flex items-center font-bold ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN FROSTED GLASS HEADER */}
      <header className="w-full bg-background/85 backdrop-blur-xl border-b border-white/[0.07] px-4 py-2.5 flex items-center justify-between gap-4 shadow-sm">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onSelectMarket('ALL')}>
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 via-brand-500 to-terminal-cyan flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all duration-300">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wider uppercase text-white font-mono group-hover:text-brand-300 transition-colors">
                  TradePredict
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-gradient-to-r from-brand-500/20 to-terminal-cyan/20 text-brand-300 font-extrabold border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Analyze. Predict. Understand.
              </p>
            </div>
          </div>
        </div>

        {/* Aesthetic Market Selector Pills */}
        <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] text-xs font-mono shadow-inner">
          <button
            onClick={() => onSelectMarket('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-all duration-150 ${
              currentMarket === 'ALL'
                ? 'bg-gradient-to-r from-brand-500/25 to-brand-600/25 text-white font-semibold border border-brand-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            All Markets
          </button>
          <button
            onClick={() => onSelectMarket('NEPSE')}
            className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 ${
              currentMarket === 'NEPSE'
                ? 'bg-gradient-to-r from-brand-500/25 to-brand-600/25 text-white font-semibold border border-brand-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>🇳🇵</span> NEPSE
          </button>
          <button
            onClick={() => onSelectMarket('NSE')}
            className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 ${
              currentMarket === 'NSE'
                ? 'bg-gradient-to-r from-brand-500/25 to-brand-600/25 text-white font-semibold border border-brand-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>🇮🇳</span> India (NSE)
          </button>
          <button
            onClick={() => onSelectMarket('NASDAQ')}
            className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 ${
              currentMarket === 'NASDAQ'
                ? 'bg-gradient-to-r from-brand-500/25 to-brand-600/25 text-white font-semibold border border-brand-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>🇺🇸</span> US Equities
          </button>
          <button
            onClick={() => onSelectMarket('CRYPTO')}
            className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-150 ${
              currentMarket === 'CRYPTO'
                ? 'bg-gradient-to-r from-brand-500/25 to-brand-600/25 text-white font-semibold border border-brand-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>₿</span> Crypto
          </button>
        </div>

        {/* Right Tools: Search, Network Badge, AI Analyst, Theme */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-brand-500/50 hover:bg-white/[0.07] text-xs text-slate-300 hover:text-white transition-all shadow-sm group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-400 transition-colors" />
            <span className="hidden sm:inline font-mono">Quick Search</span>
            <kbd className="hidden sm:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick Search Dropdown Modal */}
          {searchOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
              <div className="w-full max-w-xl bg-background-secondary border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
                <div className="flex items-center px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
                  <Search className="w-4 h-4 text-brand-400 mr-2.5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Nepal, India, US, or Crypto pairs (e.g. NABIL, RELIANCE, AAPL, BTC)..."
                    autoFocus
                    className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 font-mono"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery('');
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Popular Quick Suggestions */}
                {!query.trim() && (
                  <div className="p-3 border-b border-white/[0.05] bg-white/[0.01]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-2 px-1">
                      Trending Assets
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularAssets.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => {
                            onSelectAsset(asset);
                            setSearchOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-brand-500/50 hover:bg-brand-500/10 text-xs font-mono text-slate-300 hover:text-brand-300 transition-all flex items-center gap-1.5"
                        >
                          <span className="font-bold">{asset.symbol}</span>
                          <span className="text-[10px] text-slate-500">{asset.market}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results list */}
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
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white group-hover:text-brand-400 transition-colors">
                            {asset.symbol}
                          </span>
                          <span className="text-xs text-slate-400 truncate max-w-[240px]">
                            {asset.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                            {asset.market}
                          </span>
                          <span className="text-xs font-mono text-slate-300 font-medium">{asset.currency}</span>
                        </div>
                      </button>
                    ))
                  ) : query.trim() ? (
                    <div className="p-8 text-center text-xs text-slate-400 font-mono">
                      No assets found matching "{query}".
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          <OfflineBadge isOnline={isOnline} offlineSince={offlineSince} />

          {/* AI Research Assistant Glow Button */}
          <button
            onClick={onToggleChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600/20 to-purple-600/20 border border-brand-500/40 text-brand-300 hover:text-white hover:border-brand-400 hover:shadow-glow-indigo text-xs font-mono font-medium transition-all"
            title="Open AI Analyst Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin-slow" />
            <span className="hidden md:inline font-semibold">AI Analyst</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-slate-400 hover:text-white transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>
    </div>
  );
};
