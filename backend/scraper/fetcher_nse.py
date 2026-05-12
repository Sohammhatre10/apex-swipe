
import asyncio
import csv
import io
from datetime import UTC, datetime
from typing import Any

import numpy as np
import requests
import yfinance as yf

TICKER_UNIVERSE = [
    "RELIANCE",
    "HDFCBANK",
    "TCS",
    "INFY",
    "ICICIBANK",
    "BHARTIARTL",
    "SBIN",
    "WIPRO",
    "LT",
]

PLACEHOLDER_LOGO = "https://placehold.co/128x128?text=Stock"





def _safe_float(value: str) -> float | None:
    try:
        cleaned = value.replace(",", "").replace("%", "").strip()
        return float(cleaned) if cleaned else None
    except (ValueError, AttributeError):
        return None


def get_nse_ticker_universe(limit: int = 1500) -> list[dict[str, str]]:
    url = "https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        reader = csv.DictReader(io.StringIO(response.text))
        universe = []
        for row in reader:
            sym = row.get("SYMBOL", "").strip()
            name = row.get("NAME OF COMPANY", sym).strip()
            if sym:
                universe.append({"ticker": sym, "name": name})
        
        if not universe:
            raise ValueError("No tickers found in CSV")
            
        return universe[:limit]
    except Exception as exc:
        print(f"[fetcher_nse] Failed to fetch official NSE list: {exc}. Using fallback.")
        return [{"ticker": t, "name": t} for t in TICKER_UNIVERSE[:limit]]


def _nse_yf_symbol(symbol: str) -> str:
    return f"{symbol}.NS"

def _build_logo_url(info: dict[str, Any]) -> str:
    website = info.get("website") if info else None
    if not website or "://" not in website:
        return PLACEHOLDER_LOGO
    domain = website.split("://", maxsplit=1)[1].split("/", maxsplit=1)[0]
    return f"https://logo.clearbit.com/{domain}"


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


def _extract_symbol_history(history, yf_symbol: str):
    if history is None or history.empty:
        return None

    if getattr(history.columns, "nlevels", 1) == 1:
        return history

    try:
        symbol_history = history.xs(yf_symbol, axis=1, level=1)

        if symbol_history.empty:
            return None

        return symbol_history

    except Exception as exc:
        print(f"History extraction failed for {yf_symbol}: {exc}")
        return None


def _build_stock_doc(ticker: str, info: dict[str, Any], history) -> dict | None:
    if history is None or history.empty:
        return None
    closes = history["Close"].dropna()
    if closes.empty:
        return None

    volatility, momentum = _calc_metrics(history)
    week_52_high = float(closes.max())
    week_52_low = float(closes.min())

    market_cap_cr = info.get("marketCap") if isinstance(info, dict) else None
    pe_ratio = info.get("trailingPE") if isinstance(info, dict) else None
    div_yield = info.get("dividendYield") if isinstance(info, dict) else None
    sector = info.get("sector") if isinstance(info, dict) else None
    industry = info.get("industry") if isinstance(info, dict) else None

    return {
        "ticker": ticker,
        "yf_symbol": _nse_yf_symbol(ticker),
        "name": info.get("shortName", ticker),
        "exchange": "NSE",
        "currency": info.get("currency", "INR"),
        "sector": sector,
        "industry": industry,
        "logo_url": _build_logo_url(info),
        "metrics": {
            "market_cap_cr": market_cap_cr,
            "pe_ratio": pe_ratio,
            "dividend_yield": div_yield,
            "week_52_high": week_52_high,
            "week_52_low": week_52_low,
            "volatility": volatility,
            "momentum_score": momentum,
        },
        "price_history": _history_to_points(history),
        "last_updated": datetime.now(UTC),
        "tags": ["NSE", "India"],
    }


def _download_batch(batch_meta: list[dict[str, str]]) -> list[dict]:
    out: list[dict] = []
    for meta in batch_meta:
        ticker = meta["ticker"]
        yf_symbol = _nse_yf_symbol(ticker)
        try:
            ticker_obj = yf.Ticker(yf_symbol)
            try:
                info = ticker_obj.info
            except Exception:
                info = {}
            history = yf.download(yf_symbol, period="6mo", interval="1d", progress=False, auto_adjust=False)

            history = _extract_symbol_history(history, yf_symbol)

            doc = _build_stock_doc(ticker, info, history)
            if doc is not None:
                out.append(doc)
        except Exception as exc:
            print(f"[fetcher_nse] Failed to fetch {ticker}: {exc}", flush=True)
            continue
    return out


async def fetch_nse_ticker_universe(batch_size: int = 25) -> list[dict]:
    universe_meta = get_nse_ticker_universe(limit=1500)
    return await fetch_nse_tickers(universe_meta, batch_size=batch_size)


async def fetch_nse_tickers(
    tickers_meta: list[dict[str, str]],
    batch_size: int = 25,
) -> list[dict]:
    out: list[dict] = []
    total = len(tickers_meta)
    for i in range(0, total, batch_size):
        batch = tickers_meta[i : i + batch_size]
        try:
            results = await asyncio.to_thread(_download_batch, batch)
            out.extend(results)
            print(
                f"[fetcher_nse] yfinance batch {i // batch_size + 1} done "
                f"({len(out)}/{total})",
                flush=True,
            )
        except Exception as exc:
            print(f"[fetcher_nse] Batch {i // batch_size + 1} failed: {exc}", flush=True)
            continue
    return out
