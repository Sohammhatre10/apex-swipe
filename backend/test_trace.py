import asyncio
import traceback
from database import connect_db, get_db
from stocks.service import get_unseen_stocks_for_user

async def main():
    await connect_db()
    db = get_db()
    user = await db.users.find_one()
    try:
        docs = await get_unseen_stocks_for_user(user, limit=5)
        print("Success:", len(docs))
    except Exception as e:
        print("Error:")
        traceback.print_exc()

asyncio.run(main())
