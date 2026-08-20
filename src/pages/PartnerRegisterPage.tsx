import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, CheckCircle2, Link2, TrendingUp, Users, Wallet } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { saveAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function PartnerRegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      setAuthError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("As senhas não coincidem.");
      return;
    }

    try {
      setLoadingAuth(true);
      setAuthError("");

      const response = await fetch(`${API_URL}/auth/register-partner`, {
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
        throw new Error(data.detail || "Falha no cadastro do parceiro");
      }

      saveAuth(data);
      navigate("/partner-dashboard");
    } catch (error: any) {
      setAuthError(error.message || "Erro ao criar conta de parceiro");
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03070d] px-6 py-10 text-zinc-100">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">

        <section className="rounded-[32px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 via-zinc-950 to-black p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <BrainCircuit size={28} />
          </div>

          <h1 className="mt-6 text-4xl font-black text-white">
            Faça parte do programa de parceiros Gluck's Trader IA
          </h1>

          <p className="mt-4 text-lg text-zinc-300">
            Transforme sua audiência em uma nova fonte de receita divulgando
            uma plataforma de análise inteligente para traders.
          </p>

          <div className="mt-8 space-y-4">
            <Benefit
              icon={<Link2 />}
              title="Link exclusivo"
              text="Receba um código personalizado para suas indicações."
            />

            <Benefit
              icon={<Users />}
              title="Dashboard completo"
              text="Acompanhe cliques, clientes e resultados."
            />

            <Benefit
              icon={<Wallet />}
              title="Comissões"
              text="Visualize suas vendas e valores gerados."
            />

            <Benefit
              icon={<TrendingUp />}
              title="Estrutura para crescer"
              text="Tenha uma base preparada para acompanhar sua evolução."
            />
          </div>
        </section>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardContent className="space-y-6 p-8">
            <div>
              <h2 className="text-3xl font-black text-white">
                Quero ser parceiro
              </h2>

              <p className="mt-2 text-zinc-400">
                Cadastre-se e receba seu acesso exclusivo ao programa.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Nome"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                className="border-zinc-700 bg-black text-white"
              />

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="border-zinc-700 bg-black text-white"
              />

              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="border-zinc-700 bg-black text-white"
              />

              <Input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                className="border-zinc-700 bg-black text-white"
              />
            </div>

            {authError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {authError}
              </div>
            )}

            <Button
              onClick={handleRegister}
              disabled={loadingAuth}
              className="w-full bg-emerald-500 font-black text-black hover:bg-emerald-400"
            >
              {loadingAuth ? "Criando conta..." : "Quero ser parceiro"}
            </Button>

            <div className="text-center text-sm text-zinc-400">
              Já possui conta?{" "}
              <Link to="/login" className="text-emerald-400">
                Entrar
              </Link>
            </div>

            <div className="text-center text-sm text-zinc-400">
              Cadastro comum?{" "}
              <Link to="/cadastro" className="text-emerald-400">
                Criar conta normal
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-zinc-800 bg-black/40 p-4">
      <div className="text-emerald-400">{icon}</div>

      <div>
        <div className="flex items-center gap-2 font-bold text-white">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {title}
        </div>
        <p className="mt-1 text-sm text-zinc-400">{text}</p>
      </div>
    </div>
  );
}