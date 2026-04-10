import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { saveAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type RegisterResponseUser = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_blocked: boolean;
  is_admin: boolean;
  plan: string;
  plan_status: string;
  access_expires_at: string | null;
  has_access: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

type RegisterResponse = {
  access_token: string;
  token_type: string;
  user: RegisterResponseUser;
};

type ErrorResponse = {
  detail?: string | { msg?: string }[];
};

export default function RegisterTrialPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trialEndLabel = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    try {
      return end.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "em 5 dias";
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError("Preencha nome, email e senha.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = (await response.json()) as RegisterResponse | ErrorResponse;

      if (!response.ok) {
        let message = "Não foi possível criar sua conta.";

        if ("detail" in data) {
          const detail = data.detail;

          if (typeof detail === "string") {
            message = detail;
          } else if (Array.isArray(detail) && detail.length > 0) {
            const first = detail[0];
            if (first?.msg) {
              message = first.msg;
            }
          }
        }

        setError(message);
        return;
      }

      const authData = data as RegisterResponse;

      // Mantém compatibilidade com o que já funciona no projeto
      saveAuth(authData.access_token, authData.user);

      if (authData.user?.has_access) {
        navigate("/dashboard", { replace: true });
        return;
      }

      navigate("/premium", { replace: true });
    } catch {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02050a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_35%),radial-gradient(circle_at_right,_rgba(6,182,212,0.12),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.10),_transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 md:px-6 lg:px-10">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative rounded-[32px] border border-emerald-500/20 bg-white/[0.04] p-6 shadow-[0_0_80px_rgba(16,185,129,0.10)] backdrop-blur-2xl md:p-8 lg:p-10">
            <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 shadow-[0_0_35px_rgba(16,185,129,0.18)]">
                <BrainCircuit className="h-7 w-7 text-emerald-300" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-emerald-300/90">
                  Acesso experimental
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Teste grátis por 5 dias
                </h1>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-7 text-zinc-300 md:text-base">
              Crie sua conta e entre agora na plataforma Gluck’s Trader IA com
              acesso liberado ao ambiente premium, análises inteligentes e
              experiência visual profissional.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                  Liberação
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Imediata
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                  Expira em
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {trialEndLabel}
                </p>
              </div>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Seu nome completo"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-[#050a12] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-[#050a12] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                />

                <input
                  type="password"
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-[#050a12] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-emerald-400 text-base font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.55),transparent)] translate-x-[-120%] transition duration-1000 group-hover:translate-x-[120%]" />
                <span className="relative z-10">
                  {loading ? "Criando conta..." : "Começar meu teste grátis"}
                </span>
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
                Sem compromisso
              </span>
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-cyan-300">
                Acesso premium liberado
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Cadastro em menos de 1 minuto
              </span>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Já tem conta?{" "}
              <Link
                to="/login"
                className="font-medium text-emerald-300 transition hover:text-emerald-200"
              >
                Entrar
              </Link>
            </p>
          </section>

          <aside className="relative rounded-[32px] border border-white/10 bg-black/30 p-6 shadow-[0_0_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300">
                  Plataforma premium
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  O que você desbloqueia
                </h2>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300">
                Trial ativo
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-emerald-500/15 bg-[linear-gradient(180deg,rgba(16,185,129,0.10),rgba(255,255,255,0.02))] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Painel inteligente</p>
                    <p className="text-xl font-semibold text-white">
                      Dashboard ao vivo
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                    Live
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-black/30 p-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      Score
                    </p>
                    <p className="mt-2 text-lg font-semibold text-emerald-300">
                      89%
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      Setup
                    </p>
                    <p className="mt-2 text-lg font-semibold text-cyan-300">
                      Compra
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      Timing
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">5m</p>
                  </div>
                </div>

                <div className="mt-4 h-28 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#07111d,#03070d)] p-4">
                  <div className="flex h-full items-end gap-2">
                    <div className="h-[35%] w-full rounded-t-xl bg-emerald-400/70" />
                    <div className="h-[48%] w-full rounded-t-xl bg-emerald-400/70" />
                    <div className="h-[42%] w-full rounded-t-xl bg-emerald-400/70" />
                    <div className="h-[66%] w-full rounded-t-xl bg-cyan-400/70" />
                    <div className="h-[55%] w-full rounded-t-xl bg-emerald-400/70" />
                    <div className="h-[78%] w-full rounded-t-xl bg-cyan-400/70" />
                    <div className="h-[72%] w-full rounded-t-xl bg-emerald-400/70" />
                    <div className="h-[88%] w-full rounded-t-xl bg-emerald-400/80" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    <p className="text-sm text-zinc-300">Recursos liberados</p>
                  </div>

                  <ul className="space-y-3 text-sm text-zinc-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      Análise técnica e SMC
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      Harmônicos e probabilística
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      Timing e sinal final
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      Ambiente premium completo
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-300" />
                    <p className="text-sm text-zinc-300">Após o período</p>
                  </div>

                  <ul className="space-y-3 text-sm text-zinc-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                      Conta permanece criada
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                      Trial encerra automaticamente
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                      Acesso bloqueia sem plano ativo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                      Escolha um plano para continuar
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/8 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                  Experiência premium
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-200">
                  Acesso completo a plataforma!
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}