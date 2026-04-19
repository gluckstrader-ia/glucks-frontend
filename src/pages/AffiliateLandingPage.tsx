import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  Copy,
  Gift,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: <BadgeDollarSign className="h-6 w-6" />,
    title: "10% recorrente",
    text: "Ganhe comissão sobre assinaturas ativas indicadas com o seu código exclusivo.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Dashboard próprio",
    text: "Acompanhe códigos, comissões, clientes ativos e materiais em um painel profissional.",
  },
  {
    icon: <Megaphone className="h-6 w-6" />,
    title: "Materiais prontos",
    text: "Receba textos, roteiros e criativos para divulgar com mais velocidade e consistência.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Fluxo simples",
    text: "O cliente usa seu código no cadastro e você acompanha tudo sem complicação.",
  },
];

const steps = [
  {
    step: "01",
    title: "Entre no programa",
    text: "Ative sua participação e receba seu código exclusivo de parceiro.",
  },
  {
    step: "02",
    title: "Divulgue seu código",
    text: "Compartilhe seu link e seus materiais para atrair novos usuários para a plataforma.",
  },
  {
    step: "03",
    title: "Ganhe recorrência",
    text: "Quando o usuário indicado virar assinante, sua comissão começa a ser registrada.",
  },
];

const faqs = [
  {
    q: "A comissão é recorrente?",
    a: "Sim. A proposta do programa é comissão recorrente sobre assinaturas ativas vinculadas ao seu código.",
  },
  {
    q: "Preciso pagar para participar?",
    a: "Não. O parceiro entra no programa, recebe um código exclusivo e acompanha tudo pelo dashboard.",
  },
  {
    q: "Como a indicação é identificada?",
    a: "O cliente usa seu código no cadastro. A partir disso, a conta fica vinculada ao parceiro no sistema.",
  },
  {
    q: "Como acompanho meus resultados?",
    a: "Na área do parceiro você visualiza código, link, comissões, Pix e materiais de divulgação.",
  },
];

export default function AffiliateLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden border-b border-emerald-500/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_right,rgba(6,182,212,0.08),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Programa de Parceiros • Gluck’s Trader IA
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Ganhe comissões recorrentes indicando a{" "}
                <span className="text-emerald-400">Gluck’s Trader IA</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Tenha seu próprio código exclusivo, acompanhe suas comissões em
                um dashboard profissional e use materiais prontos para divulgar
                a plataforma com mais força.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/cadastro"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-base font-bold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  Quero entrar no programa
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/dashboard-parceiro"
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-base font-semibold text-white transition hover:border-emerald-400/30 hover:bg-zinc-800"
                >
                  Já sou parceiro
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["10%", "Comissão recorrente"],
                  ["1 código", "Exclusivo por parceiro"],
                  ["1 painel", "Acompanhamento total"],
                  ["Pix", "Recebimento semanal"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4"
                  >
                    <div className="text-2xl font-black text-emerald-400">
                      {value}
                    </div>
                    <div className="mt-1 text-sm text-zinc-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-[30px] border border-zinc-800 bg-zinc-900/90 p-5 shadow-2xl shadow-emerald-950/30"
            >
              <div className="rounded-[24px] border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <div className="text-sm text-zinc-400">
                      Exemplo do painel
                    </div>
                    <div className="text-xl font-bold">
                      Parceiro GLUCK4821
                    </div>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300">
                    Ativo
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[
                    ["R$ 1.280,00", "Comissões pagas"],
                    ["R$ 69,40", "Disponível"],
                    ["11", "Clientes ativos"],
                    ["74", "Cadastros com código"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                    >
                      <div className="text-2xl font-black text-white">
                        {value}
                      </div>
                      <div className="mt-1 text-sm text-zinc-400">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="text-sm text-zinc-400">Seu link exclusivo</div>
                  <div className="mt-2 rounded-xl bg-zinc-950 px-4 py-3 font-mono text-sm text-emerald-300">
                    gluckstrader.com.br/cadastro?ref=GLUCK4821
                  </div>
                  <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">
                    <Copy className="h-4 w-4" />
                    Copiar link
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Benefícios
          </div>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Por que vale a pena entrar no programa
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Um modelo simples de entender, profissional para operar e forte para
            criar recorrência real com a sua audiência.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-zinc-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-900 bg-zinc-950/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Como funciona
            </div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Entre, divulgue e acompanhe
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-[24px] border border-zinc-800 bg-zinc-900 p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-lg font-black text-emerald-400">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Para quem é
            </div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Ideal para quem já se conecta com o mercado
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Criadores, traders, alunos, comunidades e parceiros que querem
              monetizar sua audiência com um produto digital de recorrência.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: <Users className="h-5 w-5" />,
                title: "Criadores de conteúdo",
                text: "Perfis que falam com traders, iniciantes ou público interessado em mercado.",
              },
              {
                icon: <Gift className="h-5 w-5" />,
                title: "Alunos e clientes",
                text: "Quem já conhece a plataforma e quer transformar recomendação em receita.",
              },
              {
                icon: <Megaphone className="h-5 w-5" />,
                title: "Comunidades",
                text: "Telegram, Discord, grupos e audiências segmentadas em operações e aprendizado.",
              },
              {
                icon: <BadgeDollarSign className="h-5 w-5" />,
                title: "Parceiros comerciais",
                text: "Pessoas que querem uma renda recorrente com acompanhamento claro de performance.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              FAQ
            </div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Dúvidas frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <div className="text-lg font-bold text-white">{item.q}</div>
                <div className="mt-2 leading-7 text-zinc-400">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-950 p-8 sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Chamada final
            </div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">
              Transforme sua audiência em receita recorrente com a Gluck’s
              Trader IA
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Receba seu código, acompanhe seus resultados e faça parte de um
              programa criado para crescer com parceiros de alta performance.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/cadastro"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-4 text-base font-bold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Quero entrar no programa
              </Link>
              <Link
                to="/dashboard-parceiro"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-base font-semibold text-white transition hover:border-emerald-400/40 hover:bg-zinc-800"
              >
                Já sou parceiro
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}