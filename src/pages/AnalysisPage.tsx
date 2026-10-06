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
      <div className="bg-background-card rounded-2xl border border-background-border p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">
              {asset.symbol}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-background-secondary border border-background-border text-slate-300">
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
              <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
          <h2 className="text-xs text-slate-400 mt-1">{asset.name}</h2>
        </div>

        {/* Price & Quality Indicators */}
        <div className="flex flex-wrap items-center gap-4">
          <DataQualityBadge quality={dataQuality} />

          {quote && (
            <div className="text-right font-mono">
              <div className="text-2xl font-black text-white">
                {asset.currency} {quote.price.toLocaleString()}
              </div>
              <div
                className={`text-xs font-bold flex items-center justify-end gap-1 ${
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
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-background-border pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-background-secondary border border-background-border'
            }`}
          >
            Terminal Overview
          </button>
          <button
            onClick={() => setActiveTab('TECHNICAL')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'TECHNICAL'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-background-secondary border border-background-border'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('FUNDAMENTAL')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'FUNDAMENTAL'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-background-secondary border border-background-border'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Fundamentals</span>
          </button>
          <button
            onClick={() => setActiveTab('QUANT')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'QUANT'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-background-secondary border border-background-border'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Quantitative & Risk</span>
          </button>
          <button
            onClick={() => setActiveTab('SENTIMENT')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'SENTIMENT'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-background-secondary border border-background-border'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>News & Macro</span>
          </button>
          <button
            onClick={() => setActiveTab('AI_REPORT')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'AI_REPORT'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-background-secondary border border-background-border'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Institutional Report</span>
          </button>
          <button
            onClick={() => setActiveTab('TRANSPARENCY')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'TRANSPARENCY'
                ? 'bg-brand-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-background-secondary border border-background-border'
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
