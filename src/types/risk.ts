export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskFactor {
  name: string;
  category: 'VOLATILITY' | 'DRAWDOWN' | 'LIQUIDITY' | 'STRUCTURE' | 'MACRO';
  status: 'SAFE' | 'CAUTION' | 'DANGER';
  score: number; // 0 - 100
  metricValue: string;
  explanation: string;
}

export interface RiskAnalysisResult {
  level: RiskLevel;
  overallScore: number; // 0 - 100
  factors: RiskFactor[];
  maxHistoricalDrawdown: number;
  recommendedMaxExposurePercent: number; // Risk management heuristic, e.g. 2 - 5%
  suggestedStopLossLevel?: number;
  suggestedStopLossPercent?: number;
  summary: string;
  disclaimer: string;
}
