import { buildChartPoints } from "./formatters";

type MarketCode = "BR" | "US";

function normalizeClock(value?: string | null): string {
  if (!value) return "";

  const match = String(value).match(/(\d{1,2}):(\d{2})/);
  if (!match) return "";

  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function alignedTimes(times: string[], valueCount: number): string[] {
  if (valueCount <= 0) return [];

  const sliced = times.slice(-valueCount).map(normalizeClock);
  if (sliced.length >= valueCount) return sliced;

  return [...Array(valueCount - sliced.length).fill(""), ...sliced];
}

function buildTimeLabels(
  times: string[],
  valueCount: number,
  labelCount = 5,
): string[] {
  const aligned = alignedTimes(times, valueCount);
  if (aligned.length === 0) return Array(labelCount).fill("—");

  const indices = Array.from({ length: labelCount }, (_, index) =>
    Math.round((index / Math.max(labelCount - 1, 1)) * (aligned.length - 1)),
  );

  return indices.map((position) => {
    if (aligned[position]) return aligned[position];

    for (let distance = 1; distance < aligned.length; distance += 1) {
      const left = position - distance;
      const right = position + distance;
      if (left >= 0 && aligned[left]) return aligned[left];
      if (right < aligned.length && aligned[right]) return aligned[right];
    }

    return "—";
  });
}

function timeRangeLabel(times: string[], valueCount: number): string {
  const valid = alignedTimes(times, valueCount).filter(Boolean);
  if (valid.length === 0) return "horários aguardando dados";
  if (valid.length === 1) return `atualizado às ${valid[0]}`;
  return `${valid[0]}–${valid[valid.length - 1]}`;
}

function TimeAxis({ labels }: { labels: string[] }) {
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-2 flex justify-between font-mono text-[9px] font-semibold text-zinc-500">
      {labels.map((label, index) => (
        <span key={`${label}-${index}`}>{label}</span>
      ))}
    </div>
  );
}

export function IntradayPriceChart({
  values,
  times,
  market,
}: {
  values: number[];
  times: string[];
  market: MarketCode;
}) {
  const width = 760;
  const height = 190;
  const safeValues = values.length > 0 ? values : [0, 0];
  const points = buildChartPoints(safeValues, width, height, 10);
  const isBrazil = market === "BR";
  const stroke = isBrazil ? "#facc15" : "#38bdf8";
  const fill = isBrazil
    ? "rgba(250,204,21,0.12)"
    : "rgba(56,189,248,0.13)";
  const areaPoints = `10,${height - 10} ${points} ${width - 10},${height - 10}`;
  const labels = buildTimeLabels(times, values.length);
  const range = timeRangeLabel(times, values.length);

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-800 bg-black/40">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-3 py-2">
        <div className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
          Preço intradiário
        </div>
        <div className="font-mono text-[9px] font-semibold text-zinc-600">
          {range}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[190px] w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Gráfico intradiário de preço entre ${range}`}
        >
          {[38, 76, 114, 152].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="rgba(161,161,170,0.10)"
              strokeWidth="1"
            />
          ))}

          <polygon points={areaPoints} fill={fill} />
          <polyline
            points={points}
            fill="none"
            stroke={stroke}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        <TimeAxis labels={labels} />
      </div>
    </section>
  );
}

export function FullContractFlowChart({
  buyer,
  seller,
  balance,
  times,
}: {
  buyer: number[];
  seller: number[];
  balance: number[];
  times: string[];
}) {
  const width = 760;
  const height = 205;
  const all = [...buyer, ...seller, ...balance];
  const safeAll = all.length > 0 ? all : [0, 1];
  const min = Math.min(...safeAll);
  const max = Math.max(...safeAll);
  const range = Math.max(max - min, 1);
  const valueCount = Math.max(buyer.length, seller.length, balance.length);
  const labels = buildTimeLabels(times, valueCount);

  const buildSharedPoints = (values: number[]) => {
    const safeValues = values.length > 0 ? values : [0, 0];
    return safeValues
      .map((value, index) => {
        const x = 8 + (index / Math.max(safeValues.length - 1, 1)) * (width - 16);
        const y = height - 8 - ((value - min) / range) * (height - 16);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  };

  const zeroY = height - 8 - ((0 - min) / range) * (height - 16);

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-black/40">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[205px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Fluxo acumulado com horários reais"
      >
        {[41, 82, 123, 164].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="rgba(161,161,170,0.08)"
            strokeWidth="1"
          />
        ))}

        <line
          x1="0"
          y1={zeroY}
          x2={width}
          y2={zeroY}
          stroke="rgba(161,161,170,0.28)"
          strokeDasharray="5 5"
        />

        <polyline
          points={buildSharedPoints(buyer)}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={buildSharedPoints(seller)}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={buildSharedPoints(balance)}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <TimeAxis labels={labels} />
    </div>
  );
}
