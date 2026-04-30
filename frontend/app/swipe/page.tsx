"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import StockCard, { StockData } from "@/components/StockCard";
import styles from "./swipe.module.css";
import { X, Check, Bookmark } from "lucide-react";

export default function SwipePage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/stocks/feed?limit=20`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
        throw new Error("Failed to fetch stocks");
      }

      const data = await res.json();
      
      const formattedStocks: StockData[] = data.map((item: any) => {
        // Calculate basic price & change from history if available
        let price = 0;
        let change = 0;
        let changePercent = 0;
        const history = item.price_history?.map((p: any) => ({ value: p.close })) || [];
        
        if (history.length > 0) {
          price = history[history.length - 1].value;
          if (history.length > 1) {
            const prev = history[0].value;
            change = price - prev;
            changePercent = (change / prev) * 100;
          }
        }

        const mcap = item.metrics?.market_cap;
        const formattedMcap = mcap ? (mcap >= 1e12 ? (mcap/1e12).toFixed(1) + 'T' : mcap >= 1e9 ? (mcap/1e9).toFixed(1) + 'B' : (mcap/1e6).toFixed(1) + 'M') : "N/A";

        return {
          id: item.ticker, // using ticker as ID
          ticker: item.ticker,
          name: item.name,
          price: price,
          change: change,
          changePercent: changePercent,
          peRatio: item.metrics?.pe_ratio?.toFixed(1) || "N/A",
          marketCap: formattedMcap,
          volatility: item.metrics?.volatility ? (item.metrics.volatility > 0.3 ? "High" : item.metrics.volatility > 0.15 ? "Med" : "Low") : "Unknown",
          aiScore: item.metrics?.momentum_score ? Math.round(item.metrics.momentum_score * 100) : 75,
          tags: item.tags || [item.sector || "Tech"],
          history: history,
        };
      });

      setStocks((prev) => [...prev, ...formattedStocks]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSwipe = async (dir: "left" | "right", id: string) => {
    // Optimistic UI update
    setStocks((prev) => prev.filter((s) => s.id !== id));
    
    // Send to backend
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${apiUrl}/swipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker: id,
          direction: dir,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error("Failed to record swipe", e);
    }

    // Fetch more if low
    if (stocks.length < 5) {
      fetchStocks();
    }
  };

  return (
    <>
      <TopNav />
      <main className="main-content">
        <div className={styles.swipeContainer}>
          {loading && stocks.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.loader}></div>
              <p>Analyzing market data...</p>
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <p style={{ color: 'var(--accent-red)' }}>{error}</p>
              <button onClick={() => fetchStocks()} className="btn-primary" style={{ marginTop: '16px' }}>Retry</button>
            </div>
          ) : stocks.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You've swiped through all available stocks!</p>
            </div>
          ) : (
            <>
              <div className={styles.deckContainer}>
                {stocks.map((stock, idx) => {
                  const depth = idx; 
                  const isTop = depth === 0;
                  const zIndex = 100 - depth;
                  
                  if (depth > 3) return null;

                  return (
                    <StockCard
                      key={stock.id + idx}
                      data={stock}
                      active={isTop}
                      onSwipe={handleSwipe}
                      zIndex={zIndex}
                      depth={depth}
                    />
                  );
                })}
              </div>

              <div className={styles.actionButtons}>
                <button 
                  className={`${styles.actionBtn} ${styles.btnPass}`}
                  onClick={() => handleSwipe("left", stocks[0].id)}
                >
                  <X size={32} />
                </button>
                <button className={`${styles.actionBtn} ${styles.btnSave}`}>
                  <Bookmark size={24} />
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.btnBuy}`}
                  onClick={() => handleSwipe("right", stocks[0].id)}
                >
                  <Check size={32} />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
