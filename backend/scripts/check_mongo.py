import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import connect_db, get_db

async def main():
    await connect_db()
    db = get_db()
    
    print("\n--- MongoDB Database Check ---")
    
    # Check total stocks
    total_stocks = await db.stocks.count_documents({})
    print(f"Total stocks in database: {total_stocks}")
    
    # Check NSE stocks specifically
    nse_stocks_count = await db.stocks.count_documents({"exchange": "NSE"})
    print(f"Total NSE stocks: {nse_stocks_count}")
    
    print("\nListing fetched NSE Stocks:")
    cursor = db.stocks.find({"exchange": "NSE"}, {"_id": 0, "ticker": 1, "name": 1, "metrics.market_cap_cr": 1})
    
    async for stock in cursor:
        print(f"- {stock.get('ticker')}: {stock.get('name')} (Market Cap: {stock.get('metrics', {}).get('market_cap_cr')})")

if __name__ == "__main__":
    asyncio.run(main())
