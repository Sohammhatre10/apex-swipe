"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import styles from "./page.module.css";
import { Brain, TrendingUp, Bookmark, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [riskLevel, setRiskLevel] = useState(60);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <>
      <TopNav />
      <main className="main-content">
        <div className={styles.profileContainer}>
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.avatar}>S</div>
            <div className={styles.userInfo} style={{ flex: 1 }}>
              <h1>Soham Mhatre</h1>
              <p>soham@apexswipe.app</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'var(--accent-red)', borderColor: 'rgba(251, 113, 133, 0.3)' }}
            >
              Log Out
            </button>
          </motion.div>

          <motion.div 
            className={`glass-panel ${styles.portfolioSummary}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <p className="metricLabel" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Portfolio Value</p>
              <div className={styles.portfolioValue}>$124,592.45</div>
            </div>
            <div className={styles.portfolioChange}>
              <TrendingUp size={24} /> +$4,250.00 (3.5%) Today
            </div>
          </motion.div>

          <motion.div 
            className={`glass-panel ${styles.insightsCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.insightsIcon}><Brain size={24} /></div>
            <div className={styles.insightsContent}>
              <h3>AI Trading Insights</h3>
              <p>Based on your swipe history, you prefer <strong>high-growth tech stocks</strong> with moderate volatility. We've adjusted your discovery queue to show more AI and cybersecurity opportunities.</p>
            </div>
          </motion.div>

          <motion.div 
            className={`glass-panel ${styles.riskSliderContainer}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className={styles.sectionTitle}><Settings size={20} /> Risk Profile</h3>
            <div className={styles.riskLabels}>
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={riskLevel} 
              onChange={(e) => setRiskLevel(Number(e.target.value))}
              className={styles.slider} 
            />
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
              Current level: {riskLevel} - {riskLevel < 33 ? 'Conservative' : riskLevel < 66 ? 'Moderate' : 'Aggressive'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className={styles.sectionTitle}><Bookmark size={20} /> Watchlist</h3>
            <div className={styles.grid}>
              {[
                { ticker: 'NVDA', name: 'NVIDIA', price: 850.24, change: '+2.96%' },
                { ticker: 'AMD', name: 'Advanced Micro Devices', price: 178.50, change: '+1.45%' },
                { ticker: 'PLTR', name: 'Palantir Technologies', price: 24.85, change: '-4.61%' },
                { ticker: 'CRWD', name: 'CrowdStrike Holdings', price: 310.45, change: '+1.68%' },
              ].map((stock, i) => (
                <div key={i} className={`glass-panel ${styles.miniCard}`}>
                  <div className={styles.miniCardHeader}>
                    <div>
                      <div className={styles.miniCardTicker}>{stock.ticker}</div>
                      <div className={styles.miniCardName}>{stock.name}</div>
                    </div>
                    <div>
                      <div className={styles.miniCardPrice}>${stock.price}</div>
                      <div className={styles.miniCardChange} style={{ color: stock.change.startsWith('-') ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                        {stock.change}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </>
  );
}
