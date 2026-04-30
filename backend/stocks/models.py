from datetime import datetime

from pydantic import BaseModel


class PricePoint(BaseModel):
    date: str
    close: float


class StockMetrics(BaseModel):
    market_cap: float | None = None
    pe_ratio: float | None = None
    dividend_yield: float | None = None
    week_52_high: float | None = None
    week_52_low: float | None = None
    volatility: float | None = None
    momentum_score: float | None = None


class StockResponse(BaseModel):
    ticker: str
    name: str
    sector: str | None = None
    industry: str | None = None
    logo_url: str | None = None
    metrics: StockMetrics
    price_history: list[PricePoint] = []
    last_updated: datetime | None = None
    tags: list[str] = []
