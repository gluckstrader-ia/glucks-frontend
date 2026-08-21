import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  BrainCircuit,
  BarChart3,
  CalendarDays,
  PlayCircle,
  X,
  Target,
  Clock,
  Brain,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { clearAuth, getStoredToken, getStoredUser } from "../lib/auth";
import { useB3MarketData } from "../hooks/useB3MarketData";
import QuantDashboardCard from "../components/dashboard/QuantDashboardCard";
import { useQuantDashboard } from "../hooks/useQuantDashboard";
import FloatingCommunityChat from "../components/community/FloatingCommunityChat";
import RealtimeFuturesDashboard from "../components/realtime-futures";

type AnalysisModules = {
  technical?: number;
  smc?: number;
  harmonic?: number;
  wegd?: number;
  probabilistic?: number;
  timing?: number;
};

type AnalysisData = {
  asset?: string;
  asset_type?: string;
  timeframe?: string;
  direction?: string;
  score?: number;
  confidence?: number;
  entry?: number;
  stop?: number;
  target?: number;
  risk_reward?: number;
  modules?: AnalysisModules;

  technical?: {
    score?: number;
    buy_signals?: number;
    sell_signals?: number;
    neutral_signals?: number;
    trend_bias?: string;
    ema_trend?: string;
    rsi?: number;
    ema9?: number;
    ema21?: number;
    supports?: number[];
    resistances?: number[];

    moving_averages?: {
      name?: string;
      simple?: number | null;
      simple_action?: string;
      exponential?: number | null;
      exponential_action?: string;
    }[];

    technical_indicators?: {
      name?: string;
      value?: number | null;
      action?: string;
    }[];
  };

  harmonics?: {
    patterns?: {
      name?: string;
      direction?: string;
      confidence?: number;
      bullish?: boolean;
      icon?: string;
      ratios?: {
        key?: string;
        value?: string;
        expected?: string;
        ok?: boolean;
      }[];
      prz?: number[];
      targets?: number[];
      stop?: number;
    }[];
    fib_levels?: {
      level?: string;
      price?: number;
      type?: string;
    }[];
  };

  smc?: {
    bias?: string;
    structure_label?: string;
    last_bos?: number;
    context?: {
      candles?: number;
      bias?: string;
    };
    structure?: {
      candles?: number;
      bias?: string;
    };
    trigger?: {
      candles?: number;
      bias?: string;
    };
    divergence?: string;
    order_blocks?: {
      title?: string;
      price?: string;
      desc?: string;
      strength?: string;
      bullish?: boolean;
    }[];
    fvgs?: {
      title?: string;
      zone?: string;
      state?: string;
      bullish?: boolean;
    }[];
    liquidity?: {
      price?: number;
      desc?: string;
      tag?: string;
    }[];
    structure_breaks?: {
      title?: string;
      price?: number;
      desc?: string;
      bullish?: boolean;
    }[];
    summary?: string;
  };

  wegd?: {
    bias?: string;
    confluence?: string;
    summary?: string;
    wyckoff?: {
      phase?: string;
      progress?: number;
      confidence?: number;
      next_phase?: string;
      composite_man?: string;
      events_confirmed?: {
        name?: string;
        desc?: string;
        price?: number;
      }[];
      events_pending?: {
        name?: string;
        desc?: string;
        price?: number;
      }[];
      volume_state?: string;
      volume_label?: string;
    };
    elliott?: {
      current_wave?: string;
      mode?: string;
      progress?: number;
      confidence?: number;
      next_wave?: string;
      invalidation?: number;
      wave_points?: {
        label?: string;
        price?: number;
        type?: string;
      }[];
    };
    gann?: {
      dominant_angle?: string;
      support_angles?: {
        angle?: string;
        price?: number;
      }[];
      resistance_angles?: {
        angle?: string;
        price?: number;
      }[];
      current_cycle_days?: number;
      next_reversal?: string;
      days_in_cycle?: number;
      price_square_levels?: {
        price?: number;
        strength?: string;
      }[];
    };
    dow?: {
      primary?: string;
      secondary?: string;
      minor?: string;
      market_phase?: string;
      market_phase_score?: number;
      price_volume_confirmation?: string;
      indices_confirmation?: string;
      volume_note?: string;
    };
  };

  probabilistic?: {
    win_rate_general?: number;
    win_rate_long?: number;
    win_rate_short?: number;
    historical?: {
      periods?: number;
      return_pct?: number;
      volatility_pct?: number;
      sharpe?: number;
      max_drawdown_pct?: number;
    };
    monte_carlo?: {
      confidence_level?: number;
      low?: number;
      mid?: number;
      high?: number;
    };
    scenarios?: {
      bullish?: number;
      neutral?: number;
      bearish?: number;
    };
    seasonality?: {
      month?: string;
      value?: number;
    }[];
    risk_metrics?: {
      var_95?: number;
      expected_shortfall?: number;
      beta?: number;
      correlation?: number;
    };
  };

  timing?: {
    market_name?: string;
    timezone?: string;
    status?: string;
    best_window_label?: string;
    notes?: string;
    recommended_windows?: {
      start?: string;
      end?: string;
      reason?: string;
    }[];
    avoid_windows?: {
      start?: string;
      end?: string;
      reason?: string;
    }[];
  };

  scenarios?: {
    buy?: {
      probability?: number;
      entry_trigger?: number;
      entry_reason?: string;
      stop?: number;
      targets?: {
        label?: string;
        price?: number;
        probability?: number;
        rr?: string;
      }[];
    };
    sell?: {
      probability?: number;
      entry_trigger?: number;
      entry_reason?: string;
      stop?: number;
      targets?: {
        label?: string;
        price?: number;
        probability?: number;
        rr?: string;
      }[];
    };
  };

  final_signal?: {
    direction?: string;
    strength?: string;
    confidence?: number;
    entry?: number;
    stop?: number;
    target?: number;
    risk_reward?: number;
    confluence_score?: number;
    justification?: string[];
    verdict?: string;
  };
};

type AssetCategoryLabel =
  | "Índices"
  | "Ações"
  | "Forex"
  | "Crypto"
  | "B3"
  | "Commodities"
  | "Futuros BR"
  | "Futuros US";

type AssetOption = {
  label: string;
  value: string;
  apiType:
    | "index"
    | "stock"
    | "forex"
    | "crypto"
    | "b3"
    | "commodity"
    | "future_br"
    | "future_us";
  tvSymbol?: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_URL_FUTUROS_BR =
  import.meta.env.VITE_API_URL_FUTUROS_BR || API_URL;

const AI_LOADING_STEPS = [
  "Lendo estrutura do mercado...",
  "Mapeando fluxo e liquidez...",
  "Calculando confluências técnicas...",
  "Validando tendência e timing...",
  "Refinando o sinal final da IA...",
];

const ASSET_OPTIONS: Record<AssetCategoryLabel, AssetOption[]> = {
  Índices: [
    { label: "S&P 500", value: "SPX", apiType: "index", tvSymbol: "SP:SPX" },
    { label: "Ibovespa", value: "IBOV", apiType: "index", tvSymbol: "INDEX:IBOV" },
    { label: "NASDAQ 100", value: "NDX", apiType: "index", tvSymbol: "FOREXCOM:NAS100" },
    { label: "NASDAQ Composite", value: "NASDAQ", apiType: "index", tvSymbol: "NASDAQ:IXIC" },
    { label: "Dow Jones", value: "DJI", apiType: "index", tvSymbol: "DJ:DJI" },
    { label: "DAX", value: "DAX", apiType: "index", tvSymbol: "XETR:DAX" },
    { label: "Nikkei 225", value: "JP225", apiType: "index", tvSymbol: "INDEX:NKY" },
    { label: "VIX", value: "VIX", apiType: "index", tvSymbol: "CBOE:VIX" },
  ],

  Ações: [
    { label: "Apple", value: "AAPL", apiType: "stock", tvSymbol: "NASDAQ:AAPL" },
    { label: "Microsoft", value: "MSFT", apiType: "stock", tvSymbol: "NASDAQ:MSFT" },
    { label: "Google", value: "GOOGL", apiType: "stock", tvSymbol: "NASDAQ:GOOGL" },
    { label: "Amazon", value: "AMZN", apiType: "stock", tvSymbol: "NASDAQ:AMZN" },
    { label: "Tesla", value: "TSLA", apiType: "stock", tvSymbol: "NASDAQ:TSLA" },
    { label: "NVIDIA", value: "NVDA", apiType: "stock", tvSymbol: "NASDAQ:NVDA" },
    { label: "Meta", value: "META", apiType: "stock", tvSymbol: "NASDAQ:META" },
    { label: "Netflix", value: "NFLX", apiType: "stock", tvSymbol: "NASDAQ:NFLX" },
    { label: "AMD", value: "AMD", apiType: "stock", tvSymbol: "NASDAQ:AMD" },
    { label: "Intel", value: "INTC", apiType: "stock", tvSymbol: "NASDAQ:INTC" },
    { label: "Disney", value: "DIS", apiType: "stock", tvSymbol: "NYSE:DIS" },
    { label: "PayPal", value: "PYPL", apiType: "stock", tvSymbol: "NASDAQ:PYPL" },
    { label: "Uber", value: "UBER", apiType: "stock", tvSymbol: "NYSE:UBER" },
    { label: "Salesforce", value: "CRM", apiType: "stock", tvSymbol: "NYSE:CRM" },
    { label: "Oracle", value: "ORCL", apiType: "stock", tvSymbol: "NYSE:ORCL" },
    { label: "Coinbase", value: "COIN", apiType: "stock", tvSymbol: "NASDAQ:COIN" },
    { label: "Block (Square)", value: "SQ", apiType: "stock", tvSymbol: "NYSE:SQ" },
    { label: "Palantir", value: "PLTR", apiType: "stock", tvSymbol: "NASDAQ:PLTR" },
    { label: "Snap", value: "SNAP", apiType: "stock", tvSymbol: "NYSE:SNAP" },
    { label: "Shopify", value: "SHOP", apiType: "stock", tvSymbol: "NYSE:SHOP" },
    { label: "Spotify", value: "SPOT", apiType: "stock", tvSymbol: "NYSE:SPOT" },
    { label: "Boeing", value: "BA", apiType: "stock", tvSymbol: "NYSE:BA" },
    { label: "JPMorgan", value: "JPM", apiType: "stock", tvSymbol: "NYSE:JPM" },
    { label: "Visa", value: "V", apiType: "stock", tvSymbol: "NYSE:V" },
    { label: "Mastercard", value: "MA", apiType: "stock", tvSymbol: "NYSE:MA" },
    { label: "Walmart", value: "WMT", apiType: "stock", tvSymbol: "NYSE:WMT" },
    { label: "Coca-Cola", value: "KO", apiType: "stock", tvSymbol: "NYSE:KO" },
    { label: "PepsiCo", value: "PEP", apiType: "stock", tvSymbol: "NASDAQ:PEP" },
    { label: "Johnson & Johnson", value: "JNJ", apiType: "stock", tvSymbol: "NYSE:JNJ" },
    { label: "Pfizer", value: "PFE", apiType: "stock", tvSymbol: "NYSE:PFE" },
    { label: "Exxon Mobil", value: "XOM", apiType: "stock", tvSymbol: "NYSE:XOM" },
    { label: "Airbnb", value: "ABNB", apiType: "stock", tvSymbol: "NASDAQ:ABNB" },
    { label: "Roblox", value: "RBLX", apiType: "stock", tvSymbol: "NYSE:RBLX" },
  ],

  Forex: [
    { label: "EUR/USD", value: "EURUSD", apiType: "forex", tvSymbol: "FX:EURUSD" },
    { label: "GBP/USD", value: "GBPUSD", apiType: "forex", tvSymbol: "FX:GBPUSD" },
    { label: "USD/JPY", value: "USDJPY", apiType: "forex", tvSymbol: "FX:USDJPY" },
    { label: "USD/CHF", value: "USDCHF", apiType: "forex", tvSymbol: "FX:USDCHF" },
    { label: "AUD/USD", value: "AUDUSD", apiType: "forex", tvSymbol: "FX:AUDUSD" },
    { label: "USD/CAD", value: "USDCAD", apiType: "forex", tvSymbol: "FX:USDCAD" },
    { label: "NZD/USD", value: "NZDUSD", apiType: "forex", tvSymbol: "FX:NZDUSD" },
    { label: "EUR/GBP", value: "EURGBP", apiType: "forex", tvSymbol: "FX:EURGBP" },
    { label: "EUR/JPY", value: "EURJPY", apiType: "forex", tvSymbol: "FX:EURJPY" },
    { label: "GBP/JPY", value: "GBPJPY", apiType: "forex", tvSymbol: "FX:GBPJPY" },
    { label: "USD/BRL", value: "USDBRL", apiType: "forex", tvSymbol: "FX_IDC:USDBRL" },
  ],

  Crypto: [
    { label: "Bitcoin", value: "BTCUSDT", apiType: "crypto", tvSymbol: "BINANCE:BTCUSDT" },
    { label: "Ethereum", value: "ETHUSDT", apiType: "crypto", tvSymbol: "BINANCE:ETHUSDT" },
    { label: "Solana", value: "SOLUSDT", apiType: "crypto", tvSymbol: "BINANCE:SOLUSDT" },
    { label: "BNB", value: "BNBUSDT", apiType: "crypto", tvSymbol: "BINANCE:BNBUSDT" },
    { label: "XRP", value: "XRPUSDT", apiType: "crypto", tvSymbol: "BINANCE:XRPUSDT" },
    { label: "Cardano", value: "ADAUSDT", apiType: "crypto", tvSymbol: "BINANCE:ADAUSDT" },
    { label: "Dogecoin", value: "DOGEUSDT", apiType: "crypto", tvSymbol: "BINANCE:DOGEUSDT" },
    { label: "Polkadot", value: "DOTUSDT", apiType: "crypto", tvSymbol: "BINANCE:DOTUSDT" },
    { label: "Avalanche", value: "AVAXUSDT", apiType: "crypto", tvSymbol: "BINANCE:AVAXUSDT" },
    { label: "Polygon", value: "MATICUSDT", apiType: "crypto", tvSymbol: "BINANCE:MATICUSDT" },
    { label: "Chainlink", value: "LINKUSDT", apiType: "crypto", tvSymbol: "BINANCE:LINKUSDT" },
    { label: "Litecoin", value: "LTCUSDT", apiType: "crypto", tvSymbol: "BINANCE:LTCUSDT" },
    { label: "Uniswap", value: "UNIUSDT", apiType: "crypto", tvSymbol: "BINANCE:UNIUSDT" },
    { label: "Shiba Inu", value: "SHIBUSDT", apiType: "crypto", tvSymbol: "BINANCE:SHIBUSDT" },
    { label: "Cosmos", value: "ATOMUSDT", apiType: "crypto", tvSymbol: "BINANCE:ATOMUSDT" },
    { label: "NEAR", value: "NEARUSDT", apiType: "crypto", tvSymbol: "BINANCE:NEARUSDT" },
    { label: "Fantom", value: "FTMUSDT", apiType: "crypto", tvSymbol: "BINANCE:FTMUSDT" },
  ],

  B3: [
    { label: "PETR4", value: "PETR4", apiType: "b3", tvSymbol: "BMFBOVESPA:PETR4" },
    { label: "VALE3", value: "VALE3", apiType: "b3", tvSymbol: "BMFBOVESPA:VALE3" },
    { label: "ITUB4", value: "ITUB4", apiType: "b3", tvSymbol: "BMFBOVESPA:ITUB4" },
    { label: "BBDC4", value: "BBDC4", apiType: "b3", tvSymbol: "BMFBOVESPA:BBDC4" },
    { label: "BBAS3", value: "BBAS3", apiType: "b3", tvSymbol: "BMFBOVESPA:BBAS3" },
    { label: "ABEV3", value: "ABEV3", apiType: "b3", tvSymbol: "BMFBOVESPA:ABEV3" },
    { label: "B3SA3", value: "B3SA3", apiType: "b3", tvSymbol: "BMFBOVESPA:B3SA3" },
    { label: "WEGE3", value: "WEGE3", apiType: "b3", tvSymbol: "BMFBOVESPA:WEGE3" },
    { label: "MGLU3", value: "MGLU3", apiType: "b3", tvSymbol: "BMFBOVESPA:MGLU3" },
    { label: "RENT3", value: "RENT3", apiType: "b3", tvSymbol: "BMFBOVESPA:RENT3" },
    { label: "SUZB3", value: "SUZB3", apiType: "b3", tvSymbol: "BMFBOVESPA:SUZB3" },
    { label: "RAIL3", value: "RAIL3", apiType: "b3", tvSymbol: "BMFBOVESPA:RAIL3" },
    { label: "EMBR3", value: "EMBR3", apiType: "b3", tvSymbol: "BMFBOVESPA:EMBR3" },
    { label: "VIVT3", value: "VIVT3", apiType: "b3", tvSymbol: "BMFBOVESPA:VIVT3" },
    { label: "ELET3", value: "ELET3", apiType: "b3", tvSymbol: "BMFBOVESPA:ELET3" },
    { label: "CSAN3", value: "CSAN3", apiType: "b3", tvSymbol: "BMFBOVESPA:CSAN3" },
    { label: "PRIO3", value: "PRIO3", apiType: "b3", tvSymbol: "BMFBOVESPA:PRIO3" },
    { label: "HAPV3", value: "HAPV3", apiType: "b3", tvSymbol: "BMFBOVESPA:HAPV3" },
    { label: "RADL3", value: "RADL3", apiType: "b3", tvSymbol: "BMFBOVESPA:RADL3" },
    { label: "JBSS3", value: "JBSS3", apiType: "b3", tvSymbol: "BMFBOVESPA:JBSS3" },
    { label: "TOTS3", value: "TOTS3", apiType: "b3", tvSymbol: "BMFBOVESPA:TOTS3" },
    { label: "LREN3", value: "LREN3", apiType: "b3", tvSymbol: "BMFBOVESPA:LREN3" },
    { label: "ENEV3", value: "ENEV3", apiType: "b3", tvSymbol: "BMFBOVESPA:ENEV3" },
    { label: "KLBN11", value: "KLBN11", apiType: "b3", tvSymbol: "BMFBOVESPA:KLBN11" },
    { label: "SBSP3", value: "SBSP3", apiType: "b3", tvSymbol: "BMFBOVESPA:SBSP3" },
  ],

  Commodities: [
    { label: "Ouro", value: "XAU", apiType: "commodity", tvSymbol: "TVC:GOLD" },
    { label: "Prata", value: "XAG", apiType: "commodity", tvSymbol: "TVC:SILVER" },
    { label: "Petróleo WTI", value: "WTI", apiType: "commodity", tvSymbol: "NYMEX:CL1!" },
    { label: "Petróleo Brent", value: "BRENT", apiType: "commodity", tvSymbol: "TVC:UKOIL" },
    { label: "Gás Natural", value: "NG", apiType: "commodity", tvSymbol: "NYMEX:NG1!" },
    { label: "Soja", value: "SOJA", apiType: "commodity", tvSymbol: "CBOT:ZS1!" },
    { label: "Milho", value: "MILHO", apiType: "commodity", tvSymbol: "CBOT:ZC1!" },
    { label: "Café", value: "CAFE", apiType: "commodity", tvSymbol: "ICEUS:KC1!" },
  ],

  "Futuros BR": [
    { label: "Mini Índice", value: "WIN", apiType: "future_br", tvSymbol: "BMFBOVESPA:WIN1!" },
    { label: "Mini Dólar", value: "WDO", apiType: "future_br", tvSymbol: "BMFBOVESPA:WDO1!" },
  ],

  "Futuros US": [
    { label: "Mini Ouro", value: "MGC", apiType: "future_us", tvSymbol: "COMEX_MINI:MGC1!" },
    { label: "Mini Nasdaq", value: "MNQ", apiType: "future_us", tvSymbol: "CME_MINI:MNQ1!" },
    { label: "E-mini S&P 500", value: "ES", apiType: "future_us", tvSymbol: "CME_MINI:ES1!" },
    { label: "Crude Oil", value: "CL", apiType: "future_us", tvSymbol: "NYMEX:CL1!" },
  ],
};

function getPriceDecimals(assetType?: string, n?: number) {
  const value = Number(n ?? 0);

  if (assetType === "forex") return 5;

  if (assetType === "crypto") {
    if (Math.abs(value) < 1) return 6;
    if (Math.abs(value) < 100) return 4;
    return 2;
  }

  return 2;
}

function formatPrice(n?: number, assetType?: string) {
  const value = Number(n ?? 0);

  if (!Number.isFinite(value)) return "-";

  const decimals = getPriceDecimals(assetType, value);

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatBrl(n?: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(n ?? 0));
}

function getDefaultAssetByCategory(category: AssetCategoryLabel) {
  return ASSET_OPTIONS[category]?.[0]?.value ?? "";
}

function MarketIntelligenceHub() {
  const videos = [
    {
      title: "Como interpretar o Sinal Final da IA",
      description: "Entenda confiança, direção, entrada, stop e alvos.",
      duration: "8 min",
      youtubeId: "S0hCGYcEEa8",
      thumbnail: "https://img.youtube.com/vi/S0hCGYcEEa8/hqdefault.jpg",
      badge: "Sinal Final",
    },
    {
      title: "Gestão de risco antes da entrada",
      description: "Como validar uma operação sem aumentar exposição.",
      duration: "11 min",
      youtubeId: "S0hCGYcEEa8",
      thumbnail: "https://img.youtube.com/vi/S0hCGYcEEa8/hqdefault.jpg",
      badge: "Gestão",
    },
    {
      title: "Como usar calendário econômico no day trade",
      description: "Veja quais eventos evitar antes de operar.",
      duration: "9 min",
      youtubeId: "S0hCGYcEEa8",
      thumbnail: "https://img.youtube.com/vi/S0hCGYcEEa8/hqdefault.jpg",
      badge: "Calendário",
    },
  ];

  const marketVideos = [
    {
      title: "Expectativas do Mercado para Hoje",
      description: "Cenário do dia, pontos de atenção e possíveis impactos.",
      duration: "7 min",
      youtubeId: "S-4CwqFxYvg",
      thumbnail: "https://img.youtube.com/vi/S-4CwqFxYvg/hqdefault.jpg",
      badge: "Visão do dia",
    },
    {
      title: "Análise dos principais ativos",
      description: "Leitura rápida dos ativos mais importantes do dia.",
      duration: "10 min",
      youtubeId: "S0hCGYcEEa8",
      thumbnail: "https://img.youtube.com/vi/S0hCGYcEEa8/hqdefault.jpg",
      badge: "Radar IA",
    },
    {
      title: "Pontos de risco antes de operar",
      description: "Eventos, notícias e regiões que exigem atenção.",
      duration: "6 min",
      youtubeId: "S0hCGYcEEa8",
      thumbnail: "https://img.youtube.com/vi/S0hCGYcEEa8/hqdefault.jpg",
      badge: "Atenção",
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState<null | {
    title: string;
    youtubeId: string;
  }>(null);

  return (
    <>
      <Card className="overflow-hidden border-zinc-800 bg-zinc-950/80 shadow-2xl shadow-cyan-500/5 xl:col-span-5">
        <CardContent className="space-y-6 p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Central do Trader
              </p>

              <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                Calendário, educação e expectativas do dia
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Uma área mais estratégica para acompanhar eventos econômicos,
                conteúdos importantes e pontos de atenção antes de operar.
              </p>
            </div>

            <a
              href="/status"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-200 transition hover:border-emerald-300/50 hover:text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Status do Sistema
            </a>
          </div>

          <div className="space-y-5">
            <section className="overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-[#080b12]/90 shadow-2xl shadow-cyan-500/10">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <CalendarDays className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">
                      Calendário Econômico
                    </h3>

                    <p className="text-sm text-zinc-400">
                      Acompanhe eventos macroeconômicos importantes antes de
                      operar.
                    </p>
                  </div>
                </div>

                <a
                  href="https://br.investing.com/economic-calendar/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-white"
                >
                  Abrir Calendário no Investing
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-2">
              {/* BLOCO PREMIUM VÍDEOS */}
              <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-300/30 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(180deg,rgba(6,32,25,0.85),rgba(3,7,13,0.98))] p-5 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
                <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/15 p-3 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.18)]">
                      <PlayCircle className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="mb-2 inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">
                        Aprendizado IA
                      </div>

                      <h3 className="text-xl font-black text-white">
                        Vídeos Educacionais
                      </h3>

                      <p className="mt-1 text-sm text-emerald-100/70">
                        Conteúdos estratégicos para melhorar sua leitura
                        operacional.
                      </p>
                    </div>
                  </div>

                  <div className="hidden rounded-2xl border border-emerald-300/20 bg-black/30 px-3 py-2 text-right sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                      Academy
                    </p>

                    <p className="mt-1 text-lg font-black text-white">
                      IA Learn
                    </p>
                  </div>
                </div>

                <div className="relative space-y-3">
                  {videos.map((video, index) => (
                    <button
                      key={video.title}
                      type="button"
                      onClick={() =>
                        setSelectedVideo({
                          title: video.title,
                          youtubeId: video.youtubeId,
                        })
                      }
                      className={`group relative grid w-full grid-cols-[104px_1fr_auto] items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition duration-300 hover:-translate-y-0.5 ${
                        index === 1
                          ? "border-emerald-300/45 bg-emerald-400/[0.10] shadow-[0_0_34px_rgba(16,185,129,0.18)]"
                          : "border-white/10 bg-black/25 hover:border-emerald-300/35 hover:bg-emerald-400/[0.06]"
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-300 via-cyan-300 to-transparent opacity-80" />

                      {index === 1 && (
                        <div className="absolute right-3 top-3 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200">
                          Destaque
                        </div>
                      )}

                      <div className="relative overflow-hidden rounded-xl border border-emerald-300/20 bg-black">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-[72px] w-[104px] object-cover transition duration-300 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/20 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                            <PlayCircle className="h-7 w-7" />
                          </div>
                        </div>

                        <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-lg bg-black/80 text-xs font-black text-emerald-200">
                          {index + 1}
                        </div>
                      </div>

                      <div className="min-w-0 pr-6">
                        <div className="mb-1 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200">
                          {video.badge}
                        </div>

                        <h4 className="line-clamp-2 font-black leading-snug text-white group-hover:text-emerald-100">
                          {video.title}
                        </h4>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-300">
                          {video.description}
                        </p>

                        <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-emerald-200/70">
                          <Clock className="h-3.5 w-3.5" />
                          {video.duration}
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 shrink-0 text-emerald-200/50 transition group-hover:translate-x-1 group-hover:text-emerald-200" />
                    </button>
                  ))}
                </div>

                <div className="relative mt-5 rounded-2xl border border-emerald-300/20 bg-black/25 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
                      <Brain className="h-5 w-5" />
                    </div>

                    <div>
                      <h4 className="font-black text-white">
                        Trilha recomendada
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        Comece pela interpretação do Sinal Final, avance para
                        gestão de risco e finalize com calendário econômico.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* BLOCO EXPECTATIVAS */}
              <section className="relative overflow-hidden rounded-[1.75rem] border border-cyan-300/30 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),linear-gradient(180deg,rgba(8,47,73,0.50),rgba(3,7,13,0.96))] p-5 shadow-2xl shadow-cyan-500/20">
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/15 p-3 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                      <Target className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="mb-2 inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
                        Atualização diária
                      </div>

                      <h3 className="text-xl font-black text-white">
                        Expectativas do Mercado
                      </h3>

                      <p className="mt-1 text-sm text-cyan-100/75">
                        Cenário operacional, análise e visão do dia.
                      </p>
                    </div>
                  </div>

                  <div className="hidden rounded-2xl border border-cyan-300/20 bg-black/30 px-3 py-2 text-right sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                      Radar
                    </p>

                    <p className="mt-1 text-lg font-black text-white">
                      IA Live
                    </p>
                  </div>
                </div>

                <div className="relative space-y-3">
                  {marketVideos.map((video, index) => (
                    <button
                      key={video.title}
                      type="button"
                      onClick={() =>
                        setSelectedVideo({
                          title: video.title,
                          youtubeId: video.youtubeId,
                        })
                      }
                      className={`group relative grid w-full grid-cols-[104px_1fr_auto] items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition duration-300 hover:-translate-y-0.5 ${
                        index === 0
                          ? "border-cyan-300/45 bg-cyan-400/[0.10] shadow-[0_0_34px_rgba(34,211,238,0.16)]"
                          : "border-white/10 bg-black/25 hover:border-cyan-300/35 hover:bg-cyan-400/[0.06]"
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300 via-emerald-300 to-transparent opacity-80" />

                      {index === 0 && (
                        <div className="absolute right-3 top-3 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200">
                          Destaque
                        </div>
                      )}

                      <div className="relative overflow-hidden rounded-xl border border-cyan-300/20 bg-black">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-[72px] w-[104px] object-cover transition duration-300 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/20 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                            <PlayCircle className="h-7 w-7" />
                          </div>
                        </div>

                        <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-lg bg-black/80 text-xs font-black text-cyan-200">
                          {index + 1}
                        </div>
                      </div>

                      <div className="min-w-0 pr-6">
                        <div className="mb-1 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-200">
                          {video.badge}
                        </div>

                        <h4 className="line-clamp-2 font-black leading-snug text-white group-hover:text-cyan-100">
                          {video.title}
                        </h4>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-300">
                          {video.description}
                        </p>

                        <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200/70">
                          <Clock className="h-3.5 w-3.5" />
                          {video.duration}
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 shrink-0 text-cyan-200/50 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedVideo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-zinc-950 shadow-2xl shadow-emerald-500/20">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="pr-10 text-lg font-black text-white">
                {selectedVideo.title}
              </h3>

              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-400 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type B3MarketData = {
  symbol?: string;
  last_price?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;
  close_price?: number | null;
  volume?: number | null;
  bid?: number | null;
  ask?: number | null;
  last_trade_ts?: number | null;
  source?: string;
};


function SummaryTab({
  asset,
  tf,
  analysisData,
  compact = false,
  b3Data,
  isB3Future = false,
}: {
  asset: string;
  tf: string;
  analysisData: AnalysisData | null;
  compact?: boolean;
  b3Data?: B3MarketData | null;
  isB3Future?: boolean;
}) {
  const normalizedAsset =
    analysisData?.asset || asset.trim().toUpperCase() || "IBOV";

  const assetType = analysisData?.asset_type ?? (isB3Future ? "future_br" : "crypto");

  const direction = analysisData?.direction ?? "NEUTRO";

  const entry =
    analysisData?.entry ??
    (isB3Future ? b3Data?.last_price ?? 0 : 0);

  const stop =
    analysisData?.stop ??
    (isB3Future ? b3Data?.low_price ?? 0 : 0);

  const target =
    analysisData?.target ??
    (isB3Future ? b3Data?.high_price ?? 0 : 0);

  const rr = analysisData?.risk_reward ?? 0;

  const summary = (analysisData as any)?.summary ?? {};

  const signalLabel = analysisData?.final_signal?.direction ?? "—";

  const confluence =
    summary.confluence ??
    (isB3Future ? "Realtime" : "0/10");

  const trendLabel =
    summary.trend_label ??
    analysisData?.direction ??
    (isB3Future
      ? (b3Data?.last_price ?? 0) >= (b3Data?.open_price ?? 0)
        ? "ALTA"
        : "BAIXA"
      : "NEUTRO");

  const technicalLabel =
    summary.technical_label ??
    (isB3Future ? "REALTIME" : "NEUTRO");

  const smartMoneyLabel =
    summary.smart_money_label ??
    (isB3Future ? "REALTIME" : "NEUTRO");

  const tp2 = summary.tp2 ?? (isB3Future ? b3Data?.high_price ?? 0 : 0);
  const tp3 = summary.tp3 ?? (isB3Future ? b3Data?.high_price ?? 0 : 0);

  const currentScenarioTargets =
    direction === "VENDA"
      ? analysisData?.scenarios?.sell?.targets ?? []
      : analysisData?.scenarios?.buy?.targets ?? [];

  const tp2Confidence =
    currentScenarioTargets.find((t) => t.label === "TP2")?.probability ?? null;

  const tp3Confidence =
    currentScenarioTargets.find((t) => t.label === "TP3")?.probability ?? null;

  const confidence =
    analysisData?.confidence ??
    summary.confidence ??
    (typeof confluence === "string" && confluence.includes("/10")
      ? Math.round((Number(confluence.split("/")[0]) || 0) * 10)
      : isB3Future
      ? 50
      : 0);

  const directionColor =
    direction === "COMPRA"
      ? "text-green-400"
      : direction === "VENDA"
      ? "text-red-400"
      : "text-yellow-400";

  const directionBg =
    direction === "COMPRA"
      ? "border-green-900/60 bg-gradient-to-b from-green-950/60 to-black"
      : direction === "VENDA"
      ? "border-red-900/60 bg-gradient-to-b from-red-950/40 to-black"
      : "border-yellow-900/60 bg-gradient-to-b from-yellow-950/30 to-black";

  if (compact) {
    return (
      <aside className="space-y-3">
        <div className={`rounded-3xl border p-4 ${directionBg}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-400">
                🤖 Decisão da IA
              </div>
              <div
                className={`text-4xl font-black mt-2 leading-none ${directionColor}`}
              >
                {signalLabel}
              </div>

              <div className="text-zinc-400 text-sm mt-2">
                Confiança da análise:
                <span className="text-white font-bold ml-1">
                  {confidence}%
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-white text-xl font-bold uppercase leading-none">
                {normalizedAsset}
              </div>
              <div className="text-zinc-400 text-sm mt-2">
                {tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
              <div className="text-zinc-400 text-xs">Entrada</div>
              <div className="text-white text-xl font-bold mt-1">
                {formatPrice(entry, assetType)}
              </div>
            </div>

            <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-3">
              <div className="text-red-400 text-xs">Stop</div>
              <div className="text-red-400 text-xl font-bold mt-1">
                {formatPrice(stop, assetType)}
              </div>
            </div>

            <div className="rounded-xl border border-green-900/60 bg-green-950/20 p-3">
              <div className="text-green-400 text-xs">Take 1</div>
              <div className="text-green-400 text-xl font-bold mt-1">
                {formatPrice(target, assetType)}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-3">
              <div className="text-zinc-400 text-xs">Risco:Retorno</div>
              <div className="text-cyan-400 text-2xl font-bold mt-1">
                1:{rr.toFixed(2)}
              </div>
            </div>
          </div>

        </div>

        <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
          🧠 Leitura da IA
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-cyan-400 text-xs">Confiança IA</div>
            <div
              className={`text-2xl font-bold mt-2 ${
                confidence >= 70
                  ? "text-green-400"
                  : confidence >= 50
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {confidence}%
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
            <div className="text-yellow-400 text-xs">Direção do Mercado</div>
            <div className="text-green-400 text-xl font-bold mt-1">
              {trendLabel}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
            <div className="text-green-400 text-xs">Validação Técnica</div>
            <div className="text-green-400 text-xl font-bold mt-1">
              {technicalLabel}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
            <div className="text-yellow-400 text-xs">Fluxo Institucional</div>
            <div className="text-red-400 text-xl font-bold mt-1">
              {smartMoneyLabel}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-cyan-400 text-sm font-semibold mb-3 uppercase tracking-wide">📌 Plano de Operação</div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`rounded-xl border p-3 ${
                direction === "VENDA"
                  ? "border-red-900/60 bg-red-950/20"
                  : "border-green-900/60 bg-green-950/20"
              }`}
            >
              <div
                className={`text-sm ${
                  direction === "VENDA" ? "text-red-300" : "text-green-300"
                }`}
              >
                Objetivo 2
              </div>

              <div
                className={`text-2xl font-bold mt-1 ${
                  direction === "VENDA" ? "text-red-300" : "text-green-300"
                }`}
              >
                {formatPrice(tp2, assetType)}
              </div>

              <div className="text-zinc-400 text-sm mt-3">
                Confiança:{" "}
                <span className="text-cyan-400 font-semibold">
                  {tp2Confidence ?? "--"}%
                </span>
              </div>
            </div>

            <div
              className={`rounded-xl border p-3 ${
                direction === "VENDA"
                  ? "border-red-900/60 bg-red-950/20"
                  : "border-green-900/60 bg-green-950/20"
                }`}
              >
                <div
                  className={`text-sm ${
                    direction === "VENDA" ? "text-red-400" : "text-green-400"
                }`}
              >
                Objetivo 3
              </div>

              <div
                className={`text-xl font-bold mt-1 ${
                  direction === "VENDA" ? "text-red-300" : "text-green-300"
                }`}
              >
                {formatPrice(tp3, assetType)}
              </div>

              <div className="text-zinc-400 text-sm mt-3">
                Confiança:{" "}
                <span className="text-cyan-400 font-semibold">
                  {tp3Confidence ?? "--"}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div className="space-y-3">
      <div className={`rounded-3xl border p-6 ${directionBg}`}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`h-12 w-12 rounded-3xl border flex items-center justify-center text-3xl ${
                direction === "COMPRA"
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : direction === "VENDA"
                  ? "bg-red-500/20 border-red-500/30 text-red-400"
                  : "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
              }`}
            >
              {direction === "VENDA" ? "↘" : direction === "COMPRA" ? "↗" : "→"}
            </div>

            <div>
              <div className="text-zinc-500 uppercase tracking-wide text-sm">
                Sinal Identificado
              </div>
              <div className={`text-5xl font-bold mt-1 ${directionColor}`}>
                {signalLabel}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-white text-2xl font-bold uppercase">
              {normalizedAsset}
            </div>
            <div className="text-zinc-400 text-2xl mt-1">
              {tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <div className="text-zinc-400 text-sm">Entrada</div>
            <div className="text-white text-3xl font-bold mt-2">
              {formatPrice(entry, assetType)}
            </div>
          </div>

          <div className="rounded-2xl border border-red-900/70 bg-red-950/20 p-4">
            <div className="text-red-400 text-sm">Stop Loss</div>
            <div className="text-red-400 text-3xl font-bold mt-2">
              {formatPrice(stop, assetType)}
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/70 bg-green-950/20 p-4">
            <div className="text-green-400 text-sm">Take Profit 1</div>
            <div className="text-green-400 text-3xl font-bold mt-2">
              {formatPrice(target, assetType)}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <div className="text-zinc-400 text-sm">Risco/Retorno</div>
            <div className="text-cyan-400 text-3xl font-bold mt-2">
              1:{rr.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-cyan-400 text-sm">Confluência</div>
          <div className="text-white text-2xl font-bold mt-3">{confluence}</div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-yellow-400 text-sm">Tendência</div>
          <div
            className={`text-2xl font-bold mt-3 ${
              trendLabel === "ALTA" || trendLabel === "COMPRA"
                ? "text-green-400"
                : trendLabel === "BAIXA" || trendLabel === "VENDA"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {trendLabel}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-green-400 text-sm">Técnico</div>
          <div
            className={`text-2xl font-bold mt-3 ${
              technicalLabel === "ALTA" || technicalLabel === "COMPRA"
                ? "text-green-400"
                : technicalLabel === "BAIXA" || technicalLabel === "VENDA"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {technicalLabel}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="text-yellow-400 text-sm">Smart Money</div>
          <div
            className={`text-2xl font-bold mt-3 ${
              smartMoneyLabel === "ALTA" ||
              smartMoneyLabel === "COMPRA" ||
              smartMoneyLabel === "BULLISH"
                ? "text-green-400"
                : smartMoneyLabel === "BAIXA" ||
                  smartMoneyLabel === "VENDA" ||
                  smartMoneyLabel === "BEARISH"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {smartMoneyLabel}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-zinc-400 text-sm mb-4">Alvos Adicionais</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-green-900/60 bg-green-950/20 p-5">
            <div className="text-green-400 text-sm">Take 2</div>
            <div className="text-green-400 text-3xl font-bold mt-2">
              {formatPrice(tp2, assetType)}
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/60 bg-green-950/20 p-5">
            <div className="text-green-400 text-sm">Take 3</div>
            <div className="text-green-400 text-3xl font-bold mt-2">
              {formatPrice(tp3, assetType)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumoAvancadoTab({
  asset,
  tf,
  analysisData,
}: {
  asset: string;
  tf: string;
  analysisData: AnalysisData | null;
}) {
  if (!analysisData) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
        Gere uma análise para visualizar o resumo operacional.
      </div>
    );
  }

  const assetType = analysisData?.asset_type ?? "crypto";
  const buy = analysisData?.scenarios?.buy;
  const sell = analysisData?.scenarios?.sell;

  const getBarWidth = (value?: number) => {
    const safe = Math.max(0, Math.min(100, Number(value ?? 0)));
    return `${safe}%`;
  };

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-lg font-bold">
              Resumo Operacional
            </div>
            <div className="text-zinc-400 text-sm mt-1">
              {asset} • {tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <div className="text-emerald-400 text-2xl font-bold">COMPRA</div>

        <div className="mt-2 text-sm text-zinc-300">
          Probabilidade: <b>{buy?.probability ?? 0}%</b>
        </div>

        <div className="mt-3 h-2 bg-zinc-800 rounded-full">
          <div
            className="h-2 bg-emerald-400 rounded-full"
            style={{ width: getBarWidth(buy?.probability) }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="bg-emerald-500/10 p-4 rounded-xl">
            <div className="text-sm text-zinc-400">Entrada</div>
            <div className="text-xl font-bold text-emerald-400">
              {formatPrice(buy?.entry_trigger, assetType)}
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              {buy?.entry_reason ?? "Sem justificativa"}
            </div>
          </div>

          <div className="bg-red-500/10 p-4 rounded-xl">
            <div className="text-sm text-zinc-400">Stop</div>
            <div className="text-xl font-bold text-red-400">
              {formatPrice(buy?.stop, assetType)}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {(buy?.targets ?? []).map((t, i) => (
            <div
              key={`buy-${i}`}
              className="bg-black/30 p-3 rounded-xl flex items-center gap-3"
            >
              <div className="text-emerald-300 font-bold min-w-[44px]">
                {t.label ?? "TP"}
              </div>

              <div className="text-white">
                {formatPrice(t.price, assetType)}
              </div>

              <div className="ml-auto flex items-center gap-3 min-w-[220px] max-w-[260px] w-full md:w-[240px]">
                <div className="flex-1 h-2 bg-zinc-800 rounded-full">
                  <div
                    className="h-2 bg-emerald-400 rounded-full"
                    style={{ width: getBarWidth(t.probability) }}
                  />
                </div>

                <div className="text-sm text-amber-300 w-10 text-right">
                  {t.probability ?? 0}%
                </div>

                <div className="text-xs text-zinc-500 w-10 text-right">
                  {t.rr ?? "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-5">
        <div className="text-red-400 text-2xl font-bold">VENDA</div>

        <div className="mt-2 text-sm text-zinc-300">
          Probabilidade: <b>{sell?.probability ?? 0}%</b>
        </div>

        <div className="mt-3 h-2 bg-zinc-800 rounded-full">
          <div
            className="h-2 bg-red-400 rounded-full"
            style={{ width: getBarWidth(sell?.probability) }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="bg-red-500/10 p-4 rounded-xl">
            <div className="text-sm text-zinc-400">Entrada</div>
            <div className="text-xl font-bold text-red-400">
              {formatPrice(sell?.entry_trigger, assetType)}
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              {sell?.entry_reason ?? "Sem justificativa"}
            </div>
          </div>

          <div className="bg-emerald-500/10 p-4 rounded-xl">
            <div className="text-sm text-zinc-400">Stop</div>
            <div className="text-xl font-bold text-emerald-400">
              {formatPrice(sell?.stop, assetType)}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {(sell?.targets ?? []).map((t, i) => (
            <div
              key={`sell-${i}`}
              className="bg-black/30 p-3 rounded-xl flex items-center gap-3"
            >
              <div className="text-red-300 font-bold min-w-[44px]">
                {t.label ?? "TP"}
              </div>

              <div className="text-white">
                {formatPrice(t.price, assetType)}
              </div>

              <div className="ml-auto flex items-center gap-3 min-w-[220px] max-w-[260px] w-full md:w-[240px]">
                <div className="flex-1 h-2 bg-zinc-800 rounded-full">
                  <div
                    className="h-2 bg-red-400 rounded-full"
                    style={{ width: getBarWidth(t.probability) }}
                  />
                </div>

                <div className="text-sm text-amber-300 w-10 text-right">
                  {t.probability ?? 0}%
                </div>

                <div className="text-xs text-zinc-500 w-10 text-right">
                  {t.rr ?? "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Mantive as demais abas do seu arquivo com a mesma lógica.
   Se alguma já estava funcionando, não há necessidade de alterar. */

function TechnicalTab({
  asset,
  tf,
  analysisData,
}: {
  asset: string;
  tf: string;
  analysisData: AnalysisData | null;
}) {
  const tech = analysisData?.technical;
  const assetType = analysisData?.asset_type ?? "crypto";

  if (!analysisData) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
        Gere uma análise para visualizar a aba Técnica.
      </div>
    );
  }

  if (!tech) {
    return (
      <div className="rounded-3xl border border-yellow-900/40 bg-yellow-950/10 p-6 text-center text-zinc-300">
        <div className="text-xl font-semibold text-yellow-400">
          Dados técnicos indisponíveis
        </div>
        <div className="mt-2 text-sm text-zinc-400">
          O backend não retornou o bloco <span className="text-white">technical</span> para este ativo/timeframe.
        </div>
      </div>
    );
  }

  const score = typeof tech.score === "number" ? tech.score : null;
  const buySignals =
    typeof tech.buy_signals === "number" ? tech.buy_signals : null;
  const sellSignals =
    typeof tech.sell_signals === "number" ? tech.sell_signals : null;
  const neutralSignals =
    typeof tech.neutral_signals === "number" ? tech.neutral_signals : null;

  const trendBias = tech.trend_bias ?? null;
  const emaTrend = tech.ema_trend ?? null;

  const ema9 = typeof tech.ema9 === "number" ? tech.ema9 : null;
  const ema21 = typeof tech.ema21 === "number" ? tech.ema21 : null;
  const rsi = typeof tech.rsi === "number" ? tech.rsi : null;

  const supports = Array.isArray(tech.supports) ? tech.supports : [];
  const resistances = Array.isArray(tech.resistances) ? tech.resistances : [];

  const safeBuy = buySignals ?? 0;
  const safeSell = sellSignals ?? 0;
  const safeNeutral = neutralSignals ?? 0;
  const total = safeBuy + safeSell + safeNeutral;

  const buyPct = total > 0 ? Math.round((safeBuy / total) * 100) : 0;
  const sellPct = total > 0 ? Math.round((safeSell / total) * 100) : 0;
  const neutralPct = total > 0 ? Math.round((safeNeutral / total) * 100) : 0;

  const normalizedBias = (trendBias || "").toUpperCase();
  const normalizedEmaTrend = (emaTrend || "").toUpperCase();

  const biasColor =
    normalizedBias === "ALTA" || normalizedBias === "COMPRA"
      ? "text-green-400"
      : normalizedBias === "BAIXA" || normalizedBias === "VENDA"
      ? "text-red-400"
      : "text-yellow-400";

  const biasLabel =
    trendBias ??
    (safeBuy > safeSell
      ? "ALTA"
      : safeSell > safeBuy
      ? "BAIXA"
      : "NEUTRO");

  const emaRelation =
    ema9 !== null && ema21 !== null
      ? ema9 > ema21
        ? "EMA9 acima da EMA21"
        : ema9 < ema21
        ? "EMA9 abaixo da EMA21"
        : "EMA9 alinhada à EMA21"
      : "Sem dados suficientes";

  const rsiText =
    rsi === null
      ? "RSI indisponível"
      : rsi >= 70
      ? "Sobrecompra"
      : rsi <= 30
      ? "Sobrevenda"
      : rsi > 55
      ? "Pressão compradora"
      : rsi < 45
      ? "Pressão vendedora"
      : "Mercado neutro";

  const scoreColor =
    score === null
      ? "text-zinc-400"
      : score >= 70
      ? "text-green-400"
      : score <= 40
      ? "text-red-400"
      : "text-yellow-400";

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-cyan-400 text-lg font-semibold">
            ∿ Análise Técnica para <span className="text-white">{asset}</span>
          </div>
          <div className="text-zinc-400 mt-1">
            {tf === "1m"
              ? "1 Minuto"
              : tf === "5m"
              ? "5 Minutos"
              : tf === "15m"
              ? "15 Minutos"
              : tf === "30m"
              ? "30 Minutos"
              : tf === "1h"
              ? "1 Hora"
              : tf === "4h"
              ? "4 Horas"
              : tf === "1d"
              ? "1 Dia"
              : tf}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-center">
            <div className="text-zinc-400 text-sm">Score Técnico</div>
            <div className={`text-6xl font-bold mt-2 ${scoreColor}`}>
              {score !== null ? score : "—"}
            </div>
            <div className="text-zinc-500 mt-2">
              {score !== null
                ? score >= 70
                  ? "Leitura técnica forte"
                  : score <= 40
                  ? "Leitura técnica fraca"
                  : "Leitura técnica moderada"
                : "Sem score técnico"}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-center">
            <div className="text-zinc-400 text-sm">Viés Técnico</div>
            <div className={`text-2xl font-bold mt-3 ${biasColor}`}>
              {biasLabel}
            </div>
            <div className="text-zinc-500 mt-2">
              EMA Trend:{" "}
              <span className="text-white">
                {emaTrend ?? "indisponível"}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`rounded-2xl border p-5 text-center mt-6 ${
            normalizedBias === "ALTA" || normalizedBias === "COMPRA"
              ? "border-green-900/70 bg-gradient-to-r from-green-950/70 to-emerald-950/20"
              : normalizedBias === "BAIXA" || normalizedBias === "VENDA"
              ? "border-red-900/70 bg-gradient-to-r from-red-950/60 to-rose-950/20"
              : "border-yellow-900/60 bg-gradient-to-r from-yellow-950/40 to-zinc-950"
          }`}
        >
          <div className={`ttext-2xl font-bold ${biasColor}`}>
            {normalizedBias === "ALTA" || normalizedBias === "COMPRA"
              ? "↗ Viés de Alta ↗"
              : normalizedBias === "BAIXA" || normalizedBias === "VENDA"
              ? "↘ Viés de Baixa ↘"
              : "→ Viés Neutro →"}
          </div>

          <div className="text-zinc-400 mt-1 text-xs">
            Leitura baseada no retorno real do backend
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="text-cyan-400 font-semibold">EMA 9</div>
            <div className="text-white text-3xl font-bold mt-4">
              {ema9 !== null ? formatPrice(ema9, assetType) : "—"}
            </div>
            <div className="text-zinc-500 text-sm mt-2">
              Média curta
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="text-cyan-400 font-semibold">EMA 21</div>
            <div className="text-white text-3xl font-bold mt-4">
              {ema21 !== null ? formatPrice(ema21, assetType) : "—"}
            </div>
            <div className="text-zinc-500 text-sm mt-2">
              Média intermediária
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="text-cyan-400 font-semibold">RSI</div>
            <div
              className={`text-3xl font-bold mt-4 ${
                rsi === null
                  ? "text-zinc-400"
                  : rsi >= 70
                  ? "text-red-400"
                  : rsi <= 30
                  ? "text-green-400"
                  : "text-white"
              }`}
            >
              {rsi !== null ? rsi.toFixed(2) : "—"}
            </div>
            <div className="text-zinc-500 text-sm mt-2">{rsiText}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 mt-6">
          <div className="text-white text-lg font-semibold">
            Relação entre Médias
          </div>
          <div className="text-zinc-400 mt-1 text-xs">
            {emaRelation}
          </div>
          <div className="text-zinc-500 text-sm mt-2">
            Tendência de médias:{" "}
            <span className="text-white">
              {normalizedEmaTrend || "indisponível"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl border border-red-900/70 bg-red-950/20 p-5 text-center">
            <div className="text-red-400 text-2xl">↘</div>
            <div className="text-zinc-400 mt-1 text-xs">Sinais de Venda</div>
            <div className="text-red-400 text-5xl font-bold mt-2">
              {sellSignals !== null ? sellSignals : "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-center">
            <div className="text-zinc-500 text-2xl">–</div>
            <div className="text-zinc-400 mt-1 text-xs">Sinais Neutros</div>
            <div className="text-white text-5xl font-bold mt-2">
              {neutralSignals !== null ? neutralSignals : "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/70 bg-green-950/20 p-5 text-center">
            <div className="text-green-400 text-2xl">↗</div>
            <div className="text-zinc-400 mt-1 text-xs">Sinais de Compra</div>
            <div className="text-green-400 text-5xl font-bold mt-2">
              {buySignals !== null ? buySignals : "—"}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
            <span>Distribuição dos sinais</span>
            <span>
              {total > 0 ? `${sellPct}% / ${neutralPct}% / ${buyPct}%` : "Sem distribuição disponível"}
            </span>
          </div>

          <div className="h-4 rounded-full overflow-hidden bg-zinc-800 flex">
            <div
              className="bg-red-500 h-full transition-all"
              style={{ width: `${sellPct}%` }}
            />
            <div
              className="bg-zinc-500 h-full transition-all"
              style={{ width: `${neutralPct}%` }}
            />
            <div
              className="bg-green-500 h-full transition-all"
              style={{ width: `${buyPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-3">
        <div className="text-white text-3xl font-bold mb-6">
          Padrões & Níveis Técnicos
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-green-900/50 bg-green-950/20 p-5">
            <div className="text-green-400 text-2xl font-bold mb-4">
              Suportes
            </div>

            <div className="space-y-3">
              {supports.length > 0 ? (
                supports.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-green-900/30 bg-black/20 px-3 py-2 text-white text-2xl font-semibold"
                  >
                    {formatPrice(s, assetType)}
                  </div>
                ))
              ) : (
                <div className="text-zinc-400">Sem suportes retornados</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-5">
            <div className="text-red-400 text-2xl font-bold mb-4">
              Resistências
            </div>

            <div className="space-y-3">
              {resistances.length > 0 ? (
                resistances.map((r, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-red-900/30 bg-black/20 px-3 py-2 text-white text-2xl font-semibold"
                  >
                    {formatPrice(r, assetType)}
                  </div>
                ))
              ) : (
                <div className="text-zinc-400">Sem resistências retornadas</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmcTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const smc = analysisData?.smc;
  const assetType = analysisData?.asset_type;

  if (!analysisData) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
        Gere uma análise para visualizar o SMC.
      </div>
    );
  }

  if (!smc) {
    return (
      <div className="rounded-3xl border border-yellow-900/40 bg-yellow-950/10 p-6 text-center text-zinc-300">
        <div className="text-xl font-semibold text-yellow-400">
          Dados SMC indisponíveis
        </div>
        <div className="mt-2 text-sm text-zinc-400">
          O backend não retornou o bloco <span className="text-white">smc</span>.
        </div>
      </div>
    );
  }

  const bias = smc.bias ?? null;
  const structureLabel = smc.structure_label ?? null;
  const lastBos = typeof smc.last_bos === "number" ? smc.last_bos : null;

  const context = smc.context ?? null;
  const structure = smc.structure ?? null;
  const trigger = smc.trigger ?? null;

  const divergence = smc.divergence ?? null;
  const orderBlocks = Array.isArray(smc.order_blocks) ? smc.order_blocks : [];
  const fvgs = Array.isArray(smc.fvgs) ? smc.fvgs : [];
  const liquidity = Array.isArray(smc.liquidity) ? smc.liquidity : [];
  const structureBreaks = Array.isArray(smc.structure_breaks)
    ? smc.structure_breaks
    : [];
  const summary = smc.summary ?? null;

  const normalize = (value?: string | null) => (value || "").toUpperCase();

  const normalizedBias = normalize(bias);

  const biasPillClass =
    normalizedBias === "BULLISH"
      ? "bg-green-500/15 border-green-500/20 text-green-400"
      : normalizedBias === "BEARISH"
      ? "bg-red-500/15 border-red-500/20 text-red-400"
      : "bg-zinc-900 border-zinc-800 text-zinc-300";

  const biasLabel =
    normalizedBias === "BULLISH"
      ? "↗ VIÉS ALTISTA"
      : normalizedBias === "BEARISH"
      ? "↘ VIÉS BAIXISTA"
      : bias ?? "—";

  const safeFormatPrice = (value?: number | null) => {
    if (typeof value !== "number") return "—";
    return formatPrice(value, assetType);
  };

  const getBiasTone = (value?: string | null) => {
    const v = normalize(value);

    if (["ALTA", "BULLISH", "COMPRA", "HH/HL"].includes(v)) {
      return {
        card: "border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(3,7,13,0.88))]",
        text: "text-green-400",
        icon: "↗",
      };
    }

    if (["BAIXA", "BEARISH", "VENDA", "LH/LL"].includes(v)) {
      return {
        card: "border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(3,7,13,0.88))]",
        text: "text-red-400",
        icon: "↘",
      };
    }

    return {
      card: "border-zinc-800 bg-[linear-gradient(135deg,rgba(39,39,42,0.65),rgba(3,7,13,0.88))]",
      text: "text-zinc-300",
      icon: "–",
    };
  };

  const getStrengthBadgeClass = (strength?: string | null) => {
    const s = normalize(strength);

    if (s.includes("ALTA") || s.includes("FORTE")) {
      return "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20";
    }

    if (s.includes("MÉDIA") || s.includes("MEDIA")) {
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20";
    }

    return "bg-zinc-800 text-zinc-300 border border-zinc-700";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5 md:p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
              ⌘
            </div>

            <div>
              <div className="text-white text-lg font-bold">
                Smart Money Concept (SMC)
              </div>
              <div className="text-zinc-400 text-sm md:text-base">
                Análise de fluxo institucional
              </div>
            </div>
          </div>

          <div
            className={`inline-flex items-center rounded-full border px-5 py-3 text-lg font-bold ${biasPillClass}`}
          >
            {biasLabel}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-800 pt-4">
          {structureLabel && (
            <div className="rounded-xl border border-green-500/15 bg-green-500/10 px-4 py-2 text-sm text-green-300">
              {structureLabel}
            </div>
          )}

          {lastBos !== null && (
            <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              Último BOS: {safeFormatPrice(lastBos)}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-white text-lg font-bold">📊 Análise Multi-Período</div>

          {divergence && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              ⊗ Divergente
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "CONTEXTO", data: context },
            { label: "ESTRUTURA", data: structure },
            { label: "GATILHO", data: trigger },
          ].map((item, index) => {
            const tone = getBiasTone(item.data?.bias);

            return (
              <div
                key={index}
                className={`rounded-2xl border p-4 md:p-5 ${tone.card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-zinc-400 text-sm font-semibold tracking-wide">
                    {item.label}
                  </div>
                  <div className={`text-lg font-bold ${tone.text}`}>{tone.icon}</div>
                </div>

                <div className="mt-3 text-2xl font-bold text-white">
                  {typeof item.data?.candles === "number" ? item.data.candles : "—"}
                </div>

                <div className="mt-1 text-zinc-500">Velas</div>

                <div className={`mt-3 text-lg font-semibold ${tone.text}`}>
                  {item.data?.bias ?? "—"}
                </div>
              </div>
            );
          })}
        </div>

        {divergence && (
          <div className="mt-4 rounded-2xl border border-red-500/15 bg-[linear-gradient(90deg,rgba(127,29,29,0.45),rgba(69,10,10,0.18))] px-3 py-2 text-sm md:text-base text-red-300">
            ⚠ Divergência: {divergence}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5 md:p-6">
          <div className="mb-4 text-white text-2xl font-bold">◈ Order Blocks</div>

          {orderBlocks.length > 0 ? (
            <div className="space-y-3">
              {orderBlocks.map((item, idx) => {
                const bullish = item.bullish === true;
                const cardClass = bullish
                  ? "border-green-500/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(3,7,13,0.88))]"
                  : "border-red-500/25 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(3,7,13,0.88))]";

                const titleClass = bullish ? "text-green-400" : "text-red-400";

                return (
                  <div key={idx} className={`rounded-2xl border p-4 ${cardClass}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold text-lg ${titleClass}`}>
                          ● {item.title ?? "Order Block"}
                        </div>

                        <div className="mt-2 text-white text-2xl font-bold">
                          {item.price ?? "—"}
                        </div>

                        {item.desc && (
                          <div className="mt-2 text-sm text-zinc-400">{item.desc}</div>
                        )}
                      </div>

                      {item.strength && (
                        <div className="text-sm text-zinc-300 whitespace-nowrap">
                          Força: {item.strength}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-zinc-400">Sem Order Blocks retornados.</div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5 md:p-6">
          <div className="mb-4 text-white text-2xl font-bold">💲 Fair Value Gaps (FVG)</div>

          {fvgs.length > 0 ? (
            <div className="space-y-3">
              {fvgs.map((item, idx) => {
                const bullish = item.bullish === true;
                const cardClass = bullish
                  ? "border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(3,7,13,0.88))]"
                  : "border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.14),rgba(3,7,13,0.88))]";

                const titleClass = bullish ? "text-green-400" : "text-red-400";

                return (
                  <div key={idx} className={`rounded-2xl border p-4 ${cardClass}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold text-lg ${titleClass}`}>
                          ▮ {item.title ?? "FVG"}
                        </div>

                        <div className="mt-2 text-sm text-zinc-400">
                          Zona: <span className="text-zinc-200">{item.zone ?? "—"}</span>
                        </div>
                      </div>

                      {item.state && (
                        <div
                          className={`rounded-lg px-3 py-1 text-sm whitespace-nowrap ${
                            item.state.toUpperCase() === "ABERTO"
                              ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20"
                              : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                          }`}
                        >
                          {item.state}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-zinc-400">Sem FVGs retornados.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5 md:p-6">
          <div className="mb-4 text-white text-2xl font-bold">💰 Zonas de Liquidez</div>

          {liquidity.length > 0 ? (
            <div className="space-y-3">
              {liquidity.map((item, idx) => {
                const descText = item.desc || "";
                const isSellSide =
                  descText.toUpperCase().includes("SELL") ||
                  descText.toUpperCase().includes("SSL") ||
                  descText.toUpperCase().includes("EQUAL LOWS");

                const title = isSellSide ? "Sell-Side Liquidity" : "Buy-Side Liquidity";

                const cardClass = isSellSide
                  ? "border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.14),rgba(3,7,13,0.88))]"
                  : "border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(3,7,13,0.88))]";

                const titleClass = isSellSide ? "text-red-400" : "text-green-400";

                return (
                  <div key={idx} className={`rounded-2xl border p-4 ${cardClass}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold text-lg ${titleClass}`}>
                          💰 {title}
                        </div>

                        <div className="mt-2 text-white text-2xl font-bold">
                          {safeFormatPrice(item.price)}
                        </div>

                        {item.desc && (
                          <div className="mt-2 text-sm text-zinc-400">{item.desc}</div>
                        )}
                      </div>

                      {item.tag && (
                        <div
                          className={`rounded-lg px-3 py-1 text-sm whitespace-nowrap ${getStrengthBadgeClass(
                            item.tag
                          )}`}
                        >
                          {item.tag}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-zinc-400">Sem zonas de liquidez retornadas.</div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5 md:p-6">
          <div className="mb-4 text-white text-2xl font-bold">↗ Quebras de Estrutura</div>

          {structureBreaks.length > 0 ? (
            <div className="space-y-3">
              {structureBreaks.map((item, idx) => {
                const bullish = item.bullish === true;
                const cardClass = bullish
                  ? "border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(3,7,13,0.88))]"
                  : "border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.14),rgba(3,7,13,0.88))]";

                const titleClass = bullish ? "text-green-400" : "text-red-400";

                return (
                  <div key={idx} className={`rounded-2xl border p-4 ${cardClass}`}>
                    <div className={`font-semibold text-lg ${titleClass}`}>
                      {item.title ?? "Quebra de Estrutura"}
                    </div>

                    <div className="mt-2 text-white text-2xl font-bold">
                      {safeFormatPrice(item.price)}
                    </div>

                    {item.desc && (
                      <div className="mt-2 text-sm text-zinc-400 leading-relaxed">
                        {item.desc}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-zinc-400">Sem quebras de estrutura retornadas.</div>
          )}
        </div>
      </div>

      {summary && (
        <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(30,27,75,0.35),rgba(3,7,13,0.95))] p-5 text-white text-lg leading-relaxed">
          {summary}
        </div>
      )}
    </div>
  );
}

function HarmonicsTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const harmonics = analysisData?.harmonics;
  const assetType = analysisData?.asset_type;

  if (!analysisData) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
        Gere uma análise para visualizar os padrões harmônicos.
      </div>
    );
  }

  if (!harmonics) {
    return (
      <div className="rounded-3xl border border-yellow-900/40 bg-yellow-950/10 p-6 text-center text-zinc-300">
        <div className="text-xl font-semibold text-yellow-400">
          Dados harmônicos indisponíveis
        </div>
        <div className="mt-2 text-sm text-zinc-400">
          O backend não retornou o bloco <span className="text-white">harmonics</span>.
        </div>
      </div>
    );
  }

  const patterns = Array.isArray(harmonics.patterns) ? harmonics.patterns : [];
  const fibLevels = Array.isArray(harmonics.fib_levels) ? harmonics.fib_levels : [];

  const safeFormatPrice = (value?: number | null) => {
    if (typeof value !== "number") return "—";
    return formatPrice(value, assetType);
  };

  const getPatternTone = (bullish?: boolean) => {
    if (bullish === true) {
      return {
        border: "border-green-500/30",
        bg: "bg-[linear-gradient(135deg,rgba(5,46,22,0.55),rgba(12,18,30,0.96))]",
        title: "text-green-400",
        sub: "text-green-300",
        bar: "bg-green-400",
        card: "border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(3,7,13,0.88))]",
      };
    }

    return {
      border: "border-red-500/30",
      bg: "bg-[linear-gradient(135deg,rgba(69,10,10,0.45),rgba(12,18,30,0.96))]",
      title: "text-red-400",
      sub: "text-red-300",
      bar: "bg-red-400",
      card: "border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.14),rgba(3,7,13,0.88))]",
    };
  };

  const getRatioClass = (ok?: boolean) =>
    ok
      ? "border-green-500/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(3,7,13,0.9))]"
      : "border-red-500/25 bg-[linear-gradient(135deg,rgba(239,68,68,0.12),rgba(3,7,13,0.9))]";

  const getFibTypeClass = (type?: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("support") || t.includes("suporte")) {
      return "border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(3,7,13,0.9))] text-green-400";
    }
    return "border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.12),rgba(3,7,13,0.9))] text-red-400";
  };

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5 md:p-6">
        <div className="flex items-center gap-3 text-white text-2xl font-bold">
          <span className="text-pink-400">⬡</span>
          <span>Padrões Harmônicos</span>
        </div>
      </div>

      {patterns.length > 0 ? (
        <div className="space-y-5">
          {patterns.map((pattern, idx) => {
            const tone = getPatternTone(pattern.bullish);
            const confidence =
              typeof pattern.confidence === "number" ? pattern.confidence : 0;
            const ratios = Array.isArray(pattern.ratios) ? pattern.ratios : [];
            const prz = Array.isArray(pattern.prz) ? pattern.prz : [];
            const targets = Array.isArray(pattern.targets) ? pattern.targets : [];

            return (
              <div
                key={idx}
                className={`rounded-3xl border p-5 md:p-6 ${tone.border} ${tone.bg}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl leading-none">{pattern.icon ?? "⬡"}</div>
                    <div>
                      <div className="text-white text-3xl font-bold">
                        {pattern.name ?? "Padrão"}
                      </div>
                      <div className={`mt-1 text-base ${tone.title}`}>
                        {pattern.direction ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-zinc-400 text-lg">Confiança</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-400">
                      {typeof pattern.confidence === "number"
                        ? `${pattern.confidence}%`
                        : "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Formação</span>
                    <span className="text-white">
                      {typeof pattern.confidence === "number"
                        ? `${pattern.confidence}%`
                        : "—"}
                    </span>
                  </div>

                  <div className="mt-2 h-3 rounded-full overflow-hidden bg-zinc-800">
                    <div
                      className={`h-full ${tone.bar}`}
                      style={{ width: `${Math.max(0, Math.min(100, confidence))}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 text-yellow-400 text-sm font-medium">
                  △ Ratios de Fibonacci (Prova)
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ratios.length > 0 ? (
                    ratios.map((ratio, ratioIdx) => (
                      <div
                        key={ratioIdx}
                        className={`rounded-2xl border p-4 ${getRatioClass(ratio.ok)}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-white text-lg font-bold">
                              {ratio.key ?? "—"}
                            </div>
                            <div className="mt-2 text-xs text-zinc-500">
                              esp: {ratio.expected ?? "—"}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-white text-lg font-bold">
                              {ratio.value ?? "—"}
                            </div>
                            <div
                              className={`mt-2 text-sm ${
                                ratio.ok ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {ratio.ok ? "◉" : "⊗"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-zinc-400">Sem ratios retornados.</div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-cyan-500/20 bg-[linear-gradient(135deg,rgba(6,78,115,0.18),rgba(3,7,13,0.9))] p-5 text-center">
                    <div className="text-zinc-400 text-lg">PRZ</div>
                    <div className="mt-2 text-white text-2xl font-bold whitespace-pre-line">
                      {prz.length > 0
                        ? prz.map((v) => safeFormatPrice(v)).join("\n")
                        : "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(3,7,13,0.9))] p-5 text-center">
                    <div className="text-zinc-400 text-lg">Alvos</div>
                    <div className="mt-2 text-green-400 text-2xl font-bold whitespace-pre-line">
                      {targets.length > 0
                        ? targets.map((v) => safeFormatPrice(v)).join("\n")
                        : "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-red-500/20 bg-[linear-gradient(135deg,rgba(127,29,29,0.25),rgba(3,7,13,0.9))] p-5 text-center">
                    <div className="text-zinc-400 text-lg">Stop</div>
                    <div className="mt-2 text-red-400 text-2xl font-bold">
                      {safeFormatPrice(pattern.stop)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
          Nenhum padrão harmônico detectado para este ativo/timeframe.
        </div>
      )}

      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5 md:p-6">
        <div className="flex items-center gap-3 mb-4 text-white text-2xl font-bold">
          <span className="text-yellow-400">△</span>
          <span>Níveis de Fibonacci</span>
        </div>

        {fibLevels.length > 0 ? (
          <div className="space-y-3">
            {fibLevels.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border px-4 py-4 grid grid-cols-3 items-center gap-4 ${getFibTypeClass(
                  item.type
                )}`}
              >
                <div className="text-white text-xl font-semibold flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full inline-block ${
                      (item.type || "").toLowerCase().includes("support") ||
                      (item.type || "").toLowerCase().includes("suporte")
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span>{item.level ?? "—"}</span>
                </div>

                <div className="text-white text-2xl font-bold text-center">
                  {safeFormatPrice(item.price)}
                </div>

                <div
                  className={`text-lg text-right ${
                    (item.type || "").toLowerCase().includes("support") ||
                    (item.type || "").toLowerCase().includes("suporte")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {(item.type || "").toUpperCase() || "—"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-zinc-400">Sem níveis de Fibonacci retornados.</div>
        )}
      </div>
    </div>
  );
}

function WegdTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const wegd = analysisData?.wegd;
  const assetType = analysisData?.asset_type;
  const [subTab, setSubTab] = useState("Wyckoff");
  const subTabs = ["Wyckoff", "Elliott", "Gann", "Dow"];

  if (!analysisData) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
        Gere uma análise para visualizar o WEGD.
      </div>
    );
  }

  if (!wegd) {
    return (
      <div className="rounded-3xl border border-yellow-900/40 bg-yellow-950/10 p-6 text-center text-zinc-300">
        <div className="text-xl font-semibold text-yellow-400">
          Dados WEGD indisponíveis
        </div>
        <div className="mt-2 text-sm text-zinc-400">
          O backend não retornou o bloco <span className="text-white">wegd</span>.
        </div>
      </div>
    );
  }

  const bias = wegd.bias ?? null;
  const confluence = wegd.confluence ?? null;
  const summary = wegd.summary ?? null;

  const wyckoff = wegd.wyckoff ?? null;
  const elliott = wegd.elliott ?? null;
  const gann = wegd.gann ?? null;
  const dow = wegd.dow ?? null;

  const safeFormatPrice = (value?: number | null) => {
    if (typeof value !== "number") return "—";
    return formatPrice(value, assetType);
  };

  const normalize = (value?: string | null) => (value || "").toUpperCase();

  const getBiasClass = (value?: string | null) => {
    const v = normalize(value);

    if (["COMPRA", "ALTA", "BULLISH"].includes(v)) {
      return "bg-green-500/15 border-green-500/20 text-green-400";
    }

    if (["VENDA", "BAIXA", "BEARISH"].includes(v)) {
      return "bg-red-500/15 border-red-500/20 text-red-400";
    }

    return "bg-zinc-900 border-zinc-800 text-zinc-300";
  };

  const getTrendTone = (value?: string | null) => {
    const v = normalize(value);

    if (["ALTA", "COMPRA", "BULLISH"].includes(v)) {
      return {
        card: "border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(3,7,13,0.9))]",
        text: "text-green-400",
      };
    }

    if (["BAIXA", "VENDA", "BEARISH"].includes(v)) {
      return {
        card: "border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.14),rgba(3,7,13,0.9))]",
        text: "text-red-400",
      };
    }

    return {
      card: "border-yellow-500/20 bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(3,7,13,0.9))]",
      text: "text-yellow-300",
    };
  };

  const getSubTabIcon = (tab: string) => {
    if (tab === "Wyckoff") return "〽";
    if (tab === "Elliott") return "≋";
    if (tab === "Gann") return "◎";
    return "📊";
  };

  const progressBar = (value?: number | null, colorClass = "bg-cyan-400") => {
    const safe = typeof value === "number" ? Math.max(0, Math.min(100, value)) : 0;

    return (
      <div className="mt-3 h-3 rounded-full overflow-hidden bg-zinc-800">
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${safe}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-cyan-500/20 bg-[linear-gradient(135deg,rgba(8,145,178,0.22),rgba(49,46,129,0.14),rgba(3,7,13,0.96))] p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5eead4,#fde047)] text-white font-bold text-2xl shadow-[0_0_25px_rgba(45,212,191,0.18)]">
              W
            </div>

            <div>
              <div className="text-white text-3xl font-bold">Análise WEGD</div>
              <div className="text-zinc-400">Wyckoff • Elliott • Gann • Dow</div>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`inline-flex rounded-2xl border px-5 py-3 text-2xl font-bold ${getBiasClass(
                bias
              )}`}
            >
              {bias ?? "—"}
            </div>
            <div className="mt-2 text-zinc-400">
              Confluência: {confluence ?? "—"}
            </div>
          </div>
        </div>

        {summary && (
          <div className="mt-5 text-zinc-300 text-lg">{summary}</div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-2 flex flex-wrap gap-2">
        {subTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSubTab(tab)}
            className={`flex-1 min-w-[140px] px-3 py-2 rounded-xl text-sm border transition ${
              subTab === tab
                ? "bg-black text-white border-zinc-800 font-semibold"
                : "bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span className="mr-2">{getSubTabIcon(tab)}</span>
            {tab}
          </button>
        ))}
      </div>

      {subTab === "Wyckoff" && (
        <div className="space-y-4">
          {wyckoff ? (
            <>
              <div className="rounded-3xl border border-zinc-800 bg-slate-500/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white text-2xl font-bold">
                      {wyckoff.phase ?? "—"}
                    </div>
                    <div className="text-zinc-300 mt-1">
                      Fase de transição ou indefinição
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white text-5xl font-bold">
                      {typeof wyckoff.progress === "number"
                        ? `${wyckoff.progress}%`
                        : "—"}
                    </div>
                    <div className="text-zinc-300">Progresso</div>
                  </div>
                </div>

                {progressBar(wyckoff.progress, "bg-zinc-200")}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                  <div className="text-white text-2xl font-bold mb-4">
                    Ciclo de Mercado
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="rounded-2xl bg-zinc-900/70 p-5 text-center">
                      <div className="text-zinc-400">Atual</div>
                      <div className="text-white text-3xl font-bold mt-2">
                        {wyckoff.phase ?? "—"}
                      </div>
                    </div>

                    <div className="text-center text-zinc-400 text-4xl">→</div>

                    <div className="rounded-2xl bg-cyan-950/30 p-5 text-center border border-cyan-900/30">
                      <div className="text-zinc-400">Próximo</div>
                      <div className="text-cyan-400 text-3xl font-bold mt-2">
                        {wyckoff.next_phase ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="text-zinc-400 mt-4 text-center">
                    Confiança:{" "}
                    {typeof wyckoff.confidence === "number"
                      ? `${wyckoff.confidence}%`
                      : "—"}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                  <div className="text-white text-2xl font-bold mb-4">
                    Composite Man
                  </div>

                  <div className="rounded-2xl bg-zinc-900/70 p-8 text-center">
                    <div className="h-12 w-12 rounded-full border-4 border-slate-400 mx-auto mb-4" />
                    <div className="text-slate-300 text-3xl font-bold">
                      {wyckoff.composite_man ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                <div className="text-white text-2xl font-bold mb-4">
                  Eventos Wyckoff
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div>
                    <div className="text-green-400 font-semibold mb-3">✓ Confirmados</div>

                    {(wyckoff.events_confirmed ?? []).length > 0 ? (
                      (wyckoff.events_confirmed ?? []).map((event, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-green-900/40 bg-green-950/25 p-4 flex items-start justify-between gap-4 mb-3"
                        >
                          <div>
                            <div className="text-green-400 text-2xl font-bold">
                              {event.name ?? "Evento"}
                            </div>
                            <div className="text-zinc-400 mt-1">
                              {event.desc ?? "—"}
                            </div>
                          </div>

                          <div className="text-white font-semibold">
                            {safeFormatPrice(event.price)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-400">Nenhum evento confirmado.</div>
                    )}
                  </div>

                  <div>
                    <div className="text-yellow-400 font-semibold mb-3">⏳ Pendentes</div>

                    {(wyckoff.events_pending ?? []).length > 0 ? (
                      (wyckoff.events_pending ?? []).map((event, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-yellow-900/30 bg-yellow-950/15 p-4 mb-3"
                        >
                          <div className="text-zinc-200 font-semibold">
                            {event.name ?? "Evento"}
                          </div>
                          <div className="text-zinc-400 mt-1">
                            {event.desc ?? "—"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-400">Todos eventos confirmados</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                <div className="text-white text-2xl font-bold mb-4">
                  Análise de Volume
                </div>

                <div className="rounded-2xl bg-yellow-950/20 border border-yellow-900/30 p-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white text-lg font-bold">
                      {wyckoff.volume_state ?? "—"}
                    </div>
                    <div className="text-zinc-400 mt-1 text-xs">
                      Volume e esforço no contexto atual
                    </div>
                  </div>

                  <div className="text-yellow-400 text-2xl font-bold">
                    {wyckoff.volume_label ?? "—"}
                  </div>
                </div>
              </div>

              {summary && (
                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(49,46,129,0.35),rgba(3,7,13,0.95))] p-5 text-white text-lg leading-relaxed">
                  {summary}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
              Sem dados Wyckoff.
            </div>
          )}
        </div>
      )}

      {subTab === "Elliott" && (
        <div className="space-y-4">
          {elliott ? (
            <>
              <div className="rounded-3xl border border-yellow-900/40 bg-[linear-gradient(135deg,rgba(120,53,15,0.32),rgba(3,7,13,0.96))] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-yellow-400 text-4xl">≋</div>
                    <div>
                      <div className="text-zinc-400">Onda Atual</div>
                      <div className="text-white text-2xl font-bold mt-1">
                        {elliott.current_wave ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 font-bold inline-flex">
                      {elliott.mode ?? "—"}
                    </div>
                    <div className="text-zinc-400 mt-1 text-xs">
                      Confiança:{" "}
                      {typeof elliott.confidence === "number"
                        ? `${elliott.confidence}%`
                        : "—"}
                    </div>
                  </div>
                </div>

                {progressBar(elliott.progress, "bg-yellow-400")}

                <div className="mt-3 text-zinc-400">
                  Progresso:{" "}
                  {typeof elliott.progress === "number"
                    ? `${elliott.progress}%`
                    : "—"}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                <div className="text-white text-xl font-bold mb-4">
                  Contagem de Ondas
                </div>

                {(elliott.wave_points ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {(elliott.wave_points ?? []).map((point, i) => {
                      const green =
                        (point.type || "").toLowerCase().includes("green");

                      return (
                        <div
                          key={i}
                          className={`px-3 py-2 rounded-2xl border min-w-[90px] text-center ${
                            green
                              ? "border-green-900/40 bg-green-950/25"
                              : "border-yellow-900/40 bg-yellow-950/25"
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              green ? "text-green-400" : "text-yellow-400"
                            }`}
                          >
                            {point.label ?? "—"}
                          </div>
                          <div className="text-zinc-400 text-sm mt-1">
                            {safeFormatPrice(point.price)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-zinc-400">Sem contagem de ondas retornada.</div>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-cyan-900/40 bg-cyan-950/20 p-6 text-center">
                  <div className="text-zinc-400">Próxima Onda</div>
                  <div className="text-cyan-400 text-2xl font-bold mt-2">
                    {elliott.next_wave ?? "—"}
                  </div>
                  <div className="text-zinc-500 mt-1">Esperada</div>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-6">
                  <div className="text-white text-xl font-bold mb-4">
                    Alvos de Fibonacci
                  </div>
                  <div className="text-zinc-400">(aguardando backend específico)</div>
                </div>
              </div>

              <div className="rounded-3xl border border-red-900/40 bg-red-950/25 p-6 flex items-center justify-between">
                <div>
                  <div className="text-red-400 text-lg font-bold">
                    Nível de Invalidação
                  </div>
                  <div className="text-zinc-400 text-sm">
                    Se rompido, a contagem é invalidada
                  </div>
                </div>

                <div className="text-red-400 text-2xl font-bold">
                  {safeFormatPrice(elliott.invalidation)}
                </div>
              </div>

              {summary && (
                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(88,28,135,0.28),rgba(3,7,13,0.95))] p-5 text-white text-lg leading-relaxed">
                  {summary}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
              Sem dados Elliott.
            </div>
          )}
        </div>
      )}

      {subTab === "Gann" && (
        <div className="space-y-4">
          {gann ? (
            <>
              <div className="rounded-3xl border border-yellow-900/40 bg-[linear-gradient(135deg,rgba(120,53,15,0.26),rgba(6,78,115,0.22),rgba(3,7,13,0.96))] p-6">
                <div className="text-zinc-400">Ângulo Dominante</div>
                <div className="text-white text-2xl font-bold mt-1">
                  {gann.dominant_angle ?? "—"}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                  <div className="text-green-400 font-bold text-2xl mb-4">
                    Ângulos de Suporte
                  </div>

                  {(gann.support_angles ?? []).length > 0 ? (
                    <div className="space-y-3">
                      {(gann.support_angles ?? []).map((a, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(3,7,13,0.9))] px-4 py-4 flex items-center justify-between gap-4"
                        >
                          <span className="text-zinc-200 text-lg">{a.angle ?? "—"}</span>
                          <span className="text-green-400 font-bold text-2xl">
                            {safeFormatPrice(a.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-zinc-400">Sem suportes de Gann.</div>
                  )}
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                  <div className="text-red-400 font-bold text-2xl mb-4">
                    Ângulos de Resistência
                  </div>

                  {(gann.resistance_angles ?? []).length > 0 ? (
                    <div className="space-y-3">
                      {(gann.resistance_angles ?? []).map((a, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.12),rgba(3,7,13,0.9))] px-4 py-4 flex items-center justify-between gap-4"
                        >
                          <span className="text-zinc-200 text-lg">{a.angle ?? "—"}</span>
                          <span className="text-red-400 font-bold text-2xl">
                            {safeFormatPrice(a.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-zinc-400">Sem resistências de Gann.</div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                <div className="text-white text-2xl font-bold mb-4">
                  Quadrado do Tempo
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-cyan-950/20 p-4 text-center">
                    <div className="text-zinc-400">Ciclo Atual</div>
                    <div className="text-cyan-400 text-xl font-bold mt-1">
                      {gann.current_cycle_days ?? "—"} dias no ciclo atual
                    </div>
                  </div>

                  <div className="rounded-2xl bg-yellow-950/20 p-4 text-center">
                    <div className="text-zinc-400">Próxima Reversão</div>
                    <div className="text-yellow-400 text-xl font-bold mt-1">
                      {gann.next_reversal ?? "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-yellow-950/20 p-4 text-center">
                    <div className="text-zinc-400">Dias no Ciclo</div>
                    <div className="text-yellow-400 text-xl font-bold mt-1">
                      {gann.days_in_cycle ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                <div className="text-white text-2xl font-bold mb-4">
                  Quadrado do Preço
                </div>

                {(gann.price_square_levels ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {(gann.price_square_levels ?? []).map((p, i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-zinc-900/60 border border-zinc-800 px-4 py-4 flex items-center justify-between gap-4"
                      >
                        <span className="text-white text-2xl font-semibold">
                          {safeFormatPrice(p.price)}
                        </span>
                        <span className="text-zinc-400 uppercase">
                          {p.strength ?? "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-zinc-400">Sem níveis do quadrado do preço.</div>
                )}
              </div>

              {summary && (
                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(120,53,15,0.25),rgba(3,7,13,0.95))] p-5 text-white text-lg leading-relaxed">
                  {summary}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
              Sem dados Gann.
            </div>
          )}
        </div>
      )}

      {subTab === "Dow" && (
        <div className="space-y-4">
          {dow ? (
            <>
              <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                <div className="text-white text-2xl font-bold mb-4">
                  Tendências de Dow
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Primária", value: dow.primary },
                    { label: "Secundária", value: dow.secondary },
                    { label: "Menor", value: dow.minor },
                  ].map((item, idx) => {
                    const tone = getTrendTone(item.value);

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-5 text-center ${tone.card}`}
                      >
                        <div className="text-zinc-400">{item.label}</div>
                        <div className={`text-3xl font-bold mt-2 ${tone.text}`}>
                          {item.value ?? "—"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                <div className="text-white text-2xl font-bold mb-4">
                  Fase de Mercado
                </div>

                <div className="rounded-2xl bg-orange-950/20 border border-orange-900/30 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-white text-2xl font-bold">
                      {dow.market_phase ?? "—"}
                    </div>

                    <div className="text-white text-2xl font-bold">
                      {typeof dow.market_phase_score === "number"
                        ? `${dow.market_phase_score}%`
                        : "—"}
                    </div>
                  </div>

                  {progressBar(dow.market_phase_score, "bg-orange-500")}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.95),rgba(3,7,13,0.96))] p-5">
                <div className="text-white text-2xl font-bold mb-4">
                  Confirmação de Dow
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-red-900/40 bg-red-950/25 p-5 text-center">
                    <div className="text-zinc-400">Preço x Volume</div>
                    <div className="text-red-400 text-2xl font-bold mt-2">
                      {dow.price_volume_confirmation ?? "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-red-900/40 bg-red-950/25 p-5 text-center">
                    <div className="text-zinc-400">Índices</div>
                    <div className="text-red-400 text-2xl font-bold mt-2">
                      {dow.indices_confirmation ?? "—"}
                    </div>
                  </div>
                </div>

                {dow.volume_note && (
                  <div className="text-zinc-400 text-sm mt-4">{dow.volume_note}</div>
                )}
              </div>

              {summary && (
                <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(6,78,115,0.28),rgba(3,7,13,0.95))] p-5 text-white text-lg leading-relaxed">
                  {summary}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
              Sem dados Dow.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProbabilisticaTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const p = analysisData?.probabilistic;
  const assetType = analysisData?.asset_type;

  if (!analysisData) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
        Gere uma análise para visualizar a aba probabilística.
      </div>
    );
  }

  if (!p) {
    return (
      <div className="rounded-3xl border border-yellow-900/40 bg-yellow-950/10 p-6 text-center text-zinc-300">
        <div className="text-xl font-semibold text-yellow-400">
          Dados probabilísticos indisponíveis
        </div>
        <div className="mt-2 text-sm text-zinc-400">
          O backend não retornou o bloco <span className="text-white">probabilistic</span>.
        </div>
      </div>
    );
  }

  const winRateGeneral =
    typeof p.win_rate_general === "number" ? p.win_rate_general : null;
  const winRateLong =
    typeof p.win_rate_long === "number" ? p.win_rate_long : null;
  const winRateShort =
    typeof p.win_rate_short === "number" ? p.win_rate_short : null;

  const historical = p.historical ?? null;
  const monteCarlo = p.monte_carlo ?? null;
  const scenarios = p.scenarios ?? null;
  const seasonality = Array.isArray(p.seasonality) ? p.seasonality : [];
  const riskMetrics = p.risk_metrics ?? null;

  const safePct = (value?: number | null, digits = 2) =>
    typeof value === "number" ? `${value.toFixed(digits)}%` : "—";

  const safeNum = (value?: number | null, digits = 2) =>
    typeof value === "number" ? value.toFixed(digits) : "—";

  const safeFormatPrice = (value?: number | null) => {
    if (typeof value !== "number") return "—";
    return formatPrice(value, assetType);
  };

  const clampPct = (value?: number | null) => {
    if (typeof value !== "number") return 0;
    return Math.max(0, Math.min(100, value));
  };

  const bullishPct = clampPct(scenarios?.bullish);
  const neutralPct = clampPct(scenarios?.neutral);
  const bearishPct = clampPct(scenarios?.bearish);

  const monteLow = typeof monteCarlo?.low === "number" ? monteCarlo.low : null;
  const monteMid = typeof monteCarlo?.mid === "number" ? monteCarlo.mid : null;
  const monteHigh = typeof monteCarlo?.high === "number" ? monteCarlo.high : null;
  const confidenceLevel =
    typeof monteCarlo?.confidence_level === "number"
      ? monteCarlo.confidence_level
      : null;

  const seasonalityWinText = (value?: number | null) => {
    if (typeof value !== "number") return "—";
    if (value >= 2) return "100% win";
    if (value >= 1) return "80% win";
    if (value >= 0.5) return "67% win";
    if (value >= 0) return "50% win";
    return "40% win";
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(135deg,rgba(10,16,28,0.96),rgba(3,7,13,0.98))] p-6 text-center">
          <div className="text-cyan-400 text-3xl">📊</div>
          <div className="mt-4 text-5xl font-bold text-white">
            {winRateGeneral !== null ? `${winRateGeneral.toFixed(0)}%` : "—"}
          </div>
          <div className="mt-2 text-zinc-400">Win Rate Geral</div>
        </div>

        <div className="rounded-3xl border border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(3,7,13,0.98))] p-6 text-center">
          <div className="text-green-400 text-3xl">↗</div>
          <div className="mt-4 text-5xl font-bold text-green-400">
            {winRateLong !== null ? `${winRateLong.toFixed(0)}%` : "—"}
          </div>
          <div className="mt-2 text-zinc-400">Win Rate Long</div>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(3,7,13,0.98))] p-6 text-center">
          <div className="text-red-400 text-3xl">↘</div>
          <div className="mt-4 text-5xl font-bold text-red-400">
            {winRateShort !== null ? `${winRateShort.toFixed(0)}%` : "—"}
          </div>
          <div className="mt-2 text-zinc-400">Win Rate Short</div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.96),rgba(3,7,13,0.98))] p-5 md:p-6">
        <div className="flex items-center gap-3 text-white text-2xl font-bold mb-5">
          <span className="text-cyan-400">🗓</span>
          <span>
            Estatísticas Históricas
            <span className="text-zinc-400 font-medium text-lg">
              {" "}
              ({historical?.periods ?? "—"} períodos)
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-zinc-900/70 p-5 text-center">
            <div className="text-white text-2xl font-bold">
              {safePct(historical?.return_pct)}
            </div>
            <div className="text-zinc-400 mt-1 text-xs">Retorno</div>
          </div>

          <div className="rounded-2xl bg-zinc-900/70 p-5 text-center">
            <div className="text-white text-2xl font-bold">
              {safePct(historical?.volatility_pct)}
            </div>
            <div className="text-zinc-400 mt-1 text-xs">Volatilidade</div>
          </div>

          <div className="rounded-2xl bg-zinc-900/70 p-5 text-center">
            <div className="text-white text-2xl font-bold">
              {safeNum(historical?.sharpe)}
            </div>
            <div className="text-zinc-400 mt-1 text-xs">Sharpe Ratio</div>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-5 text-center">
            <div className="text-red-400 text-2xl font-bold">
              {safePct(historical?.max_drawdown_pct, 0)}
            </div>
            <div className="text-zinc-400 mt-1 text-xs">Max Drawdown</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.96),rgba(3,7,13,0.98))] p-5 md:p-6">
        <div className="flex items-center gap-3 text-white text-2xl font-bold mb-5">
          <span className="text-purple-400">%</span>
          <span>
            Simulação Monte Carlo
            <span className="text-zinc-400 font-medium text-lg">
              {" "}
              ({confidenceLevel !== null ? `${confidenceLevel * 80}` : "—"} simulações)
            </span>
          </span>
        </div>

        <div className="relative mt-8 rounded-full h-8 bg-gradient-to-r from-red-500/70 via-cyan-400/70 to-green-500/70">
          <div className="absolute left-[27%] top-[-24px] flex flex-col items-center">
            <div className="h-14 w-[2px] bg-red-400" />
            <div className="mt-1 text-red-400 text-sm font-semibold">
              {safeFormatPrice(monteLow)}
            </div>
          </div>

          <div className="absolute left-[50%] top-[-24px] flex flex-col items-center">
            <div className="h-14 w-[2px] bg-cyan-400" />
            <div className="mt-1 text-cyan-400 text-sm font-semibold">
              {safeFormatPrice(monteMid)}
            </div>
          </div>

          <div className="absolute left-[73%] top-[-24px] flex flex-col items-center">
            <div className="h-14 w-[2px] bg-green-400" />
            <div className="mt-1 text-green-400 text-sm font-semibold">
              {safeFormatPrice(monteHigh)}
            </div>
          </div>
        </div>

        <div className="mt-14 text-center text-zinc-400 text-xl">
          Nível de confiança:{" "}
          <span className="text-cyan-400 font-bold">
            {confidenceLevel !== null ? `${confidenceLevel}%` : "—"}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.96),rgba(3,7,13,0.98))] p-5 md:p-6">
        <div className="text-white text-2xl font-bold mb-5">
          Cenários Probabilísticos
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xl mb-2">
              <span className="text-white font-semibold">Alta (Bullish)</span>
              <span className="text-white font-bold">
                {typeof scenarios?.bullish === "number"
                  ? `${scenarios.bullish.toFixed(0)}%`
                  : "—"}
              </span>
            </div>

            <div className="h-8 rounded-full overflow-hidden bg-zinc-800 relative">
              <div
                className="h-full bg-green-500"
                style={{ width: `${bullishPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white font-semibold">
                Alvo: {safeFormatPrice(monteHigh)}
              </div>
            </div>

            <div className="text-zinc-400 mt-1 text-xs">
              Cenário otimista baseado em volatilidade e tendência recente.
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xl mb-2">
              <span className="text-white font-semibold">Neutro (Base)</span>
              <span className="text-white font-bold">
                {typeof scenarios?.neutral === "number"
                  ? `${scenarios.neutral.toFixed(0)}%`
                  : "—"}
              </span>
            </div>

            <div className="h-8 rounded-full overflow-hidden bg-zinc-800 relative">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${neutralPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white font-semibold">
                Alvo: {safeFormatPrice(monteMid)}
              </div>
            </div>

            <div className="text-zinc-400 mt-1 text-xs">
              Cenário base/mediano da distribuição.
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xl mb-2">
              <span className="text-white font-semibold">Baixa (Bearish)</span>
              <span className="text-white font-bold">
                {typeof scenarios?.bearish === "number"
                  ? `${scenarios.bearish.toFixed(0)}%`
                  : "—"}
              </span>
            </div>

            <div className="h-8 rounded-full overflow-hidden bg-zinc-800 relative">
              <div
                className="h-full bg-red-500"
                style={{ width: `${bearishPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white font-semibold">
                Alvo: {safeFormatPrice(monteLow)}
              </div>
            </div>

            <div className="text-zinc-400 mt-1 text-xs">
              Cenário pessimista baseado em drawdown e pressão vendedora.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.96),rgba(3,7,13,0.98))] p-5 md:p-6">
        <div className="flex items-center gap-3 text-white text-2xl font-bold mb-5">
          <span className="text-orange-400">🕒</span>
          <span>Sazonalidade</span>
          <span className="text-zinc-400 font-medium text-lg">
            ({seasonality.length > 0 ? "10 anos, mediana Open→Close" : "sem base histórica"})
          </span>
        </div>

        {seasonality.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {seasonality.map((item, i) => {
              const positive = typeof item.value === "number" && item.value >= 0;

              return (
                <div
                  key={i}
                  className={`rounded-2xl border p-4 text-center ${
                    positive
                      ? "border-green-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(3,7,13,0.9))]"
                      : "border-red-500/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.12),rgba(3,7,13,0.9))]"
                  }`}
                >
                  <div className="text-white text-xl font-bold">
                    {item.month ?? "—"}
                  </div>

                  <div
                    className={`mt-2 text-2xl font-bold ${
                      positive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {typeof item.value === "number"
                      ? `${item.value >= 0 ? "+" : ""}${item.value.toFixed(2)}%`
                      : "—"}
                  </div>

                  <div className="text-zinc-400 mt-1 text-xs">
                    {seasonalityWinText(item.value)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-zinc-400">Sem sazonalidade retornada.</div>
        )}
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(10,16,28,0.96),rgba(3,7,13,0.98))] p-5 md:p-6">
        <div className="text-white text-2xl font-bold mb-5">
          Métricas de Risco
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-5 text-center">
            <div className="text-red-400 text-2xl font-bold">
              {safePct(riskMetrics?.var_95)}
            </div>
            <div className="text-zinc-400 mt-1 text-xs">VaR 95%</div>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-5 text-center">
            <div className="text-red-400 text-2xl font-bold">
              {safePct(riskMetrics?.expected_shortfall)}
            </div>
            <div className="text-zinc-400 mt-1 text-xs">Expected Shortfall</div>
          </div>

          <div className="rounded-2xl bg-zinc-900/70 p-5 text-center">
            <div className="text-white text-2xl font-bold">
              {safeNum(riskMetrics?.beta, 0)}
            </div>
            <div className="text-zinc-400 mt-1 text-xs">Beta</div>
          </div>

          <div className="rounded-2xl bg-zinc-900/70 p-5 text-center">
            <div className="text-white text-2xl font-bold">
              {safeNum(riskMetrics?.correlation, 0)}
            </div>
            <div className="text-zinc-400 mt-1 text-xs">Correlação</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalculadoraTab({
  analysisData,
}: {
  analysisData: AnalysisData | null;
}) {
  const [capital, setCapital] = useState("");
  const [risk, setRisk] = useState("Moderado");

  const riskMap: Record<string, { pct: number; label: string }> = {
    Conservador: { pct: 0.01, label: "0,5% - 1%" },
    Moderado: { pct: 0.02, label: "1% - 2%" },
    Agressivo: { pct: 0.03, label: "2% - 3%" },
  };

  const entry = analysisData?.entry ?? 0;
  const stop = analysisData?.stop ?? 0;
  const riskPerUnit = Math.abs(entry - stop);

  const cap = Number((capital || "0").replace(/\./g, "").replace(",", "."));
  const riskValue = cap * (riskMap[risk]?.pct || 0);
  const positionSize = riskPerUnit > 0 ? riskValue / riskPerUnit : 0;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-3">
        <div className="text-white text-2xl font-bold mb-2">
          Calculadora de Gestão de Risco
        </div>
        <div className="text-zinc-400">
          Calcule o tamanho ideal da sua posição em Reais (BRL)
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="text-zinc-400 mb-2">Seu Capital (BRL)</div>
        <Input
          value={capital}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCapital(e.target.value)
          }
          placeholder="Ex: 10.000,00"
          className="bg-zinc-900 border-zinc-700 text-white"
        />
        <div className="text-zinc-500 text-sm mt-2">
          Digite o valor da sua banca em Reais (R$)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Conservador", "Moderado", "Agressivo"].map((r) => (
          <div
            key={r}
            onClick={() => setRisk(r)}
            className={`cursor-pointer rounded-2xl border p-5 text-center transition ${
              risk === r
                ? "border-yellow-500 bg-yellow-950/20"
                : "border-zinc-800 bg-zinc-950/60"
            }`}
          >
            <div className="text-white text-xl font-bold">{r}</div>
            <div className="text-zinc-400 mt-1">Risco: {riskMap[r].label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-zinc-400">Risco (R$)</div>
            <div className="text-red-400 text-2xl font-bold">
              {formatBrl(riskValue)}
            </div>
          </div>
          <div>
            <div className="text-zinc-400">Distância do Stop</div>
            <div className="text-white text-lg font-bold">
              {riskPerUnit.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-zinc-400">Tamanho da Posição</div>
            <div className="text-green-400 text-2xl font-bold">
              {positionSize.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-cyan-950/30 to-zinc-950 p-5 text-white">
        Entrada: {formatPrice(entry)} | Stop: {formatPrice(stop)} | Gestão baseada
        em risco {risk} | Capital: {cap > 0 ? formatBrl(cap) : "R$ 0,00"}
      </div>
    </div>
  );
}

function TimingTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const timing = analysisData?.timing;
  const direction = analysisData?.direction ?? "NEUTRO";
  const confidence = Number(analysisData?.confidence ?? 0);
  const asset = analysisData?.asset ?? "Ativo";
  const timeframe = analysisData?.timeframe ?? "5m";

  const marketName = timing?.market_name ?? "Mercado";
  const timezone = timing?.timezone ?? "America/Sao_Paulo";
  const status = timing?.status ?? "ATIVO";
  const bestWindowLabel = timing?.best_window_label ?? "Janela principal";
  const notes =
    timing?.notes ??
    "Timing calculado com base no timeframe selecionado, volatilidade, direção e confluência atual.";

  const recommended =
    timing?.recommended_windows && timing.recommended_windows.length > 0
      ? timing.recommended_windows
      : [
          {
            start: "09:00",
            end: "11:00",
            reason: "Maior liquidez e melhor leitura de fluxo.",
          },
          {
            start: "15:00",
            end: "17:00",
            reason: "Retomada de volume e possíveis movimentos direcionais.",
          },
        ];

  const avoid =
    timing?.avoid_windows && timing.avoid_windows.length > 0
      ? timing.avoid_windows
      : [
          {
            start: "12:00",
            end: "13:30",
            reason: "Menor liquidez e maior risco de ruído.",
          },
        ];

  const directionTone =
    direction === "COMPRA"
      ? "text-emerald-300"
      : direction === "VENDA"
      ? "text-red-300"
      : "text-yellow-300";

  const timingScore = Number(analysisData?.modules?.timing ?? confidence ?? 50);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(180deg,rgba(8,13,24,0.98),rgba(0,0,0,0.98))] p-6 shadow-2xl shadow-cyan-500/10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Timing Operacional IA
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Melhores Horários para Operar
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {asset} • {timeframe} • {marketName} • Timezone: {timezone}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
              <p className="text-xs text-zinc-500">Status</p>
              <p className="mt-1 font-black text-emerald-300">{status}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
              <p className="text-xs text-zinc-500">Sinal</p>
              <p className={`mt-1 font-black ${directionTone}`}>{direction}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
              <p className="text-xs text-zinc-500">Timing</p>
              <p className="mt-1 font-black text-cyan-300">
                {timingScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/[0.05] p-6">
        <h3 className="text-xl font-black text-cyan-300">
          {bestWindowLabel}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-300">{notes}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/[0.05] p-6">
          <h3 className="mb-4 text-xl font-black text-emerald-300">
            ✓ Horários Recomendados
          </h3>

          <div className="space-y-3">
            {recommended.map((item, idx) => (
              <div
                key={`${item.start}-${item.end}-${idx}`}
                className="rounded-2xl border border-emerald-400/15 bg-black/35 p-5"
              >
                <div className="text-2xl font-black text-emerald-300">
                  {item.start} - {item.end}
                </div>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-red-400/20 bg-red-400/[0.05] p-6">
          <h3 className="mb-4 text-xl font-black text-red-300">
            ✕ Horários a Evitar
          </h3>

          <div className="space-y-3">
            {avoid.map((item, idx) => (
              <div
                key={`${item.start}-${item.end}-${idx}`}
                className="rounded-2xl border border-red-400/15 bg-black/35 p-5"
              >
                <div className="text-2xl font-black text-red-300">
                  {item.start} - {item.end}
                </div>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6">
        <h3 className="text-xl font-black text-white">
          Leitura de Timing da IA
        </h3>

        <p className="mt-3 text-sm leading-6 text-zinc-300">
          {direction === "COMPRA"
            ? `O timing atual favorece compras seletivas em ${asset}, principalmente dentro das janelas recomendadas e somente com confirmação de preço.`
            : direction === "VENDA"
            ? `O timing atual favorece vendas seletivas em ${asset}, principalmente quando houver confirmação de rejeição ou continuidade vendedora.`
            : `O timing atual está neutro para ${asset}. O ideal é aguardar uma janela com maior liquidez e confirmação direcional antes de operar.`}
        </p>
      </div>
    </div>
  );
}

function SinalFinalTab({ analysisData }: { analysisData: AnalysisData | null }) {
  const signal = analysisData?.final_signal;
  const assetType = analysisData?.asset_type;

  if (!analysisData) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
        Gere uma análise para visualizar o sinal final.
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="rounded-3xl border border-yellow-900/40 bg-yellow-950/10 p-6 text-center text-zinc-300">
        <div className="text-xl font-semibold text-yellow-400">
          Sinal final indisponível
        </div>
        <div className="mt-2 text-sm text-zinc-400">
          O backend não retornou o bloco <span className="text-white">final_signal</span>.
        </div>
      </div>
    );
  }

  const direction = signal.direction ?? null;
  const strength = signal.strength ?? null;
  const confidence =
    typeof signal.confidence === "number" ? signal.confidence : null;
  const entry =
    typeof signal.entry === "number" ? signal.entry : null;
  const stop =
    typeof signal.stop === "number" ? signal.stop : null;
  const target =
    typeof signal.target === "number" ? signal.target : null;
  const riskReward =
    typeof signal.risk_reward === "number" ? signal.risk_reward : null;
  const confluenceScore =
    typeof signal.confluence_score === "number" ? signal.confluence_score : null;
  const verdict = signal.verdict ?? null;
  const justification = Array.isArray(signal.justification)
    ? signal.justification.filter(Boolean)
    : [];

  const normalizedDirection = (direction || "").toUpperCase();

  const color =
    normalizedDirection === "COMPRA"
      ? "text-green-400"
      : normalizedDirection === "VENDA"
      ? "text-red-400"
      : "text-yellow-400";

  const bgCard =
    normalizedDirection === "COMPRA"
      ? "border-green-900/60 bg-gradient-to-br from-green-950/30 via-zinc-950 to-black"
      : normalizedDirection === "VENDA"
      ? "border-red-900/60 bg-gradient-to-br from-red-950/30 via-zinc-950 to-black"
      : "border-yellow-900/60 bg-gradient-to-br from-yellow-950/20 via-zinc-950 to-black";

  const icon =
    normalizedDirection === "COMPRA"
      ? "↗"
      : normalizedDirection === "VENDA"
      ? "↘"
      : "→";

  const confidenceColor =
    confidence === null
      ? "text-zinc-400"
      : confidence >= 70
      ? "text-green-400"
      : confidence >= 50
      ? "text-yellow-400"
      : "text-red-400";

  const safeFormatPrice = (value: number | null) => {
    if (value === null) return "—";
    return formatPrice(value, assetType);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-3">
        <div className="text-white text-lg font-bold">🎯 Sinal Final</div>
        <div className="text-zinc-400 mt-1 text-xs">
          Consolidação final da leitura da IA com base nos módulos retornados.
        </div>
      </div>

      <div className={`rounded-xl border p-3 ${bgCard}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`h-12 w-12 rounded-3xl border flex items-center justify-center text-3xl ${
                normalizedDirection === "COMPRA"
                  ? "bg-green-500/15 border-green-500/30 text-green-400"
                  : normalizedDirection === "VENDA"
                  ? "bg-red-500/15 border-red-500/30 text-red-400"
                  : "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
              }`}
            >
              {icon}
            </div>

            <div>
              <div className="text-zinc-500 uppercase tracking-wide text-sm">
                Direção final
              </div>
              <div className={`text-2xl font-bold mt-1 ${color}`}>
                {direction ?? "—"}
              </div>
              <div className="text-zinc-400 mt-2 text-lg">
                Força:{" "}
                <span className="text-white font-semibold">
                  {strength ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-zinc-500 text-sm uppercase tracking-wide">
              Confiança
            </div>
            <div className={`text-2xl font-bold mt-1 ${confidenceColor}`}>
              {confidence !== null ? `${confidence}%` : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
          <div className="text-zinc-400 text-sm">Entrada</div>
          <div className="text-white text-lg font-bold mt-1">
            {safeFormatPrice(entry)}
          </div>
        </div>

        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-3">
          <div className="text-red-400 text-sm">Stop</div>
          <div className="text-red-400 text-lg font-bold mt-1">
            {safeFormatPrice(stop)}
          </div>
        </div>

        <div className="rounded-xl border border-green-900/50 bg-green-950/20 p-3">
          <div className="text-green-400 text-sm">Alvo</div>
          <div className="text-green-400 text-lg font-bold mt-1">
            {safeFormatPrice(target)}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
          <div className="text-zinc-400 text-sm">Risco/Retorno</div>
          <div className="text-cyan-400 text-lg font-bold mt-1">
            {riskReward !== null ? `1:${riskReward.toFixed(2)}` : "—"}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
          <div className="text-zinc-400 text-sm">Score de Confluência</div>
          <div className="text-white text-lg font-bold mt-1">
            {confluenceScore !== null ? confluenceScore : "—"}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
        <div className="text-white font-semibold mb-2">📊 Justificativa</div>

        {justification.length > 0 ? (
          <div className="space-y-1">
            {justification.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-800 bg-black/20 px-3 py-2 text-zinc-300"
              >
                • {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-zinc-400">Sem justificativas retornadas.</div>
        )}
      </div>

      {verdict && (
        <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5">
          <div className="text-cyan-400 font-bold text-lg">{verdict}</div>
        </div>
      )}
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 text-center text-zinc-400">
      Conteúdo da aba <span className="text-white font-semibold">{label}</span> em desenvolvimento
    </div>
  );
}

function AiThinkingOverlay({
  progress,
  asset,
  timeframe,
}: {
  progress: number;
  asset: string;
  timeframe: string;
}) {
  const stepIndex = Math.min(
    AI_LOADING_STEPS.length - 1,
    Math.floor((progress / 100) * AI_LOADING_STEPS.length)
  );

  const currentStep = AI_LOADING_STEPS[stepIndex] || "Processando análise...";

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(3,7,13,0.98),rgba(6,16,12,0.98))] p-6 md:p-8 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
        <div className="flex items-start gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
            <div className="h-7 w-7 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.18)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                IA em processamento
              </h3>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                analisando {asset}
              </span>
            </div>

            <p className="mt-2 text-zinc-400 text-sm md:text-base">
              A Gluck&apos;s Trader IA está cruzando contexto, tendência,
              confluência, Smart Money e timing para montar a análise.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-zinc-400">Etapa atual</div>
              <div className="mt-1 text-lg font-semibold text-emerald-300">
                {currentStep}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-zinc-400">Timeframe</div>
              <div className="mt-1 text-lg font-semibold text-white">
                {timeframe === "5m" ? "5 Minutos" : timeframe}
              </div>
            </div>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500">
              Processamento neural em andamento...
            </span>
            <span className="font-bold text-emerald-300">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GaugeMeter({
  title,
  value,
  label,
  subtitle,
}: {
  title: string;
  value: number;
  label: string;
  subtitle?: string;
}) {
  const safe = Math.max(0, Math.min(100, value));
  const angle = -90 + (safe / 100) * 180;

  const labelClass =
    safe >= 60
      ? "bg-emerald-400/15 text-emerald-200 border border-emerald-300/40 shadow-[0_0_25px_rgba(0,255,170,0.22)]"
      : safe <= 40
      ? "bg-red-500/15 text-red-200 border border-red-400/40 shadow-[0_0_25px_rgba(255,0,80,0.22)]"
      : "bg-zinc-300/10 text-zinc-100 border border-zinc-400/30 shadow-[0_0_20px_rgba(255,255,255,0.08)]";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(9,13,24,0.98),rgba(0,0,0,0.96))] p-5 shadow-2xl">
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-black text-white">{title}</h4>
          {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
        </div>

        <span className="text-xs font-bold text-zinc-400">
          {safe.toFixed(0)}%
        </span>
      </div>

      <div className="relative z-10 mx-auto mt-2 h-[110px] w-[190px] max-w-full">
        <svg
          viewBox="0 0 260 160"
          className="h-full w-full drop-shadow-[0_0_18px_rgba(0,255,170,0.12)]"
        >
          {/* VENDA */}
          <path
            d="M 35 130 A 95 95 0 0 1 94 42"
            fill="none"
            stroke="rgba(221, 3, 3, 0.95)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* NEUTRO */}
          <path
            d="M 98 40 A 95 95 0 0 1 162 40"
            fill="none"
            stroke="rgba(220,220,220,0.9)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* COMPRA */}
          <path
            d="M 166 42 A 95 95 0 0 1 225 130"
            fill="none"
            stroke="rgba(2, 179, 11, 0.95)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* sombra interna */}
          <path
            d="M 35 130 A 95 95 0 0 1 225 130"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />

          {/* ponteiro */}
          <line
            x1="130"
            y1="130"
            x2="130"
            y2="55"
            stroke="rgba(226,232,240,0.9)"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 130 130)`}
          />

          <circle cx="130" cy="130" r="7" fill="rgba(226,232,240,0.95)" />
        </svg>

        <div className="pointer-events-none absolute left-[16px] top-[116px] text-xs font-black text-red-300">
          Venda
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[15px] -translate-x-1/2 text-xs font-black text-zinc-300">
          Neutro
        </div>

        <div className="pointer-events-none absolute right-[14px] top-[116px] text-xs font-black text-emerald-300">
          Compra
        </div>
      </div>

      <div
        className={`relative z-10 mx-auto mt-1 w-fit rounded-full px-5 py-2 text-sm font-black ${labelClass}`}
      >
        {label}
      </div>
    </div>
  );
}

function TechnicalOverviewPanel({
  asset,
  tf,
  analysisData,
}: {
  asset: string;
  tf: string;
  analysisData: AnalysisData | null;
}) {
  const tech = analysisData?.technical;

  if (!analysisData || !tech) {
    return (
      <div className="flex h-[620px] items-center justify-center rounded-2xl border border-zinc-800 bg-black p-8 text-center">
        <div>
          <Brain className="mx-auto h-12 w-12 text-cyan-300" />

          <h3 className="mt-4 text-2xl font-black text-white">
            Painel Técnico IA
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Clique em “Gerar Análise” para carregar os termômetros técnicos do ativo.
          </p>
        </div>
      </div>
    );
  }

  const buySignals = Number(tech.buy_signals ?? 0);
  const sellSignals = Number(tech.sell_signals ?? 0);
  const neutralSignals = Number(tech.neutral_signals ?? 0);

  const totalSignals =
    buySignals + sellSignals + neutralSignals;

  const indicatorValue =
    totalSignals > 0
      ? Math.round(
          ((buySignals + neutralSignals * 0.5) / totalSignals) * 100
        )
      : 50;

  const ema9 =
    typeof tech.ema9 === "number" ? tech.ema9 : null;

  const ema21 =
    typeof tech.ema21 === "number" ? tech.ema21 : null;

  const movingAverages = tech.moving_averages ?? [];

  const maActions = movingAverages.flatMap((ma) => [
    ma.simple_action,
    ma.exponential_action,
  ]);

  const maBuy = maActions.filter(
    (a) => a === "Compra"
  ).length;

  const maSell = maActions.filter(
    (a) => a === "Venda"
  ).length;

  const maNeutral = maActions.filter(
    (a) => a === "Neutro" || a === "—"
  ).length;

  const maTotal = maBuy + maSell + maNeutral;

  const movingAverageValue =
    maTotal > 0
      ? Math.round(
          ((maBuy + maNeutral * 0.5) / maTotal) * 100
        )
      : ema9 !== null && ema21 !== null
      ? ema9 > ema21
        ? 70
        : ema9 < ema21
        ? 30
        : 50
      : 50;

  const rsi =
    typeof tech.rsi === "number" ? tech.rsi : null;

  const rsiValue =
    rsi === null
      ? 50
      : rsi >= 70
      ? 35
      : rsi <= 30
      ? 65
      : rsi;

  const generalValue = Math.round(
    indicatorValue * 0.45 +
      movingAverageValue * 0.35 +
      rsiValue * 0.2
  );

  const getLabel = (value: number) => {
    if (value >= 75) return "Compra Forte";
    if (value >= 60) return "Compra";
    if (value <= 25) return "Venda Forte";
    if (value <= 40) return "Venda";
    return "Neutro";
  };

  const trendBias =
    tech.trend_bias ?? "Neutro";

  const emaTrend =
    tech.ema_trend ?? "Indefinido";

  return (
    <div className="h-[620px] overflow-hidden rounded-xl border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),linear-gradient(180deg,rgba(8,13,24,0.98),rgba(0,0,0,0.98))] p-3 shadow-2xl shadow-cyan-500/10">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
            PAINEL TÉCNICO INTELIGENTE IA
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            {asset} •{" "}
            {tf === "5m"
              ? "5 Minutos"
              : tf === "1d"
              ? "1 Dia"
              : tf}
          </h3>

          <p className="mt-2 max-w-2xl text-sx leading-6 text-zinc-400">
            Termômetros técnicos consolidados por indicadores,
            médias móveis e média geral da IA.
          </p>
        </div>
      </div>

      <div className="grid gap-2 xl:grid-cols-3 scale-[0.95] origin-top">

        <GaugeMeter
          title="Resumo Geral"
          value={generalValue}
          label={getLabel(generalValue)}
          subtitle={`Viés: ${trendBias}`}
        />

        <GaugeMeter
          title="Indicadores Técnicos"
          value={indicatorValue}
          label={getLabel(indicatorValue)}
          subtitle={`${buySignals} compra • ${neutralSignals} neutro • ${sellSignals} venda`}
        />

        <GaugeMeter
          title="Médias Móveis"
          value={movingAverageValue}
          label={getLabel(movingAverageValue)}
          subtitle={`EMA: ${emaTrend}`}
        />
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3">
  <div className="mb-3 flex items-center justify-between">
    <h4 className="text-base font-black text-white">
      Resumo das Médias
    </h4>

    <span className="text-[10px] font-bold text-cyan-300">
      SMA / EMA
    </span>
  </div>

  <div className="grid grid-cols-3 gap-2">

    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] text-zinc-500">
        Curto Prazo
      </div>

      <div className="mt-1 text-xs font-black text-white">
        {maBuy > maSell
          ? "Comprador"
          : maSell > maBuy
          ? "Vendedor"
          : "Neutro"}
      </div>
    </div>


    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] text-zinc-500">
        Médio Prazo
      </div>

      <div className="mt-1 text-xs font-black text-white">
        {movingAverageValue >= 60
          ? "Alta"
          : movingAverageValue <= 40
          ? "Baixa"
          : "Equilibrado"}
      </div>
    </div>


    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] text-zinc-500">
        Tendência EMA
      </div>

      <div className="mt-1 text-xs font-black text-white">
        {emaTrend}
      </div>
    </div>

  </div>
</div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h4 className="text-xl font-black text-white">
        Indicadores Técnicos
      </h4>

      <p className="mt-1 text-sm text-zinc-400">
        Leitura dos principais indicadores retornados pela IA.
      </p>
    </div>

    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
      Osciladores
    </div>
  </div>

  <div className="overflow-hidden rounded-2xl border border-white/10">
    <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-white/[0.04] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
      <div>Nome</div>
      <div className="text-center">Valor</div>
      <div className="text-right">Ação</div>
    </div>

    {(tech.technical_indicators ?? []).map((indicator) => {
      const action = indicator.action ?? "—";

      const actionClass =
        action === "Compra"
          ? "text-emerald-300"
          : action === "Venda"
          ? "text-red-300"
          : action === "Sobrecompra" || action === "Mais Volatilidade"
          ? "text-amber-300"
          : "text-zinc-400";

      return (
        <div
          key={indicator.name}
          className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-t border-white/10 px-3 py-2 text-sm"
        >
          <div className="font-black text-white">
            {indicator.name}
          </div>

          <div className="text-center font-semibold text-zinc-200">
            {typeof indicator.value === "number"
              ? indicator.value.toFixed(4)
              : "—"}
          </div>

          <div className={`text-right font-black ${actionClass}`}>
            {action}
          </div>
        </div>
      );
    })}
  </div>
</div>

      <div className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />

          <div>
            <h4 className="font-black text-white">
              Decisão Estratégica da IA
            </h4>

            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {generalValue >= 75
                ? `A leitura técnica de ${asset} mostra forte predominância compradora. Os indicadores e médias móveis estão alinhados para compra, sugerindo continuidade de força compradora enquanto o preço respeitar os principais níveis técnicos.`
                : generalValue >= 60
                ? `A leitura técnica de ${asset} apresenta viés comprador, mas ainda exige confirmação. O cenário favorece compras seletivas, principalmente se houver rompimento ou defesa de região importante.`
                : generalValue <= 25
                ? `A leitura técnica de ${asset} mostra forte predominância vendedora. O conjunto de indicadores aponta pressão de baixa relevante, favorecendo operações vendidas enquanto não houver recuperação consistente.`
                : generalValue <= 40
                ? `A leitura técnica de ${asset} apresenta viés vendedor. O mercado demonstra pressão de baixa, mas ainda é importante aguardar confirmação antes de aumentar exposição.`
                : `A leitura técnica de ${asset} está neutra. O mercado ainda não apresenta dominância clara entre compradores e vendedores, então o ideal é aguardar confirmação antes de operar.`}
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Indicadores técnicos:{" "}
              <span className="font-bold text-white">
                {getLabel(indicatorValue)}
              </span>
              . Médias móveis:{" "}
              <span className="font-bold text-white">
                {getLabel(movingAverageValue)}
              </span>
              . Viés informado pelo backend:{" "}
              <span className="font-bold text-cyan-300">
                {trendBias}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = getStoredToken();
  const user = getStoredUser();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [assetCategory, setAssetCategory] =
    useState<AssetCategoryLabel>("Forex");
  const [asset, setAsset] = useState("EURUSD");
  //const [customAsset, setCustomAsset] = useState("");
  const [tf, setTf] = useState("5m");
  const [mainTab, setMainTab] = useState("Resumo");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [apiError, setApiError] = useState("");
  const analysisInFlightRef = useRef(false);

  const selectedAsset = asset.toUpperCase();
  const shouldUseB3Feed =
    assetCategory === "Futuros BR" && ["WIN", "WDO"].includes(selectedAsset);

  const { data: b3Data } = useB3MarketData(
    shouldUseB3Feed ? selectedAsset : ""
  );

  const tabs = [
    "Resumo",
    "Técnica",
    "SMC",
    "Calculadora",
    "Timing",
  ];

  const selectedAssetOptions = useMemo(
    () => ASSET_OPTIONS[assetCategory] ?? [],
    [assetCategory]
  );

  const selectedAssetConfig = useMemo(
    () => selectedAssetOptions.find((item) => item.value === asset),
    [selectedAssetOptions, asset]
  );

  const resolvedAsset = selectedAsset;

const resolvedAssetType =
  selectedAssetConfig?.apiType ??
  (assetCategory === "Índices"
    ? "index"
    : assetCategory === "Ações"
    ? "stock"
    : assetCategory === "Forex"
    ? "forex"
    : assetCategory === "B3"
    ? "b3"
    : assetCategory === "Commodities"
    ? "commodity"
    : assetCategory === "Futuros BR"
    ? "future_br"
    : assetCategory === "Futuros US"
    ? "future_us"
    : "crypto");

  const isLocalFutureBr =
    assetCategory === "Futuros BR" && ["WIN", "WDO"].includes(resolvedAsset);

  const ANALYZE_API_URL = isLocalFutureBr ? API_URL_FUTUROS_BR : API_URL;

  const isB3Future =
  resolvedAssetType === "future_br" &&
  ["WIN", "WDO"].includes(String(resolvedAsset).toUpperCase());

  const {
    data: quantData,
    loading: quantLoading,
    error: quantError,
    refetch: refetchQuant,
  } = useQuantDashboard({
    asset: resolvedAsset,
    assetType: resolvedAssetType,
    timeframe: tf,
    token,
    enabled: !!token,
    b3Data,
    analysisData,
  });
  
  console.log("[B3 DATA]", b3Data);
  console.log("[QUANT DATA]", quantData);
  console.log("[QUANT LOADING]", quantLoading);
  console.log("[QUANT ERROR]", quantError);

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  async function handleAnalyze(showLoader = true) {
    if (!token) return;
    if (analysisInFlightRef.current) return;

    analysisInFlightRef.current = true;

    try {
      setApiError("");

      if (showLoader) {
        setProgress(10);
        setLoading(true);
      }

      const response = await fetch(`${ANALYZE_API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_type: resolvedAssetType,
          asset: resolvedAsset,
          timeframe: tf,
        }),
      });

      if (showLoader) {
        setProgress(60);
      }

      if (!response.ok) {
        let errorMessage = "Erro ao analisar mercado";

        try {
          const errorData = await response.json();

          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else if (typeof errorData.detail === "object") {
            errorMessage = JSON.stringify(errorData.detail, null, 2);
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } catch {
          errorMessage = `Erro ${response.status} ao analisar mercado`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (showLoader) {
        setProgress(90);
      }
      setAnalysisData(data);
      await refetchQuant();

      if (showLoader) {
        setMainTab("Resumo");
        setProgress(100);
      }
    } catch (error: any) {
      setApiError(error.message || "Erro desconhecido");
    } finally {
      analysisInFlightRef.current = false;

      if (showLoader) {
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 300);
      }
    }
  }

  useEffect(() => {
    const nextDefault = getDefaultAssetByCategory(assetCategory);
    setAsset(nextDefault);
    //setCustomAsset("");
  }, [assetCategory]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [loading]);


  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      <FloatingCommunityChat token={token} userName={user?.name} />

      {loading && (
        <AiThinkingOverlay
          progress={progress}
          asset={resolvedAsset}
          timeframe={tf}
        />
      )}

      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 hidden lg:block">
        <h1 className="text-xl font-bold flex items-center gap-2 text-white mb-10">
          <BrainCircuit size={18} /> Gluck&apos;s Trader IA
        </h1>
        <div className="space-y-4 text-zinc-300">
          <div className="flex gap-2 items-center hover:text-white cursor-pointer">
            <BarChart3 size={16} /> Dashboard
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-white">
            Terminal de Inteligência de Mercado
          </h2>


        <div className="mb-6 flex justify-center">
          <a
            href="/live-room"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border border-amber-500/40 bg-[#0a0a0a] px-5 py-2.5 text-sm font-semibold text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.12)] transition-all duration-300 hover:scale-[1.03] hover:border-amber-400 hover:text-white"
          >
            {/* glow */}
            <span className="absolute inset-0 z-0 rounded-xl opacity-0 blur-lg transition duration-500 group-hover:opacity-100">
              <span className="absolute inset-0 animate-pulse bg-amber-400/20" />
            </span>

            {/* brilho passando */}
            <span className="absolute -inset-full z-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100" />

            {/* badge pequeno */}
            <span className="absolute -top-1 -right-1 z-20 rounded-full bg-amber-400 px-1.5 py-[2px] text-[9px] font-bold text-black">
              AO VIVO
            </span>

            {/* conteúdo */}
            <span className="relative z-10 font-bold tracking-wide">
              SALA AO VIVO IA
            </span>

            <span className="relative z-10 text-xs text-amber-300/70 group-hover:text-white hidden sm:inline">
              tempo real
            </span>

            {/* ícone */}
            <span className="relative z-10 text-base">
              ⚡
            </span>
          </a>
        </div>

          <div className="flex items-center gap-3 flex-wrap">
            {user && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
                {user.name} • Plano:{" "}
                <span className="text-cyan-400">{user.plan}</span>
              </div>
            )}

            <Button
              className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[180px]">
                <label className="block text-sm text-zinc-400 mb-2">
                  Categoria
                </label>
                <select
                  value={assetCategory}
                  onChange={(e) =>
                    setAssetCategory(e.target.value as AssetCategoryLabel)
                  }
                  className="h-10 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 text-white"
                >
                  <option value="Forex">🌍 Forex (Moedas)</option>
                  <option value="Futuros BR">📉 Futuros Brasil (WIN/WDO)</option>
                  <option value="Índices">📊 Índices Globais</option>
                  <option value="Crypto">₿ Criptomoedas</option>
                  <option value="Ações">🏛️ Ações Internacionais</option>
                  <option value="B3">🇧🇷 Ações Brasileiras</option>
                  <option value="Commodities">🛢️ Commodities</option>
                  <option value="Futuros US">📈 Futuros EUA</option>
                </select>
              </div>

              <div className="min-w-[220px]">
                <label className="block text-sm text-zinc-400 mb-2">
                  Ativo da lista
                </label>
                <select
                  value={asset}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setAsset(e.target.value)
                  }
                  className="h-10 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 text-white"
                >
                  {selectedAssetOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label} ({item.value})
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-[140px]">
                <label className="block text-sm text-zinc-400 mb-2">
                  Timeframe
                </label>
                <select
                  value={tf}
                  onChange={(e) => setTf(e.target.value)}
                  className="h-10 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 text-white"
                >
                  <option value="1m">1m</option>
                  <option value="5m">5m</option>
                  <option value="15m">15m</option>
                  <option value="30m">30m</option>
                  <option value="1h">1h</option>
                  <option value="4h">4h</option>
                  <option value="1d">1D</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAnalyze(true)}
                >
                  Gerar Análise
                </Button>
              </div>
            </div>

            <div className="mt-4 text-sm text-zinc-400">
              Símbolo enviado à análise:
              <span className="text-white font-semibold ml-2">
                {resolvedAsset}
              </span>
              <span className="mx-2 text-zinc-700">•</span>
              Tipo:
              <span className="text-white font-semibold ml-2">
                {resolvedAssetType}
              </span>
            </div>

            <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              Análise manual: clique em <span className="font-semibold">Gerar Análise</span> para atualizar os dados.
              {assetCategory === "Futuros BR" && shouldUseB3Feed ? " Feed B3/Nelogica conectado para WIN/WDO." : ""}
            </div>
          </div>

          {apiError && (
            <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-red-400">
              {apiError}
            </div>
          )}

          {quantError && (
            <div className="rounded-2xl border border-yellow-900/40 bg-yellow-950/20 p-4 text-yellow-300">
              {quantError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 items-start">
            <div className="grid grid-cols-1 xl:grid-cols-[300px_360px_minmax(0,1.9fr)] gap-3 items-start">
              {/* LATERAL DIREITA */}
              <div className="hidden xl:block xl:sticky xl:top-4">
                <SummaryTab
                  asset={resolvedAsset}
                  tf={tf}
                  analysisData={analysisData}
                  compact
                  b3Data={b3Data}
                  isB3Future={isB3Future}
                />
              </div>

              
              {/* DASHBOARD QUANT */}
              <div className="hidden xl:block">
                <QuantDashboardCard
                  asset={resolvedAsset}
                  timeframe={tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
                  data={quantData}
                  loading={quantLoading}
                />
              </div>

              {/* PAINEL TÉCNICO PREMIUM */}
              <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Painel Técnico do Ativo
                  </h3>

                  <div className="text-sm text-zinc-400">
                    {assetCategory} • {resolvedAsset} •{" "}
                    {tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
                  </div>
                </div>

                <TechnicalOverviewPanel
                  asset={resolvedAsset}
                  tf={tf}
                  analysisData={analysisData}
                />
              </div>
            </div>

            {/* EM TELAS MENORES, QUANT E SUMMARY FICAM ABAIXO */}
            <div className="grid grid-cols-1 gap-4 xl:hidden">
              <QuantDashboardCard
                asset={resolvedAsset}
                timeframe={tf === "5m" ? "5 Minutos" : tf === "1d" ? "1 Dia" : tf}
                data={quantData}
                loading={quantLoading}
              />

              <SummaryTab
                asset={resolvedAsset}
                tf={tf}
                analysisData={analysisData}
                compact
                b3Data={b3Data}
                isB3Future={isB3Future}
              />
              </div>
            </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-4 flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMainTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm border transition ${
                  mainTab === tab
                    ? "bg-cyan-400 text-black border-cyan-300 font-semibold"
                    : "bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <span className="text-sm text-zinc-400">
              Tipo de ativo: <b className="text-white">{resolvedAssetType}</b> •
              Ativo: <b className="text-white"> {resolvedAsset}</b> •
              Timeframe usado na análise: <b className="text-white"> {tf}</b>
            </span>
          </div>

          {mainTab === "Resumo" && (
            <div className="space-y-3">
              <ResumoAvancadoTab
                asset={resolvedAsset}
                tf={tf}
                analysisData={analysisData}
              />

              <RealtimeFuturesDashboard />
            </div>
          )}

          {mainTab === "Técnica" && (
            <TechnicalTab
              asset={resolvedAsset}
              tf={tf}
              analysisData={analysisData}
            />
          )}

          {mainTab === "SMC" && <SmcTab analysisData={analysisData} />}

          {mainTab === "Harmônicos" && (
            <HarmonicsTab analysisData={analysisData} />
          )}

          {mainTab === "WEGD" && <WegdTab analysisData={analysisData} />}

          {mainTab === "Probabilística" && (
            <ProbabilisticaTab analysisData={analysisData} />
          )}

          {mainTab === "Calculadora" && (
            <CalculadoraTab analysisData={analysisData} />
          )}

          {mainTab === "Timing" && (
            <TimingTab analysisData={analysisData} />
          )}

          {mainTab === "SINAL FINAL" && (
            <SinalFinalTab analysisData={analysisData} />
          )}

          {!tabs.includes(mainTab) && <PlaceholderTab label={mainTab} />}

          <div className="grid grid-cols-1 gap-6">
            <MarketIntelligenceHub />
          </div>
        </div>
      </main>
    </div>
  );
}