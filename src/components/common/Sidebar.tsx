import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Star,
  LineChart,
  Binary,
  History,
  Activity,
  Newspaper,
  BookOpen,
  CheckCircle2,
  Settings,
  X
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'markets'
  | 'watchlist'
  | 'analysis'
  | 'predictions'
  | 'backtesting'
  | 'performance'
  | 'news'
  | 'research'
  | 'history'
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpen?: boolean;
  onClose?: () => void;
  watchlistCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen = false,
  onClose,
  watchlistCount = 0
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'markets', label: 'Market Explorer', icon: Compass },
    { id: 'watchlist', label: 'Watchlist', icon: Star, badge: watchlistCount > 0 ? watchlistCount : undefined },
    { id: 'analysis', label: 'Asset Analysis', icon: LineChart },
    { id: 'predictions', label: 'ML Predictions', icon: Binary },
    { id: 'backtesting', label: 'Backtesting Studio', icon: History },
    { id: 'performance', label: 'Model Performance', icon: Activity },
    { id: 'news', label: 'News & Sentiment', icon: Newspaper },
    { id: 'research', label: 'AI & Documents RAG', icon: BookOpen },
    { id: 'history', label: 'Prediction Tracking', icon: CheckCircle2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-64 bg-background-secondary border-r border-background-border flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="p-4 border-b border-background-border flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider uppercase text-white font-mono">
              TradePredict AI
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Market Intelligence
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id as PageId);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-background-elevated'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Terminal Status Footer */}
        <div className="p-3 border-t border-background-border bg-background/50">
          <div className="p-2 rounded-lg bg-background-card border border-background-border">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Local Engine
              </span>
              <span className="text-[10px] text-slate-500 font-mono">v1.4.0</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              Local-first PWA • IndexedDB
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
