import React from 'react';
import { LayoutDashboard, Compass, Star, LineChart, Sparkles } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAI: () => void;
  watchlistCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAI,
  watchlistCount = 0
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-background-deep/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around select-none shadow-lg">
      {/* 1. HOME */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-colors ${
          currentTab === 'dashboard'
            ? 'text-cyan-600 dark:text-accent-cyan font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-mono tracking-tight">Home</span>
      </button>

      {/* 2. MARKETS */}
      <button
        onClick={() => onSelectTab('markets')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-colors ${
          currentTab === 'markets'
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Compass className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-mono tracking-tight">Markets</span>
      </button>

      {/* 3. WATCHLIST */}
      <button
        onClick={() => onSelectTab('watchlist')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-colors relative ${
          currentTab === 'watchlist'
            ? 'text-amber-500 dark:text-amber-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Star className="w-4 h-4 mb-0.5" />
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-2 text-[8px] font-mono px-1 rounded bg-amber-500 text-white font-bold shadow-sm">
              {watchlistCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono tracking-tight">Watchlist</span>
      </button>

      {/* 4. ANALYZE */}
      <button
        onClick={() => onSelectTab('analysis')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-colors ${
          currentTab === 'analysis' ||
          currentTab === 'technical' ||
          currentTab === 'fundamentals' ||
          currentTab === 'sentiment' ||
          currentTab === 'prediction' ||
          currentTab === 'risk'
            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <LineChart className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-mono tracking-tight">Analyze</span>
      </button>

      {/* 5. AI */}
      <button
        onClick={onOpenAI}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded text-cyan-600 dark:text-accent-cyan hover:opacity-80 transition-opacity"
      >
        <Sparkles className="w-4 h-4 mb-0.5 text-cyan-600 dark:text-accent-cyan" />
        <span className="text-[10px] font-mono tracking-tight font-bold">AI Co-Pilot</span>
      </button>
    </nav>
  );
};
