import { buildChartPoints } from "./formatters";

export function IntradayPriceChart({
  values,
  times: _times,
  market: _market,
}: {
  values: number[];
  times: string[];
  market: "BR" | "US";
}) {
  const firstValue = values[0] ?? 0;
  const lastValue = values[values.length - 1] ?? firstValue;
  const rising = lastValue >= firstValue;

  const width = 760;
  const height = 190;
  const points = buildChartPoints(values, width, height, 10);
  const stroke = rising ? "#22d3ee" : "#ef4444";
  const fill = rising ? "rgba(34,211,238,0.14)" : "rgba(239,68,68,0.12)";
  const areaPoints = `10,${height - 10} ${points} ${width - 10},${height - 10}`;

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-black/40">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[190px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico intradiário"
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

      <div className="pointer-events-none absolute inset-x-3 bottom-2 flex justify-between text-[9px] font-semibold text-zinc-500">
        <span>09:00</span>
        <span>10:00</span>
        <span>11:00</span>
        <span>12:00</span>
        <span>13:00</span>
      </div>
    </div>
  );
}

type Domain = {
  min: number;
  max: number;
  range: number;
};

function safeSeries(values: number[]) {
  const clean = values.filter((value) => Number.isFinite(value));
  return clean.length > 0 ? clean : [0];
}

function normalizeFromFirst(values: number[]) {
  const clean = safeSeries(values);
  const first = clean[0] ?? 0;
  return clean.map((value) => value - first);
}

function buildDomain(series: number[][], includeZero = false): Domain {
  const all = series.flatMap((values) => safeSeries(values));
  let min = Math.min(...all);
  let max = Math.max(...all);

  if (includeZero) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
  }

  const rawRange = max - min;
  const padding = Math.max(rawRange * 0.1, 1);
  min -= padding;
  max += padding;

  return {
    min,
    max,
    range: Math.max(max - min, 1),
  };
}

function buildPoints(
  values: number[],
  width: number,
  height: number,
  domain: Domain,
  paddingX = 8,
  paddingY = 8,
) {
  const clean = safeSeries(values);

  return clean
    .map((value, index) => {
      const x =
        paddingX +
        (index / Math.max(clean.length - 1, 1)) * (width - paddingX * 2);
      const y =
        height -
        paddingY -
        ((value - domain.min) / domain.range) * (height - paddingY * 2);

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function valueToY(
  value: number,
  height: number,
  domain: Domain,
  paddingY = 8,
) {
  return (
    height -
    paddingY -
    ((value - domain.min) / domain.range) * (height - paddingY * 2)
  );
}

function formatSigned(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}`;
}

function GridLines({
  width,
  lines,
}: {
  width: number;
  lines: number[];
}) {
  return (
    <>
      {lines.map((y) => (
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
    </>
  );
}

export function FullContractFlowChart({
  buyer,
  seller,
  balance,
  times: _times,
}: {
  buyer: number[];
  seller: number[];
  balance: number[];
  times: string[];
}) {
  const width = 760;
  const flowHeight = 158;
  const balanceHeight = 104;

  // Comprador e vendedor passam a mostrar a variação desde o primeiro
  // ponto da janela. Os cartões continuam mostrando os totais reais.
  const buyerVariation = normalizeFromFirst(buyer);
  const sellerVariation = normalizeFromFirst(seller);
  const balanceSafe = safeSeries(balance);

  const flowDomain = buildDomain(
    [buyerVariation, sellerVariation],
    true,
  );
  const balanceDomain = buildDomain([balanceSafe]);

  const flowZeroY = valueToY(0, flowHeight, flowDomain);
  const firstBalance = balanceSafe[0] ?? 0;
  const balanceReferenceY = valueToY(
    firstBalance,
    balanceHeight,
    balanceDomain,
  );

  const buyerDelta = buyerVariation[buyerVariation.length - 1] ?? 0;
  const sellerDelta = sellerVariation[sellerVariation.length - 1] ?? 0;
  const currentBalance = balanceSafe[balanceSafe.length - 1] ?? 0;

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black/40">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
          <span className="text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500">
            Variação acumulada na janela
          </span>

          <div className="flex flex-wrap gap-3 font-mono text-[8px] font-black">
            <span className="text-emerald-400">
              Comprador {formatSigned(buyerDelta)}
            </span>
            <span className="text-red-400">
              Vendedor {formatSigned(sellerDelta)}
            </span>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${width} ${flowHeight}`}
          className="h-[158px] w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Variação da agressão compradora e vendedora"
        >
          <GridLines width={width} lines={[32, 64, 96, 128]} />

          <line
            x1="0"
            y1={flowZeroY}
            x2={width}
            y2={flowZeroY}
            stroke="rgba(161,161,170,0.30)"
            strokeDasharray="5 5"
          />

          <polyline
            points={buildPoints(
              buyerVariation,
              width,
              flowHeight,
              flowDomain,
            )}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <polyline
            points={buildPoints(
              sellerVariation,
              width,
              flowHeight,
              flowDomain,
            )}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex justify-between px-3 pb-2 text-[8px] font-semibold text-zinc-600">
          <span>Início da janela</span>
          <span>Agora</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-cyan-400/15 bg-black/40">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
          <span className="text-[8px] font-black uppercase tracking-[0.14em] text-zinc-500">
            Saldo do contrato cheio · escala própria
          </span>

          <span
            className={`font-mono text-[9px] font-black ${
              currentBalance >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            Atual {formatSigned(currentBalance)}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${width} ${balanceHeight}`}
          className="h-[104px] w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Evolução do saldo do contrato cheio"
        >
          <GridLines width={width} lines={[26, 52, 78]} />

          <line
            x1="0"
            y1={balanceReferenceY}
            x2={width}
            y2={balanceReferenceY}
            stroke="rgba(34,211,238,0.28)"
            strokeDasharray="5 5"
          />

          <polyline
            points={buildPoints(
              balanceSafe,
              width,
              balanceHeight,
              balanceDomain,
            )}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex justify-between px-3 pb-2 text-[8px] font-semibold text-zinc-600">
          <span>Referência {formatSigned(firstBalance)}</span>
          <span>Agora {formatSigned(currentBalance)}</span>
        </div>
      </div>
    </div>
  );
}
