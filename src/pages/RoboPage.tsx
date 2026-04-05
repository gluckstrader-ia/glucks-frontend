import imagemRobo from "../assets/robo-trader-hero.png";

const WHATSAPP_LINK =
  "https://wa.me/5551994830003?text=Ol%C3%A1%21%20Quero%20comprar%20o%20Rob%C3%B4%20Gluck%27s%20Trader%20para%20Mini%20%C3%8Dndice.";

export default function RoboPage() {
  const beneficios = [
    {
      titulo: "Estratégia automatizada para Mini Índice",
      texto:
        "Robô desenvolvido para operar o Mini Índice com mais disciplina, agilidade e objetividade na execução.",
    },
    {
      titulo: "Busca operacional de 300 a 500 pontos ao dia",
      texto:
        "Estrutura pensada para buscar consistência no day trade, com foco em desempenho operacional e rotina clara.",
    },
    {
      titulo: "Ativação simples e suporte inicial",
      texto:
        "Após a compra, você recebe o passo a passo para ativação e orientação inicial para começar corretamente.",
    },
  ];

  const etapas = [
    "Clique em comprar e fale conosco pelo WhatsApp.",
    "Receba as orientações para pagamento e ativação do robô.",
    "Configure o acesso e comece a operar com uma estrutura mais profissional.",
  ];

  const planos = [
    {
      nome: "Mensal",
      preco: "R$ 299,00",
      periodo: "/mês",
      destaque: false,
      beneficios: [
        "Acesso ao robô para Mini Índice",
        "Estratégia operacional automatizada",
        "Suporte inicial de ativação",
      ],
      cta: "Assinar mensal",
    },
    {
      nome: "Trimestral",
      preco: "R$ 879,00",
      periodo: "/3 meses",
      destaque: true,
      beneficios: [
        "Todos os recursos do plano mensal",
        "Melhor custo-benefício",
        "Melhor custo para continuidade",
      ],
      cta: "Assinar trimestral",
    },
    {
      nome: "Vitalício",
      preco: "R$ 2.900,00",
      periodo: "pagamento único",
      destaque: false,
      beneficios: [
        "Licença vitalícia",
        "Atualizações incluídas",
        "Ideal para longo prazo",
      ],
      cta: "Comprar vitalício",
    },
  ];

  const faq = [
    {
      pergunta: "Esse robô opera qual mercado?",
      resposta:
        "O robô foi desenvolvido para operar Mini Índice (WIN), com foco em day trade.",
    },
    {
      pergunta: "Qual é o objetivo operacional do robô?",
      resposta:
        "A proposta é buscar de 300 a 500 pontos ao dia, sempre dentro de uma lógica operacional estruturada.",
    },
    {
      pergunta: "Como funciona a compra?",
      resposta:
        "Ao clicar no botão de compra, o cliente é direcionado ao WhatsApp para receber atendimento, pagamento e orientações de ativação.",
    },
    {
      pergunta: "Tenho suporte para ativação?",
      resposta:
        "Sim. Após a compra, você recebe suporte inicial para ativação e orientação de uso.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#03070d] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#03070d]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              GT
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Gluck&apos;s Trader IA</p>
              <p className="text-sm text-white/60">
                Robô para Mini Índice • Day Trade Automatizado
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <a
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-cyan-400/40 hover:text-white"
              href="#beneficios"
            >
              Benefícios
            </a>
            <a
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-cyan-400/40 hover:text-white"
              href="#como-funciona"
            >
              Como funciona
            </a>
            <a
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-cyan-400/40 hover:text-white"
              href="#planos"
            >
              Planos
            </a>
            <a
              className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
            >
              Comprar pelo WhatsApp
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.20),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_22%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="flex flex-col justify-center">
              <div className="mb-5 inline-flex w-fit items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                Mini Índice • Busca operacional de 300 a 500 pontos ao dia
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Tenha um <span className="text-cyan-300">robô para Mini Índice</span> com foco em disciplina, consistência e execução profissional.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                Solução desenvolvida para day trade no WIN, com estratégia automatizada, leitura objetiva e uma estrutura pensada para quem busca mais clareza operacional.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-cyan-400 px-6 py-4 text-center text-base font-semibold text-black transition hover:scale-[1.02]"
                >
                  Comprar pelo WhatsApp
                </a>
                <a
                  href="#planos"
                  className="rounded-2xl border border-white/10 px-6 py-4 text-center text-base font-medium text-white/80 transition hover:border-cyan-400/40 hover:text-white"
                >
                  Ver planos
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  ["Mini Índice", "Mercado"],
                  ["300–500 pts", "Meta operacional"],
                  ["Day Trade", "Modo"],
                ].map(([titulo, subtitulo]) => (
                  <div
                    key={titulo}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xl font-semibold text-cyan-300">{titulo}</p>
                    <p className="mt-1 text-sm text-white/60">{subtitulo}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="group flex items-center justify-center">
              <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-cyan-400/20 bg-cyan-400/5 p-2 shadow-[0_0_70px_rgba(34,211,238,0.10)] transition duration-500 group-hover:border-cyan-300/40 group-hover:shadow-[0_0_95px_rgba(34,211,238,0.20)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-400/8 via-transparent to-blue-400/10 opacity-80 transition duration-500 group-hover:opacity-100" />
                <img
                  src={imagemRobo}
                  alt="Robô operando Mini Índice em múltiplos monitores"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={1400}
                  height={1000}
                  className="relative z-10 aspect-[14/10] w-full rounded-[24px] object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute left-5 top-5 z-20 rounded-2xl border border-cyan-400/30 bg-black/60 px-4 py-2 text-sm text-cyan-300 backdrop-blur-md">
                  Execução algorítmica
                </div>
                <div className="absolute bottom-5 left-5 right-5 z-20 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Mini Índice", "Mercado"],
                    ["300–500 pts", "Meta"],
                    ["Day Trade", "Modo"],
                  ].map(([titulo, subtitulo]) => (
                    <div
                      key={titulo}
                      className="rounded-2xl border border-cyan-400/20 bg-black/55 px-4 py-3 backdrop-blur-md"
                    >
                      <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                        {subtitulo}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-cyan-300">{titulo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="beneficios" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
              Benefícios
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Mais estrutura para operar Mini Índice com objetividade.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {beneficios.map((item) => (
              <div
                key={item.titulo}
                className="rounded-[28px] border border-white/10 bg-white/5 p-7 shadow-[0_0_30px_rgba(255,255,255,0.03)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <div className="mb-5 h-11 w-11 rounded-2xl bg-cyan-400/10 ring-1 ring-cyan-400/20" />
                <h3 className="text-xl font-semibold">{item.titulo}</h3>
                <p className="mt-3 leading-7 text-white/65">{item.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
                Como funciona
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Compra com atendimento direto pelo WhatsApp.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
                A jornada foi simplificada para que o cliente fale com você, finalize a compra do plano escolhido e receba a ativação com agilidade.
              </p>
            </div>

            <div className="space-y-4">
              {etapas.map((etapa, index) => (
                <div
                  key={etapa}
                  className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-black/50 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-base font-semibold text-black">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Etapa {index + 1}</h3>
                    <p className="mt-2 text-white/65">{etapa}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="planos" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
              Planos
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Escolha o plano ideal para ativar seu acesso
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/65">
              Três opções para atender diferentes perfis, mantendo a mesma proposta de operação com Mini Índice.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {planos.map((plano) => (
              <div
                key={plano.nome}
                className={
                  plano.destaque
                    ? "relative rounded-[30px] border border-cyan-400/40 bg-cyan-400/10 p-8 shadow-[0_0_50px_rgba(34,211,238,0.16)]"
                    : "rounded-[30px] border border-white/10 bg-white/5 p-8"
                }
              >
                {plano.destaque && (
                  <div className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Mais vantajoso
                  </div>
                )}

                <h3 className="text-2xl font-semibold">{plano.nome}</h3>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight">{plano.preco}</span>
                  <span className="pb-1 text-white/55">{plano.periodo}</span>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-white/75">
                  {plano.beneficios.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    plano.destaque
                      ? "mt-8 block w-full rounded-2xl bg-cyan-400 px-5 py-4 text-center text-base font-semibold text-black transition hover:scale-[1.01]"
                      : "mt-8 block w-full rounded-2xl border border-white/10 px-5 py-4 text-center text-base font-semibold text-white transition hover:border-cyan-400/40 hover:text-cyan-300"
                  }
                >
                  {plano.cta}
                </a>

                {plano.destaque && (
                  <div className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                    Melhor custo-benefício
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <div className="grid gap-6 rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
                Chamada final
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Fale agora pelo WhatsApp e ative seu robô para Mini Índice.
              </h2>
              <p className="mt-4 max-w-2xl text-white/70">
                Atendimento direto para compra, ativação e orientações iniciais do seu acesso.
              </p>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl bg-cyan-400 px-6 py-4 text-center text-base font-semibold text-black md:w-auto"
              >
                Ir para o WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-5xl px-6 pb-24 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Dúvidas mais comuns
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faq.map((item) => (
              <div
                key={item.pergunta}
                className="rounded-[24px] border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold">{item.pergunta}</h3>
                <p className="mt-3 leading-7 text-white/65">{item.resposta}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}