import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type Partner = {
  id: number;
  name: string;
  email: string;
  partner_code: string;
  partner_status?: string;
};

type Commission = {
  id: number;
  partner_name?: string;
  partner_code?: string;
  customer_name?: string;
  plan?: string;
  gross_amount: number;
  commission_amount: number;
  status: string;
};

function getToken() {
  return localStorage.getItem("glucks_token") || localStorage.getItem("token") || "";
}

function authHeaders(json = true): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${getToken()}`,
  };

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

function money(value: number): string {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function AdminAffiliatesPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [partnerCode, setPartnerCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [grossAmount, setGrossAmount] = useState("");
  const [plan, setPlan] = useState("mensal");

  async function fetchPartners() {
    const res = await fetch(`${API_URL}/admin/affiliates/partners`, {
      headers: authHeaders(false),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Erro ao carregar afiliados");
    }

    setPartners(data.items || []);
  }

  async function fetchCommissions() {
    const res = await fetch(`${API_URL}/admin/affiliates/commissions`, {
      headers: authHeaders(false),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Erro ao carregar comissões");
    }

    setCommissions(data.items || []);
  }

  async function loadAll() {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchPartners(), fetchCommissions()]);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filteredPartners = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return partners;

    return partners.filter((partner) =>
      [partner.name, partner.email, partner.partner_code].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [partners, search]);

  const stats = useMemo(() => {
    const pending = commissions
      .filter((commission) => commission.status !== "paid")
      .reduce((acc, commission) => acc + Number(commission.commission_amount || 0), 0);

    const paid = commissions
      .filter((commission) => commission.status === "paid")
      .reduce((acc, commission) => acc + Number(commission.commission_amount || 0), 0);

    const gross = commissions.reduce(
      (acc, commission) => acc + Number(commission.gross_amount || 0),
      0
    );

    return {
      totalPartners: partners.length,
      totalCommissions: commissions.length,
      pending,
      paid,
      gross,
    };
  }, [partners, commissions]);

  async function createAffiliate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API_URL}/admin/affiliates/create`, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro ao criar afiliado");
      }

      setName("");
      setEmail("");
      setPassword("");
      setMessage("Afiliado criado com sucesso.");

      await fetchPartners();
    } catch (err: any) {
      setError(err.message || "Erro ao criar afiliado");
    } finally {
      setLoading(false);
    }
  }

  async function createCommission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API_URL}/admin/affiliates/commissions/manual`, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({
          partner_code: partnerCode.trim().toUpperCase(),
          customer_name: customerName,
          gross_amount: Number(grossAmount),
          plan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro ao lançar comissão");
      }

      setPartnerCode("");
      setCustomerName("");
      setGrossAmount("");
      setPlan("mensal");
      setMessage("Comissão lançada com sucesso.");

      await fetchCommissions();
    } catch (err: any) {
      setError(err.message || "Erro ao lançar comissão");
    } finally {
      setLoading(false);
    }
  }

  async function markPaid(id: number) {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API_URL}/admin/affiliates/commissions/${id}/mark-paid`, {
        method: "POST",
        headers: authHeaders(false),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro ao marcar como paga");
      }

      setMessage("Comissão marcada como paga.");
      await fetchCommissions();
    } catch (err: any) {
      setError(err.message || "Erro ao marcar comissão como paga");
    } finally {
      setLoading(false);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard?.writeText(code);
    setMessage(`Código ${code} copiado.`);
  }

  function fillCommission(code: string) {
    setPartnerCode(code);
    setMessage(`Código ${code} enviado para o formulário de comissão.`);
    window.scrollTo({ top: 360, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#063b2b_0,#050505_38%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 rounded-3xl border border-emerald-500/20 bg-black/40 p-6 shadow-2xl shadow-emerald-950/30 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
              ✦ Gluck’s Partner Admin
            </div>

            <h1 className="mt-4 text-3xl font-black md:text-4xl">
              Painel Premium de Afiliados
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Cadastre parceiros manualmente, lance comissões, acompanhe pagamentos e opere seu programa de afiliados com controle total.
            </p>
          </div>

          <button
            onClick={loadAll}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10 disabled:opacity-60"
          >
            ↻ {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </header>

        {message && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard icon="👥" label="Afiliados" value={stats.totalPartners} hint="parceiros cadastrados" />
          <StatCard icon="💸" label="Comissões" value={stats.totalCommissions} hint="lançamentos totais" />
          <StatCard icon="⏳" label="Pendente" value={money(stats.pending)} hint="a pagar" />
          <StatCard icon="✅" label="Pago" value={money(stats.paid)} hint={`Gerado: ${money(stats.gross)}`} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <PremiumCard title="Criar Afiliado" subtitle="Cadastro manual aprovado pela equipe.">
            <form onSubmit={createAffiliate} className="space-y-4">
              <Input label="Nome do afiliado" value={name} onChange={setName} placeholder="Ex: João Trader" required />
              <Input label="E-mail de acesso" type="email" value={email} onChange={setEmail} placeholder="afiliado@email.com" required />
              <Input label="Senha provisória" type="password" value={password} onChange={setPassword} placeholder="Defina uma senha inicial" required />

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300 disabled:opacity-60"
              >
                {loading ? "Processando..." : "Criar Afiliado"}
              </button>
            </form>
          </PremiumCard>

          <PremiumCard title="Lançar Comissão" subtitle="Registre manualmente uma venda confirmada.">
            <form onSubmit={createCommission} className="space-y-4">
              <Input label="Código do afiliado" value={partnerCode} onChange={(value) => setPartnerCode(value.toUpperCase())} placeholder="Ex: TESTE6969" required />

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Cliente" value={customerName} onChange={setCustomerName} placeholder="Nome do cliente" />
                <Input label="Valor da venda" type="number" value={grossAmount} onChange={setGrossAmount} placeholder="197" required />
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Plano</span>
                <select
                  value={plan}
                  onChange={(event) => setPlan(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                >
                  <option value="mensal">Mensal</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                </select>
              </label>

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300 disabled:opacity-60"
              >
                {loading ? "Lançando..." : "Lançar Comissão"}
              </button>
            </form>
          </PremiumCard>
        </section>

        <PremiumCard
          title="Afiliados"
          subtitle="Parceiros aprovados manualmente pela equipe."
          action={
            <div className="relative w-full md:w-80">
              <span className="pointer-events-none absolute left-3 top-3.5 text-zinc-500">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar afiliado, e-mail ou código"
                className="w-full rounded-2xl border border-white/10 bg-black/50 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-emerald-400"
              />
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.18em] text-zinc-500">
                  <th className="py-4">Afiliado</th>
                  <th className="py-4">E-mail</th>
                  <th className="py-4">Código</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="border-b border-white/5">
                    <td className="py-4 font-bold text-white">{partner.name}</td>
                    <td className="py-4 text-zinc-400">{partner.email}</td>
                    <td className="py-4">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                        {partner.partner_code}
                      </span>
                    </td>
                    <td className="py-4">
                      <StatusBadge status={partner.partner_status || "active"} />
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => copyCode(partner.partner_code)}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10"
                        >
                          Copiar código
                        </button>
                        <button
                          onClick={() => fillCommission(partner.partner_code)}
                          className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-black hover:bg-emerald-300"
                        >
                          Lançar comissão
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPartners.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-zinc-500">
                      Nenhum afiliado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </PremiumCard>

        <PremiumCard title="Histórico de Comissões" subtitle="Controle manual de lançamentos e pagamentos.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.18em] text-zinc-500">
                  <th className="py-4">Afiliado</th>
                  <th className="py-4">Código</th>
                  <th className="py-4">Cliente</th>
                  <th className="py-4">Plano</th>
                  <th className="py-4">Venda</th>
                  <th className="py-4">Comissão</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Ação</th>
                </tr>
              </thead>

              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-white/5">
                    <td className="py-4 font-bold text-white">{commission.partner_name || "-"}</td>
                    <td className="py-4 text-emerald-300">{commission.partner_code || "-"}</td>
                    <td className="py-4 text-zinc-300">{commission.customer_name || "-"}</td>
                    <td className="py-4 capitalize text-zinc-400">{commission.plan || "-"}</td>
                    <td className="py-4">{money(commission.gross_amount)}</td>
                    <td className="py-4 font-black text-emerald-300">{money(commission.commission_amount)}</td>
                    <td className="py-4">
                      <StatusBadge status={commission.status} />
                    </td>
                    <td className="py-4">
                      {commission.status !== "paid" ? (
                        <button
                          onClick={() => markPaid(commission.id)}
                          className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-black text-black hover:bg-emerald-300"
                        >
                          Marcar pago
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-500">Finalizado</span>
                      )}
                    </td>
                  </tr>
                ))}

                {commissions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-zinc-500">
                      Nenhuma comissão lançada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function PremiumCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-black text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
        </div>
        {action}
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
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400"
      />
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = String(status || "").toLowerCase();

  const style =
    normalized === "paid" || normalized === "active"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : normalized === "pending"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
      : "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black ${style}`}>
      {status || "-"}
    </span>
  );
}