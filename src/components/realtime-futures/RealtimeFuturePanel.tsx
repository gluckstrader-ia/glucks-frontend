import {
  Activity,
  AlertTriangle,
  Clock3,
  Radio,
  TrendingDown,
  TrendingUp,
  WifiOff,
} from "lucide-react";
import {
  formatFutureAggression,
  formatFutureMoney,
  formatFuturePrice,
} from "./formatters";
import { FullContractFlowChart, IntradayPriceChart } from "./RealtimeCharts";
import type { RealtimeFuture } from "./types";

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative" | "warning";
}) {
  const valueClass =
    tone === "positive"
      ? "text-emerald-400"
      : tone === "negative"
        ? "text-red-400"
        : tone === "warning"
          ? "text-amber-400"
          : "text-zinc-300";

  return (
    <div className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2.5 text-center">
      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <div className={`mt-1 font-mono text-sm font-black ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function AggressionCard({
  label,
  value,
  tone,
  subtitle,
  unit = "RAW",
}: {
  label: string;
  value: number;
  tone: "buyer" | "seller" | "balance";
  subtitle: string;
  unit?: "BRL" | "CONTRACTS" | "RAW";
}) {
  const cardClass =
    tone === "buyer"
      ? "border-emerald-400/25 bg-emerald-400/[0.05]"
      : tone === "seller"
        ? "border-red-400/25 bg-red-400/[0.035]"
        : "border-cyan-400/25 bg-cyan-400/[0.05]";

  const textClass =
    tone === "buyer"
      ? "text-emerald-300"
      : tone === "seller"
        ? "text-red-400"
        : value >= 0
          ? "text-emerald-400"
          : "text-red-400";

  const barClass =
    tone === "buyer"
      ? "bg-emerald-400"
      : tone === "seller"
        ? "bg-red-400"
        : "bg-cyan-400";

  return (
    <div className={`overflow-hidden rounded-xl border p-3 ${cardClass}`}>
      <div className="text-[9px] font-black uppercase tracking-[0.13em] text-zinc-500">
        {label}
      </div>
      <div className={`mt-1 font-mono text-lg font-black ${textClass}`}>
        {formatFutureAggression(value, unit)}
      </div>
      <div className="mt-1 text-[10px] text-zinc-500">{subtitle}</div>
      <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full w-[72%] ${barClass}`} />
      </div>
    </div>
  );
}

function QuantitativeScore({
  future,
  marketStatus,
}: {
  future: RealtimeFuture;
  marketStatus: string;
}) {
  const paused = marketStatus !== "OPEN" || future.signalActive === false;
  const isBuy = future.signal === "COMPRA";
  const isSell = future.signal === "VENDA";
  const isWaiting = future.signal === "AGUARDAR CONFIRMAÇÃO";
  const displayedSignal = isWaiting ? "NEUTRO" : future.signal;
  const displayedNote = isWaiting
    ? "Mercado sem confluência suficiente para uma leitura direcional."
    : future.signalNote;

  const accent = isBuy
    ? "#22c55e"
    : isSell
      ? "#ef4444"
      : "#22d3ee";

  const signalClass = isBuy
    ? "text-emerald-400"
    : isSell
      ? "text-red-400"
      : "text-cyan-300";

  const availableModules =
    future.availableModules ??
    future.modules.filter((module) => module.available !== false).length;

  const moduleDirection = (module: RealtimeFuture["modules"][number]) => {
    if (module.available === false) return "UNAVAILABLE";
    if (module.direction) return module.direction;
    return module.positive ? "BUY" : "SELL";
  };

  const moduleClass = (module: RealtimeFuture["modules"][number]) => {
    const direction = moduleDirection(module);
    if (direction === "UNAVAILABLE") {
      return "border-zinc-700 bg-zinc-900 text-zinc-500";
    }
    if (direction === "BUY") {
      return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
    }
    if (direction === "SELL") {
      return "border-red-400/25 bg-red-400/10 text-red-300";
    }
    return "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-200";
  };

  const moduleMark = (module: RealtimeFuture["modules"][number]) => {
    const direction = moduleDirection(module);
    if (direction === "UNAVAILABLE") return "×";
    if (direction === "BUY") return "↑";
    if (direction === "SELL") return "↓";
    return "•";
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
      <div className="flex items-center gap-3">
        <div
          className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${accent} ${future.score * 3.6}deg, rgba(63,63,70,0.55) 0deg)`,
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 font-mono text-lg font-black text-white">
            {future.score}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-500">
              Leitura quantitativa
            </div>
            {paused && (
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-zinc-400">
                Pausada
              </span>
            )}
          </div>

          <div className={`mt-1 text-base font-black ${signalClass}`}>
            {displayedSignal}
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {future.modules.map((module) => (
              <span
                key={module.key}
                title={module.detail || module.label || module.key}
                className={`rounded border px-1.5 py-0.5 text-[8px] font-black ${moduleClass(module)}`}
              >
                {moduleMark(module)} {module.key}
              </span>
            ))}
          </div>

          <div className="mt-2 text-[9px] text-zinc-500">
            Confiança {future.confidence}% · {future.confirmations}/
            {availableModules} confirmações disponíveis
          </div>
        </div>
      </div>

      {displayedNote && (
        <div className="mt-3 rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-[9px] leading-4 text-zinc-500">
          {displayedNote}
        </div>
      )}

      {(future.signalReasons?.length ?? 0) > 0 && (
        <div className="mt-2 space-y-1">
          {future.signalReasons?.slice(0, 2).map((reason) => (
            <div key={reason} className="text-[8px] leading-4 text-zinc-600">
              • {reason}
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 text-[8px] leading-4 text-zinc-700">
        Leitura estatística experimental. O módulo não envia ordens automaticamente.
      </div>
    </div>
  );
}

function marketBadge(marketStatus: string, live: boolean) {
  if (!live) {
    return {
      label: "Aguardando",
      className: "border-zinc-600 bg-zinc-900 text-zinc-400",
      Icon: Clock3,
    };
  }

  if (marketStatus === "OPEN") {
    return {
      label: "Ao vivo",
      className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      Icon: Radio,
    };
  }

  if (marketStatus === "STALE") {
    return {
      label: "Dados em espera",
      className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
      Icon: AlertTriangle,
    };
  }

  if (marketStatus === "DISCONNECTED") {
    return {
      label: "Conexão indisponível",
      className: "border-red-400/20 bg-red-400/10 text-red-300",
      Icon: WifiOff,
    };
  }

  return {
    label: marketStatus === "PRE_OPEN" ? "Pré-abertura" : "Último pregão",
    className: "border-zinc-600 bg-zinc-900 text-zinc-300",
    Icon: Clock3,
  };
}


function MarketFlag({ market }: { market: "BR" | "US" }) {
  if (market === "BR") {
    return (
      <svg
        viewBox="0 0 120 80"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label="Bandeira do Brasil"
      >
        <rect width="120" height="80" fill="#009C3B" />
        <polygon points="60,7 111,40 60,73 9,40" fill="#FFDF00" />
        <circle cx="60" cy="40" r="18" fill="#002776" />
        <path
          d="M43 36.5 C52 31, 68 31.5, 77.5 38.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const stripeHeight = 80 / 13;
  const stars = Array.from({ length: 24 }, (_, index) => ({
    x: 5 + (index % 6) * 8,
    y: 5 + Math.floor(index / 6) * 9,
  }));

  return (
    <svg
      viewBox="0 0 120 80"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label="Bandeira dos Estados Unidos"
    >
      {Array.from({ length: 13 }, (_, index) => (
        <rect
          key={index}
          x="0"
          y={index * stripeHeight}
          width="120"
          height={stripeHeight + 0.2}
          fill={index % 2 === 0 ? "#B22234" : "#FFFFFF"}
        />
      ))}

      <rect width="52" height={stripeHeight * 7} fill="#3C3B6E" />

      {stars.map((star, index) => (
        <circle
          key={index}
          cx={star.x}
          cy={star.y}
          r="1.4"
          fill="#FFFFFF"
        />
      ))}
    </svg>
  );
}

export default function RealtimeFuturePanel({
  future,
  live = false,
  marketStatus = "DISCONNECTED",
}: {
  future: RealtimeFuture;
  live?: boolean;
  marketStatus?: string;
}) {
  const negative = future.variationPct < 0;
  const normalizedSymbol = future.symbol.toUpperCase();
  const isWin = normalizedSymbol.startsWith("WIN");
  const marketCode: "BR" | "US" = isWin ? "BR" : "US";
  const marketLabel = isWin ? "ÍNDICE BRASIL" : "DÓLAR EUA";
  const marketDescription = isWin
    ? "Mini Índice • Mercado brasileiro"
    : "Mini Dólar • Mercado americano";
  const marketLabelClass = isWin ? "text-emerald-300" : "text-sky-300";
  const headerBackground = isWin
    ? "linear-gradient(90deg, rgba(0,156,59,0.30) 0%, rgba(255,223,0,0.12) 25%, rgba(0,39,118,0.12) 43%, rgba(9,9,11,0.94) 72%, rgba(9,9,11,0.99) 100%)"
    : "linear-gradient(90deg, rgba(60,59,110,0.34) 0%, rgba(178,34,52,0.16) 27%, rgba(255,255,255,0.05) 43%, rgba(9,9,11,0.94) 72%, rgba(9,9,11,0.99) 100%)";

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-black/40 shadow-2xl shadow-cyan-500/5">
      <header
        className="relative overflow-hidden border-b border-zinc-800 px-4 py-3"
        style={{ background: headerBackground }}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[54%] opacity-[0.28]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, black 0%, black 40%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, black 0%, black 40%, transparent 100%)",
          }}
          aria-hidden="true"
        >
          <MarketFlag market={marketCode} />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/5 via-black/55 to-black/95" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-12 shrink-0 overflow-hidden rounded-md border border-white/15 bg-black/40 shadow-lg shadow-black/40">
              <MarketFlag market={marketCode} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-mono text-sm font-black text-white">
                  {future.symbol}
                </h4>

                {(() => {
                  const badge = marketBadge(marketStatus, live);
                  const BadgeIcon = badge.Icon;

                  return (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] ${badge.className}`}
                    >
                      <BadgeIcon className="h-2.5 w-2.5" />
                      {badge.label}
                    </span>
                  );
                })()}
              </div>

              <div
                className={`mt-1 text-[9px] font-black uppercase tracking-[0.18em] ${marketLabelClass}`}
              >
                {marketLabel}
              </div>

              <p className="mt-0.5 text-[9px] font-semibold text-zinc-400">
                {marketDescription}
              </p>

              <p className="mt-0.5 font-mono text-[8px] text-zinc-600">
                {future.contract}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl font-black text-white">
              {formatFuturePrice(future.price, future.priceDecimals)}
            </div>

            <div className="mt-1 flex items-center justify-end gap-2 font-mono text-[10px]">
              <span
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-black ${
                  negative
                    ? "bg-red-500/10 text-red-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {negative ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {future.variationPct > 0 ? "+" : ""}
                {future.variationPct.toFixed(2)}%
              </span>

              <span className="text-zinc-500">
                {future.variationPoints > 0 ? "+" : ""}
                {formatFuturePrice(
                  future.variationPoints,
                  future.priceDecimals,
                )}{" "}
                pts
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-3 p-3">
        <IntradayPriceChart
          values={future.priceSeries}
          times={future.timeSeries ?? []}
          market={marketCode}
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Metric
            label="Abertura"
            value={formatFuturePrice(future.open, future.priceDecimals)}
          />
          <Metric
            label="Máxima"
            value={formatFuturePrice(future.high, future.priceDecimals)}
            tone="positive"
          />
          <Metric
            label="Mínima"
            value={formatFuturePrice(future.low, future.priceDecimals)}
            tone="negative"
          />
          <Metric
            label="Amplitude"
            value={`+${formatFuturePrice(future.amplitude, future.priceDecimals)}`}
            tone="warning"
          />
          <Metric
            label="Vol. financeiro"
            value={formatFutureMoney(future.volume).replace("+ ", "")}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
            <Activity className="h-3 w-3 text-cyan-400" /> Agressão e contrato
            cheio
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <AggressionCard
              label="Agressão compradora"
              value={future.buyerAggression}
              tone="buyer"
              subtitle="Compras a mercado"
              unit={future.aggressionUnit}
            />
            <AggressionCard
              label="Agressão vendedora"
              value={-future.sellerAggression}
              tone="seller"
              subtitle="Vendas a mercado"
              unit={future.aggressionUnit}
            />
            <AggressionCard
              label={`Saldo do cheio · ${future.fullContract}`}
              value={future.fullBalance}
              tone="balance"
              subtitle="Contrato cheio correspondente"
              unit={future.aggressionUnit}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-3 py-2.5">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">
              Saldo líquido do painel
            </div>
            <div className="mt-1 text-[10px] text-zinc-500">
              Saldo recebido do contrato cheio
            </div>
          </div>
          <div
            className={`font-mono text-base font-black ${
              future.netBalance >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatFutureAggression(future.netBalance, future.aggressionUnit)}
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Fluxo ao longo do pregão
            </div>
            <div className="flex flex-wrap gap-3 text-[8px] font-semibold text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-0.5 w-3 bg-emerald-400" /> Comprador
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-0.5 w-3 bg-red-400" /> Vendedor
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-0.5 w-3 bg-cyan-400" /> Saldo cheio
              </span>
            </div>
          </div>

          <FullContractFlowChart
            buyer={future.buyerSeries}
            seller={future.sellerSeries}
            balance={future.balanceSeries}
            times={future.timeSeries ?? []}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <div className="text-[8px] font-black uppercase tracking-[0.13em] text-zinc-500">
                  Agressão do cheio
                </div>
                <div
                  className={`mt-1 font-mono text-sm font-black ${
                    future.fullBalance >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {formatFutureAggression(future.fullBalance, future.aggressionUnit)}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-black/40 p-2.5">
                <div className="text-[8px] font-black uppercase tracking-[0.13em] text-zinc-500">
                  Predominância
                </div>
                <div
                  className={`mt-1 font-mono text-sm font-black ${
                    future.fullBalance >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {future.fullBalance >= 0 ? "COMPRADORA" : "VENDEDORA"}
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-[9px] leading-5 text-zinc-500">
              {live
                ? marketStatus === "OPEN"
                  ? "Dados reais atualizados pelo serviço complementar."
                  : "Último snapshot real preservado enquanto o serviço aguarda nova atualização."
                : "Aguardando o primeiro snapshot válido do mercado."}
            </div>
          </div>

          <QuantitativeScore future={future} marketStatus={marketStatus} />
        </div>
      </div>
    </article>
  );
}
