import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Shield, UserCheck, UserX, RefreshCw } from "lucide-react";
import { getStoredUser } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const navigate = useNavigate();

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

function getToken() {
  return localStorage.getItem("token");
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR");
}

function badgeClass(kind: "green" | "red" | "yellow" | "blue" | "zinc") {
  if (kind === "green") return "border-green-500/30 bg-green-500/10 text-green-300";
  if (kind === "red") return "border-red-500/30 bg-red-500/10 text-red-300";
  if (kind === "yellow") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  if (kind === "blue") return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  return "border-zinc-700 bg-zinc-800/70 text-zinc-300";
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  async function toggleUserStatus(userId: number, type: "active" | "block") {
    const token = getToken();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    setActionLoadingId(userId);
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
}, [navigate]);

  const summary = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.is_active).length;
    const blocked = users.filter((u) => u.is_blocked).length;
    const admins = users.filter((u) => u.is_admin).length;

    return { total, active, blocked, admins };
  }, [users]);

  return (
    <div className="min-h-screen bg-[#03070d] text-white">
      <div className="border-b border-zinc-900/80 bg-[#03070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Painel Administrativo
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Gerencie usuários, acesso e status da plataforma
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadUsers(search)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-500/30 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <SummaryCard label="Total" value={summary.total} icon={<Shield className="h-5 w-5" />} />
          <SummaryCard label="Ativos" value={summary.active} icon={<UserCheck className="h-5 w-5" />} />
          <SummaryCard label="Bloqueados" value={summary.blocked} icon={<UserX className="h-5 w-5" />} />
          <SummaryCard label="Admins" value={summary.admins} icon={<Shield className="h-5 w-5" />} />
        </div>

        <div className="mt-6 rounded-[28px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xl font-semibold">Usuários</div>
              <div className="mt-1 text-sm text-zinc-400">
                Busque, revise e altere status de acesso
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/60"
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
                              user.is_active
                                ? badgeClass("green")
                                : badgeClass("yellow")
                            }`}
                          >
                            {user.is_active ? "Ativo" : "Inativo"}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              user.is_blocked
                                ? badgeClass("red")
                                : badgeClass("zinc")
                            }`}
                          >
                            {user.is_blocked ? "Bloqueado" : "Liberado"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-middle text-sm text-zinc-300">
                        {formatDate(user.access_expires_at)}
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
                            disabled={actionLoadingId === user.id}
                            onClick={() => toggleUserStatus(user.id, "active")}
                            className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/20 disabled:opacity-60"
                          >
                            {user.is_active ? "Desativar" : "Ativar"}
                          </button>

                          <button
                            type="button"
                            disabled={actionLoadingId === user.id}
                            onClick={() => toggleUserStatus(user.id, "block")}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                          >
                            {user.is_blocked ? "Desbloquear" : "Bloquear"}
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