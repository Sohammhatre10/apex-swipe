from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from auth.router import router as auth_router
from database import connect_db, get_db
from recommendations.router import router as recommendations_router
from scheduler.jobs import scheduler
from stocks.router import router as stocks_router
from swipes.router import router as swipes_router
from users.router import router as users_router

FRONTEND_URL = os.getenv("FRONTEND_URL", "").rstrip("/")
@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_db()
    db = get_db()
    await db.users.create_index("email", unique=True)
    await db.stocks.create_index("ticker", unique=True)
    await db.swipes.create_index("user_id")
    scheduler.start()
    try:
        yield
    finally:
        if scheduler.running:
            scheduler.shutdown(wait=False)


app = FastAPI(title="ApexSwipe API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", FRONTEND_URL] if FRONTEND_URL else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(stocks_router)
app.include_router(swipes_router)
app.include_router(recommendations_router)
app.include_router(users_router)


@app.get("/search")
async def search(q: str) -> list[dict]:
    db = get_db()
    regex = {"$regex": q, "$options": "i"}
    docs = await db.stocks.find({"$or": [{"ticker": regex}, {"name": regex}]}).limit(6).to_list(length=6)
    return [{"ticker": item["ticker"], "name": item.get("name", ""), "logo_url": item.get("logo_url")} for item in docs]


@app.api_route("/", methods=["GET", "HEAD"])
async def root() -> dict:
    return {"message": "ApexSwipe API is running"}

@app.get("/health")
async def health() -> dict:
    # Trigger reload
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
