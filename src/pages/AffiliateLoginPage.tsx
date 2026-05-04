import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function AffiliateLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro no login");
      }

      const user = data.user;

      if (!user?.is_partner) {
        throw new Error("Acesso permitido apenas para afiliados.");
      }

      saveAuth(data);
      navigate("/partner-dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white p-6">
      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Login de Afiliado
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-black border border-zinc-700 rounded"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-black border border-zinc-700 rounded"
          />

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            disabled={loading}
            className="w-full bg-emerald-500 p-3 rounded text-black font-bold"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}