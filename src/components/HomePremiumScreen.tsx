import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

type HomePremiumScreenProps = {
  userName?: string;
  userEmail?: string;
  userPlan?: string;
  onOpenDashboard: () => void;
  onLogout: () => void;
};

const partners = [
  {
    name: "XM",
    imageSrc: "/partners/xm-logo.png",
    href: "https://affs.click/0hkWv",
  },
  {
    name: "5P Investimentos",
    imageSrc: "/partners/5pi-logo.png",
    href: "https://www.5pi.com.br/parceiros/glucks-trader",
  },
];

function getPlanLabel(plan: string) {
  const labels: Record<string, string> = {
    trial: "TRIAL • 5 PREGÕES",
    monthly: "MENSAL",
    mensal: "MENSAL",
    quarterly: "TRIMESTRAL",
    trimestral: "TRIMESTRAL",
    premium: "PREMIUM",
  };

  return labels[plan.toLowerCase()] || plan.toUpperCase();
}

export default function HomePremiumScreen({
  userName = "Usuário",
  userEmail,
  userPlan = "trial",
  onOpenDashboard,
  onLogout,
}: HomePremiumScreenProps) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isTrial = userPlan.toLowerCase() === "trial";
  const planLabel = getPlanLabel(userPlan);

  const initials = useMemo(() => {
    const p = userName.split(" ").filter(Boolean);
    return p.length > 1 ? `${p[0][0]}${p[1][0]}` : "GT";
  }, [userName]);

  return (
    <div className="min-h-screen bg-[#03070d] text-white">
      <header className="sticky top-0 z-30 border-b border-zinc-900 bg-[#03070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-10 w-10" />
            <strong className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-xl text-transparent">
              Gluck's Trader IA
            </strong>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-sm text-green-300">
              {planLabel}
            </span>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-400 font-bold text-black">
                  {initials}
                </span>
                <span className="hidden md:block" title={userEmail || undefined}>{userName}</span>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-zinc-800 bg-[#0b1118] p-3">
                  <button className="flex w-full gap-2 rounded-xl p-3 hover:bg-zinc-900" onClick={() => navigate("/perfil")}>
                    <User size={18}/> Meu perfil
                  </button>
                  <button className="flex w-full gap-2 rounded-xl p-3 hover:bg-zinc-900" onClick={() => navigate("/configuracoes")}>
                    <Settings size={18}/> Configurações
                  </button>
                  <button className="flex w-full gap-2 rounded-xl p-3 hover:bg-zinc-900" onClick={() => navigate("/assinatura")}>
                    <CreditCard size={18}/> Minha assinatura
                  </button>
                  <button className="flex w-full gap-2 rounded-xl p-3 text-red-400" onClick={onLogout}>
                    <LogOut size={18}/> Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] space-y-8 px-6 py-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-green-500/30 bg-gradient-to-br from-green-500/15 via-[#081018] to-[#03070d] p-8 md:p-12"
        >
          <div className="flex items-center gap-2 text-green-300">
            <Sparkles size={18}/>
            {isTrial ? "Seu teste está ativo" : "Sua central de análise"}
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-bold md:text-6xl">
            Transforme a leitura do mercado em um plano operacional objetivo.
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-zinc-300">
            Escolha um ativo e receba uma análise estruturada com direção,
            confiança, entrada, stop e alvo para apoiar sua decisão.
          </p>

          {isTrial && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
              <CheckCircle2 className="text-green-400"/>
              <div>
                <b>Aproveite seus 5 pregões</b>
                <p className="text-sm text-zinc-400">
                  Experimente a plataforma antes de escolher seu plano.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={onOpenDashboard} className="rounded-2xl bg-green-500 px-7 py-4 font-bold text-black">
              Fazer análise agora <ArrowRight className="ml-2 inline"/>
            </button>
            <button onClick={() => navigate("/assinatura")} className="rounded-2xl border border-zinc-700 px-7 py-4">
              Conhecer planos
            </button>
          </div>
        </motion.section>

        <section className="grid gap-5 md:grid-cols-3">
          <Card icon={<TrendingUp/>} title="Direção + confiança" text="Visualize o cenário identificado pela IA."/>
          <Card icon={<Target/>} title="Entrada, stop e alvo" text="Tenha níveis organizados antes da decisão."/>
          <Card icon={<ShieldCheck/>} title="Gestão consciente" text="Use a análise como apoio operacional."/>
        </section>

        <section className="rounded-[30px] border border-zinc-800 bg-[#080d14] p-8">
          <h2 className="text-3xl font-bold">Sua primeira análise em 3 passos</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Step n="1" text="Escolha o ativo"/>
            <Step n="2" text="Solicite a análise"/>
            <Step n="3" text="Avalie o plano"/>
          </div>
        </section>

        <section className="rounded-[30px] border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold">Programa de parceiros</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {partners.map((p) => (
              <a key={p.name} href={p.href} target="_blank" className="rounded-2xl border border-zinc-800 p-6 text-center">
                <img src={p.imageSrc} className="mx-auto h-14" />
                <div className="mt-4 text-green-300">
                  Acessar parceiro <ExternalLink className="inline" size={14}/>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({ icon, title, text }: any) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-[#080d14] p-6">
      <div className="text-green-400">{icon}</div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-zinc-400">{text}</p>
    </div>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 p-5">
      <Zap className="text-green-400"/>
      <b className="mt-3 block">{n}</b>
      <span className="text-zinc-400">{text}</span>
    </div>
  );
}