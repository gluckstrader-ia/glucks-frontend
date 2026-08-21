import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type Material = {
  id?: number;
  title: string;
  category?: string;
  content?: string;
  file_url?: string;
};

type Commission = {
  id: number;
  plan?: string;
  commission_amount?: number;
  status?: string;
  created_at?: string;
};

type DashboardData = {
  partner_code: string;
  partner_link: string;
  pix_key?: string | null;
  metrics: {
    clicks: number;
    referred_users: number;
    active_customers: number;
    pending_amount: number;
    available_amount: number;
    paid_amount: number;
  };
  recent_commissions: Commission[];
  materials?: Material[];
};

const starterMaterials: Material[] = [
  {
    title: "Como apresentar a Gluck's Trader IA",
    category: "Apresentação",
    content:
      "A Gluck's Trader IA é uma plataforma que utiliza inteligência artificial e ferramentas de análise para auxiliar traders na tomada de decisão."
  },
  {
    title: "Copy pronta para WhatsApp e Instagram",
    category: "Copy",
    content:
      "Você já imaginou ter uma ferramenta inteligente para auxiliar suas análises no mercado? Conheça a Gluck's Trader IA e faça seu teste."
  },
  {
    title: "Roteiro para primeiro vídeo",
    category: "Vídeo",
    content:
      "Gancho: Eu gostaria de ter encontrado essa ferramenta quando comecei no mercado. Mostre o problema, apresente a solução e finalize com o link."
  }
];

function money(value: number) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PartnerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  async function load() {
    const response = await fetch(`${API_URL}/partners/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const json = await response.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const materials = useMemo(() => {
    if (data?.materials && data.materials.length > 0) {
      return data.materials;
    }

    return starterMaterials;
  }, [data]);

  async function copy(text: string, title: string) {
    await navigator.clipboard.writeText(text);
    setCopied(title);

    setTimeout(() => setCopied(""), 2000);
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Carregando painel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03070d] p-6 text-white">
      <main className="mx-auto max-w-7xl space-y-8">

        <section className="rounded-[32px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-black p-8">
          <h1 className="text-4xl font-black">
            Seu painel de crescimento
          </h1>

          <p className="mt-3 text-zinc-300">
            Use suas ferramentas de divulgação e transforme indicações em resultados.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card title="Disponível" value={money(data.metrics.available_amount)} />
            <Card title="Clientes ativos" value={data.metrics.active_customers} />
            <Card title="Cliques" value={data.metrics.clicks} />
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-black">
            Seu link de indicação
          </h2>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              readOnly
              value={data.partner_link}
              className="flex-1 rounded-xl bg-black p-3"
            />

            <button
              onClick={() => copy(data.partner_link, "link")}
              className="rounded-xl bg-emerald-400 px-5 font-bold text-black"
            >
              {copied === "link" ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-black">
            🚀 Kit inicial do parceiro
          </h2>

          <p className="mt-2 text-zinc-400">
            Materiais prontos para ajudar você a divulgar.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {materials.map((material) => (
              <div
                key={material.title}
                className="rounded-2xl border border-zinc-800 bg-black p-5"
              >
                <span className="text-sm text-emerald-400">
                  {material.category}
                </span>

                <h3 className="mt-2 font-bold">
                  {material.title}
                </h3>

                <p className="mt-3 text-sm text-zinc-400">
                  {material.content}
                </p>

                {material.content && (
                  <button
                    onClick={() => copy(material.content || "", material.title)}
                    className="mt-4 rounded-xl border border-emerald-500 px-4 py-2 text-sm"
                  >
                    {copied === material.title ? "Copiado!" : "Copiar material"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

function Card({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
      <p className="text-zinc-400">{title}</p>
      <strong className="mt-2 block text-2xl">{value}</strong>
    </div>
  );
}