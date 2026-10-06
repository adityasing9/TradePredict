import { Market } from './asset';
import { DirectionProbability } from './prediction';

export interface TrackedPrediction {
  id: string;
  assetId: string;
  symbol: string;
  market: Market;
  timeframe: string;
  createdAt: number;
  evaluateAt: number;
  startingPrice: number;
  predictedDirection: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  predictedProbabilities: DirectionProbability;
  predictedPriceRange: [number, number];
  predictedReturnRange: [number, number];
  predictedConfidence: number;
  modelVersion: string;
  evaluated: boolean;
  actualPriceAtEvaluation?: number;
  actualReturnPercent?: number;
  outcome?: 'CORRECT' | 'INCORRECT' | 'NEUTRAL_ACCURATE';
  absoluteReturnError?: number;
  notes?: string;
}

export interface CalibrationBucket {
  confidenceRange: string; // e.g. "50-60%", "60-70%"
  expectedAccuracy: number; // e.g. 55%
  empiricalAccuracy: number; // actual % of wins
  count: number;
}

export interface ModelPerformanceMetrics {
  totalPredictions: number;
  evaluatedPredictions: number;
  pendingPredictions: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercent: number;
  accuracyByMarket: Record<string, { total: number; correct: number; accuracy: number }>;
  accuracyByTimeframe: Record<string, { total: number; correct: number; accuracy: number }>;
  calibration: CalibrationBucket[];
  averageReturnErrorPercent: number;
  lastEvaluatedAt: number;
}
