import React, { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { Timeframe } from '../types/marketData';
import { useMarketData } from '../hooks/useMarketData';
import { useAnalysisPipeline } from '../hooks/useAnalysisPipeline';
import { FinancialChart } from '../components/charts/FinancialChart';
import { PredictionConeChart } from '../components/charts/PredictionConeChart';
import { ScenariosCard } from '../components/prediction/ScenariosCard';
import { ModelTransparency } from '../components/prediction/ModelTransparency';
import { TechnicalPanel } from '../components/technical/TechnicalPanel';
import { FundamentalPanel } from '../components/fundamental/FundamentalPanel';
import { QuantPanel } from '../components/quant/QuantPanel';
import { AIReportCard } from '../components/ai/AIReportCard';
import { DataQualityBadge } from '../components/common/DataQualityBadge';
import { TrackPredictionModal } from '../components/tracking/TrackPredictionModal';
import { ALL_ASSETS } from '../data/universe';
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
  PlusCircle,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Minus
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
  onTabChange?: (tab: AnalysisTabType) => void;
  onSelectAsset?: (asset: Asset) => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  asset,
  isWatched,
  onToggleWatchlist,
  initialTab = 'OVERVIEW',
  onTabChange,
  onSelectAsset
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

  const handleSelectTab = (tab: AnalysisTabType) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const { candles, quote, dataQuality, loading: dataLoading, refetch } = useMarketData(asset, timeframe);
  const { bundle, report } = useAnalysisPipeline(asset, candles, timeframe);

  const isUp = quote ? quote.change >= 0 : true;

  // Scores for Analysis Summary Bar & Right Panel
  const overallBias = bundle?.prediction.direction || 'CALCULATING';
  const confidence = bundle?.prediction.confidenceScore || 70;
  const techScore = bundle?.technical.technicalScore !== undefined ? Math.round((bundle.technical.technicalScore + 100) / 2) : 65;
  const fundScore = bundle?.fundamental.score !== undefined ? bundle.fundamental.score : 60;
  const sentScore = bundle?.sentiment.overallScore !== undefined ? Math.round((bundle.sentiment.overallScore + 100) / 2) : 55;
  const riskLevel = bundle?.risk.level || 'MEDIUM';

  const probs = bundle?.prediction.directionProbabilities || { up: 60, neutral: 25, down: 15 };
  const currentPrice = bundle?.currentPrice || (quote ? quote.price : 100);
  const [targetLow, targetHigh] = bundle?.prediction.expectedPriceRange || [currentPrice * 0.97, currentPrice * 1.04];

  // Visual Slider Support / Resistance anchors
  const supportAnchor = Math.min(targetLow * 0.96, currentPrice * 0.95);
  const resistanceAnchor = Math.max(targetHigh * 1.04, currentPrice * 1.05);
  const totalSpan = Math.max(0.1, resistanceAnchor - supportAnchor);
  const getPercentPos = (val: number) => Math.min(100, Math.max(0, ((val - supportAnchor) / totalSpan) * 100));
  const currentPos = getPercentPos(currentPrice);
  const targetLowPos = getPercentPos(targetLow);
  const targetHighPos = getPercentPos(targetHigh);

  // Invalidation condition
  const invalidationText =
    overallBias === 'BULLISH'
      ? bundle?.prediction.scenarios.bull.invalidationCondition
      : overallBias === 'BEARISH'
      ? bundle?.prediction.scenarios.bear.invalidationCondition
      : bundle?.prediction.scenarios.base.invalidationCondition;

  // Sentiment classification
  const sentimentIndex = sentScore; // 0 - 100
  const sentimentStatus =
    sentimentIndex >= 70
      ? 'Greed'
      : sentimentIndex >= 55
      ? 'Moderate Greed'
      : sentimentIndex <= 35
      ? 'Fear'
      : 'Neutral';

  // Watchlist quick items (first 5 popular assets from other markets)
  const quickAssets = ALL_ASSETS.filter((a) => a.id !== asset.id).slice(0, 5);

  return (
    <div className="space-y-4 animate-in fade-in duration-100">
      {/* 1. ASSET HEADER BAR */}
      <div className="terminal-panel p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {asset.symbol}
            </h1>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
              asset.market === 'NEPSE'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                : asset.market === 'NSE'
                ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25'
                : asset.market === 'NASDAQ'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
            }`}>
              {asset.market}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-sans hidden sm:inline font-medium">
              • {asset.name}
            </span>
            <button
              onClick={onToggleWatchlist}
              className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
              title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star
                className={`w-4 h-4 ${
                  isWatched ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            <span className="font-semibold">{asset.exchange}</span>
            <span>•</span>
            <span>{asset.sector}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Price & Quality Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <DataQualityBadge quality={dataQuality} />

          {quote && (
            <div className="text-right font-mono">
              <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight tabular-nums">
                {asset.currency} {quote.price.toLocaleString()}
              </div>
              <div
                className={`text-[11px] font-black flex items-center justify-end gap-1 mt-0.5 ${
                  isUp ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
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

      {/* 2. ANALYSIS SUMMARY DATA STRIP */}
      <div className="terminal-panel p-2.5 bg-surface-secondary border border-border shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          <div className="p-2 rounded-md bg-surface border border-border shadow-2xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Assessment</span>
            <span
              className={`font-black block mt-0.5 text-xs ${
                overallBias === 'BULLISH'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : overallBias === 'BEARISH'
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {overallBias}
            </span>
          </div>

          <div className="p-2 rounded-md bg-surface border border-border shadow-2xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Model Confidence</span>
            <span className="font-black text-slate-900 dark:text-white block mt-0.5 text-xs">{confidence}%</span>
          </div>

          <div className="p-2 rounded-md bg-surface border border-border shadow-2xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Technical Score</span>
            <span className="font-black text-slate-900 dark:text-white block mt-0.5 text-xs">{techScore} / 100</span>
          </div>

          <div className="p-2 rounded-md bg-surface border border-border shadow-2xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Fundamental Score</span>
            <span className="font-black text-slate-900 dark:text-white block mt-0.5 text-xs">{fundScore} / 100</span>
          </div>

          <div className="p-2 rounded-md bg-surface border border-border shadow-2xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Sentiment Score</span>
            <span className="font-black text-slate-900 dark:text-white block mt-0.5 text-xs">{sentScore} / 100</span>
          </div>

          <div className="p-2 rounded-md bg-surface border border-border shadow-2xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Risk Level</span>
            <span
              className={`font-black block mt-0.5 text-xs ${
                riskLevel === 'LOW'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : riskLevel === 'HIGH' || riskLevel === 'CRITICAL'
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY TERMINAL TWO-COLUMN SPLIT (68% LEFT / 32% RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: DOMINANT CHART & MULTI-ENGINE WORKSPACE (8 of 12 cols = 67%) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Dominant Financial Chart */}
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

          {/* Projection Cones Chart */}
          {bundle && (
            <PredictionConeChart
              cones={bundle.prediction.projectionCones}
              currentPrice={bundle.currentPrice}
              currency={asset.currency}
            />
          )}

          {/* Multi-Scenario Trajectory Cards */}
          {bundle && (
            <ScenariosCard
              scenarios={bundle.prediction.scenarios}
              currency={asset.currency}
            />
          )}

          {/* Deep-Dive Multi-Engine Tabs */}
          <div className="space-y-3">
            <div className="flex items-center gap-1 overflow-x-auto p-1 rounded bg-surface-secondary border border-border text-xs font-mono">
              <button
                onClick={() => handleSelectTab('OVERVIEW')}
                className={`px-2.5 py-1 rounded transition-colors shrink-0 ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-surface-elevated text-accent-cyan font-bold border border-border'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleSelectTab('TECHNICAL')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors shrink-0 ${
                  activeTab === 'TECHNICAL'
                    ? 'bg-surface-elevated text-accent-cyan font-bold border border-border'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Technical</span>
              </button>
              <button
                onClick={() => handleSelectTab('FUNDAMENTAL')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors shrink-0 ${
                  activeTab === 'FUNDAMENTAL'
                    ? 'bg-surface-elevated text-accent-cyan font-bold border border-border'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Fundamentals</span>
              </button>
              <button
                onClick={() => handleSelectTab('QUANT')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors shrink-0 ${
                  activeTab === 'QUANT'
                    ? 'bg-surface-elevated text-accent-cyan font-bold border border-border'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3 h-3" />
                <span>Quant & Risk</span>
              </button>
              <button
                onClick={() => handleSelectTab('SENTIMENT')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors shrink-0 ${
                  activeTab === 'SENTIMENT'
                    ? 'bg-surface-elevated text-accent-cyan font-bold border border-border'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Newspaper className="w-3 h-3" />
                <span>Sentiment & Macro</span>
              </button>
              <button
                onClick={() => handleSelectTab('AI_REPORT')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors shrink-0 ${
                  activeTab === 'AI_REPORT'
                    ? 'bg-surface-elevated text-accent-cyan font-bold border border-border'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>AI Report</span>
              </button>
              <button
                onClick={() => handleSelectTab('TRANSPARENCY')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors shrink-0 ${
                  activeTab === 'TRANSPARENCY'
                    ? 'bg-surface-elevated text-accent-cyan font-bold border border-border'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>Transparency</span>
              </button>
            </div>

            {/* Tab Content Panels */}
            {bundle && (
              <div>
                {activeTab === 'OVERVIEW' && (
                  <div className="space-y-3">
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
                  <div className="space-y-3">
                    <QuantPanel quant={bundle.quant} />
                    <div className="terminal-panel p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-market-bearish flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Detailed Risk Engine Breakdown
                        </h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-market-bearish/10 text-market-bearish font-bold border border-market-bearish/20">
                          Level: {bundle.risk.level}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {bundle.risk.factors.map((f, i) => (
                          <div
                            key={i}
                            className="p-2 rounded bg-surface-secondary border border-border text-xs font-mono flex items-center justify-between"
                          >
                            <div>
                              <span className="text-white font-bold block">{f.name}</span>
                              <span className="text-slate-400 font-sans text-[11px] block mt-0.2">
                                {f.explanation}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-white block">{f.metricValue}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  f.status === 'SAFE'
                                    ? 'text-market-bullish bg-market-bullish/10'
                                    : f.status === 'DANGER'
                                    ? 'text-market-bearish bg-market-bearish/10'
                                    : 'text-market-warning bg-market-warning/10'
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
                  <div className="space-y-3">
                    <div className="terminal-panel p-3.5 space-y-2">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                        Macro Context & News Telemetry
                      </h3>
                      <p className="text-xs text-slate-400 font-mono leading-relaxed">{bundle.macro.summary}</p>
                      <p className="text-xs text-slate-300 font-mono leading-relaxed">{bundle.sentiment.summary}</p>
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
        </div>

        {/* RIGHT COLUMN: INTELLIGENCE PANEL (4 of 12 cols = 33%) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* A. QUICK WATCHLIST STRIP */}
          <div className="terminal-panel p-3 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-border">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Quick Watchlist Strip
              </span>
              <span className="text-[9px] font-mono text-slate-500">1-Click Switch</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {quickAssets.map((qa) => (
                <button
                  key={qa.id}
                  onClick={() => onSelectAsset && onSelectAsset(qa)}
                  className="p-1 rounded bg-surface-secondary hover:bg-surface-elevated border border-border hover:border-accent-cyan/40 text-center transition-colors group"
                  title={`${qa.name} (${qa.market})`}
                >
                  <span className="block font-mono font-bold text-[11px] text-white group-hover:text-accent-cyan">
                    {qa.symbol}
                  </span>
                  <span className="block text-[9px] font-mono text-slate-500">
                    {qa.market}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* B. MARKET SENTIMENT INDICATOR GAUGE */}
          <div className="terminal-panel p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-border">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Market Sentiment Telemetry
              </span>
              <span className={`text-[10px] font-mono font-bold ${
                sentimentIndex >= 60 ? 'text-market-bullish' : sentimentIndex <= 40 ? 'text-market-bearish' : 'text-slate-300'
              }`}>
                {sentimentIndex} / 100 • {sentimentStatus}
              </span>
            </div>

            {/* Visual Sentiment Meter */}
            <div className="space-y-1">
              <div className="w-full h-1.5 rounded bg-surface-secondary overflow-hidden flex border border-border">
                <div style={{ width: `${sentimentIndex}%` }} className={`h-full transition-all ${
                  sentimentIndex >= 60 ? 'bg-market-bullish' : sentimentIndex <= 40 ? 'bg-market-bearish' : 'bg-market-warning'
                }`} />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0 Fear</span>
                <span>50 Neutral</span>
                <span>100 Greed</span>
              </div>
            </div>

            <div className="p-2 rounded bg-surface-secondary border border-border text-[11px] font-mono text-slate-300">
              <span className="text-slate-500 text-[10px] block">Momentum Driver:</span>
              <span className="text-slate-200">
                {bundle?.sentiment.highImpactEvents[0] ? bundle.sentiment.highImpactEvents[0].title : bundle?.sentiment.summary || 'Macro liquidity and algorithmic volume in equilibrium.'}
              </span>
            </div>
          </div>

          {/* C. SIGNATURE AI SIGNAL COMPONENT */}
          <div className="terminal-panel p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                  Signature AI Signal
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent-cyan-subtle text-accent-cyan border border-accent-cyan-border font-bold">
                {timeframe} Model
              </span>
            </div>

            {/* Direction & Confidence */}
            <div className="p-2.5 rounded bg-surface-secondary border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Signal Posture</span>
                <span
                  className={`text-base font-black font-mono block mt-0.5 ${
                    overallBias === 'BULLISH'
                      ? 'text-market-bullish'
                      : overallBias === 'BEARISH'
                      ? 'text-market-bearish'
                      : 'text-market-warning'
                  }`}
                >
                  {overallBias === 'BULLISH' ? 'MODERATELY BULLISH' : overallBias === 'BEARISH' ? 'MODERATELY BEARISH' : 'NEUTRAL / CAUTIOUS'}
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
                <span className="text-base font-bold text-white block mt-0.5">{confidence}%</span>
              </div>
            </div>

            {/* "WHY?" EVIDENCE DRIVERS */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-slate-400">
                <HelpCircle className="w-3 h-3 text-accent-cyan" />
                <span>Why? (Primary Evidence Factors)</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                {bundle?.prediction.featuresUsed && bundle.prediction.featuresUsed.length > 0 ? (
                  bundle.prediction.featuresUsed.slice(0, 3).map((feat, i) => (
                    <div key={i} className="p-1.5 rounded bg-surface-secondary border border-border flex items-center justify-between">
                      <span className="text-slate-300 truncate max-w-[190px]">
                        • {feat.name} ({feat.rawValue})
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                          feat.impact === 'POSITIVE'
                            ? 'text-market-bullish bg-market-bullish/10'
                            : feat.impact === 'NEGATIVE'
                            ? 'text-market-bearish bg-market-bearish/10'
                            : 'text-slate-400'
                        }`}
                      >
                        {feat.impact}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-slate-500 font-mono">
                    • Multi-timeframe trend alignment and volatility normalization
                  </div>
                )}
              </div>
            </div>

            {/* "RISK" ALERT BOX */}
            <div className="p-2.5 rounded bg-market-bearish/5 border border-market-bearish/20 space-y-1 text-xs font-mono">
              <div className="flex items-center gap-1 text-market-bearish text-[10px] font-bold uppercase">
                <AlertTriangle className="w-3 h-3" />
                <span>Risk & Sensitivity Trigger</span>
              </div>
              <p className="text-[11px] text-rose-300 font-sans leading-relaxed">
                {invalidationText || 'Close below dynamic support invalidates setup; volatility expansion exceeds normal bounds.'}
              </p>
            </div>

            {/* Track Button */}
            <button
              onClick={() => setTrackModalOpen(true)}
              disabled={isTracked}
              className={`w-full py-1.5 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors ${
                isTracked
                  ? 'bg-market-bullish/10 text-market-bullish border border-market-bullish/30 cursor-default'
                  : 'bg-surface-elevated hover:bg-surface-secondary text-accent-cyan border border-accent-cyan-border'
              }`}
            >
              {isTracked ? <CheckCircle className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
              <span>{isTracked ? 'Tracked in DB' : 'Track Outcome in Audit Log'}</span>
            </button>
          </div>

          {/* D. PREDICTIVE OUTLOOK PANEL */}
          <div className="terminal-panel p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-border">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Predictive Outlook Distribution
              </span>
              <span className="text-[9px] font-mono text-slate-500">7-Day Horizon</span>
            </div>

            {/* Horizontal Distribution Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-market-bullish font-bold">Bull: {probs.up}%</span>
                <span className="text-slate-400 font-bold">Neutral: {probs.neutral}%</span>
                <span className="text-market-bearish font-bold">Bear: {probs.down}%</span>
              </div>
              <div className="w-full h-2 rounded bg-surface-secondary overflow-hidden flex border border-border">
                <div style={{ width: `${probs.up}%` }} className="h-full bg-market-bullish" />
                <div style={{ width: `${probs.neutral}%` }} className="h-full bg-slate-500" />
                <div style={{ width: `${probs.down}%` }} className="h-full bg-market-bearish" />
              </div>
            </div>

            {/* Target Price Range Slider */}
            <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 text-[10px] uppercase">Expected Range:</span>
                <span className="text-accent-cyan font-bold">
                  {asset.currency} {targetLow.toFixed(1)} – {targetHigh.toFixed(1)}
                </span>
              </div>

              {/* Slider Track */}
              <div className="relative pt-2 pb-1">
                <div className="w-full h-1 rounded bg-surface-elevated relative">
                  <div
                    className="absolute top-0 bottom-0 bg-accent-cyan/40 border-y border-accent-cyan/60 rounded"
                    style={{
                      left: `${targetLowPos}%`,
                      width: `${Math.max(3, targetHighPos - targetLowPos)}%`
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-accent-cyan"
                    style={{ left: `calc(${currentPos}% - 5px)` }}
                    title={`Current: ${asset.currency} ${currentPrice}`}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>Support: {supportAnchor.toFixed(1)}</span>
                <span className="text-white font-bold">Now: {currentPrice.toFixed(1)}</span>
                <span>Resist: {resistanceAnchor.toFixed(1)}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed pt-1 border-t border-border">
              Probabilistic model estimation derived from ensemble quant models. Not brokerage execution advice.
            </p>
          </div>
        </div>
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
