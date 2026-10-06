import React, { useState } from 'react';
import { AIAnalystReport } from '../../types/ai';
import { FileText, Copy, Check, AlertOctagon } from 'lucide-react';

interface AIReportCardProps {
  report: AIAnalystReport;
}

export const AIReportCard: React.FC<AIReportCardProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `# Institutional Market Intelligence Report: ${report.symbol} (${report.assetName})
Generated: ${new Date(report.generatedAt).toLocaleString()}
Engine: ${report.provider}

## 1. Executive Summary
${report.executiveSummary}

## 2. Current Market State
${report.currentMarketState}

## 3. Technical Analysis
${report.technicalAnalysis}

## 4. Fundamental Analysis
${report.fundamentalAnalysis}

## 5. Sentiment & Event Analysis
${report.sentimentAnalysis}

## 6. Quantitative Statistical Risk
${report.quantitativeAnalysis}

## 7. Risk Evaluation
${report.riskEvaluation.text}

## 8. Multi-Scenario Analysis
- Bull Case: ${report.bullScenario.catalysts} | ${report.bullScenario.levels}
- Base Case: ${report.baseScenario.characteristics} | ${report.baseScenario.range}
- Bear Case: ${report.bearScenario.triggers} | ${report.bearScenario.downside}

## 9. Key Price Levels
- Immediate Support: ${report.currency} ${report.keyLevels.immediateSupport}
- Major Support: ${report.currency} ${report.keyLevels.majorSupport}
- Dynamic Pivot: ${report.currency} ${report.keyLevels.pivot}
- Immediate Resistance: ${report.currency} ${report.keyLevels.immediateResistance}
- Major Resistance: ${report.currency} ${report.keyLevels.majorResistance}

## 10. Invalidation Conditions
${report.invalidationConditions.map(c => `- ${c}`).join('\n')}

## 11. Model Confidence & Data Quality
Confidence: ${report.modelConfidence.score}% (${report.modelConfidence.explanation})
Data Quality: ${report.dataQuality.status} (${report.dataQuality.completeness}% completeness)
Sources: ${report.sources.join(', ')}

---
Disclaimer: Probabilistic estimate based on historical and technical data. Not financial advice.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full terminal-panel p-4 sm:p-5 flex flex-col gap-4">
      {/* Report Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-cyan">
              Institutional Research Dossier
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary border border-border text-slate-300">
              {report.provider}
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {report.assetName} ({report.symbol}) — Market Assessment Report
          </h2>
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            Generated: {new Date(report.generatedAt).toLocaleString()} • Horizon: {report.timeframe}
          </p>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-secondary hover:bg-surface-elevated border border-border text-xs font-mono text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-white transition-all shadow-sm font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-market-bullish" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copied Markdown' : 'Copy Report'}</span>
        </button>
      </div>

      {/* 1. Executive Summary */}
      <section className="space-y-1">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-accent-cyan">
          1. Executive Summary
        </h3>
        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-surface-secondary p-3 rounded border border-border font-sans">
          {report.executiveSummary}
        </p>
      </section>

      {/* 2 & 3. Market State & Technical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <section className="space-y-1">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            2. Current Market State
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-surface-secondary p-2.5 rounded border border-border font-sans">
            {report.currentMarketState}
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            3. Technical Synthesis
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-surface-secondary p-2.5 rounded border border-border font-sans">
            {report.technicalAnalysis}
          </p>
        </section>
      </div>

      {/* 4 & 5. Fundamental & Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <section className="space-y-1">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            4. Fundamental Context
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-surface-secondary p-2.5 rounded border border-border font-sans">
            {report.fundamentalAnalysis}
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            5. News & Event Sentiment
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-surface-secondary p-2.5 rounded border border-border font-sans">
            {report.sentimentAnalysis}
          </p>
        </section>
      </div>

      {/* 6 & 7. Quantitative & Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <section className="space-y-1">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            6. Quantitative Metrics
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-surface-secondary p-2.5 rounded border border-border font-sans">
            {report.quantitativeAnalysis}
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-market-bearish">
            7. Risk Assessment
          </h3>
          <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed bg-rose-500/10 p-2.5 rounded border border-rose-500/20 font-sans">
            {report.riskEvaluation.text}
          </p>
        </section>
      </div>

      {/* 8. Key Price Levels */}
      <section className="space-y-1.5 pt-2 border-t border-border">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
          8. Critical Decision Levels
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center">
          <div className="p-2 rounded bg-surface-secondary border border-border">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Major Support</span>
            <span className="text-emerald-600 dark:text-market-bullish font-bold block mt-0.5">{report.currency} {report.keyLevels.majorSupport}</span>
          </div>
          <div className="p-2 rounded bg-surface-secondary border border-border">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Immediate Support</span>
            <span className="text-emerald-600 dark:text-market-bullish font-bold block mt-0.5">{report.currency} {report.keyLevels.immediateSupport}</span>
          </div>
          <div className="p-2 rounded bg-surface-secondary border border-border">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Dynamic Pivot</span>
            <span className="text-slate-900 dark:text-white font-black block mt-0.5">{report.currency} {report.keyLevels.pivot}</span>
          </div>
          <div className="p-2 rounded bg-surface-secondary border border-border">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Immediate Resist</span>
            <span className="text-rose-600 dark:text-market-bearish font-bold block mt-0.5">{report.currency} {report.keyLevels.immediateResistance}</span>
          </div>
          <div className="p-2 rounded bg-surface-secondary border border-border">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Major Resist</span>
            <span className="text-rose-600 dark:text-market-bearish font-bold block mt-0.5">{report.currency} {report.keyLevels.majorResistance}</span>
          </div>
        </div>
      </section>

      {/* 9. Invalidation Conditions */}
      <section className="space-y-1.5 pt-2 border-t border-border">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-market-warning flex items-center gap-1">
          <AlertOctagon className="w-3 h-3" />
          9. What Could Invalidate This Analysis
        </h3>
        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-1 font-medium">
          {report.invalidationConditions.map((cond, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px]">
              <span className="text-amber-500 mt-0.5">▸</span>
              <span>{cond}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 10. Data Quality & Metadata Footer */}
      <div className="pt-2.5 border-t border-border flex flex-wrap items-center justify-between gap-2.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          <span>Confidence: <strong className="text-slate-900 dark:text-white font-black">{report.modelConfidence.score}%</strong></span>
          <span>Data Quality: <strong className="text-emerald-600 dark:text-market-bullish">{report.dataQuality.status}</strong></span>
        </div>
        <div className="text-slate-500 truncate max-w-sm font-medium">
          Sources: {report.sources.join(', ')}
        </div>
      </div>
    </div>
  );
};
