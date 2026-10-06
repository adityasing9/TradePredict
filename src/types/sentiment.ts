export type NewsCategory =
  | 'EARNINGS'
  | 'REGULATORY'
  | 'PARTNERSHIP'
  | 'MACRO'
  | 'PRODUCT'
  | 'MANAGEMENT'
  | 'LEGAL'
  | 'HACK_EXPLOIT'
  | 'TOKENOMICS'
  | 'ANNOUNCEMENT'
  | 'GENERAL';

export type SentimentLabel = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedAt: number; // Unix ms
  assetId?: string;
  symbols: string[];
  category: NewsCategory;
  sentimentScore: number; // -1.0 to +1.0
  sentimentLabel: SentimentLabel;
  sentimentStrength: number; // 0 to 1.0
  impact: ImpactLevel;
  relevanceScore: number; // 0 to 1.0
}

export interface SentimentAnalysisResult {
  overallScore: number; // -100 to +100
  label: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  confidence: number; // 0 - 100
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  highImpactEvents: NewsItem[];
  recentNews: NewsItem[];
  summary: string;
  timestamp: number;
}

export interface MacroIndicator {
  id: string;
  name: string;
  region: 'GLOBAL' | 'US' | 'INDIA' | 'NEPAL';
  currentValue: number;
  previousValue: number;
  unit: string;
  lastUpdated: string;
  impactOnRisk: 'RISK_ON' | 'RISK_OFF' | 'NEUTRAL';
  notes: string;
}

export interface MacroContext {
  regime: 'RISK_ON' | 'RISK_OFF' | 'NEUTRAL' | 'TRANSITIONAL';
  score: number; // -100 to +100
  indicators: MacroIndicator[];
  summary: string;
  timestamp: number;
}
