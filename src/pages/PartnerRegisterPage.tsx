import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { saveAuth } from "../lib/auth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function PartnerRegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleRegister() {
    if (!name || !email || !phone || !password || !confirmPassword) {
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

      const response = await fetch(
        `${API_URL}/auth/register-partner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data.detail === "string"
            ? data.detail
            : data.detail?.[0]?.msg ||
              "Erro ao criar conta de parceiro.";

        throw new Error(message);
      }

      saveAuth(data);

      navigate("/partner-dashboard");

    } catch (error: unknown) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Erro inesperado ao criar conta.");
      }
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03070d] px-6 py-10 text-zinc-100">

      <div className="mx-auto max-w-xl">

        <Card className="border-zinc-800 bg-zinc-950">

          <CardContent className="space-y-6 p-8">

            <div>
              <h1 className="text-3xl font-black text-white">
                Quero ser parceiro
              </h1>

              <p className="mt-2 text-zinc-400">
                Cadastre-se e receba seu acesso ao programa de parceiros.
              </p>
            </div>


            <div className="space-y-4">

              <Input
                placeholder="Nome completo"
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
                type="tel"
                placeholder="WhatsApp com DDD"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
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
              {loadingAuth
                ? "Criando conta..."
                : "Quero ser parceiro"}
            </Button>


            <div className="text-center text-sm text-zinc-400">

              Já possui conta?

              {" "}

              <Link
                to="/parceiros"
                className="text-emerald-400"
              >
                Entrar
              </Link>

            </div>


          </CardContent>

        </Card>

      </div>

    </div>
  );
}