import asyncio
from database import connect_db, get_db
import pprint

async def main():
    await connect_db()
    db = get_db()
    count = await db.stocks.count_documents({})
    print('Total stocks:', count)
    print('BCG:')
    pprint.pprint(await db.stocks.find_one({'ticker': 'BCG'}))
    print('BCG.NS:')
    pprint.pprint(await db.stocks.find_one({'ticker': 'BCG.NS'}))

if __name__ == '__main__':
    asyncio.run(main())
