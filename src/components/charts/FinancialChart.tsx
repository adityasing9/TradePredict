import React, { useRef, useEffect, useState } from 'react';
import { Candle, Timeframe } from '../../types/marketData';
import { SupportResistanceLevel } from '../../types/technical';
import { BarChart3, LineChart as LineChartIcon, RefreshCw } from 'lucide-react';

interface FinancialChartProps {
  candles: Candle[];
  currency: string;
  symbol: string;
  currentTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  supports?: SupportResistanceLevel[];
  resistances?: SupportResistanceLevel[];
  onRefresh?: () => void;
  loading?: boolean;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
  candles,
  currency,
  symbol,
  currentTimeframe,
  onSelectTimeframe,
  supports = [],
  resistances = [],
  onRefresh,
  loading = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartType, setChartType] = useState<'CANDLE' | 'LINE'>('CANDLE');

  // Overlays state
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(false);
  const [showEMA200, setShowEMA200] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVWAP, setShowVWAP] = useState(false);
  const [showLevels, setShowLevels] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isLightMode, setIsLightMode] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('light')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const timeframes: Timeframe[] = ['15m', '1H', '4H', '1D', '1W'];

  // Helper to calculate EMA
  const calculateEMA = (bars: Candle[], period: number): (number | null)[] => {
    if (bars.length < period) return bars.map(() => null);
    const k = 2 / (period + 1);
    const result: (number | null)[] = [];

    let sum = 0;
    for (let i = 0; i < period; i++) sum += bars[i].close;
    let prevEMA = sum / period;

    for (let i = 0; i < bars.length; i++) {
      if (i < period - 1) {
        result.push(null);
      } else if (i === period - 1) {
        result.push(prevEMA);
      } else {
        prevEMA = bars[i].close * k + prevEMA * (1 - k);
        result.push(prevEMA);
      }
    }
    return result;
  };

  // Helper to calculate Bollinger Bands (period 20, multiplier 2)
  const calculateBollingerBands = (bars: Candle[], period = 20, multiplier = 2) => {
    const upper: (number | null)[] = [];
    const middle: (number | null)[] = [];
    const lower: (number | null)[] = [];

    for (let i = 0; i < bars.length; i++) {
      if (i < period - 1) {
        upper.push(null);
        middle.push(null);
        lower.push(null);
        continue;
      }
      const slice = bars.slice(i - period + 1, i + 1);
      const mean = slice.reduce((s, b) => s + b.close, 0) / period;
      const variance = slice.reduce((s, b) => s + Math.pow(b.close - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);

      middle.push(mean);
      upper.push(mean + multiplier * stdDev);
      lower.push(mean - multiplier * stdDev);
    }
    return { upper, middle, lower };
  };

  // Helper to calculate VWAP
  const calculateVWAP = (bars: Candle[]): (number | null)[] => {
    let cumVolume = 0;
    let cumTypicalVolume = 0;
    const vwap: (number | null)[] = [];

    for (let i = 0; i < bars.length; i++) {
      const typicalPrice = (bars[i].high + bars[i].low + bars[i].close) / 3;
      cumTypicalVolume += typicalPrice * bars[i].volume;
      cumVolume += bars[i].volume;
      vwap.push(cumVolume > 0 ? cumTypicalVolume / cumVolume : null);
    }
    return vwap;
  };

  // Render chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Split height: 75% price, 22% volume
    const priceHeight = height * 0.74;
    const volumeHeight = height * 0.22;

    const isLight = isLightMode;
    const chartBg = isLight ? '#ffffff' : '#080b10';
    const gridColor = isLight ? '#e2e8f0' : '#15202b';
    const axisTextColor = isLight ? '#475569' : '#64748b';
    const candleUp = isLight ? '#16a34a' : '#22c55e';
    const candleDown = isLight ? '#dc2626' : '#ef4444';
    const volUp = isLight ? 'rgba(22, 163, 74, 0.28)' : 'rgba(34, 197, 94, 0.25)';
    const volDown = isLight ? 'rgba(220, 38, 38, 0.28)' : 'rgba(239, 68, 68, 0.25)';
    const bbColor = isLight ? 'rgba(8, 145, 178, 0.45)' : 'rgba(34, 211, 238, 0.4)';
    const lineChartColor = isLight ? '#0891b2' : '#22d3ee';
    const crosshairColor = isLight ? 'rgba(71, 85, 105, 0.4)' : 'rgba(148, 163, 184, 0.4)';

    // Background fill
    ctx.fillStyle = chartBg;
    ctx.fillRect(0, 0, width, height);

    // Visible slice of bars (last 70 bars)
    const visibleBars = candles.slice(-70);
    const n = visibleBars.length;
    if (n < 2) return;

    // Price scaling
    let minPrice = Math.min(...visibleBars.map((c) => c.low));
    let maxPrice = Math.max(...visibleBars.map((c) => c.high));

    // Pad price range by 5%
    const pricePadding = (maxPrice - minPrice) * 0.05 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    // Volume scaling
    const maxVolume = Math.max(...visibleBars.map((c) => c.volume)) || 1;

    // Geometry
    const paddingLeft = 12;
    const paddingRight = 72;
    const chartWidth = width - paddingLeft - paddingRight;
    const barWidth = chartWidth / n;
    const candleWidth = Math.max(3, barWidth * 0.72);

    const getY = (price: number) => priceHeight - ((price - minPrice) / priceRange) * (priceHeight - 24) - 12;

    // 1. Grid Lines & Axis Labels
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    const numGridLines = 5;
    for (let i = 0; i <= numGridLines; i++) {
      const p = minPrice + (priceRange / numGridLines) * i;
      const y = getY(p);

      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      ctx.fillStyle = axisTextColor;
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(p.toFixed(p < 10 ? 3 : 1), width - paddingRight + 8, y + 3.5);
    }
    ctx.setLineDash([]);

    // 2. S/R Levels
    if (showLevels) {
      for (const s of supports.slice(0, 2)) {
        if (s.price >= minPrice && s.price <= maxPrice) {
          const y = getY(s.price);
          ctx.strokeStyle = isLight ? 'rgba(22, 163, 74, 0.45)' : 'rgba(34, 197, 94, 0.4)';
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(width - paddingRight, y);
          ctx.stroke();

          ctx.fillStyle = candleUp;
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillText(`SUP ${s.price}`, width - paddingRight + 6, y - 3);
        }
      }

      for (const r of resistances.slice(0, 2)) {
        if (r.price >= minPrice && r.price <= maxPrice) {
          const y = getY(r.price);
          ctx.strokeStyle = isLight ? 'rgba(220, 38, 38, 0.45)' : 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(width - paddingRight, y);
          ctx.stroke();

          ctx.fillStyle = candleDown;
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillText(`RES ${r.price}`, width - paddingRight + 6, y - 3);
        }
      }
      ctx.setLineDash([]);
    }

    // 3. Bollinger Bands Overlay
    if (showBollinger) {
      const bb = calculateBollingerBands(visibleBars, 20, 2);
      ctx.strokeStyle = bbColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < n; i++) {
        if (bb.upper[i] !== null) {
          const x = paddingLeft + i * barWidth + barWidth / 2;
          const y = getY(bb.upper[i]!);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();

      ctx.beginPath();
      started = false;
      for (let i = 0; i < n; i++) {
        if (bb.lower[i] !== null) {
          const x = paddingLeft + i * barWidth + barWidth / 2;
          const y = getY(bb.lower[i]!);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    // 4. Volume Bars
    visibleBars.forEach((bar, i) => {
      const x = paddingLeft + i * barWidth + barWidth / 2;
      const vHeight = (bar.volume / maxVolume) * volumeHeight;
      const vy = height - vHeight;
      const isUp = bar.close >= bar.open;

      ctx.fillStyle = isUp ? volUp : volDown;
      ctx.fillRect(x - candleWidth / 2, vy, candleWidth, vHeight);
    });

    // 5. Candlesticks or Line Chart
    if (chartType === 'CANDLE') {
      visibleBars.forEach((bar, i) => {
        const x = paddingLeft + i * barWidth + barWidth / 2;
        const openY = getY(bar.open);
        const closeY = getY(bar.close);
        const highY = getY(bar.high);
        const lowY = getY(bar.low);

        const isUp = bar.close >= bar.open;
        const color = isUp ? candleUp : candleDown;

        // High-Low Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Real Body
        ctx.fillStyle = color;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(closeY - openY));
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    } else {
      ctx.beginPath();
      visibleBars.forEach((bar, i) => {
        const x = paddingLeft + i * barWidth + barWidth / 2;
        const y = getY(bar.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = lineChartColor;
      ctx.lineWidth = 1.75;
      ctx.stroke();
    }

    // 6. Indicator Lines (EMA 20, EMA 50, EMA 200, VWAP)
    const renderIndicatorLine = (values: (number | null)[], color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < n; i++) {
        if (values[i] !== null) {
          const x = paddingLeft + i * barWidth + barWidth / 2;
          const y = getY(values[i]!);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    };

    if (showEMA20) {
      const ema20 = calculateEMA(visibleBars, 20);
      renderIndicatorLine(ema20, isLight ? '#d97706' : '#f59e0b');
    }

    if (showEMA50) {
      const ema50 = calculateEMA(visibleBars, 50);
      renderIndicatorLine(ema50, isLight ? '#0284c7' : '#38bdf8');
    }

    if (showEMA200) {
      const ema200 = calculateEMA(visibleBars, Math.min(200, Math.floor(visibleBars.length * 0.9)));
      renderIndicatorLine(ema200, isLight ? '#7c3aed' : '#818cf8');
    }

    if (showVWAP) {
      const vwap = calculateVWAP(visibleBars);
      renderIndicatorLine(vwap, isLight ? '#db2777' : '#ec4899');
    }

    // 7. Latest Price Reference Line
    const latestBar = visibleBars[visibleBars.length - 1];
    const latestY = getY(latestBar.close);
    const isLatestUp = latestBar.close >= latestBar.open;
    const latestColor = isLatestUp ? candleUp : candleDown;

    ctx.strokeStyle = latestColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft, latestY);
    ctx.lineTo(width - paddingRight, latestY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price tag on right axis
    ctx.fillStyle = latestColor;
    ctx.fillRect(width - paddingRight + 4, latestY - 8, 62, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9.5px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(latestBar.close.toFixed(latestBar.close < 10 ? 3 : 1), width - paddingRight + 8, latestY + 3.5);

    // 8. Crosshair Hover
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < n) {
      const hoverBar = visibleBars[hoverIndex];
      const hx = paddingLeft + hoverIndex * barWidth + barWidth / 2;
      const hy = getY(hoverBar.close);

      ctx.strokeStyle = crosshairColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      ctx.beginPath();
      ctx.moveTo(hx, 0);
      ctx.lineTo(hx, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(paddingLeft, hy);
      ctx.lineTo(width - paddingRight, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isLight ? '#0891b2' : '#22d3ee';
      ctx.beginPath();
      ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isLight ? '#0f172a' : '#ffffff';
      ctx.stroke();
    }
  }, [candles, chartType, showEMA20, showEMA50, showEMA200, showBollinger, showVWAP, showLevels, hoverIndex, isLightMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const paddingLeft = 12;
    const paddingRight = 72;
    const chartWidth = rect.width - paddingLeft - paddingRight;

    const visibleBars = candles.slice(-70);
    const n = visibleBars.length;
    const barWidth = chartWidth / n;

    const idx = Math.floor((x - paddingLeft) / barWidth);
    if (idx >= 0 && idx < n) {
      setHoverIndex(idx);
    } else {
      setHoverIndex(null);
    }
  };

  const activeBar =
    hoverIndex !== null && candles.slice(-70)[hoverIndex]
      ? candles.slice(-70)[hoverIndex]
      : candles[candles.length - 1];

  return (
    <div className="terminal-panel p-3 sm:p-4 space-y-2.5">
      {/* Chart Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-baseline gap-1 font-mono text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">{symbol}</span>
            <span className="text-slate-500 text-[11px]">({currency})</span>
          </div>

          {/* Timeframe Chips */}
          <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded border border-border text-[11px] font-mono">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => onSelectTimeframe(tf)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  currentTimeframe === tf
                    ? 'bg-surface-elevated text-cyan-600 dark:text-accent-cyan border border-border font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* View toggles & Indicators Toolbar */}
        <div className="flex flex-wrap items-center gap-1 text-xs font-mono">
          {/* Chart Type Toggle */}
          <button
            onClick={() => setChartType(chartType === 'CANDLE' ? 'LINE' : 'CANDLE')}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-secondary border border-border text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            title="Toggle Candlestick / Line"
          >
            {chartType === 'CANDLE' ? (
              <BarChart3 className="w-3 h-3 text-cyan-600 dark:text-accent-cyan" />
            ) : (
              <LineChartIcon className="w-3 h-3 text-cyan-600 dark:text-accent-cyan" />
            )}
            <span className="text-[10px]">{chartType}</span>
          </button>

          {/* EMA 20 */}
          <button
            onClick={() => setShowEMA20(!showEMA20)}
            className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
              showEMA20
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold'
                : 'bg-surface-secondary border-border text-slate-500 dark:text-slate-400'
            }`}
          >
            EMA 20
          </button>

          {/* EMA 50 */}
          <button
            onClick={() => setShowEMA50(!showEMA50)}
            className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
              showEMA50
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 font-bold'
                : 'bg-surface-secondary border-border text-slate-500 dark:text-slate-400'
            }`}
          >
            EMA 50
          </button>

          {/* EMA 200 */}
          <button
            onClick={() => setShowEMA200(!showEMA200)}
            className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
              showEMA200
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'bg-surface-secondary border-border text-slate-500 dark:text-slate-400'
            }`}
          >
            EMA 200
          </button>

          {/* Bollinger Bands */}
          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
              showBollinger
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-accent-cyan font-bold'
                : 'bg-surface-secondary border-border text-slate-500 dark:text-slate-400'
            }`}
          >
            BB (20,2)
          </button>

          {/* VWAP */}
          <button
            onClick={() => setShowVWAP(!showVWAP)}
            className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
              showVWAP
                ? 'bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400 font-bold'
                : 'bg-surface-secondary border-border text-slate-500 dark:text-slate-400'
            }`}
          >
            VWAP
          </button>

          {/* S/R Levels */}
          <button
            onClick={() => setShowLevels(!showLevels)}
            className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
              showLevels
                ? 'bg-market-bullish/10 border-market-bullish/30 text-market-bullish font-bold'
                : 'bg-surface-secondary border-border text-slate-500 dark:text-slate-400'
            }`}
          >
            S/R
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1 rounded bg-surface-secondary border border-border text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50"
              title="Refresh Candles"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Interactive OHLC Bar */}
      {activeBar && (
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-surface-secondary px-2.5 py-1 rounded border border-border">
          <div>
            Time:{' '}
            <span className="text-slate-900 dark:text-slate-200 font-semibold">
              {new Date(activeBar.time * 1000).toLocaleDateString()}{' '}
              {new Date(activeBar.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div>O: <span className="text-slate-900 dark:text-slate-200 font-bold">{activeBar.open}</span></div>
          <div>H: <span className="text-market-bullish font-bold">{activeBar.high}</span></div>
          <div>L: <span className="text-market-bearish font-bold">{activeBar.low}</span></div>
          <div>
            C:{' '}
            <span className={activeBar.close >= activeBar.open ? 'text-market-bullish font-bold' : 'text-market-bearish font-bold'}>
              {activeBar.close}
            </span>
          </div>
          <div>Vol: <span className="text-slate-700 dark:text-slate-300 font-semibold">{activeBar.volume.toLocaleString()}</span></div>
        </div>
      )}

      {/* Canvas Area */}
      <div ref={containerRef} className="relative w-full h-80 sm:h-96 rounded overflow-hidden border border-border bg-white dark:bg-background-deep shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="w-full h-full cursor-crosshair block"
        />
      </div>
    </div>
  );
};
