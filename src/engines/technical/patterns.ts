import { Candle } from '../../types/marketData';
import { DetectedPattern } from '../../types/technical';

export function detectTechnicalPatterns(candles: Candle[], timeframe: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  if (candles.length < 5) return patterns;

  const currentPrice = candles[candles.length - 1].close;
  const n = candles.length;
  const c0 = candles[n - 1]; // Current candle
  const c1 = candles[n - 2]; // Previous candle
  const c2 = candles[n - 3]; // 2 bars ago

  // 1. CANDLESTICK PATTERNS

  // Bullish Engulfing
  if (
    c1.close < c1.open && // c1 is red
    c0.close > c0.open && // c0 is green
    c0.open <= c1.close &&
    c0.close >= c1.open
  ) {
    patterns.push({
      id: `pat-bull-engulf-${Date.now()}`,
      name: 'Bullish Engulfing',
      type: 'BULLISH',
      category: 'CANDLESTICK',
      timeframe,
      confidence: 76,
      supportingData: `Current green body completely covers previous red candle body at ${c0.close}`,
      invalidationLevel: Number((Math.min(c0.low, c1.low) * 0.995).toFixed(2))
    });
  }

  // Bearish Engulfing
  if (
    c1.close > c1.open && // c1 is green
    c0.close < c0.open && // c0 is red
    c0.open >= c1.close &&
    c0.close <= c1.open
  ) {
    patterns.push({
      id: `pat-bear-engulf-${Date.now()}`,
      name: 'Bearish Engulfing',
      type: 'BEARISH',
      category: 'CANDLESTICK',
      timeframe,
      confidence: 74,
      supportingData: `Current red candle engulfs previous green candle body from ${c0.open} down to ${c0.close}`,
      invalidationLevel: Number((Math.max(c0.high, c1.high) * 1.005).toFixed(2))
    });
  }

  // Hammer (Bullish Reversal)
  const body0 = Math.abs(c0.close - c0.open);
  const lowerShadow0 = Math.min(c0.close, c0.open) - c0.low;
  const upperShadow0 = c0.high - Math.max(c0.close, c0.open);

  if (lowerShadow0 >= body0 * 2 && upperShadow0 <= body0 * 0.5 && body0 > 0) {
    patterns.push({
      id: `pat-hammer-${Date.now()}`,
      name: 'Hammer Reversal',
      type: 'BULLISH',
      category: 'CANDLESTICK',
      timeframe,
      confidence: 70,
      supportingData: `Long lower wick (${lowerShadow0.toFixed(2)}) indicates aggressive rejection of lower prices`,
      invalidationLevel: Number((c0.low * 0.995).toFixed(2))
    });
  }

  // Shooting Star (Bearish Reversal)
  if (upperShadow0 >= body0 * 2 && lowerShadow0 <= body0 * 0.5 && body0 > 0) {
    patterns.push({
      id: `pat-shootingstar-${Date.now()}`,
      name: 'Shooting Star',
      type: 'BEARISH',
      category: 'CANDLESTICK',
      timeframe,
      confidence: 72,
      supportingData: `Long upper wick (${upperShadow0.toFixed(2)}) shows overhead supply rejection at the highs`,
      invalidationLevel: Number((c0.high * 1.005).toFixed(2))
    });
  }

  // Morning Star (3-candle bullish reversal)
  if (
    c2.close < c2.open &&
    Math.abs(c1.close - c1.open) < body0 * 0.4 &&
    c0.close > c0.open &&
    c0.close > (c2.open + c2.close) / 2
  ) {
    patterns.push({
      id: `pat-morning-star-${Date.now()}`,
      name: 'Morning Star',
      type: 'BULLISH',
      category: 'CANDLESTICK',
      timeframe,
      confidence: 82,
      supportingData: `Classic three-bar reversal pattern with strong second-day recovery exceeding median`,
      invalidationLevel: Number((c1.low * 0.995).toFixed(2))
    });
  }

  // Doji (Indecision)
  if (body0 <= (c0.high - c0.low) * 0.1 && (c0.high - c0.low) > 0) {
    patterns.push({
      id: `pat-doji-${Date.now()}`,
      name: 'Doji (Neutral Compression)',
      type: 'NEUTRAL',
      category: 'CANDLESTICK',
      timeframe,
      confidence: 65,
      supportingData: `Open and close virtually equal at ${c0.close}, indicating market equilibrium/indecision`,
      invalidationLevel: Number((c0.low * 0.99).toFixed(2))
    });
  }

  // 2. MULTI-BAR CHART PATTERNS (Double Bottom / Top, Head & Shoulders, Flags)
  if (candles.length >= 25) {
    const recent = candles.slice(-25);
    const highs = recent.map((c) => c.high);
    const lows = recent.map((c) => c.low);

    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);

    // Double Bottom Detector
    const lowIndices = [];
    for (let i = 2; i < recent.length - 2; i++) {
      if (
        recent[i].low <= recent[i - 1].low &&
        recent[i].low <= recent[i - 2].low &&
        recent[i].low <= recent[i + 1].low &&
        recent[i].low <= recent[i + 2].low
      ) {
        lowIndices.push(i);
      }
    }

    if (lowIndices.length >= 2) {
      const idx1 = lowIndices[lowIndices.length - 2];
      const idx2 = lowIndices[lowIndices.length - 1];
      const l1 = recent[idx1].low;
      const l2 = recent[idx2].low;

      if (Math.abs(l1 - l2) / l1 < 0.02 && idx2 - idx1 >= 5) {
        patterns.push({
          id: `pat-double-bottom-${Date.now()}`,
          name: 'Double Bottom (W-Pattern)',
          type: 'BULLISH',
          category: 'CHART',
          timeframe,
          confidence: 78,
          supportingData: `Dual swing low retests at ${l1.toFixed(2)} and ${l2.toFixed(2)} with neckline resistance above`,
          invalidationLevel: Number((Math.min(l1, l2) * 0.99).toFixed(2))
        });
      }
    }

    // Double Top Detector
    const highIndices = [];
    for (let i = 2; i < recent.length - 2; i++) {
      if (
        recent[i].high >= recent[i - 1].high &&
        recent[i].high >= recent[i - 2].high &&
        recent[i].high >= recent[i + 1].high &&
        recent[i].high >= recent[i + 2].high
      ) {
        highIndices.push(i);
      }
    }

    if (highIndices.length >= 2) {
      const idx1 = highIndices[highIndices.length - 2];
      const idx2 = highIndices[highIndices.length - 1];
      const h1 = recent[idx1].high;
      const h2 = recent[idx2].high;

      if (Math.abs(h1 - h2) / h1 < 0.02 && idx2 - idx1 >= 5) {
        patterns.push({
          id: `pat-double-top-${Date.now()}`,
          name: 'Double Top (M-Pattern)',
          type: 'BEARISH',
          category: 'CHART',
          timeframe,
          confidence: 77,
          supportingData: `Failed dual retest at swing resistance peaks of ${h1.toFixed(2)} and ${h2.toFixed(2)}`,
          invalidationLevel: Number((Math.max(h1, h2) * 1.01).toFixed(2))
        });
      }
    }

    // Bull Flag / Trend Continuation
    const startWindow = recent.slice(0, 10);
    const endWindow = recent.slice(-10);
    const impulseReturn = (startWindow[startWindow.length - 1].close - startWindow[0].open) / startWindow[0].open;
    const consolidationRange = (Math.max(...endWindow.map(c => c.high)) - Math.min(...endWindow.map(c => c.low))) / currentPrice;

    if (impulseReturn > 0.04 && consolidationRange < 0.025) {
      patterns.push({
        id: `pat-bull-flag-${Date.now()}`,
        name: 'Bullish Flag Continuation',
        type: 'BULLISH',
        category: 'CHART',
        timeframe,
        confidence: 73,
        supportingData: `Sharp upward pole (+${(impulseReturn * 100).toFixed(1)}%) followed by tight parallel consolidation range`,
        invalidationLevel: Number((Math.min(...endWindow.map(c => c.low)) * 0.995).toFixed(2))
      });
    }
  }

  return patterns;
}
