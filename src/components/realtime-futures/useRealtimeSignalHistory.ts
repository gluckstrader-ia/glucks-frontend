import { useCallback, useEffect, useRef, useState } from "react";
import type {
  SignalHistoryResponse,
  SignalStatsResponse,
} from "./types";

const DEFAULT_API_URL =
  import.meta.env.VITE_REALTIME_FUTURES_API ||
  "http://127.0.0.1:6011/api/realtime/futures";

type SignalHistoryState = {
  history: SignalHistoryResponse | null;
  stats: SignalStatsResponse | null;
  loading: boolean;
  error: string;
};

export function useRealtimeSignalHistory(
  intervalMs = 15000,
): SignalHistoryState {
  const [history, setHistory] = useState<SignalHistoryResponse | null>(null);
  const [stats, setStats] = useState<SignalStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const [historyResponse, statsResponse] = await Promise.all([
        fetch(`${DEFAULT_API_URL}/signals?limit=12`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
          cache: "no-store",
        }),
        fetch(`${DEFAULT_API_URL}/signals/stats?hours=24`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
          cache: "no-store",
        }),
      ]);

      if (!historyResponse.ok || !statsResponse.ok) {
        throw new Error("Não foi possível consultar a auditoria de sinais.");
      }

      const [historyPayload, statsPayload] = await Promise.all([
        historyResponse.json() as Promise<SignalHistoryResponse>,
        statsResponse.json() as Promise<SignalStatsResponse>,
      ]);

      if (!mountedRef.current) return;
      setHistory(historyPayload);
      setStats(statsPayload);
      setError("");
    } catch (cause) {
      if (controller.signal.aborted || !mountedRef.current) return;
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível consultar a auditoria de sinais.",
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void load();

    const timer = window.setInterval(() => {
      void load();
    }, Math.max(intervalMs, 5000));

    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
      window.clearInterval(timer);
    };
  }, [intervalMs, load]);

  return { history, stats, loading, error };
}
