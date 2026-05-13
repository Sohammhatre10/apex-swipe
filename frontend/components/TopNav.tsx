"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useState } from "react";
import styles from "./TopNav.module.css";

const menuItems = [
  { label: "Account holder", href: "/profile" },
  { label: "About us", href: "/about" },
  { label: "Help Desk", href: "/help" },
];

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.navHeader}>
        <div className={styles.navContainer}>
          <button
            className={styles.hamburgerButton}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>A</div>
            ApexSwipe
          </Link>

          <Link href="/search" className={styles.searchBar}>
            <Search className={styles.searchIcon} size={16} />
            <span>Search stocks, sectors, symbols</span>
          </Link>

          <Link href="/profile" className={styles.profileLink}>
            S
          </Link>
        </div>
      </header>

      <div
        className={`${styles.sidebarOverlay} ${menuOpen ? styles.open : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitle}>Menu</div>
          <button
            className={styles.closeButton}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={styles.sidebarLink}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
