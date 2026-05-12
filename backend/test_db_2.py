import asyncio
from database import connect_db, get_db
import pprint

async def main():
    await connect_db()
    db = get_db()
    print('AAPL:')
    pprint.pprint(await db.stocks.find_one({'ticker': 'AAPL'}))
    print('Duplicate tickers:')
    pipeline = [
        {"$group": {"_id": "$ticker", "count": {"$sum": 1}, "docs": {"$push": "$_id"}}},
        {"$match": {"count": {"$gt": 1}}}
    ]
    async for doc in db.stocks.aggregate(pipeline):
        print(doc["_id"], doc["count"])

if __name__ == '__main__':
    asyncio.run(main())
