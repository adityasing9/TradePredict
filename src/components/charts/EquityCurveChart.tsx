import React from 'react';
import { EquityPoint } from '../../types/backtest';

interface EquityCurveChartProps {
  points: EquityPoint[];
  initialCapital: number;
}

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({
  points,
  initialCapital
}) => {
  if (!points || points.length === 0) return null;

  const equities = points.map((p) => p.equity);
  const minEquity = Math.min(...equities, initialCapital) * 0.98;
  const maxEquity = Math.max(...equities, initialCapital) * 1.02;
  const range = maxEquity - minEquity || 1;

  const svgWidth = 600;
  const svgHeight = 200;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const getX = (i: number) => paddingLeft + (i / (points.length - 1)) * chartW;
  const getY = (val: number) => paddingTop + chartH - ((val - minEquity) / range) * chartH;

  const polylinePts = points.map((p, i) => `${getX(i)},${getY(p.equity)}`).join(' ');

  // Gradient area
  const areaPts = [
    `${paddingLeft},${paddingTop + chartH}`,
    ...points.map((p, i) => `${getX(i)},${getY(p.equity)}`),
    `${paddingLeft + chartW},${paddingTop + chartH}`
  ].join(' ');

  const lastEquity = points[points.length - 1]?.equity || initialCapital;
  const isProfit = lastEquity >= initialCapital;

  return (
    <div className="w-full glass-card rounded-2xl border border-white/[0.08] p-5 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Portfolio Cumulative Equity Curve
        </h4>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-slate-400">
            Initial: <span className="text-slate-200">${initialCapital.toLocaleString()}</span>
          </span>
          <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
            isProfit ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            Final: ${lastEquity.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 select-none overflow-visible">
          <defs>
            <linearGradient id="equityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isProfit ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
              <stop offset="100%" stopColor={isProfit ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Baseline Initial Capital Line */}
          <line
            x1={paddingLeft}
            y1={getY(initialCapital)}
            x2={paddingLeft + chartW}
            y2={getY(initialCapital)}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          <polygon
            points={areaPts}
            fill="url(#equityGrad)"
          />

          {/* Line Stroke */}
          <polyline
            points={polylinePts}
            fill="none"
            stroke={isProfit ? '#10b981' : '#f43f5e'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Y Axis Labels */}
          <text
            x={paddingLeft - 8}
            y={getY(maxEquity) + 4}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            ${Math.round(maxEquity)}
          </text>
          <text
            x={paddingLeft - 8}
            y={getY(initialCapital) + 3}
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            ${Math.round(initialCapital)}
          </text>
          <text
            x={paddingLeft - 8}
            y={getY(minEquity) + 2}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            ${Math.round(minEquity)}
          </text>
        </svg>
      </div>
    </div>
  );
};
