import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { saveAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  const selectedPlan = useMemo(() => {
    const plan = (searchParams.get("plan") || "mensal").toLowerCase();
    if (["mensal", "trimestral", "semestral"].includes(plan)) {
      return plan;
    }
    return "mensal";
  }, [searchParams]);

  const planMeta = useMemo(() => {
    if (selectedPlan === "trimestral") {
      return {
        label: "Trimestral",
        price: "R$ 497",
        description: "Melhor custo-benefício para acesso contínuo à plataforma.",
      };
    }

    if (selectedPlan === "semestral") {
      return {
        label: "Semestral",
        price: "R$ 897",
        description: "Maior economia para quem quer consistência no longo prazo.",
      };
    }

    return {
      label: "Mensal",
      price: "R$ 197",
      description: "Ideal para começar agora com acesso completo à plataforma.",
    };
  }, [selectedPlan]);

  async function handleRegister() {
    try {
      setLoadingAuth(true);
      setAuthError("");

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Falha no cadastro");
      }

      saveAuth(data.access_token, data.user);
      navigate(`/premium?plan=${selectedPlan}`);
    } catch (error: any) {
      setAuthError(error.message || "Erro ao criar conta");
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BrainCircuit size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Criar conta
                </h1>
                <p className="text-zinc-400 text-sm">
                  Cadastre-se para continuar o processo de assinatura.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Nome"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
              />

              <Input
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
              />

              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {authError && (
              <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-400">
                {authError}
              </div>
            )}

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleRegister}
              disabled={loadingAuth}
            >
              {loadingAuth ? "Criando conta..." : "Criar conta e continuar"}
            </Button>

            <div className="text-center text-sm text-zinc-400">
              Já tem conta?{" "}
              <Link
                to="/login"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-emerald-400 font-semibold">
            Plano selecionado
          </div>

          <h2 className="mt-4 text-3xl font-black text-white">
            {planMeta.label}
          </h2>

          <div className="mt-4 flex items-end gap-2">
            <div className="text-5xl font-black text-cyan-400">
              {planMeta.price}
            </div>
          </div>

          <p className="mt-4 text-zinc-400 leading-7">
            {planMeta.description}
          </p>

          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <div className="text-white font-semibold">
              O que acontece depois do cadastro?
            </div>
            <div className="mt-3 space-y-3 text-sm text-zinc-300">
              <div>1. Sua conta é criada na plataforma.</div>
              <div>2. Você segue para a área de assinatura.</div>
              <div>3. O plano escolhido já aparece destacado.</div>
              <div>4. No próximo passo, conectamos o pagamento.</div>
            </div>
          </div>

          <div className="mt-8 space-y-3 text-sm text-zinc-400">
            <div className="flex gap-3">
              <span className="text-emerald-400">✓</span>
              <span>Acesso ao fluxo premium da plataforma</span>
            </div>
            <div className="flex gap-3">
              <span className="text-emerald-400">✓</span>
              <span>Plano já selecionado automaticamente</span>
            </div>
            <div className="flex gap-3">
              <span className="text-emerald-400">✓</span>
              <span>Pronto para integração com liberação automática</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}