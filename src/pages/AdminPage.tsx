import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeDollarSign,
  Crown,
  RefreshCcw,
  Search,
  Sparkles,
  ShieldCheck,
  ShieldX,
  Users,
  Wallet,
  Mail,
  Copy,
} from "lucide-react";
import { clearAuth, getStoredToken, getStoredUser } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Ajuste estas 3 rotas se seu backend usar nomes diferentes
const LIST_ENDPOINT = `${API_URL}/admin/affiliates`;
const DETAIL_ENDPOINT = (id: number) => `${API_URL}/admin/affiliates/${id}`;
const TOGGLE_STATUS_ENDPOINT = (id: number) =>
  `${API_URL}/admin/affiliates/${id}/toggle-status`;

type AffiliateItem = {
  id: number;
  name: string;
  email: string;
  partner_code?: string | null;
  partner_status?: string | null;
  is_partner?: boolean;
  total_indications?: number;
  total_sales?: number;
  total_commission_generated?: number;
  total_commission_paid?: number;
  total_commission_pending?: number;
  created_at?: string | null;
};

type AffiliateDetail = AffiliateItem & {
  partner_pix_key?: string | null;
  partner_pix_type?: string | null;
  indications?: Array<{
    id: number;
    name: string;
    email: string;
    created_at?: string | null;
    plan?: string | null;
    plan_status?: string | null;
  }>;
};

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export default function AdminAffiliatesPage() {
  const navigate = useNavigate();

  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.is_admin !== true) {
      navigate("/home-premium", { replace: true });
      return;
    }

    loadAffiliates();
  }, [navigate]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function loadAffiliates() {
    const token = getStoredToken();
    if (!token) {
      setPageError("Sessão expirada.");
      return;
    }

    try {
      setLoading(true);
      setPageError("");

      const response = await fetch(LIST_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        clearAuth();
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao carregar afiliados.");
      }

      setAffiliates(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setPageError(error.message || "Erro ao carregar afiliados.");
    } finally {
      setLoading(false);
    }
  }

  async function openAffiliateDetail(affiliateId: number) {
    const token = getStoredToken();
    if (!token) return;

    try {
      setDetailLoading(true);

      const response = await fetch(DETAIL_ENDPOINT(affiliateId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao carregar detalhes do afiliado.");
      }

      setSelectedAffiliate(data);
    } catch (error: any) {
      setToast({ message: error.message || "Erro ao carregar detalhes.", type: "error" });
    } finally {
      setDetailLoading(false);
    }
  }

  async function toggleAffiliateStatus(affiliateId: number) {
    const token = getStoredToken();
    if (!token) return;

    try {
      setActionLoadingId(affiliateId);

      const response = await fetch(TOGGLE_STATUS_ENDPOINT(affiliateId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao alterar status do afiliado.");
      }

      setToast({ message: "Status do afiliado atualizado.", type: "success" });
      await loadAffiliates();

      if (selectedAffiliate?.id === affiliateId) {
        await openAffiliateDetail(affiliateId);
      }
    } catch (error: any) {
      setToast({ message: error.message || "Erro ao alterar status.", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  }

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  async function copyText(text?: string | null) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: "Copiado com sucesso.", type: "success" });
    } catch {
      setToast({ message: "Não foi possível copiar.", type: "error" });
    }
  }

  const filteredAffiliates = useMemo(() => {
    const q = search.trim().toLowerCase();

    return affiliates.filter((item) => {
      if (!q) return true;

      return (
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        (item.partner_code || "").toLowerCase().includes(q)
      );
    });
  }, [affiliates, search]);

  const stats = useMemo(() => {
    return {
      total: affiliates.length,
      active: affiliates.filter((a) => (a.partner_status || "").toLowerCase() === "active").length,
      blocked: affiliates.filter((a) => (a.partner_status || "").toLowerCase() === "blocked").length,
      indications: affiliates.reduce((sum, a) => sum + (a.total_indications || 0), 0),
      generated: affiliates.reduce((sum, a) => sum + Number(a.total_commission_generated || 0), 0),
      pending: affiliates.reduce((sum, a) => sum + Number(a.total_commission_pending || 0), 0),
    };
  }, [affiliates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070b] text-white flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-zinc-300 shadow-2xl">
          Carregando central de afiliados...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.08),_transparent_25%),radial-gradient(circle_at_right,_rgba(6,182,212,0.08),_transparent_20%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.08),_transparent_25%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Gestão de Afiliados
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                Admin Afiliados Empresarial
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
                Monitore afiliados, códigos, status, comissões e performance da rede.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Admin
              </Link>

              <button
                onClick={loadAffiliates}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Atualizar
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-500"
              >
                <ShieldX className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {toast ? (
          <div
            className={`mb-5 rounded-2xl border px-4 py-3 text-sm shadow-xl ${
              toast.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {toast.message}
          </div>
        ) : null}

        {pageError ? (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {pageError}
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard title="Afiliados" value={stats.total} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Ativos" value={stats.active} icon={<ShieldCheck className="h-5 w-5" />} />
          <StatCard title="Bloqueados" value={stats.blocked} icon={<ShieldX className="h-5 w-5" />} />
          <StatCard title="Indicados" value={stats.indications} icon={<BadgeDollarSign className="h-5 w-5" />} />
          <MoneyCard title="Comissão gerada" value={stats.generated} />
          <MoneyCard title="Comissão pendente" value={stats.pending} />
        </div>

        <div className="mb-6 rounded-[26px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou código"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-400/30"
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_20px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-black/25 text-zinc-400">
                  <tr>
                    <th className="px-5 py-4">Afiliado</th>
                    <th className="px-5 py-4">Código</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Indicados</th>
                    <th className="px-5 py-4">Gerado</th>
                    <th className="px-5 py-4 text-right">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAffiliates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center text-zinc-500">
                        Nenhum afiliado encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredAffiliates.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-5">
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="mt-1 inline-flex items-center gap-2 text-zinc-400">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="break-all">{item.email}</span>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-cyan-300">
                            <span>{item.partner_code || "-"}</span>
                            <button
                              onClick={() => copyText(item.partner_code)}
                              className="text-cyan-300 hover:text-cyan-200"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <StatusPill status={item.partner_status || "active"} />
                        </td>

                        <td className="px-5 py-5 text-white">
                          {item.total_indications || 0}
                        </td>

                        <td className="px-5 py-5 text-emerald-300 font-semibold">
                          R$ {Number(item.total_commission_generated || 0).toFixed(2)}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              onClick={() => openAffiliateDetail(item.id)}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                            >
                              Detalhes
                            </button>

                            <button
                              onClick={() => toggleAffiliateStatus(item.id)}
                              disabled={actionLoadingId === item.id}
                              className="rounded-xl bg-cyan-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
                            >
                              {actionLoadingId === item.id
                                ? "Processando..."
                                : (item.partner_status || "").toLowerCase() === "active"
                                ? "Bloquear"
                                : "Ativar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_20px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            {detailLoading ? (
              <div className="text-zinc-400">Carregando detalhes do afiliado...</div>
            ) : selectedAffiliate ? (
              <div>
                <div className="mb-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                    <Crown className="h-3.5 w-3.5" />
                    Afiliado em foco
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-white">
                    {selectedAffiliate.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400 break-all">
                    {selectedAffiliate.email}
                  </p>
                </div>

                <div className="space-y-4">
                  <DetailBox label="Código" value={selectedAffiliate.partner_code || "-"} />
                  <DetailBox
                    label="Status"
                    value={selectedAffiliate.partner_status || "active"}
                  />
                  <DetailBox
                    label="PIX"
                    value={
                      selectedAffiliate.partner_pix_key
                        ? `${selectedAffiliate.partner_pix_type || "chave"}: ${selectedAffiliate.partner_pix_key}`
                        : "Não informado"
                    }
                  />
                  <DetailBox
                    label="Indicados"
                    value={String(selectedAffiliate.total_indications || 0)}
                  />
                  <DetailBox
                    label="Comissão gerada"
                    value={`R$ ${Number(selectedAffiliate.total_commission_generated || 0).toFixed(2)}`}
                  />
                  <DetailBox
                    label="Comissão paga"
                    value={`R$ ${Number(selectedAffiliate.total_commission_paid || 0).toFixed(2)}`}
                  />
                  <DetailBox
                    label="Comissão pendente"
                    value={`R$ ${Number(selectedAffiliate.total_commission_pending || 0).toFixed(2)}`}
                  />
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-bold text-white">Indicados recentes</h3>

                  {selectedAffiliate.indications && selectedAffiliate.indications.length > 0 ? (
                    <div className="space-y-3">
                      {selectedAffiliate.indications.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                        >
                          <div className="font-medium text-white">{item.name}</div>
                          <div className="mt-1 text-sm text-zinc-400 break-all">
                            {item.email}
                          </div>
                          <div className="mt-2 text-xs text-zinc-500">
                            {item.plan || "-"} • {item.plan_status || "-"} •{" "}
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">Nenhum indicado encontrado.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-zinc-500">
                Selecione um afiliado para ver os detalhes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_10px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-zinc-400">{title}</div>
        <div className="text-cyan-300">{icon}</div>
      </div>
      <div className="mt-4 text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function MoneyCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_10px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-zinc-400">{title}</div>
        <div className="text-emerald-300">
          <Wallet className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-3xl font-black text-emerald-300">
        R$ {value.toFixed(2)}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const styles =
    normalized === "active"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : "border-red-500/20 bg-red-500/10 text-red-300";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
      {normalized === "active" ? "Ativo" : "Bloqueado"}
    </span>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className="mt-2 text-white break-all">{value}</div>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR");
}