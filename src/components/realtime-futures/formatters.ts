export function formatFuturePrice(value: number, decimals = 0) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatFutureMoney(value: number) {
  const abs = Math.abs(value);
  const sign = value > 0 ? "+ " : value < 0 ? "- " : "";

  if (abs >= 1_000_000_000) {
    return `${sign}R$ ${(abs / 1_000_000_000).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    })} bi`;
  }

  if (abs >= 1_000_000) {
    return `${sign}R$ ${(abs / 1_000_000).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} mi`;
  }

  return `${sign}${new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(abs)}`;
}

export function buildChartPoints(
  values: number[],
  width: number,
  height: number,
  padding = 8,
) {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x =
        padding +
        (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((value - min) / range) * (height - padding * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function formatFutureQuantity(value: number) {
  const abs = Math.abs(value);
  const sign = value > 0 ? "+ " : value < 0 ? "- " : "";

  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    })} mi contratos`;
  }

  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} mil contratos`;
  }

  return `${sign}${Math.round(abs).toLocaleString("pt-BR")} contratos`;
}

export function formatFutureAggression(
  value: number,
  unit: "BRL" | "CONTRACTS" | "RAW" = "RAW",
) {
  if (unit === "BRL") return formatFutureMoney(value);
  if (unit === "CONTRACTS") return formatFutureQuantity(value);

  const sign = value > 0 ? "+ " : value < 0 ? "- " : "";
  return `${sign}${Math.abs(value).toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  })}`;
}
