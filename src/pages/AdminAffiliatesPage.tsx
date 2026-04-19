import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type Overview = {
  total_partners: number;
  total_commissions: number;
  pending_amount: number;
  available_amount: number;
  paid_amount: number;
};

type Commission = {
  id: number;
  partner_user_id: number;
  partner_name: string | null;
  partner_email: string | null;
  partner_code: string | null;
  customer_user_id: number;
  plan: string;
  gross_amount: number;
  commission_percent: number;
  commission_amount: number;
  status: string;
  billing_cycle: string;
  payment_reference: string | null;
  created_at: string | null;
  available_at: string | null;
  paid_at: string | null;
};

export default function AdminAffiliatesPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPayId, setLoadingPayId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData(currentFilter = statusFilter) {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const overviewRes = await fetch(`${API_URL}/admin/affiliates/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const overviewJson = await overviewRes.json();

      if (!overviewRes.ok) {
        throw new Error(overviewJson.detail || "Erro ao carregar resumo.");
      }

      const commissionsUrl = currentFilter
        ? `${API_URL}/admin/affiliates/commissions?status_filter=${encodeURIComponent(currentFilter)}`
        : `${API_URL}/admin/affiliates/commissions`;

      const commissionsRes = await fetch(commissionsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const commissionsJson = await commissionsRes.json();

      if (!commissionsRes.ok) {
        throw new Error(commissionsJson.detail || "Erro ao carregar comissões.");
      }

      setOverview(overviewJson);
      setCommissions(commissionsJson.items || []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar página de afiliados.");
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid(commissionId: number) {
    try {
      setLoadingPayId(commissionId);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/admin/affiliates/commissions/${commissionId}/mark-paid`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "Erro ao marcar comissão como paga.");
      }

      setMessage("Comissão marcada como paga com sucesso.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar comissão.");
    } finally {
      setLoadingPayId(null);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function applyFilter(nextFilter: string) {
    setStatusFilter(nextFilter);
    await loadData(nextFilter);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-white">
        <div className="mx-auto max-w-7xl rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          Carregando afiliados...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="text-sm uppercase tracking-[0.2em] text-emerald-400">
            Administração
          </div>
          <h1 className="mt-2 text-3xl font-black">Controle de afiliados</h1>
          <p className="mt-2 text-zinc-400">
            Gerencie parceiros, acompanhe comissões e marque repasses como pagos.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 text-emerald-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-red-400">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Parceiros"
            value={String(overview?.total_partners || 0)}
          />
          <StatCard
            title="Comissões"
            value={String(overview?.total_commissions || 0)}
          />
          <StatCard
            title="Pendentes"
            value={`R$ ${(overview?.pending_amount || 0).toFixed(2)}`}
          />
          <StatCard
            title="Disponíveis"
            value={`R$ ${(overview?.available_amount || 0).toFixed(2)}`}
          />
          <StatCard
            title="Pagas"
            value={`R$ ${(overview?.paid_amount || 0).toFixed(2)}`}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Comissões</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Filtre e acompanhe os repasses do programa de parceiros.
              </p>
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => applyFilter(e.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white"
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="available">Disponíveis</option>
                <option value="paid">Pagas</option>
                <option value="canceled">Canceladas</option>
              </select>
            </div>
          </div>

          {commissions.length === 0 ? (
            <p className="mt-6 text-zinc-400">Nenhuma comissão encontrada.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-4">Parceiro</th>
                    <th className="px-4">Plano</th>
                    <th className="px-4">Venda</th>
                    <th className="px-4">Comissão</th>
                    <th className="px-4">Status</th>
                    <th className="px-4">Ciclo</th>
                    <th className="px-4">Data</th>
                    <th className="px-4">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((item) => (
                    <tr key={item.id} className="rounded-2xl bg-zinc-950">
                      <td className="rounded-l-2xl px-4 py-4 align-top">
                        <div className="font-semibold text-white">
                          {item.partner_name || "Parceiro"}
                        </div>
                        <div className="text-sm text-zinc-400">
                          {item.partner_email || "-"}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-emerald-400">
                          {item.partner_code || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top text-zinc-300">
                        {item.plan}
                      </td>

                      <td className="px-4 py-4 align-top text-zinc-300">
                        R$ {item.gross_amount.toFixed(2)}
                      </td>

                      <td className="px-4 py-4 align-top font-bold text-emerald-400">
                        R$ {item.commission_amount.toFixed(2)}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                            item.status
                          )}`}
                        >
                          {labelStatus(item.status)}
                        </span>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-zinc-400">
                        {item.billing_cycle === "first_payment"
                          ? "Primeira venda"
                          : "Recorrente"}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-zinc-400">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "-"}
                      </td>

                      <td className="rounded-r-2xl px-4 py-4 align-top">
                        {item.status !== "paid" ? (
                          <button
                            onClick={() => markAsPaid(item.id)}
                            disabled={loadingPayId === item.id}
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
                          >
                            {loadingPayId === item.id
                              ? "Salvando..."
                              : "Marcar como paga"}
                          </button>
                        ) : (
                          <span className="text-sm font-semibold text-zinc-500">
                            Pago
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function labelStatus(status: string) {
  if (status === "pending") return "Pendente";
  if (status === "available") return "Disponível";
  if (status === "paid") return "Paga";
  if (status === "canceled") return "Cancelada";
  return status;
}

function statusClass(status: string) {
  if (status === "pending") {
    return "border-amber-400/20 bg-amber-500/10 text-amber-300";
  }

  if (status === "available") {
    return "border-cyan-400/20 bg-cyan-500/10 text-cyan-300";
  }

  if (status === "paid") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  return "border-zinc-400/20 bg-zinc-500/10 text-zinc-300";
}