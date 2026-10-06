import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Star,
  Activity,
  Binary,
  Building2,
  Newspaper,
  ShieldAlert,
  Sparkles,
  History,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Gauge
} from 'lucide-react';

export type NavItemKey =
  | 'dashboard'
  | 'markets'
  | 'watchlist'
  | 'technical'
  | 'fundamentals'
  | 'sentiment'
  | 'prediction'
  | 'risk'
  | 'ai_analyst'
  | 'news'
  | 'backtesting'
  | 'performance'
  | 'settings';

interface SidebarProps {
  activeKey: string;
  onSelectNav: (key: NavItemKey) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  watchlistCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeKey,
  onSelectNav,
  isOpenMobile = false,
  onCloseMobile,
  watchlistCount = 0
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-500 dark:text-cyan-400' },
        { key: 'markets', label: 'Markets', icon: Compass, color: 'text-blue-500 dark:text-blue-400' },
        {
          key: 'watchlist',
          label: 'Watchlist',
          icon: Star,
          color: 'text-amber-500 dark:text-amber-400',
          badge: watchlistCount > 0 ? watchlistCount : undefined
        }
      ]
    },
    {
      title: 'ANALYSIS',
      items: [
        { key: 'technical', label: 'Technical', icon: Activity, color: 'text-emerald-500 dark:text-emerald-400' },
        { key: 'fundamentals', label: 'Fundamentals', icon: Building2, color: 'text-indigo-500 dark:text-indigo-400' },
        { key: 'sentiment', label: 'Sentiment', icon: Newspaper, color: 'text-pink-500 dark:text-pink-400' },
        { key: 'prediction', label: 'Prediction', icon: Binary, color: 'text-purple-500 dark:text-purple-400' },
        { key: 'risk', label: 'Risk & Quant', icon: ShieldAlert, color: 'text-rose-500 dark:text-rose-400' }
      ]
    },
    {
      title: 'RESEARCH',
      items: [
        { key: 'ai_analyst', label: 'AI Analyst', icon: Sparkles, color: 'text-sky-500 dark:text-sky-400' },
        { key: 'news', label: 'News Telemetry', icon: Newspaper, color: 'text-teal-500 dark:text-teal-400' },
        { key: 'backtesting', label: 'Backtesting Lab', icon: History, color: 'text-amber-500 dark:text-amber-400' },
        { key: 'performance', label: 'Model Audit', icon: Gauge, color: 'text-violet-500 dark:text-violet-400' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen bg-background-deep border-r border-border flex flex-col justify-between transition-all duration-150 select-none ${
          isCollapsed ? 'md:w-14' : 'md:w-56'
        } ${isOpenMobile ? 'w-60 translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Mobile Header */}
        <div className="p-3 border-b border-border flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-xs text-slate-900 dark:text-white">TradePredict AI</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Top Header */}
        <div className="hidden md:flex items-center justify-between px-3 py-2.5 border-b border-border h-12">
          {!isCollapsed ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Navigation
              </span>
            </div>
          ) : (
            <div className="mx-auto text-[11px] font-mono text-accent-cyan font-black">TP</div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-slate-200/60 dark:hover:bg-surface text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-2 px-1.5 overflow-y-auto space-y-3">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              {sec.title && !isCollapsed && (
                <div className="px-2 py-1 text-[9px] font-mono font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {sec.title}
                </div>
              )}
              {sec.title && isCollapsed && (
                <div className="my-1 border-t border-border" />
              )}

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeKey === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onSelectNav(item.key as NavItemKey);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-1.5' : 'justify-between px-2'
                    } py-1.5 rounded text-xs transition-colors group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-slate-900 dark:text-white font-black border-l-4 border-cyan-500 shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-surface/60 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${item.color}`}
                      />
                      {!isCollapsed && <span className="truncate text-xs font-mono">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black shadow-xs">
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap border border-slate-700 shadow-modal opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Settings & System */}
        <div className="p-1.5 border-t border-border">
          <button
            onClick={() => {
              onSelectNav('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed ? 'Settings' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-1.5' : 'justify-start px-2'
            } py-1.5 rounded text-xs transition-colors group relative ${
              activeKey === 'settings'
                ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-slate-900 dark:text-white font-black border-l-4 border-cyan-500 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-surface/60 font-semibold'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-cyan-500 transition-colors" />
            {!isCollapsed && <span className="ml-2 font-mono text-xs">Settings</span>}

            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap border border-slate-700 shadow-modal opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity">
                Settings
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
