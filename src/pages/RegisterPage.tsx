import React, { useEffect, useMemo, useState } from "react";
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
  const [partnerCode, setPartnerCode] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const ref = (searchParams.get("ref") || "").trim();
    if (ref) {
      setPartnerCode(ref.toUpperCase());
    }
  }, [searchParams]);

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
    if (!name || !email || !password) {
      setAuthError("Preencha todos os campos obrigatórios.");
      return;
    }

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
          referred_by_code: partnerCode.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Falha no cadastro");
      }

      // 🔥 CORREÇÃO AQUI
      saveAuth(data);

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

            <div className="flex flex-col gap-4">
              <Input
                placeholder="Nome"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
              />

              <Input
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
              />

              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
              />

              <Input
                placeholder="Código do parceiro (opcional)"
                value={partnerCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPartnerCode(e.target.value.toUpperCase())
                }
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

            <div className="text-center text-sm text-zinc-400">
              Quer ser parceiro?{" "}
              <Link
                to="/cadastro-parceiro"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Cadastre-se como parceiro
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Lado direito mantido */}
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-8">
          <h2 className="text-2xl font-bold text-white">
            Plano {planMeta.label}
          </h2>
          <p className="text-zinc-400 mt-2">{planMeta.description}</p>

          <div className="mt-6 text-4xl font-black text-emerald-400">
            {planMeta.price}
          </div>

          <p className="text-sm text-zinc-500 mt-2">
            Após criar sua conta, você continuará para finalizar a assinatura.
          </p>
        </div>
      </div>
    </div>
  );
}