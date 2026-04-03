const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export type B3MarketData = {
  symbol: string;
  last_price?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;
  close_price?: number | null;
  volume?: number | null;
  bid?: number | null;
  ask?: number | null;
  last_trade_ts?: number | null;
  source?: string;
};

export async function fetchB3MarketData(symbol: "WIN" | "WDO"): Promise<B3MarketData> {
  const response = await fetch(`${API_URL}/internal/market-data/${symbol}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar market data de ${symbol}`);
  }

  const json = await response.json();
  return json.data as B3MarketData;
}