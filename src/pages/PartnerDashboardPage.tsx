import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function PartnerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboard() {
    try {
      const res = await fetch(`${API_URL}/partners/dashboard`, {
        credentials: "include",
      });

      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Erro ao carregar dashboard
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard do Afiliado</h1>

      {/* LINK */}
      <div className="bg-zinc-900 p-5 rounded-xl">
        <p className="text-sm text-zinc-400 mb-2">Seu link de indicação</p>
        <div className="flex gap-2">
          <input
            value={data.partner_link}
            readOnly
            className="flex-1 p-3 bg-black border border-zinc-700 rounded text-xs"
          />
          <button
            onClick={() => navigator.clipboard.writeText(data.partner_link)}
            className="bg-emerald-500 px-4 rounded text-black font-bold"
          >
            Copiar
          </button>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Metric title="Cliques" value={data.metrics.clicks} />
        <Metric title="Cadastros" value={data.metrics.referred_users} />
        <Metric title="Ativos" value={data.metrics.active_customers} />
        <Metric title="Pendente" value={`R$ ${data.metrics.pending_amount}`} />
        <Metric title="Disponível" value={`R$ ${data.metrics.available_amount}`} />
        <Metric title="Pago" value={`R$ ${data.metrics.paid_amount}`} />
      </div>

      {/* COMISSÕES */}
      <div className="bg-zinc-900 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Comissões recentes</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-400">
              <th>Plano</th>
              <th>Venda</th>
              <th>Comissão</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            {data.recent_commissions.map((c: any) => (
              <tr key={c.id} className="border-t border-zinc-800">
                <td>{c.plan}</td>
                <td>R$ {c.gross_amount}</td>
                <td className="text-emerald-400">
                  R$ {c.commission_amount}
                </td>
                <td>
                  <span className="px-2 py-1 rounded bg-zinc-800">
                    {c.status}
                  </span>
                </td>
                <td>
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PIX */}
      <div className="bg-zinc-900 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Dados para pagamento</h2>

        <p className="text-sm text-zinc-400">
          Chave Pix: {data.pix_key || "Não cadastrada"}
        </p>
        <p className="text-sm text-zinc-400">
          Tipo: {data.pix_type || "-"}
        </p>
      </div>
    </div>
  );
}

function Metric({ title, value }: any) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <p className="text-xs text-zinc-400">{title}</p>
      <p className="text-xl font-bold text-emerald-400">{value}</p>
    </div>
  );
}