import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  is_partner?: boolean;
  partner_code?: string | null;
  partner_status?: string | null;
  referred_by_user_id?: number | null;
  referred_by_code?: string | null;
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
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partnerCode, setPartnerCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ref = (searchParams.get("ref") || "").trim();
    if (ref) {
      setPartnerCode(ref.toUpperCase());
    }
  }, [searchParams]);

  const trialEndLabel = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    try {
      return end.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "em 2 dias";
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedPartnerCode = partnerCode.trim().toUpperCase();

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
          referred_by_code: trimmedPartnerCode || null,
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
          <section className="relative rounded-[32px] border border-emerald-500/20 bg-white/[0.04] p-6 shadow-[0_0_80px_rgba(16,185,129,0.08)] backdrop-blur-xl md:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <BrainCircuit className="h-7 w-7" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
                  Teste grátis
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                  Crie sua conta e libere 2 dias de acesso
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
              Acesse a experiência premium da Gluck&apos;s Trader IA por 2 dias.
              Explore o dashboard, acompanhe as análises e conheça a plataforma
              antes de escolher seu plano.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Trial liberado até {trialEndLabel}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300">
                <Zap className="h-4 w-4" />
                Sem compromisso inicial
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setName(event.target.value)
                    }
                    placeholder="Digite seu nome"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/40 focus:bg-black/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setEmail(event.target.value)
                    }
                    placeholder="voce@email.com"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/40 focus:bg-black/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Crie sua senha"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/40 focus:bg-black/40"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Código do parceiro (opcional)
                  </label>
                  <input
                    type="text"
                    value={partnerCode}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setPartnerCode(event.target.value.toUpperCase())
                    }
                    placeholder="Digite o código do parceiro"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/40 focus:bg-black/40"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500 px-6 text-sm font-semibold text-black shadow-[0_0_40px_rgba(16,185,129,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
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
                      Timing
                    </p>
                    <p className="mt-2 text-lg font-semibold text-cyan-300">
                      Forte
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      Setup
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Buy
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <p className="text-sm text-zinc-300">Durante o trial</p>
                </div>

                <ul className="space-y-3 text-sm text-zinc-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Acesso ao dashboard premium
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Recursos inteligentes liberados
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