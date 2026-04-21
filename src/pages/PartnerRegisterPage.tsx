import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
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
                  Cadastro de Parceiro
                </h1>
                <p className="text-zinc-400 text-sm">
                  Crie sua conta e receba seu código exclusivo de parceiro.
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
                type="email"
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
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
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
              {loadingAuth ? "Criando conta..." : "Criar conta de parceiro"}
            </Button>

            <div className="text-center text-sm text-zinc-400">
              Já possui conta?{" "}
              <Link
                to="/login"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Entrar
              </Link>
            </div>

            <div className="text-center text-sm text-zinc-400">
              Cadastro comum?{" "}
              <Link
                to="/cadastro"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Criar conta normal
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-8">
          <h2 className="text-2xl font-bold text-white">
            Seja parceiro da Gluck&apos;s Trader IA
          </h2>
          <p className="text-zinc-400 mt-3">
            Ao concluir seu cadastro, você receberá um código exclusivo para indicar novos clientes.
          </p>

          <div className="mt-6 space-y-3 text-sm text-zinc-300">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              Código exclusivo gerado automaticamente
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              Dashboard exclusivo do parceiro
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              Base pronta para acompanhar indicações e comissões
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}