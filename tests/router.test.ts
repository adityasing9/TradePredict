import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getInitialRoute, buildRouteHash } from '../src/utils/router';

describe('Router & Route Persistence on Refresh', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};

    const mockSessionStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      clear: () => {
        mockStorage = {};
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      length: 0,
      key: () => null
    };

    (globalThis as any).sessionStorage = mockSessionStorage;

    (globalThis as any).window = {
      location: {
        hash: '',
        pathname: '/',
        search: ''
      },
      sessionStorage: mockSessionStorage,
      history: {
        pushState: () => {},
        replaceState: () => {}
      }
    };
  });

  afterEach(() => {
    delete (globalThis as any).window;
    delete (globalThis as any).sessionStorage;
  });

  it('defaults to dashboard when hash and storage are empty', () => {
    const route = getInitialRoute();
    expect(route.nav).toBe('dashboard');
    expect(route.assetId).toBeTruthy();
  });

  it('restores markets page from hash #/markets on refresh', () => {
    (globalThis as any).window.location.hash = '#/markets';
    const route = getInitialRoute();
    expect(route.nav).toBe('markets');
  });

  it('restores predictions page from hash #/predictions on refresh', () => {
    (globalThis as any).window.location.hash = '#/predictions';
    const route = getInitialRoute();
    expect(route.nav).toBe('prediction');
  });

  it('restores backtesting page from hash #/backtesting on refresh', () => {
    (globalThis as any).window.location.hash = '#/backtesting';
    const route = getInitialRoute();
    expect(route.nav).toBe('backtesting');
  });

  it('restores settings page from hash #/settings on refresh', () => {
    (globalThis as any).window.location.hash = '#/settings';
    const route = getInitialRoute();
    expect(route.nav).toBe('settings');
  });

  it('restores specific asset and tab from hash #/analysis?asset=CRYPTO:BTCUSDT&tab=TECHNICAL on refresh', () => {
    (globalThis as any).window.location.hash = '#/analysis?asset=CRYPTO:BTCUSDT&tab=TECHNICAL';
    const route = getInitialRoute();
    expect(route.nav).toBe('technical');
    expect(route.assetId).toBe('CRYPTO:BTCUSDT');
    expect(route.tab).toBe('TECHNICAL');
  });

  it('restores from sessionStorage if hash is temporarily blanked during refresh', () => {
    (globalThis as any).sessionStorage.setItem(
      'tradepredict_last_route_v1',
      JSON.stringify({ nav: 'performance', assetId: 'NEPSE:NABIL', tab: 'OVERVIEW' })
    );
    (globalThis as any).window.location.hash = '';
    const route = getInitialRoute();
    expect(route.nav).toBe('performance');
  });

  it('builds canonical hashes accurately', () => {
    expect(buildRouteHash({ nav: 'dashboard', assetId: 'NEPSE:NABIL', tab: 'OVERVIEW' })).toBe('#/dashboard');
    expect(buildRouteHash({ nav: 'markets', assetId: 'NEPSE:NABIL', tab: 'OVERVIEW' })).toBe('#/markets');
    expect(buildRouteHash({ nav: 'settings', assetId: 'NEPSE:NABIL', tab: 'OVERVIEW' })).toBe('#/settings');
    expect(buildRouteHash({ nav: 'technical', assetId: 'NSE:RELIANCE', tab: 'FUNDAMENTAL' })).toContain('asset=NSE%3ARELIANCE');
    expect(buildRouteHash({ nav: 'technical', assetId: 'NSE:RELIANCE', tab: 'FUNDAMENTAL' })).toContain('tab=FUNDAMENTAL');
  });
});
