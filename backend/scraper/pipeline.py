from datetime import UTC, datetime

from database import get_db


async def upsert_stocks(stocks: list[dict]) -> dict:
    db = get_db()
    success = 0
    failures: list[str] = []
    for stock in stocks:
        ticker = stock.get("ticker", "").upper()
        exchange = stock.get("exchange", "UNKNOWN").upper()
        if not ticker:
            failures.append("missing-ticker")
            continue
        stock["ticker"] = ticker
        stock["exchange"] = exchange
        stock["last_updated"] = datetime.now(UTC)
        try:
            # Compound filter: same ticker on different exchanges → separate docs
            await db.stocks.update_one(
                {"ticker": ticker, "exchange": exchange},
                {"$set": stock},
                upsert=True,
            )
            success += 1
        except Exception:
            failures.append(f"{ticker}:{exchange}")
    return {"upserted": success, "failed": failures}
