import { useEffect, useMemo, useState } from "react";
import { getToken } from "../lib/auth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type Material = {
  id?: number;
  title: string;
  category?: string;
  content?: string;
  file_url?: string;
};

type DashboardData = {
  partner_code: string;
  partner_link: string;
  metrics: {
    clicks: number;
    referred_users: number;
    active_customers: number;
    pending_amount: number;
    available_amount: number;
    paid_amount: number;
  };
  materials?: Material[];
};

const defaultMaterials: Material[] = [
  {
    title: "Como apresentar a Gluck's Trader IA",
    category: "Apresentação",
    content:
      "A Gluck's Trader IA é uma plataforma inteligente criada para auxiliar traders nas análises e tomada de decisão."
  },
  {
    title: "Copy pronta para divulgação",
    category: "Copy",
    content:
      "Conheça uma ferramenta inteligente para auxiliar suas análises no mercado. Faça seu teste na Gluck's Trader IA."
  },
  {
    title: "Roteiro para primeiro vídeo",
    category: "Vídeo",
    content:
      "Gancho: Eu gostaria de ter encontrado essa ferramenta quando comecei no mercado..."
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
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Sessão não encontrada. Faça login novamente.");
      }

      const response = await fetch(`${API_URL}/partners/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.detail === "string"
            ? result.detail
            : "Erro ao carregar dashboard."
        );
      }

      setData(result);

    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const materials = useMemo(() => {
    if (data?.materials?.length) {
      return data.materials;
    }

    return defaultMaterials;
  }, [data]);

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);

    setTimeout(() => setCopied(""), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03070d] text-white flex items-center justify-center">
        Carregando painel...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#03070d] text-white flex items-center justify-center p-6">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          {error || "Não foi possível carregar os dados."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03070d] p-6 text-white">
      <main className="mx-auto max-w-7xl space-y-8">

        <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-black p-8">
          <h1 className="text-4xl font-black">
            Seu painel de crescimento
          </h1>

          <p className="mt-3 text-zinc-300">
            Acompanhe indicações, resultados e materiais para divulgação.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Metric
              title="Disponível"
              value={money(data.metrics.available_amount)}
            />
            <Metric
              title="Clientes ativos"
              value={data.metrics.active_customers}
            />
            <Metric
              title="Cliques"
              value={data.metrics.clicks}
            />
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
              className="flex-1 rounded-xl bg-black border border-zinc-800 p-3"
            />

            <button
              onClick={() => copy(data.partner_link, "link")}
              className="rounded-xl bg-emerald-400 px-6 font-black text-black"
            >
              {copied === "link" ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-black">
            🚀 Kit inicial do parceiro
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {materials.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-black p-5"
              >
                <span className="text-sm text-emerald-400">
                  {item.category}
                </span>

                <h3 className="mt-2 font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-zinc-400">
                  {item.content}
                </p>

                {item.content && (
                  <button
                    onClick={() =>
                      copy(item.content || "", item.title)
                    }
                    className="mt-4 rounded-xl border border-emerald-500 px-4 py-2"
                  >
                    {copied === item.title
                      ? "Copiado!"
                      : "Copiar material"}
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
      <p className="text-zinc-400">{title}</p>
      <strong className="mt-2 block text-2xl">
        {value}
      </strong>
    </div>
  );
}