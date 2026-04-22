import { useEffect, useMemo, useState } from "react";
import { getStoredToken, getStoredUser, clearAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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

type ActionType = "activate" | "renew" | "block" | "make-admin";
type PlanType = "mensal" | "trimestral" | "semestral";

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "blocked" | "trial" | "partners" | "admins"
  >("all");

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [selectedPlanByUser, setSelectedPlanByUser] = useState<Record<number, PlanType>>({});

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

    loadUsers();
  }, [navigate]);

  async function loadUsers() {
    const token = getStoredToken();

    if (!token) {
      setPageError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setPageError("");

      const response = await fetch(`${API_URL}/auth/users`, {
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
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao carregar usuários.");
      }

      setUsers(Array.isArray(data) ? data : []);

      const initialPlans: Record<number, PlanType> = {};
      for (const user of Array.isArray(data) ? data : []) {
        const currentPlan = (user.plan || "mensal").toLowerCase();
        if (
          currentPlan === "mensal" ||
          currentPlan === "trimestral" ||
          currentPlan === "semestral"
        ) {
          initialPlans[user.id] = currentPlan;
        } else {
          initialPlans[user.id] = "mensal";
        }
      }
      setSelectedPlanByUser(initialPlans);
    } catch (error: any) {
      setPageError(error.message || "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  async function runUserAction(
    userId: number,
    action: ActionType,
    plan?: PlanType
  ) {
    const token = getStoredToken();

    if (!token) {
      setPageError("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setActionLoadingId(userId);

      let url = "";
      let body: Record<string, any> | undefined = undefined;

      if (action === "activate") {
        url = `${API_URL}/auth/activate/${userId}`;
        body = { plan: plan || "mensal" };
      }

      if (action === "renew") {
        url = `${API_URL}/auth/renew/${userId}`;
        body = { plan: plan || "mensal" };
      }

      if (action === "block") {
        url = `${API_URL}/auth/block/${userId}`;
        body = { reason: "Ação administrativa" };
      }

      if (action === "make-admin") {
        url = `${API_URL}/auth/make-admin/${userId}`;
      }

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
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

      await loadUsers();
    } catch (error: any) {
      alert(error.message || "Erro ao executar ação.");
    } finally {
      setActionLoadingId(null);
    }
  }

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);

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

  function formatDate(value?: string | null) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("pt-BR");
    }

  function getAccessLabel(user: UserItem) {
    if (user.is_blocked) return "Bloqueado";
    if (user.is_active && !user.is_blocked) return "Ativo";
    return "Inativo";
  }

  function getBadgeClass(user: UserItem) {
    if (user.is_blocked) {
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    }
    if (user.is_active && !user.is_blocked) {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    return "bg-zinc-500/10 text-zinc-300 border border-zinc-500/20";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Carregando painel administrativo...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black">Painel Admin</h1>
              <p className="mt-2 text-zinc-400">
                Gerencie usuários, planos, bloqueios e permissões administrativas.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadUsers}
                className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Atualizar
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        {pageError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {pageError}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Total de usuários</p>
            <p className="mt-2 text-3xl font-black">{users.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Usuários ativos</p>
            <p className="mt-2 text-3xl font-black">
              {users.filter((u) => u.is_active && !u.is_blocked).length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Parceiros</p>
            <p className="mt-2 text-3xl font-black">
              {users.filter((u) => u.is_partner === true).length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Admins</p>
            <p className="mt-2 text-3xl font-black">
              {users.filter((u) => u.is_admin === true).length}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400/40"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "all"
                    | "active"
                    | "blocked"
                    | "trial"
                    | "partners"
                    | "admins"
                )
              }
              className="h-12 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-emerald-400/40"
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

        <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900">
          <table className="min-w-[1200px] w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400">
              <tr>
                <th className="px-4 py-4">Usuário</th>
                <th className="px-4 py-4">Plano</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Expira em</th>
                <th className="px-4 py-4">Perfil</th>
                <th className="px-4 py-4">Plano da ação</th>
                <th className="px-4 py-4">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const currentPlan = selectedPlanByUser[user.id] || "mensal";
                  const loadingThisUser = actionLoadingId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-zinc-800/60 align-top"
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="mt-1 text-zinc-400 break-all">
                          {user.email}
                        </div>
                        <div className="mt-2 text-xs text-zinc-500">
                          ID: {user.id}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="capitalize text-white">{user.plan || "-"}</div>
                        <div className="mt-1 text-zinc-400">
                          {user.plan_status || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getBadgeClass(
                            user
                          )}`}
                        >
                          {getAccessLabel(user)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        {formatDate(user.access_expires_at)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {user.is_admin ? (
                            <span className="inline-flex w-fit rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
                              Admin
                            </span>
                          ) : null}

                          {user.is_partner ? (
                            <span className="inline-flex w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                              Parceiro
                            </span>
                          ) : null}

                          {!user.is_admin && !user.is_partner ? (
                            <span className="inline-flex w-fit rounded-full border border-zinc-500/20 bg-zinc-500/10 px-3 py-1 text-xs font-medium text-zinc-300">
                              Cliente
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={currentPlan}
                          onChange={(e) =>
                            setSelectedPlanByUser((prev) => ({
                              ...prev,
                              [user.id]: e.target.value as PlanType,
                            }))
                          }
                          className="h-10 min-w-[150px] rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none"
                        >
                          <option value="mensal">Mensal</option>
                          <option value="trimestral">Trimestral</option>
                          <option value="semestral">Semestral</option>
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            disabled={loadingThisUser}
                            onClick={() =>
                              runUserAction(user.id, "activate", currentPlan)
                            }
                            className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                          >
                            Ativar
                          </button>

                          <button
                            disabled={loadingThisUser}
                            onClick={() =>
                              runUserAction(user.id, "renew", currentPlan)
                            }
                            className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                          >
                            Renovar
                          </button>

                          <button
                            disabled={loadingThisUser}
                            onClick={() => runUserAction(user.id, "block")}
                            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                          >
                            Bloquear
                          </button>

                          {!user.is_admin ? (
                            <button
                              disabled={loadingThisUser}
                              onClick={() => runUserAction(user.id, "make-admin")}
                              className="rounded-xl bg-yellow-600 px-3 py-2 text-xs font-medium text-black hover:bg-yellow-500 disabled:opacity-50"
                            >
                              Tornar admin
                            </button>
                          ) : null}
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
    </div>
  );
}