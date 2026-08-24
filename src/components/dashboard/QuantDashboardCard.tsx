export type TrendLabel =
  | "FORTE ALTISTA"
  | "ALTISTA"
  | "NEUTRO"
  | "BAIXISTA"
  | "FORTE BAIXISTA";

export type SignalLabel =
  | "COMPRA FORTE"
  | "COMPRA"
  | "NEUTRO"
  | "VENDA"
  | "VENDA FORTE";

export type QuantDashboardData = {
  score: number;
  signal: SignalLabel;
  shortTrend: TrendLabel;
  midTrend: TrendLabel;
  roc: number;
  rsi: number;
  pressure: number;
  atr: number;
  relativeVolatility: number;
  relativeVolume: number;
  adx: number;
  updatedAt?: string;
};

type Props = {
  asset: string;
  timeframe: string;
  data: QuantDashboardData | null;
  loading?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function thermometerPercent(score: number) {
  const safe = clamp(score, -100, 100);
  return ((safe + 100) / 200) * 100;
}

function scoreColor(score: number) {
  if (score >= 45) return "text-emerald-400";
  if (score >= 15) return "text-lime-400";
  if (score > -15) return "text-zinc-300";
  if (score > -45) return "text-orange-400";
  return "text-rose-400";
}

function scoreBadge(signal: SignalLabel) {
  switch (signal) {
    case "COMPRA FORTE":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
    case "COMPRA":
      return "border-lime-500/30 bg-lime-500/15 text-lime-300";
    case "VENDA":
      return "border-orange-500/30 bg-orange-500/15 text-orange-300";
    case "VENDA FORTE":
      return "border-rose-500/30 bg-rose-500/15 text-rose-300";
    default:
      return "border-zinc-700 bg-zinc-800/60 text-zinc-300";
  }
}

function trendColor(label: TrendLabel) {
  if (label.includes("ALTISTA")) return "text-emerald-400";
  if (label.includes("BAIXISTA")) return "text-rose-400";
  return "text-zinc-300";
}

function valueColor(value: number, positiveGood = true) {
  if (value === 0) return "text-zinc-300";
  if (positiveGood) return value > 0 ? "text-emerald-400" : "text-rose-400";
  return value > 0 ? "text-rose-400" : "text-emerald-400";
}

function volatilityLabel(v: number) {
  if (v >= 0.8) return "Alta";
  if (v >= 0.2) return "Moderada";
  if (v > -0.2) return "Controlada";
  return "Baixa";
}

function relativeVolumeLabel(v: number) {
  if (v >= 1.3) return "Acima da Média";
  if (v >= 0.9) return "Na Média";
  return "Abaixo da Média";
}

function adxLabel(v: number) {
  if (v >= 35) return "Forte";
  if (v >= 20) return "Moderada";
  return "Fraca";
}

function MetricRow({
  label,
  value,
  valueClassName = "text-zinc-200",
  rightLabel,
  rightClassName = "text-zinc-400",
}: {
  label: string;
  value: string;
  valueClassName?: string;
  rightLabel?: string;
  rightClassName?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-2 transition-colors hover:bg-white/[0.045]">
      <div className="truncate text-[9px] font-medium uppercase tracking-wide text-zinc-500" title={label}>
        {label}
      </div>
      <div className="mt-1 flex min-w-0 items-baseline justify-between gap-1.5">
        <div className={`truncate text-xs font-bold tabular-nums ${valueClassName}`} title={value}>
          {value}
        </div>
        {rightLabel && (
          <div className={`shrink-0 text-[8px] font-semibold ${rightClassName}`}>
            {rightLabel}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryChip({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: string;
  valueClassName: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </div>
      <div className={`mt-1 truncate text-xs font-bold ${valueClassName}`} title={value}>
        {value}
      </div>
    </div>
  );
}

export default function QuantDashboardCard({
  asset,
  timeframe,
  data,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <section className="flex h-[694px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
        <div className="h-6 w-40 rounded bg-zinc-800 animate-pulse" />
        <div className="mt-6 flex-1 space-y-4 overflow-hidden">
          <div className="h-24 rounded-2xl bg-zinc-900 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 rounded-2xl bg-zinc-900 animate-pulse" />
            <div className="h-20 rounded-2xl bg-zinc-900 animate-pulse" />
            <div className="h-20 rounded-2xl bg-zinc-900 animate-pulse" />
            <div className="h-20 rounded-2xl bg-zinc-900 animate-pulse" />
          </div>
          <div className="h-40 rounded-2xl bg-zinc-900 animate-pulse" />
          <div className="h-40 rounded-2xl bg-zinc-900 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="flex h-[694px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white">Dashboard Quant</h3>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
            {asset} • {timeframe}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-xl">
              ∑
            </div>
            <p className="text-sm leading-6 text-zinc-500">
              Gere uma análise para carregar os dados quantitativos.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const tempPercent = thermometerPercent(data.score);

  return (
    <section className="flex h-[694px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
      <div className="shrink-0 border-b border-white/[0.06] px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white">Dashboard Quant</h3>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Leitura quantitativa em tempo real
            </p>
          </div>

          <span className="max-w-[150px] truncate rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] font-medium text-zinc-400" title={`${asset} • ${timeframe}`}>
            {asset} • {timeframe}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 overflow-hidden px-4 py-3">
        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.045] to-transparent p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Score Quantitativo
              </div>
              <div className="mt-1.5 flex items-end gap-2">
                <div className={`text-5xl font-black leading-none tabular-nums ${scoreColor(data.score)}`}>
                  {Math.round(data.score)}
                </div>
                <div className="pb-1 text-sm font-medium text-zinc-500">/ 100</div>
              </div>
            </div>

            <div className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold ${scoreBadge(data.signal)}`}>
              {data.signal}
            </div>
          </div>

          <div className="mt-3">
            <div
              className="relative h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-zinc-700 to-emerald-500"
              role="meter"
              aria-label="Escala do score quantitativo"
              aria-valuemin={-100}
              aria-valuemax={100}
              aria-valuenow={data.score}
            >
              <div className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-white/40" />
              <div
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-zinc-950 bg-white shadow-[0_0_16px_rgba(255,255,255,0.35)]"
                style={{ left: `${tempPercent}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[9px] font-medium text-zinc-600">
              <span>-100 Venda</span>
              <span>0 Neutro</span>
              <span>Compra +100</span>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-2">
          <SummaryChip
            title="Tendência"
            value={data.shortTrend}
            valueClassName={trendColor(data.shortTrend)}
          />
          <SummaryChip
            title="Estrutura"
            value={data.midTrend}
            valueClassName={trendColor(data.midTrend)}
          />
          <SummaryChip
            title="Momento"
            value={data.roc >= 0 ? "POSITIVO" : "NEGATIVO"}
            valueClassName={valueColor(data.roc)}
          />
          <SummaryChip
            title="Volatilidade"
            value={volatilityLabel(data.relativeVolatility).toUpperCase()}
            valueClassName="text-yellow-300"
          />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="text-xs font-semibold text-white">Indicadores complementares</div>
            <span className="text-[9px] uppercase tracking-wider text-zinc-600">Confirmação</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <MetricRow
              label="Momento (ROC)"
              value={data.roc.toFixed(3)}
              valueClassName={valueColor(data.roc)}
            />
            <MetricRow
              label="Força Relativa (RSI)"
              value={data.rsi.toFixed(2)}
              valueClassName={data.rsi >= 50 ? "text-emerald-400" : "text-rose-400"}
            />
            <MetricRow
              label="Pressão Compra/Venda"
              value={data.pressure.toFixed(3)}
              valueClassName={valueColor(data.pressure)}
            />
            <MetricRow
              label="ATR (14)"
              value={data.atr.toFixed(6)}
              valueClassName="text-orange-300"
              rightLabel={volatilityLabel(data.relativeVolatility)}
              rightClassName="text-yellow-300"
            />
            <MetricRow
              label="Volatilidade Relativa"
              value={data.relativeVolatility.toFixed(3)}
              valueClassName={valueColor(data.relativeVolatility, false)}
            />
            <MetricRow
              label="Volume Relativo"
              value={data.relativeVolume.toFixed(2)}
              valueClassName={data.relativeVolume >= 1 ? "text-emerald-400" : "text-orange-300"}
              rightLabel={relativeVolumeLabel(data.relativeVolume)}
              rightClassName="text-yellow-300"
            />
            <MetricRow
              label="Força Direcional (ADX)"
              value={data.adx.toFixed(2)}
              valueClassName="text-orange-300"
              rightLabel={adxLabel(data.adx)}
              rightClassName="text-yellow-300"
            />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-white/[0.06] bg-black/20 px-4 py-2.5 text-[10px] text-zinc-500">
        <span>Dados quantitativos</span>
        <span className="flex items-center gap-1.5 tabular-nums">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
          {data.updatedAt
            ? new Date(data.updatedAt).toLocaleTimeString("pt-BR")
            : "—"}
        </span>
      </div>
    </section>
  );
}