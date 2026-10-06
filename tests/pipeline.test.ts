import { describe, it, expect } from 'vitest';
import { ALL_ASSETS } from '../src/data/universe';
import { executeAnalysisPipeline } from '../src/engines/pipeline';
import { Candle } from '../src/types/marketData';

describe('Unified Analytical Pipeline Multi-Market Verification', () => {
  const generateMockCandles = (basePrice: number): Candle[] => {
    return Array.from({ length: 60 }, (_, i) => ({
      time: 1700000000 + i * 86400,
      open: basePrice + i * 0.5,
      high: basePrice + i * 0.5 + 3,
      low: basePrice + i * 0.5 - 2,
      close: basePrice + i * 0.5 + 1.2,
      volume: 50000 + Math.random() * 20000
    }));
  };

  it('runs complete pipeline for Nepal NEPSE asset (NABIL)', () => {
    const nabil = ALL_ASSETS.find((a) => a.id === 'NEPSE:NABIL')!;
    const candles = generateMockCandles(520);
    const { bundle, report, executionTimeMs } = executeAnalysisPipeline(nabil, candles, '1D');

    expect(bundle.asset.market).toBe('NEPSE');
    expect(bundle.technical.technicalScore).toBeDefined();
    expect(bundle.fundamental.nepse).toBeDefined();
    expect(bundle.fundamental.nepse?.epsNpr).toBe(28.45);
    expect(bundle.prediction.directionProbabilities.up + bundle.prediction.directionProbabilities.neutral + bundle.prediction.directionProbabilities.down).toBe(100);
    expect(bundle.prediction.scenarios.bull.invalidationCondition).toBeTruthy();
    expect(bundle.prediction.projectionCones.length).toBeGreaterThan(0);
    expect(report.executiveSummary).toContain('NABIL');
    expect(executionTimeMs).toBeGreaterThan(0);
  });

  it('runs complete pipeline for Indian NSE asset (RELIANCE)', () => {
    const rel = ALL_ASSETS.find((a) => a.id === 'NSE:RELIANCE')!;
    const candles = generateMockCandles(2980);
    const { bundle, report } = executeAnalysisPipeline(rel, candles, '1D');

    expect(bundle.asset.market).toBe('NSE');
    expect(bundle.fundamental.stock).toBeDefined();
    expect(bundle.fundamental.stock?.peRatio).toBe(26.4);
    expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(bundle.risk.level);
    expect(report.keyLevels.immediateSupport).toBeDefined();
  });

  it('runs complete pipeline for Crypto asset with on-chain telemetry (BTC/USDT)', () => {
    const btc = ALL_ASSETS.find((a) => a.id === 'CRYPTO:BTCUSDT')!;
    const candles = generateMockCandles(65000);
    const { bundle, report } = executeAnalysisPipeline(btc, candles, '4H');

    expect(bundle.asset.market).toBe('CRYPTO');
    expect(bundle.fundamental.crypto).toBeDefined();
    expect(bundle.fundamental.crypto?.tokenomics.maxSupply).toBe(21000000);
    expect(bundle.fundamental.crypto?.onchain.exchangeNetFlow24hUsd).toBe(-48500000);
    // Observation vs Interpretation separation
    expect(bundle.fundamental.crypto?.onchain.metrics[0].observation).toBeDefined();
    expect(bundle.fundamental.crypto?.onchain.metrics[0].interpretation).toBeDefined();
    expect(report.predictionSummary.probabilityText).toContain('UP:');
  });
});
