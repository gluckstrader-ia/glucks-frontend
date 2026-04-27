import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  QuantDashboardData,
  SignalLabel,
  TrendLabel,
} from "../components/dashboard/QuantDashboardCard";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type B3Data = {
  symbol?: string;
  last_price?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;
  close_price?: number | null;
  volume?: number | null;
  bid?: number | null;
  ask?: number | null;
  last_trade_ts?: number | string | null;
  source?: string | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getSignal(score: number): SignalLabel {
  if (score >= 55) return "COMPRA FORTE";
  if (score >= 20) return "COMPRA";
  if (score <= -55) return "VENDA FORTE";
  if (score <= -20) return "VENDA";
  return "NEUTRO";
}

function getTrend(value: number): TrendLabel {
  if (value >= 0.8) return "FORTE ALTISTA";
  if (value >= 0.2) return "ALTISTA";
  if (value <= -0.8) return "FORTE BAIXISTA";
  if (value <= -0.2) return "BAIXISTA";
  return "NEUTRO";
}

function normalizeDate(value?: number | string | null): string {
  if (!value) return new Date().toISOString();

  if (typeof value === "number") {
    const timestamp = value > 10_000_000_000 ? value : value * 1000;
    return new Date(timestamp).toISOString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();

  return parsed.toISOString();
}

function buildB3Quant(data: B3Data): QuantDashboardData | null {
  const price =
    Number(data.last_price) ||
    Number(data.close_price) ||
    Number(data.open_price) ||
    Number(data.high_price) ||
    Number(data.low_price) ||
    0;

  if (!price || Number.isNaN(price)) return null;

  const open = Number(data.open_price ?? price);
  const high = Number(data.high_price ?? price);
  const low = Number(data.low_price ?? price);
  const close = Number(data.close_price ?? price);
  const volume = Number(data.volume ?? 0);
  const bid = Number(data.bid ?? 0);
  const ask = Number(data.ask ?? 0);

  const range = Math.max(Math.abs(high - low), 1);
  const delta = price - open;
  const body = close - open;

  const directional = clamp(delta / range, -1, 1);
  const bodyForce = clamp(body / range, -1, 1);

  let bidAskPressure = 0;

  if (bid > 0 && ask > 0 && ask >= bid) {
    const spread = Math.max(ask - bid, 1);
    bidAskPressure = clamp((price - bid) / spread - 0.5, -0.15, 0.15);
  }

  const rawScore = directional * 70 + bodyForce * 20 + bidAskPressure * 100;
  const score = clamp(rawScore, -100, 100);

  return {
    score: Number(score.toFixed(2)),
    signal: getSignal(score),
    shortTrend: getTrend(directional),
    midTrend: getTrend(directional * 0.8),
    roc: Number((open > 0 ? ((price / open) - 1) * 100 : 0).toFixed(3)),
    rsi: Number(clamp(50 + directional * 35, 0, 100).toFixed(2)),
    pressure: Number((price > 0 ? ((price - open) / price) * 100 : 0).toFixed(3)),
    atr: Number(Math.abs(high - low).toFixed(6)),
    relativeVolatility: Number(
      (price > 0 ? Math.abs(high - low) / price : 0).toFixed(4)
    ),
    relativeVolume: Number((volume > 0 ? volume / 1000 : 0).toFixed(2)),
    adx: Number(clamp(Math.abs(directional) * 50, 0, 50).toFixed(2)),
    updatedAt: normalizeDate(data.last_trade_ts),
  };
}

function buildQuantFromAnalysisData(analysisData: any): QuantDashboardData | null {
  if (!analysisData) return null;

  const finalSignal = analysisData?.final_signal ?? {};
  const technical = analysisData?.technical ?? {};
  const probabilistic = analysisData?.probabilistic ?? {};
  const historical = probabilistic?.historical ?? {};

  const confidence = Number(
    finalSignal?.confidence ??
      analysisData?.confidence ??
      technical?.score ??
      analysisData?.score ??
      0
  );

  const direction = String(
    finalSignal?.direction ?? analysisData?.direction ?? "NEUTRO"
  ).toUpperCase();

  const signedScore =
    direction === "COMPRA"
      ? confidence
      : direction === "VENDA"
      ? -confidence
      : 0;

  const score = clamp(signedScore, -100, 100);

  const trendRaw = String(
    technical?.trend_bias ??
      analysisData?.summary?.trend_label ??
      direction
  ).toUpperCase();

  const trendValue =
    trendRaw.includes("ALTA") || trendRaw.includes("COMPRA")
      ? 0.45
      : trendRaw.includes("BAIXA") || trendRaw.includes("VENDA")
      ? -0.45
      : 0;

  return {
    score: Number(score.toFixed(2)),
    signal: getSignal(score),
    shortTrend: getTrend(trendValue),
    midTrend: getTrend(trendValue * 0.8),
    roc: Number(historical?.return_pct ?? 0),
    rsi: Number(technical?.rsi ?? 50),
    pressure: Number(confidence ?? 0),
    atr: Number(analysisData?.atr ?? 0),
    relativeVolatility: Number(historical?.volatility_pct ?? 0),
    relativeVolume: Number(analysisData?.volume_relative ?? 0),
    adx: Number(analysisData?.adx ?? confidence ?? 0),
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
  analysisData,
}: {
  asset: string;
  assetType: string;
  timeframe: string;
  token?: string | null;
  enabled: boolean;
  b3Data?: B3Data | null;
  analysisData?: any | null;
}) {
  const [data, setData] = useState<QuantDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upperAsset = useMemo(
    () => String(asset || "").trim().toUpperCase(),
    [asset]
  );

  const isB3Future = useMemo(() => {
    return assetType === "future_br" && ["WIN", "WDO"].includes(upperAsset);
  }, [assetType, upperAsset]);

  const applyB3Quant = useCallback(() => {
    const quant = buildB3Quant(b3Data ?? {});

    if (quant) {
      setData(quant);
      setError("");
      setLoading(false);
      return true;
    }

    setLoading(false);
    setError("");
    return false;
  }, [b3Data]);

  const fetchQuant = useCallback(async () => {
    if (!enabled || !asset || !assetType || !timeframe) return;

    try {
      setLoading(true);
      setError("");

      const fromAnalysis = buildQuantFromAnalysisData(analysisData);

      if (fromAnalysis) {
        setData(fromAnalysis);
        setError("");
        setLoading(false);
        return;
      }

      if (isB3Future) {
        applyB3Quant();
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
        throw new Error(payload?.detail || "Erro ao carregar o Dashboard Quant.");
      }

      setData({
        score: Number(payload.score ?? 0),
        signal: (payload.signal ?? "NEUTRO") as SignalLabel,
        shortTrend: (payload.short_trend ?? payload.shortTrend ?? "NEUTRO") as TrendLabel,
        midTrend: (payload.mid_trend ?? payload.midTrend ?? "NEUTRO") as TrendLabel,
        roc: Number(payload.roc ?? 0),
        rsi: Number(payload.rsi ?? 0),
        pressure: Number(payload.pressure ?? 0),
        atr: Number(payload.atr ?? 0),
        relativeVolatility: Number(
          payload.relative_volatility ?? payload.relativeVolatility ?? 0
        ),
        relativeVolume: Number(
          payload.relative_volume ?? payload.relativeVolume ?? 0
        ),
        adx: Number(payload.adx ?? 0),
        updatedAt: payload.updated_at ?? payload.updatedAt ?? new Date().toISOString(),
      });

      setError("");
    } catch (err: any) {
      setData(null);
      setError(err?.message || "Erro ao carregar o Dashboard Quant.");
    } finally {
      setLoading(false);
    }
  }, [
    enabled,
    asset,
    assetType,
    timeframe,
    token,
    isB3Future,
    applyB3Quant,
    analysisData,
  ]);

  useEffect(() => {
    fetchQuant();
  }, [fetchQuant]);

  useEffect(() => {
    if (!enabled || !isB3Future) return;

    const fromAnalysis = buildQuantFromAnalysisData(analysisData);

    if (fromAnalysis) {
      setData(fromAnalysis);
      setError("");
      setLoading(false);
      return;
    }

    if (!b3Data) return;

    applyB3Quant();
  }, [enabled, isB3Future, b3Data, analysisData, applyB3Quant]);

  return {
    data,
    loading,
    error,
    refetch: fetchQuant,
  };
}