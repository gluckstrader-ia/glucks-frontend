import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type Commission = {
  id: number;
  plan?: string;
  gross_amount?: number;
  commission_amount?: number;
  status?: string;
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

function token() {
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

  async function load() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/partners/dashboard`, {
        headers: {
          Authorization: `Bearer ${token()}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.detail || "Erro ao carregar dashboard");
      }

      setData(json);
    } catch (e: any) {
      setError(e.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const generated = useMemo(() => {
    if (!data) return 0;

    return data.recent_commissions.reduce(
      (total, item) => total + Number(item.commission_amount || 0),
      0
    );
  }, [data]);

  function copyLink() {
    if (!data?.partner_link) return;

    navigator.clipboard.writeText(data.partner_link);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Carregando painel...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
          <h1 className="font-bold">Erro ao carregar painel</h1>
          <p>{error}</p>
          <button onClick={load} className="mt-4 rounded-xl bg-emerald-400 px-5 py-2 text-black">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const m = data.metrics;

  return (
    <div className="min-h-screen bg-[#03070d] px-4 py-8 text-white">
      <main className="mx-auto max-w-7xl space-y-8">

        <section className="rounded-[32px] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-zinc-950 p-8">
          <span className="text-emerald-300">✦ Gluck's Partner</span>

          <h1 className="mt-4 text-4xl font-black">
            Seu painel de crescimento
          </h1>

          <p className="mt-3 text-zinc-300">
            Transforme indicações em uma fonte de receita recorrente.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Metric title="Disponível" value={money(m.available_amount)} />
            <Metric title="Clientes ativos" value={m.active_customers} />
            <Metric title="Total gerado" value={money(generated)} />
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">Seu link de indicação</h2>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              readOnly
              value={data.partner_link}
              className="flex-1 rounded-xl bg-black p-3"
            />

            <button
              onClick={copyLink}
              className="rounded-xl bg-emerald-400 px-6 font-bold text-black"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric title="Cliques" value={m.clicks}/>
          <Metric title="Cadastros" value={m.referred_users}/>
          <Metric title="Pago" value={money(m.paid_amount)}/>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">Como ganhar mais</h2>

          <ul className="mt-4 space-y-3 text-zinc-300">
            <li>• Divulgue seu link diariamente.</li>
            <li>• Mostre o funcionamento da plataforma.</li>
            <li>• Use o teste gratuito como principal argumento.</li>
            <li>• Compartilhe resultados e demonstrações.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">Comissões recentes</h2>

          <div className="mt-4 space-y-3">
            {data.recent_commissions.map((item) => (
              <div key={item.id} className="rounded-xl border border-zinc-800 p-4">
                <div>{item.plan || "Plano"}</div>
                <div className="text-emerald-300">
                  {money(Number(item.commission_amount || 0))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

function Metric({title, value}: {title:string; value:React.ReactNode}) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-black/40 p-5">
      <p className="text-sm text-zinc-400">{title}</p>
      <strong className="mt-2 block text-2xl">{value}</strong>
    </div>
  );
}