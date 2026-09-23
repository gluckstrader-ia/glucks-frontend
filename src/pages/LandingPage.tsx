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

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"><div className="grid gap-5 lg:grid-cols-3">
          <Card id="indicador" className="border-emerald-500/20 p-7"><div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">Indicador Gluck&apos;s</div><h2 className="mt-4 text-2xl font-black">Sinais no gráfico.<br/>Mais clareza na sua operação.</h2><p className="mt-4 leading-7 text-zinc-400">Indicador de compra e venda com sinais visuais diretamente no gráfico.</p><div className="mt-6 rounded-2xl border border-white/10 bg-black/50 p-5"><div className="flex h-28 items-end gap-2">{[35,55,45,70,52,80,62,88,67,76,91].map((h,i)=><div key={i} className="flex-1 rounded-t bg-emerald-400/50" style={{height:`${h}%`}} />)}</div></div><a href="#" className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold">Conhecer o indicador <ArrowRight className="h-4 w-4"/></a></Card>
          <Card id="desenvolvimento" className="border-cyan-500/20 p-7"><div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Desenvolvimento personalizado</div><h2 className="mt-4 text-2xl font-black">Sua estratégia pode virar tecnologia.</h2><p className="mt-4 leading-7 text-zinc-400">Desenvolvemos indicadores, automações e soluções personalizadas para traders.</p><div className="mt-7 space-y-4">{["Indicadores personalizados","Automações e robôs","Projetos especiais"].map(x=><div key={x} className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="h-5 w-5 text-cyan-300"/>{x}</div>)}</div><a href="#" className="mt-8 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold">Falar sobre meu projeto <ArrowRight className="h-4 w-4"/></a></Card>
          <Card className="border-yellow-400/20 p-7"><div className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300">Benefícios Gluck&apos;s</div><h2 className="mt-4 text-2xl font-black">Vantagens para a nossa comunidade.</h2><p className="mt-4 leading-7 text-zinc-400">Descontos, condições especiais e parceiros reunidos em uma página exclusiva.</p><div className="mt-7 grid grid-cols-2 gap-3">{["PARCEIRO 01","PARCEIRO 02","PARCEIRO 03","+ MAIS"].map(x=><div key={x} className="grid h-16 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold text-zinc-500">{x}</div>)}</div><a href="/beneficios" className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold">Ver todos os benefícios <ArrowRight className="h-4 w-4"/></a></Card>
        </div></section>

        <section className="border-y border-white/10 bg-zinc-950/60"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between"><div><div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">Mentoria Gluck&apos;s</div><h3 className="mt-2 text-2xl font-black">Para quem busca acompanhamento mais próximo.</h3></div><a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300">Conhecer a mentoria <ArrowRight className="h-4 w-4"/></a></div></section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"><div className="rounded-[32px] border border-emerald-500/20 bg-[linear-gradient(120deg,rgba(5,18,11,0.96),rgba(2,2,2,0.98))] p-8 sm:p-12"><div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Gluck&apos;s Tecnologia</div><div className="mt-4 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="max-w-3xl text-3xl font-black sm:text-4xl">Tecnologia para diferentes momentos da sua jornada no mercado.</h2><p className="mt-4 text-zinc-400">Inteligência artificial. Indicadores. Automações. Desenvolvimento.</p></div><a href="#ia" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 text-sm font-black text-black">Comece agora <ArrowRight className="h-5 w-5"/></a></div></div></section>
      </main>

      <footer className="border-t border-white/10 bg-black"><div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-500 sm:px-6"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><div className="font-black tracking-wider text-white">GLUCK&apos;S</div><div className="mt-1 text-[10px] uppercase tracking-[0.18em]">Tecnologia para traders</div></div><div className="flex flex-wrap gap-5"><a href="#ia">IA</a><a href="#indicador">Indicador</a><a href="#desenvolvimento">Desenvolvimento</a><a href="/beneficios">Benefícios</a><a href="#">Termos</a><a href="#">Privacidade</a></div></div><p className="mt-6 max-w-5xl text-xs leading-6 text-zinc-600">Operações no mercado financeiro envolvem riscos. A Gluck&apos;s oferece ferramentas e conteúdos de apoio à análise e não garante resultados, rentabilidade ou acerto de operações. A decisão de operar e a gestão de risco são sempre do usuário.</p><div className="mt-4 text-xs text-zinc-700">© 2026 Gluck&apos;s Tecnologia. Todos os direitos reservados.</div></div></footer>
    </div>
  );
}
