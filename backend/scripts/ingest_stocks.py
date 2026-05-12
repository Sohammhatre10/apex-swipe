import argparse
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import connect_db, get_db
from scraper.pipeline import upsert_stocks

# Import fetchers
from scraper.fetcher_nse import fetch_nse_ticker_universe, get_nse_ticker_universe
from scraper.fetcher_us import fetch_tickers, get_us_ticker_universe

FETCHERS = {
    "NSE": {
        "get_universe": get_nse_ticker_universe,
        "fetch": fetch_nse_ticker_universe,
        "desc": "NSE (India) stocks"
    },
    "US": {
        "get_universe": get_us_ticker_universe,
        "fetch": fetch_tickers,
        "desc": "US stocks"
    },
}

async def main(market: str, batch_size: int = 25, limit: int = 1500):
    await connect_db()
    db = get_db()

    await db.stocks.create_index(
        [("ticker", 1), ("exchange", 1)], unique=True, name="ticker_exchange_unique"
    )
    print("Indexes ensured.", flush=True)

    fetcher = FETCHERS[market]
    print(f"Loading {fetcher['desc']} universe (limit {limit})...", flush=True)
    universe = fetcher["get_universe"](limit=limit)
    print(f"Loaded {len(universe)} tickers.", flush=True)

    print(f"Fetching price history from yfinance for {market}...", flush=True)
    if market == "NSE":
        stocks = await fetcher["fetch"](batch_size=batch_size)
    else:
        stocks = await fetcher["fetch"]([u["ticker"] if isinstance(u, dict) else u for u in universe], batch_size=batch_size)
    print(f"Fetched price history for {len(stocks)} tickers.", flush=True)

    result = await upsert_stocks(stocks)
    print(f"Upserted: {result['upserted']} | Failed: {len(result['failed'])}", flush=True)
    if result["failed"]:
        print(f"Failed tickers: {result['failed'][:20]}", flush=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--market", choices=FETCHERS.keys(), required=True, help="Market to ingest (NSE or US)")
    parser.add_argument("--batch-size", type=int, default=25, help="Batch size for yfinance requests")
    parser.add_argument("--limit", type=int, default=1500, help="Number of tickers to ingest")
    args = parser.parse_args()
    asyncio.run(main(args.market, args.batch_size, args.limit))
