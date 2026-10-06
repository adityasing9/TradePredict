import React from 'react';
import { FundamentalAnalysisResult } from '../../types/fundamental';
import { Building2, Coins, Network, AlertCircle, FileText } from 'lucide-react';

interface FundamentalPanelProps {
  fundamental: FundamentalAnalysisResult;
  currency: string;
}

export const FundamentalPanel: React.FC<FundamentalPanelProps> = ({ fundamental, currency }) => {
  const { assetType, score, status, summary, stock, nepse, crypto } = fundamental;

  const getStatusBadge = (s: typeof status) => {
    switch (s) {
      case 'EXCELLENT':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'FAIR':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'WEAK':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'DATA_LIMITED':
      default:
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="w-full bg-background-card rounded-xl border border-background-border p-5 shadow-lg flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            {assetType === 'CRYPTO' ? (
              <Coins className="w-4 h-4 text-brand-400" />
            ) : (
              <Building2 className="w-4 h-4 text-brand-400" />
            )}
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {assetType === 'CRYPTO' ? 'Crypto Fundamentals & On-Chain' : 'Fundamental Analysis Engine'}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-2xl font-extrabold font-mono text-white">
              {score > 0 ? `+${score}` : score}
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </span>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getStatusBadge(status)}`}>
              {status}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-md">{summary}</p>
      </div>

      {/* 1. NEPSE Specific Fundamentals */}
      {nepse && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
              Nepal Regulatory & Quarterly Metrics ({nepse.quarter} {nepse.fiscalYear})
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-secondary border border-background-border text-emerald-400">
              Verified NRB / SEBON Disclosures
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">EPS (NPR)</span>
              <span className="text-base font-bold text-white block mt-0.5">
                NPR {nepse.epsNpr !== undefined ? nepse.epsNpr : 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Book Value (BVPS)</span>
              <span className="text-base font-bold text-white block mt-0.5">
                NPR {nepse.bookValuePerShare !== undefined ? nepse.bookValuePerShare : 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">P/E Ratio</span>
              <span className="text-base font-bold text-slate-200 block mt-0.5">
                {nepse.peRatio !== undefined ? `${nepse.peRatio}x` : 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Dividend Yield</span>
              <span className="text-base font-bold text-emerald-400 block mt-0.5">
                {nepse.dividendYield !== undefined ? `${nepse.dividendYield}%` : 'N/A'}
              </span>
            </div>

            {nepse.nonPerformingLoanPercent !== undefined && (
              <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
                <span className="text-[10px] text-slate-500 uppercase block">NPL Ratio</span>
                <span className={`text-base font-bold block mt-0.5 ${nepse.nonPerformingLoanPercent > 4.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {nepse.nonPerformingLoanPercent}%
                </span>
              </div>
            )}

            {nepse.capitalAdequacyRatio !== undefined && (
              <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
                <span className="text-[10px] text-slate-500 uppercase block">Capital Adequacy (CAR)</span>
                <span className="text-base font-bold text-slate-200 block mt-0.5">
                  {nepse.capitalAdequacyRatio}%
                </span>
              </div>
            )}

            {nepse.quarterlyProfitYoY !== undefined && (
              <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
                <span className="text-[10px] text-slate-500 uppercase block">YoY Profit Growth</span>
                <span className={`text-base font-bold block mt-0.5 ${nepse.quarterlyProfitYoY >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {nepse.quarterlyProfitYoY > 0 ? '+' : ''}{nepse.quarterlyProfitYoY}%
                </span>
              </div>
            )}

            {nepse.sectorRank && (
              <div className="p-3 rounded-lg bg-background-secondary border border-background-border col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase block">Sector Standing</span>
                <span className="text-[11px] font-medium text-slate-300 block mt-0.5 truncate">
                  {nepse.sectorRank}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Standard Stock Fundamentals (US / India) */}
      {stock && !nepse && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
              Financial Ratios & Multiples
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-secondary border border-background-border text-brand-400">
              Valuation: {stock.valuationStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Trailing P/E</span>
              <span className="text-base font-bold text-white block mt-0.5">{stock.peRatio || 'N/A'}x</span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Forward P/E</span>
              <span className="text-base font-bold text-white block mt-0.5">{stock.forwardPE || 'N/A'}x</span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Return on Equity (ROE)</span>
              <span className="text-base font-bold text-emerald-400 block mt-0.5">{stock.roe ? `${stock.roe}%` : 'N/A'}</span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Operating Margin</span>
              <span className="text-base font-bold text-slate-200 block mt-0.5">{stock.operatingMargin ? `${stock.operatingMargin}%` : 'N/A'}</span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Revenue YoY Growth</span>
              <span className="text-base font-bold text-slate-200 block mt-0.5">{stock.revenueYoY ? `+${stock.revenueYoY}%` : 'N/A'}</span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Debt-to-Equity</span>
              <span className="text-base font-bold text-slate-200 block mt-0.5">{stock.debtToEquity ?? 'N/A'}</span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Dividend Yield</span>
              <span className="text-base font-bold text-slate-200 block mt-0.5">{stock.dividendYield ? `${stock.dividendYield}%` : '0%'}</span>
            </div>

            <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">EV / EBITDA</span>
              <span className="text-base font-bold text-slate-200 block mt-0.5">{stock.evToEbitda ? `${stock.evToEbitda}x` : 'N/A'}</span>
            </div>
          </div>

          {stock.valuationBasis && (
            <div className="p-2.5 rounded-lg bg-background-secondary border border-background-border text-[11px] text-slate-300">
              <span className="text-slate-500 font-mono font-bold uppercase mr-1.5">Basis:</span>
              {stock.valuationBasis}
            </div>
          )}
        </div>
      )}

      {/* 3. Crypto Tokenomics & On-Chain */}
      {crypto && (
        <div className="space-y-4">
          {/* Tokenomics */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
              Tokenomics & Protocol Economics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
                <span className="text-[10px] text-slate-500 uppercase block">Circulating Supply Float</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {crypto.tokenomics.circulatingPercent.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
                <span className="text-[10px] text-slate-500 uppercase block">Annual Inflation Rate</span>
                <span className="text-base font-bold text-emerald-400 block mt-0.5">
                  {crypto.tokenomics.annualInflationRate}%
                </span>
              </div>

              <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
                <span className="text-[10px] text-slate-500 uppercase block">24h Protocol Fees</span>
                <span className="text-base font-bold text-slate-200 block mt-0.5">
                  ${(crypto.protocol.fees24h / 1000000).toFixed(2)}M
                </span>
              </div>

              <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
                <span className="text-[10px] text-slate-500 uppercase block">Active Addresses (24h)</span>
                <span className="text-base font-bold text-slate-200 block mt-0.5">
                  {crypto.network.activeAddresses24h.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* On-Chain Metrics (Observation vs Interpretation) */}
          <div className="space-y-2 pt-2 border-t border-background-border">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                On-Chain Analysis: Factual Observation vs Analytical Interpretation
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                Net Flow: {crypto.onchain.exchangeNetFlow24hUsd < 0 ? 'Outflow' : 'Inflow'}
              </span>
            </div>

            <div className="space-y-2">
              {crypto.onchain.metrics.map((m, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-background-secondary border border-background-border flex flex-col gap-1.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.metric}</span>
                    <span className="text-brand-400 font-bold">{m.value}</span>
                  </div>

                  <div className="text-[11px] font-sans text-slate-300">
                    <span className="text-slate-500 font-mono font-bold uppercase text-[10px] mr-1">
                      Observation:
                    </span>
                    {m.observation}
                  </div>

                  <div className="text-[11px] font-sans text-slate-400 italic">
                    <span className="text-amber-500/80 font-mono not-italic font-bold uppercase text-[10px] mr-1">
                      Interpretation:
                    </span>
                    {m.interpretation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
