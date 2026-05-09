import asyncio
import io
from datetime import UTC, datetime
from typing import Any
from urllib.request import urlopen

import numpy as np
import yfinance as yf

# Top constituents of the FTSE 100 Index
TICKER_UNIVERSE = [
    "SHEL.L",  # Shell plc
    "AZN.L",   # AstraZeneca
    "HSBA.L",  # HSBC
    "ULVR.L",  # Unilever
    "BP.L",    # BP
    "GSK.L",   # GSK
    "REL.L",   # RELX
    "BATS.L",  # British American Tobacco
    "DGE.L",   # Diageo
    "RIO.L",   # Rio Tinto
    "GLEN.L",  # Glencore
    "CPG.L",   # Compass Group
    "BA.L",    # BAE Systems
    "NG.L",    # National Grid
    "LSEG.L",  # London Stock Exchange Group
    "AAL.L",   # Anglo American
    "BARC.L",  # Barclays
    "NWG.L",   # NatWest Group
    "PRU.L",   # Prudential
    "TSCO.L",  # Tesco
    "STAN.L",  # Standard Chartered
    "HLN.L",   # Haleon
    "CRH.L",   # CRH
    "FLTR.L",  # Flutter Entertainment
    "EXPN.L",  # Experian
    "SSE.L",   # SSE
    "ANTO.L",  # Antofagasta
    "SGE.L",   # Sage Group
    "WPP.L",   # WPP
    "MNDI.L",  # Mondi
    "SVT.L",   # Severn Trent
    "UU.L",    # United Utilities
    "NXT.L",   # Next
    "IMB.L",   # Imperial Brands
    "SMIN.L",  # Smiths Group
    "RKT.L",   # Reckitt Benckiser
    "INF.L",   # Informa
    "AHT.L",   # Ashtead Group
    "RR.L",    # Rolls-Royce
    "KGF.L",   # Kingfisher
    "BKG.L",   # Berkeley Group
    "PSN.L",   # Persimmon
    "TW.L",    # Taylor Wimpey
    "BDEV.L",  # Barratt Developments
    "VOD.L",   # Vodafone Group
    "BT-A.L",  # BT Group
    "MKS.L",   # Marks & Spencer
    "JMAT.L",  # Johnson Matthey
    "ABF.L",   # Associated British Foods
    "AV.L",    # Aviva
]

PLACEHOLDER_LOGO = "https://placehold.co/128x128?text=UK+Stock"


def _build_logo_url(info: dict[str, Any]) -> str:
    website = info.get("website")
    if not website or "://" not in website:
        return PLACEHOLDER_LOGO
    domain = website.split("://", maxsplit=1)[1].split("/", maxsplit=1)[0]
    return f"https://logo.clearbit.com/{domain}"


def get_uk_ticker_universe(limit: int = 1500) -> list[str]:
    # Since there's no single easy CSV endpoint for LSE symbols like there is for NASDAQ,
    # we return a robust default list of major FTSE companies.
    # To expand this, you could point to a hosted CSV of LSE tickers.
    unique_symbols = list(dict.fromkeys(TICKER_UNIVERSE))
    if limit > 0:
        return unique_symbols[:limit]
    return unique_symbols


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
        "tags": ["UK"],
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
    return await fetch_tickers(get_uk_ticker_universe(), batch_size=batch_size)


async def fetch_tickers(tickers: list[str], batch_size: int = 50) -> list[dict]:
    out: list[dict] = []
    for i in range(0, len(tickers), batch_size):
        batch = tickers[i : i + batch_size]
        try:
            out.extend(await asyncio.to_thread(_download_batch, batch))
        except Exception:
            continue
    return out
