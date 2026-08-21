import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Handshake, CheckCircle2 } from "lucide-react";
import { saveAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function AffiliateLandingPage() {
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
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Falha no login");
      if (!data.user?.is_partner) throw new Error("Use o acesso do programa de parceiros.");

      saveAuth(data);
      navigate("/partner-dashboard");
    } catch (error: any) {
      setAuthError(error.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03070d] px-4 py-10 text-white">
      <main className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-black p-8">
            <Handshake className="text-emerald-400" />
            <h1 className="mt-6 text-4xl font-black">Programa de Parceiros Gluck's Trader IA</h1>
            <p className="mt-4 text-zinc-300">
              Transforme sua audiência em uma nova fonte de receita divulgando uma plataforma inteligente para traders.
            </p>

            <ul className="mt-6 space-y-3 text-zinc-300">
              <li>✓ Link exclusivo de indicação</li>
              <li>✓ Dashboard com resultados</li>
              <li>✓ Acompanhamento de comissões</li>
              <li>✓ Estrutura para crescer</li>
            </ul>

            <Link to="/cadastro-parceiro" className="mt-8 inline-block rounded-xl bg-emerald-400 px-6 py-3 font-black text-black">
              Quero ser parceiro
            </Link>
          </div>

          <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-3xl font-black">Já sou parceiro</h2>
            <p className="mt-2 text-zinc-400">Acesse seu painel de crescimento.</p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input className="w-full rounded-xl bg-black p-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <input className="w-full rounded-xl bg-black p-3" placeholder="Senha" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

              {authError && <p className="text-red-400">{authError}</p>}

              <button className="w-full rounded-xl bg-emerald-400 py-3 font-black text-black" disabled={loading}>
                {loading ? "Entrando..." : "Acessar meu painel"}
              </button>
            </form>

            <p className="mt-5 text-sm text-zinc-400">
              Ainda não é parceiro? <Link className="text-emerald-300" to="/cadastro-parceiro">Criar conta</Link>
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-2xl font-black">Como funciona</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {["Cadastre-se","Receba seu link","Indique clientes","Acompanhe resultados"].map(x =>
              <div key={x} className="rounded-xl border border-zinc-800 p-4">
                <CheckCircle2 className="text-emerald-400"/>
                <p className="mt-2 font-bold">{x}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}