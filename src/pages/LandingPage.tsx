import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  LineChart,
  Menu,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Mensal",
    slug: "mensal",
    price: "R$ 197",
    period: "/mês",
    equivalent: null,
    economy: null,
    highlight: false,
    cta: "Assinar mensal",
    features: [
      "Acesso completo à Gluck's Trader IA",
      "Análises em tempo real",
      "Direção, confiança, entrada, stop e alvo",
      "Módulos de contexto e confluência",
      "Suporte ao assinante",
    ],
  },
  {
    name: "Trimestral",
    slug: "trimestral",
    price: "R$ 497",
    period: "/3 meses",
    equivalent: "equivale a R$ 165,67/mês",
    economy: "Economize R$ 94 em relação ao mensal",
    highlight: true,
    badge: "Melhor custo-benefício",
    cta: "Assinar trimestral",
    features: [
      "Tudo do plano mensal",
      "R$ 94 de economia no período",
      "Acesso contínuo por 3 meses",
      "Melhor custo mensal",
      "Suporte ao assinante",
    ],
  },
];

const benefits = [
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: "Análise completa em uma tela",
    text: "A plataforma organiza contexto, técnica, probabilidade e timing para você avaliar o cenário sem depender de várias ferramentas ao mesmo tempo.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Entrada, stop e alvo",
    text: "Ao analisar um ativo, você recebe uma estrutura objetiva do cenário com níveis operacionais claramente apresentados.",
  },
  {
    icon: <Radar className="h-6 w-6" />,
    title: "Confiança calculada por algoritmo próprio",
    text: "A leitura combina múltiplos fatores e apresenta um nível de confiança para ajudar você a interpretar a força do cenário.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Dados em tempo real",
    text: "A Gluck's utiliza integrações com APIs e fontes de mercado para alimentar a análise enquanto o mercado acontece.",
  },
];

const steps = [
  {
    number: "01",
    title: "Escolha o ativo",
    text: "Selecione o mercado, ativo e período que deseja analisar.",
  },
  {
    number: "02",
    title: "Clique em analisar",
    text: "A Gluck's cruza os módulos, contexto e dados disponíveis.",
  },
  {
    number: "03",
    title: "Receba a leitura consolidada",
    text: "Visualize direção, confiança, entrada, stop, alvo e os fatores que sustentam o cenário.",
  },
];

const faqs = [
  {
    q: "Preciso ser trader experiente para usar?",
    a: "Não. A plataforma foi desenhada para facilitar a leitura tanto de quem está começando quanto de quem já opera. A decisão final de operar continua sendo sempre do usuário.",
  },
  {
    q: "Quais mercados posso analisar?",
    a: "A plataforma atende diferentes classes de ativos, incluindo WIN, WDO, forex, ações e outros mercados disponíveis no dashboard.",
  },
  {
    q: "A Gluck's fornece entrada, stop e alvo?",
    a: "Sim. Quando você solicita a análise do ativo, a plataforma apresenta uma leitura estruturada com direção, confiança, entrada, stop e alvo, conforme o cenário identificado.",
  },
  {
    q: "Como é calculada a confiança?",
    a: "O nível de confiança é calculado por algoritmo próprio e inteligência artificial a partir das informações e confluências analisadas pela plataforma.",
  },
  {
    q: "Os dados são em tempo real?",
    a: "A plataforma utiliza integrações com APIs e fontes de mercado em tempo real, conforme disponibilidade de cada ativo e mercado.",
  },
  {
    q: "A IA garante que a operação dará certo?",
    a: "Não. Mercado financeiro envolve risco e nenhuma ferramenta consegue garantir resultado. A Gluck's organiza informações e cenários para apoiar a análise; ela não elimina risco nem substitui sua decisão.",
  },
  {
    q: "Preciso colocar cartão para testar?",
    a: "Não. O teste atual não exige cartão e não gera cobrança automática.",
  },
  {
    q: "O que acontece quando o teste termina?",
    a: "Sua conta permanece criada, mas o acesso premium é encerrado. Para continuar usando a plataforma, basta escolher um dos planos disponíveis.",
  },
];

function Card({
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
      className={`rounded-[24px] border border-white/10 bg-white/[0.035] backdrop-blur-sm ${className}`}
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

  const links = [
    ["#como-funciona", "Como funciona"],
    ["#recursos", "Recursos"],
    ["#demo", "Demonstração"],
    ["#planos", "Planos"],
    ["#faq", "Dúvidas"],
    ["/login", "Entrar"],
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Fechar menu"
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-20 z-50 rounded-3xl border border-white/10 bg-zinc-950/95 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {links.map(([href, label]) => (
            <a
              key={label}
              href={href}
              onClick={onClose}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/5 hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="/cadastro-trial"
          onClick={onClose}
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
        >
          Testar grátis
        </a>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.13),transparent_25%),radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.07),transparent_18%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="/" className="flex min-w-0 items-center gap-3">
            <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-black p-2">
              <img
                src="/logo.png"
                alt="Gluck's Trader IA"
                className="h-9 w-10 rounded-lg object-cover sm:h-10 sm:w-12"
              />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-bold text-white sm:text-lg">
                Gluck&apos;s Trader IA
              </div>
              <div className="truncate text-xs text-zinc-400 sm:text-sm">
                Inteligência para apoiar sua análise
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#como-funciona" className="text-sm text-zinc-300 transition hover:text-white">
              Como funciona
            </a>
            <a href="#recursos" className="text-sm text-zinc-300 transition hover:text-white">
              Recursos
            </a>
            <a href="#demo" className="text-sm text-zinc-300 transition hover:text-white">
              Demonstração
            </a>
            <a href="#planos" className="text-sm text-zinc-300 transition hover:text-white">
              Planos
            </a>
            <a href="#faq" className="text-sm text-zinc-300 transition hover:text-white">
              Dúvidas
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/5 sm:inline-flex"
            >
              Entrar
            </a>
            <a
              href="/cadastro-trial"
              className="rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-emerald-300 sm:text-sm"
            >
              Testar grátis
            </a>
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-200 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                Análise de mercado com IA + algoritmo próprio
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Transforme a leitura do mercado em um{" "}
                <span className="text-emerald-400">plano operacional objetivo.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                Analise WIN, WDO, forex, ações e outros ativos e receba uma leitura
                consolidada com <strong className="text-white">direção, confiança, entrada, stop e alvo</strong>.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/cadastro-trial"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black uppercase tracking-wide text-black shadow-[0_0_35px_rgba(52,211,153,0.35)] transition hover:scale-[1.02] hover:bg-emerald-300 sm:text-base"
                >
                  Testar grátis
                  <ArrowRight className="h-5 w-5" />
                </a>

                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white transition hover:bg-white/[0.08] sm:text-base"
                >
                  <Play className="h-5 w-5" />
                  Ver a plataforma funcionando
                </a>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Sem cartão
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Sem cobrança automática
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Você decide se quer continuar
                </span>
              </div>
            </div>

            <Card className="overflow-hidden border-emerald-500/20 bg-[linear-gradient(180deg,rgba(5,18,11,0.96),rgba(2,2,2,0.98))] p-5 shadow-[0_0_80px_rgba(16,185,129,0.12)] sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Exemplo de leitura</div>
                  <div className="mt-1 text-xl font-bold">WIN • Análise consolidada</div>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  IA
                </div>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Direção</div>
                  <div className="mt-1 text-3xl font-black text-emerald-400">COMPRA</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Confiança</div>
                  <div className="mt-1 text-3xl font-black text-white">85%</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs text-zinc-500">Entrada</div>
                  <div className="mt-2 text-xl font-bold">129.450</div>
                </div>
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                  <div className="text-xs text-zinc-500">Stop</div>
                  <div className="mt-2 text-xl font-bold text-red-400">128.980</div>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="text-xs text-zinc-500">Alvo</div>
                  <div className="mt-2 text-xl font-bold text-emerald-400">130.320</div>
                </div>
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="text-xs text-zinc-500">Risco/Retorno</div>
                  <div className="mt-2 text-xl font-bold text-cyan-300">1 : 1,85</div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Confluência do cenário</span>
                  <span className="font-semibold text-emerald-300">Alta</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-[85%] rounded-full bg-emerald-400" />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-zinc-500">
                Exemplo visual ilustrativo da forma como a plataforma organiza uma análise.
                Não representa garantia de resultado.
              </p>
            </Card>
          </div>
        </section>

        <section className="border-y border-white/10 bg-zinc-950/70">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
            {[
              ["Dados", "Integrações e fontes de mercado em tempo real"],
              ["Análise", "Algoritmo próprio + inteligência artificial"],
              ["Decisão", "A palavra final continua sendo sempre sua"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="font-bold text-white">{title}</div>
                <div className="mt-1 text-sm leading-6 text-zinc-400">{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Como funciona
            </div>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
              Do ativo ao cenário completo em três passos.
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">
              Sem depender de uma promessa de acerto. A proposta é organizar a leitura para você avaliar melhor cada cenário.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.number} className="p-6">
                <div className="text-4xl font-black text-emerald-400/80">{step.number}</div>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{step.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="recursos" className="border-y border-white/10 bg-zinc-950/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                O que você recebe
              </div>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
                Menos informação dispersa. Mais contexto para decidir.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {benefits.map((item) => (
                <Card key={item.title} className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    {item.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{item.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Veja antes de testar
              </div>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
                Entenda a plataforma funcionando, não apenas a promessa.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                Veja como a Gluck&apos;s organiza a análise e como os módulos se unem para formar o cenário final.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  "Veja como uma análise é solicitada",
                  "Entenda como direção e confiança são apresentadas",
                  "Veja entrada, stop e alvo no mesmo fluxo",
                  "Conheça a interface antes de criar sua conta",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-zinc-300">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-emerald-500/20 bg-zinc-950 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
              <div className="relative aspect-video bg-black">
                {!showVideo ? (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className="group relative h-full w-full overflow-hidden"
                  >
                    <img
                      src="https://img.youtube.com/vi/S0hCGYcEEa8/maxresdefault.jpg"
                      alt="Demonstração da Gluck's Trader IA"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/20 text-white backdrop-blur-xl transition group-hover:scale-110">
                        <Play className="ml-1 h-9 w-9 fill-current" />
                      </div>
                      <div className="mt-5 text-xl font-black sm:text-2xl">Assistir demonstração</div>
                    </div>
                  </button>
                ) : (
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/S0hCGYcEEa8?autoplay=1&rel=0"
                    title="Demonstração Gluck's Trader IA"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-zinc-950/70">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Transparência
              </div>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
                O que a Gluck&apos;s faz — e o que ela não promete.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Card className="border-emerald-500/20 bg-emerald-500/[0.05] p-6 sm:p-8">
                <div className="flex items-center gap-3 text-emerald-300">
                  <ShieldCheck className="h-6 w-6" />
                  <h3 className="text-xl font-black">A Gluck&apos;s faz</h3>
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    "Organiza dados e confluências em uma única leitura",
                    "Apresenta direção e nível de confiança",
                    "Estrutura entrada, stop e alvo",
                    "Ajuda você a avaliar cenários com mais contexto",
                    "Mantém a decisão final sob seu controle",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-zinc-200">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 sm:p-8">
                <div className="flex items-center gap-3 text-zinc-200">
                  <Eye className="h-6 w-6" />
                  <h3 className="text-xl font-black">A Gluck&apos;s não promete</h3>
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    "Lucro garantido",
                    "Acerto em 100% das análises",
                    "Eliminação do risco de mercado",
                    "Previsão infalível do preço",
                    "Substituir seu julgamento e gestão de risco",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-zinc-400">
                      <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-zinc-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <LineChart className="h-6 w-6" />
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Para quem é
              </div>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Para quem quer estruturar melhor a própria leitura.
              </h2>
              <p className="mt-5 leading-8 text-zinc-400">
                Iniciantes e day traders que operam WIN, WDO, forex, ações e outros ativos podem usar a plataforma como apoio para organizar cenários antes de decidir.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Quem está por trás
              </div>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Produto desenvolvido sob direção de analista e fundador da Gluck&apos;s Trader.
              </h2>
              <p className="mt-5 leading-8 text-zinc-400">
                A próxima evolução desta seção será incluir nome, foto, trajetória e credenciais verificáveis do fundador. Preferimos mostrar fatos comprováveis em vez de números genéricos de autoridade.
              </p>
            </Card>
          </div>
        </section>

        <section id="planos" className="border-y border-white/10 bg-zinc-950/70">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Planos
              </div>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
                Teste primeiro. Assine quando fizer sentido para você.
              </h2>
              <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">
                Dois planos simples, sem confundir a decisão.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-[30px] border p-6 sm:p-8 ${
                    plan.highlight
                      ? "border-emerald-500/40 bg-[linear-gradient(180deg,rgba(5,18,11,0.96),rgba(2,2,2,0.98))] shadow-[0_0_70px_rgba(16,185,129,0.14)]"
                      : "border-white/10 bg-black/40"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute right-5 top-5 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-black">
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-zinc-400">{plan.name}</div>
                  <div className="mt-4 flex items-end gap-2">
                    <div className="text-4xl font-black sm:text-5xl">{plan.price}</div>
                    <div className="pb-1 text-zinc-400">{plan.period}</div>
                  </div>

                  {plan.equivalent && (
                    <div className="mt-2 text-sm font-semibold text-emerald-300">
                      {plan.equivalent}
                    </div>
                  )}
                  {plan.economy && (
                    <div className="mt-1 text-sm text-zinc-400">{plan.economy}</div>
                  )}

                  <div className="mt-7 space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-zinc-300">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={`/cadastro?plan=${plan.slug}`}
                    className={`mt-8 flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wide transition ${
                      plan.highlight
                        ? "bg-emerald-400 text-black hover:bg-emerald-300"
                        : "border border-white/15 bg-white/[0.05] text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <a
                href="/cadastro-trial"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300 transition hover:text-emerald-200"
              >
                Ainda não decidiu? Teste grátis antes de assinar
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Dúvidas frequentes
            </div>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">
              O que você precisa saber antes de testar.
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <Card key={item.q} className="p-5 sm:p-6">
                <h3 className="text-lg font-bold sm:text-xl">{item.q}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{item.a}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="rounded-[32px] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(5,18,11,0.96),rgba(2,2,2,0.98))] p-7 text-center sm:p-10 lg:p-14">
            <Clock3 className="mx-auto h-8 w-8 text-emerald-400" />
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black sm:text-4xl lg:text-5xl">
              Veja se a Gluck&apos;s faz sentido para sua rotina antes de pagar.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              Crie sua conta, conheça a plataforma e faça suas próprias análises. O teste não exige cartão e não gera cobrança automática.
            </p>
            <a
              href="/cadastro-trial"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:scale-[1.02] hover:bg-emerald-300 sm:text-base"
            >
              Começar teste grátis
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-500 sm:px-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>© 2026 Gluck&apos;s Trader IA. Todos os direitos reservados.</div>
            <div className="flex flex-wrap gap-5">
              <a href="#" className="transition hover:text-white">Termos</a>
              <a href="#" className="transition hover:text-white">Privacidade</a>
              <a href="#" className="transition hover:text-white">Suporte</a>
            </div>
          </div>
          <p className="mt-6 max-w-5xl text-xs leading-6 text-zinc-600">
            Operações no mercado financeiro envolvem riscos. A Gluck&apos;s Trader IA é uma ferramenta de apoio à análise e não garante resultados, rentabilidade ou acerto de operações. O usuário é responsável por suas próprias decisões e pela gestão de risco.
          </p>
        </div>
      </footer>
    </div>
  );
}