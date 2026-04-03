export function mapAssetToTradingViewSymbol(asset: string): string {
  const upper = asset.toUpperCase();

  if (upper === "WIN") return "BMFBOVESPA:WIN1!";
  if (upper === "WDO") return "BMFBOVESPA:WDO1!";

  return asset;
}