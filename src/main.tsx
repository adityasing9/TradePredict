import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { clearAllCache } from './db/cacheStore';

// ── Baseline Data Version Guard ────────────────────────────────────────────
// Bump this string whenever ASSET_PRICE_BASELINES are updated so all
// existing users get fresh quotes on next page load instead of seeing stale
// cached prices from a previous session.
const BASELINE_VERSION = '2026-10-08-v3';
const BASELINE_KEY = 'tradepredict_baseline_version';
(async () => {
  try {
    const storedVersion = localStorage.getItem(BASELINE_KEY);
    if (storedVersion !== BASELINE_VERSION) {
      await clearAllCache();
      localStorage.setItem(BASELINE_KEY, BASELINE_VERSION);
      console.info('[TradePredict] Baseline updated — market cache flushed.');
    }
  } catch {
    // Silently ignore if IDB isn't available yet
  }
})();

// PWA Service Worker Registration
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
