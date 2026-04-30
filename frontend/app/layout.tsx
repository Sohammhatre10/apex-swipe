import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ApexSwipe - Swipe Smarter. Invest Faster.",
  description: "Visually stunning, premium, futuristic stock discovery platform with a Tinder-like swipe experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${jetbrainsMono.variable}`}>
        <div className="background-elements">
          <div className="bg-gradient" />
          <div className="noise-overlay" />
          <div className="grid-overlay" />
        </div>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
