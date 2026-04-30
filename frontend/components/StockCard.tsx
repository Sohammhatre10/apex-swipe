"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import styles from "./StockCard.module.css";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export interface StockData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  peRatio: string;
  marketCap: string;
  volatility: string;
  aiScore: number;
  tags: string[];
  history: { value: number }[];
}

interface StockCardProps {
  data: StockData;
  active: boolean;
  onSwipe: (dir: "left" | "right", id: string) => void;
  zIndex: number;
  depth: number;
}

export default function StockCard({ data, active, onSwipe, zIndex, depth }: StockCardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [exitX, setExitX] = useState(0);

  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Feedback opacity
  const rightGlowOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftGlowOpacity = useTransform(x, [0, -100], [0, 1]);
  
  const scale = active ? 1 : Math.max(0.8, 1 - depth * 0.05);
  const yOffset = active ? 0 : depth * 15;

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitX(1000);
      onSwipe("right", data.id);
    } else if (info.offset.x < -threshold) {
      setExitX(-1000);
      onSwipe("left", data.id);
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  useEffect(() => {
    if (exitX !== 0) {
      controls.start({ x: exitX, opacity: 0, transition: { duration: 0.3 } });
    }
  }, [exitX, controls]);

  const isPositive = data.change >= 0;
  const strokeColor = isPositive ? "var(--accent-green)" : "var(--accent-red)";

  return (
    <motion.div
      className={styles.cardWrapper}
      style={{
        x,
        rotate,
        zIndex,
      }}
      animate={controls}
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={
        exitX === 0 ? {
          scale,
          y: yOffset,
          opacity: active ? 1 : 1 - depth * 0.2,
        } : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={active ? { cursor: "grabbing" } : {}}
      whileHover={active ? { scale: 1.02 } : {}}
    >
      <div className={styles.card}>
        <motion.div className={`${styles.cardGlow} ${styles.cardGlowRight}`} style={{ opacity: rightGlowOpacity }} />
        <motion.div className={`${styles.cardGlow} ${styles.cardGlowLeft}`} style={{ opacity: leftGlowOpacity }} />
        
        <motion.div className={`${styles.stamp} ${styles.stampRight}`} style={{ opacity: rightGlowOpacity }}>BUY</motion.div>
        <motion.div className={`${styles.stamp} ${styles.stampLeft}`} style={{ opacity: leftGlowOpacity }}>PASS</motion.div>

        <div className={styles.header}>
          <div className={styles.logo}>{data.ticker.charAt(0)}</div>
          <div className={styles.titleArea}>
            <div className={styles.ticker}>{data.ticker}</div>
            <div className={styles.companyName}>{data.name}</div>
          </div>
          <div className={styles.priceArea}>
            <div className={styles.price}>${(data.price || 0).toFixed(2)}</div>
            <div className={`${styles.change} ${isPositive ? styles.changePos : styles.changeNeg}`}>
              {isPositive ? "+" : ""}{(data.change || 0).toFixed(2)} ({(data.changePercent || 0).toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className={styles.tags}>
          <div className={styles.aiBadge}>
            <Sparkles size={12} /> AI Score {data.aiScore}
          </div>
          {data.tags.map((tag, i) => (
            <span key={i} className={`tag ${i % 2 === 0 ? 'tag-purple' : 'tag-blue'}`} style={{ background: i%2===0 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(56, 189, 248, 0.15)', border: i%2===0 ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)', color: i%2===0 ? 'var(--accent-purple)' : 'var(--accent-blue)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.graphContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.history}>
              <YAxis domain={['auto', 'auto']} hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={strokeColor} 
                strokeWidth={3} 
                dot={false}
                isAnimationActive={active}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>P/E Ratio</div>
            <div className={styles.metricValue}>{data.peRatio}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Market Cap</div>
            <div className={styles.metricValue}>{data.marketCap}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Volatility</div>
            <div className={styles.metricValue}>{data.volatility}</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Volume</div>
            <div className={styles.metricValue}>1.2M</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
