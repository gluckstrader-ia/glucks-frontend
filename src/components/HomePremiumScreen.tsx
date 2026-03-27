import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CandlestickChart,
  Copy,
  Crown,
  Flame,
  Globe,
  History,
  LineChart,
  Lock,
  Radio,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

type HomePremiumScreenProps = {
  userName?: string;
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

type CommunityTrade = {
  id: string;
  trader: string;
  country: string;
  asset: string;
  side: "COMPRA" | "VENDA";
  confidence: number;
  winRate: number;
  profit: string;
  ago: string;
};

const recentAnalyses: RecentAnalysis[] = [
  { id: "1", asset: "IBOV", market: "Índices", timeframe: "5m", signal: "COMPRA_FORTE", strength: 70 },
  { id: "2", asset: "EURUSD", market: "Forex", timeframe: "5m", signal: "VENDA", strength: 84 },
  { id: "3", asset: "BTCUSDT", market: "Crypto", timeframe: "15m", signal: "COMPRA", strength: 78 },
  { id: "4", asset: "WIN", market: "Futuros BR", timeframe: "5m", signal: "VENDA_FORTE", strength: 81 },
  { id: "5", asset: "PETR4", market: "Ações", timeframe: "15m", signal: "COMPRA_FRACA", strength: 58 },
];

const communityTrades: CommunityTrade[] = [
  { id: "1", trader: "Saowalak Chai", country: "TH", asset: "USDCHF", side: "COMPRA", confidence: 83, winRate: 82, profit: "+$680", ago: "agora" },
  { id: "2", trader: "Bruno Nascimento", country: "BR", asset: "DJI30", side: "VENDA", confidence: 79, winRate: 82, profit: "+$469", ago: "1 min" },
  { id: "3", trader: "Adrián López", country: "ES", asset: "XAGUSD", side: "VENDA", confidence: 94, winRate: 98, profit: "+$887", ago: "2 min" },
  { id: "4", trader: "Thomas Peeters", country: "BE", asset: "IBOV", side: "VENDA", confidence: 85, winRate: 89, profit: "+$1082", ago: "3 min" },
  { id: "5", trader: "Eva Gruber", country: "AT", asset: "DJI30", side: "VENDA", confidence: 82, winRate: 82, profit: "+$624", ago: "5 min" },
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
  userPlan = "free",
  onOpenDashboard,
  onLogout,
}: HomePremiumScreenProps) {
  return (
    <div className="min-h-screen bg-[#03070d] text-white">
      <div className="sticky top-0 z-30 border-b border-zinc-900/80 bg-[#03070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black ring-1 ring-zinc-800">
              <BrainCircuit className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight">Gluck&apos;s Trader IA</div>
          </div>

          <div className="flex items-center gap-3">
            <TopBadge icon={<Crown className="h-4 w-4" />} value={userPlan.toUpperCase()} color="yellow" />
            
            <button className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white">
              <Users className="h-5 w-5" />
            </button>
            <button
              onClick={onLogout}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-300 transition hover:text-white"
            >
              Sair
            </button>
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
          <motion.section variants={cardMotion} className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
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
            <LiveTradingCard />
          </motion.section>

          <motion.section variants={cardMotion} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {quickModules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.title}
                  className="group rounded-[26px] border border-zinc-800 bg-gradient-to-b from-[#0a0f17] to-[#080c13] p-5 text-left transition hover:-translate-y-1 hover:border-zinc-700"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="rounded-2xl bg-zinc-900 p-3 text-zinc-500 transition group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    {module.locked && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-400">
                        <Lock className="h-3 w-3" /> Em breve
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

          <motion.section variants={cardMotion} className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <CommunityCard />
            <RecentAnalysesCard onOpenDashboard={onOpenDashboard} />
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}

function TopBadge({
  icon,
  value,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  color: "yellow" | "cyan";
}) {
  const styles =
    color === "yellow"
      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
      : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";

  return (
    <div className={`flex items-center gap-2 rounded-full border px-4 py-2 ${styles}`}>
      {icon}
      <span className="font-bold">{value}</span>
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
        wrap: "border-green-500/60 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),rgba(16,185,129,0.10)_35%,rgba(0,0,0,0.2)_75%)]",
        glow: "shadow-[0_0_40px_rgba(34,197,94,0.14)]",
        icon: "bg-green-500/20 text-green-300 ring-green-400/20",
        title: "text-green-400",
        arrow: "text-green-400",
      }
    : {
        wrap: "border-amber-500/70 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.24),rgba(245,158,11,0.08)_35%,rgba(0,0,0,0.2)_75%)]",
        glow: "shadow-[0_0_40px_rgba(245,158,11,0.12)]",
        icon: "bg-amber-500/20 text-amber-300 ring-amber-400/20",
        title: "text-amber-300",
        arrow: "text-amber-400",
      };

  return (
    <button
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
                <TrendingUp className="h-4 w-4" /> {tag}
              </div>
            )}
            <div className="mt-3 max-w-xl text-lg text-zinc-300">{subtitle}</div>
            {tag2 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300">
                <Sparkles className="h-4 w-4" /> {tag2}
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

function LiveTradingCard() {
  return (
    <div className="rounded-[28px] border border-cyan-500/50 bg-[linear-gradient(90deg,rgba(6,182,212,0.14),rgba(59,130,246,0.1),rgba(8,145,178,0.14))] p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative rounded-2xl bg-cyan-500/15 p-4 text-cyan-300 ring-1 ring-cyan-500/20">
            <Radio className="h-7 w-7" />
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.9)]" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-4xl font-bold tracking-tight text-cyan-300">Live Trading IA 26/3</div>
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-300">
                AO VIVO
              </span>
            </div>
            <div className="mt-2 text-lg text-zinc-400">
              Trading ao vivo com IA comentando cada movimento em tempo real
            </div>
          </div>
        </div>

        <button className="inline-flex items-center gap-3 self-start rounded-2xl bg-cyan-400 px-6 py-4 text-lg font-bold text-black shadow-[0_0_30px_rgba(34,211,238,0.28)] transition hover:scale-[1.02]">
          <Zap className="h-5 w-5" /> Entrar Agora
        </button>
      </div>
    </div>
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

        <button className="inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:text-cyan-300">
          Ver mais <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 rounded-[24px] border border-zinc-800 bg-zinc-900/45 p-5">
        <div className="flex items-center gap-3 text-2xl font-semibold">
          <Globe className="h-6 w-6 text-cyan-400" /> Mercados Ativos:
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {["GBP", "EUR", "CHF", "USD", "CAD"].map((item) => (
            <span key={item} className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
              {item}
            </span>
          ))}
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300">
            🔥 Crypto 24/7
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Análises hoje" value="8277" />
        <StatCard label="Taxa de acerto" value="86.6%" valueClassName="text-green-400" cardClassName="border-green-500/30 bg-green-500/10" />
        <StatCard label="Lucro total" value="$872K" valueClassName="text-cyan-300" cardClassName="border-cyan-500/30 bg-cyan-500/10" />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg text-zinc-400">Últimas 15 análises:</div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-400">↗ 15 ganhos</span>
          <span className="text-red-400">↘ 0 perdas</span>
        </div>
      </div>

      <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-2">
        {communityTrades.map((trade) => (
          <div key={trade.id} className="flex items-center justify-between gap-4 rounded-[22px] border border-green-500/20 bg-[linear-gradient(90deg,rgba(34,197,94,0.12),rgba(16,185,129,0.05),rgba(5,10,20,0.1))] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-black">
                {trade.country}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-bold">{trade.trader}</span>
                  <span className={`rounded-lg px-2.5 py-1 text-sm font-semibold ${trade.side === "COMPRA" ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`}>
                    {trade.side}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-lg text-zinc-300">
                  <span className="font-semibold">{trade.asset}</span>
                  <span>• {trade.confidence}% confiança</span>
                  <span className="text-green-400">• {trade.winRate}% win</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">↗ {trade.profit}</div>
              <div className="mt-1 text-base text-zinc-400">◔ {trade.ago}</div>
            </div>
          </div>
        ))}
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
          <button className="inline-flex items-center gap-2 text-base font-semibold text-white transition hover:text-cyan-300">
            Ver todas <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recentAnalyses.map((analysis) => (
            <button
              key={analysis.id}
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
                <div className={`text-2xl font-bold ${analysis.signal.includes("VENDA") ? "text-red-400" : "text-amber-300"}`}>
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
      : "border-amber-500/25 bg-amber-500/10 text-amber-300";

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