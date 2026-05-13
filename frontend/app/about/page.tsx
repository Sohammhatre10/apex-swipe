"use client";

import React from "react";
import TopNav from "@/components/TopNav";
import { Users, Target, Rocket, Code, Globe, Briefcase, Sparkles } from "lucide-react";
import styles from "./about.module.css";
import { motion } from "framer-motion";

const team = [
  {
    name: "Soham Motiram Mhatre",
    role: "Lead Architect",
    bio: "Visionary behind the Apex neural core. Expert in low-latency distributed systems and high-frequency data streams."
  },
  {
    name: "Aakanksha, L Jhansi",
    role: "AI Research Lead",
    bio: "Specializes in neural ranking models and behavioral intent capture. Transforming raw data into actionable intelligence."
  },
  {
    name: "Archishman Ghosh",
    role: "Full Stack Engineer",
    bio: "Bridging the gap between complex algorithms and fluid user experiences. Obsessed with 60fps physics and clean code."
  }
];

export default function AboutPage() {
  return (
    <>
      <TopNav />
      <main className="main-content">
        <section className={styles.aboutHero}>
          <div className={styles.perspectiveGrid} />
          <div className={styles.glowOrb} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
              fontFamily: "var(--font-mono)", 
              color: "var(--accent-purple)", 
              letterSpacing: "4px", 
              textTransform: "uppercase", 
              fontSize: "0.8rem", 
              marginBottom: "16px", 
              fontWeight: 700, 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "6px 16px", 
              border: "1px solid rgba(139,92,246,0.3)", 
              borderRadius: "100px", 
              background: "rgba(139,92,246,0.05)" 
            }}
          >
            <Sparkles size={14} /> OUR GENESIS
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className={styles.mainTitle}>
              Pioneering the <br />
              <span className="text-gradient">Future of Trading</span>
            </h1>
          </motion.div>

          <motion.div 
            className={styles.missionSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <p className={styles.missionText}>
              ApexSwipe was born from a simple observation: retail traders are drowning in data but starving for insight. 
              Our mission is to democratize institutional-grade AI, delivering precision momentum signals 
              through a hyper-fluid, intuitive interface.
            </p>
          </motion.div>
        </section>

        <section className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Meet the Architects</h2>
          <div className={styles.teamGrid}>
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                className={`${styles.teamCard} glass-card`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>
                    <Users size={48} color="var(--text-secondary)" />
                  </div>
                </div>
                <div className={styles.role}>{member.role}</div>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.bio}>{member.bio}</p>
                <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                  <Code size={18} className="text-secondary" style={{ cursor: "pointer" }} />
                  <Briefcase size={18} className="text-secondary" style={{ cursor: "pointer" }} />
                  <Globe size={18} className="text-secondary" style={{ cursor: "pointer" }} />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className={`${styles.statsGrid} glass-panel`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className={styles.statItem}>
              <Target size={32} color="var(--accent-purple)" style={{ marginBottom: "16px" }} />
              <div className={styles.statValue}>99.9%</div>
              <div className={styles.statLabel}>Signal Uptime</div>
            </div>
            <div className={styles.statItem}>
              <Users size={32} color="var(--accent-blue)" style={{ marginBottom: "16px" }} />
              <div className={styles.statValue}>50k+</div>
              <div className={styles.statLabel}>Active Traders</div>
            </div>
            <div className={styles.statItem}>
              <Rocket size={32} color="var(--accent-green)" style={{ marginBottom: "16px" }} />
              <div className={styles.statValue}>15ms</div>
              <div className={styles.statLabel}>Execution Speed</div>
            </div>
          </motion.div>
        </section>

        <footer style={{ padding: "80px 0", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p>© 2026 Apex Trading Systems. Powering the next generation of wealth.</p>
        </footer>
      </main>
    </>
  );
}
