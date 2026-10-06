import React, { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { Timeframe } from '../types/marketData';
import { useMarketData } from '../hooks/useMarketData';
import { useAnalysisPipeline } from '../hooks/useAnalysisPipeline';
import { FinancialChart } from '../components/charts/FinancialChart';
import { PredictionConeChart } from '../components/charts/PredictionConeChart';
import { PredictionCard } from '../components/prediction/PredictionCard';
import { ScenariosCard } from '../components/prediction/ScenariosCard';
import { ModelTransparency } from '../components/prediction/ModelTransparency';
import { TechnicalPanel } from '../components/technical/TechnicalPanel';
import { FundamentalPanel } from '../components/fundamental/FundamentalPanel';
import { QuantPanel } from '../components/quant/QuantPanel';
import { AIReportCard } from '../components/ai/AIReportCard';
import { DataQualityBadge } from '../components/common/DataQualityBadge';
import { TrackPredictionModal } from '../components/tracking/TrackPredictionModal';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Layers,
  Building2,
  BarChart2,
  Newspaper,
  FileText,
  Cpu,
  ShieldAlert,
  Clock,
  Activity,
  CheckCircle2
} from 'lucide-react';

export type AnalysisTabType =
  | 'OVERVIEW'
  | 'TECHNICAL'
  | 'FUNDAMENTAL'
  | 'QUANT'
  | 'SENTIMENT'
  | 'AI_REPORT'
  | 'TRANSPARENCY';

interface AnalysisPageProps {
  asset: Asset;
  isWatched: boolean;
  onToggleWatchlist: () => void;
  initialTab?: AnalysisTabType;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  asset,
  isWatched,
  onToggleWatchlist,
  initialTab = 'OVERVIEW'
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [activeTab, setActiveTab] = useState<AnalysisTabType>(initialTab);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const { candles, quote, dataQuality, loading: dataLoading, refetch } = useMarketData(asset, timeframe);
  const { bundle, report, loading: pipelineLoading } = useAnalysisPipeline(asset, candles, timeframe);

  const isUp = quote ? quote.change >= 0 : true;

  // Derive scores for Analysis Summary Bar
  const overallBias = bundle?.prediction.direction || 'CALCULATING...';
  const confidence = bundle?.prediction.confidenceScore || 70;
  const techScore = bundle?.technical.technicalScore !== undefined ? Math.round((bundle.technical.technicalScore + 100) / 2) : 65;
  const fundScore = bundle?.fundamental.score !== undefined ? bundle.fundamental.score : 60;
  const sentScore = bundle?.sentiment.overallScore !== undefined ? Math.round((bundle.sentiment.overallScore + 100) / 2) : 55;
  const riskLevel = bundle?.risk.level || 'MEDIUM';

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* 1. ASSET HEADER */}
      <div className="terminal-panel p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {asset.symbol}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-background-border text-brand-300 font-semibold">
              {asset.market}
            </span>
            <span className="text-xs text-slate-400 font-sans hidden sm:inline">
              • {asset.sector}
            </span>
            <button
              onClick={onToggleWatchlist}
              className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
              title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star
                className={`w-4 h-4 ${
                  isWatched ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
            <span>{asset.name}</span>
            <span>•</span>
            <span>{asset.exchange}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Price & Quality Indicators */}
        <div className="flex flex-wrap items-center gap-4">
          <DataQualityBadge quality={dataQuality} />

          {quote && (
            <div className="text-right font-mono">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {asset.currency} {quote.price.toLocaleString()}
              </div>
              <div
                className={`text-xs font-bold flex items-center justify-end gap-1 mt-0.5 ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {isUp ? '+' : ''}{quote.changePercent}% ({quote.change > 0 ? '+' : ''}{quote.change})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. ANALYSIS SUMMARY BAR (Required by prompt Section 12) */}
      <div className="terminal-panel p-3 bg-background-secondary border border-background-border">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          {/* Assessment */}
          <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Assessment</span>
            <span
              className={`font-bold block mt-0.5 ${
                overallBias === 'BULLISH'
                  ? 'text-emerald-400'
                  : overallBias === 'BEARISH'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {overallBias}
            </span>
          </div>

          {/* Model Confidence */}
          <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Confidence</span>
            <span className="font-bold text-white block mt-0.5">{confidence}%</span>
          </div>

          {/* Technical Score */}
          <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Technical Score</span>
            <span className="font-bold text-slate-200 block mt-0.5">{techScore} / 100</span>
          </div>

          {/* Fundamental Score */}
          <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Fundamental Score</span>
            <span className="font-bold text-slate-200 block mt-0.5">{fundScore} / 100</span>
          </div>

          {/* Sentiment Score */}
          <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Sentiment Score</span>
            <span className="font-bold text-slate-200 block mt-0.5">{sentScore} / 100</span>
          </div>

          {/* Risk Level */}
          <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-500 uppercase block">Risk Level</span>
            <span
              className={`font-bold block mt-0.5 ${
                riskLevel === 'LOW'
                  ? 'text-emerald-400'
                  : riskLevel === 'HIGH' || riskLevel === 'CRITICAL'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* 3. PRICE CHART WITH INDICATOR OVERLAYS */}
      <FinancialChart
        candles={candles}
        currency={asset.currency}
        symbol={asset.symbol}
        currentTimeframe={timeframe}
        onSelectTimeframe={setTimeframe}
        supports={bundle?.technical.structure.supports}
        resistances={bundle?.technical.structure.resistances}
        onRefresh={refetch}
        loading={dataLoading}
      />

      {/* 4. PREDICTION COMPONENT & STATISTICAL CONES */}
      {bundle && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PredictionCard
            prediction={bundle.prediction}
            currency={asset.currency}
            onTrackPrediction={() => setTrackModalOpen(true)}
            isTracked={isTracked}
          />
          <PredictionConeChart
            cones={bundle.prediction.projectionCones}
            currentPrice={bundle.currentPrice}
            currency={asset.currency}
          />
        </div>
      )}

      {/* 5. MULTI-SCENARIO PATH & INVALIDATION */}
      {bundle && (
        <ScenariosCard
          scenarios={bundle.prediction.scenarios}
          currency={asset.currency}
        />
      )}

      {/* 6. MULTI-ENGINE DEEP DIVE TABS */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-lg bg-background-secondary border border-background-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded transition-colors shrink-0 ${
              activeTab === 'OVERVIEW'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('TECHNICAL')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'TECHNICAL'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Technical</span>
          </button>
          <button
            onClick={() => setActiveTab('FUNDAMENTAL')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'FUNDAMENTAL'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Fundamentals</span>
          </button>
          <button
            onClick={() => setActiveTab('QUANT')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'QUANT'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Quant & Risk</span>
          </button>
          <button
            onClick={() => setActiveTab('SENTIMENT')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'SENTIMENT'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Sentiment & Macro</span>
          </button>
          <button
            onClick={() => setActiveTab('AI_REPORT')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'AI_REPORT'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Research Report</span>
          </button>
          <button
            onClick={() => setActiveTab('TRANSPARENCY')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'TRANSPARENCY'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Model Transparency</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        {bundle && (
          <div>
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-4">
                <TechnicalPanel technical={bundle.technical} currency={asset.currency} />
                <FundamentalPanel fundamental={bundle.fundamental} currency={asset.currency} />
                <QuantPanel quant={bundle.quant} />
              </div>
            )}

            {activeTab === 'TECHNICAL' && (
              <TechnicalPanel technical={bundle.technical} currency={asset.currency} />
            )}

            {activeTab === 'FUNDAMENTAL' && (
              <FundamentalPanel fundamental={bundle.fundamental} currency={asset.currency} />
            )}

            {activeTab === 'QUANT' && (
              <div className="space-y-4">
                <QuantPanel quant={bundle.quant} />
                {/* Risk Analysis Card */}
                <div className="terminal-panel p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-background-border">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Detailed Risk Engine Breakdown
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                      Overall Level: {bundle.risk.level}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {bundle.risk.factors.map((f, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-background-secondary border border-background-border text-xs font-mono flex items-center justify-between"
                      >
                        <div>
                          <span className="text-white font-bold block">{f.name}</span>
                          <span className="text-slate-400 font-sans text-[11px] block mt-0.5">
                            {f.explanation}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block">{f.metricValue}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              f.status === 'SAFE'
                                ? 'text-emerald-400 bg-emerald-500/10'
                                : f.status === 'DANGER'
                                ? 'text-rose-400 bg-rose-500/10'
                                : 'text-amber-400 bg-amber-500/10'
                            }`}
                          >
                            {f.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'SENTIMENT' && (
              <div className="space-y-4">
                <div className="terminal-panel p-4 space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Macro Context & News Telemetry
                  </h3>
                  <p className="text-xs text-slate-400">{bundle.macro.summary}</p>
                  <p className="text-xs text-slate-300">{bundle.sentiment.summary}</p>
                </div>
              </div>
            )}

            {activeTab === 'AI_REPORT' && report && (
              <AIReportCard report={report} />
            )}

            {activeTab === 'TRANSPARENCY' && (
              <ModelTransparency prediction={bundle.prediction} />
            )}
          </div>
        )}
      </div>

      {/* Track Prediction Modal */}
      {bundle && (
        <TrackPredictionModal
          isOpen={trackModalOpen}
          onClose={() => setTrackModalOpen(false)}
          prediction={bundle.prediction}
          asset={asset}
          onTrackedSuccess={() => setIsTracked(true)}
        />
      )}
    </div>
  );
};
