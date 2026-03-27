import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BrainCircuit, BarChart3 } from "lucide-react";
import { clearAuth, getStoredToken, getStoredUser } from "../lib/auth";

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = getStoredToken();
  const user = getStoredUser();

type AnalysisModules = {
  technical?: number;
  smc?: number;
  harmonic?: number;
  wegd?: number;
  probabilistic?: number;
  timing?: number;
};

type AnalysisData = {
  asset?: string;
  asset_type?: string;
  timeframe?: string;
  direction?: string;
  score?: number;
  confidence?: number;
  entry?: number;
  stop?: number;
  target?: number;
  risk_reward?: number;
  modules?: AnalysisModules;

  technical?: {
    score?: number;
    buy_signals?: number;
    sell_signals?: number;
    neutral_signals?: number;
    trend_bias?: string;
    ema_trend?: string;
    rsi?: number;
    ema9?: number;
    ema21?: number;
    supports?: number[];
    resistances?: number[];
  };

  harmonics?: {
    patterns?: {
      name?: string;
      direction?: string;
      confidence?: number;
      bullish?: boolean;
      icon?: string;
      ratios?: {
        key?: string;
        value?: string;
        expected?: string;
        ok?: boolean;
      }[];
      prz?: number[];
      targets?: number[];
      stop?: number;
    }[];
    fib_levels?: {
      level?: string;
      price?: number;
      type?: string;
    }[];
  };

  smc?: {
    bias?: string;
    structure_label?: string;
    last_bos?: number;
    context?: {
      candles?: number;
      bias?: string;
    };
    structure?: {
      candles?: number;
      bias?: string;
    };
    trigger?: {
      candles?: number;
      bias?: string;
    };
    divergence?: string;
    order_blocks?: {
      title?: string;
      price?: string;
      desc?: string;
      strength?: string;
      bullish?: boolean;
    }[];
    fvgs?: {
      title?: string;
      zone?: string;
      state?: string;
      bullish?: boolean;
    }[];
    liquidity?: {
      price?: number;
      desc?: string;
      tag?: string;
    }[];
    structure_breaks?: {
      title?: string;
      price?: number;
      desc?: string;
      bullish?: boolean;
    }[];
    summary?: string;
  };
  wegd?: {
    bias?: string;
    confluence?: string;
    summary?: string;
    wyckoff?: {
      phase?: string;
      progress?: number;
      confidence?: number;
      next_phase?: string;
      composite_man?: string;
      events_confirmed?: {
        name?: string;
        desc?: string;
        price?: number;
      }[];
      events_pending?: {
        name?: string;
        desc?: string;
        price?: number;
      }[];
      volume_state?: string;
      volume_label?: string;
    };
    elliott?: {
      current_wave?: string;
      mode?: string;
      progress?: number;
      confidence?: number;
      next_wave?: string;
      invalidation?: number;
      wave_points?: {
        label?: string;
        price?: number;
        type?: string;
      }[];
    };
    gann?: {
      dominant_angle?: string;
      support_angles?: {
        angle?: string;
        price?: number;
      }[];
      resistance_angles?: {
        angle?: string;
        price?: number;
      }[];
      current_cycle_days?: number;
      next_reversal?: string;
      days_in_cycle?: number;
      price_square_levels?: {
        price?: number;
        strength?: string;
      }[];
    };
    dow?: {
      primary?: string;
      secondary?: string;
      minor?: string;
      market_phase?: string;
      market_phase_score?: number;
      price_volume_confirmation?: string;
      indices_confirmation?: string;
      volume_note?: string;
    };
  };

  probabilistic?: {
    win_rate_general?: number;
    win_rate_long?: number;
    win_rate_short?: number;
    historical?: {
      periods?: number;
      return_pct?: number;
      volatility_pct?: number;
      sharpe?: number;
      max_drawdown_pct?: number;
    };
    monte_carlo?: {
      confidence_level?: number;
      low?: number;
      mid?: number;
      high?: number;
    };
    scenarios?: {
      bullish?: number;
      neutral?: number;
      bearish?: number;
    };
    seasonality?: {
      month?: string;
      value?: number;
    }[];
    risk_metrics?: {
      var_95?: number;
      expected_shortfall?: number;
      beta?: number;
      correlation?: number;
    };
  };

  timing?: {
    market_name?: string;
    timezone?: string;
    status?: string;
    best_window_label?: string;
    notes?: string;
    recommended_windows?: {
      start?: string;
      end?: string;
      reason?: string;
    }[];
    avoid_windows?: {
      start?: string;
      end?: string;
      reason?: string;
    }[];
  };

  final_signal?: {
    direction?: string;
    strength?: string;
    confidence?: number;
    entry?: number;
    stop?: number;
    target?: number;
    risk_reward?: number;
    confluence_score?: number;
    justification?: string[];
    verdict?: string;
  };

};


function getPriceDecimals(assetType?: string, n?: number) {
  const value = Number(n ?? 0);

  if (assetType === "forex") return 5;

  if (assetType === "crypto") {
    if (Math.abs(value) < 1) return 6;
    if (Math.abs(value) < 100) return 4;
    return 2;
  }

  return 2;
}

function formatPrice(n?: number, assetType?: string) {
  const value = Number(n ?? 0);

  if (!Number.isFinite(value)) return "-";

  const decimals = getPriceDecimals(assetType, value);

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatBrl(n?: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(n ?? 0));
}

function NewsPanel({
  newsTab,
  setNewsTab,
}: {
  newsTab: "news" | "events";
  setNewsTab: (tab: "news" | "events") => void;
}) {
  const newsItems = [
    {
      title:
        "Viana diz que decisão do STF impediu análise de dados de filho de Lula na CPMI",
      summary:
        "Presidente da comissão afirma que suspensão de quebras de sigilo travou apuração e critica decisão de Flávio Dino.",
      source: "infomoney.br",
      time: "Agora há pouco",
      author: "Marina Verenicz",
      highlight: false,
    },
    {
      title:
        "Ibovespa Hoje Ao Vivo: Bolsa sobe aos 182 mil pontos com PETR4 e VALE3",
      summary:
        "Bolsas dos EUA avançam e ampliam recuperação em meio à turbulência do conflito no Irã.",
      source: "infomoney.br",
      time: "Agora há pouco",
      author: "Felipe Alves",
      highlight: false,
    },
    {
      title:
        "Inflação transitória dos EUA completa cinco anos e ainda incomoda",
      summary:
        "As cicatrizes políticas, financeiras e econômicas não desaparecerão rapidamente.",
      source: "infomoney.br",
      time: "Agora há pouco",
      author: "Reuters",
      highlight: false,
    },
    {
      title:
        "Petroleiros começam a passar pelo Estreito de Ormuz, diz Casa Branca",
      summary:
        "Kevin Hassett reiterou a posição do governo de que a guerra com o Irã deve durar semanas, não meses.",
      source: "infomoney.br",
      time: "Agora há pouco",
      author: "Reuters",
      highlight: true,
    },
  ];

  const events = [
    {
      time: "09:00",
      country: "🇧🇷 BR",
      event: "IPCA-15",
      actual: "0,38%",
      forecast: "0,34%",
      previous: "0,29%",
      color: "bg-red-500",
    },
    {
      time: "10:45",
      country: "🇺🇸 US",
      event: "PMI Industrial",
      actual: "51,2",
      forecast: "50,8",
      previous: "50,1",
      color: "bg-yellow-400",
    },
    {
      time: "11:00",
      country: "🇺🇸 US",
      event: "Vendas de Casas Novas",
      actual: "684K",
      forecast: "676K",
      previous: "662K",
      color: "bg-yellow-400",
    },
    {
      time: "15:00",
      country: "🇺🇸 US",
      event: "Discurso do Fed",
      actual: "—",
      forecast: "—",
      previous: "—",
      color: "bg-red-500",
    },
  ];

  return (
    <Card className="bg-zinc-900 border-zinc-800 xl:col-span-5 overflow-hidden">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-1 flex gap-2">
          <button
            type="button"
            onClick={() => setNewsTab("news")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold border flex items-center justify-center gap-2 transition ${newsTab === "news"
              ? "bg-black text-white border-zinc-800"
              : "text-zinc-400 border-transparent hover:text-white"
              }`}
          >
            📰 Notícias (10)
          </button>
          <button
            type="button"
            onClick={() => setNewsTab("events")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold border flex items-center justify-center gap-2 transition ${newsTab === "events"
              ? "bg-black text-white border-zinc-800"
              : "text-zinc-400 border-transparent hover:text-white"
              }`}
          >
            🗓️ Eventos Econômicos
          </button>
        </div>

        {newsTab === "news" ? (
          <div className="space-y-4">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className={`rounded-3xl border p-4 md:p-5 bg-gradient-to-r from-zinc-950 to-zinc-900/70 ${item.highlight ? "border-cyan-700/70" : "border-zinc-800"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-semibold text-lg leading-snug ${item.highlight ? "text-cyan-400" : "text-white"
                        }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-zinc-400">
                      <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-100 font-medium">
                        {item.source}
                      </span>
                      <span>◔ {item.time}</span>
                      <span>por {item.author}</span>
                    </div>
                  </div>
                  <div
                    className={`text-lg shrink-0 ${item.highlight ? "text-cyan-400" : "text-zinc-500"
                      }`}
                  >
                    ↗
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-950 to-zinc-900/70 p-4 md:p-5 overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-12 gap-4 text-xs uppercase tracking-wide text-zinc-500 border-b border-zinc-800 pb-3 mb-3">
                  <div className="col-span-2">Horário</div>
                  <div className="col-span-2">País</div>
                  <div className="col-span-4">Evento</div>
                  <div className="col-span-1">Impacto</div>
                  <div className="col-span-1">Atual</div>
                  <div className="col-span-1">Prev.</div>
                  <div className="col-span-1">Ant.</div>
                </div>
                {events.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center py-3 border-b border-zinc-900 last:border-b-0 text-sm"
                  >
                    <div className="col-span-2 text-zinc-300 font-medium">
                      {item.time}
                    </div>
                    <div className="col-span-2 text-zinc-400">
                      {item.country}
                    </div>
                    <div className="col-span-4 text-white">{item.event}</div>
                    <div className="col-span-1">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${item.color}`}
                      />
                    </div>
                    <div className="col-span-1 text-cyan-400">
                      {item.actual}
                    </div>
                    <div className="col-span-1 text-zinc-300">
                      {item.forecast}
                    </div>
                    <div className="col-span-1 text-zinc-500">
                      {item.previous}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SummaryTab({
  asset,
  tf,
  analysisData,
  compact = false,
}: {
  asset: string;
  tf: string;
  analysisData: AnalysisData | null;
  compact?: boolean;
}) {
  const normalizedAsset =
    analysisData?.asset || asset.trim().toUpperCase() || "IBOV";

  const direction = analysisData?.direction ?? "NEUTRO";
  const entry = analysisData?.entry ?? 0;
  const stop = analysisData?.stop ?? 0;
  const target = analysisData?.target ?? 0;
  const rr = analysisData?.risk_reward ?? 0;
  const assetType = analysisData?.asset_type ?? "crypto";

  const summary = (analysisData as any)?.summary ?? {};

  const signalLabel = summary.signal_label ?? direction;
  const confluence = summary.confluence ?? "0/10";
  const trendLabel = summary.trend_label ?? direction;
  const technicalLabel = summary.technical_label ?? "NEUTRO";
  const smartMoneyLabel = summary.smart_money_label ?? "NEUTRO";
  const tp2 = summary.tp2 ?? 0;
  const tp3 = summary.tp3 ?? 0;
  const confidence =
    analysisData?.confidence ??
    summary.confidence ??
    (typeof confluence === "string" && confluence.includes("/10")
      ? Math.round((Number(confluence.split("/")[0]) || 0) * 10)
      : 0);

  const directionColor =
    direction === "COMPRA"
      ? "text-green-400"
      : direction === "VENDA"
        ? "text-red-400"
        : "text-yellow-400";

  const directionBg =
    direction === "COMPRA"
      ? "border-green-900/60 bg-gradient-to-b from-green-950/60 to-black"
      : direction === "VENDA"
        ? "border-red-900/60 bg-gradient-to-b from-red-950/40 to-black"
        : "border-yellow-900/60 bg-gradient-to-b from-yellow-950/30 to-black";

  if (compact) {
    return (
      <aside className="space-y-3">
        <div className={`rounded-3xl border p-4 ${directionBg}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Sinal identificado
              </div>
              <div className={`text-3xl font-bold mt-2 leading-none ${directionColor}`}>
                {signalLabel}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-white text-2xl font-bold uppercase leading-none">
                {normalizedAsset}
              </div>
              <div className="text-zinc-400 text-sm mt-2">
                {tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-3">
              <div className="text-zinc-400 text-xs">Entrada</div>
              <div className="text-white text-2xl font-bold mt-1">
                {formatPrice(entry, assetType)}
              </div>
            </div>

            <div className="rounded-2xl border border-red-900/60 bg-red-950/20 p-3">
              <div className="text-red-400 text-xs">Stop</div>
              <div className="text-red-400 text-2xl font-bold mt-1">
                {formatPrice(stop, assetType)}
              </div>
            </div>

            <div className="rounded-2xl border border-green-900/60 bg-green-950/20 p-3">
              <div className="text-green-400 text-xs">TP1</div>
              <div className="text-green-400 text-2xl font-bold mt-1">
                {formatPrice(target, assetType)}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-3">
              <div className="text-zinc-400 text-xs">R:R</div>
              <div className="text-cyan-400 text-2xl font-bold mt-1">
                1:{rr.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-cyan-400 text-xs">Confiança</div>
            <div
              className={`text-2xl font-bold mt-2 ${
                confidence >= 70
                ? "text-green-400"
                : confidence >= 50
                ? "text-yellow-400"
                : "text-red-400"
              }`}
            >
              {confidence}%
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-yellow-400 text-xs">Tendência</div>
            <div className="text-green-400 text-2xl font-bold mt-2">
              {trendLabel}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-green-400 text-xs">Técnico</div>
            <div className="text-green-400 text-2xl font-bold mt-2">
              {technicalLabel}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-yellow-400 text-xs">Smart Money</div>
            <div className="text-red-400 text-2xl font-bold mt-2">
              {smartMoneyLabel}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="text-zinc-400 text-xs mb-3">Alvos adicionais</div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-green-900/60 bg-green-950/20 p-4">
              <div className="text-green-400 text-xs">TP2</div>
              <div className="text-green-400 text-2xl font-bold mt-2">
                {formatPrice(tp2, assetType)}
              </div>
            </div>

            <div className="rounded-2xl border border-green-900/60 bg-green-950/20 p-4">
              <div className="text-green-400 text-xs">TP3</div>
              <div className="text-green-400 text-2xl font-bold mt-2">
                {formatPrice(tp3, assetType)}
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl border p-6 ${directionBg}`}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`h-16 w-16 rounded-3xl border flex items-center justify-center text-3xl ${direction === "COMPRA"
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : direction === "VENDA"
                    ? "bg-red-500/20 border-red-500/30 text-red-400"
                    : "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                }`}
            >
              {direction === "VENDA" ? "↘" : direction === "COMPRA" ? "↗" : "→"}
            </div>

            <div>
              <div className="text-zinc-500 uppercase tracking-wide text-sm">
                Sinal Identificado
              </div>
              <div className={`text-5xl font-bold mt-1 ${directionColor}`}>
                {signalLabel}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-white text-4xl font-bold uppercase">
              {normalizedAsset}
            </div>
            <div className="text-zinc-400 text-2xl mt-1">
              {tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <div className="text-zinc-400 text-sm">Entrada</div>
            <div className="text-white text-3xl font-bold mt-2">
              {formatPrice(entry, assetType)}
            </div>
          </div>

          <div className="rounded-2xl border border-red-900/70 bg-red-950/20 p-4">
            <div className="text-red-400 text-sm">Stop Loss</div>
            <div className="text-red-400 text-3xl font-bold mt-2">
              {formatPrice(stop, assetType)}
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/70 bg-green-950/20 p-4">
            <div className="text-green-400 text-sm">Take Profit 1</div>
            <div className="text-green-400 text-3xl font-bold mt-2">
              {formatPrice(target, assetType)}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <div className="text-zinc-400 text-sm">Risco/Retorno</div>
            <div className="text-cyan-400 text-3xl font-bold mt-2">
              1:{rr.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-cyan-400 text-sm">Confluência</div>
          <div className="text-white text-4xl font-bold mt-3">{confluence}</div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-yellow-400 text-sm">Tendência</div>
          <div className="text-green-400 text-4xl font-bold mt-3">
            {trendLabel}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-green-400 text-sm">Técnico</div>
          <div className="text-green-400 text-4xl font-bold mt-3">
            {technicalLabel}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-yellow-400 text-sm">Smart Money</div>
          <div className="text-red-400 text-4xl font-bold mt-3">
            {smartMoneyLabel}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-zinc-400 text-sm mb-4">Alvos Adicionais</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-green-900/60 bg-green-950/20 p-5">
            <div className="text-green-400 text-sm">TP2</div>
            <div className="text-green-400 text-3xl font-bold mt-2">
              {formatPrice(tp2, assetType)}
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/60 bg-green-950/20 p-5">
            <div className="text-green-400 text-sm">TP3</div>
            <div className="text-green-400 text-3xl font-bold mt-2">
              {formatPrice(tp3, assetType)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechnicalTab({
  asset,
  tf,
  analysisData,
}: {
  asset: string;
  tf: string;
  analysisData: AnalysisData | null;
}) {
  const tech = analysisData?.technical;

  const assetType = analysisData?.asset_type ?? "crypto";
  const score = tech?.score ?? 50;
  const buySignals = tech?.buy_signals ?? 0;
  const sellSignals = tech?.sell_signals ?? 0;
  const neutralSignals = tech?.neutral_signals ?? 0;
  const trendBias = tech?.trend_bias ?? "NEUTRO";
  const ema9 = tech?.ema9 ?? 0;
  const ema21 = tech?.ema21 ?? 0;
  const rsi = tech?.rsi ?? 0;
  const supports = tech?.supports ?? [];
  const resistances = tech?.resistances ?? [];

  const buyPct = buySignals + sellSignals + neutralSignals > 0
    ? Math.round((buySignals / (buySignals + sellSignals + neutralSignals)) * 100)
    : 0;

  const sellPct = buySignals + sellSignals + neutralSignals > 0
    ? Math.round((sellSignals / (buySignals + sellSignals + neutralSignals)) * 100)
    : 0;

  const neutralPct = buySignals + sellSignals + neutralSignals > 0
    ? Math.round((neutralSignals / (buySignals + sellSignals + neutralSignals)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-cyan-400 text-lg font-semibold">
            ∿ Análise Técnica para <span className="text-white">{asset}</span>
          </div>
          <div className="text-zinc-400 mt-1">{tf === "5m" ? "5 Minutos" : tf}</div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-center mb-6">
          <div className="text-zinc-400 text-sm">Score Técnico</div>
          <div className="text-cyan-400 text-6xl font-bold mt-2">{score}</div>
          <div className="text-zinc-500 mt-2">Tendência {trendBias}</div>
        </div>

        <div className="rounded-2xl border border-green-900/70 bg-gradient-to-r from-green-950/70 to-emerald-950/20 p-5 text-center mt-2">
          <div className="text-4xl text-green-400 font-bold">
            {trendBias === "ALTA" ? "↗ Viés de Alta ↗" : trendBias === "BAIXA" ? "↘ Viés de Baixa ↘" : "— Neutro —"}
          </div>
          <div className="text-zinc-400 mt-2">Baseado em indicadores técnicos reais</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-cyan-400 font-semibold">Médias Móveis</div>
                <div className="text-3xl font-bold text-green-400 mt-4">
                  EMA9: {formatPrice(ema9, assetType)}
                </div>
                <div className="text-xl font-bold text-zinc-300 mt-2">
                  EMA21: {formatPrice(ema21, assetType)}
                </div>
              </div>
              <div className="text-green-400 text-3xl">↗</div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-cyan-400 font-semibold">Osciladores</div>
                <div className="text-3xl font-bold text-green-400 mt-4">
                  RSI: {rsi.toFixed(2)}
                </div>
                <div className="text-sm text-zinc-400 mt-2">
                  {rsi > 55 ? "Pressão compradora" : rsi < 45 ? "Pressão vendedora" : "Mercado neutro"}
                </div>
              </div>
              <div className="text-zinc-500 text-3xl">–</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl border border-red-900/70 bg-red-950/20 p-5 text-center">
            <div className="text-red-400 text-2xl">↘</div>
            <div className="text-zinc-400 mt-2">Venda</div>
            <div className="text-red-400 text-5xl font-bold mt-2">{sellSignals}</div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-center">
            <div className="text-zinc-500 text-2xl">–</div>
            <div className="text-zinc-400 mt-2">Neutro</div>
            <div className="text-white text-5xl font-bold mt-2">{neutralSignals}</div>
          </div>

          <div className="rounded-2xl border border-green-900/70 bg-green-950/20 p-5 text-center">
            <div className="text-green-400 text-2xl">↗</div>
            <div className="text-zinc-400 mt-2">Compra</div>
            <div className="text-green-400 text-5xl font-bold mt-2">{buySignals}</div>
          </div>
        </div>

        <div className="mt-6 h-4 rounded-full overflow-hidden bg-zinc-800 flex">
          <div className="bg-red-500 h-full" style={{ width: `${sellPct}%` }} />
          <div className="bg-zinc-500 h-full" style={{ width: `${neutralPct}%` }} />
          <div className="bg-green-500 h-full" style={{ width: `${buyPct}%` }} />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-6">
        <div className="text-white text-3xl font-bold mb-6">Padrões & Níveis</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-green-900/50 bg-green-950/20 p-5">
            <div className="text-green-400 text-2xl font-bold mb-4">Suportes</div>
            <div className="space-y-3">
              {supports.length > 0 ? (
                supports.map((s, idx) => (
                  <div key={idx} className="text-white text-2xl font-semibold">
                    {formatPrice(s, assetType)}
                  </div>
                ))
              ) : (
                <div className="text-zinc-400">Sem dados</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-5">
            <div className="text-red-400 text-2xl font-bold mb-4">Resistências</div>
            <div className="space-y-3">
              {resistances.length > 0 ? (
                resistances.map((r, idx) => (
                  <div key={idx} className="text-white text-2xl font-semibold">
                    {formatPrice(r, assetType)}
                  </div>
                ))
              ) : (
                <div className="text-zinc-400">Sem dados</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmcTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const smc = analysisData?.smc;

  const assetType = analysisData?.asset_type ?? "crypto";
  const bias = smc?.bias ?? "NEUTRO";
  const structureLabel = smc?.structure_label ?? "Estrutura indefinida";
  const lastBos = smc?.last_bos ?? 0;

  const context = smc?.context;
  const structure = smc?.structure;
  const trigger = smc?.trigger;

  const divergence = smc?.divergence ?? "Sem divergência";
  const orderBlocks = smc?.order_blocks ?? [];
  const fvgs = smc?.fvgs ?? [];
  const liquidity = smc?.liquidity ?? [];
  const structureBreaks = smc?.structure_breaks ?? [];
  const summary = smc?.summary ?? "Sem leitura institucional disponível.";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3 text-white text-2xl font-bold">
            <div className="h-12 w-12 rounded-2xl bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-purple-300">
              ⌘
            </div>
            <div>
              <div>Smart Money Concept (SMC)</div>
              <div className="text-zinc-400 text-base font-medium">
                Análise de fluxo institucional
              </div>
            </div>
          </div>

          <div
            className={`rounded-full px-5 py-3 font-bold text-xl ${bias === "BEARISH"
              ? "bg-red-950/40 border border-red-900/50 text-red-400"
              : bias === "BULLISH"
                ? "bg-green-950/40 border border-green-900/50 text-green-400"
                : "bg-zinc-900 border border-zinc-800 text-zinc-300"
              }`}
          >
            {bias === "BEARISH" ? "↘ VIÉS BAIXISTA" : bias === "BULLISH" ? "↗ VIÉS ALTISTA" : "— NEUTRO"}
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-zinc-800 flex flex-wrap gap-3">
          <div className="rounded-xl bg-red-950/40 border border-red-900/40 px-4 py-2 text-red-400 text-sm">
            {structureLabel}
          </div>
          <div className="rounded-xl bg-red-950/40 border border-red-900/40 px-4 py-2 text-red-400 text-sm">
            Último BOS: {formatPrice(lastBos, assetType)}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-white text-2xl font-bold">📊 Análise Multi-Período</div>
          <div className="rounded-xl bg-red-950/40 border border-red-900/40 px-4 py-2 text-red-400 text-sm">
            ⊗ Divergente
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-red-900/50 bg-red-950/25 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-zinc-400 uppercase text-sm tracking-wide">Contexto</div>
                <div className="text-white text-4xl font-bold mt-3">{context?.candles ?? 0}</div>
                <div className="text-zinc-500 mt-1">velas</div>
                <div className="text-red-400 text-xl font-bold mt-3">{context?.bias ?? "NEUTRO"}</div>
              </div>
              <div className="text-red-400 text-2xl">↘</div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/50 bg-green-950/25 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-zinc-400 uppercase text-sm tracking-wide">Estrutura</div>
                <div className="text-white text-4xl font-bold mt-3">{structure?.candles ?? 0}</div>
                <div className="text-zinc-500 mt-1">velas</div>
                <div className="text-green-400 text-xl font-bold mt-3">{structure?.bias ?? "NEUTRO"}</div>
              </div>
              <div className="text-green-400 text-2xl">↗</div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-zinc-400 uppercase text-sm tracking-wide">Gatilho</div>
                <div className="text-white text-4xl font-bold mt-3">{trigger?.candles ?? 0}</div>
                <div className="text-zinc-500 mt-1">velas</div>
                <div className="text-zinc-400 text-xl font-bold mt-3">{trigger?.bias ?? "LATERAL"}</div>
              </div>
              <div className="text-zinc-500 text-2xl">–</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-900/40 bg-red-950/25 px-4 py-4 text-red-300 text-sm md:text-base">
          ⚠ Divergência: {divergence}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5 md:p-6">
          <div className="text-white text-2xl font-bold mb-4">◈ Order Blocks</div>
          <div className="space-y-3">
            {orderBlocks.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-4 ${item.bullish
                  ? "border-green-900/50 bg-gradient-to-r from-green-950/40 to-emerald-950/20"
                  : "border-red-900/50 bg-gradient-to-r from-red-950/40 to-rose-950/20"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`${item.bullish ? "text-green-400" : "text-red-400"} font-semibold text-lg`}>
                      ● {item.title}
                    </div>
                    <div className="text-white text-2xl font-bold mt-2">{item.price}</div>
                    <div className="text-zinc-400 text-sm mt-2">{item.desc}</div>
                  </div>
                  <div className="text-sm text-zinc-300">Força: {item.strength}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5 md:p-6">
          <div className="text-white text-2xl font-bold mb-4">💲 Fair Value Gaps (FVG)</div>
          <div className="space-y-3">
            {fvgs.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-4 ${item.bullish
                  ? "border-green-900/50 bg-gradient-to-r from-green-950/35 to-emerald-950/15"
                  : "border-red-900/50 bg-gradient-to-r from-red-950/35 to-rose-950/15"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`${item.bullish ? "text-green-400" : "text-red-400"} font-semibold text-lg`}>
                      ▮ {item.title}
                    </div>
                    <div className="text-zinc-400 text-sm mt-2">Zona:</div>
                    <div className="text-white text-xl font-bold mt-1">{item.zone}</div>
                  </div>
                  <div
                    className={`rounded-lg px-3 py-1 text-sm ${item.state === "Aberto"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-600/30"
                      : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                      }`}
                  >
                    {item.state}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5 md:p-6">
          <div className="text-white text-2xl font-bold mb-4">💰 Zonas de Liquidez</div>
          <div className="space-y-3">
            {liquidity.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-green-900/50 bg-gradient-to-r from-green-950/35 to-emerald-950/15 p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="text-green-400 font-semibold text-lg">💰 Buy-Side Liquidity</div>
                  <div className="text-white text-2xl font-bold mt-2">{formatPrice(item.price, assetType)}</div>
                  <div className="text-zinc-400 text-sm mt-2">{item.desc}</div>
                </div>
                <div
                  className={`rounded-lg px-3 py-1 text-sm ${item.tag === "ALTA"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-600/30"
                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-600/30"
                    }`}
                >
                  {item.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5 md:p-6">
          <div className="text-white text-2xl font-bold mb-4">↗ Quebras de Estrutura</div>
          <div className="space-y-3">
            {structureBreaks.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-4 ${item.bullish
                  ? "border-green-900/50 bg-gradient-to-r from-green-950/35 to-emerald-950/15"
                  : "border-red-900/50 bg-gradient-to-r from-red-950/35 to-rose-950/15"
                  }`}
              >
                <div className={`${item.bullish ? "text-green-400" : "text-red-400"} font-semibold text-lg`}>
                  {item.bullish ? "☒" : "☑"} {item.title}
                </div>
                <div className="text-white text-2xl font-bold mt-2">{item.price?.toFixed(2)}</div>
                <div className="text-zinc-400 text-sm mt-2 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-indigo-950/35 via-zinc-950 to-zinc-950 p-5 text-white text-lg leading-relaxed">
        {summary}
      </div>
    </div>
  );
}

function HarmonicsTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const harmonics = analysisData?.harmonics;
  const patterns = harmonics?.patterns ?? [];
  const fibLevels = harmonics?.fib_levels ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5 md:p-6">
        <div className="text-white text-2xl font-bold flex items-center gap-3">
          <span className="text-pink-400">⬡</span>
          <span>Padrões Harmônicos</span>
        </div>
      </div>

      <div className="space-y-4">
        {patterns.map((pattern, idx) => (
          <div
            key={idx}
            className={`rounded-3xl border p-5 md:p-6 bg-gradient-to-r from-zinc-950 to-zinc-900/70 ${pattern.bullish ? "border-green-900/60" : "border-red-900/60"
              }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl leading-none">{pattern.icon}</div>
                <div>
                  <div className="text-white text-3xl font-bold">{pattern.name}</div>
                  <div className={`${pattern.bullish ? "text-green-400" : "text-red-400"} mt-1`}>
                    {pattern.direction}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-zinc-400 text-xl">Confiança</div>
                <div className={`${pattern.bullish ? "text-yellow-400" : "text-green-400"} text-4xl font-bold mt-1`}>
                  {pattern.confidence}%
                </div>
              </div>
            </div>

            <div className="mb-3 text-zinc-400">Formação</div>
            <div className="h-3 rounded-full bg-zinc-800 overflow-hidden mb-5">
              <div
                className={`${pattern.bullish ? "bg-green-400" : "bg-red-400"} h-full`}
                style={{ width: `${pattern.confidence ?? 0}%` }}
              />
            </div>

            <div className="text-yellow-400 text-sm mb-4">△ Ratios de Fibonacci (Prova)</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(pattern.ratios ?? []).map((ratio, ratioIdx) => (
                <div
                  key={ratioIdx}
                  className={`rounded-2xl border p-4 ${ratio.ok
                    ? "border-green-900/50 bg-gradient-to-r from-green-950/35 to-emerald-950/15"
                    : "border-red-900/50 bg-gradient-to-r from-red-950/35 to-rose-950/15"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-white text-2xl font-bold">{ratio.key}</div>
                      <div className="text-zinc-400 text-sm mt-2">esp: {ratio.expected}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-2xl font-bold">{ratio.value}</div>
                      <div className={`mt-2 text-sm ${ratio.ok ? "text-green-400" : "text-red-400"}`}>
                        {ratio.ok ? "◉" : "⊗"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5 text-center">
                <div className="text-zinc-400 text-lg">PRZ</div>
                <div className="text-white text-2xl font-bold mt-2 whitespace-pre-line">
                  {(pattern.prz ?? []).map((v) => v.toFixed(2)).join("\n")}
                </div>
              </div>

              <div className="rounded-2xl border border-green-900/40 bg-green-950/20 p-5 text-center">
                <div className="text-zinc-400 text-lg">Alvos</div>
                <div className="text-green-400 text-2xl font-bold mt-2 whitespace-pre-line">
                  {(pattern.targets ?? []).map((v) => v.toFixed(2)).join("\n")}
                </div>
              </div>

              <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5 text-center">
                <div className="text-zinc-400 text-lg">Stop</div>
                <div className="text-red-400 text-2xl font-bold mt-2">
                  {pattern.stop?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5 md:p-6">
        <div className="text-white text-2xl font-bold flex items-center gap-3 mb-4">
          <span className="text-yellow-400">△</span>
          <span>Níveis de Fibonacci</span>
        </div>

        <div className="space-y-3">
          {fibLevels.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-red-900/40 bg-gradient-to-r from-red-950/30 to-zinc-950 p-4 grid grid-cols-3 items-center gap-4"
            >
              <div className="text-zinc-200 text-xl font-semibold flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-red-400 inline-block" />
                <span>{item.level}</span>
              </div>
              <div className="text-white text-2xl font-bold text-center">
                {item.price?.toFixed(2)}
              </div>
              <div className="text-red-400 text-lg text-right">{item.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WegdTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const wegd = analysisData?.wegd;
  const [subTab, setSubTab] = useState("Wyckoff");
  const subTabs = ["Wyckoff", "Elliott", "Gann", "Dow"];

  const bias = wegd?.bias ?? "NEUTRO";
  const confluence = wegd?.confluence ?? "5/10";
  const summary = wegd?.summary ?? "Sem leitura WEGD disponível.";

  const wyckoff = wegd?.wyckoff;
  const elliott = wegd?.elliott;
  const gann = wegd?.gann;
  const dow = wegd?.dow;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-cyan-900/40 bg-gradient-to-r from-cyan-950/30 via-emerald-950/10 to-yellow-950/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-yellow-300 text-black font-bold flex items-center justify-center text-2xl">
              W
            </div>
            <div>
              <div className="text-white text-3xl font-bold">Análise WEGD</div>
              <div className="text-zinc-400">Wyckoff • Elliott • Gann • Dow</div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex px-5 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold text-2xl">
              {bias}
            </div>
            <div className="text-zinc-400 mt-2">Confluência: {confluence}</div>
          </div>
        </div>
        <div className="text-zinc-300 mt-5 text-lg">{summary}</div>
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-2 flex flex-wrap gap-2">
        {subTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSubTab(tab)}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-sm border transition ${subTab === tab
              ? "bg-black text-white border-zinc-800 font-semibold"
              : "bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {subTab === "Wyckoff" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-800 bg-slate-500/20 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white text-4xl font-bold">{wyckoff?.phase ?? "INDEFINIDO"}</div>
                <div className="text-zinc-300 mt-1">Fase de mercado Wyckoff</div>
              </div>
              <div className="text-right">
                <div className="text-white text-5xl font-bold">{wyckoff?.progress ?? 50}%</div>
                <div className="text-zinc-300">Progresso</div>
              </div>
            </div>
            <div className="mt-4 h-3 rounded-full overflow-hidden bg-zinc-700">
              <div className="h-full bg-zinc-200" style={{ width: `${wyckoff?.progress ?? 50}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
              <div className="text-white text-2xl font-bold mb-4">Ciclo de Mercado</div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="rounded-2xl bg-zinc-900/70 p-5 text-center">
                  <div className="text-zinc-400">Atual</div>
                  <div className="text-white text-3xl font-bold mt-2">{wyckoff?.phase ?? "INDEFINIDO"}</div>
                </div>
                <div className="text-center text-zinc-400 text-4xl">→</div>
                <div className="rounded-2xl bg-cyan-950/30 p-5 text-center border border-cyan-900/30">
                  <div className="text-zinc-400">Próximo</div>
                  <div className="text-cyan-400 text-3xl font-bold mt-2">{wyckoff?.next_phase ?? "INDEFINIDO"}</div>
                </div>
              </div>
              <div className="text-zinc-400 mt-4 text-center">Confiança: {wyckoff?.confidence ?? 40}%</div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
              <div className="text-white text-2xl font-bold mb-4">Composite Man</div>
              <div className="rounded-2xl bg-zinc-900/70 p-8 text-center">
                <div className="h-12 w-12 rounded-full border-4 border-slate-400 mx-auto mb-4" />
                <div className="text-slate-300 text-3xl font-bold">{wyckoff?.composite_man ?? "NEUTRO"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
            <div className="text-white text-2xl font-bold mb-4">Eventos Wyckoff</div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <div className="text-green-400 font-semibold mb-3">✓ Confirmados</div>
                {(wyckoff?.events_confirmed ?? []).map((event, idx) => (
                  <div key={idx} className="rounded-2xl border border-green-900/40 bg-green-950/25 p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-green-400 text-2xl font-bold">{event.name}</div>
                      <div className="text-zinc-400 mt-1">{event.desc}</div>
                    </div>
                    <div className="text-white font-semibold">{event.price?.toFixed(5)}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-yellow-400 font-semibold mb-3">⏳ Pendentes</div>
                {(wyckoff?.events_pending ?? []).length === 0 ? (
                  <div className="text-zinc-400">Todos eventos confirmados</div>
                ) : (
                  (wyckoff?.events_pending ?? []).map((event, idx) => (
                    <div key={idx} className="text-zinc-300">{event.name}</div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
            <div className="text-white text-2xl font-bold mb-4">Análise de Volume</div>
            <div className="rounded-2xl bg-yellow-950/20 border border-yellow-900/30 p-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-white text-2xl font-bold">{wyckoff?.volume_state ?? "NORMAL"}</div>
                <div className="text-zinc-400 mt-2">Volume e esforço no contexto atual</div>
              </div>
              <div className="text-yellow-400 text-2xl font-bold">{wyckoff?.volume_label ?? "MÉDIO"}</div>
            </div>
          </div>
        </div>
      )}

      {subTab === "Elliott" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-yellow-900/40 bg-gradient-to-r from-yellow-950/30 to-zinc-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-zinc-400">Onda Atual</div>
                <div className="text-white text-4xl font-bold mt-1">{elliott?.current_wave ?? "Onda A"}</div>
              </div>
              <div className="text-right">
                <div className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 font-bold">
                  {elliott?.mode ?? "NEUTRA"}
                </div>
                <div className="text-zinc-400 mt-2">Confiança: {elliott?.confidence ?? 50}%</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-zinc-400 text-sm mb-2">Progresso: {elliott?.progress ?? 50}%</div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400" style={{ width: `${elliott?.progress ?? 50}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
            <div className="text-white text-xl font-bold mb-4">Contagem de Ondas</div>
            <div className="flex flex-wrap gap-3">
              {(elliott?.wave_points ?? []).map((point, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 rounded-2xl border ${point.type === "green"
                    ? "border-green-900/40 bg-green-950/25"
                    : "border-yellow-900/40 bg-yellow-950/25"
                    }`}
                >
                  <div className={`text-2xl font-bold ${point.type === "green" ? "text-green-400" : "text-yellow-400"}`}>
                    {point.label}
                  </div>
                  <div className="text-zinc-400 text-sm mt-1">{point.price?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-cyan-900/40 bg-cyan-950/20 p-6 text-center">
              <div className="text-zinc-400">Próxima Onda</div>
              <div className="text-cyan-400 text-4xl font-bold mt-2">{elliott?.next_wave ?? "Onda B"}</div>
              <div className="text-zinc-500 mt-1">Esperada</div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
              <div className="text-white text-xl font-bold mb-4">Alvos de Fibonacci</div>
              <div className="text-zinc-400">(em desenvolvimento)</div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-900/40 bg-red-950/25 p-6 flex items-center justify-between">
            <div>
              <div className="text-red-400 text-lg font-bold">Nível de Invalidação</div>
              <div className="text-zinc-400 text-sm">Se rompido, a contagem é invalidada</div>
            </div>
            <div className="text-red-400 text-2xl font-bold">{elliott?.invalidation?.toFixed(5)}</div>
          </div>
        </div>
      )}

      {subTab === "Gann" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-yellow-900/40 bg-gradient-to-r from-yellow-950/30 via-green-950/20 to-cyan-950/20 p-6">
            <div className="text-zinc-400">Ângulo Dominante</div>
            <div className="text-white text-4xl font-bold mt-1">{gann?.dominant_angle ?? "1x1"}</div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-green-900/40 bg-green-950/20 p-5">
              <div className="text-green-400 font-bold mb-4">Ângulos de Suporte</div>
              {(gann?.support_angles ?? []).map((a, i) => (
                <div key={i} className="items-center p-3 rounded-xl bg-green-950/30 border border-green-900/30 mb-2">
                  <span className="text-white">{a.angle}</span>
                  <span className="text-green-400 font-bold">{a.price?.toFixed(5)}</span>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-red-900/40 bg-red-950/20 p-5">
              <div className="text-red-400 font-bold mb-4">Ângulos de Resistência</div>
              {(gann?.resistance_angles ?? []).map((a, i) => (
                <div key={i} className="items-center p-3 rounded-xl bg-red-950/30 border border-red-900/30 mb-2">
                  <span className="text-white">{a.angle}</span>
                  <span className="text-red-400 font-bold">{a.price?.toFixed(5)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
            <div className="text-white text-xl font-bold mb-4">Quadrado do Tempo</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-cyan-950/20 p-4 text-center">
                <div className="text-zinc-400">Ciclo Atual</div>
                <div className="text-cyan-400 text-xl font-bold mt-1">{gann?.current_cycle_days} dias no ciclo atual</div>
              </div>
              <div className="rounded-2xl bg-yellow-950/20 p-4 text-center">
                <div className="text-zinc-400">Próxima Reversão</div>
                <div className="text-yellow-400 text-xl font-bold mt-1">{gann?.next_reversal}</div>
              </div>
              <div className="rounded-2xl bg-yellow-950/20 p-4 text-center">
                <div className="text-zinc-400">Dias no Ciclo</div>
                <div className="text-yellow-400 text-xl font-bold mt-1">{gann?.days_in_cycle}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
            <div className="text-white text-xl font-bold mb-4">Quadrado do Preço</div>
            {(gann?.price_square_levels ?? []).map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 mb-2">
                <span className="text-white">{p.price?.toFixed(5)}</span>
                <span className="text-zinc-400">{p.strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "Dow" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
            <div className="text-white text-xl font-bold mb-4">Tendências de Dow</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-red-900/40 bg-red-950/25 p-5 text-center">
                <div className="text-zinc-400">Primária</div>
                <div className="text-red-400 text-2xl font-bold mt-2">{dow?.primary}</div>
              </div>
              <div className="rounded-2xl border border-red-900/40 bg-red-950/25 p-5 text-center">
                <div className="text-zinc-400">Secundária</div>
                <div className="text-red-400 text-2xl font-bold mt-2">{dow?.secondary}</div>
              </div>
              <div className="rounded-2xl border border-green-900/40 bg-green-950/25 p-5 text-center">
                <div className="text-zinc-400">Menor</div>
                <div className="text-green-400 text-2xl font-bold mt-2">{dow?.minor}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
            <div className="text-white text-xl font-bold mb-4">Fase de Mercado</div>
            <div className="rounded-2xl bg-blue-950/30 border border-blue-900/30 p-5">
              <div className="flex items-center justify-between">
                <div className="text-white text-2xl font-bold">{dow?.market_phase}</div>
                <div className="text-white text-2xl font-bold">{dow?.market_phase_score}%</div>
              </div>
              <div className="mt-3 h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: `${Math.max(0, Math.min(100, Math.abs(dow?.market_phase_score ?? 0)))}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-5">
            <div className="text-white text-xl font-bold mb-4">Confirmação de Dow</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-red-900/40 bg-red-950/25 p-5 text-center">
                <div className="text-zinc-400">Preço x Volume</div>
                <div className="text-red-400 text-xl font-bold mt-2">{dow?.price_volume_confirmation}</div>
              </div>
              <div className="rounded-2xl border border-green-900/40 bg-green-950/25 p-5 text-center">
                <div className="text-zinc-400">Índices</div>
                <div className="text-green-400 text-xl font-bold mt-2">{dow?.indices_confirmation}</div>
              </div>
            </div>
            <div className="text-zinc-400 text-sm mt-4">{dow?.volume_note}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProbabilisticaTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const p = analysisData?.probabilistic;

  const winRateGeneral = p?.win_rate_general ?? 0;
  const winRateLong = p?.win_rate_long ?? 0;
  const winRateShort = p?.win_rate_short ?? 0;

  const historical = p?.historical;
  const monteCarlo = p?.monte_carlo;
  const scenarios = p?.scenarios;
  const seasonality = p?.seasonality ?? [];
  const riskMetrics = p?.risk_metrics;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800 p-6 text-center">
          <div className="text-4xl text-white font-bold">{winRateGeneral}%</div>
          <div className="text-zinc-400 mt-2">Win Rate Geral</div>
        </div>
        <div className="rounded-2xl bg-green-950/30 border border-green-900/40 p-6 text-center">
          <div className="text-4xl text-green-400 font-bold">{winRateLong}%</div>
          <div className="text-zinc-400 mt-2">Win Rate Long</div>
        </div>
        <div className="rounded-2xl bg-red-950/30 border border-red-900/40 p-6 text-center">
          <div className="text-4xl text-red-400 font-bold">{winRateShort}%</div>
          <div className="text-zinc-400 mt-2">Win Rate Short</div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-white text-xl font-bold mb-4">
          Estatísticas Históricas ({historical?.periods ?? 0} períodos)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-white text-xl font-bold">{historical?.return_pct?.toFixed(2)}%</div>
            <div className="text-zinc-400">Retorno</div>
          </div>
          <div className="text-center">
            <div className="text-white text-xl font-bold">{historical?.volatility_pct?.toFixed(2)}%</div>
            <div className="text-zinc-400">Volatilidade</div>
          </div>
          <div className="text-center">
            <div className="text-white text-xl font-bold">{historical?.sharpe?.toFixed(2)}</div>
            <div className="text-zinc-400">Sharpe Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 text-xl font-bold">{historical?.max_drawdown_pct?.toFixed(2)}%</div>
            <div className="text-zinc-400">Max Drawdown</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-white text-xl font-bold mb-4">Simulação Monte Carlo</div>
        <div className="h-6 rounded-full bg-gradient-to-r from-red-500 via-cyan-400 to-green-500 relative">
          <div className="absolute left-[20%] top-[-10px] text-red-400 text-xs">{monteCarlo?.low?.toFixed(2)}</div>
          <div className="absolute left-[50%] top-[-10px] text-cyan-400 text-xs">{monteCarlo?.mid?.toFixed(2)}</div>
          <div className="absolute left-[80%] top-[-10px] text-green-400 text-xs">{monteCarlo?.high?.toFixed(2)}</div>
        </div>
        <div className="text-center text-zinc-400 mt-4">
          Nível de confiança: <span className="text-cyan-400">{monteCarlo?.confidence_level}%</span>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-white text-xl font-bold mb-4">Cenários Probabilísticos</div>

        <div className="mb-4">
          <div className="text-sm text-zinc-400">
            <span>Alta (Bullish)</span>
            <span>{scenarios?.bullish}%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${scenarios?.bullish ?? 0}%` }} />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-zinc-400">
            <span>Neutro</span>
            <span>{scenarios?.neutral}%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: `${scenarios?.neutral ?? 0}%` }} />
          </div>
        </div>

        <div>
          <div className="text-sm text-zinc-400">
            <span>Baixa (Bearish)</span>
            <span>{scenarios?.bearish}%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: `${scenarios?.bearish ?? 0}%` }} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-white text-xl font-bold mb-4">Sazonalidade</div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {seasonality.map((item, i) => (
            <div key={i} className="rounded-xl p-3 bg-zinc-900/70 border border-zinc-800 text-center">
              <div className="text-white">{item.month}</div>
              <div className="text-green-400 text-sm mt-1">+{item.value}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-white text-xl font-bold mb-4">Métricas de Risco</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-red-400 text-xl font-bold">{riskMetrics?.var_95?.toFixed(2)}%</div>
            <div className="text-zinc-400">VaR 95%</div>
          </div>
          <div>
            <div className="text-red-400 text-xl font-bold">{riskMetrics?.expected_shortfall?.toFixed(2)}%</div>
            <div className="text-zinc-400">Expected Shortfall</div>
          </div>
          <div>
            <div className="text-white text-xl font-bold">{riskMetrics?.beta?.toFixed(2)}</div>
            <div className="text-zinc-400">Beta</div>
          </div>
          <div>
            <div className="text-white text-xl font-bold">{riskMetrics?.correlation?.toFixed(2)}</div>
            <div className="text-zinc-400">Correlação</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalculadoraTab({
  analysisData,
}: {
  analysisData: AnalysisData | null;
}) {
  const [capital, setCapital] = useState("");
  const [risk, setRisk] = useState("Moderado");

  const riskMap: Record<string, { pct: number; label: string }> = {
    Conservador: { pct: 0.01, label: "0,5% - 1%" },
    Moderado: { pct: 0.02, label: "1% - 2%" },
    Agressivo: { pct: 0.03, label: "2% - 3%" },
  };

  const entry = analysisData?.entry ?? 0;
  const stop = analysisData?.stop ?? 0;
  const riskPerUnit = Math.abs(entry - stop);

  const cap = Number((capital || "0").replace(/\./g, "").replace(",", "."));
  const riskValue = cap * (riskMap[risk]?.pct || 0);
  const positionSize = riskPerUnit > 0 ? riskValue / riskPerUnit : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-6">
        <div className="text-white text-2xl font-bold mb-2">
          Calculadora de Gestão de Risco
        </div>
        <div className="text-zinc-400">
          Calcule o tamanho ideal da sua posição em Reais (BRL)
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-zinc-400 mb-2">Seu Capital (BRL)</div>
        <Input
          value={capital}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCapital(e.target.value)
          }
          placeholder="Ex: 10.000,00"
          className="bg-zinc-900 border-zinc-700 text-white"
        />
        <div className="text-zinc-500 text-sm mt-2">
          Digite o valor da sua banca em Reais (R$)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Conservador", "Moderado", "Agressivo"].map((r) => (
          <div
            key={r}
            onClick={() => setRisk(r)}
            className={`cursor-pointer rounded-2xl border p-5 text-center transition ${risk === r
              ? "border-yellow-500 bg-yellow-950/20"
              : "border-zinc-800 bg-zinc-950/60"
              }`}
          >
            <div className="text-white text-xl font-bold">{r}</div>
            <div className="text-zinc-400 mt-1">Risco: {riskMap[r].label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-zinc-400">Risco (R$)</div>
            <div className="text-red-400 text-2xl font-bold">
              {formatBrl(riskValue)}
            </div>
          </div>
          <div>
            <div className="text-zinc-400">Distância do Stop</div>
            <div className="text-white text-2xl font-bold">
              {riskPerUnit.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-zinc-400">Tamanho da Posição</div>
            <div className="text-green-400 text-2xl font-bold">
              {positionSize.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-cyan-950/30 to-zinc-950 p-5 text-white">
        Entrada: {formatPrice(entry)} | Stop: {formatPrice(stop)} | Gestão baseada
        em risco {risk} | Capital: {cap > 0 ? formatBrl(cap) : "R$ 0,00"}
      </div>
    </div>
  );
}

function TimingTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const timing = analysisData?.timing;

  const marketName = timing?.market_name ?? "Mercado";
  const timezone = timing?.timezone ?? "UTC";
  const status = timing?.status ?? "ATIVO";
  const bestWindowLabel = timing?.best_window_label ?? "Janela principal";
  const notes = timing?.notes ?? "Sem observações.";
  const recommended = timing?.recommended_windows ?? [];
  const avoid = timing?.avoid_windows ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-6">
        <div className="text-white text-2xl font-bold">🔥 Melhores Horários para Operar</div>
        <div className="text-zinc-400 mt-2">
          {marketName} • Timezone: {timezone} • Status: {status}
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5">
        <div className="text-cyan-400 text-xl font-bold">{bestWindowLabel}</div>
        <div className="text-zinc-300 mt-2">{notes}</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="text-green-400 font-semibold">✓ Horários Recomendados</div>

          {recommended.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-green-900/40 bg-green-950/25 p-5">
              <div className="text-green-400 text-xl font-bold">
                {item.start} - {item.end}
              </div>
              <div className="text-zinc-400 mt-1">{item.reason}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="text-red-400 font-semibold">✗ Horários a Evitar</div>

          {avoid.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-red-900/40 bg-red-950/25 p-5">
              <div className="text-red-400 text-xl font-bold">
                {item.start} - {item.end}
              </div>
              <div className="text-zinc-400 mt-1">{item.reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SinalFinalTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const signal = analysisData?.final_signal;

  if (!signal) {
    return <div className="text-zinc-400">Sem dados</div>;
  }

  const color =
    signal.direction === "COMPRA"
      ? "text-green-400"
      : signal.direction === "VENDA"
        ? "text-red-400"
        : "text-yellow-400";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-6">
        <div className="text-white text-2xl font-bold">🎯 Sinal Final</div>
      </div>

      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className={`text-4xl font-bold ${color}`}>
          {signal.direction} • {signal.strength}
        </div>
        <div className="text-zinc-400 mt-2">
          Confiança: {signal.confidence}%
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900 rounded-xl">
          <div className="text-zinc-400 text-sm">Entrada</div>
          <div className="text-white text-xl">{signal.entry?.toFixed(2)}</div>
        </div>

        <div className="p-4 bg-zinc-900 rounded-xl">
          <div className="text-zinc-400 text-sm">Stop</div>
          <div className="text-white text-xl">{signal.stop?.toFixed(2)}</div>
        </div>

        <div className="p-4 bg-zinc-900 rounded-xl">
          <div className="text-zinc-400 text-sm">Alvo</div>
          <div className="text-white text-xl">{signal.target?.toFixed(2)}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 p-5">
        <div className="text-white font-semibold mb-3">📊 Justificativa</div>

        {signal.justification?.map((item, i) => (
          <div key={i} className="text-zinc-400">
            • {item}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5">
        <div className="text-cyan-400 font-bold text-lg">
          {signal.verdict}
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
      Conteúdo da aba <span className="text-white font-semibold">{label}</span> em desenvolvimento
    </div>
  );
}

type AssetCategoryLabel = "Índices" | "Ações" | "Forex" | "Crypto" | "B3" | "Futuros BR";

type AssetOption = {
  label: string;
  value: string;
  apiType: "index" | "stock" | "forex" | "crypto" | "b3" | "future_br";
  tvSymbol?: string;
};

const ASSET_OPTIONS: Record<AssetCategoryLabel, AssetOption[]> = {
  "Índices": [
    { label: "IBOV", value: "IBOV", apiType: "index", tvSymbol: "INDEX:IBOV" },
    { label: "S&P 500", value: "SP500", apiType: "index", tvSymbol: "SP:SPX" },
    { label: "NASDAQ", value: "NASDAQ", apiType: "index", tvSymbol: "NASDAQ:IXIC" },
    { label: "Dow Jones", value: "DJI", apiType: "index", tvSymbol: "DJ:DJI" },
    { label: "VIX", value: "VIX", apiType: "index", tvSymbol: "CBOE:VIX" },
  ],
  "Ações": [
    { label: "Apple", value: "AAPL", apiType: "stock", tvSymbol: "NASDAQ:AAPL" },
    { label: "Tesla", value: "TSLA", apiType: "stock", tvSymbol: "NASDAQ:TSLA" },
    { label: "NVIDIA", value: "NVDA", apiType: "stock", tvSymbol: "NASDAQ:NVDA" },
    { label: "Microsoft", value: "MSFT", apiType: "stock", tvSymbol: "NASDAQ:MSFT" },
    { label: "Amazon", value: "AMZN", apiType: "stock", tvSymbol: "NASDAQ:AMZN" },
  ],
  "Forex": [
    { label: "EUR/USD", value: "EURUSD", apiType: "forex", tvSymbol: "FX:EURUSD" },
    { label: "GBP/USD", value: "GBPUSD", apiType: "forex", tvSymbol: "FX:GBPUSD" },
    { label: "USD/JPY", value: "USDJPY", apiType: "forex", tvSymbol: "FX:USDJPY" },
    { label: "AUD/USD", value: "AUDUSD", apiType: "forex", tvSymbol: "FX:AUDUSD" },
    { label: "USD/CAD", value: "USDCAD", apiType: "forex", tvSymbol: "FX:USDCAD" },
  ],
  "Crypto": [
    { label: "Bitcoin", value: "BTCUSDT", apiType: "crypto", tvSymbol: "BINANCE:BTCUSDT" },
    { label: "Ethereum", value: "ETHUSDT", apiType: "crypto", tvSymbol: "BINANCE:ETHUSDT" },
    { label: "Solana", value: "SOLUSDT", apiType: "crypto", tvSymbol: "BINANCE:SOLUSDT" },
    { label: "BNB", value: "BNBUSDT", apiType: "crypto", tvSymbol: "BINANCE:BNBUSDT" },
    { label: "XRP", value: "XRPUSDT", apiType: "crypto", tvSymbol: "BINANCE:XRPUSDT" },
  ],
  "B3": [
    { label: "PETR4", value: "PETR4", apiType: "b3", tvSymbol: "BMFBOVESPA:PETR4" },
    { label: "VALE3", value: "VALE3", apiType: "b3", tvSymbol: "BMFBOVESPA:VALE3" },
    { label: "ITUB4", value: "ITUB4", apiType: "b3", tvSymbol: "BMFBOVESPA:ITUB4" },
    { label: "BBDC4", value: "BBDC4", apiType: "b3", tvSymbol: "BMFBOVESPA:BBDC4" },
    { label: "ABEV3", value: "ABEV3", apiType: "b3", tvSymbol: "BMFBOVESPA:ABEV3" },
  ],
  "Futuros BR": [
    { label: "Mini Índice", value: "WIN", apiType: "future_br", tvSymbol: "BMFBOVESPA:WIN1!" },
    { label: "Mini Dólar", value: "WDO", apiType: "future_br", tvSymbol: "BMFBOVESPA:WDO1!" },
  ],
};

function getDefaultAssetByCategory(category: AssetCategoryLabel) {
  return ASSET_OPTIONS[category][0]?.value ?? "";
}

function getTradingViewSymbol(category: AssetCategoryLabel, asset: string) {
  const found = ASSET_OPTIONS[category].find((item) => item.value === asset);
  if (found?.tvSymbol) return found.tvSymbol;

  if (category === "Crypto") return `BINANCE:${asset}`;
  if (category === "Forex") return `FX:${asset}`;
  if (category === "B3") return `BMFBOVESPA:${asset}`;
  if (category === "Futuros BR") {
    if (asset === "WIN") return "BMFBOVESPA:WIN1!";
    if (asset === "WDO") return "BMFBOVESPA:WDO1!";
    return `BMFBOVESPA:${asset}`;
  }
  if (category === "Ações") return `NASDAQ:${asset}`;
  if (category === "Índices") return asset;

  return asset;
}

function AiThinkingOverlay({
  progress,
  asset,
  timeframe,
}: {
  progress: number;
  asset: string;
  timeframe: string;
}) {
  const stepIndex = Math.min(
    AI_LOADING_STEPS.length - 1,
    Math.floor((progress / 100) * AI_LOADING_STEPS.length)
  );

  const currentStep = AI_LOADING_STEPS[stepIndex] || "Processando análise...";

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(3,7,13,0.98),rgba(6,16,12,0.98))] p-6 md:p-8 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
        <div className="flex items-start gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
            <div className="h-7 w-7 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.18)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                IA em processamento
              </h3>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                analisando {asset}
              </span>
            </div>

            <p className="mt-2 text-zinc-400 text-sm md:text-base">
              A Gluck&apos;s Trader IA está cruzando contexto, tendência,
              confluência, Smart Money e timing para montar a análise.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-zinc-400">Etapa atual</div>
              <div className="mt-1 text-lg font-semibold text-emerald-300">
                {currentStep}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-zinc-400">Timeframe</div>
              <div className="mt-1 text-lg font-semibold text-white">
                {timeframe === "5m" ? "5 Minutos" : timeframe}
              </div>
            </div>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500">Processamento neural em andamento...</span>
            <span className="font-bold text-emerald-300">{progress}%</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Módulo 1
            </div>
            <div className="mt-2 text-sm font-medium text-white">
              Estrutura e contexto
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Módulo 2
            </div>
            <div className="mt-2 text-sm font-medium text-white">
              Fluxo e probabilidade
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Módulo 3
            </div>
            <div className="mt-2 text-sm font-medium text-white">
              Sinal final e setup
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Aguarde alguns instantes enquanto a análise é finalizada.
        </div>
      </div>
    </div>
  );
}

//export default function GlucksTraderIAUltra() {

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const AI_LOADING_STEPS = [
  "Lendo estrutura do mercado...",
  "Mapeando fluxo e liquidez...",
  "Calculando confluências técnicas...",
  "Validando tendência e timing...",
  "Refinando o sinal final da IA...",
];

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [assetCategory, setAssetCategory] = useState<AssetCategoryLabel>("Índices");
  const [asset, setAsset] = useState("IBOV");
  const [customAsset, setCustomAsset] = useState("");
  const [tf, setTf] = useState("5m");
  const [mainTab, setMainTab] = useState("Resumo");
  const [newsTab, setNewsTab] = useState<"news" | "events">("news");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [apiError, setApiError] = useState("");

  const tradingViewIntervalMap: Record<string, string> = {
    "1m": "1",
    "5m": "5",
    "15m": "15",
    "30m": "30",
    "1h": "60",
    "4h": "240",
    "1d": "D",
  };

  const tvInterval = tradingViewIntervalMap[tf] || "5";

  const tabs = [
    "Resumo",
    "Técnica",
    "SMC",
    "Harmônicos",
    "WEGD",
    "Probabilística",
    "Calculadora",
    "Timing",
    "SINAL FINAL",
  ];

  const selectedAssetOptions = useMemo(
    () => ASSET_OPTIONS[assetCategory] ?? [],
    [assetCategory]
  );

  const selectedAssetConfig = useMemo(
    () => selectedAssetOptions.find((item) => item.value === asset),
    [selectedAssetOptions, asset]
  );

  const resolvedAsset = (customAsset.trim() || asset).toUpperCase();
  const resolvedAssetType =
    selectedAssetConfig?.apiType ??
    (assetCategory === "Índices"
      ? "index"
      : assetCategory === "Ações"
      ? "stock"
      : assetCategory === "Forex"
      ? "forex"
      : assetCategory === "B3"
      ? "b3"
      : assetCategory === "Futuros BR"
      ? "future_br"
      : "crypto");

  const tvSymbol = getTradingViewSymbol(assetCategory, resolvedAsset);

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  async function handleAnalyze() {
    try {
      setApiError("");
      setProgress(10);
      setLoading(true);

      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_type: resolvedAssetType,
          asset: resolvedAsset,
          timeframe: tf,
        }),
      });

      setProgress(60);

      if (!response.ok) {
        let errorMessage = "Erro ao analisar mercado";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = `Erro ${response.status} ao analisar mercado`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      setProgress(90);
      setAnalysisData(data);
      setMainTab("Resumo");
      setProgress(100);
    } catch (error: any) {
      setApiError(error.message || "Erro desconhecido");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }
  }

  useEffect(() => {
    const nextDefault = getDefaultAssetByCategory(assetCategory);
    setAsset(nextDefault);
    setCustomAsset("");
  }, [assetCategory]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      {loading && (
        <AiThinkingOverlay
          progress={progress}
          asset={resolvedAsset}
          timeframe={tf}
        />
      )}

      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 hidden lg:block">
        <h1 className="text-xl font-bold flex items-center gap-2 text-white mb-10">
          <BrainCircuit size={18} /> Gluck&apos;s Trader IA
        </h1>
        <div className="space-y-4 text-zinc-300">
          <div className="flex gap-2 items-center hover:text-white cursor-pointer">
            <BarChart3 size={16} /> Dashboard
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-white">
            Terminal de Inteligência de Mercado
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            {user && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
                {user.name} • Plano:{" "}
                <span className="text-cyan-400">{user.plan}</span>
              </div>
            )}

            <Button
              className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[180px]">
                <label className="block text-sm text-zinc-400 mb-2">Categoria</label>
                <select
                  value={assetCategory}
                  onChange={(e) => setAssetCategory(e.target.value as AssetCategoryLabel)}
                  className="h-10 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 text-white"
                >
                  <option value="Índices">Índices</option>
                  <option value="Ações">Ações</option>
                  <option value="Forex">Forex</option>
                  <option value="Crypto">Crypto</option>
                  <option value="B3">B3</option>
                  <option value="Futuros BR">Futuros BR</option>
                </select>
              </div>

              <div className="min-w-[220px]">
                <label className="block text-sm text-zinc-400 mb-2">Ativo da lista</label>
                <select
                  value={asset}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setAsset(e.target.value)
                  }    
                  className="h-10 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 text-white"
                >
                  {selectedAssetOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label} ({item.value})
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-[180px]">
                <label className="block text-sm text-zinc-400 mb-2">Ativo manual</label>
                <input
                  value={customAsset}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomAsset(e.target.value.toUpperCase())
                  }
                  className="h-10 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 text-white"
                  placeholder="Ex: PETR4, AAPL, BTCUSDT"
                />
              </div>

              <div className="min-w-[140px]">
                <label className="block text-sm text-zinc-400 mb-2">Timeframe</label>
                <select
                  value={tf}
                  onChange={(e) => setTf(e.target.value)}
                  className="h-10 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 text-white"
                >
                  <option value="1m">1m</option>
                  <option value="5m">5m</option>
                  <option value="15m">15m</option>
                  <option value="30m">30m</option>
                  <option value="1h">1h</option>
                  <option value="4h">4h</option>
                  <option value="1d">1D</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAnalyze}
                >
                  Gerar Análise
                </Button>
              </div>
            </div>

            <div className="mt-4 text-sm text-zinc-400">
              Símbolo enviado à análise:
              <span className="text-white font-semibold ml-2">{resolvedAsset}</span>
              <span className="mx-2 text-zinc-700">•</span>
              Tipo:
              <span className="text-white font-semibold ml-2">{resolvedAssetType}</span>
            </div>
          </div>

          {apiError && (
            <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-red-400">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4 items-start">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-lg">Gráfico do Ativo</h3>
                <div className="text-sm text-zinc-400">
                  {assetCategory} • {resolvedAsset} •{" "}
                  {tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black min-h-[568px]">
                <iframe
                  title="TradingView Chart"
                  className="w-full h-[567px]"
                  src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
                    tvSymbol
                  )}&interval=${encodeURIComponent(
                    tvInterval
                  )}&theme=dark&style=1&timezone=America/Sao_Paulo&withdateranges=1&hide_side_toolbar=0&allow_symbol_change=1`}
                />
              </div>
            </div>

            <div className="xl:sticky xl:top-4">
              <SummaryTab
                asset={resolvedAsset}
                tf={tf}
                analysisData={analysisData}
                compact
              />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-4 flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMainTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm border transition ${
                  mainTab === tab
                    ? "bg-cyan-400 text-black border-cyan-300 font-semibold"
                    : "bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <span className="text-sm text-zinc-400">
              Tipo de ativo: <b className="text-white">{resolvedAssetType}</b> •
              Ativo: <b className="text-white"> {resolvedAsset}</b> •
              Timeframe usado na análise: <b className="text-white"> {tf}</b>
            </span>
          </div>

          {mainTab === "Resumo" && null}

          {mainTab === "Técnica" && (
            <TechnicalTab
              asset={resolvedAsset}
              tf={tf}
              analysisData={analysisData}
            />
          )}

          {mainTab === "SMC" && <SmcTab analysisData={analysisData} />}

          {mainTab === "Harmônicos" && (
            <HarmonicsTab analysisData={analysisData} />
          )}

          {mainTab === "WEGD" && <WegdTab analysisData={analysisData} />}

          {mainTab === "Probabilística" && (
            <ProbabilisticaTab analysisData={analysisData} />
          )}

          {mainTab === "Calculadora" && (
            <CalculadoraTab analysisData={analysisData} />
          )}

          {mainTab === "Timing" && (
            <TimingTab analysisData={analysisData} />
          )}

          {mainTab === "SINAL FINAL" && (
            <SinalFinalTab analysisData={analysisData} />
          )}

          {!tabs.includes(mainTab) && <PlaceholderTab label={mainTab} />}

          <div className="grid grid-cols-1 gap-6">
            <NewsPanel newsTab={newsTab} setNewsTab={setNewsTab} />
          </div>
        </div>
      </main>
    </div>
  );
}