import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import {
  AlertTriangle,
  BadgeDollarSign,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import { getStoredUser } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_blocked: boolean;
  is_admin: boolean;
  plan: string;
  plan_status: string;
  access_expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type AdminPayment = {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  provider: string;
  plan: string;
  reference_id: string;
  external_id: string | null;
  checkout_url: string | null;
  status: string;
  amount: number;
  amount_brl: number;
  created_at: string | null;
  updated_at: string | null;
};

type PlanFilter = "todos" | "mensal" | "trimestral" | "semestral";
type StatusFilter = "todos" | "ativos" | "inativos" | "bloqueados" | "admins" | "expirando";
type PaymentStatusFilter = "todos" | "pending" | "paid";

function getToken() {
  return localStorage.getItem("token");
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR");
}

function formatCurrency(value?: number | null) {
  const amount = Number(value ?? 0);
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function badgeClass(kind: "green" | "red" | "yellow" | "blue" | "zinc" | "purple") {
  if (kind === "green") return "border-green-500/30 bg-green-500/10 text-green-300";
  if (kind === "red") return "border-red-500/30 bg-red-500/10 text-red-300";
  if (kind === "yellow") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  if (kind === "blue") return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  if (kind === "purple") return "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300";
  return "border-zinc-700 bg-zinc-800/70 text-zinc-300";
}

function isExpiringSoon(value?: string | null, days = 7) {
  if (!value) return false;
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return false;

  const now = Date.now();
  const diff = target - now;
  const limit = days * 24 * 60 * 60 * 1000;

  return diff >= 0 && diff <= limit;
}

function isExpired(value?: string | null) {
  if (!value) return false;
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return false;
  return target < Date.now();
}

function toLocalDatetimeInput(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("todos");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<PaymentStatusFilter>("todos");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPlan, setEditPlan] = useState("mensal");
  const [editPlanStatus, setEditPlanStatus] = useState("active");
  const [editExpiresAt, setEditExpiresAt] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editIsBlocked, setEditIsBlocked] = useState(false);
  const [editIsAdmin, setEditIsAdmin] = useState(false);

  async function loadUsers(searchTerm = "") {
    const token = getToken();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = new URL(`${API_URL}/admin/users`);

      if (searchTerm.trim()) {
        url.searchParams.set("search", searchTerm.trim());
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Erro ao carregar usuários");
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function loadPayments(searchTerm = "", status: PaymentStatusFilter = "todos") {
    const token = getToken();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    setPaymentsLoading(true);
    setError("");

    try {
      const url = new URL(`${API_URL}/admin/payments`);

      if (searchTerm.trim()) {
        url.searchParams.set("search", searchTerm.trim());
      }

      if (status !== "todos") {
        url.searchParams.set("status_filter", status);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Erro ao carregar pagamentos");
      }

      setPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar pagamentos");
    } finally {
      setPaymentsLoading(false);
    }
  }

  async function toggleUserStatus(userId: number, type: "active" | "block") {
    const token = getToken();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    setActionLoadingId(`user-${userId}-${type}`);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        type === "active"
          ? `${API_URL}/admin/users/${userId}/toggle-active`
          : `${API_URL}/admin/users/${userId}/toggle-block`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Erro ao atualizar usuário");
      }

      setSuccess(data?.message || "Usuário atualizado com sucesso");
      await loadUsers(search);
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar usuário");
    } finally {
      setActionLoadingId(null);
    }
  }

  function openEditModal(user: AdminUser) {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPlan(user.plan || "mensal");
    setEditPlanStatus(user.plan_status || "active");
    setEditExpiresAt(
      user.access_expires_at
        ? new Date(user.access_expires_at).toISOString().slice(0, 16)
        : ""
    );
    setEditIsActive(user.is_active);
    setEditIsBlocked(user.is_blocked);
    setEditIsAdmin(user.is_admin);
    setError("");
    setSuccess("");
  }

  function applyPlanDuration(plan: string) {
    const now = new Date();

    if (plan === "mensal") {
      now.setDate(now.getDate() + 30);
    } else if (plan === "trimestral") {
      now.setDate(now.getDate() + 90);
    } else if (plan === "semestral") {
      now.setDate(now.getDate() + 180);
    }

    setEditExpiresAt(toLocalDatetimeInput(now));
  }

  async function saveUserEdit() {
    if (!editingUser) return;

    const token = getToken();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    setSavingEdit(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: editingUser.id,
          name: editName,
          email: editEmail,
          plan: editPlan,
          plan_status: editPlanStatus,
          access_expires_at: editExpiresAt
            ? new Date(editExpiresAt).toISOString()
            : null,
          is_active: editIsActive,
          is_blocked: editIsBlocked,
          is_admin: editIsAdmin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Erro ao salvar usuário");
      }

      setSuccess(data?.message || "Usuário atualizado com sucesso");
      setEditingUser(null);
      await loadUsers(search);
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar usuário");
    } finally {
      setSavingEdit(false);
    }
  }

  async function quickRenewUser(
    user: AdminUser,
    plan: "mensal" | "trimestral" | "semestral"
  ) {
    const token = getToken();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    setActionLoadingId(`renew-${user.id}-${plan}`);
    setError("");
    setSuccess("");

    try {
      const baseDate =
        user.access_expires_at && !isExpired(user.access_expires_at)
          ? new Date(user.access_expires_at)
          : new Date();

      const nextDate = new Date(baseDate);

      if (plan === "mensal") {
        nextDate.setDate(nextDate.getDate() + 30);
      } else if (plan === "trimestral") {
        nextDate.setDate(nextDate.getDate() + 90);
      } else {
        nextDate.setDate(nextDate.getDate() + 180);
      }

      const response = await fetch(`${API_URL}/admin/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          name: user.name,
          email: user.email,
          plan,
          plan_status: "active",
          access_expires_at: nextDate.toISOString(),
          is_active: true,
          is_blocked: user.is_blocked,
          is_admin: user.is_admin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Erro ao renovar usuário");
      }

      setSuccess(
        `Acesso renovado com sucesso: ${user.name} → ${plan} até ${formatDate(
          nextDate.toISOString()
        )}`
      );
      await loadUsers(search);
    } catch (err: any) {
      setError(err?.message || "Erro ao renovar usuário");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function confirmPayment(payment: AdminPayment) {
    const token = getToken();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    setActionLoadingId(`payment-confirm-${payment.id}`);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/admin/payments/${payment.id}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_id: payment.id,
          activate_user: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Erro ao confirmar pagamento");
      }

      setSuccess(data?.message || "Pagamento confirmado com sucesso");
      await Promise.all([
        loadUsers(search),
        loadPayments(paymentSearch, paymentStatusFilter),
      ]);
    } catch (err: any) {
      setError(err?.message || "Erro ao confirmar pagamento");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function markPaymentPending(payment: AdminPayment) {
    const token = getToken();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    setActionLoadingId(`payment-pending-${payment.id}`);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/admin/payments/${payment.id}/mark-pending`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Erro ao marcar pagamento como pendente");
      }

      setSuccess(data?.message || "Pagamento marcado como pendente");
      await loadPayments(paymentSearch, paymentStatusFilter);
    } catch (err: any) {
      setError(err?.message || "Erro ao marcar pagamento");
    } finally {
      setActionLoadingId(null);
    }
  }

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!user.is_admin) {
      navigate("/home-premium", { replace: true });
      return;
    }

    loadUsers();
    loadPayments();
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const byPlan =
        planFilter === "todos" ? true : user.plan === planFilter;

      const byStatus =
        statusFilter === "todos"
          ? true
          : statusFilter === "ativos"
          ? user.is_active
          : statusFilter === "inativos"
          ? !user.is_active
          : statusFilter === "bloqueados"
          ? user.is_blocked
          : statusFilter === "admins"
          ? user.is_admin
          : statusFilter === "expirando"
          ? isExpiringSoon(user.access_expires_at, 7)
          : true;

      return byPlan && byStatus;
    });
  }, [users, planFilter, statusFilter]);

  const expiringSoonUsers = useMemo(() => {
    return users
      .filter((u) => isExpiringSoon(u.access_expires_at, 7))
      .sort((a, b) => {
        const da = a.access_expires_at ? new Date(a.access_expires_at).getTime() : 0;
        const db = b.access_expires_at ? new Date(b.access_expires_at).getTime() : 0;
        return da - db;
      });
  }, [users]);

  const summary = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.is_active).length;
    const blocked = users.filter((u) => u.is_blocked).length;
    const admins = users.filter((u) => u.is_admin).length;

    return { total, active, blocked, admins };
  }, [users]);

  const paymentSummary = useMemo(() => {
    const total = payments.length;
    const pending = payments.filter((p) => p.status === "pending").length;
    const paid = payments.filter((p) => p.status === "paid").length;
    const totalRevenue = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + (p.amount_brl || 0), 0);

    return { total, pending, paid, totalRevenue };
  }, [payments]);

  return (
    <div className="min-h-screen bg-[#03070d] text-white">
      <div className="border-b border-zinc-900/80 bg-[#03070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Painel Administrativo
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Gerencie usuários, assinaturas, pagamentos e renovações
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadUsers(search);
              loadPayments(paymentSearch, paymentStatusFilter);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-500/30 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar tudo
          </button>
        </div>
      </div>

      <div
        onClick={() => navigate("/admin/afiliados")}
        className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500/40 hover:bg-zinc-800"
      >
        <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
          <BarChart3 className="h-6 w-6" />
        </div>

        <h3 className="text-lg font-bold text-white">
          Afiliados
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          Gerencie parceiros, comissões e repasses
        </p>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <SummaryCard label="Total" value={summary.total} icon={<Shield className="h-5 w-5" />} />
          <SummaryCard label="Ativos" value={summary.active} icon={<UserCheck className="h-5 w-5" />} />
          <SummaryCard label="Bloqueados" value={summary.blocked} icon={<UserX className="h-5 w-5" />} />
          <SummaryCard label="Admins" value={summary.admins} icon={<Shield className="h-5 w-5" />} />
        </div>

        {expiringSoonUsers.length > 0 && (
          <div className="mt-6 rounded-[24px] border border-yellow-500/20 bg-yellow-500/10 p-5">
            <div className="flex items-center gap-2 text-yellow-300">
              <AlertTriangle className="h-5 w-5" />
              <div className="text-lg font-semibold">Expiram em breve</div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {expiringSoonUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-yellow-500/20 bg-black/20 p-4"
                >
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="mt-1 text-sm text-zinc-400">{user.email}</div>
                  <div className="mt-3 text-sm text-yellow-300">
                    Expira em: {formatDate(user.access_expires_at)}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={actionLoadingId === `renew-${user.id}-mensal`}
                      onClick={() => quickRenewUser(user, "mensal")}
                      className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-60"
                    >
                      +30 dias
                    </button>
                    <button
                      type="button"
                      disabled={actionLoadingId === `renew-${user.id}-trimestral`}
                      onClick={() => quickRenewUser(user, "trimestral")}
                      className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-60"
                    >
                      +90 dias
                    </button>
                    <button
                      type="button"
                      disabled={actionLoadingId === `renew-${user.id}-semestral`}
                      onClick={() => quickRenewUser(user, "semestral")}
                      className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-60"
                    >
                      +180 dias
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-[28px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xl font-semibold">Usuários</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Busque, filtre, revise e renove acessos rapidamente
                </div>
              </div>

              <div className="flex w-full max-w-xl items-center gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome ou e-mail"
                    className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 pl-10 pr-4 text-sm text-white outline-none transition focus:border-cyan-500/40"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => loadUsers(search)}
                  className="h-11 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Filtro por plano</label>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as PlanFilter)}
                  className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-cyan-500/40"
                >
                  <option value="todos">Todos os planos</option>
                  <option value="mensal">Mensal</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">Filtro por status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-cyan-500/40"
                >
                  <option value="todos">Todos</option>
                  <option value="ativos">Ativos</option>
                  <option value="inativos">Inativos</option>
                  <option value="bloqueados">Bloqueados</option>
                  <option value="admins">Admins</option>
                  <option value="expirando">Expiram em breve</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setPlanFilter("todos");
                    setStatusFilter("todos");
                    setSearch("");
                    loadUsers("");
                  }}
                  className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-300 transition hover:text-white"
                >
                  Limpar filtros
                </button>
              </div>

              <div className="flex items-end">
                <div className="flex h-11 w-full items-center rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 text-sm text-zinc-400">
                  Mostrando {filteredUsers.length} de {users.length} usuários
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {success}
            </div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-2">Usuário</th>
                  <th className="px-4 py-2">Plano</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Expira em</th>
                  <th className="px-4 py-2">Admin</th>
                  <th className="px-4 py-2">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const expiringSoon = isExpiringSoon(user.access_expires_at, 7);
                    const expired = isExpired(user.access_expires_at);

                    return (
                      <tr
                        key={user.id}
                        className={`rounded-2xl border bg-zinc-900/60 ${
                          expired
                            ? "border-red-500/20"
                            : expiringSoon
                            ? "border-yellow-500/20"
                            : "border-zinc-800"
                        }`}
                      >
                        <td className="rounded-l-2xl px-4 py-4 align-middle">
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="mt-1 text-sm text-zinc-400">{user.email}</div>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                            {user.plan || "none"}
                          </div>
                          <div className="mt-2 text-xs text-zinc-500">
                            {user.plan_status || "pending"}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                user.is_active ? badgeClass("green") : badgeClass("yellow")
                              }`}
                            >
                              {user.is_active ? "Ativo" : "Inativo"}
                            </span>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                user.is_blocked ? badgeClass("red") : badgeClass("zinc")
                              }`}
                            >
                              {user.is_blocked ? "Bloqueado" : "Liberado"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-middle text-sm">
                          <div
                            className={
                              expired
                                ? "text-red-300"
                                : expiringSoon
                                ? "text-yellow-300"
                                : "text-zinc-300"
                            }
                          >
                            {formatDate(user.access_expires_at)}
                          </div>

                          {expired ? (
                            <div className="mt-1 text-xs text-red-400">Expirado</div>
                          ) : expiringSoon ? (
                            <div className="mt-1 text-xs text-yellow-400">Expira em breve</div>
                          ) : null}
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              user.is_admin ? badgeClass("blue") : badgeClass("zinc")
                            }`}
                          >
                            {user.is_admin ? "Admin" : "Usuário"}
                          </span>
                        </td>

                        <td className="rounded-r-2xl px-4 py-4 align-middle">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(user)}
                              className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              disabled={actionLoadingId === `user-${user.id}-active`}
                              onClick={() => toggleUserStatus(user.id, "active")}
                              className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/20 disabled:opacity-60"
                            >
                              {user.is_active ? "Desativar" : "Ativar"}
                            </button>

                            <button
                              type="button"
                              disabled={actionLoadingId === `user-${user.id}-block`}
                              onClick={() => toggleUserStatus(user.id, "block")}
                              className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                            >
                              {user.is_blocked ? "Desbloquear" : "Bloquear"}
                            </button>

                            <button
                              type="button"
                              disabled={actionLoadingId === `renew-${user.id}-mensal`}
                              onClick={() => quickRenewUser(user, "mensal")}
                              className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-60"
                            >
                              Renovar 30d
                            </button>

                            <button
                              type="button"
                              disabled={actionLoadingId === `renew-${user.id}-trimestral`}
                              onClick={() => quickRenewUser(user, "trimestral")}
                              className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-60"
                            >
                              Renovar 90d
                            </button>

                            <button
                              type="button"
                              disabled={actionLoadingId === `renew-${user.id}-semestral`}
                              onClick={() => quickRenewUser(user, "semestral")}
                              className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-60"
                            >
                              Renovar 180d
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-fuchsia-300" />
            <h2 className="text-xl font-semibold text-white">Pagamentos e Assinaturas</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <SummaryCard
              label="Pagamentos"
              value={paymentSummary.total}
              icon={<BadgeDollarSign className="h-5 w-5" />}
            />
            <SummaryCard
              label="Pendentes"
              value={paymentSummary.pending}
              icon={<AlertTriangle className="h-5 w-5" />}
            />
            <SummaryCard
              label="Pagos"
              value={paymentSummary.paid}
              icon={<UserCheck className="h-5 w-5" />}
            />
            <MoneyCard label="Receita confirmada" value={paymentSummary.totalRevenue} />
          </div>

          <div className="mt-6 rounded-[28px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Buscar pagamento</label>
                  <input
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    placeholder="Nome, e-mail, referência..."
                    className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none transition focus:border-fuchsia-500/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Status</label>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) =>
                      setPaymentStatusFilter(e.target.value as PaymentStatusFilter)
                    }
                    className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none transition focus:border-fuchsia-500/40"
                  >
                    <option value="todos">Todos</option>
                    <option value="pending">Pendentes</option>
                    <option value="paid">Pagos</option>
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <button
                    type="button"
                    onClick={() => loadPayments(paymentSearch, paymentStatusFilter)}
                    className="h-11 flex-1 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 text-sm font-medium text-fuchsia-300 transition hover:bg-fuchsia-500/20"
                  >
                    Buscar pagamentos
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentSearch("");
                      setPaymentStatusFilter("todos");
                      loadPayments("", "todos");
                    }}
                    className="h-11 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-300 transition hover:text-white"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-4 py-2">Usuário</th>
                    <th className="px-4 py-2">Plano</th>
                    <th className="px-4 py-2">Valor</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Referência</th>
                    <th className="px-4 py-2">Criado em</th>
                    <th className="px-4 py-2">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {paymentsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                        Carregando pagamentos...
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                        Nenhum pagamento encontrado.
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/60"
                      >
                        <td className="rounded-l-2xl px-4 py-4 align-middle">
                          <div className="font-medium text-white">{payment.user_name}</div>
                          <div className="mt-1 text-sm text-zinc-400">{payment.user_email}</div>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <span className="inline-flex rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
                            {payment.plan}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-middle text-sm text-zinc-300">
                          {formatCurrency(payment.amount_brl)}
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              payment.status === "paid"
                                ? badgeClass("green")
                                : payment.status === "pending"
                                ? badgeClass("yellow")
                                : badgeClass("zinc")
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-middle text-sm text-zinc-300">
                          <div>{payment.reference_id || "—"}</div>
                          <div className="mt-1 text-xs text-zinc-500">
                            {payment.external_id || "sem external_id"}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-middle text-sm text-zinc-300">
                          {formatDate(payment.created_at)}
                        </td>

                        <td className="rounded-r-2xl px-4 py-4 align-middle">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={actionLoadingId === `payment-confirm-${payment.id}`}
                              onClick={() => confirmPayment(payment)}
                              className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/20 disabled:opacity-60"
                            >
                              Confirmar pagamento
                            </button>

                            <button
                              type="button"
                              disabled={actionLoadingId === `payment-pending-${payment.id}`}
                              onClick={() => markPaymentPending(payment)}
                              className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-medium text-yellow-300 transition hover:bg-yellow-500/20 disabled:opacity-60"
                            >
                              Marcar pendente
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
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-[28px] border border-zinc-800 bg-[#0b1118] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Editar usuário</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Atualize plano, status, validade e permissões
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Nome</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-cyan-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">E-mail</label>
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-cyan-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">Plano</label>
                <select
                  value={editPlan}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditPlan(value);
                    applyPlanDuration(value);
                  }}
                  className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-cyan-500/40"
                >
                  <option value="mensal">Mensal</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">Status do plano</label>
                <select
                  value={editPlanStatus}
                  onChange={(e) => setEditPlanStatus(e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-cyan-500/40"
                >
                  <option value="active">Ativo</option>
                  <option value="pending">Pendente</option>
                  <option value="expired">Expirado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">Expira em</label>
                <input
                  type="datetime-local"
                  value={editExpiresAt}
                  onChange={(e) => setEditExpiresAt(e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-cyan-500/40"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-zinc-400">
                  Atalhos de validade
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPlanDuration("mensal")}
                    className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                  >
                    +30 dias
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPlanDuration("trimestral")}
                    className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                  >
                    +90 dias
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPlanDuration("semestral")}
                    className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                  >
                    +180 dias
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditExpiresAt("")}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:text-white"
                  >
                    Limpar validade
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                />
                Usuário ativo
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={editIsBlocked}
                  onChange={(e) => setEditIsBlocked(e.target.checked)}
                />
                Usuário bloqueado
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={editIsAdmin}
                  onChange={(e) => setEditIsAdmin(e.target.checked)}
                />
                Administrador
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={savingEdit}
                onClick={saveUserEdit}
                className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-60"
              >
                {savingEdit ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">{label}</div>
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-cyan-300">
          {icon}
        </div>
      </div>

      <div className="mt-4 text-3xl font-bold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

function MoneyCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[24px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-5">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-4 text-3xl font-bold tracking-tight text-fuchsia-300">
        {formatCurrency(value)}
      </div>
    </div>
  );
}