import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  SignalPerformanceResponse,
  SignalSettingsResponse,
} from "./types";

const DEFAULT_API_URL =
  import.meta.env.VITE_REALTIME_FUTURES_API ||
  "http://127.0.0.1:6011/api/realtime/futures";

export type PerformanceFilters = {
  days: number;
  symbol: "ALL" | "WINFUT" | "WDOFUT";
  signal: "ALL" | "COMPRA" | "VENDA";
};

type State = {
  performance: SignalPerformanceResponse | null;
  settings: SignalSettingsResponse | null;
  loading: boolean;
  error: string;
  reload: () => void;
  exportUrl: string;
};

function buildQuery(filters: PerformanceFilters) {
  const params = new URLSearchParams({ days: String(filters.days) });
  if (filters.symbol !== "ALL") params.set("symbol", filters.symbol);
  if (filters.signal !== "ALL") params.set("signal", filters.signal);
  return params.toString();
}

export function useRealtimePerformance(
  filters: PerformanceFilters,
  intervalMs = 30000,
): State {
  const [performance, setPerformance] =
    useState<SignalPerformanceResponse | null>(null);
  const [settings, setSettings] = useState<SignalSettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const mountedRef = useRef(true);
  const requestRef = useRef<AbortController | null>(null);
  const query = useMemo(() => buildQuery(filters), [filters]);

  const load = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const [performanceResponse, settingsResponse] = await Promise.all([
        fetch(`${DEFAULT_API_URL}/signals/performance?${query}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
          cache: "no-store",
        }),
        fetch(`${DEFAULT_API_URL}/settings`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
          cache: "no-store",
        }),
      ]);
      if (!performanceResponse.ok || !settingsResponse.ok) {
        throw new Error("Não foi possível consultar o desempenho do motor.");
      }
      const [performancePayload, settingsPayload] = await Promise.all([
        performanceResponse.json() as Promise<SignalPerformanceResponse>,
        settingsResponse.json() as Promise<SignalSettingsResponse>,
      ]);
      if (!mountedRef.current) return;
      setPerformance(performancePayload);
      setSettings(settingsPayload);
      setError("");
    } catch (cause) {
      if (controller.signal.aborted || !mountedRef.current) return;
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível consultar o desempenho do motor.",
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [query, revision]);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    void load();
    const timer = window.setInterval(() => void load(), Math.max(intervalMs, 10000));
    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
      window.clearInterval(timer);
    };
  }, [intervalMs, load]);

  return {
    performance,
    settings,
    loading,
    error,
    reload: () => setRevision((value) => value + 1),
    exportUrl: `${DEFAULT_API_URL}/signals/export.csv?${query}`,
  };
}
