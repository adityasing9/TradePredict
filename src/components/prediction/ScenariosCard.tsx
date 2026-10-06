import React from 'react';
import { Scenario } from '../../types/prediction';
import { TrendingUp, MinusCircle, TrendingDown, AlertCircle, Compass } from 'lucide-react';

interface ScenariosCardProps {
  scenarios: {
    bull: Scenario;
    base: Scenario;
    bear: Scenario;
  };
  currency: string;
}

export const ScenariosCard: React.FC<ScenariosCardProps> = ({ scenarios, currency }) => {
  const { bull, base, bear } = scenarios;

  const renderScenarioItem = (s: Scenario, type: 'bull' | 'base' | 'bear') => {
    const config = {
      bull: {
        border: 'border-market-bullish/30 hover:border-market-bullish/50',
        bg: 'bg-market-bullish/[0.03]',
        titleColor: 'text-market-bullish',
        badge: 'bg-market-bullish/10 text-market-bullish border-market-bullish/30',
        icon: <TrendingUp className="w-3.5 h-3.5 text-market-bullish" />
      },
      base: {
        border: 'border-border hover:border-slate-600',
        bg: 'bg-surface-secondary',
        titleColor: 'text-slate-200',
        badge: 'bg-surface-elevated text-slate-300 border-border',
        icon: <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
      },
      bear: {
        border: 'border-market-bearish/30 hover:border-market-bearish/50',
        bg: 'bg-market-bearish/[0.03]',
        titleColor: 'text-market-bearish',
        badge: 'bg-market-bearish/10 text-market-bearish border-market-bearish/30',
        icon: <TrendingDown className="w-3.5 h-3.5 text-market-bearish" />
      }
    }[type];

    return (
      <div className={`p-3.5 rounded border ${config.border} ${config.bg} flex flex-col justify-between gap-3 transition-colors`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-surface border border-border">
                {config.icon}
              </div>
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${config.titleColor}`}>
                {s.type} Case ({s.probability}%)
              </h4>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${config.badge}`}>
              Target: {currency} {s.targetPrice}
            </span>
          </div>

          <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-2 leading-snug">{s.title}</h5>

          {/* Supporting Catalysts */}
          <div className="mt-2.5 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Supporting Catalysts:</span>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-0.5 font-medium">
              {s.supportingFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                  <span className="text-slate-400 mt-0.5">▸</span>
                  <span className="leading-relaxed">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Invalidation Condition */}
        <div className="pt-2 border-t border-border text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-0.5">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            <span className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Invalidation Trigger:</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-4 text-[11px] font-medium">
            {s.invalidationCondition}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full terminal-panel p-4 flex flex-col gap-3">
      <div className="border-b border-border pb-2.5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-600 dark:text-accent-cyan" />
          Multi-Scenario Path & Boundary Analysis
        </h3>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
          Statistically derived market trajectories with specific invalidation boundary triggers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {renderScenarioItem(bull, 'bull')}
        {renderScenarioItem(base, 'base')}
        {renderScenarioItem(bear, 'bear')}
      </div>
    </div>
  );
};
