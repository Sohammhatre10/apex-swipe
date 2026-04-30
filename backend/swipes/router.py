from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth.dependencies import get_current_user
from swipes.service import record_swipe

router = APIRouter(prefix="/swipes", tags=["swipes"])


class SwipeRequest(BaseModel):
    ticker: str
    direction: Literal["left", "right", "super"]


@router.post("", status_code=status.HTTP_201_CREATED)
async def swipe(payload: SwipeRequest, current_user: dict = Depends(get_current_user)) -> dict:
    try:
        await record_swipe(current_user, payload.ticker, payload.direction)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return {"ok": True}
