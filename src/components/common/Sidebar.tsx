import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Star,
  Activity,
  Binary,
  Layers,
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
      title: '', // Top Core
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'markets', label: 'Markets', icon: Compass },
        {
          key: 'watchlist',
          label: 'Watchlist',
          icon: Star,
          badge: watchlistCount > 0 ? watchlistCount : undefined
        }
      ]
    },
    {
      title: 'ANALYSIS',
      items: [
        { key: 'technical', label: 'Technical', icon: Activity },
        { key: 'fundamentals', label: 'Fundamentals', icon: Building2 },
        { key: 'sentiment', label: 'Sentiment', icon: Newspaper },
        { key: 'prediction', label: 'Prediction', icon: Binary },
        { key: 'risk', label: 'Risk', icon: ShieldAlert }
      ]
    },
    {
      title: 'RESEARCH',
      items: [
        { key: 'ai_analyst', label: 'AI Analyst', icon: Sparkles },
        { key: 'news', label: 'News', icon: Newspaper },
        { key: 'backtesting', label: 'Backtesting', icon: History },
        { key: 'performance', label: 'Model Performance', icon: Gauge }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen bg-background-secondary border-r border-background-border flex flex-col justify-between transition-all duration-200 select-none ${
          isCollapsed ? 'md:w-16' : 'md:w-60'
        } ${isOpenMobile ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Mobile Header */}
        <div className="p-3 border-b border-background-border flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-white">TradePredict AI</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsed/Expanded Top Brand on Desktop */}
        <div className="hidden md:flex items-center justify-between px-3.5 py-3 border-b border-background-border">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold tracking-wider text-slate-300 uppercase">
                Terminal Menu
              </span>
            </div>
          ) : (
            <div className="mx-auto text-[10px] font-mono text-slate-500 font-bold">TP</div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              {sec.title && !isCollapsed && (
                <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  {sec.title}
                </div>
              )}
              {sec.title && isCollapsed && (
                <div className="my-1 border-t border-background-border" />
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
                      isCollapsed ? 'justify-center px-2' : 'justify-between px-2.5'
                    } py-2 rounded-lg text-xs font-medium transition-colors group relative ${
                      isActive
                        ? 'bg-brand-500/15 text-white font-semibold border-l-2 border-brand-500'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-brand-500/20 text-brand-300 font-bold">
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 rounded bg-background-elevated text-white text-[11px] font-mono whitespace-nowrap shadow-modal opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Settings & Status */}
        <div className="p-2 border-t border-background-border space-y-1">
          <button
            onClick={() => {
              onSelectNav('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed ? 'Settings' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'justify-start px-2.5'
            } py-2 rounded-lg text-xs font-medium transition-colors group relative ${
              activeKey === 'settings'
                ? 'bg-brand-500/15 text-white font-semibold border-l-2 border-brand-500'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]'
            }`}
          >
            <SettingsIcon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-200" />
            {!isCollapsed && <span className="ml-2.5">Settings</span>}

            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 rounded bg-background-elevated text-white text-[11px] font-mono whitespace-nowrap shadow-modal opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity">
                Settings
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
