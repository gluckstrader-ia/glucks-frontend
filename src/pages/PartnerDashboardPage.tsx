import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Carregando dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Nenhum dado encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard do Afiliado</h1>
          <p className="mt-2 text-zinc-400">
            Código:{" "}
            <span className="font-bold text-emerald-400">
              {data.partner_code}
            </span>
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <p className="mb-2 text-sm text-zinc-400">Seu link de divulgação</p>

          <div className="flex gap-3">
            <input
              value={data.partner_link || ""}
              readOnly
              className="flex-1 rounded border border-zinc-700 bg-black p-3 text-sm text-white"
            />

            <button
              onClick={() => navigator.clipboard.writeText(data.partner_link || "")}
              className="rounded bg-emerald-500 px-4 font-bold text-black"
            >
              Copiar
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Metric title="Cliques" value={data.metrics?.clicks || 0} />
          <Metric title="Cadastros" value={data.metrics?.referred_users || 0} />
          <Metric title="Clientes ativos" value={data.metrics?.active_customers || 0} />
          <Metric title="Pendente" value={money(data.metrics?.pending_amount || 0)} />
          <Metric title="Disponível" value={money(data.metrics?.available_amount || 0)} />
          <Metric title="Pago" value={money(data.metrics?.paid_amount || 0)} />
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold">Comissões recentes</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="text-left text-zinc-400">
                  <th className="py-3">Plano</th>
                  <th className="py-3">Venda</th>
                  <th className="py-3">Comissão</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Data</th>
                </tr>
              </thead>

              <tbody>
                {(data.recent_commissions || []).map((c: any) => (
                  <tr key={c.id} className="border-t border-zinc-800">
                    <td className="py-3">{c.plan || "-"}</td>
                    <td className="py-3">{money(c.gross_amount)}</td>
                    <td className="py-3 font-bold text-emerald-400">
                      {money(c.commission_amount)}
                    </td>
                    <td className="py-3">{c.status}</td>
                    <td className="py-3">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                  </tr>
                ))}

                {(data.recent_commissions || []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-zinc-500">
                      Nenhuma comissão lançada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold">Dados de pagamento</h2>

          <p className="text-sm text-zinc-400">
            Chave Pix: {data.pix_key || "Não cadastrada"}
          </p>

          <p className="text-sm text-zinc-400">
            Tipo: {data.pix_type || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-xl bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-emerald-400">{value}</p>
    </div>
  );
}