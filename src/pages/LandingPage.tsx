import React, { useState } from "react";
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
  Menu,
  Radar,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  X,
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
      className={`rounded-[24px] border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:rounded-[28px] ${className}`}
    >
      {children}
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="md:hidden">
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-20 z-50 rounded-3xl border border-white/10 bg-zinc-950/95 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Menu
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {[
            ["#beneficios", "Benefícios"],
            ["#modulos", "Módulos"],
            ["#depoimentos", "Resultados"],
            ["#planos", "Planos"],
            ["#faq", "FAQ"],
            ["/indicador", "Indicador"],
            ["/robo", "Robô"],
            ["/curso", "Curso"],
            ["/login", "Entrar"],
          ].map(([href, label]) => (
            <a
              key={label}
              href={href}
              onClick={onClose}
              className="block rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/5 hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.08),transparent_18%),radial-gradient(circle_at_30%_90%,rgba(250,204,21,0.05),transparent_22%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-black p-2 shadow-[0_0_35px_rgba(16,185,129,0.18)]">
              <img
                src="/logo.png"
                alt="Gluck's Trader IA"
                className="h-9 w-10 rounded-lg object-cover sm:h-10 sm:w-12"
              />
            </div>

            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-sm font-bold text-white sm:text-lg">
                Gluck&apos;s Trader IA
              </h1>
              <p className="truncate text-xs text-zinc-400 sm:text-sm">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/cadastro-trial"
              className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-black transition hover:bg-emerald-400 sm:px-4 sm:text-sm md:hidden"
            >
              Teste Grátis
            </a>

            <div className="hidden items-center gap-3 md:flex">
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

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-200 transition hover:bg-white/5 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14 lg:py-24">
          <div>

            {/* 🔴 BOTÃO LIVE YOUTUBE */}
            <div className="mb-4">
              <a
                href="https://youtube.com/live/SEU_LINK_AQUI"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-red-600 shadow-lg transition-all duration-300 hover:bg-red-500 hover:scale-105"
              >
                <span className="absolute inset-0 rounded-full bg-red-500 opacity-70 blur-xl animate-ping"></span>

                <span className="relative flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-5 h-5"
                  >
                    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5h0s-4.2 0-7 .1c-.4 0-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.6C2 14.4 2.2 16 2.2 16s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.2 6.8.2 6.8.2s4.2 0 7-.1c.4 0 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6C22 9.6 21.8 8 21.8 8zM10 14.5v-5l5 2.5-5 2.5z"/>
                  </svg>

                  🔴 AO VIVO A PARTIR DAS 20h
                </span>
              </a>
            </div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 sm:px-4 sm:text-sm">
              <Sparkles className="h-4 w-4" />
              Plataforma premium de análise com IA
            </div>

            <h1 className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Tome decisões com mais clareza, contexto e confiança no mercado.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8 md:text-xl">
              Analise o mercado com confluência técnica, Smart Money, WEGD,
              probabilidade, timing e sinal final em uma experiência única,
              rápida e profissional.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="/cadastro?plan=trimestral"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-emerald-400 sm:px-6 sm:text-base"
              >
                Quero acessar agora
                <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href="#planos"
                className="rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/5 sm:px-6 sm:text-base"
              >
                Ver planos
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {[
                ["IA", "Análise integrada em segundos"],
                ["Multi", "Forex, cripto, ações, B3 e índices"],
                ["Setup", "Entrada, stop, alvo e confiança"],
              ].map(([title, text]) => (
                <GlowCard key={title} className="p-4">
                  <div className="text-xl font-black text-emerald-400 sm:text-2xl">
                    {title}
                  </div>
                  <div className="mt-1 text-sm text-zinc-400">{text}</div>
                </GlowCard>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {[
                ["+3.000", "traders impactados"],
                ["+70%", "leitura média de confiança operacional"],
                ["24/7", "estrutura digital para acesso"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4"
                >
                  <div className="text-xl font-black text-white sm:text-2xl">
                    {value}
                  </div>
                  <div className="mt-1 text-sm text-zinc-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-[24px] border border-white/10 bg-zinc-950/80 p-3 shadow-2xl shadow-emerald-950/20 sm:rounded-[32px] sm:p-5">
              <div className="rounded-[22px] border border-emerald-500/20 bg-[linear-gradient(180deg,#07110b,#050505)] p-4 sm:rounded-[28px] sm:p-6">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="text-xs text-zinc-400 sm:text-sm">
                      SINAL FINAL
                    </div>
                    <div className="mt-1 text-2xl font-black text-emerald-400 sm:text-3xl">
                      COMPRA
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-zinc-400 sm:text-sm">
                      Confiança
                    </div>
                    <div className="mt-1 text-2xl font-black text-white sm:text-3xl">
                      85%
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4">
                    <div className="text-[11px] uppercase tracking-wide text-zinc-500 sm:text-xs">
                      Entrada
                    </div>
                    <div className="mt-2 text-xl font-bold sm:text-2xl">
                      129.450
                    </div>
                  </div>

                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-3 sm:p-4">
                    <div className="text-[11px] uppercase tracking-wide text-zinc-500 sm:text-xs">
                      Stop
                    </div>
                    <div className="mt-2 text-xl font-bold text-red-400 sm:text-2xl">
                      128.980
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 sm:p-4">
                    <div className="text-[11px] uppercase tracking-wide text-zinc-500 sm:text-xs">
                      Alvo
                    </div>
                    <div className="mt-2 text-xl font-bold text-emerald-400 sm:text-2xl">
                      130.320
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4">
                    <div className="text-[11px] uppercase tracking-wide text-zinc-500 sm:text-xs">
                      R:R
                    </div>
                    <div className="mt-2 text-xl font-bold text-cyan-400 sm:text-2xl">
                      1:1.85
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3 sm:mt-6 sm:p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 sm:text-sm">
                    <span>Confluência</span>
                    <span className="font-semibold text-emerald-300">Alta</span>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-cyan-400" />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-3">
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
                      <div className="mt-2 text-base font-bold text-white sm:text-lg">
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

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            <GlowCard key={title as string} className="p-5 sm:p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                {icon}
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      <section
        id="beneficios"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20"
      >
        <div className="mb-8 max-w-3xl sm:mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
            Benefícios
          </div>
          <h2 className="mt-4 text-2xl font-black md:text-4xl lg:text-5xl">
            Uma plataforma pensada para velocidade, clareza e decisão.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 sm:gap-6">
          {benefits.map((item) => (
            <GlowCard key={item.title} className="p-5 sm:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">
                {item.text}
              </p>
            </GlowCard>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-8 max-w-3xl sm:mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              Antes e depois
            </div>
            <h2 className="mt-4 text-2xl font-black md:text-4xl lg:text-5xl">
              Saia do achismo e entre em uma leitura mais profissional.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 sm:gap-6">
            <GlowCard className="p-6 sm:p-8">
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

            <GlowCard className="border-emerald-500/20 bg-emerald-500/[0.05] p-6 sm:p-8">
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
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-8 max-w-3xl sm:mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              Como funciona
            </div>
            <h2 className="mt-4 text-2xl font-black md:text-4xl lg:text-5xl">
              O processo foi desenhado para ser simples.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
            {steps.map((step, index) => (
              <GlowCard key={step.title} className="p-6">
                <div className="text-4xl font-black text-emerald-400/80 sm:text-5xl">
                  0{index + 1}
                </div>
                <h3 className="mt-6 text-xl font-bold sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-4 leading-7 text-zinc-400">{step.text}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <GlowCard className="p-6 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              Autoridade
            </div>
            <h2 className="mt-4 text-2xl font-black md:text-3xl lg:text-4xl">
              Desenvolvida para quem busca leitura mais séria do mercado.
            </h2>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
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

          <GlowCard className="p-6 sm:p-8" id="modulos">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              Diferencial
            </div>
            <h2 className="mt-4 text-2xl font-black md:text-3xl lg:text-4xl">
              Mais do que um gráfico: uma leitura completa do contexto.
            </h2>
            <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
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
                    <div className="text-base font-bold text-white sm:text-lg">
                      {item}
                    </div>
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
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              Resultados percebidos
            </div>
            <h2 className="mt-4 text-2xl font-black md:text-4xl lg:text-5xl">
              O que a experiência da plataforma entrega na prática.
            </h2>
            <p className="mt-4 text-base text-zinc-400 sm:text-lg">
              Bloco em formato social proof para aumentar confiança e conversão.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 sm:gap-6">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-[28px] border border-white/10 bg-black/40 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:rounded-[30px] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-sm text-zinc-500">{item.role}</div>
                  </div>

                  <div className="flex shrink-0 gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-8 text-zinc-300 sm:text-base">
                  “{item.text}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-4 lg:grid-cols-3 sm:gap-6">
          <GlowCard className="p-6 lg:col-span-2 sm:p-8">
            <div className="flex items-center gap-3 text-emerald-300">
              <Clock3 className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] sm:text-sm">
                Urgência inteligente
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-black md:text-3xl lg:text-4xl">
              Acesso ideal para quem quer entrar agora na experiência premium.
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
              Use este momento para estruturar sua rotina com uma plataforma
              mais completa, visual e organizada. Quanto antes você entra, mais
              cedo começa a operar com mais contexto e disciplina.
            </p>
          </GlowCard>

          <GlowCard className="border-emerald-500/20 bg-emerald-500/[0.05] p-6 sm:p-8">
            <div className="flex items-center gap-3 text-emerald-300">
              <Gem className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] sm:text-sm">
                Garantia
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-white">
              Experiência com segurança
            </h3>

            <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
              Estruture sua entrada com mais confiança e uma apresentação
              premium que reduz objeções e melhora a percepção de valor.
            </p>
          </GlowCard>
        </div>
      </section>

      <section
        id="planos"
        className="border-y border-white/10 bg-zinc-950/70"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              Planos
            </div>
            <h2 className="mt-4 text-2xl font-black md:text-4xl lg:text-5xl">
              Escolha a melhor forma de acessar a plataforma.
            </h2>
            <p className="mt-4 text-base text-zinc-400 sm:text-lg">
              Estruture sua assinatura de acordo com seu ritmo operacional.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 sm:gap-6">
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
                  className={`relative rounded-[28px] border p-6 sm:rounded-[32px] sm:p-8 ${
                    plan.highlight
                      ? "border-emerald-500/40 bg-[linear-gradient(180deg,rgba(5,18,11,0.95),rgba(2,2,2,0.98))] shadow-2xl shadow-emerald-950/20"
                      : "border-white/10 bg-black/40"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-6 rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-black sm:left-8 sm:text-sm">
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-zinc-400">{plan.name}</div>

                  <div className="mt-4 flex items-end gap-2">
                    <div className="text-4xl font-black text-white sm:text-5xl">
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
                    className={`mt-8 block rounded-2xl px-5 py-4 text-center text-sm font-bold transition sm:text-base ${
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

      <section
        id="faq"
        className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20"
      >
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
            FAQ
          </div>
          <h2 className="mt-4 text-2xl font-black md:text-4xl lg:text-5xl">
            Dúvidas frequentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-[24px] border border-white/10 bg-zinc-950 p-5 sm:rounded-[28px] sm:p-6"
            >
              <h3 className="text-lg font-bold text-white sm:text-xl">
                {item.q}
              </h3>
              <p className="mt-3 leading-7 text-zinc-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[28px] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(5,18,11,0.95),rgba(2,2,2,0.98))] p-6 sm:rounded-[36px] sm:p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
              Último passo
            </div>

            <h2 className="mt-4 text-2xl font-black md:text-4xl lg:text-5xl">
              Entre agora na Gluck&apos;s Trader IA.
            </h2>

            <p className="mt-5 text-base leading-8 text-zinc-300 sm:text-lg">
              Organize sua operação com uma experiência premium, rápida e
              desenhada para transformar leitura de mercado em decisão objetiva.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="/cadastro?plan=trimestral"
                className="rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-bold text-black transition hover:bg-emerald-400 sm:text-base"
              >
                Criar minha conta
              </a>

              <a
                href="/login"
                className="rounded-2xl border border-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/5 sm:text-base"
              >
                Já tenho acesso
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            © 2026 Gluck&apos;s Trader IA. Todos os direitos reservados.
          </div>

          <div className="flex flex-wrap gap-5">
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