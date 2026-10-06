import { NavItemKey } from '../components/common/Sidebar';
import { AnalysisTabType } from '../pages/AnalysisPage';
import { getAssetById, ALL_ASSETS } from '../data/universe';
import { Asset } from '../types/asset';

export interface AppRouteState {
  nav: NavItemKey;
  assetId: string;
  tab: AnalysisTabType;
}

const STORAGE_KEY = 'tradepredict_last_route_v1';

/**
 * Parses URL hash, pathname, search params, and sessionStorage to determine active route.
 */
export function getInitialRoute(): AppRouteState {
  if (typeof window === 'undefined') {
    return {
      nav: 'dashboard',
      assetId: ALL_ASSETS[0].id,
      tab: 'OVERVIEW'
    };
  }

  // 1. Try Hash first (e.g. #/markets, #/analysis?asset=CRYPTO:BTCUSDT&tab=TECHNICAL)
  const hash = window.location.hash ? window.location.hash.replace(/^#\/?/, '') : '';
  if (hash) {
    const parsed = parseRouteString(hash);
    if (parsed) {
      saveRouteToSession(parsed);
      return parsed;
    }
  }

  // 2. Try Pathname if available (e.g. /markets, /settings)
  const pathname = window.location.pathname ? window.location.pathname.replace(/^\//, '') : '';
  if (pathname && pathname !== 'index.html') {
    const fullPath = pathname + (window.location.search || '');
    const parsed = parseRouteString(fullPath);
    if (parsed) {
      saveRouteToSession(parsed);
      return parsed;
    }
  }

  // 3. Try SessionStorage (survives page refresh on same tab)
  try {
    if (typeof sessionStorage !== 'undefined') {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        if (parsedSaved && parsedSaved.nav) {
          const asset = getAssetById(parsedSaved.assetId) || ALL_ASSETS[0];
          return {
            nav: parsedSaved.nav,
            assetId: asset.id,
            tab: parsedSaved.tab || 'OVERVIEW'
          };
        }
      }
    }
  } catch {
    // Ignore storage errors
  }

  // 4. Default to Dashboard with default asset
  return {
    nav: 'dashboard',
    assetId: ALL_ASSETS[0].id,
    tab: 'OVERVIEW'
  };
}

/**
 * Parses a path string (from hash or pathname) into AppRouteState
 */
function parseRouteString(pathStr: string): AppRouteState | null {
  const [routePart, queryPart] = pathStr.split('?');
  const cleanRoute = routePart.toLowerCase().trim();

  const queryParams = new URLSearchParams(queryPart || '');
  const assetIdParam = queryParams.get('asset') || queryParams.get('assetId');
  const tabParam = queryParams.get('tab') as AnalysisTabType | null;

  const validAsset = (assetIdParam ? getAssetById(assetIdParam) : null) || ALL_ASSETS[0];

  if (cleanRoute === 'dashboard' || cleanRoute === '') {
    return { nav: 'dashboard', assetId: validAsset.id, tab: 'OVERVIEW' };
  }

  if (cleanRoute === 'markets') {
    return { nav: 'markets', assetId: validAsset.id, tab: 'OVERVIEW' };
  }

  if (cleanRoute === 'watchlist') {
    return { nav: 'watchlist', assetId: validAsset.id, tab: 'OVERVIEW' };
  }

  if (cleanRoute === 'prediction' || cleanRoute === 'predictions') {
    return { nav: 'prediction', assetId: validAsset.id, tab: 'OVERVIEW' };
  }

  if (cleanRoute === 'backtesting') {
    return { nav: 'backtesting', assetId: validAsset.id, tab: 'OVERVIEW' };
  }

  if (cleanRoute === 'performance') {
    return { nav: 'performance', assetId: validAsset.id, tab: 'OVERVIEW' };
  }

  if (cleanRoute === 'news') {
    return { nav: 'news', assetId: validAsset.id, tab: 'OVERVIEW' };
  }

  if (cleanRoute === 'settings') {
    return { nav: 'settings', assetId: validAsset.id, tab: 'OVERVIEW' };
  }

  if (cleanRoute === 'analysis') {
    return {
      nav: 'technical',
      assetId: validAsset.id,
      tab: tabParam || 'OVERVIEW'
    };
  }

  if (cleanRoute === 'technical') {
    return { nav: 'technical', assetId: validAsset.id, tab: 'TECHNICAL' };
  }

  if (cleanRoute === 'fundamentals') {
    return { nav: 'fundamentals', assetId: validAsset.id, tab: 'FUNDAMENTAL' };
  }

  if (cleanRoute === 'sentiment') {
    return { nav: 'sentiment', assetId: validAsset.id, tab: 'SENTIMENT' };
  }

  if (cleanRoute === 'risk') {
    return { nav: 'risk', assetId: validAsset.id, tab: 'QUANT' };
  }

  return null;
}

/**
 * Serializes route state into a canonical URL hash
 */
export function buildRouteHash(state: AppRouteState): string {
  if (state.nav === 'dashboard') return '#/dashboard';
  if (state.nav === 'markets') return '#/markets';
  if (state.nav === 'watchlist') return '#/watchlist';
  if (state.nav === 'prediction') return '#/predictions';
  if (state.nav === 'backtesting') return '#/backtesting';
  if (state.nav === 'performance') return '#/performance';
  if (state.nav === 'news') return '#/news';
  if (state.nav === 'settings') return '#/settings';

  // Analysis-related routes
  const assetParam = `asset=${encodeURIComponent(state.assetId)}`;
  const tabParam = `tab=${state.tab}`;
  return `#/analysis?${assetParam}&${tabParam}`;
}

/**
 * Saves current route to browser URL hash & sessionStorage so refresh never resets to dashboard
 */
export function persistRoute(state: AppRouteState, replace = false): void {
  saveRouteToSession(state);
  const hash = buildRouteHash(state);

  if (window.location.hash !== hash) {
    if (replace) {
      window.history.replaceState(null, '', hash);
    } else {
      window.history.pushState(null, '', hash);
    }
  }
}

function saveRouteToSession(state: AppRouteState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota/permission exceptions
  }
}
