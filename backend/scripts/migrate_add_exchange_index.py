import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import connect_db, get_db


async def main() -> None:
    await connect_db()
    db = get_db()

    result = await db.stocks.update_many(
        {"exchange": {"$exists": False}},
        {"$set": {"exchange": "US", "currency": "USD"}},
    )
    print(f"[migrate] Patched {result.modified_count} existing US stock docs with exchange='US'", flush=True)

    existing_indexes = await db.stocks.index_information()
    if "ticker_1" in existing_indexes:
        await db.stocks.drop_index("ticker_1")
        print("[migrate] Dropped old 'ticker_1' unique index.", flush=True)
    else:
        print("[migrate] 'ticker_1' index not found — skipping drop.", flush=True)

    if "ticker_exchange_unique" in existing_indexes:
        await db.stocks.drop_index("ticker_exchange_unique")
        print("[migrate] Dropped existing 'ticker_exchange_unique' index (will recreate).", flush=True)

    await db.stocks.create_index(
        [("ticker", 1), ("exchange", 1)],
        unique=True,
        name="ticker_exchange_unique",
    )
    print("[migrate] Created compound unique index on (ticker, exchange).", flush=True)
    print("[migrate] Migration complete. You can now run ingest_nse_universe.py.", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
