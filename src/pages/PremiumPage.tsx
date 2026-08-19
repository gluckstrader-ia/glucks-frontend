import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearAuth, getStoredUser } from "../lib/auth";
import { createCheckout } from "../services/payments";

type PlanKey = "mensal" | "trimestral";
type ApiPlanKey = "monthly" | "quarterly";

const PLAN_TO_API: Record<PlanKey, ApiPlanKey> = {
  mensal: "monthly",
  trimestral: "quarterly",
};

type PlanCard = {
  id: PlanKey;
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  equivalent?: string;
  saving?: string;
};

export default function PremiumPage() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [searchParams] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  const highlightPlan = useMemo(() => {
    const plan = (searchParams.get("plan") || "").toLowerCase();

    if (plan === "mensal" || plan === "trimestral") {
      return plan as PlanKey;
    }

    return "trimestral" as PlanKey;
  }, [searchParams]);

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  async function handleCheckout(plan: PlanKey) {
    try {
      const token = localStorage.getItem("glucks_token");

      if (!token) {
        alert("Você precisa estar logado para assinar.");
        navigate("/login");
        return;
      }

      setLoadingPlan(plan);

      const apiPlan = PLAN_TO_API[plan];
      const data = await createCheckout(apiPlan, token);

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      alert("Erro ao gerar o link de pagamento.");
    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error);
      alert("Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoadingPlan(null);
    }
  }

  const plans: PlanCard[] = [
    {
      id: "mensal",
      title: "Plano Mensal",
      price: "R$ 197",
      period: "/mês",
      description:
        "Acesso completo por 30 dias, ideal para quem quer continuar usando a plataforma mês a mês.",
      features: [
        "Acesso completo à plataforma",
        "Dashboard de análise",
        "Leitura técnica com IA",
        "Direção, entrada, stop e alvo",
        "Atualizações contínuas",
      ],
    },
    {
      id: "trimestral",
      title: "Plano Trimestral",
      price: "R$ 497",
      period: "/3 meses",
      description:
        "A mesma experiência completa por 90 dias, com melhor custo-benefício no período.",
      features: [
        "Tudo do plano mensal",
        "90 dias de acesso",
        "Economia de R$ 94 no período",
        "Equivalente a R$ 165,67 por mês",
        "Acesso contínuo sem renovação mensal",
      ],
      badge: "Mais vantajoso",
      equivalent: "R$ 165,67/mês",
      saving: "Economize R$ 94",
    },
  ];

  return (
    <div className="min-h-screen bg-[#03070d] text-white">
      <header className="sticky top-0 z-30 border-b border-zinc-900/80 bg-[#03070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-black ring-1 ring-zinc-800">
              <img
                src="/logo.png"
                alt="Gluck's Trader IA"
                className="h-6 w-6 object-contain"
              />
            </div>

            <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Gluck&apos;s Trader IA
            </div>
          </button>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-300 md:block">
                {user.name || user.email}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1 text-sm font-medium text-green-300">
            Escolha seu plano
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Continue com acesso à
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {" "}
              Gluck&apos;s Trader IA
            </span>
          </h1>

          <p className="mt-5 text-lg text-zinc-400 md:text-xl">
            Escolha entre 30 ou 90 dias de acesso completo à plataforma e às
            ferramentas de análise.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
            <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-2">
              Mensal: R$ 197
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-300">
              Trimestral: economize R$ 94
            </span>
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          {plans.map((plan) => {
            const isHighlighted = highlightPlan === plan.id;
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-[30px] border p-6 shadow-[0_16px_50px_rgba(0,0,0,0.28)] transition ${
                  isHighlighted
                    ? "border-green-500/40 bg-[linear-gradient(180deg,rgba(18,34,28,0.96),rgba(7,10,16,0.98))] shadow-[0_0_70px_rgba(34,197,94,0.10)]"
                    : "border-zinc-800 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(7,10,16,0.96))]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute right-5 top-5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                    {plan.badge}
                  </div>
                )}

                <h2 className="text-2xl font-bold">{plan.title}</h2>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold text-white md:text-5xl">
                    {plan.price}
                  </span>
                  <span className="pb-1 text-zinc-400">{plan.period}</span>
                </div>

                {plan.equivalent ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      {plan.equivalent}
                    </span>
                    {plan.saving ? (
                      <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {plan.saving}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <p className="mt-4 min-h-[72px] text-zinc-400">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-zinc-200"
                    >
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={!!loadingPlan}
                  className={`mt-8 w-full rounded-2xl px-5 py-4 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isHighlighted
                      ? "bg-green-500 text-black hover:bg-green-400"
                      : "bg-zinc-100 text-black hover:bg-white"
                  }`}
                >
                  {isLoading
                    ? "Gerando pagamento..."
                    : plan.id === "trimestral"
                    ? "Assinar trimestral"
                    : "Assinar mensal"}
                </button>
              </div>
            );
          })}
        </section>

        <section className="mx-auto mt-8 max-w-5xl">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 text-center text-sm leading-6 text-zinc-400">
            O pagamento é processado pelo PagBank. Após a confirmação do
            pagamento, a equipe libera o acesso correspondente ao plano
            escolhido.
          </div>

          <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-5 text-zinc-500">
            A Gluck&apos;s Trader IA é uma ferramenta de apoio à análise de
            mercado. Operações financeiras envolvem risco e não há garantia de
            resultado.
          </p>
        </section>
      </main>
    </div>
  );
}