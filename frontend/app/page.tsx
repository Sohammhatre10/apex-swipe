"use client";

import Link from "next/link";
import TopNav from "@/components/TopNav";
import { Zap, TrendingUp, Cpu, Activity, Sparkles } from "lucide-react";
import styles from "./page.module.css";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HomePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <>
      <TopNav />
      <main className="main-content">
        <section className={styles.heroSection}>
          <div className={styles.perspectiveGrid} />
          <motion.div className={`${styles.glowOrb} ${styles.orb1}`} style={{ y: y1 }} />
          <motion.div className={`${styles.glowOrb} ${styles.orb2}`} style={{ y: y2 }} />
          
          <motion.div 
            className={styles.subTitle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Sparkles size={16} /> QUANTUM AI ALGORITHMS
          </motion.div>
          
          <motion.h1 
            className={styles.mainTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <span className={styles.glitchText} data-text="SWIPE SMARTER.">SWIPE SMARTER.</span><br />
            <span className="text-gradient" style={{ display: 'inline-block' }}>INVEST FASTER.</span>
          </motion.h1>
          
          <motion.p 
            className={styles.description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Experience the future of retail trading. Our proprietary AI engine analyzes 10,000+ assets in real-time to deliver hyper-personalized momentum signals straight to your feed. No lag. Pure performance.
          </motion.p>
          
          <motion.div 
            className={styles.ctaGroup}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/swipe" className={styles.btnFuturistic}>
              Initialize Engine
            </Link>
          </motion.div>
        </section>

        <section className={styles.featuresGrid}>
          {[
            { 
              icon: <Zap size={32} />, 
              title: "Hyper-Fluid UX", 
              desc: "Built on a custom rendering engine. Zero lag, 60fps spring physics tuned for the ultimate swipe experience." 
            },
            { 
              icon: <Cpu size={32} />, 
              title: "Neural Ranking", 
              desc: "Dynamically shifting universe of stocks. Our neural networks adapt to your risk profile in milliseconds." 
            },
            { 
              icon: <Activity size={32} />, 
              title: "Live Telemetry", 
              desc: "Constant data streams pipe momentum, volatility, and volume directly into your dashboard." 
            },
            { 
              icon: <TrendingUp size={32} />, 
              title: "Intent Capture", 
              desc: "Every swipe trains your personal model. The more you swipe, the deadlier your edge becomes." 
            }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className={styles.featureCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
            >
              <div className={styles.featureIcon}>{item.icon}</div>
              <h3 className={styles.featureTitle}>{item.title}</h3>
              <p className={styles.featureDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className={styles.statsSection}>
          <div className={styles.statItem}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className={styles.statValue}
            >
              1.5K+
            </motion.div>
            <div className={styles.statLabel}>Active Assets</div>
          </div>
          <div className={styles.statItem}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className={styles.statValue}
            >
              &lt;20ms
            </motion.div>
            <div className={styles.statLabel}>Query Latency</div>
          </div>
          <div className={styles.statItem}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: 0.4 }}
              className={styles.statValue}
            >
              99.9%
            </motion.div>
            <div className={styles.statLabel}>AI Accuracy</div>
          </div>
        </section>
      </main>
    </>
  );
}
