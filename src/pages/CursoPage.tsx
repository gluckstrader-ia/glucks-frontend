export default function CursoPage() {
  const bonus = [
    "3 meses de Gluck's Trader IA",
    "3 meses de indicador",
    "3 meses de robô",
  ];

  const modules = [
    {
      title: "Fundamentos do mercado",
      subtitle: "Base sólida para começar com segurança",
      description:
        "Entenda o funcionamento do mercado, a lógica do day trade e os princípios que sustentam uma leitura mais profissional.",
      accent: "emerald",
    },
    {
      title: "Leitura gráfica",
      subtitle: "Contexto, estrutura e comportamento do preço",
      description:
        "Aprenda a enxergar o gráfico com mais clareza, identificar movimento, contexto e oportunidades com mais objetividade.",
      accent: "cyan",
    },
    {
      title: "Execução prática",
      subtitle: "Entradas, saídas e tomada de decisão",
      description:
        "Saiba como transformar conhecimento em execução, organizando raciocínio, timing e processo operacional.",
      accent: "yellow",
    },
    {
      title: "Gestão e disciplina",
      subtitle: "Consistência acima de impulso",
      description:
        "Desenvolva controle emocional, gestão de risco e uma mentalidade preparada para evoluir com constância.",
      accent: "mixed",
    },
  ];

  const benefits = [
    "Aulas gravadas organizadas em trilha progressiva",
    "Aulas individuais ao vivo com direcionamento",
    "Formação do zero ao avançado",
    "Método com visão prática de mercado",
    "Linguagem clara e acessível",
    "Experiência integrada ao ecossistema Gluck's Trader",
  ];

  const testimonials = [
    {
      title: "Mais clareza",
      text: "Eu finalmente entendi o que olhar no mercado. Antes eu assistia conteúdo, mas não conseguia aplicar. Aqui ficou claro e objetivo.",
    },
    {
      title: "Mais direção",
      text: "O curso me tirou da sensação de estar perdido. Hoje eu sei o que estudar, como praticar e como evoluir passo a passo.",
    },
    {
      title: "Mais confiança",
      text: "A mentoria trouxe estrutura. Parei de operar no impulso e comecei a enxergar o trade com muito mais consciência.",
    },
  ];

  const faq = [
    {
      q: "Preciso ter experiência para entrar?",
      a: "Não. A mentoria foi pensada para levar o aluno do zero ao avançado, com conteúdo progressivo e linguagem acessível.",
    },
    {
      q: "Como funcionam as aulas?",
      a: "Você terá acesso a aulas gravadas organizadas em trilha e também a aulas individuais ao vivo para direcionamento.",
    },
    {
      q: "Essa mentoria serve só para iniciantes?",
      a: "Não. Ela atende desde quem está começando até quem já teve contato com o mercado, mas sente falta de método e clareza.",
    },
    {
      q: "Como será a compra?",
      a: "O botão final pode ser conectado ao checkout ou ao WhatsApp, de acordo com o fluxo que você decidir usar no site.",
    },
  ];

  function accentClass(accent: string) {
    if (accent === "emerald") {
      return "border-emerald-400/20 bg-emerald-500/10";
    }
    if (accent === "cyan") {
      return "border-cyan-400/20 bg-cyan-500/10";
    }
    if (accent === "yellow") {
      return "border-yellow-400/20 bg-yellow-500/10";
    }
    return "border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(34,211,238,0.10),rgba(234,179,8,0.10))]";
  }

  return (
    <div className="min-h-screen bg-[#02050a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#02050a]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.28),rgba(34,211,238,0.22),rgba(234,179,8,0.25))] p-[1px] shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#071018] text-sm font-black">
                GT
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold tracking-wide">
                Gluck&apos;s Trader
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Mentoria
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
            <a href="#estrutura" className="transition hover:text-white">
              Estrutura
            </a>
            <a href="#trilha" className="transition hover:text-white">
              Trilha
            </a>
            <a href="#mentor" className="transition hover:text-white">
              Mentor
            </a>
            <a href="#oferta" className="transition hover:text-white">
              Oferta
            </a>
          </nav>

          <a
            href="#oferta"
            className="rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-[0_12px_34px_rgba(34,211,238,0.18)] transition hover:scale-[1.02]"
          >
            Quero aprender
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0d1824_0%,#071018_30%,#03070c_68%,#02050a_100%)]" />
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-8 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute right-[-20px] top-[-10px] h-[30rem] w-[30rem] rounded-full bg-cyan-400/16 blur-3xl" />
          <div className="absolute bottom-[-60px] left-1/3 h-80 w-80 rounded-full bg-yellow-500/14 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,5,10,0.15),rgba(2,5,10,0.78))]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.14)]">
                Mentoria acessível • experiência premium • evolução do zero ao avançado
              </div>

              <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[0.98] sm:text-5xl lg:text-7xl">
                Aprenda day trade com uma mentoria estruturada e uma
                <span className="mt-3 block bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                  experiência premium feita para ensinar com clareza
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                A Mentoria Gluck&apos;s Trader foi criada para quem quer aprender do jeito certo:
                com conteúdo progressivo, linguagem clara, acompanhamento e uma estrutura moderna
                que valoriza a experiência do aluno do início ao fim.
                <span className="font-semibold text-white">
                  {" "}
                  Do zero ao avançado, com método e direção.
                </span>
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#trilha"
                  className="rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-400 px-7 py-4 text-sm font-black text-black shadow-[0_16px_40px_rgba(34,211,238,0.18)] transition hover:scale-[1.02]"
                >
                  Conhecer a mentoria
                </a>

                <a
                  href="#mentor"
                  className="rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
                >
                  Conhecer o mentor
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
                  <div className="text-sm text-zinc-400">Formato</div>
                  <div className="mt-2 text-lg font-semibold">
                    Aulas gravadas + ao vivo
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
                  <div className="text-sm text-zinc-400">Nível</div>
                  <div className="mt-2 text-lg font-semibold">
                    Do zero ao avançado
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
                  <div className="text-sm text-zinc-400">Proposta</div>
                  <div className="mt-2 text-lg font-semibold">
                    Aprender com clareza
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.2rem] bg-gradient-to-r from-emerald-500/14 via-cyan-500/16 to-yellow-500/14 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] shadow-[0_35px_100px_rgba(0,0,0,0.46)] backdrop-blur-2xl">
                <div className="aspect-[4/5] w-full bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_26%),linear-gradient(135deg,rgba(16,185,129,0.16),rgba(7,16,24,0.94)_35%,rgba(234,179,8,0.15))] p-6">
                  <div className="flex h-full flex-col justify-between rounded-[1.7rem] border border-white/10 bg-black/30 p-5">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-zinc-300">
                        Visual principal
                      </div>

                      <div className="flex gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="h-56 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-inner" />

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-300">
                            Imagem real
                          </div>
                          <div className="mt-2 text-lg font-bold">Mentor</div>
                        </div>

                        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/10 p-4">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                            Arte IA
                          </div>
                          <div className="mt-2 text-lg font-bold">Atmosfera</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-yellow-400/15 bg-yellow-500/10 p-4">
                      <div className="text-sm font-semibold text-yellow-300">
                        Direção visual final
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-200">
                        Mistura de imagem do mentor com elementos cinematográficos,
                        glow, profundidade e linguagem visual inspirada em plataformas premium.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="estrutura" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 backdrop-blur-xl lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Estrutura premium
              </div>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Uma mentoria com apresentação forte, linguagem acessível e visual de curso premium
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                A proposta desta página é mostrar valor antes da oferta final,
                conduzindo o visitante por uma jornada visual mais rica, com seções amplas,
                narrativa clara e uma percepção de qualidade muito mais alta.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-emerald-400/20 bg-emerald-500/10 p-5">
                <div className="text-sm font-semibold text-emerald-300">Atração</div>
                <p className="mt-2 text-sm leading-6 text-zinc-100">
                  Hero forte com imagem, profundidade e posicionamento.
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-cyan-400/20 bg-cyan-500/10 p-5">
                <div className="text-sm font-semibold text-cyan-300">Engajamento</div>
                <p className="mt-2 text-sm leading-6 text-zinc-100">
                  Trilha visual, seções amplas e copy que mantém interesse.
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-yellow-400/20 bg-yellow-500/10 p-5">
                <div className="text-sm font-semibold text-yellow-300">Conversão</div>
                <p className="mt-2 text-sm leading-6 text-zinc-100">
                  Oferta final mais forte, com benefícios e bônus em destaque.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trilha" className="mx-auto max-w-7xl px-6 py-6 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">
              Trilha da mentoria
            </div>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Uma trilha de aprendizagem organizada para gerar clareza e evolução
            </h2>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            Estilo streaming • cards maiores • mais valor percebido
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((item) => (
            <div
              key={item.title}
              className={`group overflow-hidden rounded-[1.9rem] border p-6 transition duration-300 hover:-translate-y-1 ${accentClass(
                item.accent
              )}`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-lg font-black text-white shadow-inner">
                  ▶
                </div>

                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-zinc-300">
                  Módulo
                </div>
              </div>

              <h3 className="text-xl font-bold">{item.title}</h3>
              <div className="mt-2 text-sm font-medium text-zinc-200">
                {item.subtitle}
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                {item.description}
              </p>

              <div className="mt-8 h-28 rounded-[1.2rem] border border-white/10 bg-black/15" />

              <div className="mt-6 text-xs uppercase tracking-[0.24em] text-zinc-400 transition group-hover:text-white">
                Visual tipo catálogo premium
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="mentor" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(7,16,24,0.96)_38%,rgba(234,179,8,0.16))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
            <div className="aspect-[4/5] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(0,0,0,0.22))]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%)]" />
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-300">
              Mentor em destaque
            </div>

            <h2 className="mt-3 text-3xl font-black sm:text-5xl">Alan Selle</h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
              Alan Selle conduz a mentoria com uma proposta clara:
              transformar conhecimento em aprendizado aplicável.
              Nesta seção, a ideia é apresentar sua trajetória, sua visão de mercado
              e a forma como ele orienta os alunos com proximidade, clareza e método.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400">
              O ideal aqui é usar uma foto real forte, acompanhada de uma narrativa
              objetiva sobre trajetória, experiência prática e visão de ensino,
              reforçando autoridade sem perder proximidade.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-emerald-400/15 bg-emerald-500/10 p-5">
                <div className="text-sm font-semibold text-emerald-300">
                  Proximidade
                </div>
                <div className="mt-2 text-sm leading-6 text-zinc-300">
                  Conexão com quem quer aprender do jeito certo.
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-cyan-400/15 bg-cyan-500/10 p-5">
                <div className="text-sm font-semibold text-cyan-300">Método</div>
                <div className="mt-2 text-sm leading-6 text-zinc-300">
                  Ensino com direção, sequência e aplicação prática.
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-yellow-400/15 bg-yellow-500/10 p-5">
                <div className="text-sm font-semibold text-yellow-300">
                  Credibilidade
                </div>
                <div className="mt-2 text-sm leading-6 text-zinc-300">
                  Uma história real que sustenta a proposta da mentoria.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 backdrop-blur-xl lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Como o aluno avança
              </div>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Uma jornada pensada para manter clareza, ritmo e vontade de evoluir
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                Aqui mostramos que o aluno não recebe apenas aulas. Ele entra em uma
                jornada organizada, com conteúdo progressivo, direcionamento e uma
                experiência mais clara para aprender com consistência.
              </p>
            </div>

            <div className="grid gap-4">
              {benefits.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                        index % 3 === 0
                          ? "bg-emerald-500/15 text-emerald-300"
                          : index % 3 === 1
                          ? "bg-cyan-500/15 text-cyan-300"
                          : "bg-yellow-500/15 text-yellow-300"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <p className="text-sm leading-7 text-zinc-200">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-300">
              Prova social
            </div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Resultados e percepções dos alunos
            </h2>
          </div>

          <div className="text-sm text-zinc-400">
            Substitua esta área por depoimentos reais, prints e nomes autorizados para aumentar a conversão.
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={item.text}
              className={`rounded-[1.9rem] border p-6 ${
                index === 0
                  ? "border-emerald-400/20 bg-emerald-500/10"
                  : index === 1
                  ? "border-cyan-400/20 bg-cyan-500/10"
                  : "border-yellow-400/20 bg-yellow-500/10"
              }`}
            >
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
                {item.title}
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-100">
                “{item.text}”
              </p>

              <div className="mt-6 text-xs uppercase tracking-[0.24em] text-white/60">
                Aluno Gluck&apos;s Trader
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 backdrop-blur-xl lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Quebra de objeção
              </div>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                As principais dúvidas respondidas antes da decisão final
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                Esta seção reduz objeções e ajuda o visitante a entender com mais
                segurança se a mentoria faz sentido para o momento dele.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm font-semibold text-white">
                  “Nunca operei. Isso é para mim?”
                </div>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  Sim. A proposta foi construída para começar do zero e evoluir em sequência lógica.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm font-semibold text-white">
                  “Já tentei aprender antes e me perdi.”
                </div>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  Aqui a jornada é organizada. O aluno sabe o que ver, o que praticar e como avançar.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm font-semibold text-white">
                  “Tenho medo de não conseguir aplicar.”
                </div>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  Por isso entram as aulas ao vivo e a visão prática, que aproximam o conteúdo da realidade do aluno.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="oferta" className="border-t border-white/10 bg-[#04070b] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-300">
              Oferta final
            </div>

            <h2 className="mt-3 text-4xl font-black sm:text-6xl">
              Mentoria Gluck&apos;s Trader
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-zinc-300">
              Depois de apresentar método, estrutura e proposta da mentoria,
              chegamos ao fechamento com uma oferta clara, organizada e mais forte para conversão.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-bold">O que está incluso</h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-emerald-400/15 bg-emerald-500/10 p-5">
                  <div className="font-semibold text-emerald-300">
                    Formação completa
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Do zero ao avançado com progressão clara.
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-cyan-400/15 bg-cyan-500/10 p-5">
                  <div className="font-semibold text-cyan-300">
                    Aulas gravadas
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Conteúdo organizado para assistir no seu ritmo.
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-yellow-400/15 bg-yellow-500/10 p-5">
                  <div className="font-semibold text-yellow-300">
                    Aulas ao vivo
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Direcionamento individual para acelerar evolução.
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                  <div className="font-semibold text-white">
                    Método Gluck&apos;s Trader
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Clareza, estrutura e visão prática de mercado.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-yellow-500/10 blur-xl" />
              <div className="relative rounded-[2rem] border border-yellow-400/20 bg-[linear-gradient(180deg,rgba(234,179,8,0.13),rgba(255,255,255,0.03))] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">
                  Investimento
                </div>

                <div className="mt-3 text-5xl font-black">R$ 2.900,00</div>

                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  Uma mentoria completa com aulas gravadas, aulas individuais ao vivo
                  e bônus que ampliam a experiência do aluno dentro do ecossistema
                  Gluck&apos;s Trader.
                </p>

                <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-black/25 p-5">
                  <div className="text-sm font-semibold text-white">
                    Bônus inclusos
                  </div>

                  <div className="mt-4 space-y-3">
                    {bonus.map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                          index === 0
                            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                            : index === 1
                            ? "border-cyan-400/20 bg-cyan-500/10 text-cyan-200"
                            : "border-yellow-400/20 bg-yellow-500/10 text-yellow-200"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#"
                  className="mt-7 block w-full rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-400 py-4 text-center text-sm font-black text-black transition hover:scale-[1.02]"
                >
                  Comprar agora
                </a>

                <div className="mt-3 text-center text-xs text-zinc-500">
                  Conecte este botão ao checkout ou ao WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="mb-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            FAQ
          </div>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Perguntas frequentes sobre a mentoria
          </h2>
        </div>

        <div className="grid gap-4">
          {faq.map((item) => (
            <div
              key={item.q}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="text-base font-semibold text-white">{item.q}</div>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <a
        href="#"
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-3 text-sm font-bold text-black shadow-[0_18px_40px_rgba(16,185,129,0.28)] transition hover:scale-[1.03]"
      >
        WhatsApp
      </a>
    </div>
  );
}