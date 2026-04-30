"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Suggestion = { ticker: string; name: string; logo_url?: string };

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!q.trim()) return setItems([]);
      try {
        const res = await api.get<Suggestion[]>(`/search?q=${encodeURIComponent(q)}`);
        setItems(res.data);
      } catch {
        setItems([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="w-full max-w-md">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search ticker or company"
        className="input-premium rounded-full"
      />
      <div className="mt-3 space-y-2">
        {items.length === 0 && q.trim() ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-slate-400">Searching live market symbols...</div>
        ) : null}
        {items.map((item) => (
          <div key={item.ticker} className="glass-panel flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-200">
            <img src={item.logo_url || ""} alt={item.ticker} className="h-8 w-8 rounded-full border border-white/15 bg-black/30" />
            <div>
              <p className="mono text-xs text-cyan-200">{item.ticker}</p>
              <p className="text-slate-300">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
