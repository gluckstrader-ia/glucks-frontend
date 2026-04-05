import imagemIndicador from "../assets/imagem-indicador.jpg";

const WHATSAPP_LINK =
  "https://wa.me/5551994830003?text=Ol%C3%A1%21%20Quero%20comprar%20o%20Indicador%20Gluck%27s%20Trader%20IA%20de%201%20ano%20por%20R%24%20279%2C00.";

export default function LandingPageIndicador() {
  const beneficios = [
    {
      titulo: "Sinais claros de compra e venda",
      texto:
        "Tenha uma leitura visual objetiva para reduzir dúvidas e agir com mais confiança na hora da decisão.",
    },
    {
      titulo: "Compatível com Profit e BlackArrow",
      texto:
        "Use o indicador em plataformas já conhecidas no seu operacional, com instalação orientada e suporte inicial.",
    },
    {
      titulo: "Acesso anual com suporte",
      texto:
        "Tenha 12 meses de acesso ao indicador, com guia inicial de ativação e acompanhamento para começar corretamente.",
    },
  ];

  const etapas = [
    "Clique em comprar e fale conosco pelo WhatsApp.",
    "Receba o passo a passo para pagamento e ativação do acesso anual.",
    "Instale o indicador e comece a utilizar no Profit ou BlackArrow.",
  ];

  const faq = [
    {
      pergunta: "O indicador é compatível com quais plataformas?",
      resposta: "Atualmente, o indicador é compatível com Profit e BlackArrow.",
    },
    {
      pergunta: "Qual é o valor do acesso?",
      resposta: "O plano disponível é único: 1 ano de acesso por R$ 279,00.",
    },
    {
      pergunta: "Como funciona a compra?",
      resposta:
        "Ao clicar no botão de compra, o cliente é direcionado ao WhatsApp para receber atendimento, pagamento e instruções de ativação.",
    },
    {
      pergunta: "Recebo suporte para instalação?",
      resposta: "Sim. O acesso inclui suporte inicial para ativação e configuração do indicador.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-sm font-bold text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              GT
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Gluck&apos;s Trader IA</p>
              <p className="text-sm text-white/60">
                Indicador de compra e venda • Compatível com Profit e BlackArrow
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <a
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-emerald-400/40 hover:text-white"
              href="#beneficios"
            >
              Benefícios
            </a>
            <a
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-emerald-400/40 hover:text-white"
              href="#como-funciona"
            >
              Como funciona
            </a>
            <a
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-emerald-400/40 hover:text-white"
              href="#faq"
            >
              FAQ
            </a>
            <a
              className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_22%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="flex flex-col justify-center">
              <div className="mb-5 inline-flex w-fit items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                Plano único • 1 ano de acesso por R$ 279,00
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Tenha um <span className="text-emerald-300">indicador de compra e venda</span> pronto para usar no seu operacional.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                Desenvolvido para entregar uma leitura mais clara do mercado, com compatibilidade com Profit e BlackArrow, acesso anual e suporte inicial para ativação.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-emerald-400 px-6 py-4 text-center text-base font-semibold text-black transition hover:scale-[1.02]"
                >
                  Comprar pelo WhatsApp
                </a>
                <a
                  href="#beneficios"
                  className="rounded-2xl border border-white/10 px-6 py-4 text-center text-base font-medium text-white/80 transition hover:border-emerald-400/40 hover:text-white"
                >
                  Ver benefícios
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  ["Profit", "Compatível"],
                  ["BlackArrow", "Compatível"],
                  ["12 meses", "Acesso anual"],
                ].map(([titulo, subtitulo]) => (
                  <div
                    key={titulo}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xl font-semibold text-emerald-300">{titulo}</p>
                    <p className="mt-1 text-sm text-white/60">{subtitulo}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="group flex items-center justify-center">
              <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-emerald-400/20 bg-emerald-400/5 p-2 shadow-[0_0_70px_rgba(16,185,129,0.10)] transition duration-500 group-hover:border-emerald-300/40 group-hover:shadow-[0_0_95px_rgba(16,185,129,0.20)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-400/8 via-transparent to-cyan-400/10 opacity-80 transition duration-500 group-hover:opacity-100" />
                <img
                  src={imagemIndicador}
                  alt="Tela do indicador de trading em funcionamento em monitor e celular"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={1400}
                  height={1000}
                  className="relative z-10 aspect-[14/10] w-full rounded-[24px] object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute left-5 top-5 z-20 rounded-2xl border border-emerald-400/30 bg-black/60 px-4 py-2 text-sm text-emerald-300 backdrop-blur-md">
                  Sinais de compra e venda
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="beneficios" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-300/80">Benefícios</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Mais objetividade para operar com confiança.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {beneficios.map((item) => (
              <div
                key={item.titulo}
                className="rounded-[28px] border border-white/10 bg-white/5 p-7 shadow-[0_0_30px_rgba(255,255,255,0.03)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-emerald-400/30"
              >
                <div className="mb-5 h-11 w-11 rounded-2xl bg-emerald-400/10 ring-1 ring-emerald-400/20" />
                <h3 className="text-xl font-semibold">{item.titulo}</h3>
                <p className="mt-3 leading-7 text-white/65">{item.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">Como funciona</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Compre com atendimento direto pelo WhatsApp.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">
                A jornada foi simplificada para que o cliente fale com você, finalize a compra do acesso anual e receba a ativação sem complicação.
              </p>
            </div>

            <div className="space-y-4">
              {etapas.map((etapa, index) => (
                <div
                  key={etapa}
                  className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-black/50 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-base font-semibold text-black">
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
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-300/80">Oferta</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              1 ano de acesso por R$ 279,00
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/65">
              Plano único com acesso anual ao indicador, compatibilidade com Profit e BlackArrow e suporte inicial para ativação.
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-md rounded-[30px] border border-emerald-400/40 bg-emerald-400/10 p-8 shadow-[0_0_50px_rgba(16,185,129,0.16)]">
              <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Plano único
              </div>
              <h3 className="text-2xl font-semibold">Acesso Anual</h3>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">R$ 279</span>
                <span className="pb-1 text-white/55">/ano</span>
              </div>
              <p className="mt-4 leading-7 text-white/65">
                Acesso completo ao indicador por 12 meses com excelente custo-benefício.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/75">
                <li>• Compatível com Profit</li>
                <li>• Compatível com BlackArrow</li>
                <li>• 12 meses de acesso</li>
                <li>• Guia inicial de configuração</li>
                <li>• Suporte de ativação</li>
              </ul>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-8 block w-full rounded-2xl bg-emerald-400 px-5 py-4 text-center text-base font-semibold text-black transition hover:scale-[1.01]"
              >
                Comprar agora pelo WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <div className="grid gap-6 rounded-[32px] border border-white/10 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-300/80">Chamada final</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Fale agora pelo WhatsApp e garanta seu acesso anual.
              </h2>
              <p className="mt-4 max-w-2xl text-white/70">
                Atendimento direto para compra, ativação e orientações iniciais do seu indicador.
              </p>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-center text-base font-semibold text-black md:w-auto"
              >
                Ir para o WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-5xl px-6 pb-24 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300/80">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Dúvidas mais comuns</h2>
          </div>

          <div className="mt-10 space-y-4">
            {faq.map((item) => (
              <div key={item.pergunta} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
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
