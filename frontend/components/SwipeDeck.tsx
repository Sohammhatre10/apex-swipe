"use client";

import { FormEvent, useMemo, useState } from "react";
import SwipeCard from "@/components/SwipeCard";
import SkeletonCard from "@/components/SkeletonCard";
import { useStockFeed } from "@/hooks/useStockFeed";
import { sendSwipe } from "@/hooks/useSwipe";

export default function SwipeDeck() {
  const { stocks, setStocks, loading } = useStockFeed();
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyTicker, setBuyTicker] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const current = stocks[0];
  const stack = stocks.slice(0, 3);
  const buyStock = useMemo(() => stocks.find((item) => item.ticker === buyTicker) ?? null, [stocks, buyTicker]);

  if (loading) {
    return (
      <div className="grid gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  function handleLeftSwipe() {
    setStocks((prev) => {
      if (prev.length <= 1) return prev;
      return [...prev.slice(1), prev[0]];
    });
  }

  function openBuyForm() {
    if (!current) return;
    setBuyTicker(current.ticker);
    setAmount("");
    setOrderType("market");
    setLimitPrice("");
    setError("");
    setBuyOpen(true);
  }

  async function handleBuySubmit(e: FormEvent) {
    e.preventDefault();
    if (!buyStock) return;

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (orderType === "limit") {
      const parsedLimit = Number(limitPrice);
      if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
        setError("Enter a valid limit price.");
        return;
      }
    }

    setSubmitting(true);
    setError("");
    try {
      await sendSwipe(buyStock.ticker, "right");
      setStocks((prev) => prev.filter((item) => item.ticker !== buyStock.ticker));
      setBuyOpen(false);
    } catch {
      setError("Could not place buy intent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!current) {
    return (
      <div className="w-full max-w-md space-y-3">
        <p className="text-sm text-slate-400">Refreshing personalized feed...</p>
        <SkeletonCard />
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-[560px] w-full">
        {stack
          .slice(1)
          .reverse()
          .map((item, idx) => (
            <div key={item.ticker} className="absolute inset-0">
              <SwipeCard stock={item} depth={idx + 1} interactive={false} onSwipe={() => undefined} />
            </div>
          ))}
        <div className="absolute inset-0">
          <SwipeCard
            stock={current}
            onSwipe={async (direction) => {
              if (direction === "left") {
                handleLeftSwipe();
                return;
              }
              if (direction === "right") {
                openBuyForm();
                return;
              }
              await sendSwipe(current.ticker, direction);
              setStocks((prev) => prev.slice(1));
            }}
          />
        </div>
      </div>

      {buyOpen && buyStock ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleBuySubmit} className="glass-panel w-full max-w-md space-y-3 rounded-3xl p-5">
            <h2 className="text-lg font-semibold text-slate-100">Buy {buyStock.ticker}</h2>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (USD)"
              inputMode="decimal"
              className="input-premium"
            />
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as "market" | "limit")}
              className="input-premium"
            >
              <option value="market">Market Buy</option>
              <option value="limit">Limit Buy</option>
            </select>
            {orderType === "limit" ? (
              <input
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Limit price"
                inputMode="decimal"
                className="input-premium"
              />
            ) : null}
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBuyOpen(false)}
                className="w-full rounded-xl border border-white/20 px-4 py-2 transition hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Confirm Buy"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
