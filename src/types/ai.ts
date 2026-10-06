import { DataQuality } from './marketData';
import { RiskLevel } from './risk';

export interface AIAnalystReport {
  id: string;
  assetId: string;
  symbol: string;
  assetName: string;
  market: string;
  timeframe: string;
  currentPrice: number;
  currency: string;
  generatedAt: number;
  provider: string; // 'OpenRouter (Claude 3.5)' | 'Ollama' | 'Deterministic Institutional Engine'
  
  // Section 31 Structure
  executiveSummary: string;
  currentMarketState: string;
  technicalAnalysis: string;
  fundamentalAnalysis: string;
  sentimentAnalysis: string;
  quantitativeAnalysis: string;
  riskEvaluation: {
    level: RiskLevel;
    text: string;
  };
  predictionSummary: {
    bias: string;
    probabilityText: string;
    targetRangeText: string;
  };
  bullScenario: {
    catalysts: string;
    levels: string;
    probability: string;
  };
  baseScenario: {
    characteristics: string;
    range: string;
    probability: string;
  };
  bearScenario: {
    triggers: string;
    downside: string;
    probability: string;
  };
  keyLevels: {
    immediateSupport: number;
    majorSupport: number;
    immediateResistance: number;
    majorResistance: number;
    pivot: number;
  };
  invalidationConditions: string[];
  modelConfidence: {
    score: number;
    explanation: string;
  };
  dataQuality: DataQuality;
  sources: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  sources?: string[];
  suggestedPrompts?: string[];
}

export interface DocumentChunk {
  id: string;
  text: string;
  keywords: string[];
  tokenEstimate: number;
}

export interface RAGDocument {
  id: string;
  title: string;
  assetSymbol?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: number;
  chunks: DocumentChunk[];
  summary?: string;
}
