import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LiveRoomResponse } from "../lib/liveRoomApi";
import LiveRoomChart from "../components/live-room/LiveRoomChart";
import { getStoredToken } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const MEET_LINK = "https://meet.google.com/wsf-ybnm-vhj";

const ASSETS = [
  {
    symbol: "EURUSD",
    label: "Euro/Dólar",
    market: "Forex",
    apiAsset: "EURUSD",
    apiType: "forex",
  },
  {
    symbol: "XAUUSD",
    label: "Ouro",
    market: "Commodities",
    apiAsset: "XAUUSD",
    apiType: "forex",
  },
] as const;

type LiveAssetConfig = (typeof ASSETS)[number];

function getAssetConfig(symbol: string): LiveAssetConfig {
  const upper = String(symbol || "").toUpperCase();

  return (
    ASSETS.find((item) => item.symbol === upper) ??
    ASSETS.find((item) => item.apiAsset === upper) ??
    ASSETS[0]
  );
}

function formatPrice(value: number | null | undefined) {
  if (value == null || Number.isNaN(Number(value))) return "-";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  }).format(Number(value));
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("pt-BR");
}

function signalLabel(signal: LiveRoomResponse["signal"]) {
  switch (signal) {
    case "buy":
      return "COMPRA";
    case "sell":
      return "VENDA";
    case "neutral":
      return "NEUTRO";
    case "wait":
    default:
      return "AGUARDAR";
  }
}

function signalClasses(signal: LiveRoomResponse["signal"]) {
  switch (signal) {
    case "buy":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
    case "sell":
      return "border-red-500/40 bg-red-500/10 text-red-300";
    case "neutral":
      return "border-yellow-500/40 bg-yellow-500/10 text-yellow-300";
    case "wait":
    default:
      return "border-zinc-500/40 bg-zinc-500/10 text-zinc-300";
  }
}

function normalizeDirectionToLive(direction?: string): LiveRoomResponse["signal"] {
  const value = String(direction || "").toUpperCase();

  if (["COMPRA", "BUY", "ALTA", "BULLISH"].includes(value)) return "buy";
  if (["VENDA", "SELL", "BAIXA", "BEARISH"].includes(value)) return "sell";
  if (["NEUTRO", "NEUTRAL"].includes(value)) return "neutral";

  return "wait";
}

function buildLiveRoomFromAnalyzeData(
  selectedAsset: string,
  payload: any
): LiveRoomResponse | null {
  if (!payload) return null;

  const finalSignal = payload?.final_signal ?? {};
  const direction = normalizeDirectionToLive(
    finalSignal?.direction ?? payload?.direction
  );

  const confidence = Number(
    finalSignal?.confidence ?? payload?.confidence ?? payload?.score ?? 50
  );

  const price = Number(
    finalSignal?.entry ??
      payload?.entry ??
      payload?.price ??
      payload?.close ??
      payload?.technical?.ema9 ??
      0
  );

  const entry = Number(finalSignal?.entry ?? payload?.entry ?? price);
  const stop = Number(finalSignal?.stop ?? payload?.stop ?? entry);
  const target1 = Number(finalSignal?.target ?? payload?.target ?? entry);

  const target2 =
    Number(payload?.scenarios?.buy?.targets?.[1]?.price) ||
    Number(payload?.scenarios?.sell?.targets?.[1]?.price) ||
    target1;

  const riskReward = Number(
    finalSignal?.risk_reward ?? payload?.risk_reward ?? 0
  );

  const trendLabel =
    payload?.technical?.trend_bias ??
    payload?.summary?.trend_label ??
    finalSignal?.direction ??
    "Neutro";

  return {
    asset: selectedAsset,
    signal: direction,
    confidence: Math.round(confidence),
    price,
    entry,
    stop,
    target_1: target1,
    target_2: target2,
    updated_at: new Date().toISOString(),
    market_regime: String(trendLabel),
    risk_reward: riskReward > 0 ? `1:${riskReward.toFixed(2)}` : "1:0.00",
    narration_text:
      finalSignal?.verdict ??
      payload?.summary?.text ??
      `${selectedAsset}: leitura ao vivo gerada pela IA.`,
    alerts: [],
    events: [],
    scenario_memory: {
      previous_signal: "neutral",
      current_signal: direction,
      evolution_label: "Leitura atualizada pela IA",
      confidence_delta: 0,
    },
    state_flags: {
      trend_up: direction === "buy",
      trend_down: direction === "sell",
      lateralized: direction === "neutral",
      above_vwap: direction === "buy",
      exhaustion: false,
    },
  } as unknown as LiveRoomResponse;
}

async function fetchAnalyzeFallback(
  selectedAsset: string,
  timeframe: string
): Promise<LiveRoomResponse> {
  const config = getAssetConfig(selectedAsset);
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      asset: config.apiAsset,
      asset_type: config.apiType,
      timeframe,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof payload?.detail === "string"
        ? payload.detail
        : "Erro ao gerar leitura pela IA."
    );
  }

  const mapped = buildLiveRoomFromAnalyzeData(selectedAsset, payload);

  if (!mapped) {
    throw new Error("A IA não retornou dados suficientes.");
  }

  return mapped;
}

export default function LiveRoomPage() {
  const navigate = useNavigate();

  const [asset, setAsset] = useState("EURUSD");
  const [data, setData] = useState<LiveRoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeframe = "5m";

  async function loadAnalysis(selectedAsset: string, silent = false) {
    try {
      if (!silent) setLoading(true);
      if (silent) setRefreshing(true);

      setError(null);

      const result = await fetchAnalyzeFallback(selectedAsset, timeframe);

      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar análise.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAnalysis(asset, false);

    const interval = window.setInterval(() => {
      loadAnalysis(asset, true);
    }, 15000);

    return () => window.clearInterval(interval);
  }, [asset]);

  const pageStatus = useMemo(() => {
    if (loading) return "Carregando Sala...";
    if (error) return "Erro na conexão";
    if (refreshing) return "Atualizando leitura...";

    return "Conectado em tempo real";
  }, [loading, error, refreshing]);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">

        {/* HERO LIVE */}
        <div className="mb-8 overflow-hidden rounded-[32px] border border-emerald-500/20 bg-black shadow-[0_0_80px_rgba(16,185,129,0.15)]">

          <div className="relative">

            <div className="absolute left-6 top-6 z-20 flex items-center gap-3 rounded-full border border-red-500/30 bg-black/60 px-5 py-3 backdrop-blur">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>

              <span className="text-sm font-black tracking-[0.2em] text-red-300">
                AO VIVO
              </span>
            </div>

            <div className="absolute right-6 top-6 z-20 rounded-full border border-emerald-500/20 bg-black/60 px-5 py-3 text-sm font-semibold text-emerald-300 backdrop-blur">
              {pageStatus}
            </div>

            <a
              href={MEET_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050816] via-transparent to-transparent"></div>

              <img
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=2070&auto=format&fit=crop"
                alt="Sala ao vivo"
                className="h-[700px] w-full object-cover opacity-40 transition duration-500 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">

                <div className="mb-6 text-7xl animate-pulse">
                  🔴
                </div>

                <h1 className="max-w-5xl text-4xl font-black leading-tight text-white sm:text-6xl">
                  ENTRAR NA SALA AO VIVO
                </h1>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-2xl">
                  Transmissão exclusiva da Gluck’s Trader IA com análises ao vivo,
                  operações, gerenciamento e leitura profissional do mercado.
                </p>

                <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-8 py-5 text-xl font-black text-emerald-300 transition group-hover:bg-emerald-500/20">
                  CLIQUE PARA ACESSAR A TRANSMISSÃO
                </div>

              </div>
            </a>

          </div>
        </div>

        {/* HEADER */}
        <div className="mb-6 rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-2 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Gluck’s Trader IA
              </div>

              <h1 className="text-2xl font-black sm:text-3xl">
                Sala Inteligente IA
              </h1>

              <p className="mt-2 max-w-3xl text-sm text-zinc-300 sm:text-base">
                Leitura contínua do mercado com atualização automática.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-emerald-500/40"
              >
                ← Dashboard
              </button>

              <button
                type="button"
                onClick={() => loadAnalysis(asset, false)}
                className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
              >
                Atualizar leitura
              </button>

            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

          {/* ESQUERDA */}
          <div className="space-y-6">

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    Gráfico ao Vivo
                  </h2>

                  <p className="text-sm text-zinc-400">
                    {asset} • {timeframe}
                  </p>
                </div>

                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  LIVE
                </div>
              </div>

              <LiveRoomChart asset={asset} timeframe={timeframe} />

            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <InfoCard
                title="Preço"
                value={data ? formatPrice(data.price) : "-"}
              />

              <InfoCard
                title="Confiança"
                value={data ? `${data.confidence}%` : "-"}
              />

              <InfoCard
                title="Entrada"
                value={data ? formatPrice(data.entry) : "-"}
              />

              <InfoCard
                title="Alvo"
                value={data ? formatPrice(data.target_1) : "-"}
              />

            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-xl font-black">
                  Leitura da IA
                </h2>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    data
                      ? signalClasses(data.signal)
                      : "border-zinc-700 bg-zinc-900 text-zinc-300"
                  }`}
                >
                  {data ? signalLabel(data.signal) : "AGUARDAR"}
                </span>

              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-zinc-200 leading-8">
                {loading && !data
                  ? "Carregando análise..."
                  : data?.narration_text || "-"}
              </div>

            </div>

          </div>

          {/* DIREITA */}
          <div className="space-y-6">

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl">

              <h2 className="mb-4 text-xl font-black">
                Ativos
              </h2>

              <div className="space-y-3">

                {ASSETS.map((item) => {
                  const active = asset === item.symbol;

                  return (
                    <button
                      key={item.symbol}
                      onClick={() => setAsset(item.symbol)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">

                        <div>
                          <div className="text-lg font-black">
                            {item.symbol}
                          </div>

                          <div className="text-sm text-zinc-400">
                            {item.label}
                          </div>
                        </div>

                        <div className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-200">
                          {active ? "ATIVO" : "ENTRAR"}
                        </div>

                      </div>
                    </button>
                  );
                })}

              </div>

            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl">

              <h2 className="mb-4 text-xl font-black">
                Operação
              </h2>

              <div className="space-y-4">

                <InfoCard
                  title="Stop"
                  value={data ? formatPrice(data.stop) : "-"}
                />

                <InfoCard
                  title="Alvo 2"
                  value={data ? formatPrice(data.target_2) : "-"}
                />

                <InfoCard
                  title="Regime"
                  value={data?.market_regime || "-"}
                />

                <InfoCard
                  title="Risco/Retorno"
                  value={data?.risk_reward || "-"}
                />

              </div>

            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl">

              <h2 className="mb-4 text-xl font-black">
                Última atualização
              </h2>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-zinc-300">
                {data ? formatDate(data.updated_at) : "-"}
              </div>

            </div>

          </div>

        </div>

        {error && (
          <div className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-400">
        {title}
      </div>

      <div className="mt-2 text-xl font-black text-white break-words">
        {value}
      </div>
    </div>
  );
}