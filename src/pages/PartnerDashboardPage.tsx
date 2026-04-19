import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type Material = {
  id: number;
  title: string;
  category: string;
  content?: string;
  file_url?: string;
};

type Commission = {
  id: number;
  plan: string;
  gross_amount: number;
  commission_amount: number;
  status: string;
  billing_cycle: string;
  created_at: string;
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
  materials: Material[];
};

export default function PartnerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [pixKey, setPixKey] = useState("");
  const [pixType, setPixType] = useState("email");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [savingPix, setSavingPix] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/partners/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "Erro ao carregar dashboard do parceiro.");
      }

      setData(json);
      setPixKey(json.pix_key || "");
      setPixType(json.pix_type || "email");
    } catch (err: any) {
      setData(null);
      setError(err.message || "Erro ao carregar dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function joinProgram() {
    try {
      setJoining(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/partners/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "Erro ao ativar programa de parceiros.");
      }

      setMessage("Programa de parceiros ativado com sucesso.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao ativar programa.");
    } finally {
      setJoining(false);
    }
  }

  async function savePix() {
    try {
      setSavingPix(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/partners/pix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pix_key: pixKey,
          pix_type: pixType,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "Erro ao salvar chave Pix.");
      }

      setMessage("Chave Pix salva com sucesso.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar Pix.");
    } finally {
      setSavingPix(false);
    }
  }

  async function copyPartnerLink() {
    if (!data?.partner_link) return;

    try {
      await navigator.clipboard.writeText(data.partner_link);
      setMessage("Link copiado com sucesso.");
      setError("");
    } catch {
      setError("Não foi possível copiar o link.");
    }
  }

  async function copyMaterial(text?: string) {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setMessage("Material copiado com sucesso.");
      setError("");
    } catch {
      setError("Não foi possível copiar o material.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            Carregando dashboard do parceiro...
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="text-sm uppercase tracking-[0.2em] text-emerald-400">
              Programa de Parceiros
            </div>
            <h1 className="mt-3 text-3xl font-black">
              Entre no programa e receba seu código exclusivo
            </h1>
            <p className="mt-4 text-zinc-400">
              Você ainda não está ativo como parceiro. Clique abaixo para entrar no programa e liberar seu dashboard.
            </p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 text-emerald-400">
                {message}
              </div>
            )}

            <button
              onClick={joinProgram}
              disabled={joining}
              className="mt-8 rounded-2xl bg-emerald-500 px-6 py-4 font-bold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {joining ? "Ativando..." : "Quero entrar no programa de parceiros"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
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

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[28px] border border-zinc-800 bg-zinc-900/90 p-5">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl font-black text-emerald-400">
                GT
              </div>
              <div>
                <div className="text-sm text-zinc-400">Área do parceiro</div>
                <div className="text-lg font-bold">Gluck’s Trader IA</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="text-sm text-zinc-300">Seu código</div>
              <div className="mt-1 text-2xl font-black text-emerald-400">
                {data.partner_code}
              </div>
              <div className="mt-3 text-xs text-zinc-400">Status do parceiro</div>
              <div className="mt-2 inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Ativo
              </div>
            </div>

            <nav className="mt-5 space-y-2">
              {["Visão geral", "Comissões", "Minha chave Pix", "Materiais", "Suporte"].map(
                (item, index) => (
                  <button
                    key={item}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      index === 0
                        ? "bg-emerald-500 text-zinc-950"
                        : "bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </nav>

            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-sm font-semibold text-white">Seu link exclusivo</div>
              <div className="mt-3 break-all rounded-xl bg-zinc-900 px-3 py-3 font-mono text-xs text-emerald-300">
                {data.partner_link}
              </div>
              <button
                onClick={copyPartnerLink}
                className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/30 hover:bg-zinc-800"
              >
                Copiar link
              </button>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-[28px] border border-emerald-500/15 bg-zinc-900/90 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                    Dashboard do parceiro
                  </div>
                  <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                    Acompanhe suas comissões e sua performance
                  </h1>
                  <p className="mt-3 max-w-2xl text-zinc-400">
                    Veja seus resultados, gerencie sua chave Pix e use os materiais prontos para divulgar a Gluck’s Trader IA com mais consistência.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <div className="text-sm text-zinc-400">Disponível para receber</div>
                  <div className="mt-1 text-2xl font-black text-cyan-300">
                    R$ {data.metrics.available_amount.toFixed(2)}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">Repasse semanal por Pix</div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card
                title="Cliques no link"
                value={String(data.metrics.clicks)}
                caption="Total registrado"
              />
              <Card
                title="Cadastros com seu código"
                value={String(data.metrics.referred_users)}
                caption="Usuários vinculados"
              />
              <Card
                title="Clientes ativos"
                value={String(data.metrics.active_customers)}
                caption="Gerando recorrência"
              />
              <Card
                title="Comissões pagas"
                value={`R$ ${data.metrics.paid_amount.toFixed(2)}`}
                caption="Histórico acumulado"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Comissões recentes</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      Visualize suas últimas vendas e recorrências.
                    </p>
                  </div>
                </div>

                {data.recent_commissions.length === 0 ? (
                  <p className="mt-5 text-zinc-400">Nenhuma comissão registrada ainda.</p>
                ) : (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800">
                    <div className="grid grid-cols-5 gap-3 bg-zinc-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      <div>Data</div>
                      <div>Plano</div>
                      <div>Venda</div>
                      <div>Comissão</div>
                      <div>Status</div>
                    </div>

                    <div className="divide-y divide-zinc-800">
                      {data.recent_commissions.map((item) => (
                        <div key={item.id} className="grid grid-cols-5 gap-3 px-4 py-4 text-sm">
                          <div className="text-zinc-300">
                            {new Date(item.created_at).toLocaleString()}
                          </div>
                          <div className="font-semibold text-white">{item.plan}</div>
                          <div className="text-zinc-300">
                            R$ {item.gross_amount.toFixed(2)}
                          </div>
                          <div className="font-bold text-emerald-400">
                            R$ {item.commission_amount.toFixed(2)}
                          </div>
                          <div>
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                              {labelStatus(item.status)}
                            </span>
                            <div className="mt-1 text-xs text-zinc-500">
                              {item.billing_cycle === "first_payment" ? "Primeira venda" : "Recorrente"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <section className="rounded-[28px] border border-zinc-800 bg-zinc-900 p-6">
                  <h2 className="text-xl font-bold">Recebimento por Pix</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Cadastre a chave para receber seus repasses semanais.
                  </p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-zinc-400">Tipo de chave</label>
                      <select
                        value={pixType}
                        onChange={(e) => setPixType(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                      >
                        <option value="email">Email</option>
                        <option value="cpf">CPF</option>
                        <option value="telefone">Telefone</option>
                        <option value="aleatoria">Aleatória</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-zinc-400">Chave Pix</label>
                      <input
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                        placeholder="Digite sua chave Pix"
                      />
                    </div>

                    <button
                      onClick={savePix}
                      disabled={savingPix}
                      className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
                    >
                      {savingPix ? "Salvando..." : "Salvar chave Pix"}
                    </button>
                  </div>
                </section>

                <section className="rounded-[28px] border border-zinc-800 bg-zinc-900 p-6">
                  <h2 className="text-xl font-bold">Resumo financeiro</h2>
                  <div className="mt-5 space-y-3">
                    <Row label="Pendentes" value={`R$ ${data.metrics.pending_amount.toFixed(2)}`} />
                    <Row label="Disponíveis" value={`R$ ${data.metrics.available_amount.toFixed(2)}`} />
                    <Row label="Pagas" value={`R$ ${data.metrics.paid_amount.toFixed(2)}`} />
                  </div>
                </section>
              </div>
            </section>

            <section className="rounded-[28px] border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Central de divulgação</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Materiais prontos para acelerar sua divulgação.
                  </p>
                </div>
              </div>

              {data.materials.length === 0 ? (
                <p className="mt-5 text-zinc-400">Nenhum material disponível ainda.</p>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {data.materials.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                        {item.category}
                      </div>
                      <div className="mt-2 text-lg font-bold text-white">{item.title}</div>

                      {item.content ? (
                        <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                          {item.content}
                        </div>
                      ) : null}

                      <div className="mt-4 flex gap-3">
                        {item.content ? (
                          <button
                            onClick={() => copyMaterial(item.content)}
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-emerald-400"
                          >
                            Copiar
                          </button>
                        ) : null}

                        {item.file_url ? (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                          >
                            Abrir material
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  caption,
}: {
  title: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10">
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="mt-2 text-3xl font-black text-white">{value}</div>
      <div className="mt-2 text-sm text-zinc-500">{caption}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-zinc-950 px-4 py-3">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="font-bold text-white">{value}</span>
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
    return "text-amber-300 bg-amber-500/10 border-amber-400/20";
  }

  if (status === "available") {
    return "text-cyan-300 bg-cyan-500/10 border-cyan-400/20";
  }

  if (status === "paid") {
    return "text-emerald-300 bg-emerald-500/10 border-emerald-400/20";
  }

  return "text-zinc-300 bg-zinc-500/10 border-zinc-400/20";
}