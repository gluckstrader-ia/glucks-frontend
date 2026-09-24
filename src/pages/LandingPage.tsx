import React, { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Menu,
  Radar,
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
    ["#ia", "IA"],
    ["#indicador", "Indicador"],
    ["#desenvolvimento", "Desenvolvimento"],
    ["/beneficios", "Benefícios"],
    ["#planos", "Planos"],
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
          href="/login"
          onClick={onClose}
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
        >
          Área do Cliente
        </a>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.10),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_75%_70%,rgba(250,204,21,0.04),transparent_20%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="/" className="flex min-w-0 items-center gap-3">
            <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-black p-2">
              <img src="/logo.png" alt="Gluck's" className="h-9 w-10 rounded-lg object-cover sm:h-10 sm:w-12" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-black tracking-wide text-white sm:text-lg">GLUCK&apos;S</div>
              <div className="truncate text-[10px] uppercase tracking-[0.2em] text-zinc-500">Tecnologia para traders</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#ia" className="text-sm text-emerald-300">IA</a>
            <a href="#indicador" className="text-sm text-zinc-300 transition hover:text-white">Indicador</a>
            <a href="#desenvolvimento" className="text-sm text-zinc-300 transition hover:text-white">Desenvolvimento</a>
            <a href="/beneficios" className="text-sm text-zinc-300 transition hover:text-white">Benefícios</a>
            <a href="#planos" className="text-sm text-zinc-300 transition hover:text-white">Planos</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href="/login" className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/5 sm:inline-flex">Entrar</a>
            <a href="/login" className="rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-emerald-300 sm:text-sm">Área do Cliente</a>
            <button type="button" aria-label="Abrir menu" onClick={() => setMobileMenuOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-200 md:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main>
        <section id="ia" className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300"><Sparkles className="h-4 w-4" /> Inteligência artificial para traders</div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Sua análise em um <span className="text-emerald-400">novo nível.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">A Gluck&apos;s Trader IA transforma dados e contexto de mercado em uma leitura estruturada, ajudando você a visualizar direção, confiança, entrada, stop e alvo de forma simples e objetiva.</p>
              <div className="mt-8"><a href="#planos" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black shadow-[0_0_35px_rgba(52,211,153,0.28)] transition hover:scale-[1.02] hover:bg-emerald-300 sm:text-base">Conhecer a Gluck&apos;s IA <ArrowRight className="h-5 w-5" /></a></div>
              <div className="mt-6 flex flex-wrap gap-2">{["WIN","WDO","AÇÕES","FOREX","OUTROS MERCADOS"].map((item)=><span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">{item}</span>)}</div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_35%_35%,rgba(34,211,238,0.16),transparent_45%),radial-gradient(circle_at_70%_65%,rgba(16,185,129,0.14),transparent_45%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-zinc-950 p-2 shadow-[0_0_90px_rgba(34,211,238,0.10)] sm:p-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">Dashboard real • Gluck&apos;s Trader IA</div>
                </div>
                <img src="/dashboard-preview.png" alt="Dashboard real da Gluck's Trader IA com decisão da IA, fluxo de mercado e painel técnico" className="w-full rounded-[20px] border border-white/10 object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-zinc-950/70"><div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">{benefits.map((item)=><div key={item.title} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"><div className="text-emerald-400">{item.icon}</div><div className="font-semibold text-white">{item.title}</div></div>)}</div></section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Como funciona</div><h2 className="mt-4 text-3xl font-black sm:text-4xl lg:text-5xl">Do mercado para uma leitura objetiva.</h2><p className="mt-4 text-zinc-400">Simples por fora. Tecnologia por trás.</p></div><div className="grid gap-4 md:grid-cols-3">{steps.map((step)=><Card key={step.number} className="p-6"><div className="text-3xl font-black text-emerald-400">{step.number}</div><h3 className="mt-4 text-lg font-bold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{step.text}</p></Card>)}</div></div></section>

        <section id="planos" className="border-y border-white/10 bg-zinc-950/70"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.7fr_1.3fr]"><div><div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Planos</div><h2 className="mt-4 text-3xl font-black sm:text-4xl">Escolha seu acesso.</h2><p className="mt-4 leading-7 text-zinc-400">Tecnologia profissional para sua rotina no mercado.</p></div><div className="grid gap-6 md:grid-cols-2">{plans.map((plan)=><div key={plan.name} className={`relative rounded-[28px] border p-6 ${plan.highlight ? "border-emerald-500/50 bg-emerald-500/[0.04] shadow-[0_0_50px_rgba(16,185,129,0.10)]" : "border-white/10 bg-black/40"}`}>{plan.badge && <div className="absolute right-5 top-5 rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-black text-black">{plan.badge}</div>}<div className="text-zinc-400">{plan.name}</div><div className="mt-4 flex items-end gap-2"><div className="text-4xl font-black">{plan.price}</div><div className="pb-1 text-zinc-400">{plan.period}</div></div>{plan.equivalent && <div className="mt-2 text-sm font-semibold text-emerald-300">{plan.equivalent}</div>}<div className="mt-6 space-y-3">{plan.features.map((feature)=><div key={feature} className="flex items-start gap-3 text-sm text-zinc-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"/><span>{feature}</span></div>)}</div><a href={`/cadastro?plan=${plan.slug}`} className={`mt-7 flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-black transition ${plan.highlight ? "bg-emerald-400 text-black hover:bg-emerald-300" : "border border-white/15 bg-white/[0.05] text-white hover:bg-white/[0.08]"}`}>{plan.cta}</a></div>)}</div></div></section>

        <section className="relative mx-auto max-w-[1500px] px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-6 xl:grid-cols-3">
            {/* INDICADOR */}
            <article id="indicador" className="group relative min-h-[690px] overflow-hidden rounded-[30px] border border-emerald-400/60 bg-[linear-gradient(155deg,rgba(3,37,29,0.96),rgba(2,8,7,0.98)_55%,rgba(0,0,0,1))] p-7 shadow-[0_0_55px_rgba(16,185,129,0.12)] sm:p-9">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(16,185,129,0.18),transparent_30%)]" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-xl">▥</span>
                  Indicador Gluck&apos;s
                </div>
                <h2 className="mt-6 text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">
                  Sinais no gráfico.<br />Mais clareza na sua <span className="text-emerald-400">operação.</span>
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                  Indicador de compra e venda com sinais visuais diretamente no gráfico, reunindo leituras técnicas em uma interface objetiva.
                </p>
                <div className="mt-6 space-y-3 text-sm text-zinc-200 sm:text-base">
                  {["Sinais visuais no gráfico","Alertas e leitura objetiva","Suportes e resistências","Zona Institucional Gluck's","Integração à rotina do trader"].map((item) => (
                    <div key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />{item}</div>
                  ))}
                </div>
                <div className="relative mt-7 h-48 overflow-hidden rounded-2xl border border-emerald-400/20 bg-black/60">
                  <img src="/dashboard-preview.png" alt="Interface real da tecnologia Gluck's" className="h-full w-full object-cover object-left opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.8))]" />
                  <span className="absolute bottom-4 left-4 rounded-lg bg-emerald-400 px-3 py-1 text-xs font-black text-black">COMPRA</span>
                  <span className="absolute right-4 top-4 rounded-lg bg-red-500 px-3 py-1 text-xs font-black text-white">VENDA</span>
                </div>
                <a href="/indicador" className="mt-7 flex items-center justify-between rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-300">
                  Conhecer o indicador <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </article>

            {/* DESENVOLVIMENTO */}
            <article id="desenvolvimento" className="group relative min-h-[690px] overflow-hidden rounded-[30px] border border-cyan-400/60 bg-[linear-gradient(155deg,rgba(2,30,42,0.98),rgba(2,10,14,0.98)_55%,rgba(0,0,0,1))] p-7 shadow-[0_0_55px_rgba(34,211,238,0.10)] sm:p-9">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(34,211,238,0.16),transparent_32%)]" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-300 sm:text-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-xl">⚙</span>
                  Desenvolvimento personalizado
                </div>
                <h2 className="mt-6 text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">
                  Sua estratégia pode <span className="text-cyan-300">virar tecnologia.</span>
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                  Desenvolvemos indicadores, robôs, automações e soluções personalizadas para transformar ideias operacionais em ferramentas reais.
                </p>
                <div className="mt-7 space-y-4 text-sm text-zinc-200 sm:text-base">
                  {["Indicadores personalizados","Robôs e estratégias automatizadas","Integrações e automações","Projetos especiais"].map((item) => (
                    <div key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-300" />{item}</div>
                  ))}
                </div>
                <div className="relative mt-8 flex-1 min-h-[210px] overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#02080b] p-5 shadow-inner">
                  <div className="absolute -right-10 bottom-0 h-44 w-64 rotate-[-5deg] rounded-2xl border border-cyan-400/20 bg-[#06131a] p-4 shadow-[0_0_35px_rgba(34,211,238,0.12)]">
                    <div className="mb-3 flex gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400"/><span className="h-2 w-2 rounded-full bg-yellow-300"/><span className="h-2 w-2 rounded-full bg-emerald-400"/></div>
                    <pre className="whitespace-pre-wrap font-mono text-[10px] leading-5 text-cyan-200">{`// Estratégia personalizada
if (tendencia === "ALTA") {
  comprar();
} else {
  vender();
}

setStopLoss(50);
setProfitTarget(125);`}</pre>
                  </div>
                  <div className="absolute bottom-6 left-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-xs font-semibold text-cyan-200">Código + automação + estratégia</div>
                </div>
                <a href="/desenvolvimento" className="mt-7 flex items-center justify-between rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-black text-black transition hover:bg-cyan-300">
                  Falar sobre meu projeto <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </article>

            {/* BENEFÍCIOS */}
            <article className="group relative min-h-[690px] overflow-hidden rounded-[30px] border border-yellow-400/60 bg-[linear-gradient(155deg,rgba(43,33,2,0.96),rgba(15,12,2,0.98)_48%,rgba(0,0,0,1))] p-7 shadow-[0_0_55px_rgba(250,204,21,0.10)] sm:p-9">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_12%,rgba(250,204,21,0.18),transparent_32%)]" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-yellow-300 sm:text-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-yellow-400/25 bg-yellow-400/10 text-xl">🎁</span>
                  Benefícios Gluck&apos;s
                </div>
                <h2 className="mt-6 text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">
                  Vantagens para a nossa <span className="text-yellow-300">comunidade.</span>
                </h2>
                <p className="mt-5 text-base leading-7 text-zinc-300">
                  Descontos, condições especiais e parceiros reunidos em uma página exclusiva para a comunidade Gluck&apos;s.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    { name: "Clear", logo: "/partners/clear.svg", tag: "Benefício" },
                    { name: "Profit Pro", logo: "/partners/profitpro.svg", tag: "Condições especiais" },
                    { name: "Nelogica", logo: "/partners/nelogica.svg", tag: "Parceiro" },
                    { name: "ATAS", logo: "/partners/atas.svg", tag: "Benefício" },
                    { name: "TradingView", logo: "/partners/tradingview.svg", tag: "Condições especiais" },
                    { name: "XP", logo: "/partners/xp.svg", tag: "Benefício" },
                  ].map((partner) => (
                    <div key={partner.name} className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-yellow-300/15 bg-black/40 p-3 text-center transition hover:border-yellow-300/35 hover:bg-yellow-300/[0.04]">
                      <img src={partner.logo} alt={partner.name} className="h-7 max-w-[115px] object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                      <div className="mt-1 text-sm font-black text-white">{partner.name}</div>
                      <div className="mt-2 rounded-full bg-yellow-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-yellow-200">{partner.tag}</div>
                    </div>
                  ))}
                </div>
                <a href="/beneficios" className="mt-7 flex items-center justify-between rounded-2xl bg-yellow-300 px-6 py-4 text-sm font-black text-black transition hover:bg-yellow-200">
                  Ver todos os benefícios <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="border-y border-white/10 bg-zinc-950/60"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between"><div><div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">Mentoria Gluck&apos;s</div><h3 className="mt-2 text-2xl font-black">Para quem busca acompanhamento mais próximo.</h3></div><a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300">Conhecer a mentoria <ArrowRight className="h-4 w-4"/></a></div></section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"><div className="rounded-[32px] border border-emerald-500/20 bg-[linear-gradient(120deg,rgba(5,18,11,0.96),rgba(2,2,2,0.98))] p-8 sm:p-12"><div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Gluck&apos;s Tecnologia</div><div className="mt-4 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="max-w-3xl text-3xl font-black sm:text-4xl">Tecnologia para diferentes momentos da sua jornada no mercado.</h2><p className="mt-4 text-zinc-400">Inteligência artificial. Indicadores. Automações. Desenvolvimento.</p></div><a href="#ia" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 text-sm font-black text-black">Comece agora <ArrowRight className="h-5 w-5"/></a></div></div></section>
      </main>

      <footer className="border-t border-white/10 bg-black"><div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-500 sm:px-6"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><div className="font-black tracking-wider text-white">GLUCK&apos;S</div><div className="mt-1 text-[10px] uppercase tracking-[0.18em]">Tecnologia para traders</div></div><div className="flex flex-wrap gap-5"><a href="#ia">IA</a><a href="#indicador">Indicador</a><a href="#desenvolvimento">Desenvolvimento</a><a href="/beneficios">Benefícios</a><a href="#">Termos</a><a href="#">Privacidade</a></div></div><p className="mt-6 max-w-5xl text-xs leading-6 text-zinc-600">Operações no mercado financeiro envolvem riscos. A Gluck&apos;s oferece ferramentas e conteúdos de apoio à análise e não garante resultados, rentabilidade ou acerto de operações. A decisão de operar e a gestão de risco são sempre do usuário.</p><div className="mt-4 text-xs text-zinc-700">© 2026 Gluck&apos;s Tecnologia. Todos os direitos reservados.</div></div></footer>
    </div>
  );
}
