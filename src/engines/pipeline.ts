import { Asset } from '../types/asset';
import { Candle, DataQuality } from '../types/marketData';
import { runTechnicalAnalysis } from './technical';
import { runFundamentalAnalysis } from './fundamental';
import { runSentimentAnalysis } from './sentiment';
import { runMacroAnalysis } from './macro/macroEngine';
import { runQuantitativeAnalysis } from './quant/quantEngine';
import { runMLPrediction } from './ml';
import { runRiskAnalysis } from './risk/riskEngine';
import { generateDeterministicReport, AnalysisBundle } from '../services/aiService';
import { AIAnalystReport } from '../types/ai';

export interface PipelineExecutionResult {
  bundle: AnalysisBundle;
  report: AIAnalystReport;
  executionTimeMs: number;
}

/**
 * Validates OHLCV time series data for integrity, gaps, and anomalies.
 */
export function validateMarketData(candles: Candle[]): {
  validCandles: Candle[];
  completeness: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  if (!candles || candles.length === 0) {
    return { validCandles: [], completeness: 0, warnings: ['No historical candles found.'] };
  }

  // Filter out invalid bars (NaNs or negative prices)
  const valid = candles.filter((c) => {
    return (
      !isNaN(c.close) &&
      !isNaN(c.open) &&
      !isNaN(c.high) &&
      !isNaN(c.low) &&
      c.close > 0 &&
      c.high >= c.low
    );
  });

  if (valid.length < 30) {
    warnings.push(`Limited historical data sample (${valid.length} bars). Minimum recommended is 60 bars.`);
  }

  const completeness = Math.min(100, Math.round((valid.length / Math.max(100, candles.length)) * 100));

  return { validCandles: valid, completeness, warnings };
}

/**
 * Master Pipeline:
 * Market Data → Data Validation → Feature Engineering → Technical Analysis →
 * Fundamental Analysis → Sentiment/News → Quantitative Analysis → ML Prediction →
 * Risk Analysis → Scenario Analysis → AI Explanation
 */
export function executeAnalysisPipeline(
  asset: Asset,
  rawCandles: Candle[],
  timeframe = '1D',
  isCached = false
): PipelineExecutionResult {
  const startTime = performance.now();

  // 1. Data Validation
  const { validCandles, completeness, warnings } = validateMarketData(rawCandles);
  const currentPrice = validCandles[validCandles.length - 1]?.close || 100;

  const dataQuality: DataQuality = {
    status: completeness > 85 ? 'HIGH' : completeness > 60 ? 'MEDIUM' : 'LIMITED',
    completeness,
    lastUpdated: Date.now(),
    sources: asset.dataProviders,
    isCached,
    staleReason: warnings.length > 0 ? warnings.join('; ') : undefined
  };

  // 2. Technical Analysis
  const technical = runTechnicalAnalysis(validCandles, timeframe);

  // 3. Fundamental Analysis (Asset-Specific)
  const fundamental = runFundamentalAnalysis(asset);

  // 4. Sentiment & News
  const sentiment = runSentimentAnalysis(asset);

  // 5. Macro Context
  const macro = runMacroAnalysis();

  // 6. Quantitative Analysis
  const quant = runQuantitativeAnalysis(validCandles, asset);

  // 7. ML Prediction & Volatility Cones & Scenarios
  const prediction = runMLPrediction(
    validCandles,
    asset,
    technical,
    fundamental,
    sentiment,
    macro,
    quant,
    timeframe
  );

  // 8. Risk Engine
  const risk = runRiskAnalysis(quant, technical, currentPrice);

  // 9. Analysis Bundle
  const bundle: AnalysisBundle = {
    asset,
    timeframe,
    currentPrice,
    dataQuality,
    technical,
    fundamental,
    sentiment,
    macro,
    quant,
    prediction,
    risk
  };

  // 10. AI Institutional Report Generation
  const report = generateDeterministicReport(bundle);

  const executionTimeMs = Number((performance.now() - startTime).toFixed(1));

  return {
    bundle,
    report,
    executionTimeMs
  };
}
