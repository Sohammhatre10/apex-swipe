from datetime import UTC, datetime

from bson import ObjectId

from database import get_db

XP_BY_DIRECTION = {"left": 0, "right": 5, "super": 15}


async def record_swipe(user: dict, ticker: str, direction: str) -> None:
    db = get_db()
    user_id = user["_id"]
    if not isinstance(user_id, ObjectId):
        raise ValueError("Invalid user id")

    direction_map = {
        "right": "liked_tickers",
        "left": "disliked_tickers",
        "super": "super_swiped_tickers",
    }
    if direction not in direction_map:
        raise ValueError("Invalid direction")

    await db.swipes.insert_one(
        {
            "user_id": user_id,
            "ticker": ticker.upper(),
            "direction": direction,
            "swiped_at": datetime.now(UTC),
        }
    )

    # Keep preference lists mutually consistent and update XP.
    updates = {
        "$pull": {
            "liked_tickers": ticker.upper(),
            "disliked_tickers": ticker.upper(),
            "super_swiped_tickers": ticker.upper(),
        },
        "$addToSet": {direction_map[direction]: ticker.upper()},
        "$inc": {"xp": XP_BY_DIRECTION[direction]},
    }
    await db.users.update_one({"_id": user_id}, updates)
