/**
 * Analysis Module Types
 * 
 * Defines types for analysis results, patterns, trends, risks, opportunities,
 * decisions, correlations, narratives, and main characters.
 */

import { NewsItem } from '../news';
import { MarketQuote, TradingSignal, GridTradingMetrics, RegulatoryImpact } from '../markets';

/**
 * Pattern Types for Analysis
 */
export type PatternType = 
  | 'geopolitical_tension'
  | 'market_correction'
  | 'technological_breakthrough'
  | 'regulatory_change'
  | 'social_unrest'
  | 'economic_indicator'
  | 'sentiment_shift'
  | 'volume_spike'
  | 'price_action'
  | 'correlation_breakdown'
  | 'narrative_formation'
  | 'character_emergence';

/**
 * Trend Direction
 */
export type TrendDirection = 'bullish' | 'bearish' | 'sideways' | 'volatile' | 'breaking_out' | 'breaking_down';

/**
 * Risk Levels
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Opportunity Types
 */
export type OpportunityType = 
  | 'arbitrage'
  | 'momentum'
  | 'mean_reversion'
  | 'breakout'
  | 'grid_trading'
  | 'hedging'
  | 'long_term_investment'
  | 'short_term_trade'
  | 'high_potential'
  | 'low_risk';

/**
 * Decision Recommendation Types
 */
export type DecisionRecommendation = 
  | 'buy'
  | 'sell'
  | 'hold'
  | 'strong_buy'
  | 'strong_sell'
  | 'accumulate'
  | 'reduce'
  | 'hedge'
  | 'wait'
  | 'monitor'
  | 'setup_grid'
  | 'adjust_grid'
  | 'exit_grid';

/**
 * Analysis Pattern
 */
export interface AnalysisPattern {
  type: PatternType;
  confidence: number; // 0-100
  description: string;
  evidence: string[];
  sources: Array<NewsItem | MarketQuote>;
  impact: {
    market: number; // -100 to +100
    geopolitical: number; // -100 to +100
    economic: number; // -100 to +100
    social: number; // -100 to +100
  };
  timeframe: 'short' | 'medium' | 'long';
  probability: number; // 0-100
  firstDetected: Date;
  lastUpdated: Date;
}

/**
 * Trend Analysis
 */
export interface TrendAnalysis {
  symbol?: string;
  assetClass?: string;
  region?: string;
  direction: TrendDirection;
  strength: number; // 0-100
  duration: number; // days
  confidence: number; // 0-100
  indicators: {
    movingAverage: number;
    rsi: number;
    macd: number;
    volume: number;
    sentiment: number;
  };
  supportLevels: number[];
  resistanceLevels: number[];
  breakoutLevel?: number;
  breakdownLevel?: number;
  timestamp: Date;
}

/**
 * Risk Assessment
 */
export interface RiskAssessment {
  id: string;
  type: 'market' | 'geopolitical' | 'regulatory' | 'technical' | 'liquidity' | 'systemic';
  level: RiskLevel;
  description: string;
  affectedAssets: string[];
  affectedRegions: string[];
  probability: number; // 0-100
  potentialImpact: number; // 0-100
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  mitigationStrategies: string[];
  monitoringIndicators: string[];
  source: NewsItem | MarketQuote | string;
  detectedAt: Date;
  updatedAt: Date;
}

/**
 * Opportunity Identification
 */
export interface Opportunity {
  id: string;
  type: OpportunityType;
  description: string;
  assets: string[];
  regions: string[];
  potentialReturn: number; // percentage
  riskLevel: RiskLevel;
  riskRewardRatio: number;
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  confidence: number; // 0-100
  entryStrategy: string;
  exitStrategy: string;
  riskManagement: string;
  monitoringRequirements: string[];
  source: NewsItem | MarketQuote | string;
  detectedAt: Date;
  updatedAt: Date;
}

/**
 * Decision Recommendation
 */
export interface Decision {
  id: string;
  type: DecisionRecommendation;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  rationale: string[];
  assets: string[];
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  confidence: number; // 0-100
  expectedOutcome: string;
  risks: string[];
  alternatives: string[];
  monitoring: string[];
  generatedAt: Date;
  expiresAt: Date;
}

/**
 * Cryptocurrency Trading Decision
 */
export interface CryptoTradingDecision extends Decision {
  exchange?: string;
  pair?: string;
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  positionSize?: number;
  leverage?: number;
  gridTradingParams?: GridTradingMetrics;
  regulatoryConsiderations?: RegulatoryImpact[];
}

/**
 * Grid Trading Optimization
 */
export interface GridTradingOptimization {
  symbol: string;
  currentPrice: number;
  recommendedGridLevels: number;
  recommendedRange: {
    lower: number;
    upper: number;
  };
  optimalGridSize: number;
  expectedProfit: number;
  riskAdjustedReturn: number;
  marketConditions: {
    volatility: number;
    trend: TrendDirection;
    liquidity: number;
  };
  recommendations: string[];
  timestamp: Date;
}

/**
 * Correlation Matrix
 */
export interface CorrelationMatrix {
  assets: string[];
  correlations: number[][]; // 2D array of correlation coefficients
  timePeriod: string;
  confidence: number;
  significantCorrelations: Array<{
    asset1: string;
    asset2: string;
    correlation: number;
    strength: 'weak' | 'moderate' | 'strong';
    direction: 'positive' | 'negative';
  }>;
  timestamp: Date;
}

/**
 * Narrative Analysis
 */
export interface Narrative {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  strength: number; // 0-100
  sources: Array<NewsItem | string>;
  relatedAssets: string[];
  relatedRegions: string[];
  timeline: Array<{
    date: Date;
    event: string;
    impact: number;
  }>;
  potentialOutcomes: Array<{
    scenario: string;
    probability: number;
    impact: number;
  }>;
  firstDetected: Date;
  lastUpdated: Date;
}

/**
 * Main Character Analysis
 */
export interface MainCharacter {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'country' | 'company' | 'movement';
  description: string;
  influence: number; // 0-100
  sentiment: 'positive' | 'negative' | 'neutral' | 'controversial';
  recentActions: Array<{
    action: string;
    date: Date;
    impact: number;
    sources: string[];
  }>;
  relatedNarratives: string[];
  relatedAssets: string[];
  monitoringPriority: 'low' | 'medium' | 'high' | 'critical';
  firstDetected: Date;
  lastUpdated: Date;
}

/**
 * Alert
 */
export interface Alert {
  id: string;
  monitorId?: string;
  query?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

/**
 * Monitor
 */
export interface Monitor {
  id: string;
  query: string;
  createdAt: Date;
  lastChecked: Date;
  isActive: boolean;
  alertThreshold: number; // 0-1
  checkInterval: number; // seconds
  alertCount: number;
}

/**
 * Report
 */
export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'ad_hoc';
  title: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  sections: Array<{
    title: string;
    content: string;
    data?: any;
  }>;
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  alerts: Alert[];
  metadata: Record<string, any>;
}

/**
 * Analysis Configuration
 */
export interface AnalysisConfig {
  patternDetection: {
    enabled: boolean;
    minConfidence: number;
    types: PatternType[];
  };
  trendAnalysis: {
    enabled: boolean;
    timeframes: string[];
    indicators: string[];
  };
  riskAssessment: {
    enabled: boolean;
    minProbability: number;
    minImpact: number;
  };
  opportunityIdentification: {
    enabled: boolean;
    minPotentialReturn: number;
    maxRiskLevel: RiskLevel;
  };
  decisionSupport: {
    enabled: boolean;
    minConfidence: number;
    includeAlternatives: boolean;
  };
  correlationAnalysis: {
    enabled: boolean;
    minCorrelation: number;
    maxLag: number;
  };
  narrativeAnalysis: {
    enabled: boolean;
    minStrength: number;
    maxNarratives: number;
  };
  mainCharacterAnalysis: {
    enabled: boolean;
    minInfluence: number;
    maxCharacters: number;
  };
  monitoring: {
    enabled: boolean;
    checkInterval: number;
    alertRetention: number;
  };
  visualization: {
    enabled: boolean;
    types: string[];
    exportFormats: string[];
  };
}

/**
 * Analysis Result
 */
export interface AnalysisResult {
  timestamp: Date;
  patterns: AnalysisPattern[];
  trends: TrendAnalysis[];
  risks: RiskAssessment[];
  opportunities: Opportunity[];
  decisions: Decision[];
  narratives: Narrative[];
  mainCharacters: MainCharacter[];
  alerts: Alert[];
  summary: string;
  confidence: number; // 0-100
  metadata: {
    newsCount: number;
    marketSymbolsCount: number;
    analysisDuration: number;
    patternsDetected: number;
    risksIdentified: number;
    opportunitiesIdentified: number;
    [key: string]: any;
  };
}

/**
 * Market Risk Analysis
 */
export interface MarketRiskAnalysis {
  overallRisk: RiskLevel;
  riskFactors: Array<{
    type: string;
    level: RiskLevel;
    description: string;
    probability: number;
    impact: number;
  }>;
  stressTestResults: {
    worstCase: number;
    bestCase: number;
    expected: number;
  };
  correlationRisks: Array<{
    asset1: string;
    asset2: string;
    correlation: number;
    risk: RiskLevel;
  }>;
  liquidityRisks: Array<{
    asset: string;
    risk: RiskLevel;
    reason: string;
  }>;
  regulatoryRisks: RegulatoryImpact[];
  timestamp: Date;
}

/**
 * Geopolitical Analysis
 */
export interface GeopoliticalAnalysis {
  region: string;
  tensionLevel: RiskLevel;
  keyIssues: Array<{
    issue: string;
    severity: RiskLevel;
    partiesInvolved: string[];
    potentialOutcomes: string[];
  }>;
  economicImpact: {
    trade: number; // -100 to +100
    investment: number; // -100 to +100
    currency: number; // -100 to +100
    commodities: number; // -100 to +100
  };
  marketImplications: Array<{
    asset: string;
    impact: 'positive' | 'negative' | 'neutral';
    magnitude: number;
    reasoning: string;
  }>;
  monitoringRecommendations: string[];
  timestamp: Date;
}

/**
 * Technical Analysis Summary
 */
export interface TechnicalAnalysisSummary {
  symbol: string;
  overallSignal: TradingSignal['type'];
  confidence: number;
  indicators: Array<{
    name: string;
    value: number;
    signal: TradingSignal['type'];
    weight: number;
  }>;
  keyLevels: {
    support: number[];
    resistance: number[];
    pivot: number;
  };
  trend: {
    direction: TrendDirection;
    strength: number;
    duration: number;
  };
  volatility: {
    level: number;
    rank: number;
    breakout: boolean;
  };
  recommendations: string[];
  timestamp: Date;
}