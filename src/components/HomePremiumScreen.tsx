import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CandlestickChart,
  Copy,
  Flame,
  Globe,
  History,
  LineChart,
  Lock,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
  LogOut,
  CreditCard,
} from "lucide-react";

type HomePremiumScreenProps = {
  userName?: string;
  userEmail?: string;
  userPlan?: string;
  onOpenDashboard: () => void;
  onLogout: () => void;
};

type RecentAnalysis = {
  id: string;
  asset: string;
  market: string;
  timeframe: string;
  signal: string;
  strength: number;
};

const recentAnalyses: RecentAnalysis[] = [
  { id: "1", asset: "IBOV", market: "Índices", timeframe: "5m", signal: "COMPRA_FORTE", strength: 70 },
  { id: "2", asset: "EURUSD", market: "Forex", timeframe: "5m", signal: "VENDA", strength: 84 },
  { id: "3", asset: "BTCUSDT", market: "Crypto", timeframe: "15m", signal: "COMPRA", strength: 78 },
  { id: "4", asset: "WIN", market: "Futuros BR", timeframe: "5m", signal: "VENDA_FORTE", strength: 81 },
  { id: "5", asset: "PETR4", market: "Ações", timeframe: "15m", signal: "COMPRA_FRACA", strength: 58 },
];

const quickModules = [
  { title: "Copy Trading", subtitle: "Robôs automáticos", icon: Copy, locked: true },
  { title: "Corretoras", subtitle: "Conecte contas", icon: Wallet, locked: true },
  { title: "Histórico", subtitle: "Análises anteriores", icon: History, locked: true },
  { title: "Trades", subtitle: "Histórico de operações", icon: LineChart, locked: true },
];

const cardMotion = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function HomePremiumScreen({
  userName = "Usuário",
  userEmail = "usuario@gluckstrader.com",
  userPlan = "free",
  onOpenDashboard,
  onLogout,
}: HomePremiumScreenProps) {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const userInitials = useMemo(() => {
    const parts = userName.trim().split(" ").filter(Boolean);

    if (parts.length === 0) return "GT";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }, [userName]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#03070d] text-white">
      <div className="sticky top-0 z-30 border-b border-zinc-900/80 bg-[#03070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 md:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-black ring-1 ring-zinc-800 transition-all duration-300 group-hover:scale-105 group-hover:ring-green-500/50">
              <div className="absolute inset-0 rounded-2xl bg-green-500/20 opacity-0 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg" />
              <img
                src="/logo.png"
                alt="Gluck's Trader IA"
                className="relative h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Gluck&apos;s Trader IA
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1 text-sm font-semibold text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.12)]">
              {userPlan.toUpperCase()}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 transition hover:border-green-500/30 hover:bg-zinc-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-sm font-bold text-black shadow-[0_0_18px_rgba(34,197,94,0.18)]">
                  {userInitials}
                </div>

                <div className="hidden text-left md:block">
                  <div className="max-w-[140px] truncate text-sm font-semibold text-white">
                    {userName}
                  </div>
                  <div className="max-w-[160px] truncate text-xs text-zinc-400">
                    {userEmail}
                  </div>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b1118] shadow-2xl">
                  <div className="border-b border-zinc-800 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-base font-bold text-black">
                        {userInitials}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          {userName}
                        </div>
                        <div className="truncate text-xs text-zinc-400">
                          {userEmail}
                        </div>
                        <div className="mt-1 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[11px] font-medium text-yellow-400">
                          Plano {userPlan.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/perfil");
                      }}
                    >
                      <User className="h-4 w-4" />
                      Meu perfil
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/configuracoes");
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/assinatura");
                      }}
                    >
                      <CreditCard className="h-4 w-4" />
                      Minha assinatura
                    </button>

                    <div className="my-2 border-t border-zinc-800" />

                    <button
                      type="button"
                      onClick={onLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.07 }}
          className="space-y-6"
        >
          <motion.section
            variants={cardMotion}
            className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Olá, {userName}! <span className="inline-block">👋</span>
              </h1>
              <p className="mt-3 text-base text-zinc-400 md:text-xl">
                O que você deseja analisar hoje?
              </p>
            </div>
          </motion.section>

          <motion.section variants={cardMotion} className="grid grid-cols-1 gap-5">
            <HeroActionCard
              title="Nova Análise"
              subtitle="Analise qualquer ativo com IA avançada"
              icon={<TrendingUp className="h-7 w-7" />}
              accent="cyan"
              onClick={onOpenDashboard}
            />
          </motion.section>

          <motion.section variants={cardMotion} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {quickModules.map((module) => {
              const Icon = module.icon;

              return (
                <button
                  key={module.title}
                  type="button"
                  className="group rounded-[26px] border border-zinc-800 bg-gradient-to-b from-[#0a0f17] to-[#080c13] p-5 text-left transition hover:-translate-y-1 hover:border-zinc-700"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="rounded-2xl bg-zinc-900 p-3 text-zinc-500 transition group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    {module.locked && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-400">
                        <Lock className="h-3 w-3" />
                        Em breve
                      </span>
                    )}
                  </div>

                  <div className="text-lg font-semibold text-zinc-300 transition group-hover:text-white">
                    {module.title}
                  </div>
                  <div className="mt-1 text-sm text-zinc-500">{module.subtitle}</div>
                </button>
              );
            })}
          </motion.section>

          <motion.section
            variants={cardMotion}
            className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
          >
            <CommunityCard />
            <RecentAnalysesCard onOpenDashboard={onOpenDashboard} />
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}

function HeroActionCard({
  title,
  subtitle,
  icon,
  accent,
  onClick,
  tag,
  tag2,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: "cyan" | "amber";
  onClick: () => void;
  tag?: string;
  tag2?: string;
}) {
  const theme =
    accent === "cyan"
      ? {
          wrap:
            "border-green-500/60 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),rgba(16,185,129,0.10)_35%,rgba(0,0,0,0.2)_75%)]",
          glow: "shadow-[0_0_40px_rgba(34,197,94,0.14)]",
          icon: "bg-green-500/20 text-green-300 ring-green-400/20",
          title: "text-green-400",
          arrow: "text-green-400",
        }
      : {
          wrap:
            "border-amber-500/70 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.24),rgba(245,158,11,0.08)_35%,rgba(0,0,0,0.2)_75%)]",
          glow: "shadow-[0_0_40px_rgba(245,158,11,0.12)]",
          icon: "bg-amber-500/20 text-amber-300 ring-amber-400/20",
          title: "text-amber-300",
          arrow: "text-amber-400",
        };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[28px] border p-6 text-left transition duration-300 hover:-translate-y-1 ${theme.wrap} ${theme.glow}`}
    >
      <div className="flex h-full min-h-[160px] flex-col justify-between">
        <div className="space-y-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ${theme.icon}`}>
            {icon}
          </div>

          <div>
            <div className={`text-4xl font-bold tracking-tight ${theme.title}`}>{title}</div>

            {tag && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300">
                <TrendingUp className="h-4 w-4" />
                {tag}
              </div>
            )}

            <div className="mt-3 max-w-xl text-lg text-zinc-300">{subtitle}</div>

            {tag2 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300">
                <Sparkles className="h-4 w-4" />
                {tag2}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <ArrowRight className={`h-6 w-6 transition group-hover:translate-x-1 ${theme.arrow}`} />
        </div>
      </div>
    </button>
  );
}

function CommunityCard() {
  return (
    <div className="rounded-[30px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(7,10,16,0.96))] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-4xl font-bold tracking-tight">
            <Sparkles className="h-7 w-7 text-cyan-400" />
            <span>Comunidade Lucrando Global</span>
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="mt-2 text-lg text-zinc-400">Análises em tempo real de traders globais</div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
            BR Função em breve para o Brasil
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:text-cyan-300"
        >
          Ver mais
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 rounded-[24px] border border-zinc-800 bg-zinc-900/45 p-5">
        <div className="flex items-center gap-3 text-2xl font-semibold">
          <Globe className="h-6 w-6 text-cyan-400" />
          Mercados Ativos:
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {["GBP", "EUR", "CHF", "USD", "CAD"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300"
            >
              {item}
            </span>
          ))}

          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300">
            🔥 Crypto
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Análises hoje" value="8277" />
        <StatCard
          label="Taxa de acerto"
          value="86.6%"
          valueClassName="text-green-400"
          cardClassName="border-green-500/30 bg-green-500/10"
        />
        <StatCard
          label="Lucro total"
          value="$872K"
          valueClassName="text-cyan-300"
          cardClassName="border-cyan-500/30 bg-cyan-500/10"
        />
      </div>
    </div>
  );
}

function RecentAnalysesCard({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-3xl font-bold">Análises Recentes</div>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-base font-semibold text-white transition hover:text-cyan-300"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recentAnalyses.map((analysis) => (
            <button
              key={analysis.id}
              type="button"
              onClick={onOpenDashboard}
              className="flex w-full items-center justify-between gap-4 rounded-[22px] border border-zinc-800 bg-[linear-gradient(90deg,rgba(24,27,32,0.92),rgba(10,14,20,0.98))] p-4 text-left transition hover:border-zinc-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-xl font-bold">
                  {analysis.asset.slice(0, 3)}
                </div>

                <div>
                  <div className="text-2xl font-bold">{analysis.asset}</div>
                  <div className="mt-1 text-base text-zinc-400">
                    {analysis.market} • {analysis.timeframe}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${
                    analysis.signal.includes("VENDA") ? "text-red-400" : "text-amber-300"
                  }`}
                >
                  {analysis.signal}
                </div>
                <div className="mt-1 text-base text-zinc-400">{analysis.strength}% força</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MiniInsightCard
          title="Radar Institucional"
          subtitle="Fluxo, liquidez e pressão por ativo"
          icon={<CandlestickChart className="h-5 w-5" />}
          accent="cyan"
        />
        <MiniInsightCard
          title="Heatmap Operacional"
          subtitle="Melhores horários para operar"
          icon={<Flame className="h-5 w-5" />}
          accent="amber"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName = "text-white",
  cardClassName = "border-zinc-800 bg-zinc-900/45",
}: {
  label: string;
  value: string;
  valueClassName?: string;
  cardClassName?: string;
}) {
  return (
    <div className={`rounded-[22px] border p-5 text-center ${cardClassName}`}>
      <div className={`text-5xl font-bold tracking-tight ${valueClassName}`}>{value}</div>
      <div className="mt-2 text-lg text-zinc-400">{label}</div>
    </div>
  );
}

function MiniInsightCard({
  title,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: "cyan" | "amber" | "green";
}) {
  const style =
    accent === "cyan"
      ? "border-cyan-500/25 bg-cyan-500/10 text-cyan-300"
      : accent === "amber"
      ? "border-amber-500/25 bg-amber-500/10 text-amber-300"
      : "border-green-500/25 bg-green-500/10 text-green-300";

  return (
    <div className="rounded-[24px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-5">
      <div className="flex items-start gap-4">
        <div className={`rounded-2xl border p-3 ${style}`}>{icon}</div>
        <div>
          <div className="text-xl font-bold">{title}</div>
          <div className="mt-2 text-sm text-zinc-400">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}