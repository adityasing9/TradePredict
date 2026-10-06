# TradePredict AI

> **Analyze. Predict. Understand.**

A production-grade, local-first, Vercel-ready Progressive Web App (PWA) designed for serious financial market analysis, feature engineering, and probabilistic prediction across:

- 🇳🇵 **Nepal Stocks / NEPSE** (NPR)
- 🇮🇳 **Indian Stocks / NSE & BSE** (INR)
- 🇺🇸 **US Equities / NASDAQ & NYSE** (USD)
- ₿ **Cryptocurrencies / Global Spot Markets** (USDT)

---

## 1. Architectural Philosophy

TradePredict AI is **NOT a simple stock dashboard** and **NOT merely an AI chatbot** issuing simplistic BUY/SELL calls. It operates on an institutional-quality 11-stage pipeline:

```text
                  RAW MARKET DATA (Multi-Provider)
                                 ↓
                     DATA INTEGRITY & VALIDATION
                                 ↓
               MULTI-FACTOR FEATURE ENGINEERING (30+ Signals)
                                 ↓
       ┌─────────────────────────┼─────────────────────────┐
       ↓                         ↓                         ↓
TECHNICAL ENGINE        FUNDAMENTAL ENGINE         SENTIMENT & MACRO
 (Oscillators, S/R,       (Financial Ratios,         (Classified News,
  Chart Patterns)          NEPSE Metrics,             NRB/RBI/Fed Rates)
       ↓                   Crypto Tokenomics)              ↓
       └─────────────────────────┼─────────────────────────┘
                                 ↓
                    QUANTITATIVE RISK ENGINE
               (Sharpe, Sortino, Beta, Max Drawdown)
                                 ↓
               PROBABILISTIC ML PREDICTION ENGINE
         (Gradient-Boosted Classifier + Volatility Cones)
                                 ↓
                     MULTI-SCENARIO SYNTHESIS
             (Bull, Base, Bear with Invalidation Levels)
                                 ↓
                 INSTITUTIONAL AI REPORT ENGINE
                                 ↓
                LOCAL PREDICTION TRACKING & AUDIT
                                 ↓
              EMPIRICAL MODEL PERFORMANCE EVALUATION
```

---

## 2. Core Features & Capabilities

### 🌐 Multi-Market Support
- **Nepal (NEPSE):** Commercial banks (NABIL, NICA, GBIME), Hydropower (CHCL), Manufacturing (SHIVM, HDL), Telecom (NTC), and NEPSE Benchmark Index. Support for EPS (NPR), Book Value (BVPS), Non-Performing Loans (NPL%), and Capital Adequacy (CAR%).
- **India (NSE):** NIFTY 50, BANK NIFTY, Reliance Industries, TCS, Infosys, HDFC Bank, ICICI Bank, Tata Motors.
- **United States:** S&P 500 (SPY), NASDAQ 100 (QQQ), Apple (AAPL), Microsoft (MSFT), NVIDIA (NVDA), Alphabet (GOOGL), Amazon (AMZN), Tesla (TSLA).
- **Cryptocurrencies:** Bitcoin (BTC/USDT), Ethereum (ETH/USDT), Solana (SOL/USDT), BNB, XRP, Cardano (ADA). Dedicated tokenomics (circulating float, inflation, emission schedules) and on-chain metrics with strict separation between factual observation and analytical interpretation.

### 🧠 Probabilistic Machine Learning (Not Just an LLM)
- **Gradient-Boosted Decision Ensemble:** Calibrated directional probabilities (`UP: X%`, `NEUTRAL: Y%`, `DOWN: Z%`) summing to 100%.
- **Statistical Volatility Projection Cones:** Dynamic geometric Brownian drift projecting 1-sigma (68% CI) and 2-sigma (95% CI) confidence bounds across forecast steps.
- **Model Transparency:** Full inspection of model architecture, version (`v1.4.0-ensemble`), walk-forward validation window, and dominant decision feature weights.

### 🎯 Prediction Tracking & Empirical Evaluation
- Track any forecast into your browser's private **IndexedDB** database with reference starting price, timeframe, and target evaluation timestamp.
- Automatic outcome verification (`CORRECT` / `INCORRECT`) when target maturity is reached.
- **Real Model Performance Dashboard:** Directional accuracy calculated dynamically from recorded predictions by market, by timeframe, with calibration buckets and average return error. **Zero hardcoded or fake accuracy.**

### 📈 Strategy Backtesting Studio
- Backtest ML Ensemble, EMA Crossover, RSI Mean Reversion, or Breakout strategies against historical bars.
- Evaluates Total Return %, CAGR, Sharpe Ratio, Sortino Ratio, Maximum Drawdown %, Win Rate %, and Profit Factor with simulated transaction costs and slippage.
- Interactive cumulative equity curve vs benchmark index and complete trade execution logs.

### 📑 Local Document Research (RAG)
- Ingest corporate annual reports, quarterly filings, or token whitepapers directly into your browser.
- 100% client-side text chunking, inverted keyword indexing, and TF-IDF search. Zero document uploads to cloud databases.

### 📱 Progressive Web App (PWA)
- Installable on desktop and mobile devices.
- Service Worker precaching with full offline shell and caching of market data.
- Live network indicators communicating Online vs Cached data timestamps.

---

## 3. Deployment & Vercel Configuration

TradePredict AI is engineered for native deployment on **Vercel** with local-first storage (no online database like Firebase or Supabase required).

### Vercel Serverless Architecture
- `api/market/quote.ts`: Serverless proxy for real-time asset quotes.
- `api/market/history.ts`: Serverless proxy for historical candlestick data.
- `api/news/index.ts`: Serverless proxy for categorized financial headlines.
- `vercel.json`: Handles SPA client-side routing, API execution, and security headers.

### Deploying to Vercel via Git
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial release of TradePredict AI PWA"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.

---

## 4. Local Development

### Prerequisites
- Node.js v18+ (tested on Node v22)
- npm v9+

### Commands
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run analytical unit test suite
npm test

# Build production PWA bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Security & Privacy Guarantees

1. **Local-First Storage:** All watchlists, tracked predictions, backtest results, and uploaded research documents are stored inside your browser's IndexedDB (`tradepredict_db`).
2. **Data Export/Import:** Full JSON backup generation and one-click restoration under **Settings > Local Data Ownership**.
3. **API Key Safety:** When utilizing external AI providers like OpenRouter or local Ollama, keys are stored locally on your device and never committed or exposed in frontend bundles.

---

## 6. Financial Safety & Disclaimers

> **IMPORTANT DISCLAIMER**
> Predictions provided by TradePredict AI are probabilistic statistical estimates derived from historical price structure, technical momentum, and quantitative indicator distributions. They are NOT guarantees of future market outcomes and do NOT constitute personalized investment, financial, tax, or trading advice. Financial markets involve substantial risk of loss. Always practice prudent risk management.
