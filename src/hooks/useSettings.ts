import { useState, useEffect } from 'react';
import { UserSettings } from '../types/settings';
import { getUserSettings, saveUserSettings, DEFAULT_SETTINGS } from '../db/settingsStore';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getUserSettings().then((s) => {
      if (mounted) {
        setSettings(s);
        setLoading(false);
        applyTheme(s.theme);
      }
    });

    // Listen for OS theme changes if user has 'system' theme selected
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      getUserSettings().then((s) => {
        if (s.theme === 'system') {
          applyTheme('system');
        }
      });
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mounted = false;
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const updateSettings = async (partial: Partial<UserSettings>) => {
    const updated = await saveUserSettings(partial);
    setSettings(updated);
    if (partial.theme) {
      applyTheme(partial.theme);
    }
    return updated;
  };

  const applyTheme = (theme: 'dark' | 'light' | 'system') => {
    const root = document.documentElement;
    let isDark = true;

    if (theme === 'system') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = theme === 'dark';
    }

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  return { settings, updateSettings, loading };
}
