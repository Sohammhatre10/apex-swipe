from fastapi import APIRouter, Depends, Query

from auth.dependencies import get_current_user
from database import get_db
from recommendations.engine import rank_stocks_for_user
from stocks.models import StockResponse

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/feed", response_model=list[StockResponse])
async def recommendation_feed(
    limit: int = Query(default=20, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
) -> list[StockResponse]:
    db = get_db()
    liked_tickers = current_user.get("liked_tickers", [])
    super_tickers = current_user.get("super_swiped_tickers", [])
    seen = set(liked_tickers) | set(current_user.get("disliked_tickers", [])) | set(super_tickers)

    liked = await db.stocks.find({"ticker": {"$in": liked_tickers}}).to_list(length=200)
    super_liked = await db.stocks.find({"ticker": {"$in": super_tickers}}).to_list(length=200)
    unseen = await db.stocks.find({"ticker": {"$nin": list(seen)}}).limit(500).to_list(length=500)

    ranked = rank_stocks_for_user(current_user, liked=liked, super_liked=super_liked, unseen=unseen)
    from stocks.service import _sanitize_floats
    return [StockResponse.model_validate(_sanitize_floats(doc)) for doc in ranked[:limit]]
