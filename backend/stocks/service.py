import math
from bson import ObjectId

from database import get_db

def _sanitize_floats(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: _sanitize_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_sanitize_floats(v) for v in obj]
    return obj

def _normalize_stock_doc(doc: dict) -> dict:
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    return _sanitize_floats(doc)

async def get_stock_by_ticker(ticker: str) -> dict | None:
    db = get_db()
    doc = await db.stocks.find_one({"ticker": ticker.upper()})
    if doc is None:
        return None
    return _normalize_stock_doc(doc)

async def get_unseen_stocks_for_user(user: dict, limit: int = 20) -> list[dict]:
    db = get_db()
    seen = set(user.get("liked_tickers", [])) | set(user.get("disliked_tickers", [])) | set(
        user.get("super_swiped_tickers", [])
    )
    query = {"ticker": {"$nin": list(seen)}} if seen else {}
    docs = await db.stocks.find(query).sort("last_updated", -1).limit(limit).to_list(length=limit)
    return [_normalize_stock_doc(doc) for doc in docs]
