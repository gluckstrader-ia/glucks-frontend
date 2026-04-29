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

  const [phone, setPhone] = useState("");
  const [addressNumber, setAddressNumber] = useState("");

  const [partnerCode, setPartnerCode] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const onlyNumbers = (value: string) => value.replace(/\D/g, "");

  const formatPhone = (value: string) => {
    const numbers = onlyNumbers(value).slice(0, 11);

    if (numbers.length <= 2) return numbers;

    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
        6
      )}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7
    )}`;
  };

  const isValidPhone = (value: string) => {
    const cleanPhone = onlyNumbers(value);

    if (![10, 11].includes(cleanPhone.length)) return false;

    if (/^(\d)\1+$/.test(cleanPhone)) return false;

    const fakeNumbers = [
      "0000000000",
      "9999999999",
      "00000000000",
      "99999999999",
      "1234567890",
      "12345678901",
      "0123456789",
      "01234567890",
    ];

    if (fakeNumbers.includes(cleanPhone)) return false;

    if (cleanPhone.length === 11 && cleanPhone[2] !== "9") return false;

    return true;
  };

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
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const cleanPhone = onlyNumbers(phone);
    const trimmedAddressNumber = addressNumber.trim();
    const trimmedPartnerCode = partnerCode.trim().toUpperCase();

    setAuthError("");
    setPhoneError("");

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !cleanPhone) {
      setAuthError("Preencha nome, email, senha e WhatsApp.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setAuthError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (!isValidPhone(phone)) {
      setPhoneError("Digite um WhatsApp válido com DDD.");
      return;
    }

    try {
      setLoadingAuth(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          phone: cleanPhone,
          address_number: trimmedAddressNumber || null,
          referred_by_code: trimmedPartnerCode || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Falha no cadastro");
      }

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
                <h1 className="text-2xl font-bold text-white">Criar conta</h1>
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

              <div>
                <Input
                  placeholder="WhatsApp com DDD. Ex: (51) 99988-7766"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPhone(formatPhone(e.target.value));
                    if (phoneError) setPhoneError("");
                  }}
                  className={`bg-zinc-950 text-white placeholder:text-zinc-500 ${
                    phoneError
                      ? "border-red-500"
                      : "border-zinc-700"
                  }`}
                />

                {phoneError && (
                  <p className="mt-2 text-sm text-red-400">{phoneError}</p>
                )}
              </div>

              <Input
                placeholder="Número. Ex: 120"
                value={addressNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddressNumber(e.target.value)
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
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
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