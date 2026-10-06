import { Market, Currency } from './asset';

export type AIProviderType = 'DETERMINISTIC' | 'OPENROUTER' | 'OLLAMA' | 'CUSTOM';

export interface AISettings {
  provider: AIProviderType;
  openRouterApiKey?: string;
  openRouterModel?: string; // e.g. 'anthropic/claude-3.5-sonnet', 'deepseek/deepseek-chat'
  ollamaBaseUrl?: string; // e.g. 'http://localhost:11434'
  ollamaModel?: string; // e.g. 'llama3:8b'
  temperature: number;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  defaultMarket: Market;
  defaultCurrency: Currency;
  defaultTimeframe: string;
  ai: AISettings;
  cacheTtlMinutes: number;
  offlineModeForce: boolean;
  enableNotifications: boolean;
  disclaimerAccepted: boolean;
}
