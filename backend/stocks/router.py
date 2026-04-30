from fastapi import APIRouter, Depends, HTTPException, Query, status

from auth.dependencies import get_current_user
from stocks.models import StockResponse
from stocks.service import get_stock_by_ticker, get_unseen_stocks_for_user

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("/feed")
async def feed(
    limit: int = Query(default=20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    docs = await get_unseen_stocks_for_user(current_user, limit=limit)
    return docs


@router.get("/{ticker}", response_model=StockResponse)
async def by_ticker(ticker: str, current_user: dict = Depends(get_current_user)) -> StockResponse:
    _ = current_user
    doc = await get_stock_by_ticker(ticker)
    if doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stock not found")
    return StockResponse.model_validate(doc)
