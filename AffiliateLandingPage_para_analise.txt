import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Handshake } from "lucide-react";
import { saveAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function AffiliateLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setAuthError("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Falha no login");
      }

      const user = data.user;

      if (!user?.is_partner) {
        throw new Error("Este login é exclusivo para afiliados aprovados.");
      }

      saveAuth(data);
      navigate("/partner-dashboard");
    } catch (error: any) {
      setAuthError(error.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-3xl border border-emerald-500/20 bg-zinc-950 p-8 shadow-2xl shadow-emerald-950/30">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
              <Handshake />
            </div>

            <h1 className="text-2xl font-black">Login de Afiliado</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Acesse seu painel de vendas e comissões.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="E-mail do afiliado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />

            {authError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {authError}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar no painel"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Não é afiliado ainda?{" "}
            <Link to="/parceiros" className="text-emerald-300">
              Solicitar pelo WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}