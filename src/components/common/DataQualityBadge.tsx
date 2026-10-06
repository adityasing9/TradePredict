import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { DataQuality } from '../../types/marketData';

interface DataQualityBadgeProps {
  quality?: DataQuality | null;
}

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({ quality }) => {
  if (!quality) return null;

  const getStyle = () => {
    switch (quality.status) {
      case 'HIGH':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          label: 'Data Quality: HIGH'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: 'Data Quality: MEDIUM'
        };
      case 'LIMITED':
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          label: 'Data Quality: LIMITED'
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono ${style.bg}`}
      title={`Completeness: ${quality.completeness}% | Sources: ${quality.sources.join(', ')}${quality.staleReason ? ` | ${quality.staleReason}` : ''}`}
    >
      {style.icon}
      <span>{style.label}</span>
      <span className="opacity-70">({quality.completeness}%)</span>
    </div>
  );
};
