import { getDB } from './index';
import { BacktestResult } from '../types/backtest';

export async function saveBacktest(result: BacktestResult): Promise<void> {
  const db = await getDB();
  await db.put('backtests', result);
}

export async function getAllBacktests(): Promise<BacktestResult[]> {
  const db = await getDB();
  const all = await db.getAll('backtests');
  return all.sort((a, b) => b.executedAt - a.executedAt);
}

export async function getBacktestById(id: string): Promise<BacktestResult | undefined> {
  const db = await getDB();
  return db.get('backtests', id);
}

export async function deleteBacktest(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('backtests', id);
}
