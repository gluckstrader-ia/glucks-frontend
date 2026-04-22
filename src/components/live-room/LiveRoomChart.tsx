import { useEffect, useMemo, useRef } from "react";

type Props = {
  asset: string;
  timeframe?: string;
};

function mapToTradingViewSymbol(asset: string): string {
  const normalized = asset.toUpperCase();

  switch (normalized) {
    case "WIN":
      return "BMFBOVESPA:WIN1!";
    case "WDO":
      return "BMFBOVESPA:WDO1!";
    case "EURUSD":
      return "FX:EURUSD";
    case "XAUUSD":
      return "OANDA:XAUUSD";
    case "BTCUSD":
      return "BITSTAMP:BTCUSD";
    case "NASDAQ":
      return "NASDAQ:NDX";
    case "SPX":
      return "SP:SPX";
    default:
      return normalized;
  }
}

function mapInterval(timeframe: string): string {
  switch (timeframe) {
    case "1m":
      return "1";
    case "5m":
      return "5";
    case "15m":
      return "15";
    case "30m":
      return "30";
    case "1h":
      return "60";
    case "4h":
      return "240";
    case "1d":
      return "D";
    default:
      return "5";
  }
}

export default function LiveRoomChart({
  asset,
  timeframe = "5m",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const tvSymbol = useMemo(() => mapToTradingViewSymbol(asset), [asset]);
  const interval = useMemo(() => mapInterval(timeframe), [timeframe]);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval,
      timezone: "America/Sao_Paulo",
      theme: "dark",
      style: "1",
      locale: "br",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
      studies: [
        "Volume@tv-basicstudies",
        "VWAP@tv-basicstudies",
        "MASimple@tv-basicstudies",
      ],
      withdateranges: true,
      details: false,
      hotlist: false,
    });

    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container";
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";

    wrapper.appendChild(widgetContainer);
    wrapper.appendChild(script);
    containerRef.current.appendChild(wrapper);
  }, [tvSymbol, interval]);

  return (
    <div className="h-[560px] w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}