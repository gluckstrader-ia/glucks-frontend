import { useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  Gauge,
  RefreshCw,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { useRealtimePerformance } from "./useRealtimePerformance";
import type { PerformanceFilters, } from "./useRealtimePerformance";

function fmt(value?: number | null, suffix = "") {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}${suffix}`;
}

function Card({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/35 p-3">
      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-lg font-black text-white">{value}</div>
      <div className="mt-1 text-[9px] text-zinc-600">{detail}</div>
    </div>
  );
}

export default function RealtimePerformancePanel() {
  const [filters, setFilters] = useState<PerformanceFilters>({
    days: 7,
    symbol: "ALL",
    signal: "ALL",
  });
  const stableFilters = useMemo(() => filters, [filters]);
  const { performance, settings, loading, error, reload, exportUrl } =
    useRealtimePerformance(stableFilters, 30000);
  const overall = performance?.overall;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3 md:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2.5 text-cyan-300">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Calibração quantitativa</div>
            <h4 className="mt-1 text-lg font-black text-white">Desempenho do motor</h4>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-500">
              Comparação dos sinais registrados por ativo, direção, horizonte e módulo.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filters.days}
            onChange={(event) => setFilters((current) => ({ ...current, days: Number(event.target.value) }))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[10px] font-bold text-zinc-300"
          >
            <option value={1}>24 horas</option><option value={7}>7 dias</option><option value={30}>30 dias</option><option value={90}>90 dias</option>
          </select>
          <select
            value={filters.symbol}
            onChange={(event) => setFilters((current) => ({ ...current, symbol: event.target.value as PerformanceFilters["symbol"] }))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[10px] font-bold text-zinc-300"
          >
            <option value="ALL">Todos os ativos</option><option value="WINFUT">WIN</option><option value="WDOFUT">WDO</option>
          </select>
          <select
            value={filters.signal}
            onChange={(event) => setFilters((current) => ({ ...current, signal: event.target.value as PerformanceFilters["signal"] }))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[10px] font-bold text-zinc-300"
          >
            <option value="ALL">Compra e venda</option><option value="COMPRA">Compra</option><option value="VENDA">Venda</option>
          </select>
          <button type="button" onClick={reload} className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-400" title="Atualizar">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <a href={exportUrl} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[10px] font-black text-emerald-300">
            <Download className="h-3.5 w-3.5" /> CSV
          </a>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
        <Card label="Eventos" value={String(overall?.totalEvents ?? 0)} detail="Registros no filtro atual" />
        <Card label="Encerrados" value={String(overall?.closedEvents ?? 0)} detail="Base estatística concluída" />
        <Card label="Taxa direcional" value={fmt(overall?.directionalRate, "%")} detail="Resultados positivos" />
        <Card label="Média por evento" value={fmt(overall?.averageResultPoints, " pts")} detail="Resultado direcional" />
        <Card label="Resultado acumulado" value={fmt(overall?.totalResultPoints, " pts")} detail="Soma dos eventos encerrados" />
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
          <div className="flex items-center gap-2 text-xs font-black text-white"><Target className="h-4 w-4 text-violet-300" /> Horizontes</div>
          <div className="mt-3 space-y-2">
            {(performance?.checkpoints ?? []).map((item) => (
              <div key={item.minutes} className="grid grid-cols-3 items-center rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-[10px]">
                <span className="font-black text-zinc-300">{item.minutes} min</span>
                <span className="text-center text-zinc-500">{item.samples} amostras</span>
                <span className="text-right font-mono font-black text-cyan-300">{fmt(item.directionalRate, "%")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
          <div className="flex items-center gap-2 text-xs font-black text-white"><BarChart3 className="h-4 w-4 text-cyan-300" /> Ativo e direção</div>
          <div className="mt-3 space-y-2">
            {[...(performance?.bySymbol ?? []), ...(performance?.bySignal ?? [])].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-[10px]">
                <span className="font-black text-zinc-300">{item.label}</span>
                <span className="text-zinc-500">{item.closedEvents} encerrados</span>
                <span className="font-mono font-black text-cyan-300">{fmt(item.directionalRate, "%")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
          <div className="flex items-center gap-2 text-xs font-black text-white"><SlidersHorizontal className="h-4 w-4 text-amber-300" /> Pesos ativos</div>
          <div className="mt-3 space-y-2">
            {settings && Object.entries(settings.weights).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-[10px]">
                <span className="font-black uppercase text-zinc-300">{key}</span>
                <span className="font-mono font-black text-amber-300">{fmt(value * 100, "%")}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[9px] text-zinc-600">Revisão do motor: r{settings?.revision ?? "—"}</div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800 bg-black/30">
        <table className="min-w-full text-left text-[10px]">
          <thead className="border-b border-zinc-800 text-zinc-500"><tr><th className="px-3 py-2">Módulo</th><th className="px-3 py-2">Amostras alinhadas</th><th className="px-3 py-2">Taxa direcional</th><th className="px-3 py-2">Média</th><th className="px-3 py-2">Score médio</th></tr></thead>
          <tbody>
            {(performance?.modules ?? []).map((item) => (
              <tr key={item.key} className="border-b border-zinc-900 last:border-0">
                <td className="px-3 py-2 font-black text-zinc-300">{item.key} <span className="font-normal text-zinc-600">· {item.label}</span></td>
                <td className="px-3 py-2 text-zinc-500">{item.alignedSamples}</td>
                <td className="px-3 py-2 font-mono font-black text-cyan-300">{fmt(item.directionalRate, "%")}</td>
                <td className="px-3 py-2 font-mono text-zinc-400">{fmt(item.averageResultPoints, " pts")}</td>
                <td className="px-3 py-2 font-mono text-zinc-400">{fmt(item.averageScore)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2 text-[10px] text-amber-200">{error}</div>}
      <div className="mt-3 text-[9px] leading-4 text-zinc-600">
        As métricas são experimentais e dependem do volume de amostras. Elas não representam promessa de resultado financeiro.
      </div>
    </section>
  );
}
