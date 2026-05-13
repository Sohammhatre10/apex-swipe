"use client";

import React, { useState } from "react";
import TopNav from "@/components/TopNav";
import { 
  Search, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  MessageSquare, 
  Mail, 
  HelpCircle,
  Zap
} from "lucide-react";
import styles from "./help.module.css";
import { motion } from "framer-motion";

const categories = [
  {
    icon: <BookOpen size={24} />,
    title: "Getting Started",
    desc: "New to Apex? Learn the basics of our neural trading interface and setup your first feed."
  },
  {
    icon: <Cpu size={24} />,
    title: "Trading Engine",
    desc: "Deep dive into our AI algorithms, momentum signals, and real-time telemetry systems."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Account & Security",
    desc: "Manage your keys, set up 2FA, and learn how we protect your proprietary trading data."
  },
  {
    icon: <CreditCard size={24} />,
    title: "Billing & Pro",
    desc: "Information about subscription tiers, API limits, and managing your payment methods."
  }
];

const faqs = [
  "How accurate are the momentum signals?",
  "Can I export my swipe history to CSV?",
  "What exchanges are currently supported?",
  "How do I customize my neural ranking profile?",
  "Is there a developer API available?"
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <TopNav />
      <main className="main-content">
        <section className={styles.helpHero}>
          <div className={styles.perspectiveGrid} />
          <div className={styles.glowOrb} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
              fontFamily: "var(--font-mono)", 
              color: "var(--accent-blue)", 
              letterSpacing: "4px", 
              textTransform: "uppercase", 
              fontSize: "0.8rem", 
              marginBottom: "16px", 
              fontWeight: 700, 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              padding: "6px 16px", 
              border: "1px solid rgba(56,189,248,0.3)", 
              borderRadius: "100px", 
              background: "rgba(56,189,248,0.05)" 
            }}
          >
            <HelpCircle size={14} /> KNOWLEDGE BASE v2.4
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className={styles.mainTitle}>
              How can we <span className="text-gradient">help?</span>
            </h1>
          </motion.div>

          <motion.div 
            className={styles.searchContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, and more..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </section>

        <section className={styles.categoriesGrid}>
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              className={`${styles.categoryCard} glass-card`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.categoryIcon}>{cat.icon}</div>
              <h3 className={styles.categoryTitle}>{cat.title}</h3>
              <p className={styles.categoryDesc}>{cat.desc}</p>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", color: "var(--accent-purple)", fontWeight: 600, fontSize: "0.9rem" }}>
                Browse Articles <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </section>

        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                className={styles.faqItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className={styles.faqQuestion}>
                  <span>{faq}</span>
                  <ChevronRight size={18} className="text-secondary" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={styles.contactSection}>
          <motion.div 
            className={`${styles.contactBox} glass-panel`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className={styles.categoryIcon} style={{ background: "rgba(56, 189, 248, 0.1)", color: "var(--accent-blue)" }}>
              <MessageSquare size={28} />
            </div>
            <h2 className={styles.contactTitle}>Still have questions?</h2>
            <p className={styles.contactDesc}>Our neural support team is available 24/7 to assist you with any technical or account queries.</p>
            
            <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={18} /> Contact Support
              </button>
              <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <HelpCircle size={18} /> Live Chat
              </button>
            </div>
          </motion.div>
        </section>

        <footer style={{ padding: "60px 0", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Zap size={16} className="text-gradient" />
            <span style={{ fontWeight: 700, letterSpacing: "1px", color: "#fff" }}>APEX SWIPE</span>
          </div>
          <p>© 2026 Apex Trading Systems. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
