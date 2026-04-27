import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLiveRoomVoice } from "../lib/liveRoomApi";
import type { LiveRoomResponse } from "../lib/liveRoomApi";
import LiveRoomChart from "../components/live-room/LiveRoomChart";
import { useB3MarketData } from "../hooks/useB3MarketData";
import { getStoredToken } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const ASSETS = [
  {
    symbol: "WIN",
    label: "Mini Índice",
    market: "Futuros BR",
    apiAsset: "WIN",
    apiType: "future_br",
  },
  {
    symbol: "WDO",
    label: "Mini Dólar",
    market: "Futuros BR",
    apiAsset: "WDO",
    apiType: "future_br",
  },
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
  {
    symbol: "BTCUSD",
    label: "Bitcoin",
    market: "Cripto",
    apiAsset: "BTCUSDT",
    apiType: "crypto",
  },
  {
    symbol: "NASDAQ",
    label: "Nasdaq",
    market: "Índices",
    apiAsset: "NDX",
    apiType: "index",
  },
  {
    symbol: "SPX",
    label: "S&P 500",
    market: "Índices",
    apiAsset: "SPX",
    apiType: "index",
  },
] as const;

type LiveAssetConfig = (typeof ASSETS)[number];

type B3Feed = {
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
  source?: string;
};

function getAssetConfig(symbol: string): LiveAssetConfig {
  const upper = String(symbol || "").toUpperCase();

  return (
    ASSETS.find((item) => item.symbol === upper) ??
    ASSETS.find((item) => item.apiAsset === upper) ??
    ASSETS[0]
  );
}

function isB3Symbol(symbol: string) {
  return ["WIN", "WDO"].includes(String(symbol || "").toUpperCase());
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

function sanitizeForSpeech(text: string): string {
  return text
    .replace(/RSI/gi, "R S I")
    .replace(/VWAP/gi, "V W A P")
    .replace(/WIN/gi, "uíni")
    .replace(/WDO/gi, "dólar futuro")
    .replace(/SPX/gi, "ésse pê xis")
    .replace(/BTC/gi, "bitcoin")
    .replace(/XAU/gi, "ouro")
    .replace(/tp/gi, "alvo ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function numberToPtSpeech(value: number | string | null | undefined, maxDecimals = 2): string {
  if (value == null) return "zero";

  const num = Number(value);
  if (Number.isNaN(num)) return "zero";

  const fixed = num.toFixed(maxDecimals);
  const [intPartRaw, decPartRaw] = fixed.split(".");
  const intPart = String(Number(intPartRaw));
  const decPart = decPartRaw?.replace(/0+$/, "");

  if (!decPart) return intPart;

  return `${intPart} vírgula ${decPart}`;
}

function priceToSpeech(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "zero";

  const abs = Math.abs(value);

  if (abs >= 1000) return numberToPtSpeech(value, 0);
  if (abs >= 1) return numberToPtSpeech(value, 2);

  return numberToPtSpeech(value, 5);
}

function percentToSpeech(value: number | string | null | undefined): string {
  if (value == null) return "zero por cento";

  const num = Number(value);
  if (Number.isNaN(num)) return "zero por cento";

  return `${numberToPtSpeech(num, 0)} por cento`;
}

function rrToSpeech(value: string | number | null | undefined): string {
  if (value == null) return "não definido";

  return String(value)
    .replace("1:", "um para ")
    .replace(":", " para ")
    .replace(".", " vírgula ");
}

function buildSpokenSummary(data: LiveRoomResponse): string {
  const confidence = percentToSpeech(data.confidence);
  const price = priceToSpeech(data.price);
  const entry = priceToSpeech(data.entry);
  const stop = priceToSpeech(data.stop);
  const target = priceToSpeech(data.target_1);
  const rr = rrToSpeech(data.risk_reward);

  const firstEvent = data.events?.[0] || "";
  const secondEvent = data.events?.[1] || "";

  if (data.signal === "buy") {
    return sanitizeForSpeech(
      `${data.asset}. Compra em observação. ` +
        `Confiança em ${confidence}. ` +
        `Preço atual em ${price}. ` +
        `Entrada na região de ${entry}. ` +
        `Stop em ${stop}. ` +
        `Alvo em ${target}. ` +
        `Risco retorno ${rr}. ` +
        `${firstEvent}. ${secondEvent}.`
    );
  }

  if (data.signal === "sell") {
    return sanitizeForSpeech(
      `${data.asset}. Venda em observação. ` +
        `Confiança em ${confidence}. ` +
        `Preço atual em ${price}. ` +
        `Entrada na região de ${entry}. ` +
        `Stop em ${stop}. ` +
        `Alvo em ${target}. ` +
        `Risco retorno ${rr}. ` +
        `${firstEvent}. ${secondEvent}.`
    );
  }

  if (data.signal === "neutral") {
    return sanitizeForSpeech(
      `${data.asset}. Mercado neutro no momento. ` +
        `Confiança em ${confidence}. ` +
        `Preço atual em ${price}. ` +
        `${firstEvent}.`
    );
  }

  return sanitizeForSpeech(
    `${data.asset}. Aguardar confirmação. ` +
      `Confiança em ${confidence}. ` +
      `Preço atual em ${price}. ` +
      `${firstEvent}.`
  );
}

function shouldSpeakUpdate(
  previous: LiveRoomResponse | null,
  next: LiveRoomResponse
) {
  if (!previous) return { shouldSpeak: true, reason: "primeira leitura" };

  if (previous.asset !== next.asset) {
    return { shouldSpeak: true, reason: "troca de ativo" };
  }

  if (previous.signal !== next.signal) {
    return { shouldSpeak: true, reason: "mudança de direção" };
  }

  if (Math.abs(previous.confidence - next.confidence) >= 8) {
    return { shouldSpeak: true, reason: "mudança relevante de confiança" };
  }

  const prevPrice = Number(previous.price || 0);
  const nextPrice = Number(next.price || 0);
  const priceMovePct =
    prevPrice > 0 ? Math.abs(((nextPrice - prevPrice) / prevPrice) * 100) : 0;

  if (priceMovePct >= 0.12) {
    return { shouldSpeak: true, reason: "movimento relevante de preço" };
  }

  const prevEvents = JSON.stringify(previous.events || []);
  const nextEvents = JSON.stringify(next.events || []);

  if (prevEvents !== nextEvents) {
    return { shouldSpeak: true, reason: "mudança de eventos" };
  }

  return { shouldSpeak: false, reason: "sem mudança relevante" };
}

function alertStyles(type: string) {
  switch (type) {
    case "entry_alert":
      return {
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
        iconWrap: "bg-emerald-500/10 text-emerald-300",
        title: "text-emerald-300",
      };
    case "stop_threat":
      return {
        badge: "bg-red-500/15 text-red-300 border-red-500/20",
        iconWrap: "bg-red-500/10 text-red-300",
        title: "text-red-300",
      };
    case "target_near":
      return {
        badge: "bg-lime-500/15 text-lime-300 border-lime-500/20",
        iconWrap: "bg-lime-500/10 text-lime-300",
        title: "text-lime-300",
      };
    case "direction_change":
      return {
        badge: "bg-sky-500/15 text-sky-300 border-sky-500/20",
        iconWrap: "bg-sky-500/10 text-sky-300",
        title: "text-sky-300",
      };
    case "strengthening":
      return {
        badge: "bg-violet-500/15 text-violet-300 border-violet-500/20",
        iconWrap: "bg-violet-500/10 text-violet-300",
        title: "text-violet-300",
      };
    case "weakening":
      return {
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/20",
        iconWrap: "bg-amber-500/10 text-amber-300",
        title: "text-amber-300",
      };
    default:
      return {
        badge: "bg-zinc-500/15 text-zinc-300 border-zinc-500/20",
        iconWrap: "bg-zinc-500/10 text-zinc-300",
        title: "text-zinc-200",
      };
  }
}

function alertIcon(type: string) {
  switch (type) {
    case "entry_alert":
      return "↗";
    case "stop_threat":
      return "🛑";
    case "target_near":
      return "◎";
    case "direction_change":
      return "⇄";
    case "strengthening":
      return "⚡";
    case "weakening":
      return "△";
    default:
      return "•";
  }
}

function eventToCompactItem(event: string) {
  const normalized = event.toLowerCase();

  if (normalized.includes("alvo")) {
    return {
      label: "Alvo próximo",
      value: "agora",
      color: "text-lime-300",
      badge: "bg-lime-500/15 text-lime-300 border-lime-500/20",
    };
  }

  if (normalized.includes("stop")) {
    return {
      label: "Stop ameaçado",
      value: "agora",
      color: "text-red-300",
      badge: "bg-red-500/15 text-red-300 border-red-500/20",
    };
  }

  if (normalized.includes("direção")) {
    return {
      label: "Direção atual",
      value: event.replace("Direção atual:", "").trim() || "-",
      color: "text-zinc-100",
      badge: "bg-zinc-500/15 text-zinc-200 border-zinc-500/20",
    };
  }

  if (normalized.includes("confiança")) {
    return {
      label: "Confiança",
      value: event.replace("Confiança atual:", "").trim() || "-",
      color: "text-violet-300",
      badge: "bg-violet-500/15 text-violet-300 border-violet-500/20",
    };
  }

  if (normalized.includes("confluência")) {
    return {
      label: "Confluência",
      value: event.replace("Confluência:", "").trim() || "-",
      color: "text-cyan-300",
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
    };
  }

  if (normalized.includes("preço")) {
    return {
      label: "Preço atual",
      value:
        event
          .replace("Preço atual:", "")
          .replace("Preço atual monitorado:", "")
          .trim() || "-",
      color: "text-amber-300",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    };
  }

  return {
    label: event,
    value: "info",
    color: "text-zinc-200",
    badge: "bg-zinc-500/15 text-zinc-300 border-zinc-500/20",
  };
}

function assetCardClasses(active: boolean) {
  return active
    ? "border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]"
    : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-950";
}

function buildB3LiveRoomData(
  asset: string,
  b3Feed: B3Feed | null | undefined
): LiveRoomResponse | null {
  const last =
    Number(b3Feed?.last_price) ||
    Number(b3Feed?.close_price) ||
    Number(b3Feed?.open_price) ||
    Number(b3Feed?.high_price) ||
    Number(b3Feed?.low_price) ||
    0;

  if (!last || Number.isNaN(last)) return null;

  const open = Number(b3Feed?.open_price ?? last);
  const high = Number(b3Feed?.high_price ?? last);
  const low = Number(b3Feed?.low_price ?? last);
  const volume = Number(b3Feed?.volume ?? 0);

  const direction: LiveRoomResponse["signal"] =
    last > open ? "buy" : last < open ? "sell" : "neutral";

  const confidence =
    last === open
      ? 54
      : Math.min(
          78,
          Math.max(
            52,
            Math.round((Math.abs(last - open) / Math.max(open, 1)) * 100000)
          )
        );

  const updatedAt = b3Feed?.last_trade_ts
    ? new Date(b3Feed.last_trade_ts).toISOString()
    : new Date().toISOString();

  const events = [
    `Preço atual monitorado: ${formatPrice(last)}`,
    `Confiança atual: ${confidence}%`,
    `Direção atual: ${signalLabel(direction)}`,
    `Volume observado: ${formatPrice(volume)}`,
  ];

  const alerts =
    direction === "buy"
      ? [
          {
            type: "strengthening",
            priority: 1,
            title: `${asset} sustentando força compradora`,
            message: `Preço em ${formatPrice(last)} acima da abertura ${formatPrice(open)}.`,
          },
        ]
      : direction === "sell"
      ? [
          {
            type: "weakening",
            priority: 1,
            title: `${asset} pressionando para baixo`,
            message: `Preço em ${formatPrice(last)} abaixo da abertura ${formatPrice(open)}.`,
          },
        ]
      : [
          {
            type: "direction_change",
            priority: 2,
            title: `${asset} em equilíbrio`,
            message: `Preço em ${formatPrice(last)} com leitura neutra no curto prazo.`,
          },
        ];

  return {
    asset,
    signal: direction,
    confidence,
    price: last,
    entry: last,
    stop: low || last,
    target_1: high || last,
    target_2: high || last,
    updated_at: updatedAt,
    market_regime: "Leitura ao vivo com fallback inteligente",
    risk_reward: "1:0.00",
    narration_text:
      direction === "buy"
        ? `${asset} com pressão compradora na leitura ao vivo. Preço atual em ${formatPrice(last)}.`
        : direction === "sell"
        ? `${asset} com pressão vendedora na leitura ao vivo. Preço atual em ${formatPrice(last)}.`
        : `${asset} em leitura neutra no fluxo ao vivo. Preço atual em ${formatPrice(last)}.`,
    alerts,
    events,
    scenario_memory: {
      previous_signal: "neutral",
      current_signal: direction,
      evolution_label:
        direction === "buy"
          ? "Fluxo fortaleceu o lado comprador"
          : direction === "sell"
          ? "Fluxo fortaleceu o lado vendedor"
          : "Sem deslocamento dominante",
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

  const justification = Array.isArray(finalSignal?.justification)
    ? finalSignal.justification
    : [];

  const events = [
    `Direção atual: ${signalLabel(direction)}`,
    `Confiança atual: ${Math.round(confidence)}%`,
    `Tendência: ${trendLabel}`,
    justification[0] ? `Confluência: ${justification[0]}` : "Leitura gerada pela IA",
  ];

  const alerts =
    direction === "buy"
      ? [
          {
            type: "entry_alert",
            priority: 2,
            title: `${selectedAsset} com viés comprador`,
            message: `A IA aponta compra com confiança de ${Math.round(confidence)}%.`,
          },
        ]
      : direction === "sell"
      ? [
          {
            type: "entry_alert",
            priority: 2,
            title: `${selectedAsset} com viés vendedor`,
            message: `A IA aponta venda com confiança de ${Math.round(confidence)}%.`,
          },
        ]
      : [
          {
            type: "direction_change",
            priority: 3,
            title: `${selectedAsset} sem direção dominante`,
            message: "A leitura atual está neutra ou aguardando confirmação.",
          },
        ];

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
      `${selectedAsset}: leitura ao vivo gerada pela IA. Direção: ${signalLabel(direction)}. Confiança: ${Math.round(confidence)}%.`,
    alerts,
    events,
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
    throw new Error("A IA não retornou dados suficientes para a sala ao vivo.");
  }

  return mapped;
}

export default function LiveRoomPage() {
  const navigate = useNavigate();

  const [asset, setAsset] = useState("WIN");
  const [data, setData] = useState<LiveRoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const [lastSpeechReason, setLastSpeechReason] = useState("Nenhuma fala ainda");

  const timeframe = "5m";

  const previousDataRef = useRef<LiveRoomResponse | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const speechJobRef = useRef(0);

  const isB3Asset = useMemo(() => isB3Symbol(asset), [asset]);
  const { data: b3Feed } = useB3MarketData(isB3Asset ? asset : "");

  async function loadAnalysis(selectedAsset: string, silent = false) {
  try {
    if (!silent) setLoading(true);
    if (silent) setRefreshing(true);

    setError(null);

    let result: LiveRoomResponse | null = null;

    // 🔥 1. SEMPRE tenta /analyze primeiro (igual Quant usa analysisData)
    try {
      result = await fetchAnalyzeFallback(selectedAsset, timeframe);
    } catch {
      result = null;
    }

    // ✅ 2. Se conseguiu analysisData → usa direto
    if (result) {
      setData((current) => {
        previousDataRef.current = current;
        return result;
      });

      setError(null);
      return;
    }

    // 🔥 3. Se for WIN/WDO → tenta B3 (igual Quant)
    if (isB3Symbol(selectedAsset)) {
      result = buildB3LiveRoomData(selectedAsset, b3Feed as B3Feed | null);
    }

    if (result) {
      setData((current) => {
        previousDataRef.current = current;
        return result;
      });

      setError(null);
      return;
    }

    throw new Error("Sem dados disponíveis para este ativo.");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao carregar análise ao vivo.";

    setError(message);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}

  function handleEnterRoom(nextAsset: string) {
    stopPremiumVoice();
    previousDataRef.current = null;
    setLastSpeechReason("Troca de ativo");
    setError(null);
    setRefreshing(false);
    setData(null);
    setLoading(true);

    setAsset(nextAsset);

    // 🔥 força execução imediata (igual dashboard)
    setTimeout(() => {
      loadAnalysis(nextAsset, false);
    }, 0);
  }

  function stopPremiumVoice() {
    speechJobRef.current += 1;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setVoiceBusy(false);
  }

  async function speakPremium(dataToSpeak: LiveRoomResponse, reason: string) {
    const spokenText = buildSpokenSummary(dataToSpeak);
    if (!spokenText) return;

    const jobId = speechJobRef.current + 1;
    speechJobRef.current = jobId;
    setVoiceBusy(true);

    try {
      const audioUrl = await fetchLiveRoomVoice(spokenText);

      if (jobId !== speechJobRef.current) {
        URL.revokeObjectURL(audioUrl);
        return;
      }

      stopPremiumVoice();

      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }

        audioRef.current = null;
        setVoiceBusy(false);
      };

      audio.onerror = () => {
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }

        audioRef.current = null;
        setVoiceBusy(false);
      };

      await audio.play();
      setLastSpeechReason(reason);
    } catch (err) {
      setVoiceBusy(false);
      console.error("Erro ao tocar voz premium:", err);
    }
  }

  useEffect(() => {
    loadAnalysis(asset, false);
  }, [asset]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadAnalysis(asset, true);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [asset, b3Feed]);

  useEffect(() => {
    if (!voiceEnabled || !data) return;

    const decision = shouldSpeakUpdate(previousDataRef.current, data);
    if (!decision.shouldSpeak) return;

    speakPremium(data, decision.reason);
  }, [data, voiceEnabled]);

  useEffect(() => {
    if (!voiceEnabled) {
      stopPremiumVoice();
    }
  }, [voiceEnabled]);

  useEffect(() => {
    stopPremiumVoice();
    previousDataRef.current = null;
    setLastSpeechReason("Troca de ativo");
  }, [asset]);

  useEffect(() => {
    return () => {
      stopPremiumVoice();
    };
  }, []);

  const pageStatus = useMemo(() => {
    if (loading) return "Carregando Sala ao Vivo IA...";
    if (error) return "Erro na conexão com a Sala ao Vivo IA";
    if (refreshing) return "Atualizando leitura em tempo real...";

    return isB3Asset
      ? "Conectado com fallback inteligente"
      : "Conectado em tempo real";
  }, [loading, error, refreshing, isB3Asset]);

  const topAlert = data?.alerts?.[0] || null;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-emerald-500/20 bg-white/5 p-5 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Gluck’s Trader IA
              </div>

              <h1 className="text-2xl font-black sm:text-3xl">
                Sala ao Vivo IA
              </h1>

              <p className="mt-2 max-w-3xl text-sm text-zinc-300 sm:text-base">
                Análise contínua do ativo com leitura de cenário, direção provável,
                entrada, stop, alvo e eventos recentes.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-emerald-500/40 hover:text-white"
              >
                ← Voltar ao Dashboard
              </button>

              <button
                type="button"
                onClick={() => loadAnalysis(asset, false)}
                className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 hover:text-white"
              >
                Atualizar leitura
              </button>

              <button
                type="button"
                onClick={() => setVoiceEnabled((prev) => !prev)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  voiceEnabled
                    ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                    : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-emerald-500/40 hover:text-white"
                }`}
              >
                {voiceEnabled ? "Desligar voz" : "Ligar voz premium"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-200">
              Sala ativa: <strong className="text-white">{asset}</strong>
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
              Timeframe: <strong className="text-white">{timeframe}</strong>
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
              Status: <strong className="text-white">{pageStatus}</strong>
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
              Voz:{" "}
              <strong className="text-white">
                {voiceEnabled ? "Premium ativa" : "Desativada"}
              </strong>
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
              Áudio:{" "}
              <strong className="text-white">
                {voiceBusy ? "Falando" : "Em espera"}
              </strong>
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300">
              Última fala:{" "}
              <strong className="text-white">{lastSpeechReason}</strong>
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Salas por ativo
              </h2>

              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                clique no card para iniciar
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {ASSETS.map((item) => {
                const active = asset === item.symbol;
                const currentSignal =
                  active && data ? signalLabel(data.signal) : "Sala pronta";
                const currentConfidence =
                  active && data ? `${data.confidence}%` : "--";

                return (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => handleEnterRoom(item.symbol)}
                    className={`group cursor-pointer rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:scale-[1.01] ${assetCardClasses(
                      active
                    )}`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-black text-white">
                          {item.symbol}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {item.label}
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                          active
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            : "border-zinc-700 bg-zinc-900 text-zinc-300 group-hover:border-emerald-500/30 group-hover:text-emerald-300"
                        }`}
                      >
                        {active ? "AO VIVO" : "INICIAR"}
                      </span>
                    </div>

                    <div className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
                      {item.market}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-zinc-300">
                        {currentSignal}
                      </span>

                      <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-zinc-200">
                        {currentConfidence}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {topAlert && (
          <div className="mb-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-white/5 to-emerald-500/5 p-5 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                    alertStyles(topAlert.type).iconWrap
                  }`}
                >
                  {alertIcon(topAlert.type)}
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Alerta principal
                  </div>

                  <h2
                    className={`text-xl font-black ${
                      alertStyles(topAlert.type).title
                    }`}
                  >
                    {topAlert.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {topAlert.message}
                  </p>
                </div>
              </div>

              <div
                className={`rounded-full border px-4 py-2 text-sm font-bold ${
                  alertStyles(topAlert.type).badge
                }`}
              >
                Prioridade {topAlert.priority}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-4 shadow-2xl backdrop-blur">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Gráfico ao vivo
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Acompanhamento visual do ativo com contexto para a leitura da IA.
                  </p>
                </div>

                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {asset} • {timeframe}
                </div>
              </div>

              <LiveRoomChart asset={asset} timeframe={timeframe} />
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Painel do ativo</h2>

                <span className="text-xs text-zinc-400">
                  Última atualização:{" "}
                  <strong className="text-zinc-200">
                    {data ? formatDate(data.updated_at) : "-"}
                  </strong>
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard title="Preço atual" value={data ? formatPrice(data.price) : "-"} />
                <InfoCard title="Confiança" value={data ? `${data.confidence}%` : "-"} />
                <InfoCard title="Regime" value={data?.market_regime || "-"} />
                <InfoCard title="Risco/Retorno" value={data?.risk_reward ?? "-"} />
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Leitura ao vivo</h2>

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

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 leading-7 text-zinc-200">
                {loading && !data
                  ? "Carregando análise da Sala ao Vivo IA..."
                  : data?.narration_text || "-"}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <h2 className="mb-4 text-lg font-bold">Operação sugerida</h2>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard title="Entrada" value={data ? formatPrice(data.entry) : "-"} />
                <InfoCard title="Stop" value={data ? formatPrice(data.stop) : "-"} />
                <InfoCard title="Alvo 1" value={data ? formatPrice(data.target_1) : "-"} />
                <InfoCard title="Alvo 2" value={data ? formatPrice(data.target_2) : "-"} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Alertas fortes</h2>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  prioridade
                </span>
              </div>

              <div className="space-y-3">
                {(data?.alerts ?? []).length > 0 ? (
                  data?.alerts?.map((alert, index) => {
                    const styles = alertStyles(alert.type);

                    return (
                      <div
                        key={`${alert.title}-${index}`}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${styles.iconWrap}`}
                          >
                            {alertIcon(alert.type)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className={`font-bold ${styles.title}`}>
                              {alert.title}
                            </div>

                            <p className="mt-1 text-sm leading-6 text-zinc-300">
                              {alert.message}
                            </p>
                          </div>

                          <span
                            className={`rounded-full border px-2 py-1 text-[11px] font-bold ${styles.badge}`}
                          >
                            P{alert.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
                    Nenhum alerta forte no momento.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <h2 className="mb-4 text-lg font-bold">Eventos recentes</h2>

              <div className="space-y-3">
                {(data?.events ?? []).length > 0 ? (
                  data?.events?.map((event, index) => {
                    const compact = eventToCompactItem(event);

                    return (
                      <div
                        key={`${event}-${index}`}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm text-zinc-400">
                              {compact.label}
                            </div>

                            <div className={`mt-1 font-bold ${compact.color}`}>
                              {compact.value}
                            </div>
                          </div>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${compact.badge}`}
                          >
                            evento
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
                    Nenhum evento recente.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <h2 className="mb-4 text-lg font-bold">Memória do cenário</h2>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="text-sm text-zinc-400">Evolução</div>

                <div className="mt-2 text-lg font-bold text-white">
                  {data?.scenario_memory?.evolution_label ?? "-"}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <InfoCard
                    title="Sinal anterior"
                    value={
                      data?.scenario_memory?.previous_signal
                        ? signalLabel(data.scenario_memory.previous_signal)
                        : "-"
                    }
                  />

                  <InfoCard
                    title="Sinal atual"
                    value={
                      data?.scenario_memory?.current_signal
                        ? signalLabel(data.scenario_memory.current_signal)
                        : "-"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <h2 className="mb-4 text-lg font-bold">Flags do mercado</h2>

              <div className="grid grid-cols-2 gap-3">
                <Flag label="Tendência alta" active={!!data?.state_flags?.trend_up} />
                <Flag label="Tendência baixa" active={!!data?.state_flags?.trend_down} />
                <Flag label="Lateralizado" active={!!data?.state_flags?.lateralized} />
                <Flag label="Acima VWAP" active={!!data?.state_flags?.above_vwap} />
                <Flag label="Exaustão" active={!!data?.state_flags?.exhaustion} />
              </div>
            </div>
          </div>
        </div>
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

      <div className="mt-2 text-lg font-black text-white break-words">
        {value}
      </div>
    </div>
  );
}

function Flag({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3 text-sm ${
        active
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-zinc-800 bg-zinc-950/70 text-zinc-500"
      }`}
    >
      {active ? "●" : "○"} {label}
    </div>
  );
}