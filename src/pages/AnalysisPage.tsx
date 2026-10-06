import React, { useState } from 'react';
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
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Layers,
  Building2,
  BarChart2,
  Newspaper,
  FileText,
  Cpu,
  ShieldAlert
} from 'lucide-react';

interface AnalysisPageProps {
  asset: Asset;
  isWatched: boolean;
  onToggleWatchlist: () => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  asset,
  isWatched,
  onToggleWatchlist
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TECHNICAL' | 'FUNDAMENTAL' | 'QUANT' | 'SENTIMENT' | 'AI_REPORT' | 'TRANSPARENCY'>('OVERVIEW');
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [isTracked, setIsTracked] = useState(false);

  const { candles, quote, dataQuality, loading: dataLoading, refetch } = useMarketData(asset, timeframe);
  const { bundle, report, loading: pipelineLoading } = useAnalysisPipeline(asset, candles, timeframe);

  const isUp = quote ? quote.change >= 0 : true;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. ASSET HEADER */}
      <div className="glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-center gap-2">
              <span>{asset.symbol}</span>
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-brand-300 font-semibold">
              {asset.market}
            </span>
            <span className="text-xs text-slate-400 font-sans hidden sm:inline">
              • {asset.sector}
            </span>
            <button
              onClick={onToggleWatchlist}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/[0.04] transition-all"
              title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''}`} />
            </button>
          </div>
          <h2 className="text-xs text-slate-400 mt-1">{asset.name} • {asset.exchange}</h2>
        </div>

        {/* Price & Quality Indicators */}
        <div className="flex flex-wrap items-center gap-4 relative z-10">
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
                {isUp ? <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" /> : <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span>
                  {isUp ? '+' : ''}{quote.changePercent}% ({quote.change > 0 ? '+' : ''}{quote.change})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. PRICE CHART */}
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

      {/* 3. ML PREDICTION CARD & STATISTICAL PROJECTION CONES */}
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

      {/* 4. SCENARIOS CARD */}
      {bundle && (
        <ScenariosCard
          scenarios={bundle.prediction.scenarios}
          currency={asset.currency}
        />
      )}

      {/* 5. MULTI-ENGINE DEEP DIVE TABS */}
      {/* 5. MULTI-ENGINE DEEP DIVE TABS */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono shadow-inner">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all duration-150 shrink-0 ${
              activeTab === 'OVERVIEW'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            Terminal Overview
          </button>
          <button
            onClick={() => setActiveTab('TECHNICAL')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
              activeTab === 'TECHNICAL'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('FUNDAMENTAL')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
              activeTab === 'FUNDAMENTAL'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Fundamentals</span>
          </button>
          <button
            onClick={() => setActiveTab('QUANT')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
              activeTab === 'QUANT'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Quantitative & Risk</span>
          </button>
          <button
            onClick={() => setActiveTab('SENTIMENT')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
              activeTab === 'SENTIMENT'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>News & Macro</span>
          </button>
          <button
            onClick={() => setActiveTab('AI_REPORT')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
              activeTab === 'AI_REPORT'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Institutional Report</span>
          </button>
          <button
            onClick={() => setActiveTab('TRANSPARENCY')}
            className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 ${
              activeTab === 'TRANSPARENCY'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Model Transparency</span>
          </button>
        </div>

        {/* Active Tab Panel */}
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
                <div className="bg-background-card rounded-xl border border-background-border p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-background-border pb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Detailed Risk Engine Breakdown
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/30">
                      Overall Level: {bundle.risk.level}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {bundle.risk.factors.map((f, i) => (
                      <div key={i} className="p-3 rounded-lg bg-background-secondary border border-background-border text-xs font-mono flex items-center justify-between">
                        <div>
                          <span className="text-white font-bold block">{f.name}</span>
                          <span className="text-slate-400 font-sans text-[11px] block mt-0.5">{f.explanation}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block">{f.metricValue}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            f.status === 'SAFE' ? 'text-emerald-400 bg-emerald-500/10' : f.status === 'DANGER' ? 'text-rose-400 bg-rose-500/10' : 'text-amber-400 bg-amber-500/10'
                          }`}>
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
                <div className="bg-background-card rounded-xl border border-background-border p-5 shadow-lg space-y-3">
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
