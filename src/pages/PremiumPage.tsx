import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearAuth, getStoredUser } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function PremiumPage() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [searchParams] = useSearchParams();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const selectedPlan = useMemo(() => {
    const plan = (searchParams.get("plan") || "mensal").toLowerCase();
    return ["mensal", "trimestral", "semestral"].includes(plan)
      ? plan
      : "mensal";
  }, [searchParams]);

  const plans = [
    {
      id: "mensal",
      name: "Mensal",
      price: "R$ 197,00",
      period: "por mês",
      description: "Ideal para começar com acesso completo à plataforma.",
      features: [
        "Acesso completo ao dashboard",
        "Análises em tempo real",
        "Sinal final e confiança",
        "Suporte ao assinante",
      ],
    },
    {
      id: "trimestral",
      name: "Trimestral",
      price: "R$ 497,00",
      period: "por 3 meses",
      description: "Melhor custo-benefício para quem busca continuidade.",
      badge: "Mais vantajoso",
      features: [
        "Tudo do plano mensal",
        "Melhor custo por período",
        "Acesso contínuo",
        "Prioridade em novidades",
      ],
    },
    {
      id: "semestral",
      name: "Semestral",
      price: "R$ 897,00",
      period: "por 6 meses",
      description: "Pensado para quem quer consistência e economia maior.",
      features: [
        "Tudo do plano trimestral",
        "Maior economia",
        "Longo prazo",
        "Estrutura ideal para consistência",
      ],
    },
  ];

  const selectedPlanMeta =
    plans.find((plan) => plan.id === selectedPlan) || plans[0];

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  function handleSelectPlan(planId: string) {
    setCheckoutError("");
    navigate(`/premium?plan=${planId}`);
  }

  function handleWhatsApp(planId: string) {
    const phone = "5551994830003"; // seu número

    let message = "";

    if (planId === "mensal") {
      message = "Olá, quero assinar o plano MENSAL do Gluck’s Trader IA";
    } else if (planId === "trimestral") {
      message = "Olá, quero assinar o plano TRIMESTRAL do Gluck’s Trader IA";
    } else if (planId === "semestral") {
      message = "Olá, quero assinar o plano SEMESTRAL do Gluck’s Trader IA";
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }
  
  async function handleSubscribe(planId: string) {
    try {
      if (loadingPlan) return;

      setLoadingPlan(planId);
      setCheckoutError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const checkoutEndpoint = `${API_URL}/payments/create-checkout`;
      console.log("CHECKOUT ENDPOINT:", checkoutEndpoint);

      const response = await fetch(checkoutEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planId }),
      });

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("Erro ao processar resposta do servidor");
      }

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao iniciar pagamento");
      }

      if (!data.pay_url) {
        throw new Error("Checkout não retornou URL válida");
      }

      window.location.href = data.pay_url;
    } catch (error: any) {
      console.error("Erro checkout:", error);
      setCheckoutError(error.message || "Erro ao iniciar checkout");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Assinatura necessária
            </h1>
            <p className="text-zinc-400 mt-3 text-lg">
              Olá, {user?.name || "usuário"}.
            </p>
          </div>

          {checkoutError && (
            <div className="mt-8 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-red-400 text-sm text-center">
              {checkoutError}
            </div>
          )}

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isHighlighted = plan.id === "trimestral";
              const isLoading = loadingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl border p-6 transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/5"
                      : isHighlighted
                      ? "border-cyan-500/30 bg-cyan-500/5"
                      : "border-zinc-800 bg-zinc-950/70"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-6 rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-black">
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-white text-2xl font-bold">
                    {plan.name}
                  </div>

                  <div className="mt-4 text-4xl font-black text-cyan-400">
                    {plan.price}
                  </div>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex gap-3 text-zinc-300">
                        <span className="text-emerald-400">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full rounded-xl border px-4 py-3 font-semibold ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                          : "border-zinc-700 bg-zinc-900 text-white"
                      }`}
                    >
                      {isSelected ? "Selecionado" : "Selecionar plano"}
                    </button>

                    <button
                      onClick={() => handleWhatsApp(plan.id)}
                      disabled={isLoading}
                      className="w-full rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 font-semibold"
                    >
                      {isLoading ? "Redirecionando..." : "Assinar agora"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <div className="text-zinc-400">
              Plano atual:{" "}
              <span className="text-white font-bold">
                {selectedPlanMeta.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
