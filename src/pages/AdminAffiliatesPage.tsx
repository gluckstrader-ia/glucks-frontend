import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function getToken() {
  return localStorage.getItem("glucks_token") || localStorage.getItem("token");
}

export default function AdminAffiliatesPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [partnerCode, setPartnerCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [grossAmount, setGrossAmount] = useState("");

  function authHeaders() {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function fetchPartners() {
    try {
      const res = await fetch(`${API_URL}/admin/affiliates/partners`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro ao carregar afiliados");
      }

      setPartners(data.items || []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar afiliados");
    }
  }

  async function fetchCommissions() {
    try {
      const res = await fetch(`${API_URL}/admin/affiliates/commissions`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro ao carregar comissões");
      }

      setCommissions(data.items || []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar comissões");
    }
  }

  useEffect(() => {
    fetchPartners();
    fetchCommissions();
  }, []);

  async function createAffiliate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API_URL}/admin/affiliates/create`, {
        method: "POST",
        headers: authHeaders(),
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

  async function createCommission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API_URL}/admin/affiliates/commissions/manual`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          partner_code: partnerCode.trim().toUpperCase(),
          customer_name: customerName,
          gross_amount: Number(grossAmount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro ao lançar comissão");
      }

      setPartnerCode("");
      setCustomerName("");
      setGrossAmount("");

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
      setError("");
      setMessage("");

      const res = await fetch(
        `${API_URL}/admin/affiliates/commissions/${id}/mark-paid`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro ao marcar como paga");
      }

      setMessage("Comissão marcada como paga.");
      await fetchCommissions();
    } catch (err: any) {
      setError(err.message || "Erro ao marcar comissão como paga");
    }
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <div>
          <h1 className="text-3xl font-bold">Admin Afiliados</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Cadastre afiliados manualmente e lance comissões para o dashboard.
          </p>
        </div>

        {message && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold">Criar Afiliado</h2>

          <form onSubmit={createAffiliate} className="grid gap-3">
            <input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border border-zinc-700 bg-black p-3"
              required
            />

            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border border-zinc-700 bg-black p-3"
              required
            />

            <input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border border-zinc-700 bg-black p-3"
              required
            />

            <button
              disabled={loading}
              className="rounded bg-emerald-500 p-3 font-bold text-black disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar Afiliado"}
            </button>
          </form>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold">Afiliados</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="text-left text-zinc-400">
                  <th className="py-3">Nome</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Código</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {partners.map((p) => (
                  <tr key={p.id} className="border-t border-zinc-800">
                    <td className="py-3">{p.name}</td>
                    <td className="py-3">{p.email}</td>
                    <td className="py-3 font-bold text-emerald-400">
                      {p.partner_code}
                    </td>
                    <td className="py-3">{p.partner_status || "active"}</td>
                  </tr>
                ))}

                {partners.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-zinc-500">
                      Nenhum afiliado cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold">Lançar Comissão</h2>

          <form onSubmit={createCommission} className="grid gap-3">
            <input
              placeholder="Código do afiliado"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
              className="rounded border border-zinc-700 bg-black p-3"
              required
            />

            <input
              placeholder="Nome do cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="rounded border border-zinc-700 bg-black p-3"
            />

            <input
              placeholder="Valor da venda. Ex: 197"
              type="number"
              min="0"
              step="0.01"
              value={grossAmount}
              onChange={(e) => setGrossAmount(e.target.value)}
              className="rounded border border-zinc-700 bg-black p-3"
              required
            />

            <button
              disabled={loading}
              className="rounded bg-emerald-500 p-3 font-bold text-black disabled:opacity-60"
            >
              {loading ? "Lançando..." : "Lançar Comissão"}
            </button>
          </form>
        </div>

        <div className="rounded-xl bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-bold">Comissões</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="text-left text-zinc-400">
                  <th className="py-3">Afiliado</th>
                  <th className="py-3">Código</th>
                  <th className="py-3">Cliente</th>
                  <th className="py-3">Valor</th>
                  <th className="py-3">Comissão</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Ação</th>
                </tr>
              </thead>

              <tbody>
                {commissions.map((c) => (
                  <tr key={c.id} className="border-t border-zinc-800">
                    <td className="py-3">{c.partner_name || "-"}</td>
                    <td className="py-3 text-emerald-400">
                      {c.partner_code || "-"}
                    </td>
                    <td className="py-3">{c.customer_name || "-"}</td>
                    <td className="py-3">R$ {Number(c.gross_amount || 0).toFixed(2)}</td>
                    <td className="py-3 font-bold text-emerald-400">
                      R$ {Number(c.commission_amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3">{c.status}</td>
                    <td className="py-3">
                      {c.status !== "paid" && (
                        <button
                          onClick={() => markPaid(c.id)}
                          className="rounded bg-emerald-500 px-3 py-1 text-xs font-bold text-black"
                        >
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {commissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-zinc-500">
                      Nenhuma comissão lançada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}