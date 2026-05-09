import asyncio

from database import connect_db, get_db
from scraper.fetcher_uk import fetch_tickers, get_uk_ticker_universe
from scraper.pipeline import upsert_stocks


async def main() -> None:
    await connect_db()
    db = get_db()
    await db.stocks.create_index("ticker", unique=True)

    tickers = get_uk_ticker_universe(limit=1500)
    print(f"Loaded {len(tickers)} UK tickers from exchange listings.", flush=True)

    stocks = await fetch_tickers(tickers, batch_size=25)
    print(f"Fetched metadata for {len(stocks)} UK tickers from yfinance.", flush=True)

    result = await upsert_stocks(stocks)
    print(f"Upserted: {result['upserted']} | Failed: {len(result['failed'])}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
