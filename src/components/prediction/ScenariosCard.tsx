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
        border: 'border-emerald-500/35 hover:border-emerald-500/60',
        bg: 'bg-emerald-500/[0.04]',
        titleColor: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        icon: <TrendingUp className="w-4 h-4 text-emerald-400" />
      },
      base: {
        border: 'border-cyan-500/35 hover:border-cyan-500/60',
        bg: 'bg-cyan-500/[0.04]',
        titleColor: 'text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        icon: <MinusCircle className="w-4 h-4 text-cyan-400" />
      },
      bear: {
        border: 'border-rose-500/35 hover:border-rose-500/60',
        bg: 'bg-rose-500/[0.04]',
        titleColor: 'text-rose-400',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        icon: <TrendingDown className="w-4 h-4 text-rose-400" />
      }
    }[type];

  return (
      <div className={`p-4 sm:p-5 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-md flex flex-col justify-between gap-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                {config.icon}
              </div>
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${config.titleColor}`}>
                {s.type} Case ({s.probability}%)
              </h4>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${config.badge}`}>
              Target: {currency} {s.targetPrice}
            </span>
          </div>

          <h5 className="text-sm font-bold text-white mt-2 leading-snug">{s.title}</h5>

          {/* Supporting Catalysts */}
          <div className="mt-3 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Supporting Catalysts:</span>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-0.5">
              {s.supportingFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-slate-500 mt-0.5 text-xs">▸</span>
                  <span className="leading-relaxed">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Invalidation Condition */}
        <div className="pt-2.5 border-t border-white/[0.07] text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-400">Invalidation Trigger:</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-5">
            {s.invalidationCondition}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl flex flex-col gap-4">
      <div className="border-b border-white/[0.06] pb-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-400" />
          Multi-Scenario Path & Boundary Analysis
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Statistically derived market trajectories with specific invalidation boundary triggers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderScenarioItem(bull, 'bull')}
        {renderScenarioItem(base, 'base')}
        {renderScenarioItem(bear, 'bear')}
      </div>
    </div>
  );
};
