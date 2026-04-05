import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearAuth, getStoredUser } from "../lib/auth";

const PAGSEGURO_LINKS = {
  mensal: "https://gluckstrader.sualojaonline.app/item/18992808/glucks-trader-ia-mensal",
  trimestral: "https://gluckstrader.sualojaonline.app/item/18992822/glucks-trader-ia-trimestral",
  semestral: "https://gluckstrader.sualojaonline.app/item/18992836/glucks-trader-ia-semestral",
} as const;

type PlanKey = keyof typeof PAGSEGURO_LINKS;

export default function PremiumPage() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [searchParams] = useSearchParams();

  const highlightPlan = useMemo(() => {
    const plan = (searchParams.get("plan") || "").toLowerCase();
    if (plan === "mensal" || plan === "trimestral" || plan === "semestral") {
      return plan as PlanKey;
    }
    return "mensal" as PlanKey;
  }, [searchParams]);

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  function handlePlanRedirect(plan: PlanKey) {
    const url = PAGSEGURO_LINKS[plan];

    if (!url || url.includes("COLE_AQUI")) {
      alert(`O link do plano ${plan} ainda não foi configurado.`);
      return;
    }

    window.location.href = url;
  }

  const plans = [
    {
      id: "mensal" as PlanKey,
      title: "Plano Mensal",
      price: "R$ 197",
      period: "/mês",
      description: "Ideal para começar agora e testar toda a experiência da plataforma.",
      features: [
        "Acesso à plataforma",
        "Dashboard de análise",
        "Leitura técnica com IA",
        "Atualizações contínuas",
      ],
    },
    {
      id: "trimestral" as PlanKey,
      title: "Plano Trimestral",
      price: "R$ 497",
      period: "/3 meses",
      description: "Mais estabilidade e melhor custo-benefício para operar com consistência.",
      features: [
        "Tudo do plano mensal",
        "Melhor custo-benefício",
        "Mais tempo para evolução",
        "Acesso contínuo ao ecossistema",
      ],
      badge: "Mais vantajoso",
    },
    {
      id: "semestral" as PlanKey,
      title: "Plano Semestral",
      price: "R$ 897",
      period: "/6 meses",
      description: "Para quem quer acompanhamento por mais tempo e foco em performance.",
      features: [
        "Tudo do plano trimestral",
        "Maior economia",
        "Visão de médio prazo",
        "Plano mais completo",
      ],
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
            Desbloqueie o acesso à
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {" "}
              Gluck&apos;s Trader IA
            </span>
          </h1>

          <p className="mt-5 text-lg text-zinc-400 md:text-xl">
            Tenha acesso à plataforma, dashboard inteligente, leituras com IA e
            recursos premium para análise de mercado.
          </p>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isHighlighted = highlightPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-[30px] border p-6 shadow-[0_16px_50px_rgba(0,0,0,0.28)] transition ${
                  isHighlighted
                    ? "border-green-500/40 bg-[linear-gradient(180deg,rgba(18,34,28,0.96),rgba(7,10,16,0.98))]"
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

                <p className="mt-4 min-h-[72px] text-zinc-400">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-zinc-200">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePlanRedirect(plan.id)}
                  className={`mt-8 w-full rounded-2xl px-5 py-4 text-base font-semibold transition ${
                    isHighlighted
                      ? "bg-green-500 text-black hover:bg-green-400"
                      : "bg-zinc-100 text-black hover:bg-white"
                  }`}
                >
                  Assinar agora
                </button>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}