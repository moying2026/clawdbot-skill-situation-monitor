/**
 * Market Data Types
 * 
 * Defines types for market data, including cryptocurrencies, stocks, commodities, and forex.
 */

/**
 * Market Symbol Types
 */
export type MarketSymbolType = 'crypto' | 'stock' | 'commodity' | 'forex' | 'index' | 'etf';

/**
 * Time Interval for Market Data
 */
export type TimeInterval = 
  | '1m' | '5m' | '15m' | '30m' | '1h' 
  | '4h' | '1d' | '1w' | '1M';

/**
 * Market Data Point
 */
export interface MarketDataPoint {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number; // Volume Weighted Average Price
}

/**
 * Market Symbol Configuration
 */
export interface MarketSymbol {
  symbol: string;
  name: string;
  type: MarketSymbolType;
  exchange?: string;
  currency: string;
  description?: string;
  dataSource: 'yahoo' | 'coingecko' | 'binance' | 'finnhub' | 'custom';
  enabled: boolean;
  priority: number; // 1-10, higher = more important
}

/**
 * Market Quote (Current Price)
 */
export interface MarketQuote {
  symbol: string;
  name: string;
  type: MarketSymbolType;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high24h: number;
  low24h: number;
  open24h: number;
  previousClose?: number;
  lastUpdated: Date;
  source: string;
}

/**
 * Technical Indicator
 */
export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  description?: string;
}

/**
 * Market Sentiment
 */
export interface MarketSentiment {
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number; // -100 to +100
  factors: {
    technical: number;
    volume: number;
    volatility: number;
    social: number;
    news: number;
  };
  confidence: number; // 0-100
  timestamp: Date;
}

/**
 * Trading Signal
 */
export interface TradingSignal {
  symbol: string;
  type: 'buy' | 'sell' | 'hold' | 'strong_buy' | 'strong_sell';
  strength: number; // 0-100
  confidence: number; // 0-100
  indicators: TechnicalIndicator[];
  priceTarget?: {
    min: number;
    max: number;
    probability: number;
  };
  stopLoss?: number;
  takeProfit?: number;
  timeframe: TimeInterval;
  reason: string;
  generatedAt: Date;
}

/**
 * Volatility Analysis
 */
export interface VolatilityAnalysis {
  symbol: string;
  currentVolatility: number; // Standard deviation of returns
  historicalVolatility: number;
  volatilityRank: number; // 0-100 compared to history
  isHighVolatility: boolean;
  volatilityBreakout: boolean;
  atr: number; // Average True Range
  supportLevels: number[];
  resistanceLevels: number[];
  timestamp: Date;
}

/**
 * Liquidity Analysis
 */
export interface LiquidityAnalysis {
  symbol: string;
  volume24h: number;
  volumeChange24h: number;
  bidAskSpread: number;
  orderBookDepth: number;
  slippage: number;
  liquidityScore: number; // 0-100
  isLiquid: boolean;
  timestamp: Date;
}

/**
 * Grid Trading Metrics
 */
export interface GridTradingMetrics {
  symbol: string;
  currentPrice: number;
  gridLevels: number;
  gridRange: {
    lower: number;
    upper: number;
  };
  gridSize: number;
  profitPerGrid: number;
  totalPotentialProfit: number;
  riskRewardRatio: number;
  optimalGridSize?: number;
  recommendedAction: 'setup_grid' | 'adjust_grid' | 'pause_grid' | 'no_action';
  timestamp: Date;
}

/**
 * Regulatory Impact
 */
export interface RegulatoryImpact {
  symbol: string;
  region: string;
  impactLevel: 'high' | 'medium' | 'low' | 'none';
  description: string;
  source: string;
  date: Date;
  potentialEffect: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

/**
 * Market Module Configuration
 */
export interface MarketModuleConfig {
  enabled: boolean;
  dataSources: {
    yahoo: boolean;
    coingecko: boolean;
    binance: boolean;
    finnhub: boolean;
  };
  refreshInterval: number; // seconds
  cacheDuration: number; // seconds
  symbols: MarketSymbol[];
  technicalIndicators: {
    rsi: boolean;
    macd: boolean;
    bollingerBands: boolean;
    movingAverages: boolean;
    atr: boolean;
    obv: boolean;
  };
  alerts: {
    priceChange: number; // percent
    volumeSpike: number; // percent
    volatilitySpike: number; // percent
  };
  gridTrading: {
    enabled: boolean;
    defaultGridLevels: number;
    defaultRiskPercent: number;
  };
}