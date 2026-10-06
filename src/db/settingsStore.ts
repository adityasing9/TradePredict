import { getDB } from './index';
import { UserSettings } from '../types/settings';
import { getAllPredictions, savePrediction } from './predictionStore';
import { getWatchlist, addToWatchlist } from './watchlistStore';
import { getAllReports, saveReport } from './reportStore';
import { getAllBacktests, saveBacktest } from './backtestStore';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  defaultMarket: 'NEPSE',
  defaultCurrency: 'NPR',
  defaultTimeframe: '1D',
  ai: {
    provider: 'DETERMINISTIC',
    temperature: 0.3,
    openRouterModel: 'anthropic/claude-3.5-sonnet',
    ollamaBaseUrl: 'http://localhost:11434',
    ollamaModel: 'llama3:8b'
  },
  cacheTtlMinutes: 15,
  offlineModeForce: false,
  enableNotifications: false,
  disclaimerAccepted: true
};

export async function getUserSettings(): Promise<UserSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'user_settings');
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

export async function saveUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const db = await getDB();
  const current = await getUserSettings();
  const updated: UserSettings = { ...current, ...settings };
  await db.put('settings', updated, 'user_settings');
  return updated;
}

/**
 * Complete Data Export (Section 55)
 */
export async function exportAllLocalData(): Promise<string> {
  const [predictions, watchlist, reports, backtests, settings] = await Promise.all([
    getAllPredictions(),
    getWatchlist(),
    getAllReports(),
    getAllBacktests(),
    getUserSettings()
  ]);

  const payload = {
    app: 'TradePredict AI',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings,
    predictions,
    watchlist,
    reports,
    backtests
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Import and merge/restore local backup
 */
export async function importLocalDataBackup(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString);
    if (!data.predictions && !data.watchlist) {
      return { success: false, message: 'Invalid backup format: missing core records.' };
    }

    if (Array.isArray(data.predictions)) {
      for (const p of data.predictions) {
        if (p.id) await savePrediction(p);
      }
    }

    if (Array.isArray(data.watchlist)) {
      for (const w of data.watchlist) {
        if (w.assetId) await addToWatchlist(w.assetId, w.notes);
      }
    }

    if (Array.isArray(data.reports)) {
      for (const r of data.reports) {
        if (r.id) await saveReport(r);
      }
    }

    if (Array.isArray(data.backtests)) {
      for (const b of data.backtests) {
        if (b.id) await saveBacktest(b);
      }
    }

    if (data.settings) {
      await saveUserSettings(data.settings);
    }

    return { success: true, message: 'Backup successfully restored.' };
  } catch (err: any) {
    return { success: false, message: `Failed to parse backup: ${err.message}` };
  }
}
