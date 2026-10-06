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
  X,
  ShieldCheck,
  Cpu
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
  const sections = [
    {
      title: 'MARKET TERMINAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'markets', label: 'Market Explorer', icon: Compass },
        { id: 'watchlist', label: 'Watchlist', icon: Star, badge: watchlistCount > 0 ? watchlistCount : undefined },
        { id: 'analysis', label: 'Asset Analysis', icon: LineChart },
      ]
    },
    {
      title: 'QUANT & INTELLIGENCE',
      items: [
        { id: 'predictions', label: 'ML Predictions', icon: Binary },
        { id: 'backtesting', label: 'Backtesting Studio', icon: History },
        { id: 'performance', label: 'Model Performance', icon: Activity },
      ]
    },
    {
      title: 'RESEARCH & AUDIT',
      items: [
        { id: 'news', label: 'News & Sentiment', icon: Newspaper },
        { id: 'research', label: 'AI & Documents RAG', icon: BookOpen },
        { id: 'history', label: 'Truth Tracking', icon: CheckCircle2 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden animate-in fade-in duration-150"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-64 bg-background-secondary/95 backdrop-blur-2xl border-r border-white/[0.07] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header in Mobile Sidebar */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider uppercase text-white font-mono">
              TradePredict AI
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grouped Navigation Menus */}
        <div className="flex-1 py-5 px-3 overflow-y-auto space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectPage(item.id as PageId);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group relative ${
                      active
                        ? 'bg-gradient-to-r from-brand-500/20 via-brand-500/10 to-transparent text-white font-semibold border-l-2 border-brand-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          active
                            ? 'text-brand-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* System Terminal Status Footer */}
        <div className="p-3 border-t border-white/[0.07] bg-white/[0.01]">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-2 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Engine Online
              </span>
              <span className="text-[9px] text-slate-400 font-mono">v1.5.0</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>100% Local IndexedDB</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
