import DailyEducationCard from "./DailyEducationCard";
import EconomicCalendarCard from "./EconomicCalendarCard";

export default function PremiumMarketHub() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#0b0d12] p-4 shadow-2xl shadow-black/30 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            Central do Trader
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Calendário, educação e expectativas do dia
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Uma área mais estratégica para acompanhar eventos econômicos,
            conteúdos importantes e pontos de atenção antes de operar.
          </p>
        </div>

        <div className="inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-200">
          Atualizado para operação diária
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <EconomicCalendarCard />
        <DailyEducationCard />
      </div>
    </section>
  );
}