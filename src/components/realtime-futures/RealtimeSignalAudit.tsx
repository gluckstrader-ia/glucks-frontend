import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  LoaderCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { SignalHistoryItem } from "./types";
import { useRealtimeSignalHistory } from "./useRealtimeSignalHistory";

function formatTime(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(parsed);
}

function formatPoints(value?: number | null, decimals = 1) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} pts`;
}

function currentResult(item: SignalHistoryItem) {
  if (typeof item.resultPoints === "number") return item.resultPoints;
  const movement = item.lastPrice - item.entryPrice;
  return item.signal === "COMPRA" ? movement : -movement;
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/35 px-3 py-3">
      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-lg font-black text-white">{value}</div>
      <div className="mt-1 text-[9px] text-zinc-600">{detail}</div>
    </div>
  );
}

function EventRow({ item }: { item: SignalHistoryItem }) {
  const isBuy = item.signal === "COMPRA";
  const result = currentResult(item);
  const positive = result > 0;
  const decimals = item.symbol === "WDOFUT" ? 1 : 0;

  return (
    <div className="rounded-xl border border-zinc-800 bg-black/35 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              isBuy
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/20 bg-red-400/10 text-red-300"
            }`}
          >
            {isBuy ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black text-white">
                {item.symbol}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[8px] font-black ${
                  isBuy
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-red-400/20 bg-red-400/10 text-red-300"
                }`}
              >
                {item.signal}
              </span>
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[8px] font-black text-zinc-400">
                {item.status === "OPEN" ? "EM OBSERVAÇÃO" : "ENCERRADO"}
              </span>
            </div>
            <div className="mt-1 text-[9px] text-zinc-600">
              Entrada {item.entryPrice.toLocaleString("pt-BR")} · {formatTime(item.openedAt)} · confiança {item.entryConfidence}%
            </div>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`font-mono text-sm font-black ${
              positive
                ? "text-emerald-400"
                : result < 0
                  ? "text-red-400"
                  : "text-zinc-400"
            }`}
          >
            {formatPoints(result, decimals)}
          </div>
          <div className="mt-1 text-[8px] text-zinc-600">
            favorável {formatPoints(item.maxFavorablePoints, decimals)} · adverso {formatPoints(item.maxAdversePoints, decimals)}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {item.checkpoints.map((checkpoint) => (
          <div
            key={checkpoint.minutes}
            className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-2 py-2 text-center"
          >
            <div className="text-[8px] font-black uppercase tracking-[0.12em] text-zinc-600">
              {checkpoint.minutes} min
            </div>
            <div
              className={`mt-1 font-mono text-[10px] font-black ${
                checkpoint.favorable === true
                  ? "text-emerald-400"
                  : checkpoint.favorable === false
                    ? "text-red-400"
                    : "text-zinc-500"
              }`}
            >
              {formatPoints(checkpoint.resultPoints, decimals)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RealtimeSignalAudit() {
  const { history, stats, loading, error } = useRealtimeSignalHistory(15000);
  const items = history?.items ?? [];
  const rate = stats?.directionalRate;
  const sampleLabel =
    stats?.sampleStatus === "AMOSTRA_FORMADA"
      ? "Amostra formada"
      : stats?.sampleStatus === "AMOSTRA_INICIAL"
        ? "Amostra inicial"
        : "Coletando amostras";

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3 md:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 p-2.5 text-violet-300">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
              Validação operacional
            </div>
            <h4 className="mt-1 text-lg font-black text-white">
              Auditoria de sinais
            </h4>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-500">
              Registra entradas direcionais e acompanha o comportamento do preço em 5, 15 e 30 minutos, sem enviar ordens.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-violet-300">
          <Database className="h-3 w-3" /> {sampleLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <StatCard
          label="Sinais registrados"
          value={String(stats?.totalEvents ?? 0)}
          detail="Janela das últimas 24 horas"
        />
        <StatCard
          label="Encerrados"
          value={String(stats?.closedEvents ?? 0)}
          detail="Horizonte ou inversão concluída"
        />
        <StatCard
          label="Taxa direcional"
          value={typeof rate === "number" ? `${rate.toFixed(1)}%` : "—"}
          detail="Somente eventos já encerrados"
        />
        <StatCard
          label="Em observação"
          value={String(stats?.activeEvents ?? 0)}
          detail="Acompanhamento sem execução"
        />
      </div>

      {loading && items.length === 0 ? (
        <div className="mt-4 flex min-h-32 items-center justify-center rounded-xl border border-zinc-800 bg-black/30">
          <LoaderCircle className="h-6 w-6 animate-spin text-violet-300" />
        </div>
      ) : items.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-2 xl:grid-cols-2">
          {items.slice(0, 8).map((item) => (
            <EventRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex min-h-32 flex-col items-center justify-center rounded-xl border border-zinc-800 bg-black/30 px-4 text-center">
          <Activity className="h-6 w-6 text-zinc-600" />
          <div className="mt-2 text-sm font-black text-zinc-300">
            Nenhum sinal direcional registrado ainda
          </div>
          <div className="mt-1 text-xs text-zinc-600">
            A auditoria começará automaticamente quando o motor emitir COMPRA ou VENDA.
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2 text-[10px] text-amber-200">
          A auditoria está se reconectando; os registros já salvos foram preservados.
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2 rounded-xl border border-zinc-800 bg-black/30 px-3 py-2 text-[9px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3" /> Registro local em SQLite
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3 w-3" /> Atualização da auditoria a cada 15 segundos
        </span>
      </div>
    </section>
  );
}
