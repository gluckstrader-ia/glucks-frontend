import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeFuturesSnapshot } from "./types";

const LOCAL_API_URL =
  "http://127.0.0.1:6011/api/realtime/futures";

const ONLINE_API_URL =
  "https://glucks-realtime-futures-api.onrender.com/api/realtime/futures";

function resolveRealtimeApiUrl(): string {
  const configured = String(
    import.meta.env.VITE_REALTIME_FUTURES_API ?? "",
  ).trim();

  const hostname =
    typeof window !== "undefined"
      ? window.location.hostname.toLowerCase()
      : "";

  const browserIsLocal =
    hostname === "localhost" || hostname === "127.0.0.1";

  if (configured) {
    const configuredIsLocal =
      configured.includes("127.0.0.1") ||
      configured.toLowerCase().includes("localhost");

    // Evita que uma build de produção tente consultar o computador do usuário.
    if (!browserIsLocal && configuredIsLocal) {
      return ONLINE_API_URL;
    }

    return configured;
  }

  return browserIsLocal ? LOCAL_API_URL : ONLINE_API_URL;
}

export type RealtimeFuturesHookState = {
  data: RealtimeFuturesSnapshot | null;
  loading: boolean;
  error: string;
  connected: boolean;
  refetch: () => Promise<void>;
};

export function useRealtimeFutures(
  intervalMs = 5000,
  enabled = true,
): RealtimeFuturesHookState {
  const apiUrl = useMemo(resolveRealtimeApiUrl, []);
  const [data, setData] = useState<RealtimeFuturesSnapshot | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Fluxo ao vivo retornou HTTP ${response.status}`);
      }

      const payload = (await response.json()) as RealtimeFuturesSnapshot;
      if (!mountedRef.current) return;

      setData(payload);
      setError("");
    } catch (cause) {
      if (controller.signal.aborted || !mountedRef.current) return;

      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível consultar o fluxo ao vivo.",
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [apiUrl, enabled]);

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled) {
      requestRef.current?.abort();
      setLoading(false);
      setError("");
      return () => {
        mountedRef.current = false;
        requestRef.current?.abort();
      };
    }

    setLoading(true);
    void load();

    const timer = window.setInterval(() => {
      void load();
    }, Math.max(intervalMs, 1000));

    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
      window.clearInterval(timer);
    };
  }, [enabled, intervalMs, load]);

  return {
    data,
    loading,
    error,
    connected: Boolean(data?.instruments?.length) && !error,
    refetch: load,
  };
}
