from apscheduler.schedulers.asyncio import AsyncIOScheduler

from scraper.fetcher import fetch_ticker_universe
from scraper.pipeline import upsert_stocks

scheduler = AsyncIOScheduler()


@scheduler.scheduled_job("cron", hour=17, minute=0, timezone="America/New_York")
async def daily_stock_update() -> None:
    stocks = await fetch_ticker_universe()
    await upsert_stocks(stocks)
