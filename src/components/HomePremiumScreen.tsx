import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  User,
  Settings,
  LogOut,
  CreditCard,
  X,
  ExternalLink,
} from "lucide-react";

type HomePremiumScreenProps = {
  userName?: string;
  userEmail?: string;
  userPlan?: string;
  onOpenDashboard: () => void;
  onLogout: () => void;
};

type AnalysisStatus = "GAIN_TOTAL" | "GAIN_PARCIAL" | "LOSS" | "EM_ANDAMENTO";

type RecentAnalysis = {
  id: string;
  asset: string;
  market: string;
  timeframe: string;
  signal: string;
  strength: number;
  status: AnalysisStatus;
  resultLabel: string;
  resultDetail: string;
  createdAt: string;
};

type PartnerLogo = {
  id: string;
  name: string;
  imageSrc: string;
  href: string;
};

const recentAnalyses: RecentAnalysis[] = [
  {
    id: "1",
    asset: "IBOV",
    market: "Índices",
    timeframe: "5m",
    signal: "COMPRA_FORTE",
    strength: 89,
    status: "GAIN_TOTAL",
    resultLabel: "Gain Total",
    resultDetail: "3 alvos atingidos",
    createdAt: "Hoje • 09:12",
  },
  {
    id: "2",
    asset: "EURUSD",
    market: "Forex",
    timeframe: "15m",
    signal: "VENDA",
    strength: 82,
    status: "GAIN_PARCIAL",
    resultLabel: "Gain Parcial",
    resultDetail: "TP1 atingido",
    createdAt: "Hoje • 08:47",
  },
  {
    id: "3",
    asset: "BTCUSDT",
    market: "Crypto",
    timeframe: "15m",
    signal: "COMPRA",
    strength: 78,
    status: "EM_ANDAMENTO",
    resultLabel: "Em andamento",
    resultDetail: "Aguardando fechamento",
    createdAt: "Hoje • 08:30",
  },
  {
    id: "4",
    asset: "WIN",
    market: "Futuros BR",
    timeframe: "5m",
    signal: "VENDA_FORTE",
    strength: 86,
    status: "LOSS",
    resultLabel: "Loss",
    resultDetail: "Stop atingido",
    createdAt: "Hoje • 08:05",
  },
  {
    id: "5",
    asset: "PETR4",
    market: "Ações",
    timeframe: "15m",
    signal: "COMPRA",
    strength: 74,
    status: "GAIN_PARCIAL",
    resultLabel: "Gain Parcial",
    resultDetail: "TP1 atingido",
    createdAt: "Ontem • 17:42",
  },
  {
    id: "6",
    asset: "WDO",
    market: "Futuros BR",
    timeframe: "5m",
    signal: "VENDA",
    strength: 80,
    status: "GAIN_TOTAL",
    resultLabel: "Gain Total",
    resultDetail: "3 alvos atingidos",
    createdAt: "Ontem • 16:55",
  },
  {
    id: "7",
    asset: "XAUUSD",
    market: "Forex",
    timeframe: "15m",
    signal: "COMPRA",
    strength: 77,
    status: "EM_ANDAMENTO",
    resultLabel: "Em andamento",
    resultDetail: "Aguardando fechamento",
    createdAt: "Ontem • 15:08",
  },
  {
    id: "8",
    asset: "MGLU3",
    market: "Ações",
    timeframe: "30m",
    signal: "VENDA",
    strength: 69,
    status: "LOSS",
    resultLabel: "Loss",
    resultDetail: "Stop atingido",
    createdAt: "Ontem • 14:11",
  },
  {
    id: "9",
    asset: "SPX",
    market: "Índices",
    timeframe: "5m",
    signal: "COMPRA",
    strength: 84,
    status: "GAIN_TOTAL",
    resultLabel: "Gain Total",
    resultDetail: "3 alvos atingidos",
    createdAt: "Ontem • 11:26",
  },
  {
    id: "10",
    asset: "ETHUSDT",
    market: "Crypto",
    timeframe: "15m",
    signal: "VENDA",
    strength: 73,
    status: "GAIN_PARCIAL",
    resultLabel: "Gain Parcial",
    resultDetail: "TP1 atingido",
    createdAt: "Ontem • 10:03",
  },
];

const partnerLogos: PartnerLogo[] = [
  {
    id: "xm",
    name: "XM",
    imageSrc: "/partners/xm-logo.png",
    href: "https://SEU-LINK-DE-PARCEIRO-XM-AQUI",
  },
  {
    id: "5p",
    name: "5P Investimentos",
    imageSrc: "/partners/5pi-logo.png",
    href: "https://SEU-LINK-DE-PARCEIRO-5PI-AQUI",
  },
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
  const [recentModalOpen, setRecentModalOpen] = useState(false);
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
        setRecentModalOpen(false);
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

      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 lg:px-8">
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

          <motion.section variants={cardMotion}>
            <PartnersSection partners={partnerLogos} />
          </motion.section>

          <motion.section variants={cardMotion}>
            <RecentAnalysesCard
              analyses={recentAnalyses}
              onOpenDashboard={onOpenDashboard}
              onOpenAll={() => setRecentModalOpen(true)}
            />
          </motion.section>
        </motion.div>
      </div>

      <RecentAnalysesModal
        open={recentModalOpen}
        onClose={() => setRecentModalOpen(false)}
        analyses={recentAnalyses}
        onOpenDashboard={onOpenDashboard}
      />
    </div>
  );
}

function HeroActionCard({
  title,
  subtitle,
  icon,
  accent,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: "cyan" | "amber";
  onClick: () => void;
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
            <div className="mt-3 max-w-xl text-lg text-zinc-300">{subtitle}</div>
          </div>
        </div>

        <div className="flex justify-end">
          <ArrowRight className={`h-6 w-6 transition group-hover:translate-x-1 ${theme.arrow}`} />
        </div>
      </div>
    </button>
  );
}

function PartnersSection({ partners }: { partners: PartnerLogo[] }) {
  return (
    <div className="rounded-[30px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-6 md:p-8">
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold md:text-3xl">Conectado aos nossos parceiros de mercado</div>
        <div className="mt-2 text-sm text-zinc-400 md:text-base">
          Acesse benefícios exclusivos através das nossas conexões estratégicas.
        </div>
      </div>

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.href}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-[26px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(16,21,31,0.96),rgba(8,12,20,0.96))] p-6 transition duration-300 hover:-translate-y-1 hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.10)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_55%)] opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="relative flex min-h-[120px] flex-col items-center justify-center gap-4">
              <img
                src={partner.imageSrc}
                alt={partner.name}
                className="h-14 w-auto object-contain md:h-16"
              />

              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300">
                Acessar parceiro
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function RecentAnalysesCard({
  analyses,
  onOpenDashboard,
  onOpenAll,
}: {
  analyses: RecentAnalysis[];
  onOpenDashboard: () => void;
  onOpenAll: () => void;
}) {
  const visibleAnalyses = analyses.slice(0, 10);

  return (
    <div className="rounded-[30px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(5,8,14,0.98))] p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="text-2xl font-bold md:text-3xl">Análises Recentes</div>

        <button
          type="button"
          onClick={onOpenAll}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-green-300 md:text-base"
        >
          Ver todas
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {visibleAnalyses.map((analysis) => (
          <button
            key={analysis.id}
            type="button"
            onClick={onOpenDashboard}
            className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b1118] px-4 py-3 text-left transition duration-300 hover:border-green-500/40 hover:bg-[#0e1622]"
          >
            <div
              className={`absolute left-0 top-0 h-full w-[4px] rounded-l-2xl ${
                analysis.status === "GAIN_TOTAL"
                  ? "bg-green-500"
                  : analysis.status === "GAIN_PARCIAL"
                  ? "bg-emerald-500"
                  : analysis.status === "LOSS"
                  ? "bg-red-500"
                  : "bg-yellow-400"
              }`}
            />

            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-sm font-bold text-white">
                {analysis.asset.slice(0, 3)}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="text-lg font-bold text-white">{analysis.asset}</div>
                  <div className="text-xs text-zinc-500">
                    {analysis.market} • {analysis.timeframe}
                  </div>
                </div>

                <div className="mt-1 text-xs text-zinc-500">{analysis.createdAt}</div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4 md:gap-6">
              <div className="text-right">
                <div
                  className={`text-sm font-bold tracking-wide ${
                    analysis.signal.includes("VENDA")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {analysis.signal.replace(/_/g, " ")}
                </div>

                <div className="mt-1 text-xs text-zinc-400">
                  {analysis.strength}% confiança
                </div>
              </div>

              <div className="flex min-w-[110px] flex-col items-end gap-1">
                <StatusBadge status={analysis.status} label={analysis.resultLabel} />
                <div className="text-right text-xs text-zinc-400">
                  {analysis.resultDetail}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RecentAnalysesModal({
  open,
  onClose,
  analyses,
  onOpenDashboard,
}: {
  open: boolean;
  onClose: () => void;
  analyses: RecentAnalysis[];
  onOpenDashboard: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-[28px] border border-zinc-800 bg-[#0b1118] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 md:px-6">
              <div>
                <div className="text-xl font-bold md:text-2xl">Todas as análises recentes</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Últimas análises gerais da plataforma
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(85vh-88px)] overflow-y-auto p-4 md:p-6">
              <div className="space-y-3">
                {analyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDashboard();
                    }}
                    className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b1118] px-4 py-3 text-left transition duration-300 hover:border-green-500/40 hover:bg-[#0e1622]"
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-[4px] rounded-l-2xl ${
                        analysis.status === "GAIN_TOTAL"
                          ? "bg-green-500"
                          : analysis.status === "GAIN_PARCIAL"
                          ? "bg-emerald-500"
                          : analysis.status === "LOSS"
                          ? "bg-red-500"
                          : "bg-yellow-400"
                      }`}
                    />

                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-sm font-bold text-white">
                        {analysis.asset.slice(0, 3)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div className="text-lg font-bold text-white">{analysis.asset}</div>
                          <div className="text-xs text-zinc-500">
                            {analysis.market} • {analysis.timeframe}
                          </div>
                        </div>

                        <div className="mt-1 text-xs text-zinc-500">{analysis.createdAt}</div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-4 md:gap-6">
                      <div className="text-right">
                        <div
                          className={`text-sm font-bold tracking-wide ${
                            analysis.signal.includes("VENDA")
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {analysis.signal.replace(/_/g, " ")}
                        </div>

                        <div className="mt-1 text-xs text-zinc-400">
                          {analysis.strength}% confiança
                        </div>
                      </div>

                      <div className="flex min-w-[110px] flex-col items-end gap-1">
                        <StatusBadge status={analysis.status} label={analysis.resultLabel} />
                        <div className="text-right text-xs text-zinc-400">
                          {analysis.resultDetail}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: AnalysisStatus;
  label: string;
}) {
  const style =
    status === "GAIN_TOTAL"
      ? "border-green-500/30 bg-green-500/15 text-green-300"
      : status === "GAIN_PARCIAL"
      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
      : status === "LOSS"
      ? "border-red-500/30 bg-red-500/15 text-red-300"
      : "border-yellow-500/30 bg-yellow-500/15 text-yellow-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold md:text-xs ${style}`}
    >
      {label}
    </span>
  );
}