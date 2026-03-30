export type AssetType = "crypto" | "forex" | "futures" | "index";

export type AssetConfig = {
  id: string;
  label: string;
  type: AssetType;
  chartSymbol: string;
  analysisSymbol: string;
};

export const ASSETS: AssetConfig[] = [
  // Já existentes — mantenha os seus também aqui
  {
    id: "BTCUSDT",
    label: "Bitcoin (BTCUSDT)",
    type: "crypto",
    chartSymbol: "BINANCE:BTCUSDT",
    analysisSymbol: "BTCUSDT",
  },
  {
    id: "EURUSD",
    label: "Euro/Dólar (EURUSD)",
    type: "forex",
    chartSymbol: "OANDA:EURUSD",
    analysisSymbol: "EURUSD",
  },

  // NOVOS ATIVOS
  {
    id: "XAUUSD",
    label: "Gold (XAUUSD)",
    type: "forex",
    chartSymbol: "OANDA:XAUUSD",
    analysisSymbol: "XAUUSD",
  },
  {
    id: "NGCJ",
    label: "Mini Ouro (NGCJ)",
    type: "futures",
    chartSymbol: "COMEX_MINI:MGC1!",
    analysisSymbol: "MGC=F",
  },
  {
    id: "MNQ",
    label: "Mini Nasdaq (MNQ)",
    type: "futures",
    chartSymbol: "CME_MINI:MNQ1!",
    analysisSymbol: "NQ=F",
  },
];

export function getAssetById(assetId: string) {
  return ASSETS.find((asset) => asset.id === assetId);
}

export function getAssetsByType(type?: AssetType) {
  if (!type) return ASSETS;
  return ASSETS.filter((asset) => asset.type === type);
}
