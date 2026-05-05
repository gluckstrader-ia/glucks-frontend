import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type Commission = {
  id: number;
  plan?: string;
  gross_amount?: number;
  commission_amount?: number;
  status?: string;
  billing_cycle?: string;
  created_at?: string;
};

type DashboardData = {
  partner_code: string;
  partner_link: string;
  pix_key?: string | null;
  pix_type?: string | null;
  metrics: {
    clicks: number;
    referred_users: number;
    active_customers: number;
    pending_amount: number;
    available_amount: number;
    paid_amount: number;
  };
  recent_commissions: Commission[];
};

function getToken() {
  return localStorage.getItem("glucks_token") || localStorage.getItem("token") || "";
}

function money(value: number) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PartnerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function fetchDashboard() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/partners/dashboard`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "Erro ao carregar dashboard");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalGenerated = useMemo(() => {
    if (!data) return 0;

    return (data.recent_commissions || []).reduce(
      (acc, item) => acc + Number(item.gross_amount || 0),
      0
    );
  }, [data]);

  function copyLink() {
    if (!data?.partner_link) return;

    navigator.clipboard.writeText(data.partner_link);
    setCopied(true);

    setTimeout(() => setCopied(false), 1800);
  }

  function logout() {
    localStorage.removeItem("glucks_token");
    localStorage.removeItem("token");
    localStorage.removeItem("glucks_user");
    localStorage.removeItem("user");
    window.location.href = "/affiliate-login";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="rounded-3xl border border-emerald-500/20 bg-zinc-950 p-8 text-center shadow-2xl shadow-emerald-950/30">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <p className="font-bold text-zinc-300">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <div className="max-w-md rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
          <h1 className="text-xl font-black">Erro ao carregar painel</h1>
          <p className="mt-2 text-sm">{error || "Nenhum dado encontrado."}</p>

          <button
            onClick={fetchDashboard}
            className="mt-5 rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const metrics = data.metrics || {
    clicks: 0,
    referred_users: 0,
    active_customers: 0,
    pending_amount: 0,
    available_amount: 0,
    paid_amount: 0,
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#063b2b_0,#050505_38%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-emerald-500/20 bg-black/40 p-6 shadow-2xl shadow-emerald-950/30">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                ✦ Gluck’s Partner
              </div>

              <h1 className="mt-4 text-3xl font-black md:text-4xl">
                Dashboard do Afiliado
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Acompanhe suas indicações, comissões e pagamentos em tempo real.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Seu código
                </p>
                <p className="text-2xl font-black text-emerald-300">
                  {data.partner_code}
                </p>
              </div>

              <button
                onClick={logout}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40">
          <div className="mb-5">
            <h2 className="text-xl font-black">Seu link de divulgação</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Envie este link para sua audiência. Toda venda lançada com seu código aparecerá aqui.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={data.partner_link || ""}
              readOnly
              className="flex-1 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none"
            />

            <button
              onClick={copyLink}
              className="rounded-2xl bg-emerald-400 px-6 py-3 font-black text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-300"
            >
              {copied ? "Copiado!" : "Copiar link"}
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard icon="👁️" label="Cliques" value={metrics.clicks} hint="acessos pelo seu link" />
          <StatCard icon="🧲" label="Cadastros" value={metrics.referred_users} hint="leads indicados" />
          <StatCard icon="✅" label="Clientes ativos" value={metrics.active_customers} hint="clientes liberados" />
          <StatCard icon="⏳" label="Pendente" value={money(metrics.pending_amount)} hint="aguardando liberação" />
          <StatCard icon="💎" label="Disponível" value={money(metrics.available_amount)} hint="pronto para pagamento" />
          <StatCard icon="💰" label="Pago" value={money(metrics.paid_amount)} hint="total já pago" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <PremiumCard title="Comissões recentes" subtitle="Histórico das vendas lançadas pela equipe.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.18em] text-zinc-500">
                    <th className="py-4">Plano</th>
                    <th className="py-4">Venda</th>
                    <th className="py-4">Comissão</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Data</th>
                  </tr>
                </thead>

                <tbody>
                  {(data.recent_commissions || []).map((commission) => (
                    <tr key={commission.id} className="border-b border-white/5">
                      <td className="py-4 capitalize text-zinc-300">
                        {commission.plan || "-"}
                      </td>

                      <td className="py-4 text-white">
                        {money(Number(commission.gross_amount || 0))}
                      </td>

                      <td className="py-4 font-black text-emerald-300">
                        {money(Number(commission.commission_amount || 0))}
                      </td>

                      <td className="py-4">
                        <StatusBadge status={commission.status || "pending"} />
                      </td>

                      <td className="py-4 text-zinc-400">
                        {commission.created_at
                          ? new Date(commission.created_at).toLocaleDateString("pt-BR")
                          : "-"}
                      </td>
                    </tr>
                  ))}

                  {(data.recent_commissions || []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-zinc-500">
                        Nenhuma comissão lançada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PremiumCard>

          <div className="space-y-6">
            <PremiumCard title="Resumo financeiro" subtitle="Visão rápida das suas indicações.">
              <div className="space-y-4">
                <InfoLine label="Total gerado em vendas" value={money(totalGenerated)} />
                <InfoLine label="Comissão padrão" value="10%" />
                <InfoLine label="Código" value={data.partner_code} />
              </div>
            </PremiumCard>

            <PremiumCard title="Dados de pagamento" subtitle="Informações usadas para repasse.">
              <div className="space-y-4">
                <InfoLine label="Chave Pix" value={data.pix_key || "Não cadastrada"} />
                <InfoLine label="Tipo Pix" value={data.pix_type || "-"} />

                <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-5 text-amber-200">
                  Para alterar os dados de pagamento, solicite atualização pelo WhatsApp da equipe.
                </p>
              </div>
            </PremiumCard>

            <PremiumCard title="Como divulgar" subtitle="Guia rápido para vender mais.">
              <ul className="space-y-3 text-sm text-zinc-400">
                <li>• Envie seu link nos stories, grupos e WhatsApp.</li>
                <li>• Explique que a plataforma possui teste gratuito.</li>
                <li>• Use provas, prints e demonstrações ao vivo.</li>
                <li>• Quanto mais leads qualificados, maior sua comissão.</li>
              </ul>
            </PremiumCard>
          </div>
        </section>
      </div>
    </div>
  );
}

function PremiumCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40">
      <div className="mb-6">
        <h2 className="text-xl font-black text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>

      {children}
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-emerald-500/10 bg-zinc-950/80 p-5 shadow-xl shadow-black/30">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-xl text-emerald-300">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {hint}
      </p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-black text-emerald-300">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = String(status || "").toLowerCase();

  const style =
    normalized === "paid" || normalized === "active"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : normalized === "available"
      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
      : normalized === "pending"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
      : "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";

  const label =
    normalized === "paid"
      ? "Pago"
      : normalized === "available"
      ? "Disponível"
      : normalized === "pending"
      ? "Pendente"
      : status || "-";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black ${style}`}>
      {label}
    </span>
  );
}