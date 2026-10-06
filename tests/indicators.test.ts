import { describe, it, expect } from 'vitest';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateBollingerBands,
  calculateATR
} from '../src/engines/technical/indicators';
import { Candle } from '../src/types/marketData';

describe('Technical Indicators Mathematical Engine', () => {
  it('calculates Simple Moving Average (SMA) correctly', () => {
    const data = [10, 20, 30, 40, 50];
    const sma3 = calculateSMA(data, 3);
    expect(sma3).toBe(40); // (30 + 40 + 50) / 3 = 40

    const sma5 = calculateSMA(data, 5);
    expect(sma5).toBe(30);
  });

  it('calculates Exponential Moving Average (EMA) with smoothing', () => {
    const data = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const ema5 = calculateEMA(data, 5);
    expect(ema5).toBeGreaterThan(15);
    expect(ema5).toBeLessThanOrEqual(20);
  });

  it('calculates RSI within bounded 0 to 100 range', () => {
    // Strictly increasing prices -> RSI should be high
    const bullData = Array.from({ length: 30 }, (_, i) => 100 + i * 2);
    const bullRSI = calculateRSI(bullData, 14);
    expect(bullRSI.value).toBeGreaterThan(70);
    expect(bullRSI.status).toBe('OVERBOUGHT');

    // Strictly decreasing prices -> RSI should be low
    const bearData = Array.from({ length: 30 }, (_, i) => 200 - i * 3);
    const bearRSI = calculateRSI(bearData, 14);
    expect(bearRSI.value).toBeLessThan(30);
    expect(bearRSI.status).toBe('OVERSOLD');
  });

  it('calculates Bollinger Bands symmetric standard deviation envelope', () => {
    const closes = Array.from({ length: 30 }, () => 100 + Math.random() * 4);
    const bb = calculateBollingerBands(closes, 20, 2);
    expect(bb.upper).toBeGreaterThan(bb.middle);
    expect(bb.middle).toBeGreaterThan(bb.lower);
    expect(bb.bandwidth).toBeGreaterThan(0);
  });

  it('calculates Average True Range (ATR)', () => {
    const sampleCandles: Candle[] = Array.from({ length: 25 }, (_, i) => ({
      time: 1700000000 + i * 86400,
      open: 100 + i,
      high: 105 + i,
      low: 98 + i,
      close: 102 + i,
      volume: 10000
    }));

    const atr = calculateATR(sampleCandles, 14);
    expect(atr.value).toBeGreaterThan(0);
    expect(['LOW', 'NORMAL', 'ELEVATED', 'EXTREME']).toContain(atr.regime);
  });
});
