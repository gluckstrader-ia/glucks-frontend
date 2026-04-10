import React from "react";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gem,
  LineChart,
  Lock,
  Radar,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";

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

const benefits = [
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: "Leitura objetiva em segundos",
    text: "Veja direção, contexto, entrada, stop, alvos e confiança sem perder tempo interpretando dezenas de telas.",
  },
  {
    icon: <Radar className="h-6 w-6" />,
    title: "Confluência entre múltiplos módulos",
    text: "Técnica, Smart Money, Harmônicos, WEGD, Probabilística e Timing trabalhando juntos na mesma leitura.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Mais clareza na tomada de decisão",
    text: "Você não depende de achismo. A plataforma organiza o cenário para ajudar a filtrar operações ruins.",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Experiência premium e intuitiva",
    text: "Visual moderno, blocos objetivos e navegação pensada para quem precisa agir rápido durante o mercado.",
  },
];

const steps = [
  {
    title: "Escolha o ativo",
    text: "Selecione mercado, ativo e timeframe para iniciar a leitura.",
  },
  {
    title: "A IA cruza os módulos",
    text: "A plataforma combina fluxo, técnica, probabilidade, timing e contexto operacional.",
  },
  {
    title: "Receba o setup final",
    text: "Visualize direção, confiança, entrada, stop, alvo e leitura consolidada.",
  },
];

const testimonials = [
  {
    name: "Carlos M.",
    role: "Trader intraday",
    text: "Antes eu entrava cedo demais. Com a confluência da plataforma, parei de forçar operação e minha leitura ficou muito mais limpa.",
  },
  {
    name: "Fernanda S.",
    role: "Operadora de mini índice",
    text: "O que mais gostei foi ver tudo organizado em uma tela só. Direção, stop, alvo e confiança. Ficou muito mais profissional.",
  },
  {
    name: "Rafael T.",
    role: "Swing trader",
    text: "A Gluck’s Trader IA me ajudou a filtrar entradas ruins. Hoje opero menos, mas com muito mais contexto e segurança.",
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
    a: "A estrutura foi planejada para uma liberação rápida após a confirmação do pagamento, com suporte manual quando necessário.",
  },
  {
    q: "A plataforma entrega entrada e stop?",
    a: "Sim. O objetivo é apresentar uma leitura prática do cenário com direção, confiança, entrada, stop, alvo e sinal final.",
  },
];

const modules = [
  "Análise Técnica",
  "Smart Money Concept",
  "Padrões Harmônicos",
  "WEGD",
  "Probabilística",
  "Timing",
  "Sinal Final",
  "Gestão visual de contexto",
];

function GlowCard({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.08),transparent_18%),radial-gradient(circle_at_30%_90%,rgba(250,204,21,0.05),transparent_22%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-black p-2 shadow-[0_0_35px_rgba(16,185,129,0.18)]">
              <img
                src="/logo.png"
                alt="Gluck's Trader IA"
                className="h-10 w-12 rounded-lg object-cover"
              />
            </div>

            <div className="leading-tight">
              <h1 className="text-lg font-bold text-white">
                Gluck&apos;s Trader IA
              </h1>
              <p className="text-sm text-zinc-400">
                Inteligência para leitura de mercado
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#beneficios"
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              Benefícios
            </a>
            <a
              href="#modulos"
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              Módulos
            </a>
            <a
              href="#depoimentos"
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              Resultados
            </a>
            <a
              href="#planos"
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              Planos
            </a>
            <a
              href="#faq"
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              FAQ
            </a>

            <a
              href="/indicador"
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/25 hover:text-white"
            >
              Indicador
            </a>

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
              href="/cadastro-trial"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Teste Grátis
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Plataforma premium de análise com IA
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
              Tome decisões com mais clareza, contexto e confiança no mercado.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
              Analise o mercado com confluência técnica, Smart Money, WEGD,
              probabilidade, timing e sinal final em uma experiência única,
              rápida e profissional.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/cadastro?plan=trimestral"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-base font-bold text-black transition hover:bg-emerald-400"
              >
                Quero acessar agora
                <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href="#planos"
                className="rounded-2xl border border-white/10 px-6 py-4 text-center text-base font-semibold text-white transition hover:border-white/20 hover:bg-white/5"
              >
                Ver planos
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["IA", "Análise integrada em segundos"],
                ["Multi", "Forex, cripto, ações, B3 e índices"],
                ["Setup", "Entrada, stop, alvo e confiança"],
              ].map(([title, text]) => (
                <GlowCard key={title} className="p-4">
                  <div className="text-2xl font-black text-emerald-400">
                    {title}
                  </div>
                  <div className="mt-1 text-sm text-zinc-400">{text}</div>
                </GlowCard>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["+3.000", "traders impactados"],
                ["+70%", "leitura média de confiança operacional"],
                ["24h / 7 Dias", "estrutura digital para acesso"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4"
                >
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="mt-1 text-sm text-zinc-400">{label}</div>
                </div>
              ))}
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

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Smart Money", "Compra"],
                    ["WEGD", "Neutro"],
                    ["Probabilística", "Alta"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="text-xs uppercase tracking-wide text-zinc-500">
                        {label}
                      </div>
                      <div className="mt-2 text-lg font-bold text-white">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [
              <UserCheck className="h-5 w-5" />,
              "Mais clareza",
              "Organize a leitura do mercado com muito menos ruído.",
            ],
            [
              <Zap className="h-5 w-5" />,
              "Mais agilidade",
              "Tenha uma leitura pronta em segundos para agir rápido.",
            ],
            [
              <TrendingUp className="h-5 w-5" />,
              "Mais contexto",
              "Veja diferentes módulos confirmando ou invalidando o cenário.",
            ],
            [
              <Lock className="h-5 w-5" />,
              "Mais consistência",
              "Crie um processo de entrada mais profissional e menos impulsivo.",
            ],
          ].map(([icon, title, text]) => (
            <GlowCard key={title as string} className="p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                {icon}
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
            </GlowCard>
          ))}
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
            <GlowCard key={item.title} className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-zinc-300">
                {item.text}
              </p>
            </GlowCard>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Antes e depois
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Saia do achismo e entre em uma leitura mais profissional.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlowCard className="p-8">
              <div className="mb-6 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300">
                Antes
              </div>

              <div className="space-y-4">
                {[
                  "Opera no impulso e sem checklist claro",
                  "Entra cedo demais ou tarde demais",
                  "Fica dependente de opinião externa",
                  "Tem dificuldade para organizar stop, alvo e contexto",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-zinc-300"
                  >
                    <ChevronRight className="mt-1 h-5 w-5 text-red-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </GlowCard>

            <GlowCard className="border-emerald-500/20 bg-emerald-500/[0.05] p-8">
              <div className="mb-6 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                Depois
              </div>

              <div className="space-y-4">
                {[
                  "Opera com módulos validando o cenário",
                  "Recebe direção, confiança e setup organizado",
                  "Enxerga melhor o contexto antes de clicar",
                  "Adota uma rotina mais profissional de decisão",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-zinc-100"
                  >
                    <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>
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
              <GlowCard key={step.title} className="p-6">
                <div className="text-5xl font-black text-emerald-400/80">
                  0{index + 1}
                </div>
                <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>
                <p className="mt-4 leading-7 text-zinc-400">{step.text}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <GlowCard className="p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Autoridade
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Desenvolvida para quem busca leitura mais séria do mercado.
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              A Gluck&apos;s Trader IA foi desenhada para entregar uma leitura
              mais robusta do cenário operacional, unindo recursos visuais,
              contexto técnico e múltiplas camadas de validação.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["+5 anos", "de experiência de mercado"],
                ["Fibonacci", "e Ondas de Elliott como base estratégica"],
                ["WEGD", "como diferencial de leitura"],
                ["Premium", "visual e experiência profissional"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-lg font-bold text-white">{title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{text}</div>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard className="p-8" id="modulos">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Diferencial
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Mais do que um gráfico: uma leitura completa do contexto.
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              A plataforma une módulos complementares para entregar uma leitura
              mais consistente do mercado em uma única experiência.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {modules.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div className="text-lg font-bold text-white">{item}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </section>

      <section
        id="depoimentos"
        className="border-y border-white/10 bg-zinc-950/70"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Resultados percebidos
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              O que a experiência da plataforma entrega na prática.
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Bloco em formato social proof para aumentar confiança e conversão.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-[30px] border border-white/10 bg-black/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-sm text-zinc-500">{item.role}</div>
                  </div>

                  <div className="flex gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="mt-5 text-base leading-8 text-zinc-300">
                  “{item.text}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <GlowCard className="p-8 lg:col-span-2">
            <div className="flex items-center gap-3 text-emerald-300">
              <Clock3 className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em]">
                Urgência inteligente
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Acesso ideal para quem quer entrar agora na experiência premium.
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
              Use este momento para estruturar sua rotina com uma plataforma
              mais completa, visual e organizada. Quanto antes você entra, mais
              cedo começa a operar com mais contexto e disciplina.
            </p>
          </GlowCard>

          <GlowCard className="border-emerald-500/20 bg-emerald-500/[0.05] p-8">
            <div className="flex items-center gap-3 text-emerald-300">
              <Gem className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.25em]">
                Garantia
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-white">
              Experiência com segurança
            </h3>

            <p className="mt-4 text-base leading-7 text-zinc-300">
              Estruture sua entrada com mais confiança e uma apresentação
              premium que reduz objeções e melhora a percepção de valor.
            </p>
          </GlowCard>
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
    </div>
  );
}