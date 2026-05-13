import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  PlayCircle,
  Target,
  TrendingUp,
} from "lucide-react";

type VideoItem = {
  title: string;
  description: string;
  duration: string;
  url: string;
};

const videos: VideoItem[] = [
  {
    title: "Como interpretar o Sinal Final da IA",
    description: "Entenda confiança, direção, entrada, stop e alvos.",
    duration: "8 min",
    url: "https://www.youtube.com/@gluckstraderia",
  },
  {
    title: "Gestão de risco antes da entrada",
    description: "Como validar uma operação sem aumentar exposição.",
    duration: "11 min",
    url: "https://www.youtube.com/@gluckstraderia",
  },
  {
    title: "Como usar calendário econômico no day trade",
    description: "Aprenda quais eventos evitar e quais monitorar.",
    duration: "9 min",
    url: "https://www.youtube.com/@gluckstraderia",
  },
];

const expectations = [
  "Monitorar eventos de alto impacto antes de qualquer entrada.",
  "Evitar operar no impulso após notícias fortes.",
  "Priorizar operações com confluência entre tendência, região e gestão.",
  "Aguardar confirmação do preço antes de aumentar agressividade.",
];

export default function DailyEducationCard() {
  return (
    <aside className="grid gap-5">
      <section className="rounded-[1.75rem] border border-emerald-400/20 bg-[#080b12]/90 p-5 shadow-2xl shadow-emerald-500/10">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
            <PlayCircle className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-black text-white">
              Vídeos Educacionais
            </h2>
            <p className="text-sm text-zinc-400">
              Conteúdos rápidos para melhorar sua leitura operacional.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {videos.map((video, index) => (
            <a
              key={video.title}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.05]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/60 text-sm font-black text-emerald-300">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="font-bold leading-snug text-white group-hover:text-emerald-200">
                      {video.title}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-zinc-400">
                      {video.description}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      {video.duration}
                    </div>
                  </div>
                </div>

                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-cyan-400/20 bg-[#080b12]/90 p-5 shadow-2xl shadow-cyan-500/10">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
            <Target className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-black text-white">
              Expectativas do Dia
            </h2>
            <p className="text-sm text-zinc-400">
              Pontos de atenção para operar com mais clareza.
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <TrendingUp className="mb-3 h-5 w-5 text-cyan-300" />
            <p className="text-xs text-zinc-500">Viés</p>
            <p className="mt-1 font-black text-white">Aguardar confirmação</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <Flame className="mb-3 h-5 w-5 text-amber-300" />
            <p className="text-xs text-zinc-500">Risco</p>
            <p className="mt-1 font-black text-white">Atenção a notícias</p>
          </div>
        </div>

        <div className="space-y-3">
          {expectations.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
              <p className="text-sm leading-6 text-zinc-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-white/[0.03] to-emerald-500/10 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white/10 p-3 text-cyan-300">
            <Brain className="h-6 w-6" />
          </div>

          <div>
            <h2 className="font-black text-white">Dica Gluck&apos;s IA</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Antes de operar, combine calendário econômico, tendência do ativo,
              região de preço e gestão de risco. A melhor entrada não é a mais
              rápida, é a mais bem confirmada.
            </p>

            <a
              href="https://www.youtube.com/@gluckstraderia"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400/20"
            >
              <BookOpen className="h-4 w-4" />
              Ver conteúdos
            </a>
          </div>
        </div>
      </section>
    </aside>
  );
}