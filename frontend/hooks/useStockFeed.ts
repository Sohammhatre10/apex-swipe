"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Stock } from "@/types/stock";

export function useStockFeed() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<Stock[]>("/recommendations/feed?limit=20")
      .then((res) => {
        if (mounted) setStocks(res.data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { stocks, setStocks, loading };
}
