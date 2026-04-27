import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export type QuantDashboardData = {
  score: number;
  signal: string;
  shortTrend: string;
  midTrend: string;
  roc: number;
  rsi: number;
  pressure: number;
  atr: number;
  relativeVolatility: number;
  relativeVolume: number;
  adx: number;
  updatedAt: string;
};

type B3Data = {
  last_price?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;
  close_price?: number | null;
  volume?: number | null;
  bid?: number | null;
  ask?: number | null;
  last_trade_ts?: number | string | null;
};

function buildB3Quant(data: B3Data): QuantDashboardData | null {
  const price = Number(data.last_price ?? 0);
  if (!price) return null;

  const open = Number(data.open_price ?? price);
  const high = Number(data.high_price ?? price);
  const low = Number(data.low_price ?? price);
  const close = Number(data.close_price ?? price);
  const volume = Number(data.volume ?? 0);

  const range = Math.max(high - low, 1);
  const body = close - open;
  const delta = price - open;

  const directional = Math.max(-1, Math.min(1, delta / range));
  const bodyForce = Math.max(-1, Math.min(1, body / range));

  const scoreRaw =
    directional * 70 +
    bodyForce * 20;

  const score = Math.max(-100, Math.min(100, scoreRaw));

  return {
    score,
    signal:
      score > 30 ? "COMPRA" :
      score < -30 ? "VENDA" :
      "NEUTRO",

    shortTrend:
      directional > 0.5 ? "FORTE ALTISTA" :
      directional > 0 ? "ALTISTA" :
      directional < -0.5 ? "FORTE BAIXISTA" :
      directional < 0 ? "BAIXISTA" :
      "NEUTRO",

    midTrend:
      directional > 0 ? "ALTISTA" :
      directional < 0 ? "BAIXISTA" :
      "NEUTRO",

    roc: open > 0 ? ((price / open) - 1) * 100 : 0,
    rsi: 50 + directional * 30,
    pressure: (price - open) / price * 100,
    atr: high - low,
    relativeVolatility: (high - low) / price,
    relativeVolume: volume > 0 ? volume / 1000 : 0,
    adx: Math.abs(directional) * 50,
    updatedAt: new Date().toISOString(),
  };
}

export function useQuantDashboard({
  asset,
  assetType,
  timeframe,
  token,
  enabled,
  b3Data,
}: {
  asset: string;
  assetType: string;
  timeframe: string;
  token?: string | null;
  enabled: boolean;
  b3Data?: B3Data | null;
}) {
  const [data, setData] = useState<QuantDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upperAsset = useMemo(() => asset.toUpperCase(), [asset]);

  const isB3 = useMemo(() => {
    return assetType === "future_br" && ["WIN", "WDO"].includes(upperAsset);
  }, [assetType, upperAsset]);

  // 🔥 Atualização automática B3
  useEffect(() => {
    if (!enabled || !isB3) return;
    if (!b3Data?.last_price) return;

    const quant = buildB3Quant(b3Data);

    if (quant) {
      setData(quant);
      setError("");
      setLoading(false);
    }
  }, [b3Data, isB3, enabled]);

  const fetchQuant = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError("");

      // 🔥 Se for WIN/WDO → usa B3
      if (isB3) {
        const quant = buildB3Quant(b3Data || {});
        if (quant) setData(quant);
        setLoading(false);
        return;
      }

      // 🔥 fluxo normal (não mexido)
      const res = await fetch(`${API_URL}/quant/live`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset,
          asset_type: assetType,
          timeframe,
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.detail);

      setData(json);
    } catch (e: any) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [asset, assetType, timeframe, token, enabled, isB3, b3Data]);

  useEffect(() => {
    fetchQuant();
  }, [fetchQuant]);

  return { data, loading, error, refetch: fetchQuant };
}