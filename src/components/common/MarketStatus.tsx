import React, { useState, useEffect } from 'react';
import { getAllMarketStatuses, MarketTimeStatus } from '../../utils/marketStatus';
import { Clock, ChevronDown, CheckCircle, XCircle, Activity } from 'lucide-react';

interface MarketStatusProps {
  compact?: boolean;
}

export const MarketStatus: React.FC<MarketStatusProps> = ({ compact = false }) => {
  const [statuses, setStatuses] = useState<MarketTimeStatus[]>(getAllMarketStatuses());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatuses(getAllMarketStatuses());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-md bg-surface border border-border hover:border-accent-cyan text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
          title="Exchange Operating Status & Timezones"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline uppercase">Exchanges:</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            {statuses.map((s) => {
              const flag =
                s.market === 'NEPSE'
                  ? '🇳🇵'
                  : s.market === 'NSE'
                  ? '🇮🇳'
                  : s.market === 'NASDAQ'
                  ? '🇺🇸'
                  : '₿';

              const isLive = s.statusText === 'Live' || s.statusText === 'Open';

              return (
                <span
                  key={s.market}
                  className={`flex items-center gap-1 px-1.5 py-0.2 rounded border font-mono ${
                    isLive
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      : s.statusText === 'Pre-Market'
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                      : 'bg-slate-200/50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span className="text-[9px]">{flag}</span>
                  <span className="font-bold">{s.market}</span>
                  <span className="font-semibold text-[9px]">{s.statusText}</span>
                </span>
              );
            })}
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
        </button>

        {/* Detailed Popover */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-1.5 w-80 bg-surface border border-border rounded-lg shadow-modal p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                  <Clock className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Exchange Trading Sessions</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Live Timezones</span>
              </div>

              <div className="space-y-1.5">
                {statuses.map((s) => (
                  <div
                    key={s.market}
                    className="p-2 rounded bg-surface-secondary border border-border flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{s.flag}</span>
                        <span className="font-bold text-white">{s.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{s.hoursDetail}</span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          s.statusText === 'Live' || s.statusText === 'Open'
                            ? 'text-market-bullish bg-market-bullish/10'
                            : s.statusText === 'Pre-Market'
                            ? 'text-market-warning bg-market-warning/10'
                            : 'text-slate-400 bg-surface-elevated'
                        }`}
                      >
                        {s.statusText === 'Live' ? (
                          <Activity className="w-3 h-3" />
                        ) : s.statusText === 'Open' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {s.statusText}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{s.localTimeStr}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-border text-[10px] text-slate-500 font-mono text-center">
                Refreshed according to official market local timezones
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {statuses.map((s) => (
        <div
          key={s.market}
          className="p-2.5 rounded bg-surface border border-border flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <span>{s.flag}</span>
              <span>{s.market}</span>
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                s.statusText === 'Live' || s.statusText === 'Open'
                  ? 'text-market-bullish bg-market-bullish/10'
                  : s.statusText === 'Pre-Market'
                  ? 'text-market-warning bg-market-warning/10'
                  : 'text-slate-400 bg-surface-elevated'
              }`}
            >
              {s.statusText}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 font-semibold mt-1">
            {s.localTimeStr}
          </div>
        </div>
      ))}
    </div>
  );
};
