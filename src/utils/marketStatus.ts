export interface MarketTimeStatus {
  market: 'NEPSE' | 'NSE' | 'NASDAQ' | 'CRYPTO';
  name: string;
  flag: string;
  isOpen: boolean;
  statusText: 'Open' | 'Closed' | 'Pre-Market' | 'Live';
  localTimeStr: string;
  timezone: string;
  hoursDetail: string;
}

/**
 * Accurately calculates real market operating status based on official exchange timezones.
 */
export function getMarketTimeStatus(market: 'NEPSE' | 'NSE' | 'NASDAQ' | 'CRYPTO'): MarketTimeStatus {
  const now = new Date();

  if (market === 'CRYPTO') {
    return {
      market: 'CRYPTO',
      name: 'Crypto 24/7',
      flag: '₿',
      isOpen: true,
      statusText: 'Live',
      localTimeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timezone: 'UTC',
      hoursDetail: 'Continuous 24/7/365'
    };
  }

  let timeZone = 'UTC';
  if (market === 'NEPSE') timeZone = 'Asia/Kathmandu';
  else if (market === 'NSE') timeZone = 'Asia/Kolkata';
  else if (market === 'NASDAQ') timeZone = 'America/New_York';

  // Format date and time in the specific market timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  let weekday = '';
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === 'weekday') weekday = part.value;
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
  }

  const timeInMinutes = hour * 60 + minute;
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  if (market === 'NEPSE') {
    // Sun-Thu: 11:00 - 15:00
    const isTradingDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'].includes(weekday);
    const isOpen = isTradingDay && timeInMinutes >= 11 * 60 && timeInMinutes < 15 * 60;
    const isPreOpen = isTradingDay && timeInMinutes >= 10 * 60 + 30 && timeInMinutes < 11 * 60;

    let statusText: 'Open' | 'Closed' | 'Pre-Market' = 'Closed';
    if (isOpen) statusText = 'Open';
    else if (isPreOpen) statusText = 'Pre-Market';

    return {
      market: 'NEPSE',
      name: 'NEPSE',
      flag: '🇳🇵',
      isOpen,
      statusText,
      localTimeStr: `${timeStr} NPT`,
      timezone: 'Asia/Kathmandu (UTC+5:45)',
      hoursDetail: 'Sun–Thu 11:00–15:00 NPT'
    };
  }

  if (market === 'NSE') {
    // Mon-Fri: 09:15 - 15:30
    const isTradingDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday);
    const isOpen = isTradingDay && timeInMinutes >= 9 * 60 + 15 && timeInMinutes < 15 * 60 + 30;
    const isPreMarket = isTradingDay && timeInMinutes >= 9 * 60 && timeInMinutes < 9 * 60 + 15;

    let statusText: 'Open' | 'Closed' | 'Pre-Market' = 'Closed';
    if (isOpen) statusText = 'Open';
    else if (isPreMarket) statusText = 'Pre-Market';

    return {
      market: 'NSE',
      name: 'NSE / BSE',
      flag: '🇮🇳',
      isOpen,
      statusText,
      localTimeStr: `${timeStr} IST`,
      timezone: 'Asia/Kolkata (UTC+5:30)',
      hoursDetail: 'Mon–Fri 09:15–15:30 IST'
    };
  }

  // NASDAQ / NYSE
  // Mon-Fri: 09:30 - 16:00 EST/EDT
  const isTradingDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday);
  const isOpen = isTradingDay && timeInMinutes >= 9 * 60 + 30 && timeInMinutes < 16 * 60;
  const isPreMarket = isTradingDay && timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30;

  let statusText: 'Open' | 'Closed' | 'Pre-Market' = 'Closed';
  if (isOpen) statusText = 'Open';
  else if (isPreMarket) statusText = 'Pre-Market';

  return {
    market: 'NASDAQ',
    name: 'NASDAQ / NYSE',
    flag: '🇺🇸',
    isOpen,
    statusText,
    localTimeStr: `${timeStr} ET`,
    timezone: 'America/New_York (ET)',
    hoursDetail: 'Mon–Fri 09:30–16:00 ET'
  };
}

export function getAllMarketStatuses(): MarketTimeStatus[] {
  return [
    getMarketTimeStatus('NEPSE'),
    getMarketTimeStatus('NSE'),
    getMarketTimeStatus('NASDAQ'),
    getMarketTimeStatus('CRYPTO')
  ];
}
