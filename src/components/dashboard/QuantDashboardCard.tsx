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
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className={`text-sm font-semibold ${valueClassName}`}>{value}</div>
      <div className={`text-xs ${rightClassName}`}>{rightLabel ?? ""}</div>
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
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center">
      <div className="text-xs text-zinc-500">{title}</div>
      <div className={`mt-2 text-sm font-bold ${valueClassName}`}>{value}</div>
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
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 max-h-[740px] flex flex-col overflow-hidden">
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
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 max-h-[740px] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-white">Dashboard Quant</h3>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
            {asset} • {timeframe}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center text-center text-zinc-500">
          Gere uma análise para carregar os dados quantitativos.
        </div>
      </section>
    );
  }

  const tempPercent = thermometerPercent(data.score);

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 max-h-[715px] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div>
          <h3 className="text-xl font-bold text-white">Dashboard Quant</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Leitura quantitativa em tempo real
          </p>
        </div>

        <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
          {asset} • {timeframe}
        </span>
      </div>

      <div className="mt-5 flex-1 overflow-y-auto overflow-x-hidden pr-2 space-y-4">
        <div className="grid grid-cols-[1fr_72px] gap-4">
          <div>
            <div className="text-sm text-zinc-400">Score Quantitativo</div>

            <div className="mt-2 flex items-end gap-3">
              <div
                className={`text-5xl font-black leading-none ${scoreColor(data.score)}`}
              >
                {Math.round(data.score)}
              </div>
              <div className="pb-1 text-2xl text-zinc-400">/ 100</div>
            </div>

            <div
              className={`mt-3 inline-flex rounded-xl border px-3 py-2 text-sm font-bold ${scoreBadge(data.signal)}`}
            >
              {data.signal}
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              O score combina tendência, momentum, pressão de preço, força
              relativa e volatilidade.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative h-52 w-10 rounded-full border border-zinc-700 bg-zinc-950">
              <div
                className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-rose-500 via-orange-400 to-zinc-800"
                style={{ height: `${tempPercent}%` }}
              />

              <div
                className="absolute left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border-4 border-zinc-950 bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.55)]"
                style={{ bottom: `calc(${tempPercent}% - 16px)` }}
              />

              <div className="absolute -right-10 top-0 text-xs text-zinc-500">
                100
              </div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                0
              </div>
              <div className="absolute -right-10 bottom-0 text-xs text-zinc-500">
                -100
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
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

        <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/30 p-4">
          <div className="mb-3 text-sm font-semibold text-white">
            Força da Tendência
          </div>

          <div className="space-y-2">
            <MetricRow
              label="Curto Prazo"
              value={data.shortTrend}
              valueClassName={trendColor(data.shortTrend)}
            />
            <MetricRow
              label="Médio Prazo"
              value={data.midTrend}
              valueClassName={trendColor(data.midTrend)}
            />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/30 p-4">
          <div className="mb-3 text-sm font-semibold text-white">
            Momento de Mercado
          </div>

          <div className="space-y-2">
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
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/30 p-4">
          <div className="mb-3 text-sm font-semibold text-white">
            Volatilidade e Fluxo
          </div>

          <div className="space-y-2">
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

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 shrink-0">
        <span>Dados quantitativos do ativo</span>
        <span>
          {data.updatedAt
            ? new Date(data.updatedAt).toLocaleTimeString("pt-BR")
            : "—"}
        </span>
      </div>
    </section>
  );
}