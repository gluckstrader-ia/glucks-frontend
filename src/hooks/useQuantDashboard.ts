import { useCallback, useEffect, useState } from "react";
import type {
  QuantDashboardData,
  SignalLabel,
  TrendLabel,
} from "../components/dashboard/QuantDashboardCard";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_URL_FUTUROS_BR =
  import.meta.env.VITE_API_URL_FUTUROS_BR || API_URL;

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

type UseQuantDashboardParams = {
  asset: string;
  assetType: string;
  timeframe: string;
  token?: string | null;
  enabled: boolean;
  b3Data?: B3Data | null;
  analysisData?: unknown | null;
};

const VALID_SIGNALS: SignalLabel[] = [
  "COMPRA FORTE",
  "COMPRA",
  "NEUTRO",
  "VENDA",
  "VENDA FORTE",
];

const VALID_TRENDS: TrendLabel[] = [
  "FORTE ALTISTA",
  "ALTISTA",
  "NEUTRO",
  "BAIXISTA",
  "FORTE BAIXISTA",
];

function requireFiniteNumber(payload: Record<string, unknown>, key: string): number {
  const value = Number(payload[key]);

  if (!Number.isFinite(value)) {
    throw new Error(`Dashboard Quant recebeu um valor inválido em \"${key}\".`);
  }

  return value;
}

function requireSignal(value: unknown): SignalLabel {
  const normalized = String(value ?? "").trim().toUpperCase() as SignalLabel;

  if (!VALID_SIGNALS.includes(normalized)) {
    throw new Error("Dashboard Quant recebeu um sinal inválido do backend.");
  }

  return normalized;
}

function requireTrend(value: unknown, fieldName: string): TrendLabel {
  const normalized = String(value ?? "").trim().toUpperCase() as TrendLabel;

  if (!VALID_TRENDS.includes(normalized)) {
    throw new Error(
      `Dashboard Quant recebeu uma tendência inválida em \"${fieldName}\".`
    );
  }

  return normalized;
}

function parseQuantPayload(payload: unknown): QuantDashboardData {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Dashboard Quant recebeu uma resposta inválida do backend.");
  }

  const record = payload as Record<string, unknown>;

  return {
    score: requireFiniteNumber(record, "score"),
    signal: requireSignal(record.signal),
    shortTrend: requireTrend(
      record.short_trend ?? record.shortTrend,
      "short_trend"
    ),
    midTrend: requireTrend(record.mid_trend ?? record.midTrend, "mid_trend"),
    roc: requireFiniteNumber(record, "roc"),
    rsi: requireFiniteNumber(record, "rsi"),
    pressure: requireFiniteNumber(record, "pressure"),
    atr: requireFiniteNumber(record, "atr"),
    relativeVolatility: requireFiniteNumber(
      {
        relativeVolatility:
          record.relative_volatility ?? record.relativeVolatility,
      },
      "relativeVolatility"
    ),
    relativeVolume: requireFiniteNumber(
      {
        relativeVolume: record.relative_volume ?? record.relativeVolume,
      },
      "relativeVolume"
    ),
    adx: requireFiniteNumber(record, "adx"),
    updatedAt:
      typeof record.updated_at === "string"
        ? record.updated_at
        : typeof record.updatedAt === "string"
          ? record.updatedAt
          : undefined,
  };
}

export function useQuantDashboard(params: UseQuantDashboardParams) {
  const {
    asset,
    assetType,
    timeframe,
    token,
    enabled,
    analysisData,
  } = params;

  const [data, setData] = useState<QuantDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuant = useCallback(async () => {
    if (!enabled || !asset || !assetType || !timeframe) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }

    if (!token) {
      setData(null);
      setError("Sessão inválida para carregar o Dashboard Quant.");
      setLoading(false);
      return;
    }

    const normalizedAsset = String(asset).trim().toUpperCase();
    const isLocalFutureBr =
      assetType === "future_br" &&
      (normalizedAsset === "WIN" || normalizedAsset === "WDO");

    // Regra especial e isolada para WIN/WDO.
    // Nenhum outro ativo muda de backend.
    const quantApiUrl = isLocalFutureBr ? API_URL_FUTUROS_BR : API_URL;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${quantApiUrl}/quant/live`, {
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

      let payload: unknown = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const detail =
          payload &&
          typeof payload === "object" &&
          !Array.isArray(payload) &&
          typeof (payload as Record<string, unknown>).detail === "string"
            ? String((payload as Record<string, unknown>).detail)
            : "Erro ao carregar o Dashboard Quant.";

        throw new Error(detail);
      }

      const parsed = parseQuantPayload(payload);

      setData(parsed);
      setError("");
    } catch (err: unknown) {
      setData(null);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar o Dashboard Quant."
      );
    } finally {
      setLoading(false);
    }
  }, [enabled, asset, assetType, timeframe, token]);

  useEffect(() => {
    void fetchQuant();
  }, [fetchQuant]);

  useEffect(() => {
    if (!analysisData) return;
    void fetchQuant();
  }, [analysisData, fetchQuant]);

  return {
    data,
    loading,
    error,
    refetch: fetchQuant,
  };
}
