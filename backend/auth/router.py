from datetime import UTC, datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from auth.dependencies import get_current_user
from auth.models import AuthTokenResponse, LoginRequest, RegisterRequest, UserProfileResponse
from auth.service import create_access_token, hash_password, verify_password
from database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


def _to_profile(user: dict) -> UserProfileResponse:
    return UserProfileResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        created_at=user["created_at"],
        risk_profile=user.get("risk_profile", "medium"),
        liked_tickers=user.get("liked_tickers", []),
        disliked_tickers=user.get("disliked_tickers", []),
        super_swiped_tickers=user.get("super_swiped_tickers", []),
        swipe_streak=user.get("swipe_streak", 0),
        xp=user.get("xp", 0),
    )


@router.post("/register", response_model=UserProfileResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest) -> UserProfileResponse:
    db = get_db()
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user_doc = {
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "name": payload.name,
        "created_at": datetime.now(UTC),
        "risk_profile": payload.risk_profile,
        "liked_tickers": [],
        "disliked_tickers": [],
        "super_swiped_tickers": [],
        "swipe_streak": 0,
        "xp": 0,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return _to_profile(user_doc)


@router.post("/login", response_model=AuthTokenResponse)
async def login(payload: LoginRequest) -> AuthTokenResponse:
    db = get_db()
    user = await db.users.find_one({"email": payload.email.lower()})
    if user is None or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(str(user["_id"]))
    return AuthTokenResponse(access_token=token)


@router.get("/me", response_model=UserProfileResponse)
async def me(current_user: dict = Depends(get_current_user)) -> UserProfileResponse:
    if not isinstance(current_user.get("_id"), ObjectId):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Invalid user document")
    return _to_profile(current_user)
