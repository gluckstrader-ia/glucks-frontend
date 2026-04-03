import { useEffect, useState } from "react";
import { fetchB3MarketData, B3MarketData } from "../lib/marketData";

export function useB3MarketData(asset: string) {
  const [data, setData] = useState<B3MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upper = asset.toUpperCase();
  const isB3Future = upper === "WIN" || upper === "WDO";

  useEffect(() => {
    if (!isB3Future) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchB3MarketData(upper as "WIN" | "WDO");
        if (!cancelled) {
          setData(result);
          setError(null);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Erro ao carregar market data");
          setLoading(false);
        }
      }
    };

    load();
    const intervalId = window.setInterval(load, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [upper, isB3Future]);

  return { data, loading, error, isB3Future };
}