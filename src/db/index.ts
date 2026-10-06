import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { TrackedPrediction } from '../types/tracking';
import { AIAnalystReport, RAGDocument } from '../types/ai';
import { BacktestResult } from '../types/backtest';
import { UserSettings } from '../types/settings';
import { Candle, Quote } from '../types/marketData';

export interface CachedMarketData {
  key: string; // `${assetId}:${timeframe}` or `${assetId}:quote`
  assetId: string;
  timeframe?: string;
  dataType: 'CANDLES' | 'QUOTE';
  candles?: Candle[];
  quote?: Quote;
  timestamp: number; // fetch time
  expiresAt: number;
}

export interface WatchlistItem {
  assetId: string;
  addedAt: number;
  notes?: string;
  order: number;
}

export interface TradePredictDB extends DBSchema {
  watchlist: {
    key: string;
    value: WatchlistItem;
    indexes: { 'by-order': number };
  };
  predictions: {
    key: string;
    value: TrackedPrediction;
    indexes: {
      'by-asset': string;
      'by-created': number;
      'by-evaluated': number;
      'by-market': string;
    };
  };
  reports: {
    key: string;
    value: AIAnalystReport;
    indexes: {
      'by-asset': string;
      'by-date': number;
    };
  };
  backtests: {
    key: string;
    value: BacktestResult;
    indexes: {
      'by-asset': string;
      'by-date': number;
    };
  };
  documents: {
    key: string;
    value: RAGDocument;
    indexes: {
      'by-asset': string;
      'by-date': number;
    };
  };
  marketCache: {
    key: string;
    value: CachedMarketData;
    indexes: {
      'by-asset': string;
      'by-expiry': number;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'tradepredict_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<TradePredictDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<TradePredictDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TradePredictDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Watchlist store
        if (!db.objectStoreNames.contains('watchlist')) {
          const store = db.createObjectStore('watchlist', { keyPath: 'assetId' });
          store.createIndex('by-order', 'order');
        }

        // Predictions tracking store
        if (!db.objectStoreNames.contains('predictions')) {
          const store = db.createObjectStore('predictions', { keyPath: 'id' });
          store.createIndex('by-asset', 'assetId');
          store.createIndex('by-created', 'createdAt');
          store.createIndex('by-evaluated', 'evaluated');
          store.createIndex('by-market', 'market');
        }

        // Saved analysis reports store
        if (!db.objectStoreNames.contains('reports')) {
          const store = db.createObjectStore('reports', { keyPath: 'id' });
          store.createIndex('by-asset', 'assetId');
          store.createIndex('by-date', 'generatedAt');
        }

        // Backtests store
        if (!db.objectStoreNames.contains('backtests')) {
          const store = db.createObjectStore('backtests', { keyPath: 'id' });
          store.createIndex('by-asset', 'params.assetId');
          store.createIndex('by-date', 'executedAt');
        }

        // Local RAG Documents store
        if (!db.objectStoreNames.contains('documents')) {
          const store = db.createObjectStore('documents', { keyPath: 'id' });
          store.createIndex('by-asset', 'assetSymbol');
          store.createIndex('by-date', 'uploadedAt');
        }

        // Market data cache store
        if (!db.objectStoreNames.contains('marketCache')) {
          const store = db.createObjectStore('marketCache', { keyPath: 'key' });
          store.createIndex('by-asset', 'assetId');
          store.createIndex('by-expiry', 'expiresAt');
        }

        // User settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      }
    });
  }
  return dbPromise;
}
