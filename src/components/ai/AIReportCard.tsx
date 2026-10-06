import React, { useState } from 'react';
import { AIAnalystReport } from '../../types/ai';
import { FileText, Copy, Check, Download, AlertOctagon, ShieldCheck } from 'lucide-react';

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
    <div className="w-full bg-background-card rounded-xl border border-background-border p-6 shadow-xl flex flex-col gap-5">
      {/* Report Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-background-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
              Institutional Research Dossier
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-secondary border border-background-border text-slate-400">
              {report.provider}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            {report.assetName} ({report.symbol}) — Market Assessment Report
          </h2>
          <p className="text-[11px] font-mono text-slate-400">
            Generated: {new Date(report.generatedAt).toLocaleString()} • Horizon: {report.timeframe}
          </p>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-secondary border border-background-border text-xs font-mono text-slate-300 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Markdown' : 'Copy Report'}</span>
        </button>
      </div>

      {/* 1. Executive Summary */}
      <section className="space-y-1.5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
          1. Executive Summary
        </h3>
        <p className="text-xs text-slate-200 leading-relaxed bg-background-secondary/60 p-3.5 rounded-lg border border-background-border/80">
          {report.executiveSummary}
        </p>
      </section>

      {/* 2 & 3. Market State & Technical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            2. Current Market State
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-background-secondary/40 p-3 rounded-lg border border-background-border">
            {report.currentMarketState}
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            3. Technical Synthesis
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-background-secondary/40 p-3 rounded-lg border border-background-border">
            {report.technicalAnalysis}
          </p>
        </section>
      </div>

      {/* 4 & 5. Fundamental & Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            4. Fundamental Context
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-background-secondary/40 p-3 rounded-lg border border-background-border">
            {report.fundamentalAnalysis}
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            5. News & Event Sentiment
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-background-secondary/40 p-3 rounded-lg border border-background-border">
            {report.sentimentAnalysis}
          </p>
        </section>
      </div>

      {/* 6 & 7. Quantitative & Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            6. Quantitative Metrics
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-background-secondary/40 p-3 rounded-lg border border-background-border">
            {report.quantitativeAnalysis}
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
            7. Risk Assessment
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-rose-500/5 p-3 rounded-lg border border-rose-500/20">
            {report.riskEvaluation.text}
          </p>
        </section>
      </div>

      {/* 8. Key Price Levels */}
      <section className="space-y-2 pt-2 border-t border-background-border">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          8. Critical Decision Levels
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center">
          <div className="p-2.5 rounded bg-background-secondary border border-background-border">
            <span className="text-[10px] text-slate-500 block">Major Support</span>
            <span className="text-emerald-400 font-bold block mt-0.5">{report.currency} {report.keyLevels.majorSupport}</span>
          </div>
          <div className="p-2.5 rounded bg-background-secondary border border-background-border">
            <span className="text-[10px] text-slate-500 block">Immediate Support</span>
            <span className="text-emerald-400 font-bold block mt-0.5">{report.currency} {report.keyLevels.immediateSupport}</span>
          </div>
          <div className="p-2.5 rounded bg-background-secondary border border-background-border">
            <span className="text-[10px] text-slate-500 block">Dynamic Pivot</span>
            <span className="text-white font-bold block mt-0.5">{report.currency} {report.keyLevels.pivot}</span>
          </div>
          <div className="p-2.5 rounded bg-background-secondary border border-background-border">
            <span className="text-[10px] text-slate-500 block">Immediate Resistance</span>
            <span className="text-rose-400 font-bold block mt-0.5">{report.currency} {report.keyLevels.immediateResistance}</span>
          </div>
          <div className="p-2.5 rounded bg-background-secondary border border-background-border">
            <span className="text-[10px] text-slate-500 block">Major Resistance</span>
            <span className="text-rose-400 font-bold block mt-0.5">{report.currency} {report.keyLevels.majorResistance}</span>
          </div>
        </div>
      </section>

      {/* 9. Invalidation Conditions */}
      <section className="space-y-2 pt-2 border-t border-background-border">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <AlertOctagon className="w-3.5 h-3.5" />
          9. What Could Invalidate This Analysis
        </h3>
        <ul className="text-xs text-slate-300 space-y-1.5 pl-2">
          {report.invalidationConditions.map((cond, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              <span>{cond}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 10. Data Quality & Metadata Footer */}
      <div className="pt-3 border-t border-background-border flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span>Confidence: <strong className="text-white">{report.modelConfidence.score}%</strong></span>
          <span>Data Quality: <strong className="text-emerald-400">{report.dataQuality.status}</strong></span>
        </div>
        <div className="text-slate-500 truncate max-w-sm">
          Sources: {report.sources.join(', ')}
        </div>
      </div>
    </div>
  );
};
