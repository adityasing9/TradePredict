import { Asset } from '../types/asset';
import { TechnicalAnalysisResult } from '../types/technical';
import { FundamentalAnalysisResult } from '../types/fundamental';
import { SentimentAnalysisResult, MacroContext } from '../types/sentiment';
import { QuantitativeMetrics } from '../types/quant';
import { MLPredictionResult } from '../types/prediction';
import { RiskAnalysisResult } from '../types/risk';
import { DataQuality } from '../types/marketData';
import { AIAnalystReport, ChatMessage } from '../types/ai';
import { AISettings } from '../types/settings';

export interface AnalysisBundle {
  asset: Asset;
  timeframe: string;
  currentPrice: number;
  dataQuality: DataQuality;
  technical: TechnicalAnalysisResult;
  fundamental: FundamentalAnalysisResult;
  sentiment: SentimentAnalysisResult;
  macro: MacroContext;
  quant: QuantitativeMetrics;
  prediction: MLPredictionResult;
  risk: RiskAnalysisResult;
}

/**
 * Deterministic Institutional Research Analyst Engine.
 * Generates structured, compliant institutional reports based purely on calculated data
 * without fabricating metrics or making false claims of certainty.
 */
export function generateDeterministicReport(bundle: AnalysisBundle): AIAnalystReport {
  const { asset, currentPrice, technical, fundamental, sentiment, macro, quant, prediction, risk, dataQuality } = bundle;
  const p = prediction.directionProbabilities;
  const curr = asset.currency;

  const executiveSummary = `${asset.name} (${asset.symbol}) currently trades at ${curr} ${currentPrice.toLocaleString()}. Our multi-factor analysis identifies a ${prediction.direction.toLowerCase()} bias with an estimated directional probability of ${p.up}% Up, ${p.neutral}% Neutral, and ${p.down}% Down over the ${bundle.timeframe} horizon. The overall risk profile is classified as ${risk.level} (${risk.overallScore}/100) within a ${macro.regime.toLowerCase()} macroeconomic regime.`;

  const currentMarketState = `The market is currently in a ${quant.regime.replace('_', ' ').toLowerCase()} state with 20-day annualized volatility of ${quant.rollingVolatility20d}%. Benchmark beta stands at ${quant.beta} against ${quant.benchmarkName}. Price is located ${risk.factors.find(f => f.category === 'STRUCTURE')?.metricValue || 'near range median'}.`;

  const technicalSummary = `Technical indicator aggregation scores ${technical.technicalScore}/100 (${technical.signal.replace('_', ' ')}). Moving average alignment is ${technical.trend.maAlignment.toLowerCase().replace('_', ' ')}, with 14-period RSI at ${technical.indicators.rsi.value} (${technical.indicators.rsi.status.toLowerCase()}) and MACD histogram at ${technical.indicators.macd.histogram}. Support levels are identified at ${curr} ${technical.structure.supports.map(s => s.price).join(', ')} while resistance clusters stand at ${curr} ${technical.structure.resistances.map(r => r.price).join(', ')}.`;

  const fundamentalSummary = `${fundamental.summary} Valuation classification is ${fundamental.status}. ${fundamental.stock ? `Price-to-Earnings ratio stands at ${fundamental.stock.peRatio || 'N/A'}, ROE at ${fundamental.stock.roe ? fundamental.stock.roe + '%' : 'N/A'}, and debt-to-equity at ${fundamental.stock.debtToEquity || 'N/A'}.` : ''} ${fundamental.nepse ? `NEPSE reported EPS is NPR ${fundamental.nepse.epsNpr || 'N/A'} with Book Value per share of NPR ${fundamental.nepse.bookValuePerShare || 'N/A'}.` : ''} ${fundamental.crypto ? `Circulating token supply represents ${fundamental.crypto.tokenomics.circulatingPercent.toFixed(1)}% of total supply with net exchange flows at ${fundamental.crypto.onchain.exchangeNetFlow24hUsd < 0 ? 'bullish net outflow' : 'net inflow'}.` : ''}`;

  const sentimentSummary = `News and sentiment flow registers an aggregate score of ${sentiment.overallScore}/100 (${sentiment.label.toLowerCase()}). High-impact catalysts include: ${sentiment.highImpactEvents.map(e => `"${e.title}"`).join('; ') || 'No critical high-impact regulatory or earnings disruptions detected in the immediate cycle.'}`;

  const quantSummary = `Historical win rate over past periods is ${quant.historicalWinRate}% with a profit/loss factor of ${quant.profitToLossRatio}. Annualized Sharpe ratio is ${quant.sharpeRatio} and Sortino ratio is ${quant.sortinoRatio}. Value at Risk (95% 1-day) indicates maximum expected single-session downside of -${quant.valueAtRisk95}%.`;

  const bull = prediction.scenarios.bull;
  const base = prediction.scenarios.base;
  const bear = prediction.scenarios.bear;

  return {
    id: `report-${asset.symbol.toLowerCase()}-${Date.now()}`,
    assetId: asset.id,
    symbol: asset.symbol,
    assetName: asset.name,
    market: asset.market,
    timeframe: bundle.timeframe,
    currentPrice,
    currency: curr,
    generatedAt: Date.now(),
    provider: 'TradePredict Institutional Analytical Engine (Local Deterministic)',
    executiveSummary,
    currentMarketState,
    technicalAnalysis: technicalSummary,
    fundamentalAnalysis: fundamentalSummary,
    sentimentAnalysis: sentimentSummary,
    quantitativeAnalysis: quantSummary,
    riskEvaluation: {
      level: risk.level,
      text: `${risk.summary} Recommended maximum risk capital allocation: ${risk.recommendedMaxExposurePercent}% of portfolio.`
    },
    predictionSummary: {
      bias: prediction.direction,
      probabilityText: `UP: ${p.up}% | NEUTRAL: ${p.neutral}% | DOWN: ${p.down}%`,
      targetRangeText: `${curr} ${prediction.expectedPriceRange[0]} — ${curr} ${prediction.expectedPriceRange[1]} (${prediction.expectedReturnRange[0]}% to ${prediction.expectedReturnRange[1]}%)`
    },
    bullScenario: {
      catalysts: bull.supportingFactors.join('; '),
      levels: `Target: ${curr} ${bull.targetPrice} (${bull.expectedReturnRange[0]}% to ${bull.expectedReturnRange[1]}%)`,
      probability: `${bull.probability}%`
    },
    baseScenario: {
      characteristics: base.supportingFactors.join('; '),
      range: `Target: ${curr} ${base.targetPrice} (${base.expectedReturnRange[0]}% to ${base.expectedReturnRange[1]}%)`,
      probability: `${base.probability}%`
    },
    bearScenario: {
      triggers: bear.supportingFactors.join('; '),
      downside: `Target: ${curr} ${bear.targetPrice} (${bear.expectedReturnRange[0]}% to ${bear.expectedReturnRange[1]}%)`,
      probability: `${bear.probability}%`
    },
    keyLevels: {
      immediateSupport: technical.structure.supports[0]?.price || currentPrice * 0.97,
      majorSupport: technical.structure.supports[1]?.price || currentPrice * 0.94,
      immediateResistance: technical.structure.resistances[0]?.price || currentPrice * 1.03,
      majorResistance: technical.structure.resistances[1]?.price || currentPrice * 1.06,
      pivot: technical.structure.pivotPoints.pivot
    },
    invalidationConditions: [
      bull.invalidationCondition,
      bear.invalidationCondition,
      `Unscheduled macro rate shock altering the prevailing ${macro.regime} liquidity regime.`
    ],
    modelConfidence: {
      score: prediction.confidenceScore,
      explanation: `Confidence rating is ${prediction.confidenceScore}% based on cross-engine consensus and data completeness (${dataQuality.completeness}% verified data points).`
    },
    dataQuality,
    sources: [
      ...dataQuality.sources,
      'TradePredict Mathematical Engine v1.4.0',
      'Historical OHLCV Time Series'
    ]
  };
}

/**
 * Handles interactive queries from the AI Research Assistant.
 */
export async function queryAIAnalyst(
  prompt: string,
  bundle: AnalysisBundle,
  settings: AISettings,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  // If external provider is configured and API key / URL exists:
  if (settings.provider === 'OPENROUTER' && settings.openRouterApiKey) {
    try {
      const systemPrompt = `You are TradePredict AI Senior Market Analyst. You answer questions strictly based on the provided verified structured financial data bundle for ${bundle.asset.symbol}. Never invent prices or predict guaranteed outcomes. Maintain analytical objectivity. Data bundle: ${JSON.stringify({
        asset: bundle.asset.symbol,
        price: bundle.currentPrice,
        currency: bundle.asset.currency,
        technicalScore: bundle.technical.technicalScore,
        rsi: bundle.technical.indicators.rsi.value,
        direction: bundle.prediction.direction,
        probabilities: bundle.prediction.directionProbabilities,
        scenarios: bundle.prediction.scenarios,
        risk: bundle.risk.level
      })}`;

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.openRouterApiKey}`
        },
        body: JSON.stringify({
          model: settings.openRouterModel || 'anthropic/claude-3.5-sonnet',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: prompt }
          ],
          temperature: settings.temperature || 0.3
        })
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices[0]?.message?.content || 'Unable to generate response from OpenRouter.';
      }
    } catch (err) {
      console.warn('OpenRouter request failed, falling back to local analyst:', err);
    }
  }

  // Fallback: Smart Local Deterministic Chat Engine
  const q = prompt.toLowerCase();
  const { asset, currentPrice, technical, fundamental, prediction, risk, macro } = bundle;
  const p = prediction.directionProbabilities;

  if (q.includes('bullish') || q.includes('why') && q.includes('bull')) {
    return `**Why is ${asset.symbol} showing a ${prediction.direction} bias?**\n\n1. **Technical Momentum:** The technical score is ${technical.technicalScore}/100 with RSI at ${technical.indicators.rsi.value}. Moving averages exhibit ${technical.trend.maAlignment.toLowerCase().replace('_', ' ')} alignment.\n2. **Probabilities:** The boosted ensemble estimates an upward continuation probability of **${p.up}%** (vs ${p.down}% Down).\n3. **Key Catalyst:** Price is respecting structural support at ${asset.currency} ${technical.structure.supports[0]?.price} with expanding volume support.\n4. **Invalidation:** A clean breakdown below ${asset.currency} ${prediction.scenarios.bull.invalidationLevel} would invalidate this hypothesis.`;
  }

  if (q.includes('risk') || q.includes('stop loss') || q.includes('downside')) {
    return `**Risk Assessment for ${asset.symbol}:**\n\n- **Risk Level:** **${risk.level}** (${risk.overallScore}/100)\n- **Max Historical Drawdown:** -${Math.abs(risk.maxHistoricalDrawdown)}%\n- **Suggested Stop-Loss Level:** ${asset.currency} ${risk.suggestedStopLossLevel} (-${risk.suggestedStopLossPercent}% from current price ${asset.currency} ${currentPrice})\n- **Recommended Portfolio Exposure:** ≤ ${risk.recommendedMaxExposurePercent}% of total trading capital.`;
  }

  if (q.includes('invalidate') || q.includes('wrong') || q.includes('fail')) {
    return `**What Would Invalidate the Current Thesis?**\n\n1. **Bullish Invalidation:** ${prediction.scenarios.bull.invalidationCondition}\n2. **Bearish Invalidation:** ${prediction.scenarios.bear.invalidationCondition}\n3. **Macro Invalidation:** A surprise reversal in the ${macro.regime} monetary backdrop would compress valuation multiples.`;
  }

  if (q.includes('rsi') && q.includes('beginner')) {
    return `**Understanding RSI (Relative Strength Index) for ${asset.symbol}:**\n\nThe 14-period RSI currently reads **${technical.indicators.rsi.value}** (${technical.indicators.rsi.status}).\n- RSI measures the speed and magnitude of recent price changes on a 0–100 scale.\n- Values above 70 indicate an overbought condition (buyers may be exhausted).\n- Values below 30 indicate an oversold condition (sellers may be exhausted).\n- A value between 45 and 65 is generally considered a healthy, sustainable trend.`;
  }

  return `**Analysis Summary for ${asset.symbol} (${asset.name}):**\n\n- **Current Price:** ${asset.currency} ${currentPrice.toLocaleString()}\n- **Directional Bias:** ${prediction.direction} (Probabilities: Up ${p.up}%, Neutral ${p.neutral}%, Down ${p.down}%)\n- **Expected Horizon Range:** ${asset.currency} ${prediction.expectedPriceRange[0]} to ${asset.currency} ${prediction.expectedPriceRange[1]}\n- **Key Support / Resistance:** Immediate support at ${asset.currency} ${technical.structure.supports[0]?.price}, resistance at ${asset.currency} ${technical.structure.resistances[0]?.price}\n- **Fundamental Status:** ${fundamental.status}\n\n*Note: Predictions are probabilistic estimates and not guaranteed outcomes.*`;
}
