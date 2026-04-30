from typing import Literal

from bson import ObjectId
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from auth.dependencies import get_current_user
from database import get_db

router = APIRouter(prefix="/users", tags=["users"])


class RiskProfileRequest(BaseModel):
    risk_profile: Literal["low", "medium", "high"]


@router.patch("/risk-profile")
async def update_risk_profile(payload: RiskProfileRequest, current_user: dict = Depends(get_current_user)) -> dict:
    db = get_db()
    user_id = current_user["_id"]
    if isinstance(user_id, ObjectId):
        await db.users.update_one({"_id": user_id}, {"$set": {"risk_profile": payload.risk_profile}})
    return {"ok": True, "risk_profile": payload.risk_profile}
