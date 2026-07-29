import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeFuturesSnapshot } from "./types";

const DEFAULT_API_URL =
  import.meta.env.VITE_REALTIME_FUTURES_API ||
  "http://127.0.0.1:6011/api/realtime/futures";

export type RealtimeFuturesHookState = {
  data: RealtimeFuturesSnapshot | null;
  loading: boolean;
  error: string;
  connected: boolean;
  refetch: () => Promise<void>;
};

export function useRealtimeFutures(
  intervalMs = 5000,
): RealtimeFuturesHookState {
  const [data, setData] = useState<RealtimeFuturesSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const mountedRef = useRef(true);
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch(DEFAULT_API_URL, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API de futuros retornou HTTP ${response.status}`);
      }

      const payload = (await response.json()) as RealtimeFuturesSnapshot;
      if (!mountedRef.current) return;

      setData(payload);
      setError("");
      setConnected(true);
    } catch (cause) {
      if (controller.signal.aborted || !mountedRef.current) return;
      setConnected(false);
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível consultar a API de futuros.",
      );
      // O snapshot anterior é mantido para não substituir dados reais por valores fictícios.
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void load();

    const timer = window.setInterval(() => {
      void load();
    }, Math.max(intervalMs, 1000));

    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
      window.clearInterval(timer);
    };
  }, [intervalMs, load]);

  return {
    data,
    loading,
    error,
    connected,
    refetch: load,
  };
}
