import React from 'react';
import { Scenario } from '../../types/prediction';
import { TrendingUp, MinusCircle, TrendingDown, AlertCircle } from 'lucide-react';

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
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/5',
        titleColor: 'text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-400',
        icon: <TrendingUp className="w-4 h-4 text-emerald-400" />
      },
      base: {
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/5',
        titleColor: 'text-amber-400',
        badge: 'bg-amber-500/10 text-amber-400',
        icon: <MinusCircle className="w-4 h-4 text-amber-400" />
      },
      bear: {
        border: 'border-rose-500/30',
        bg: 'bg-rose-500/5',
        titleColor: 'text-rose-400',
        badge: 'bg-rose-500/10 text-rose-400',
        icon: <TrendingDown className="w-4 h-4 text-rose-400" />
      }
    }[type];

    return (
      <div className={`p-4 rounded-xl border ${config.border} ${config.bg} flex flex-col justify-between gap-3 shadow-md`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {config.icon}
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${config.titleColor}`}>
                {s.type} Case ({s.probability}%)
              </h4>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${config.badge}`}>
              Target: {currency} {s.targetPrice}
            </span>
          </div>

          <h5 className="text-sm font-semibold text-white mt-1">{s.title}</h5>

          {/* Supporting Factors */}
          <div className="mt-2 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Supporting Catalysts:</span>
            <ul className="text-xs text-slate-300 space-y-1 pl-1">
              {s.supportingFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-500 mt-1">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Invalidation Condition */}
        <div className="pt-2 border-t border-background-border/60 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold uppercase text-[10px]">Invalidation Trigger:</span>
          </div>
          <p className="text-slate-400 leading-tight">
            {s.invalidationCondition}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-background-card rounded-xl border border-background-border p-5 shadow-lg flex flex-col gap-3">
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Multi-Scenario Path Analysis
        </h3>
        <p className="text-xs text-slate-400">
          Statistically derived market trajectories with specific invalidation boundary conditions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
        {renderScenarioItem(bull, 'bull')}
        {renderScenarioItem(base, 'base')}
        {renderScenarioItem(bear, 'bear')}
      </div>
    </div>
  );
};
