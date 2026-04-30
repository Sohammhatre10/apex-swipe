export type PricePoint = {
  date: string;
  close: number;
};

export type Stock = {
  ticker: string;
  name: string;
  sector?: string;
  industry?: string;
  logo_url?: string;
  metrics: {
    market_cap?: number;
    pe_ratio?: number;
    dividend_yield?: number;
    week_52_high?: number;
    week_52_low?: number;
    volatility?: number;
    momentum_score?: number;
  };
  price_history: PricePoint[];
  tags: string[];
};
