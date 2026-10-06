import { QuantitativeMetrics } from '../../types/quant';
import { TechnicalAnalysisResult } from '../../types/technical';
import { RiskAnalysisResult, RiskFactor, RiskLevel } from '../../types/risk';

export function runRiskAnalysis(
  quant: QuantitativeMetrics,
  technical: TechnicalAnalysisResult,
  currentPrice: number
): RiskAnalysisResult {
  const factors: RiskFactor[] = [];
  let riskScore = 0; // 0 (safest) to 100 (extreme danger)

  // 1. Volatility Risk
  const annVol = quant.annualizedVolatility;
  let volStatus: RiskFactor['status'] = 'SAFE';
  if (annVol > 55) {
    volStatus = 'DANGER';
    riskScore += 35;
  } else if (annVol > 30) {
    volStatus = 'CAUTION';
    riskScore += 20;
  } else {
    riskScore += 8;
  }
  factors.push({
    name: 'Annualized Volatility Risk',
    category: 'VOLATILITY',
    status: volStatus,
    score: Math.min(100, Math.round(annVol * 1.5)),
    metricValue: `${annVol}%`,
    explanation:
      annVol > 40
        ? 'High price variance implies substantial dispersion of short-term outcomes.'
        : 'Moderate to low annualized volatility provides relatively stable pricing structure.'
  });

  // 2. Drawdown Risk
  const maxDd = Math.abs(quant.maxDrawdown);
  let ddStatus: RiskFactor['status'] = 'SAFE';
  if (maxDd > 35) {
    ddStatus = 'DANGER';
    riskScore += 25;
  } else if (maxDd > 18) {
    ddStatus = 'CAUTION';
    riskScore += 15;
  } else {
    riskScore += 5;
  }
  factors.push({
    name: 'Historical Maximum Drawdown',
    category: 'DRAWDOWN',
    status: ddStatus,
    score: Math.min(100, Math.round(maxDd * 1.8)),
    metricValue: `-${maxDd}%`,
    explanation: `Historical peak-to-trough decline reached -${maxDd}%, requiring prudent position sizing.`
  });

  // 3. Structural Support Distance Risk
  const nearestSupport = technical.structure.supports[0]?.price || currentPrice * 0.95;
  const distanceToSupportPct = Math.abs(((currentPrice - nearestSupport) / currentPrice) * 100);
  let structStatus: RiskFactor['status'] = 'SAFE';
  if (distanceToSupportPct > 8.0) {
    structStatus = 'DANGER';
    riskScore += 25;
  } else if (distanceToSupportPct > 4.0) {
    structStatus = 'CAUTION';
    riskScore += 15;
  } else {
    riskScore += 5;
  }
  factors.push({
    name: 'Structural Support Proximity',
    category: 'STRUCTURE',
    status: structStatus,
    score: Math.min(100, Math.round(distanceToSupportPct * 10)),
    metricValue: `${distanceToSupportPct.toFixed(1)}% away`,
    explanation:
      distanceToSupportPct < 4.0
        ? 'Price is within tight proximity to support, allowing well-defined risk invalidation.'
        : 'Price is extended from immediate support; wider stop distance needed.'
  });

  // 4. Value-at-Risk (95% Daily)
  const var95 = quant.valueAtRisk95;
  factors.push({
    name: 'Value at Risk (95% 1-day)',
    category: 'VOLATILITY',
    status: var95 > 4.5 ? 'DANGER' : var95 > 2.5 ? 'CAUTION' : 'SAFE',
    score: Math.min(100, Math.round(var95 * 18)),
    metricValue: `-${var95}%`,
    explanation: `Statistically, on 95% of trading days, single-day losses do not exceed -${var95}%.`
  });

  const overallScore = Math.min(100, Math.max(10, Math.round(riskScore)));

  let level: RiskLevel = 'LOW';
  let recommendedMaxExposure = 5.0; // 5% portfolio risk
  if (overallScore >= 75) {
    level = 'CRITICAL';
    recommendedMaxExposure = 1.0;
  } else if (overallScore >= 50) {
    level = 'HIGH';
    recommendedMaxExposure = 2.0;
  } else if (overallScore >= 30) {
    level = 'MEDIUM';
    recommendedMaxExposure = 3.5;
  }

  // Stop loss proposal below nearest support
  const suggestedStopLossLevel = Number((nearestSupport * 0.985).toFixed(2));
  const suggestedStopLossPercent = Number(
    (Math.abs((currentPrice - suggestedStopLossLevel) / currentPrice) * 100).toFixed(2)
  );

  return {
    level,
    overallScore,
    factors,
    maxHistoricalDrawdown: quant.maxDrawdown,
    recommendedMaxExposurePercent: recommendedMaxExposure,
    suggestedStopLossLevel,
    suggestedStopLossPercent,
    summary: `${level} risk profile (Risk Index: ${overallScore}/100). Primary risk drivers are ${factors[0].name.toLowerCase()} and ${factors[1].name.toLowerCase()}.`,
    disclaimer:
      'Risk analysis is purely quantitative and does not constitute personalized financial advice or execution recommendations. All investments carry risk of capital loss.'
  };
}
