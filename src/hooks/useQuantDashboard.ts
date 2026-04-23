import { useCallback, useEffect, useState } from "react";
import type { QuantDashboardData } from "../components/dashboard/QuantDashboardCard";
import { fetchB3MarketData } from "../lib/marketData";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function normalizeSignal(score: number): QuantDashboardData["signal"] {
  if (score >= 55) return "COMPRA FORTE";
  if (score >= 20) return "COMPRA";
  if (score <= -55) return "VENDA FORTE";
  if (score <= -20) return "VENDA";
  return "NEUTRO";
}

function normalizeTrend(
  value: number
): QuantDashboardData["shortTrend"] {
  if (value >= 0.8) return "FORTE ALTISTA";
  if (value >= 0.2) return "ALTISTA";
  if (value <= -0.8) return "FORTE BAIXISTA";
  if (value <= -0.2) return "BAIXISTA";
  return "NEUTRO";
}

function buildB3QuantFromLiveData(payload: {
  last_price?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;
  volume?: number | null;
  last_trade_ts?: number | null;
}): QuantDashboardData {
  const last = Number(payload.last_price ?? 0);
  const open = Number(payload.open_price ?? last);
  const high = Number(payload.high_price ?? last);
  const low = Number(payload.low_price ?? last);
  const volume = Number(payload.volume ?? 0);

  const delta = last - open;
  const range = Math.max(high - low, 1);
  const pressure = last > 0 ? ((last - open) / last) * 100 : 0;

  const directionalStrength = Math.max(-1, Math.min(1, delta / range));
  const score = Math.max(-100, Math.min(100, directionalStrength * 100));

  const rsiApprox = Math.max(0, Math.min(100, 50 + directionalStrength * 35));
  const rocApprox = open > 0 ? ((last / open) - 1) * 100 : 0;
  const atrApprox = Math.abs(high - low);
  const relativeVolatilityApprox = open > 0 ? atrApprox / open : 0;

  // Mantemos simples para B3 snapshot:
  const relativeVolumeApprox = volume > 0 ? 1 : 0;

  return {
    score: Number(score.toFixed(2)),
    signal: normalizeSignal(score),
    shortTrend: normalizeTrend(directionalStrength),
    midTrend: normalizeTrend(directionalStrength * 0.8),
    roc: Number(rocApprox.toFixed(3)),
    rsi: Number(rsiApprox.toFixed(2)),
    pressure: Number(pressure.toFixed(3)),
    atr: Number(atrApprox.toFixed(6)),
    relativeVolatility: Number(relativeVolatilityApprox.toFixed(3)),
    relativeVolume: Number(relativeVolumeApprox.toFixed(2)),
    adx: Number(Math.min(50, Math.abs(directionalStrength) * 40).toFixed(2)),
    updatedAt: payload.last_trade_ts
      ? new Date(payload.last_trade_ts).toISOString()
      : new Date().toISOString(),
  };
}

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
    if (!enabled || !asset || !assetType || !timeframe) return;

    const upperAsset = asset.toUpperCase();
    const isB3Future =
      assetType === "future_br" &&
      (upperAsset === "WIN" || upperAsset === "WDO");

    try {
      setLoading(true);
      setError("");

      if (isB3Future) {
        try {
          const liveData = await fetchB3MarketData(upperAsset as "WIN" | "WDO");
          const mapped = buildB3QuantFromLiveData(liveData);
          setData(mapped);
          setError("");
        } catch (err: any) {
          const message =
            err?.message || `Falha ao buscar market data de ${upperAsset}`;

          // IMPORTANTE:
          // não apagamos o último snapshot bom do Quant
          // e não mexemos no SummaryTab/lateral
          if (message.includes("Ativo sem dados em memória")) {
            setError("");
          } else {
            setError(message);
          }
        }

        return;
      }

      if (!token) {
        throw new Error("Token ausente para carregar o Dashboard Quant.");
      }

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
        throw new Error(
          payload?.detail || "Erro ao carregar o Dashboard Quant."
        );
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
      setError("");
    } catch (err: any) {
      setData(null);
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