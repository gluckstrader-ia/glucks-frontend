export type RealtimeModuleDirection =
  | "BUY"
  | "SELL"
  | "NEUTRAL"
  | "UNAVAILABLE";

export type RealtimeModuleKey = "MOM" | "CHEIO" | "BOOK" | "TAPE" | "POS";

export type RealtimeModuleState = {
  key: RealtimeModuleKey;
  positive: boolean;
  score?: number;
  available?: boolean;
  direction?: RealtimeModuleDirection;
  label?: string;
  detail?: string;
  weight?: number;
  confidence?: number;
};

export type RealtimeMarketStatus =
  | "OPEN"
  | "STALE"
  | "CLOSED"
  | "PRE_OPEN"
  | "DISCONNECTED";

export type RealtimeSignal =
  | "COMPRA"
  | "VENDA"
  | "NEUTRO"
  | "AGUARDAR CONFIRMAÇÃO";

export type RealtimeFuture = {
  symbol: "WINFUT" | "WDOFUT";
  contract: string;
  flag: "BR" | "US";
  price: number;
  priceDecimals: number;
  variationPct: number;
  variationPoints: number;
  open: number;
  high: number;
  low: number;
  amplitude: number;
  volume: number;
  fullContract: "IND" | "DOL";
  aggressionUnit?: "BRL" | "CONTRACTS" | "RAW";
  buyerAggression: number;
  sellerAggression: number;
  fullBalance: number;
  netBalance: number;
  score: number;
  signal: RealtimeSignal;
  confidence: number;
  confirmations: number;
  availableModules?: number;
  signalActive?: boolean;
  signalNote?: string;
  signalReasons?: string[];
  signalVersion?: string;
  modules: RealtimeModuleState[];
  priceSeries: number[];
  timeSeries: string[];
  buyerSeries: number[];
  sellerSeries: number[];
  balanceSeries: number[];
};

export type RealtimeFuturesSnapshot = {
  marketStatus: RealtimeMarketStatus;
  source: string;
  updatedAt: string;
  instruments: RealtimeFuture[];
};

export type SignalCheckpoint = {
  minutes: 5 | 15 | 30;
  evaluatedAt?: string | null;
  price?: number | null;
  resultPoints?: number | null;
  favorable?: boolean | null;
};

export type SignalHistoryItem = {
  id: number;
  symbol: "WINFUT" | "WDOFUT";
  contract: string;
  signal: "COMPRA" | "VENDA";
  status: "OPEN" | "CLOSED";
  entryPrice: number;
  entryScore: number;
  entryConfidence: number;
  entryConfirmations: number;
  openedAt: string;
  closedAt?: string | null;
  exitPrice?: number | null;
  resultPoints?: number | null;
  maxFavorablePoints: number;
  maxAdversePoints: number;
  lastPrice: number;
  lastUpdatedAt: string;
  signalVersion: string;
  closeReason?: string | null;
  checkpoints: SignalCheckpoint[];
  modules?: RealtimeModuleState[];
};

export type SignalHistoryResponse = {
  generatedAt: string;
  items: SignalHistoryItem[];
};

export type SignalSymbolStats = {
  symbol: "WINFUT" | "WDOFUT";
  totalEvents: number;
  closedEvents: number;
  activeEvents: number;
  positiveEvents: number;
  negativeEvents: number;
  directionalRate?: number | null;
  averageResultPoints?: number | null;
};

export type SignalStatsResponse = {
  generatedAt: string;
  windowHours: number;
  totalEvents: number;
  closedEvents: number;
  activeEvents: number;
  positiveEvents: number;
  negativeEvents: number;
  neutralEvents: number;
  directionalRate?: number | null;
  averageResultPoints?: number | null;
  sampleStatus: "COLETANDO" | "AMOSTRA_INICIAL" | "AMOSTRA_FORMADA";
  bySymbol: SignalSymbolStats[];
};

export type SignalPerformanceGroup = {
  key: string;
  label: string;
  totalEvents: number;
  closedEvents: number;
  activeEvents: number;
  positiveEvents: number;
  negativeEvents: number;
  directionalRate?: number | null;
  averageResultPoints?: number | null;
  totalResultPoints?: number | null;
  averageFavorablePoints?: number | null;
  averageAdversePoints?: number | null;
};

export type SignalPerformanceCheckpoint = {
  minutes: 5 | 15 | 30;
  samples: number;
  positive: number;
  negative: number;
  neutral: number;
  directionalRate?: number | null;
  averageResultPoints?: number | null;
};

export type SignalPerformanceModule = {
  key: RealtimeModuleKey;
  label: string;
  samples: number;
  directionalSamples: number;
  alignedSamples: number;
  positiveEvents: number;
  negativeEvents: number;
  directionalRate?: number | null;
  averageResultPoints?: number | null;
  averageScore?: number | null;
};

export type SignalPerformanceResponse = {
  generatedAt: string;
  startAt: string;
  endAt: string;
  symbol?: "WINFUT" | "WDOFUT" | null;
  signal?: "COMPRA" | "VENDA" | null;
  sampleStatus: "COLETANDO" | "AMOSTRA_INICIAL" | "AMOSTRA_FORMADA";
  overall: SignalPerformanceGroup;
  bySymbol: SignalPerformanceGroup[];
  bySignal: SignalPerformanceGroup[];
  checkpoints: SignalPerformanceCheckpoint[];
  modules: SignalPerformanceModule[];
};

export type SignalWeights = {
  mom: number;
  cheio: number;
  book: number;
  tape: number;
  pos: number;
};

export type SignalSettingsResponse = {
  revision: number;
  weights: SignalWeights;
  updatedAt: string;
  updatedBy: string;
};

export type MockRealtimeFuture = RealtimeFuture;
