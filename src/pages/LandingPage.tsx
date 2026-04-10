
import WhatsAppButton from "../components/WhatsAppButton";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const plans = [
    {
      name: "Mensal",
      price: "R$ 197",
      period: "/mês",
      highlight: false,
      cta: "Assinar mensal",
      features: [
        "Acesso completo ao dashboard",
        "Análises em tempo real",
        "Smart Money + WEGD + Probabilística",
        "Suporte ao assinante",
      ],
    },
    {
      name: "Trimestral",
      price: "R$ 497",
      period: "/3 meses",
      highlight: true,
      badge: "Mais vantajoso",
      cta: "Assinar trimestral",
      features: [
        "Tudo do plano mensal",
        "Melhor custo-benefício",
        "Acesso contínuo sem interrupções",
        "Prioridade em novidades",
      ],
    },
    {
      name: "Semestral",
      price: "R$ 897",
      period: "/6 meses",
      highlight: false,
      cta: "Assinar semestral",
      features: [
        "Tudo do plano trimestral",
        "Maior economia no período",
        "Acompanhamento de longo prazo",
        "Estrutura ideal para consistência",
      ],
    },
  ];

  const faqs = [
    {
      q: "Preciso ter experiência para usar a plataforma?",
      a: "Não. A Gluck’s Trader IA foi pensada para simplificar a leitura do mercado, ajudando tanto quem está começando quanto quem já opera.",
    },
    {
      q: "Quais ativos posso analisar?",
      a: "Você pode analisar índices, ações, forex, cripto, B3 e futuros brasileiros, conforme os ativos liberados no dashboard.",
    },
    {
      q: "O acesso é liberado automaticamente?",
      a: "Sim. A estrutura foi pensada para liberação automática após confirmação do pagamento, com possibilidade de liberação manual quando necessário.",
    },
  ];

  const benefits = [
    "Leitura objetiva do mercado em segundos",
    "Confluência entre múltiplos módulos de análise",
    "Confiança percentual para apoiar a tomada de decisão",
    "Visual profissional, intuitivo e responsivo",
  ];

  const steps = [
    {
      title: "Escolha o ativo",
      text: "Selecione o mercado, o ativo e o timeframe que deseja analisar.",
    },
    {
      title: "Acione a IA",
      text: "A plataforma cruza contexto, fluxo, técnica, probabilidade e timing.",
    },
    {
      title: "Receba o setup",
      text: "Veja direção, confiança, entrada, stop, alvo e sinal final da análise.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Gluck's Trader IA"
              className="w-15 h-12 rounded-xl object-cover shadow-md"
            />
          <div className="leading-tight">
            <h1 className="text-white font-bold text-lg">Gluck&apos;s Trader IA</h1>
            <p className="text-zinc-400 text-sm">Inteligência para análise de mercado</p>
          </div>
        </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#beneficios" className="text-sm text-zinc-300 transition hover:text-white">
              Benefícios
            </a>
            <a href="#como-funciona" className="text-sm text-zinc-300 transition hover:text-white">
              Como funciona
            </a>
            <a href="#planos" className="text-sm text-zinc-300 transition hover:text-white">
              Planos
            </a>
            <a href="#faq" className="text-sm text-zinc-300 transition hover:text-white">
              FAQ
            </a>

            <Link
              to="/indicador"
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/30 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Indicador
            </Link>

            <a
              href="/robo"
              className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 hover:text-white"
            >
              Robô
            </a>

            <a
              href="/curso"
              className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20 hover:text-white"
            >
              Curso
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Entrar
            </a>
            <a
              href="/cadastro?plan=trimestral"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Teste Grátis
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_20%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              Plataforma premium de análise com IA
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
              Tome decisões com mais clareza usando a Gluck&apos;s Trader IA.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
              Analise o mercado com confluência técnica, Smart Money, leitura
              WEGD, probabilidade, timing e sinal final em uma única plataforma.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/cadastro?plan=trimestral"
                className="rounded-2xl bg-emerald-500 px-6 py-4 text-center text-base font-bold text-black transition hover:bg-emerald-400"
              >
                Quero acessar agora
              </a>
              <a
                href="#planos"
                className="rounded-2xl border border-white/10 px-6 py-4 text-center text-base font-semibold text-white transition hover:border-white/20 hover:bg-white/5"
              >
                Ver planos
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-black text-emerald-400">IA</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Análise integrada em segundos
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-black text-emerald-400">Multi</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Forex, cripto, ações, B3 e índices
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-black text-emerald-400">
                  Setup
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  Entrada, stop, alvo e confiança
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-emerald-950/20">
              <div className="rounded-[28px] border border-emerald-500/20 bg-[linear-gradient(180deg,#07110b,#050505)] p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="text-sm text-zinc-400">SINAL FINAL</div>
                    <div className="mt-1 text-3xl font-black text-emerald-400">
                      COMPRA
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-zinc-400">Confiança</div>
                    <div className="mt-1 text-3xl font-black text-white">
                      85%
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Entrada
                    </div>
                    <div className="mt-2 text-2xl font-bold">129.450</div>
                  </div>

                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Stop
                    </div>
                    <div className="mt-2 text-2xl font-bold text-red-400">
                      128.980
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Alvo
                    </div>
                    <div className="mt-2 text-2xl font-bold text-emerald-400">
                      130.320
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      R:R
                    </div>
                    <div className="mt-2 text-2xl font-bold text-cyan-400">
                      1:1.85
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Confluência</span>
                    <span className="font-semibold text-emerald-300">Alta</span>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Benefícios
          </div>
          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            Uma plataforma pensada para velocidade, clareza e decisão.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-white/10 bg-zinc-950 p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl text-emerald-400">
                ✓
              </div>
              <p className="text-base leading-7 text-zinc-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-y border-white/10 bg-zinc-950/70"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Como funciona
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              O processo foi desenhado para ser simples.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[28px] border border-white/10 bg-black/50 p-6"
              >
                <div className="text-5xl font-black text-emerald-400/80">
                  0{index + 1}
                </div>
                <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>
                <p className="mt-4 leading-7 text-zinc-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Diferencial
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Mais do que um gráfico: uma leitura completa do contexto.
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              A Gluck&apos;s Trader IA une módulos complementares para entregar
              uma leitura mais robusta do mercado: técnica, Smart Money, padrões,
              timing, probabilidade e sinal final.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Análise Técnica",
              "Smart Money Concept",
              "Padrões Harmônicos",
              "WEGD",
              "Probabilística",
              "Sinal Final",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-white/10 bg-zinc-950 p-6"
              >
                <div className="text-sm text-zinc-500">Módulo</div>
                <div className="mt-3 text-xl font-bold text-white">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="border-y border-white/10 bg-zinc-950/70">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Planos
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Escolha a melhor forma de acessar a plataforma.
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Estruture sua assinatura de acordo com seu ritmo operacional.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const planSlug =
                plan.name === "Mensal"
                  ? "mensal"
                  : plan.name === "Trimestral"
                  ? "trimestral"
                  : "semestral";

              return (
                <div
                  key={plan.name}
                  className={`relative rounded-[32px] border p-8 ${
                    plan.highlight
                      ? "border-emerald-500/40 bg-[linear-gradient(180deg,rgba(5,18,11,0.95),rgba(2,2,2,0.98))] shadow-2xl shadow-emerald-950/20"
                      : "border-white/10 bg-black/40"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-8 rounded-full bg-emerald-500 px-4 py-1 text-sm font-bold text-black">
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-zinc-400">{plan.name}</div>
                  <div className="mt-4 flex items-end gap-2">
                    <div className="text-5xl font-black text-white">
                      {plan.price}
                    </div>
                    <div className="pb-1 text-zinc-400">{plan.period}</div>
                  </div>

                  <div className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-zinc-300"
                      >
                        <span className="mt-1 text-emerald-400">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={`/cadastro?plan=${planSlug}`}
                    className={`mt-8 block rounded-2xl px-5 py-4 text-center text-base font-bold transition ${
                      plan.highlight
                        ? "bg-emerald-500 text-black hover:bg-emerald-400"
                        : "border border-white/10 text-white hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            FAQ
          </div>
          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            Dúvidas frequentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-[28px] border border-white/10 bg-zinc-950 p-6"
            >
              <h3 className="text-xl font-bold text-white">{item.q}</h3>
              <p className="mt-3 leading-7 text-zinc-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[36px] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(5,18,11,0.95),rgba(2,2,2,0.98))] p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Último passo
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Entre agora na Gluck&apos;s Trader IA.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Organize sua operação com uma experiência premium, rápida e
              desenhada para transformar leitura de mercado em decisão objetiva.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/cadastro?plan=trimestral"
                className="rounded-2xl bg-emerald-500 px-6 py-4 text-base font-bold text-black transition hover:bg-emerald-400"
              >
                Criar minha conta
              </a>
              <a
                href="/login"
                className="rounded-2xl border border-white/10 px-6 py-4 text-base font-semibold text-white transition hover:border-white/20 hover:bg-white/5"
              >
                Já tenho acesso
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>© 2026 Gluck&apos;s Trader IA. Todos os direitos reservados.</div>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-white">
              Termos
            </a>
            <a href="#" className="transition hover:text-white">
              Privacidade
            </a>
            <a href="#" className="transition hover:text-white">
              Suporte
            </a>
          </div>
        </div>
      </footer>

      <WhatsAppButton />   
    </div>
  );
}