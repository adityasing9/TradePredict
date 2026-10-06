import { describe, it, expect } from 'vitest';
import { ALL_ASSETS, getAssetById, filterAssets } from '../src/data/universe';
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

  it('correctly resolves and executes newly requested assets (NEAR, ANKR, META, PYPL, SPCX)', () => {
    // 1. NEAR
    const near = ALL_ASSETS.find((a) => a.id === 'CRYPTO:NEARUSDT')!;
    expect(near).toBeDefined();
    expect(near.symbol).toBe('NEAR/USDT');
    const nearCandles = generateMockCandles(4.85);
    const nearRun = executeAnalysisPipeline(near, nearCandles, '1D');
    expect(nearRun.bundle.fundamental.crypto?.tokenomics.circulatingPercent).toBeGreaterThan(95);

    // 2. ANKR
    const ankr = ALL_ASSETS.find((a) => a.id === 'CRYPTO:ANKRUSDT')!;
    expect(ankr).toBeDefined();
    expect(ankr.symbol).toBe('ANKR/USDT');

    // 3. META
    const meta = ALL_ASSETS.find((a) => a.id === 'NASDAQ:META')!;
    expect(meta).toBeDefined();
    const metaCandles = generateMockCandles(585);
    const metaRun = executeAnalysisPipeline(meta, metaCandles, '1D');
    expect(metaRun.bundle.fundamental.stock?.peRatio).toBe(28.5);

    // 4. PYPL
    const pypl = ALL_ASSETS.find((a) => a.id === 'NASDAQ:PYPL')!;
    expect(pypl).toBeDefined();
    const pyplCandles = generateMockCandles(78.4);
    const pyplRun = executeAnalysisPipeline(pypl, pyplCandles, '1D');
    expect(pyplRun.bundle.fundamental.stock?.valuationStatus).toBe('UNDERVALUED');

    // 5. SPCX
    const spcx = ALL_ASSETS.find((a) => a.id === 'NASDAQ:SPCX')!;
    expect(spcx).toBeDefined();
    expect(spcx.assetType).toBe('ETF');
  });

  it('supports flexible user search queries across symbol formats', () => {
    // Normalized lookup
    expect(getAssetById('near/usdt')?.id).toBe('CRYPTO:NEARUSDT');
    expect(getAssetById('nearusdt')?.id).toBe('CRYPTO:NEARUSDT');
    expect(getAssetById('ankr/usdt')?.id).toBe('CRYPTO:ANKRUSDT');
    expect(getAssetById('ankrusdt')?.id).toBe('CRYPTO:ANKRUSDT');
    expect(getAssetById('nvda')?.id).toBe('NASDAQ:NVDA');
    expect(getAssetById('aapl')?.id).toBe('NASDAQ:AAPL');
    expect(getAssetById('msft')?.id).toBe('NASDAQ:MSFT');
    expect(getAssetById('meta')?.id).toBe('NASDAQ:META');
    expect(getAssetById('amzn')?.id).toBe('NASDAQ:AMZN');
    expect(getAssetById('spcx')?.id).toBe('NASDAQ:SPCX');
    expect(getAssetById('pypl')?.id).toBe('NASDAQ:PYPL');

    // Filter search query
    expect(filterAssets({ searchQuery: 'near/usdt' }).some((a: any) => a.id === 'CRYPTO:NEARUSDT')).toBe(true);
    expect(filterAssets({ searchQuery: 'ankr/usdt' }).some((a: any) => a.id === 'CRYPTO:ANKRUSDT')).toBe(true);
    expect(filterAssets({ searchQuery: 'spcx' }).some((a: any) => a.id === 'NASDAQ:SPCX')).toBe(true);
    expect(filterAssets({ searchQuery: 'pypl' }).some((a: any) => a.id === 'NASDAQ:PYPL')).toBe(true);
  });
});
