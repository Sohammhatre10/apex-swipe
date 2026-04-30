"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import styles from "./TopNav.module.css";

export default function TopNav() {
  return (
    <header className={styles.navHeader}>
      <div className={styles.navContainer}>
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
  );
}
