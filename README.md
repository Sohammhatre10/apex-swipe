# FundSwipe 📊

A Tinder-like fund discovery app built with React. Swipe right to buy, left to pass (and see similar funds), or star to watchlist.

## Features

- 🃏 **Swipe cards** — drag or use buttons to pass/buy/watchlist
- 📈 **7-day trend chart** per fund using Chart.js
- 💰 **Buy panel** — instant buy or limit order with quick amount presets
- 🔍 **Similar fund recommendations** when you pass
- ⭐ **Watchlist** tracking
- 🌙 **Dark mode** support

## Getting Started

```bash
npm install
npm start
```

## Project Structure

```
src/
  components/
    FundCard.jsx        # Swipeable fund card with chart
    FundCard.css
    BuyPanel.jsx        # Bottom sheet for order placement
    BuyPanel.css
    TrendChart.jsx      # Chart.js line chart component
    Toast.jsx           # Notification toasts
    Toast.css
  hooks/
    useSwipe.js         # Drag/swipe gesture logic
  data/
    funds.js            # Fund data + constants
  App.jsx               # Main app state & logic
  App.css               # Global styles
```

## Adding Real Fund Data

Replace the static data in `src/data/funds.js` with API calls. 
Suggested free APIs:
- **Mutual Funds**: [mfapi.in](https://www.mfapi.in) — free Indian MF data
- **Stocks/ETFs**: [Alpha Vantage](https://www.alphavantage.co) — free tier
- **Crypto**: [CoinGecko](https://www.coingecko.com/en/api) — free tier

## Customization

- Edit `src/data/funds.js` to add/modify funds
- Adjust `SWIPE_THRESHOLD` in `useSwipe.js` for sensitivity
- Modify colors in `App.css` CSS variables
