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
    return () => {
      mounted = false;
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

  const applyTheme = (theme: 'dark' | 'light') => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  return { settings, updateSettings, loading };
}
