export interface DirectionProbability {
  up: number; // e.g. 58 (meaning 58%)
  neutral: number; // e.g. 24
  down: number; // e.g. 18
}

export interface PriceProjectionConePoint {
  step: number; // 1, 2, 3... intervals ahead
  timestamp: number;
  label: string; // e.g. "+1 Day", "+3 Days"
  currentPrice: number;
  medianProjected: number;
  ci68Low: number;
  ci68High: number;
  ci95Low: number;
  ci95High: number;
}

export interface Scenario {
  type: 'BULL' | 'BASE' | 'BEAR';
  probability: number; // 0 - 100%
  title: string;
  expectedReturnRange: [number, number]; // [min%, max%]
  targetPrice: number;
  supportingFactors: string[];
  invalidationCondition: string;
  invalidationLevel: number;
}

export interface FeatureWeight {
  name: string;
  category: 'TECHNICAL' | 'FUNDAMENTAL' | 'SENTIMENT' | 'QUANT' | 'MACRO';
  weight: number; // e.g. 0.15
  impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  rawValue: string | number;
}

export interface EnsembleComponentWeight {
  component: string;
  weight: number; // percentage
  score: number; // component contribution -100 to +100
  note: string;
}

export type TradeAction = 'STRONG BUY' | 'BUY' | 'WAIT' | 'SELL' | 'STRONG SELL';

export type ExecutionTiming =
  | 'BUY NOW'
  | 'BUY ON PULLBACK'
  | 'BUY ON BREAKOUT'
  | 'SELL NOW'
  | 'SELL ON RALLY'
  | 'WAIT FOR CONFIRMATION';

export interface TradeRecommendation {
  action: TradeAction;
  timing: ExecutionTiming;
  isNow: boolean; // True if immediately actionable at current market price
  entryZone: {
    min: number;
    max: number;
    targetEntry: number;
    label: string;
  };
  stopLoss: {
    price: number;
    percent: number;
    label: string;
  };
  takeProfit1: {
    price: number;
    percent: number;
    label: string;
  };
  takeProfit2: {
    price: number;
    percent: number;
    label: string;
  };
  riskRewardRatio: number;
  rationale: string[];
  invalidationTrigger: string;
}

export interface MLPredictionResult {
  id: string;
  assetId: string;
  timeframe: string; // e.g. '1D', '4H'
  predictionHorizon: string; // e.g. 'Next 24h - 3 days'
  currentPrice: number;
  timestamp: number;
  direction: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  directionProbabilities: DirectionProbability;
  expectedReturnRange: [number, number]; // [-1.5%, +4.2%]
  expectedPriceRange: [number, number]; // [$182.50, $193.10]
  volatilityForecast: 'LOW' | 'NORMAL' | 'ELEVATED' | 'EXTREME';
  confidenceScore: number; // 0 - 100
  tradeRecommendation: TradeRecommendation;
  ensembleWeights: EnsembleComponentWeight[];
  scenarios: {
    bull: Scenario;
    base: Scenario;
    bear: Scenario;
  };
  projectionCones: PriceProjectionConePoint[];
  featuresUsed: FeatureWeight[];
  metadata: {
    modelVersion: string;
    modelType: string;
    featureVersion: string;
    trainingWindow: string;
    dataTimestamp: number;
    dataSourceReliability: string;
    disclaimer: string;
  };
}
