import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BrainCircuit } from "lucide-react";
import { saveAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleLogin() {
    try {
      setLoadingAuth(true);
      setAuthError("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Falha no login");
      }

      saveAuth(data.access_token, data.user);

      const hasAccess =
        !!data.user &&
        data.user.is_active === true &&
        data.user.is_blocked === false;

      if (hasAccess) {
        navigate("/home-premium");
      } else {
        navigate("/premium");
      }
    } catch (error: any) {
      setAuthError(error.message || "Erro ao entrar");
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-zinc-100 p-6">
      <Card className="bg-zinc-900 border-zinc-800 w-full max-w-md">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-white">
            <BrainCircuit size={20} /> Gluck&apos;s Trader IA
          </h1>

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

          {authError && (
            <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-400">
              {authError}
            </div>
          )}

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={handleLogin}
            disabled={loadingAuth}
          >
            {loadingAuth ? "Entrando..." : "Entrar na Plataforma"}
          </Button>

          <div className="text-center text-sm text-zinc-400">
            Ainda não tem conta?{" "}
            <Link
              to="/cadastro"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}