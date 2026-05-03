import asyncio
import csv
import io
from datetime import UTC, datetime
from typing import Any
from urllib.request import urlopen

import numpy as np
import yfinance as yf

TICKER_UNIVERSE = [
    "AAPL",
    "MSFT",
    "NVDA",
    "GOOGL",
    "AMZN",
    "META",
    "TSLA",
    "BRK-B",
    "JPM",
    "V",
]

PLACEHOLDER_LOGO = "https://placehold.co/128x128?text=Stock"
NASDAQ_LISTED_URL = "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt"
OTHER_LISTED_URL = "https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt"


def _build_logo_url(info: dict[str, Any]) -> str:
    website = info.get("website")
    if not website or "://" not in website:
        return PLACEHOLDER_LOGO
    domain = website.split("://", maxsplit=1)[1].split("/", maxsplit=1)[0]
    return f"https://logo.clearbit.com/{domain}"


def _normalize_symbol(symbol: str) -> str:
    cleaned = symbol.strip().upper()
    return cleaned.replace(".", "-")


def _download_text(url: str) -> str:
    with urlopen(url, timeout=30) as response:
        return response.read().decode("utf-8", errors="ignore")


def _parse_symbol_file(raw: str, symbol_field: str) -> list[str]:
    rows = csv.DictReader(io.StringIO(raw), delimiter="|")
    symbols: list[str] = []
    for row in rows:
        symbol = row.get(symbol_field, "")
        test_issue = row.get("Test Issue", "N")
        if not symbol or symbol == "File Creation Time" or test_issue == "Y":
            continue
        normalized = _normalize_symbol(symbol)
        if (
            not normalized
            or "$" in normalized
            or "^" in normalized
            or "/" in normalized
            or " " in normalized
        ):
            continue
        symbols.append(normalized)
    return symbols


def get_us_ticker_universe(limit: int = 1500) -> list[str]:
    try:
        nasdaq_raw = _download_text(NASDAQ_LISTED_URL)
        other_raw = _download_text(OTHER_LISTED_URL)
        symbols = _parse_symbol_file(nasdaq_raw, "Symbol") + _parse_symbol_file(other_raw, "ACT Symbol")
        unique_symbols = list(dict.fromkeys(symbols))
        if limit > 0:
            return unique_symbols[:limit]
        return unique_symbols
    except Exception:
        return TICKER_UNIVERSE


def _history_to_points(history) -> list[dict]:
    if history is None or history.empty:
        return []
    points = []
    for idx, row in history.tail(180).iterrows():
        points.append({"date": idx.strftime("%Y-%m-%d"), "close": float(row["Close"])})
    return points


def _calc_metrics(history) -> tuple[float | None, float | None]:
    if history is None or history.empty:
        return None, None
    closes = history["Close"].dropna()
    if len(closes) < 2:
        return None, None
    returns = closes.pct_change().dropna()
    volatility = float(np.std(returns)) if len(returns) else None
    current = float(closes.iloc[-1])
    avg_price = float(closes.mean())
    raw_momentum = ((current / avg_price) - 1.0) * 100.0 if avg_price else 0.0
    momentum = max(0.0, min(100.0, 50.0 + raw_momentum))
    return volatility, momentum


def _extract_symbol_history(history, ticker: str):
    if history is None or history.empty:
        return None
    if getattr(history.columns, "nlevels", 1) == 1:
        return history
    if ticker not in history.columns.get_level_values(0):
        return None
    symbol_history = history[ticker]
    if symbol_history is None or symbol_history.empty:
        return None
    return symbol_history


def _build_stock_from_history(ticker: str, history) -> dict | None:
    if history is None or history.empty:
        return None
    closes = history["Close"].dropna()
    if closes.empty:
        return None

    volatility, momentum = _calc_metrics(history)
    week_52_high = float(closes.max()) if not closes.empty else None
    week_52_low = float(closes.min()) if not closes.empty else None
    return {
        "ticker": ticker,
        "name": ticker,
        "sector": None,
        "industry": None,
        "logo_url": PLACEHOLDER_LOGO,
        "metrics": {
            "market_cap": None,
            "pe_ratio": None,
            "dividend_yield": None,
            "week_52_high": week_52_high,
            "week_52_low": week_52_low,
            "volatility": volatility,
            "momentum_score": momentum,
        },
        "price_history": _history_to_points(history),
        "last_updated": datetime.now(UTC),
        "tags": [],
    }


def _download_batch(batch: list[str]) -> list[dict]:
    history = yf.download(
        " ".join(batch),
        period="6mo",
        interval="1d",
        group_by="ticker",
        threads=False,
        progress=False,
        auto_adjust=False,
    )
    out: list[dict] = []
    for ticker in batch:
        symbol_history = _extract_symbol_history(history, ticker)
        stock = _build_stock_from_history(ticker, symbol_history)
        if stock is not None:
            out.append(stock)
    return out


async def fetch_ticker_universe(batch_size: int = 50) -> list[dict]:
    return await fetch_tickers(TICKER_UNIVERSE, batch_size=batch_size)


async def fetch_tickers(tickers: list[str], batch_size: int = 50) -> list[dict]:
    out: list[dict] = []
    for i in range(0, len(tickers), batch_size):
        batch = tickers[i : i + batch_size]
        try:
            out.extend(await asyncio.to_thread(_download_batch, batch))
        except Exception:
            continue
    return out
