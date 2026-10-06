import { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { Candle } from '../types/marketData';
import { executeAnalysisPipeline, PipelineExecutionResult } from '../engines/pipeline';
import { saveReport } from '../db/reportStore';

export function useAnalysisPipeline(asset: Asset, candles: Candle[], timeframe = '1D') {
  const [result, setResult] = useState<PipelineExecutionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runPipeline = () => {
    if (!candles || candles.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const execResult = executeAnalysisPipeline(asset, candles, timeframe);
      setResult(execResult);
      // Persist report in background to local IndexedDB
      saveReport(execResult.report).catch((e) => console.warn('Could not auto-save report:', e));
    } catch (err: any) {
      setError(err.message || 'Analytical pipeline execution failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPipeline();
  }, [asset.id, candles.length, timeframe]);

  return {
    result,
    bundle: result?.bundle,
    report: result?.report,
    executionTimeMs: result?.executionTimeMs,
    loading,
    error,
    rerunPipeline: runPipeline
  };
}
