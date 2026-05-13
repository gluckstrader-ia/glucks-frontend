import { CalendarDays, ExternalLink, Globe2 } from "lucide-react";

export default function EconomicCalendarCard() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-[#080b12]/90 shadow-2xl shadow-cyan-500/10">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
            <CalendarDays className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-black text-white">
              Calendário Econômico
            </h2>
            <p className="text-sm text-zinc-400">
              Eventos macroeconômicos que podem impactar o mercado hoje.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
          <Globe2 className="h-3.5 w-3.5" />
          Fonte externa
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          <iframe
            title="Calendário Econômico Investing"
            src="https://sslecal2.investing.com?ecoDayBackground=%23080b12&defaultFont=%23d4d4d8&innerBorderColor=%2327272a&borderColor=%2327272a&ecoDayFontColor=%23ffffff&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone,timeselector,filters&countries=5,32,37,72,22,17,39,14,48,10,35,6,43,21,38,12,4,36,110,11,26,25,178,9,30,33,23,34,92,102,57,94,204,97,68,96,103,111,42,109,188,7,105,172,20,60,87,44,193,89,45,125,145,53,61,55,59,95,85,54,58,63&calType=week&timeZone=12&lang=12"
            className="h-[560px] w-full border-0"
            loading="lazy"
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            O calendário é fornecido por widget externo. Caso não carregue,
            verifique bloqueadores de anúncio ou instabilidade do provedor.
          </span>

          <a
            href="https://br.investing.com/economic-calendar/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            Abrir calendário
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}