import { useEffect, useState } from "react";
import { getStoredToken, getStoredUser, clearAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (!user || !user.is_admin) {
      navigate("/home-premium");
      return;
    }
    loadUsers();
  }, []);

  async function loadUsers() {
    const token = getStoredToken();

    const res = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  function openEdit(user: any) {
    setSelectedUser(user);
    setEditData(user);
  }

  function closeEdit() {
    setSelectedUser(null);
  }

  async function saveUser() {
    const token = getStoredToken();

    await fetch(`${API_URL}/admin/users/${selectedUser.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: selectedUser.id,
        ...editData,
      }),
    });

    closeEdit();
    loadUsers();
  }

  async function toggleBlock(id: number) {
    const token = getStoredToken();

    await fetch(`${API_URL}/admin/users/${id}/toggle-block`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadUsers();
  }

  async function toggleActive(id: number) {
    const token = getStoredToken();

    await fetch(`${API_URL}/admin/users/${id}/toggle-active`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadUsers();
  }

  function logout() {
    clearAuth();
    navigate("/login");
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black">Painel Admin</h1>
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded-xl"
        >
          Sair
        </button>
      </div>

      {/* BUSCA */}
      <input
        type="text"
        placeholder="Buscar usuário..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded-xl bg-zinc-900 border border-zinc-700"
      />

      {/* TABELA */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Plano</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-zinc-800">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.plan}</td>
                <td className="p-3">
                  {u.is_blocked ? "Bloqueado" : u.is_active ? "Ativo" : "Inativo"}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="bg-blue-600 px-3 py-1 rounded-lg"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => toggleBlock(u.id)}
                    className="bg-red-600 px-3 py-1 rounded-lg"
                  >
                    Bloquear
                  </button>

                  <button
                    onClick={() => toggleActive(u.id)}
                    className="bg-green-600 px-3 py-1 rounded-lg"
                  >
                    Ativar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold">Editar Usuário</h2>

            <input
              value={editData.name || ""}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full p-2 rounded bg-zinc-800"
              placeholder="Nome"
            />

            <input
              value={editData.email || ""}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              className="w-full p-2 rounded bg-zinc-800"
              placeholder="Email"
            />

            <select
              value={editData.plan || "mensal"}
              onChange={(e) =>
                setEditData({ ...editData, plan: e.target.value })
              }
              className="w-full p-2 rounded bg-zinc-800"
            >
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={saveUser}
                className="bg-green-600 px-4 py-2 rounded-xl"
              >
                Salvar
              </button>

              <button
                onClick={closeEdit}
                className="bg-zinc-700 px-4 py-2 rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}