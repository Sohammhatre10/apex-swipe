import asyncio
from database import connect_db, get_db

async def main():
    await connect_db()
    db = get_db()
    
    # Find all stocks where yf_symbol exists and is different from ticker
    cursor = db.stocks.find({"yf_symbol": {"$exists": True}, "$expr": {"$ne": ["$ticker", "$yf_symbol"]}})
    
    docs = await cursor.to_list(length=None)
    print(f"Found {len(docs)} documents to update.")
    
    success = 0
    for doc in docs:
        old_ticker = doc["ticker"]
        new_ticker = doc["yf_symbol"]
        
        # Check if the new ticker already exists to avoid duplicate key error on the new ticker
        existing = await db.stocks.find_one({"ticker": new_ticker})
        if existing and existing["_id"] != doc["_id"]:
            print(f"Conflict: {new_ticker} already exists. Skipping {old_ticker} -> {new_ticker}")
            continue
            
        try:
            await db.stocks.update_one(
                {"_id": doc["_id"]},
                {"$set": {"ticker": new_ticker}}
            )
            print(f"Updated {old_ticker} -> {new_ticker}")
            success += 1
        except Exception as e:
            print(f"Error updating {old_ticker} -> {new_ticker}: {e}")
            
    print(f"Successfully updated {success} documents.")
    
    # Also we should re-create the unique index just to be sure
    try:
        await db.stocks.create_index("ticker", unique=True)
        print("Ensured unique index on 'ticker'")
    except Exception as e:
        print(f"Error creating unique index: {e}")

if __name__ == "__main__":
    asyncio.run(main())
