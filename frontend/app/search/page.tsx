"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import { Search as SearchIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import styles from "./page.module.css";
import { motion } from "framer-motion";

const mockResults = [
  { id: "1", ticker: "AAPL", name: "Apple Inc.", price: 173.50, change: 1.25, changePct: 0.73, history: [{v: 170}, {v: 172}, {v: 171}, {v: 173.5}] },
  { id: "2", ticker: "GOOGL", name: "Alphabet Inc.", price: 142.65, change: -0.85, changePct: -0.59, history: [{v: 145}, {v: 144}, {v: 142}, {v: 142.65}] },
  { id: "3", ticker: "AMZN", name: "Amazon.com", price: 178.22, change: 2.10, changePct: 1.19, history: [{v: 175}, {v: 176}, {v: 178}, {v: 178.22}] },
  { id: "4", ticker: "META", name: "Meta Platforms", price: 485.58, change: 15.20, changePct: 3.23, history: [{v: 470}, {v: 475}, {v: 480}, {v: 485.58}] },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filteredResults = query === "" ? [] : mockResults.filter(r => 
    r.ticker.toLowerCase().includes(query.toLowerCase()) || 
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <TopNav />
      <main className="main-content">
        <div className={styles.searchContainer}>
          <div className={styles.searchHeader}>
            <h1>Discover Assets</h1>
            <p>Search by ticker, company name, or sector</p>
          </div>

          <div className={styles.searchInputWrapper}>
            <SearchIcon className={styles.searchIcon} size={24} />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Search stocks..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.resultsList}>
            {query === "" ? (
              <div className={styles.emptyState}>
                <p>Start typing to see live market data...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              filteredResults.map((result, i) => (
                <motion.div 
                  key={result.id}
                  className={styles.resultCard}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className={styles.resultLogo}>{result.ticker.charAt(0)}</div>
                  
                  <div className={styles.resultInfo}>
                    <div className={styles.resultTicker}>{result.ticker}</div>
                    <div className={styles.resultName}>{result.name}</div>
                  </div>

                  <div className={styles.resultGraph}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.history}>
                        <YAxis domain={['auto', 'auto']} hide />
                        <Line 
                          type="monotone" 
                          dataKey="v" 
                          stroke={result.change >= 0 ? "var(--accent-green)" : "var(--accent-red)"} 
                          strokeWidth={2} 
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={styles.resultPrice}>
                    <div className={styles.price}>${(result.price || 0).toFixed(2)}</div>
                    <div className={`${styles.change} ${result.change >= 0 ? styles.pos : styles.neg}`}>
                      {result.change >= 0 ? "+" : ""}{(result.change || 0).toFixed(2)} ({(result.changePct || 0).toFixed(2)}%)
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
