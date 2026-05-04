import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function AdminAffiliatesPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // FORM AFILIADO
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // FORM COMISSÃO
  const [partnerCode, setPartnerCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [grossAmount, setGrossAmount] = useState("");

  async function fetchPartners() {
    const res = await fetch(`${API_URL}/admin/affiliates/partners`, {
      credentials: "include",
    });
    const data = await res.json();
    setPartners(data.items || []);
  }

  async function fetchCommissions() {
    const res = await fetch(`${API_URL}/admin/affiliates/commissions`, {
      credentials: "include",
    });
    const data = await res.json();
    setCommissions(data.items || []);
  }

  useEffect(() => {
    fetchPartners();
    fetchCommissions();
  }, []);

  async function createAffiliate(e: any) {
    e.preventDefault();

    try {
      setLoading(true);

      await fetch(`${API_URL}/admin/affiliates/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      setName("");
      setEmail("");
      setPassword("");

      fetchPartners();
    } finally {
      setLoading(false);
    }
  }

  async function createCommission(e: any) {
    e.preventDefault();

    try {
      setLoading(true);

      await fetch(`${API_URL}/admin/affiliates/commissions/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          partner_code: partnerCode,
          customer_name: customerName,
          gross_amount: Number(grossAmount),
        }),
      });

      setPartnerCode("");
      setCustomerName("");
      setGrossAmount("");

      fetchCommissions();
    } finally {
      setLoading(false);
    }
  }

  async function markPaid(id: number) {
    await fetch(`${API_URL}/admin/affiliates/commissions/${id}/mark-paid`, {
      method: "POST",
      credentials: "include",
    });

    fetchCommissions();
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-10">
      <h1 className="text-3xl font-bold">Admin Afiliados</h1>

      {/* CRIAR AFILIADO */}
      <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-bold">Criar Afiliado</h2>

        <form onSubmit={createAffiliate} className="grid gap-3">
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 bg-black border border-zinc-700 rounded"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 bg-black border border-zinc-700 rounded"
          />
          <input
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 bg-black border border-zinc-700 rounded"
          />

          <button
            disabled={loading}
            className="bg-emerald-500 p-3 rounded text-black font-bold disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar Afiliado"}
          </button>
        </form>
      </div>

      {/* LISTA AFILIADOS */}
      <div className="bg-zinc-900 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Afiliados</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-400">
              <th>Nome</th>
              <th>Email</th>
              <th>Código</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-t border-zinc-800">
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td className="text-emerald-400 font-bold">
                  {p.partner_code}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LANÇAR COMISSÃO */}
      <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-bold">Lançar Comissão</h2>

        <form onSubmit={createCommission} className="grid gap-3">
          <input
            placeholder="Código do afiliado"
            value={partnerCode}
            onChange={(e) => setPartnerCode(e.target.value)}
            className="p-3 bg-black border border-zinc-700 rounded"
          />

          <input
            placeholder="Nome do cliente"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-3 bg-black border border-zinc-700 rounded"
          />

          <input
            placeholder="Valor da venda"
            value={grossAmount}
            onChange={(e) => setGrossAmount(e.target.value)}
            className="p-3 bg-black border border-zinc-700 rounded"
          />

          <button
            disabled={loading}
            className="bg-emerald-500 p-3 rounded text-black font-bold disabled:opacity-60"
          >
            {loading ? "Lançando..." : "Lançar Comissão"}
          </button>
        </form>
      </div>

      {/* LISTA COMISSÕES */}
      <div className="bg-zinc-900 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Comissões</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-400">
              <th>Afiliado</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Comissão</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => (
              <tr key={c.id} className="border-t border-zinc-800">
                <td>{c.partner_name}</td>
                <td>{c.customer_name}</td>
                <td>R$ {c.gross_amount}</td>
                <td className="text-emerald-400">
                  R$ {c.commission_amount}
                </td>
                <td>{c.status}</td>
                <td>
                  {c.status !== "paid" && (
                    <button
                      onClick={() => markPaid(c.id)}
                      className="text-xs bg-emerald-500 px-2 py-1 rounded text-black"
                    >
                      Pagar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}