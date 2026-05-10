# ApexSwipe

**ApexSwipe** is a visually stunning, futuristic, AI-powered stock discovery platform that leverages a Tinder-style swipe interface to gamify retail investing. It curates a dynamic feed of thousands of financial assets and intelligently tailors recommendations based on user interaction (swipes) and behavioral data. 

## 🚀 Core Features

- **Tinder-Like Discovery Engine:** Users can seamlessly swipe Right ("BUY") or Left ("PASS") on stock cards. The deck features 60fps spring-physics, depth-scaling, and smooth snap-back animations.
- **AI Recommendation Engine:** Behind the scenes, the backend analyzes the user's swipe history, cross-references it with live market data (momentum, volatility, volume), and feeds a highly customized stack of incoming assets.
- **Live Interactive Telemetry:** Stock cards embed live historical price graphs generated using Recharts, giving users instant micro-analytical views without leaving the swipe deck.
- **Futuristic Dark-Mode UI:** Built with premium aesthetics in mind—layered matte blacks (`#0A0A0A`), aggressive glassmorphism blurs, neon gradient glows, and 3D animated perspective grids, avoiding standard web UI cliches.
- **Rich User Profiles:** Tracks the user's risk profile (Conservative, Balanced, Aggressive), total portfolio values, liked/watchlisted assets, and dynamically generated AI trading insights.

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router) + React 18
- **Styling:** Pure Modular CSS (`.module.css`) for maximal flexibility and zero reliance on heavy utility frameworks. Uses native CSS variables for design tokening.
- **Animations:** Framer Motion (for core card swiping physics, deck rendering, scrolling interactions, and background particle logic).
- **Data Visualization:** Recharts for ultra-fast, smooth SVG line charts mapped to historical price closes.
- **Icons:** Lucide React.

### Backend
- **Framework:** FastAPI (Python) - High-performance asynchronous API framework.
- **Database:** MongoDB - Highly scalable document storage.
  - Houses the user profiles, massive universe of dynamically scraped/ingested stocks (1,500+), and tracks swiping analytics.
- **Auth:** JWT (JSON Web Tokens) for secure, stateless API authentication.
- **Configuration:** `pydantic-settings` strictly maps `.env` variables ensuring a secure, validated configuration layer. 

## 🏗️ Architecture

- **Auth Pipeline:** Frontend modal securely parses `POST /auth/login`, stores the JWT in `localStorage`, and injects `Authorization: Bearer <token>` into all subsequent data requests.
- **Feed Pagination Algorithm:** The swipe deck optimistically manages state. As the deck runs low (e.g., `< 5 cards left`), it silently signals the `/stocks/feed` endpoint to recursively inject the next batch into the stack, guaranteeing a frictionless infinite swipe loop.
- **Sanitization Middleware:** The backend rigorously parses MongoDB documents for float anomalies (`NaN`, `Infinity`—common in incomplete market data) and safely normalizes them to `None` for pristine JSON compliance, preventing browser unhandled runtime crashes.

## 📊 Data Fetching

To populate the stock database, you can run the ingestion scripts located in the backend. These scripts will fetch tickers, download historical price data via `yfinance`, and calculate metrics like momentum and volatility.

From the `backend` directory, activate your virtual environment and run:

**For US Markets (NASDAQ/NYSE):**
```bash
python -m scripts.ingest_yfinance_universe
```

**For UK Markets (London Stock Exchange):**
```bash
python -m scripts.ingest_uk_universe
```

**For Indian Markets (National Stock Exchange):**
```bash
python scripts/ingest_stocks.py --market NSE
```
