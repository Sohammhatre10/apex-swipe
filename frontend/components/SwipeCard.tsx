"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import MiniChart from "@/components/MiniChart";
import MetricBadge from "@/components/MetricBadge";
import type { Stock } from "@/types/stock";

export default function SwipeCard({
  stock,
  onSwipe,
  depth = 0,
  interactive = true,
}: {
  stock: Stock;
  onSwipe: (dir: "left" | "right" | "super") => void;
  depth?: number;
  interactive?: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const buyOpacity = useTransform(x, [20, 130], [0, 1]);
  const passOpacity = useTransform(x, [-130, -20], [1, 0]);
  const trendUp = stock.price_history.length > 1 && stock.price_history.at(-1)!.close >= stock.price_history[0].close;

  return (
    <div className="w-full max-w-md" style={{ transform: `translateY(${depth * 12}px) scale(${1 - depth * 0.03})` }}>
      <motion.div
        drag={interactive ? "x" : false}
        style={{ x, rotate }}
        dragElastic={0.25}
        dragMomentum
        onDragEnd={(_, info) => {
          if (!interactive) return;
          if (info.offset.x > 120 || info.velocity.x > 420) onSwipe("right");
          else if (info.offset.x < -120 || info.velocity.x < -420) onSwipe("left");
        }}
        whileHover={{ scale: interactive ? 1.01 : 1 }}
        className="relative overflow-hidden rounded-[24px] border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <motion.div style={{ opacity: buyOpacity }} className="pointer-events-none absolute inset-0 bg-emerald-500/15" />
        <motion.div style={{ opacity: passOpacity }} className="pointer-events-none absolute inset-0 bg-rose-500/15" />
        <motion.p style={{ opacity: buyOpacity }} className="mono absolute right-4 top-4 rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1 text-xs tracking-[0.2em] text-emerald-100">
          BUY
        </motion.p>
        <motion.p style={{ opacity: passOpacity }} className="mono absolute left-4 top-4 rounded-full border border-rose-300/40 bg-rose-400/20 px-3 py-1 text-xs tracking-[0.2em] text-rose-100">
          PASS
        </motion.p>
        <div className="mb-4 flex items-center gap-3">
          <img src={stock.logo_url || ""} alt={stock.ticker} className="glow-ring h-11 w-11 rounded-full bg-black/30 object-cover" />
          <div>
            <p className="text-lg font-semibold text-slate-100">{stock.name}</p>
            <p className="mono text-xs text-slate-400">{stock.ticker}</p>
          </div>
          <div className={`ml-auto rounded-full px-2 py-1 text-xs ${trendUp ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"}`}>
            {trendUp ? "Trending" : "Cooling"}
          </div>
        </div>
        <MiniChart priceHistory={stock.price_history || []} />
        <div className="mt-4 flex flex-wrap gap-2">
          <MetricBadge label="PE" value={String(stock.metrics?.pe_ratio ?? "-")} />
          <MetricBadge label="Cap" value={stock.metrics?.market_cap ? `$${Math.round(stock.metrics.market_cap / 1e9)}B` : "-"} />
          <MetricBadge label="Vol" value={String(stock.metrics?.volatility ?? "-")} />
          <MetricBadge label="AI" value={String(Math.round(stock.metrics?.momentum_score ?? 50))} />
        </div>
      </motion.div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={() => onSwipe("left")} className="rounded-xl border border-white/20 bg-rose-500/10 px-4 py-2 text-rose-300 transition hover:-translate-y-0.5">
          Left Swipe
        </button>
        <button onClick={() => onSwipe("right")} className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 font-semibold text-black transition hover:-translate-y-0.5">
          Right Swipe
        </button>
      </div>
    </div>
  );
}
