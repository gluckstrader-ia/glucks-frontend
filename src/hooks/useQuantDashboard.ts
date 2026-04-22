import { useCallback, useEffect, useState } from "react";
import type { QuantDashboardData } from "../components/dashboard/QuantDashboardCard";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export function useQuantDashboard({
  asset,
  assetType,
  timeframe,
  token,
  enabled,
}: {
  asset: string;
  assetType: string;
  timeframe: string;
  token?: string | null;
  enabled: boolean;
}) {
  const [data, setData] = useState<QuantDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuant = useCallback(async () => {
    if (!enabled || !token || !asset || !assetType || !timeframe) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/quant/live`, {
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

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.detail || "Erro ao carregar o Dashboard Quant.");
      }

      setData({
        score: Number(payload.score ?? 0),
        signal: payload.signal ?? "NEUTRO",
        shortTrend: payload.short_trend ?? "NEUTRO",
        midTrend: payload.mid_trend ?? "NEUTRO",
        roc: Number(payload.roc ?? 0),
        rsi: Number(payload.rsi ?? 0),
        pressure: Number(payload.pressure ?? 0),
        atr: Number(payload.atr ?? 0),
        relativeVolatility: Number(payload.relative_volatility ?? 0),
        relativeVolume: Number(payload.relative_volume ?? 0),
        adx: Number(payload.adx ?? 0),
        updatedAt: payload.updated_at,
      });
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar o Dashboard Quant.");
    } finally {
      setLoading(false);
    }
  }, [enabled, token, asset, assetType, timeframe]);

  useEffect(() => {
    fetchQuant();
  }, [fetchQuant]);

  return {
    data,
    loading,
    error,
    refetch: fetchQuant,
  };
}