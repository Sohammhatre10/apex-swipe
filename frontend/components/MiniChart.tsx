"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { PricePoint } from "@/types/stock";

export default function MiniChart({ priceHistory }: { priceHistory: PricePoint[] }) {
  const uptrend =
    priceHistory.length > 1 && priceHistory[priceHistory.length - 1].close >= priceHistory[0].close;
  return (
    <div className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={priceHistory}>
          <Area
            dataKey="close"
            type="monotone"
            stroke={uptrend ? "#22C55E" : "#EF4444"}
            strokeWidth={2}
            fill={uptrend ? "rgba(34,197,94,0.22)" : "rgba(239,68,68,0.22)"}
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
