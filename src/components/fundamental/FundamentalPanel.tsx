import React from 'react';
import { FundamentalAnalysisResult } from '../../types/fundamental';
import { Building2, Coins } from 'lucide-react';

interface FundamentalPanelProps {
  fundamental: FundamentalAnalysisResult;
  currency: string;
}

export const FundamentalPanel: React.FC<FundamentalPanelProps> = ({ fundamental, currency }) => {
  const { assetType, score, status, summary, stock, nepse, crypto } = fundamental;

  const getStatusBadge = (s: typeof status) => {
    switch (s) {
      case 'EXCELLENT':
        return 'bg-market-bullish/10 text-market-bullish border-market-bullish/30';
      case 'FAIR':
        return 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30';
      case 'WEAK':
        return 'bg-market-bearish/10 text-market-bearish border-market-bearish/30';
      case 'DATA_LIMITED':
      default:
        return 'bg-market-warning/10 text-market-warning border-market-warning/30';
    }
  };

  return (
    <div className="w-full terminal-panel p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            {assetType === 'CRYPTO' ? (
              <Coins className="w-3.5 h-3.5 text-accent-cyan" />
            ) : (
              <Building2 className="w-3.5 h-3.5 text-accent-cyan" />
            )}
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {assetType === 'CRYPTO' ? 'Crypto Fundamentals & On-Chain' : 'Fundamental Analysis Engine'}
            </h3>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              {score > 0 ? `+${score}` : score}
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getStatusBadge(status)}`}>
              {status}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-md font-sans">{summary}</p>
      </div>

      {/* 1. NEPSE Specific Fundamentals */}
      {nepse && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold text-slate-300 uppercase">
              Nepal Regulatory & Quarterly Metrics ({nepse.quarter} {nepse.fiscalYear})
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary border border-border text-market-bullish">
              NRB / SEBON Disclosures
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">EPS (NPR)</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                NPR {nepse.epsNpr !== undefined ? nepse.epsNpr : 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Book Value (BVPS)</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                NPR {nepse.bookValuePerShare !== undefined ? nepse.bookValuePerShare : 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">P/E Ratio</span>
              <span className="text-sm font-bold text-slate-200 block mt-0.5">
                {nepse.peRatio !== undefined ? `${nepse.peRatio}x` : 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Dividend Yield</span>
              <span className="text-sm font-bold text-market-bullish block mt-0.5">
                {nepse.dividendYield !== undefined ? `${nepse.dividendYield}%` : 'N/A'}
              </span>
            </div>

            {nepse.nonPerformingLoanPercent !== undefined && (
              <div className="p-2.5 rounded bg-surface-secondary border border-border">
                <span className="text-[10px] text-slate-500 uppercase block">NPL Ratio</span>
                <span className={`text-sm font-bold block mt-0.5 ${nepse.nonPerformingLoanPercent > 4.0 ? 'text-market-bearish' : 'text-slate-200'}`}>
                  {nepse.nonPerformingLoanPercent}%
                </span>
              </div>
            )}

            {nepse.capitalAdequacyRatio !== undefined && (
              <div className="p-2.5 rounded bg-surface-secondary border border-border">
                <span className="text-[10px] text-slate-500 uppercase block">Capital Adequacy (CAR)</span>
                <span className="text-sm font-bold text-slate-200 block mt-0.5">
                  {nepse.capitalAdequacyRatio}%
                </span>
              </div>
            )}

            {nepse.quarterlyProfitYoY !== undefined && (
              <div className="p-2.5 rounded bg-surface-secondary border border-border">
                <span className="text-[10px] text-slate-500 uppercase block">YoY Profit Growth</span>
                <span className={`text-sm font-bold block mt-0.5 ${nepse.quarterlyProfitYoY >= 0 ? 'text-market-bullish' : 'text-market-bearish'}`}>
                  {nepse.quarterlyProfitYoY > 0 ? '+' : ''}{nepse.quarterlyProfitYoY}%
                </span>
              </div>
            )}

            {nepse.sectorRank && (
              <div className="p-2.5 rounded bg-surface-secondary border border-border col-span-2 sm:col-span-1">
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
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold text-slate-300 uppercase">
              Financial Ratios & Multiples
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary border border-border text-accent-cyan">
              Valuation: {stock.valuationStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Trailing P/E</span>
              <span className="text-sm font-bold text-white block mt-0.5">{stock.peRatio || 'N/A'}x</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Forward P/E</span>
              <span className="text-sm font-bold text-white block mt-0.5">{stock.forwardPE || 'N/A'}x</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">ROE</span>
              <span className="text-sm font-bold text-market-bullish block mt-0.5">{stock.roe ? `${stock.roe}%` : 'N/A'}</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Operating Margin</span>
              <span className="text-sm font-bold text-slate-200 block mt-0.5">{stock.operatingMargin ? `${stock.operatingMargin}%` : 'N/A'}</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Revenue Growth</span>
              <span className="text-sm font-bold text-slate-200 block mt-0.5">{stock.revenueYoY ? `+${stock.revenueYoY}%` : 'N/A'}</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Debt-to-Equity</span>
              <span className="text-sm font-bold text-slate-200 block mt-0.5">{stock.debtToEquity ?? 'N/A'}</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Dividend Yield</span>
              <span className="text-sm font-bold text-slate-200 block mt-0.5">{stock.dividendYield ? `${stock.dividendYield}%` : '0%'}</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">EV / EBITDA</span>
              <span className="text-sm font-bold text-slate-200 block mt-0.5">{stock.evToEbitda ? `${stock.evToEbitda}x` : 'N/A'}</span>
            </div>
          </div>

          {stock.valuationBasis && (
            <div className="p-2 rounded bg-surface-secondary border border-border text-[11px] text-slate-300">
              <span className="text-slate-500 font-mono font-bold uppercase mr-1.5 text-[10px]">Basis:</span>
              {stock.valuationBasis}
            </div>
          )}
        </div>
      )}

      {/* 3. Crypto Tokenomics & On-Chain */}
      {crypto && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold text-slate-300 uppercase">
              On-Chain Telemetry & Supply Distribution
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary border border-border text-accent-cyan">
              Consensus: {crypto.network.consensusMechanism}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Circulating Supply</span>
              <span className="text-sm font-bold text-white block mt-0.5">{crypto.tokenomics.circulatingSupply.toLocaleString()}</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Max Supply</span>
              <span className="text-sm font-bold text-slate-200 block mt-0.5">{crypto.tokenomics.maxSupply ? crypto.tokenomics.maxSupply.toLocaleString() : 'Infinite'}</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Inflation Rate</span>
              <span className="text-sm font-bold text-market-bullish block mt-0.5">{crypto.tokenomics.annualInflationRate}%</span>
            </div>

            <div className="p-2.5 rounded bg-surface-secondary border border-border">
              <span className="text-[10px] text-slate-500 uppercase block">Total Value Locked</span>
              <span className="text-sm font-bold text-accent-cyan block mt-0.5">{crypto.protocol.tvl ? `$${(crypto.protocol.tvl / 1e9).toFixed(2)}B` : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
