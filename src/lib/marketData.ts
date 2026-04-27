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

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = String(value)
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeB3MarketData(symbol: "WIN" | "WDO", raw: any): B3MarketData {
  const payload = raw?.data ?? raw;

  return {
    symbol: String(payload?.symbol ?? symbol).toUpperCase(),

    last_price:
      toNumber(payload?.last_price) ??
      toNumber(payload?.last) ??
      toNumber(payload?.price) ??
      toNumber(payload?.ultimo) ??
      toNumber(payload?.último) ??
      null,

    open_price:
      toNumber(payload?.open_price) ??
      toNumber(payload?.open) ??
      toNumber(payload?.abertura) ??
      null,

    high_price:
      toNumber(payload?.high_price) ??
      toNumber(payload?.high) ??
      toNumber(payload?.maxima) ??
      toNumber(payload?.máxima) ??
      null,

    low_price:
      toNumber(payload?.low_price) ??
      toNumber(payload?.low) ??
      toNumber(payload?.minima) ??
      toNumber(payload?.mínima) ??
      null,

    close_price:
      toNumber(payload?.close_price) ??
      toNumber(payload?.close) ??
      toNumber(payload?.fechamento) ??
      null,

    volume:
      toNumber(payload?.volume) ??
      toNumber(payload?.vol) ??
      null,

    bid:
      toNumber(payload?.bid) ??
      toNumber(payload?.compra) ??
      null,

    ask:
      toNumber(payload?.ask) ??
      toNumber(payload?.venda) ??
      null,

    last_trade_ts:
      toNumber(payload?.last_trade_ts) ??
      toNumber(payload?.timestamp) ??
      null,

    source: payload?.source ?? "B3/Nelogica",
  };
}

export async function fetchB3MarketData(
  symbol: "WIN" | "WDO"
): Promise<B3MarketData> {
  const response = await fetch(`${API_URL}/internal/market-data/${symbol}`, {
    credentials: "include",
  });

  if (!response.ok) {
    let detail = `Falha ao buscar market data de ${symbol}`;

    try {
      const errorJson = await response.json();
      detail = errorJson?.detail || detail;
    } catch {
      // mantém a mensagem padrão
    }

    throw new Error(detail);
  }

  const json = await response.json();
  const normalized = normalizeB3MarketData(symbol, json);

  console.log("[B3 MARKET DATA NORMALIZADO]", normalized);

  return normalized;
}