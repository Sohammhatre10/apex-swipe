import math

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def _safe_num(value: float | None) -> float:
    return float(value) if value is not None else 0.0


def _stock_vector(stock: dict, sector_encoding: dict[str, int]) -> np.ndarray:
    metrics = stock.get("metrics", {})
    sector = stock.get("sector") or "unknown"
    sector_code = float(sector_encoding.get(sector, 0))
    market_cap = _safe_num(metrics.get("market_cap"))
    pe_ratio = _safe_num(metrics.get("pe_ratio"))
    volatility = _safe_num(metrics.get("volatility"))
    momentum = _safe_num(metrics.get("momentum_score"))
    return np.array([sector_code, math.log1p(market_cap), pe_ratio, volatility, momentum], dtype=np.float64)


def rank_stocks_for_user(
    user: dict,
    liked: list[dict],
    super_liked: list[dict],
    unseen: list[dict],
) -> list[dict]:
    if not unseen:
        return []

    all_stocks = liked + super_liked + unseen
    sectors = sorted({(item.get("sector") or "unknown") for item in all_stocks})
    sector_encoding = {name: i + 1 for i, name in enumerate(sectors)}

    unseen_vectors = np.array([_stock_vector(s, sector_encoding) for s in unseen])
    if not liked and not super_liked:
        return unseen

    liked_vectors = [_stock_vector(s, sector_encoding) for s in liked]
    super_vectors = [_stock_vector(s, sector_encoding) * 2.0 for s in super_liked]
    user_vector = np.mean(np.array(liked_vectors + super_vectors), axis=0).reshape(1, -1)

    scores = cosine_similarity(user_vector, unseen_vectors)[0]
    paired = list(zip(unseen, scores, strict=False))
    ranked = sorted(paired, key=lambda item: item[1], reverse=True)
    return [stock for stock, _ in ranked]
