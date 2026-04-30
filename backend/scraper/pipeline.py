from datetime import UTC, datetime

from database import get_db


async def upsert_stocks(stocks: list[dict]) -> dict:
    db = get_db()
    success = 0
    failures: list[str] = []
    for stock in stocks:
        ticker = stock.get("ticker", "").upper()
        if not ticker:
            failures.append("missing-ticker")
            continue
        stock["ticker"] = ticker
        stock["last_updated"] = datetime.now(UTC)
        try:
            await db.stocks.update_one({"ticker": ticker}, {"$set": stock}, upsert=True)
            success += 1
        except Exception:
            failures.append(ticker)
    return {"upserted": success, "failed": failures}
