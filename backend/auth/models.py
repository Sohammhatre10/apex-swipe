from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=120)
    risk_profile: Literal["low", "medium", "high"] = "medium"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfileResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    created_at: datetime
    risk_profile: Literal["low", "medium", "high"]
    liked_tickers: list[str] = []
    disliked_tickers: list[str] = []
    super_swiped_tickers: list[str] = []
    swipe_streak: int = 0
    xp: int = 0
