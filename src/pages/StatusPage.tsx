import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  CreditCard,
  Gauge,
  Home,
  Lock,
  Server,
  ShieldCheck,
  Wifi,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

type ServiceStatus = "online" | "warning" | "offline";

type ServiceItem = {
  name: string;
  description: string;
  status: ServiceStatus;
  icon: React.ElementType;
};

const SYSTEM_STATUS: ServiceStatus = "online";

const services: ServiceItem[] = [
  {
    name: "Plataforma Gluck's Trader IA",
    description: "Acesso principal ao sistema, páginas premium e navegação.",
    status: "online",
    icon: Gauge,
  },
  {
    name: "Login e Cadastro",
    description: "Autenticação, criação de conta e acesso de usuários.",
    status: "online",
    icon: Lock,
  },
  {
    name: "Dashboard IA",
    description: "Análises, sinal final, leitura de mercado e painéis operacionais.",
    status: "online",
    icon: Activity,
  },
  {
    name: "Dados de Mercado",
    description: "Cotações, ativos, atualizações e integração com dados externos.",
    status: "online",
    icon: Database,
  },
  {
    name: "Pagamentos",
    description: "Checkout, planos, liberação manual e validação de assinaturas.",
    status: "online",
    icon: CreditCard,
  },
  {
    name: "Servidor Backend",
    description: "API, banco de dados, autenticação e serviços internos.",
    status: "online",
    icon: Server,
  },
];

const incidents = [
  {
    title: "Nenhum incidente crítico no momento",
    description:
      "Todos os principais serviços da Gluck's Trader IA estão operando normalmente.",
    date: "Atualizado agora",
    status: "online" as ServiceStatus,
  },
];

function getStatusLabel(status: ServiceStatus) {
  if (status === "online") return "Online";
  if (status === "warning") return "Instabilidade parcial";
  return "Offline";
}

function getStatusClasses(status: ServiceStatus) {
  if (status === "online") {
    return {
      text: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/10",
      icon: CheckCircle2,
    };
  }

  if (status === "warning") {
    return {
      text: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      glow: "shadow-amber-500/10",
      icon: AlertTriangle,
    };
  }

  return {
    text: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "shadow-red-500/10",
    icon: XCircle,
  };
}

export default function StatusPage() {
  const mainStatus = getStatusClasses(SYSTEM_STATUS);
  const MainStatusIcon = mainStatus.icon;

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-120px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-80px] h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/home-premium"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition hover:border-cyan-400/40 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Voltar para a plataforma
          </Link>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
            <Clock className="h-4 w-4" />
            Última atualização: agora
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-cyan-500/5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${mainStatus.bg} ${mainStatus.border} ${mainStatus.text}`}
              >
                <MainStatusIcon className="h-4 w-4" />
                Status geral: {getStatusLabel(SYSTEM_STATUS)}
              </div>

              <h1 className="max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Status do Sistema Gluck&apos;s Trader IA
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
                Acompanhe em tempo real a disponibilidade dos principais
                serviços da plataforma. Em caso de instabilidade, esta página
                será atualizada para informar o impacto e o andamento da
                correção.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-cyan-400/20 bg-black/40 p-5 shadow-2xl shadow-cyan-500/10">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm text-zinc-400">Ambiente monitorado</p>
                  <h2 className="text-xl font-bold text-white">
                    Operação Normal
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Wifi className="mb-3 h-5 w-5 text-emerald-300" />
                  <p className="text-xs text-zinc-400">Conectividade</p>
                  <p className="mt-1 font-bold text-white">Estável</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Server className="mb-3 h-5 w-5 text-cyan-300" />
                  <p className="text-xs text-zinc-400">API</p>
                  <p className="mt-1 font-bold text-white">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const status = getStatusClasses(service.status);
            const StatusIcon = status.icon;
            const ServiceIcon = service.icon;

            return (
              <div
                key={service.name}
                className={`rounded-[1.5rem] border bg-white/[0.03] p-5 shadow-xl ${status.border} ${status.glow}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                    <ServiceIcon className="h-6 w-6 text-cyan-300" />
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${status.bg} ${status.border} ${status.text}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {getStatusLabel(service.status)}
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  {service.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {service.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">
                Histórico de Incidentes
              </h2>
              <p className="text-sm text-zinc-400">
                Comunicados sobre instabilidades, manutenções e normalizações.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {incidents.map((incident) => {
              const status = getStatusClasses(incident.status);
              const IncidentIcon = status.icon;

              return (
                <div
                  key={incident.title}
                  className="rounded-[1.25rem] border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <IncidentIcon className={`h-5 w-5 ${status.text}`} />
                      <h3 className="font-bold text-white">
                        {incident.title}
                      </h3>
                    </div>

                    <span className="text-sm text-zinc-500">
                      {incident.date}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {incident.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}