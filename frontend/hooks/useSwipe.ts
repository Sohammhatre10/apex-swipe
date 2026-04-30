"use client";

import { api } from "@/lib/api";

export async function sendSwipe(ticker: string, direction: "left" | "right" | "super") {
  await api.post("/swipes", { ticker, direction });
}
