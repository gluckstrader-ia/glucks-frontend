import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  ShieldX,
  UserCog,
  Crown,
  Users,
  UserCheck,
  UserX,
  Sparkles,
  RefreshCcw,
  X,
  Save,
  Mail,
  CalendarClock,
  BadgeDollarSign,
  Wallet,
  Copy,
  LayoutDashboard,
  ArrowRightLeft,
  BadgeCheck,
} from "lucide-react";
import { clearAuth, getStoredToken, getStoredUser } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Endpoints de afiliados: mantidos isolados para fácil ajuste se necessário
const AFFILIATES_LIST_ENDPOINT = `${API_URL}/admin/affiliates`;
const AFFILIATE_DETAIL_ENDPOINT = (id: number) => `${API_URL}/admin/affiliates/${id}`;
const AFFILIATE_TOGGLE_STATUS_ENDPOINT = (id: number) =>
  `${API_URL}/admin/affiliates/${id}/toggle-status`;

type UserItem = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_blocked: boolean;
  is_admin: boolean;
  is_partner?: boolean;
  partner_code?: string | null;
  partner_status?: string | null;
  plan: string;
  plan_status: string;
  access_expires_at?: string | null;
  has_access?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

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
  partner_pix_key?: string | null;
  partner_pix_type?: string | null;
  created_at?: string | null;
};

type AffiliateDetail = AffiliateItem & {
  indications?: Array<{
    id: number;
    name: string;
    email: string;
    created_at?: string | null;
    plan?: string | null;
    plan_status?: string | null;
  }>;
};

type StatusFilter = "all" | "active" | "blocked" | "trial" | "partners" | "admins";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  type: ToastType;
} | null;

type EditFormState = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_blocked: boolean;
  is_admin: boolean;
  plan: string;
  plan_status: string;
  access_expires_at: string;
};

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAffiliates, setLoadingAffiliates] = useState(true);

  const [pageError, setPageError] = useState("");
  const [affiliatesError, setAffiliatesError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<EditFormState | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateDetail | null>(null);
  const [affiliateDetailLoading, setAffiliateDetailLoading] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);

  const loading = loadingUsers || loadingAffiliates;

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

    initializePage();
  }, [navigate]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  async function initializePage() {
    await Promise.all([loadUsers(), loadAffiliates()]);
  }

  async function loadUsers() {
    const token = getStoredToken();

    if (!token) {
      setPageError("Sessão expirada. Faça login novamente.");
      setLoadingUsers(false);
      return;
    }

    try {
      setLoadingUsers(true);
      setPageError("");

      const response = await fetch(`${API_URL}/admin/users`, {
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

      if (response.status === 403) {
        setPageError("Você não tem permissão para acessar esta página.");
        setLoadingUsers(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao carregar usuários.");
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setPageError(error.message || "Erro ao carregar usuários.");
    } finally {
      setLoadingUsers(false);
    }
  }

  async function loadAffiliates() {
    const token = getStoredToken();

    if (!token) {
      setAffiliatesError("Sessão expirada.");
      setLoadingAffiliates(false);
      return;
    }

    try {
      setLoadingAffiliates(true);
      setAffiliatesError("");

      const response = await fetch(AFFILIATES_LIST_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        clearAuth();
        navigate("/login", { replace: true });
        return;
      }

      // Não derruba a página inteira se o módulo de afiliados estiver incompleto
      if (response.status === 404) {
        setAffiliates([]);
        setAffiliatesError(
          "Módulo de afiliados ainda não disponível no backend publicado."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          (data && data.detail) || "Erro ao carregar afiliados."
        );
      }

      setAffiliates(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setAffiliatesError(error.message || "Erro ao carregar afiliados.");
      setAffiliates([]);
    } finally {
      setLoadingAffiliates(false);
    }
  }

  async function runPostAction(
    userId: number,
    endpoint: string,
    successMessage: string
  ) {
    const token = getStoredToken();

    if (!token) {
      setPageError("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setActionLoadingId(userId);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
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
        throw new Error(data.detail || "Erro ao executar ação.");
      }

      setToast({ message: successMessage, type: "success" });
      await loadUsers();
    } catch (error: any) {
      setToast({ message: error.message || "Erro ao executar ação.", type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  }

  async function toggleAffiliateStatus(affiliateId: number) {
    const token = getStoredToken();
    if (!token) return;

    try {
      setActionLoadingId(affiliateId);

      const response = await fetch(AFFILIATE_TOGGLE_STATUS_ENDPOINT(affiliateId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          (data && data.detail) || "Erro ao alterar status do afiliado."
        );
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

  function openEditModal(user: UserItem) {
    setEditingUser({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      is_active: !!user.is_active,
      is_blocked: !!user.is_blocked,
      is_admin: !!user.is_admin,
      plan: user.plan || "mensal",
      plan_status: user.plan_status || "pending",
      access_expires_at: toDatetimeLocal(user.access_expires_at),
    });
  }

  function closeEditModal() {
    setEditingUser(null);
  }

  async function saveEditUser() {
    if (!editingUser) return;

    const token = getStoredToken();
    if (!token) {
      setPageError("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setSavingEdit(true);

      const response = await fetch(`${API_URL}/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: editingUser.id,
          name: editingUser.name.trim(),
          email: editingUser.email.trim().toLowerCase(),
          is_active: editingUser.is_active,
          is_blocked: editingUser.is_blocked,
          is_admin: editingUser.is_admin,
          plan: editingUser.plan,
          plan_status: editingUser.plan_status,
          access_expires_at: editingUser.access_expires_at
            ? new Date(editingUser.access_expires_at).toISOString()
            : null,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        clearAuth();
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao salvar usuário.");
      }

      setToast({ message: "Usuário atualizado com sucesso.", type: "success" });
      closeEditModal();
      await loadUsers();
    } catch (error: any) {
      setToast({ message: error.message || "Erro ao salvar usuário.", type: "error" });
    } finally {
      setSavingEdit(false);
    }
  }

  async function openAffiliateDetail(affiliateId: number) {
    const token = getStoredToken();
    if (!token) return;

    try {
      setAffiliateDetailLoading(true);

      const response = await fetch(AFFILIATE_DETAIL_ENDPOINT(affiliateId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          (data && data.detail) || "Erro ao carregar detalhes do afiliado."
        );
      }

      setSelectedAffiliate(data);
    } catch (error: any) {
      setToast({ message: error.message || "Erro ao carregar detalhes.", type: "error" });
    } finally {
      setAffiliateDetailLoading(false);
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

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name?.toLowerCase().includes(normalizedSearch) ||
        user.email?.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return false;

      if (statusFilter === "active") {
        return user.is_active && !user.is_blocked;
      }

      if (statusFilter === "blocked") {
        return user.is_blocked;
      }

      if (statusFilter === "trial") {
        return (user.plan || "").toLowerCase() === "trial";
      }

      if (statusFilter === "partners") {
        return user.is_partner === true;
      }

      if (statusFilter === "admins") {
        return user.is_admin === true;
      }

      return true;
    });
  }, [users, search, statusFilter]);

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

  const userStats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.is_active && !u.is_blocked).length,
      blocked: users.filter((u) => u.is_blocked).length,
      partners: users.filter((u) => u.is_partner).length,
      admins: users.filter((u) => u.is_admin).length,
      trial: users.filter((u) => (u.plan || "").toLowerCase() === "trial").length,
    };
  }, [users]);

  const affiliateStats = useMemo(() => {
    return {
      total: affiliates.length,
      active: affiliates.filter((a) => (a.partner_status || "").toLowerCase() === "active")
        .length,
      blocked: affiliates.filter((a) => (a.partner_status || "").toLowerCase() === "blocked")
        .length,
      indications: affiliates.reduce((sum, a) => sum + (a.total_indications || 0), 0),
      generated: affiliates.reduce(
        (sum, a) => sum + Number(a.total_commission_generated || 0),
        0
      ),
      pending: affiliates.reduce(
        (sum, a) => sum + Number(a.total_commission_pending || 0),
        0
      ),
    };
  }, [affiliates]);

  const expiringSoon = useMemo(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return users
      .filter((u) => {
        if (!u.access_expires_at) return false;
        const ts = new Date(u.access_expires_at).getTime();
        return !Number.isNaN(ts) && ts >= now && ts <= now + sevenDays;
      })
      .slice(0, 6);
  }, [users]);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const ta = new Date(a.created_at || 0).getTime();
        const tb = new Date(b.created_at || 0).getTime();
        return tb - ta;
      })
      .slice(0, 6);
  }, [users]);

  const topAffiliates = useMemo(() => {
    return [...affiliates]
      .sort(
        (a, b) =>
          Number(b.total_commission_generated || 0) -
          Number(a.total_commission_generated || 0)
      )
      .slice(0, 6);
  }, [affiliates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070b] text-white flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-zinc-300 shadow-2xl">
          Carregando central administrativa...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_25%),radial-gradient(circle_at_right,_rgba(59,130,246,0.08),_transparent_20%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.08),_transparent_25%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                Central Administrativa Completa
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                Admin Empresarial Unificado
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
                Usuários, acessos, permissões, parceiros, comissões e operação em
                um único painel executivo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={initializePage}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Atualizar tudo
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
                : toast.type === "error"
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : "border-blue-500/20 bg-blue-500/10 text-blue-300"
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
          <StatCard title="Usuários" value={userStats.total} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Ativos" value={userStats.active} icon={<UserCheck className="h-5 w-5" />} />
          <StatCard title="Bloqueados" value={userStats.blocked} icon={<UserX className="h-5 w-5" />} />
          <StatCard title="Parceiros" value={userStats.partners} icon={<BadgeDollarSign className="h-5 w-5" />} />
          <StatCard title="Admins" value={userStats.admins} icon={<Crown className="h-5 w-5" />} />
          <StatCard title="Trial" value={userStats.trial} icon={<CalendarClock className="h-5 w-5" />} />
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MoneyCard title="Afiliados ativos" value={affiliateStats.active} icon={<BadgeCheck className="h-5 w-5" />} />
          <MoneyCard title="Indicados" value={affiliateStats.indications} icon={<ArrowRightLeft className="h-5 w-5" />} />
          <MoneyCard
            title="Comissão gerada"
            value={affiliateStats.generated}
            icon={<Wallet className="h-5 w-5" />}
            money
          />
          <MoneyCard
            title="Comissão pendente"
            value={affiliateStats.pending}
            icon={<Wallet className="h-5 w-5" />}
            money
          />
        </div>

        <div className="mb-6 grid gap-6 xl:grid-cols-3">
          <PanelCard
            title="Expirações próximas"
            subtitle="Acessos vencendo nos próximos 7 dias"
            icon={<CalendarClock className="h-4 w-4" />}
          >
            {expiringSoon.length === 0 ? (
              <p className="text-sm text-zinc-500">Nenhuma expiração próxima.</p>
            ) : (
              <div className="space-y-3">
                {expiringSoon.map((user) => (
                  <MiniUserRow
                    key={user.id}
                    title={user.name}
                    subtitle={user.email}
                    meta={formatDate(user.access_expires_at)}
                  />
                ))}
              </div>
            )}
          </PanelCard>

          <PanelCard
            title="Usuários recentes"
            subtitle="Últimos cadastros da plataforma"
            icon={<LayoutDashboard className="h-4 w-4" />}
          >
            {recentUsers.length === 0 ? (
              <p className="text-sm text-zinc-500">Nenhum cadastro recente.</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <MiniUserRow
                    key={user.id}
                    title={user.name}
                    subtitle={user.email}
                    meta={formatDate(user.created_at)}
                  />
                ))}
              </div>
            )}
          </PanelCard>

          <PanelCard
            title="Top afiliados"
            subtitle="Maior comissão gerada"
            icon={<BadgeDollarSign className="h-4 w-4" />}
          >
            {affiliatesError ? (
              <p className="text-sm text-zinc-500">{affiliatesError}</p>
            ) : topAffiliates.length === 0 ? (
              <p className="text-sm text-zinc-500">Nenhum afiliado disponível.</p>
            ) : (
              <div className="space-y-3">
                {topAffiliates.map((item) => (
                  <MiniUserRow
                    key={item.id}
                    title={item.name}
                    subtitle={item.partner_code || item.email}
                    meta={`R$ ${Number(item.total_commission_generated || 0).toFixed(2)}`}
                  />
                ))}
              </div>
            )}
          </PanelCard>
        </div>

        <div className="mb-6 rounded-[26px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar por nome, e-mail ou código"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/30"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition focus:border-emerald-400/30"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="blocked">Bloqueados</option>
              <option value="trial">Trial</option>
              <option value="partners">Parceiros</option>
              <option value="admins">Admins</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            <SectionShell title="Gestão de usuários" icon={<Users className="h-4 w-4" />}>
              <div className="overflow-x-auto">
                <table className="min-w-[1200px] w-full text-left text-sm">
                  <thead className="border-b border-white/10 bg-black/25 text-zinc-400">
                    <tr>
                      <th className="px-5 py-4">Usuário</th>
                      <th className="px-5 py-4">Plano</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Expiração</th>
                      <th className="px-5 py-4">Perfil</th>
                      <th className="px-5 py-4">Criado em</th>
                      <th className="px-5 py-4 text-right">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-14 text-center text-zinc-500">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const loadingThisUser = actionLoadingId === user.id;

                        return (
                          <tr
                            key={user.id}
                            className="border-b border-white/5 transition hover:bg-white/[0.025]"
                          >
                            <td className="px-5 py-5">
                              <div className="font-semibold text-white">{user.name}</div>
                              <div className="mt-1 inline-flex items-center gap-2 text-zinc-400">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="break-all">{user.email}</span>
                              </div>
                              <div className="mt-2 text-xs text-zinc-500">ID #{user.id}</div>
                            </td>

                            <td className="px-5 py-5">
                              <div className="capitalize font-medium text-white">
                                {user.plan || "-"}
                              </div>
                              <div className="mt-1 text-zinc-400">
                                {user.plan_status || "-"}
                              </div>
                            </td>

                            <td className="px-5 py-5">
                              <StatusBadge user={user} />
                            </td>

                            <td className="px-5 py-5 text-zinc-300">
                              {formatDate(user.access_expires_at)}
                            </td>

                            <td className="px-5 py-5">
                              <div className="flex flex-wrap gap-2">
                                {user.is_admin ? (
                                  <ProfileBadge label="Admin" tone="yellow" />
                                ) : null}

                                {user.is_partner ? (
                                  <ProfileBadge label="Parceiro" tone="cyan" />
                                ) : null}

                                {!user.is_admin && !user.is_partner ? (
                                  <ProfileBadge label="Cliente" tone="zinc" />
                                ) : null}
                              </div>
                            </td>

                            <td className="px-5 py-5 text-zinc-400">
                              {formatDate(user.created_at)}
                            </td>

                            <td className="px-5 py-5">
                              <div className="flex flex-wrap justify-end gap-2">
                                <ActionButton
                                  label="Editar"
                                  icon={<UserCog className="h-4 w-4" />}
                                  onClick={() => openEditModal(user)}
                                  variant="neutral"
                                />

                                <ActionButton
                                  label={user.is_blocked ? "Desbloquear" : "Bloquear"}
                                  icon={<ShieldX className="h-4 w-4" />}
                                  onClick={() =>
                                    runPostAction(
                                      user.id,
                                      `/admin/users/${user.id}/toggle-block`,
                                      user.is_blocked
                                        ? "Usuário desbloqueado com sucesso."
                                        : "Usuário bloqueado com sucesso."
                                    )
                                  }
                                  loading={loadingThisUser}
                                  variant="danger"
                                />

                                <ActionButton
                                  label={user.is_active ? "Desativar" : "Ativar"}
                                  icon={<ShieldCheck className="h-4 w-4" />}
                                  onClick={() =>
                                    runPostAction(
                                      user.id,
                                      `/admin/users/${user.id}/toggle-active`,
                                      user.is_active
                                        ? "Usuário desativado com sucesso."
                                        : "Usuário ativado com sucesso."
                                    )
                                  }
                                  loading={loadingThisUser}
                                  variant="success"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </SectionShell>

            <SectionShell
              title="Gestão de afiliados"
              icon={<ArrowRightLeft className="h-4 w-4" />}
            >
              {affiliatesError ? (
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
                  {affiliatesError}
                </div>
              ) : (
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
                                <ActionButton
                                  label="Detalhes"
                                  icon={<LayoutDashboard className="h-4 w-4" />}
                                  onClick={() => openAffiliateDetail(item.id)}
                                  variant="neutral"
                                />

                                <ActionButton
                                  label={
                                    (item.partner_status || "").toLowerCase() === "active"
                                      ? "Bloquear"
                                      : "Ativar"
                                  }
                                  icon={<ShieldCheck className="h-4 w-4" />}
                                  onClick={() => toggleAffiliateStatus(item.id)}
                                  loading={actionLoadingId === item.id}
                                  variant="success"
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionShell>
          </div>

          <div className="space-y-6">
            <SectionShell
              title="Afiliado em foco"
              icon={<BadgeDollarSign className="h-4 w-4" />}
            >
              {affiliateDetailLoading ? (
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
            </SectionShell>
          </div>
        </div>
      </div>

      {editingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[30px] border border-white/10 bg-[#0b0f15] p-6 shadow-[0_20px_100px_rgba(0,0,0,0.45)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  <UserCog className="h-3.5 w-3.5" />
                  Edição Empresarial
                </div>
                <h2 className="mt-4 text-2xl font-black text-white">
                  Editar usuário
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Atualize dados cadastrais, permissões, plano e vencimento.
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputBlock
                label="Nome"
                value={editingUser.name}
                onChange={(value) => setEditingUser({ ...editingUser, name: value })}
              />

              <InputBlock
                label="E-mail"
                value={editingUser.email}
                onChange={(value) => setEditingUser({ ...editingUser, email: value })}
              />

              <SelectBlock
                label="Plano"
                value={editingUser.plan}
                onChange={(value) => setEditingUser({ ...editingUser, plan: value })}
                options={[
                  { label: "Trial", value: "trial" },
                  { label: "Mensal", value: "mensal" },
                  { label: "Trimestral", value: "trimestral" },
                  { label: "Semestral", value: "semestral" },
                  { label: "Nenhum", value: "none" },
                ]}
              />

              <SelectBlock
                label="Status do plano"
                value={editingUser.plan_status}
                onChange={(value) =>
                  setEditingUser({ ...editingUser, plan_status: value })
                }
                options={[
                  { label: "Ativo", value: "active" },
                  { label: "Pendente", value: "pending" },
                  { label: "Cancelado", value: "cancelled" },
                ]}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Expiração do acesso
                </label>
                <input
                  type="datetime-local"
                  value={editingUser.access_expires_at}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      access_expires_at: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition focus:border-emerald-400/30"
                />
              </div>

              <ToggleBlock
                label="Usuário ativo"
                checked={editingUser.is_active}
                onChange={(value) =>
                  setEditingUser({ ...editingUser, is_active: value })
                }
              />

              <ToggleBlock
                label="Usuário bloqueado"
                checked={editingUser.is_blocked}
                onChange={(value) =>
                  setEditingUser({ ...editingUser, is_blocked: value })
                }
              />

              <ToggleBlock
                label="Permissão de admin"
                checked={editingUser.is_admin}
                onChange={(value) =>
                  setEditingUser({ ...editingUser, is_admin: value })
                }
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>

              <button
                onClick={saveEditUser}
                disabled={savingEdit}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {savingEdit ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
        <div className="text-emerald-300">{icon}</div>
      </div>
      <div className="mt-4 text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function MoneyCard({
  title,
  value,
  icon,
  money,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  money?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_10px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-zinc-400">{title}</div>
        <div className="text-cyan-300">{icon}</div>
      </div>
      <div className="mt-4 text-3xl font-black text-white">
        {money ? `R$ ${value.toFixed(2)}` : value}
      </div>
    </div>
  );
}

function PanelCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
          {icon}
          {title}
        </div>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function SectionShell({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_20px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="border-b border-white/10 bg-black/20 px-5 py-4">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
          {icon}
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function MiniUserRow({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle: string;
  meta: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
      <div className="font-medium text-white">{title}</div>
      <div className="mt-1 text-sm text-zinc-400 break-all">{subtitle}</div>
      <div className="mt-2 text-xs text-zinc-500">{meta}</div>
    </div>
  );
}

function ProfileBadge({
  label,
  tone,
}: {
  label: string;
  tone: "yellow" | "cyan" | "zinc";
}) {
  const styles =
    tone === "yellow"
      ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
      : tone === "cyan"
      ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
      : "border-zinc-500/20 bg-zinc-500/10 text-zinc-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}

function StatusBadge({ user }: { user: UserItem }) {
  if (user.is_blocked) {
    return (
      <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
        Bloqueado
      </span>
    );
  }

  if (user.is_active && !user.is_blocked) {
    return (
      <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
        Ativo
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-zinc-500/20 bg-zinc-500/10 px-3 py-1 text-xs font-medium text-zinc-300">
      Inativo
    </span>
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

function ActionButton({
  label,
  icon,
  onClick,
  loading,
  variant,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  variant: "neutral" | "danger" | "success";
}) {
  const styles =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-500 text-white"
      : variant === "success"
      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
      : "border border-white/10 bg-white/5 hover:bg-white/10 text-white";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition disabled:opacity-50 ${styles}`}
    >
      {icon}
      {loading ? "Processando..." : label}
    </button>
  );
}

function InputBlock({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition focus:border-emerald-400/30"
      />
    </div>
  );
}

function SelectBlock({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition focus:border-emerald-400/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleBlock({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-zinc-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR");
}

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}