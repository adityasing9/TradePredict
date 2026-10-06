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
    <div className="w-full bg-background-card rounded-xl border border-background-border p-4 shadow-lg flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
          Portfolio Cumulative Equity Curve
        </h4>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-slate-400">
            Initial: <span className="text-slate-200">${initialCapital.toLocaleString()}</span>
          </span>
          <span className={isProfit ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            Final: ${lastEquity.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 select-none">
          {/* Baseline Initial Capital Line */}
          <line
            x1={paddingLeft}
            y1={getY(initialCapital)}
            x2={paddingLeft + chartW}
            y2={getY(initialCapital)}
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          <polygon
            points={areaPts}
            fill={isProfit ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)'}
          />

          {/* Line Stroke */}
          <polyline
            points={polylinePts}
            fill="none"
            stroke={isProfit ? '#10b981' : '#f43f5e'}
            strokeWidth="2"
            strokeLinecap="round"
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
