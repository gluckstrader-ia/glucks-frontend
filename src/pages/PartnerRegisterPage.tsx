import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeDollarSign, BarChart3, Megaphone, ShieldCheck } from "lucide-react";
import { saveAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function PartnerRegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegisterPartner() {
    try {
      setLoading(true);
      setError("");

      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          referred_by_code: null,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(registerData.detail || "Erro ao criar conta.");
      }

      saveAuth(registerData.access_token, registerData.user);

      const joinRes = await fetch(`${API_URL}/partners/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${registerData.access_token}`,
        },
      });

      const joinData = await joinRes.json();

      if (!joinRes.ok) {
        throw new Error(joinData.detail || "Erro ao ativar programa de parceiros.");
      }

      navigate("/dashboard-parceiro");
    } catch (err: any) {
      setError(err.message || "Erro ao entrar no programa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-16">
        <section className="rounded-[28px] border border-zinc-800 bg-zinc-900/90 p-8">
          <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            Cadastro de parceiro
          </div>

          <h1 className="mt-5 text-4xl font-black leading-tight">
            Entre no programa de parceiros da Gluck’s Trader IA
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Crie sua conta, ative seu código exclusivo e acesse seu dashboard de comissões e materiais.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-4 text-white outline-none transition focus:border-emerald-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-4 text-white outline-none transition focus:border-emerald-400"
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-4 text-white outline-none transition focus:border-emerald-400"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleRegisterPartner}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-4 text-base font-bold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta e entrar no programa"}
          </button>

          <div className="mt-5 text-sm text-zinc-400">
            Já tem conta?{" "}
            <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Entrar
            </Link>
          </div>
        </section>

        <aside className="rounded-[28px] border border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_40%)] bg-zinc-900/90 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            O que você recebe
          </div>

          <h2 className="mt-4 text-3xl font-black">
            Um fluxo profissional para divulgar e acompanhar seus resultados
          </h2>

          <div className="mt-8 space-y-4">
            {[
              {
                icon: <BadgeDollarSign className="h-5 w-5" />,
                title: "10% recorrente",
                text: "Receba comissão sobre assinaturas ativas vinculadas ao seu código.",
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                title: "Dashboard exclusivo",
                text: "Acompanhe suas métricas, comissões e histórico em um só lugar.",
              },
              {
                icon: <Megaphone className="h-5 w-5" />,
                title: "Materiais prontos",
                text: "Tenha textos e criativos para divulgar com mais rapidez.",
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Ativação imediata",
                text: "Crie sua conta e já entre no programa sem burocracia.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5"
              >
                <div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                  {item.icon}
                </div>
                <div className="text-lg font-bold">{item.title}</div>
                <div className="mt-2 text-sm leading-7 text-zinc-400">{item.text}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}