import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  LoaderCircle,
  PauseCircle,
  WifiOff,
} from "lucide-react";
import RealtimeFuturePanel from "./RealtimeFuturePanel";
import RealtimeSignalAudit from "./RealtimeSignalAudit";
import RealtimePerformancePanel from "./RealtimePerformancePanel";
import type { RealtimeMarketStatus } from "./types";
import { useRealtimeFutures } from "./useRealtimeFutures";

type ErrorBoundaryState = {
  hasError: boolean;
};

class RealtimeFuturesErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[RealtimeFuturesDashboard] Falha isolada:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-4 text-sm text-red-200">
          O painel complementar de futuros não pôde ser exibido. O restante do
          dashboard continua funcionando normalmente.
        </section>
      );
    }

    return this.props.children;
  }
}

function formatUpdatedAt(value?: string) {
  if (!value) return "Sem atualização";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Horário indisponível";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(parsed);
}

function statusMessage(status: RealtimeMarketStatus, hasSnapshot: boolean) {
  if (!hasSnapshot) {
    return "Aguardando o primeiro snapshot válido do mercado.";
  }

  switch (status) {
    case "OPEN":
      return "Mercado aberto · dados atualizados em tempo real.";
    case "STALE":
      return "Dados temporariamente indisponíveis · último snapshot real mantido.";
    case "CLOSED":
      return "Mercado fechado · último snapshot do pregão permanece visível.";
    case "PRE_OPEN":
      return "Pré-abertura · último snapshot disponível permanece visível.";
    default:
      return "Conexão indisponível · último snapshot real mantido.";
  }
}

function StatusBadge({
  status,
  connected,
  hasSnapshot,
  loading,
}: {
  status: RealtimeMarketStatus;
  connected: boolean;
  hasSnapshot: boolean;
  loading: boolean;
}) {
  if (loading && !hasSnapshot) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-400">
        <LoaderCircle className="h-3 w-3 animate-spin" /> Conectando
      </span>
    );
  }

  if (!connected) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-amber-300">
        <WifiOff className="h-3 w-3" /> Reconectando
      </span>
    );
  }

  if (status === "OPEN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-300">
        <CheckCircle2 className="h-3 w-3" /> Dados ao vivo
      </span>
    );
  }

  if (status === "STALE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-amber-300">
        <AlertTriangle className="h-3 w-3" /> Dados em espera
      </span>
    );
  }

  if (status === "CLOSED" || status === "PRE_OPEN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-600 bg-zinc-900 px-3 py-1.5 text-zinc-300">
        <PauseCircle className="h-3 w-3" />
        {status === "CLOSED" ? "Mercado fechado" : "Pré-abertura"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-red-300">
      <WifiOff className="h-3 w-3" /> Conexão indisponível
    </span>
  );
}

function RealtimeFuturesDashboardContent() {
  const { data, loading, error, connected } = useRealtimeFutures(5000);
  const instruments = data?.instruments ?? [];
  const hasSnapshot = instruments.length > 0;
  const marketStatus = data?.marketStatus ?? "DISCONNECTED";

  return (
    <section className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-3 md:p-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2.5 text-cyan-300">
            <Database className="h-5 w-5" />
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
              Módulo complementar
            </div>
            <h3 className="mt-1 text-xl font-black text-white">
              Fluxo de Futuros em Tempo Real
            </h3>
            <p className="mt-1 max-w-4xl text-sm leading-6 text-zinc-400">
              Preço e fluxo atualizados a cada cinco segundos, com leitura
              quantitativa transparente e independente da análise manual.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 text-[9px] font-black uppercase tracking-[0.12em]">
          <StatusBadge
            status={marketStatus}
            connected={connected}
            hasSnapshot={hasSnapshot}
            loading={loading}
          />

          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-400">
            Atualização 5s
          </span>
        </div>
      </div>

      {error && hasSnapshot && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] px-4 py-3 text-xs leading-5 text-amber-200">
          O serviço está se reconectando. O último snapshot real foi mantido sem
          substituição por dados demonstrativos.
        </div>
      )}

      {hasSnapshot ? (
        <>
          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
            {instruments.map((future) => (
              <RealtimeFuturePanel
                key={future.symbol}
                future={future}
                live
                marketStatus={marketStatus}
              />
            ))}
          </div>
          <RealtimeSignalAudit />
          <RealtimePerformancePanel />
        </>
      ) : (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-black/30 px-6 py-10 text-center">
          {loading ? (
            <LoaderCircle className="h-7 w-7 animate-spin text-cyan-300" />
          ) : (
            <AlertTriangle className="h-7 w-7 text-amber-300" />
          )}
          <div className="mt-3 text-base font-black text-white">
            Aguardando dados do mercado
          </div>
          <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-500">
            O painel será preenchido quando o serviço receber o primeiro snapshot
            válido. Nenhum valor fictício será exibido.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{statusMessage(marketStatus, hasSnapshot)}</span>
        <span className="inline-flex items-center gap-2 text-zinc-600">
          <Clock className="h-3.5 w-3.5" /> Último dado: {formatUpdatedAt(data?.updatedAt)}
        </span>
      </div>
    </section>
  );
}

export default function RealtimeFuturesDashboard() {
  return (
    <RealtimeFuturesErrorBoundary>
      <RealtimeFuturesDashboardContent />
    </RealtimeFuturesErrorBoundary>
  );
}
