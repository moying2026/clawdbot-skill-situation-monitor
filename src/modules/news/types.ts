/**
 * News Module Types and Interfaces
 * 
 * Defines data structures for news aggregation, RSS parsing, and alert detection.
 */

/**
 * News Item Interface
 */
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: string;
  category: NewsCategory;
  publishedAt: Date;
  updatedAt?: Date;
  region?: string;
  country?: string;
  language?: string;
  keywords: string[];
  alertLevel: AlertLevel;
  sentiment?: number; // -1 to 1
  importance?: number; // 0 to 1
  metadata?: Record<string, any>;
}

/**
 * News Category
 */
export type NewsCategory = 
  | 'politics'      // 政治新闻
  | 'tech'          // 科技新闻
  | 'finance'       // 金融新闻
  | 'gov'           // 政府新闻
  | 'ai'            // AI新闻
  | 'intel'         // 情报新闻
  | 'crypto'        // 加密货币新闻
  | 'markets'       // 市场新闻
  | 'regulatory'    // 监管新闻
  | 'breaking'      // 突发新闻
  | 'all';          // 所有类别

/**
 * Alert Level
 */
export type AlertLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

/**
 * RSS Feed Configuration
 */
export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: NewsCategory;
  language: string;
  region?: string;
  enabled: boolean;
  priority: number; // 1-10, higher is more important
  refreshInterval: number; // seconds
  lastFetched?: Date;
  lastError?: string;
}

/**
 * News Source
 */
export interface NewsSource {
  id: string;
  name: string;
  type: 'rss' | 'api' | 'scraper';
  url: string;
  categories: NewsCategory[];
  reliability: number; // 0-1
  bias?: 'left' | 'center' | 'right';
  region?: string;
}

/**
 * Keyword Alert Rule
 */
export interface KeywordAlertRule {
  id: string;
  keyword: string;
  category: NewsCategory;
  alertLevel: AlertLevel;
  enabled: boolean;
  regex?: boolean;
  caseSensitive?: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * News Filter Options
 */
export interface NewsFilterOptions {
  categories?: NewsCategory[];
  sources?: string[];
  regions?: string[];
  keywords?: string[];
  alertLevels?: AlertLevel[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'relevance' | 'alert' | 'sentiment';
  sortOrder?: 'asc' | 'desc';
}

/**
 * News Aggregation Result
 */
export interface NewsAggregationResult {
  items: NewsItem[];
  total: number;
  filtered: number;
  categories: Record<NewsCategory, number>;
  alerts: Record<AlertLevel, number>;
  sources: Record<string, number>;
  regions: Record<string, number>;
  timestamp: Date;
  queryTime: number;
}

/**
 * Alert Detection Result
 */
export interface AlertDetectionResult {
  item: NewsItem;
  matchedKeywords: string[];
  alertLevel: AlertLevel;
  confidence: number; // 0-1
  reason: string;
}

/**
 * News Cache Entry
 */
export interface NewsCacheEntry {
  key: string;
  items: NewsItem[];
  timestamp: Date;
  ttl: number; // milliseconds
  hits: number;
}

/**
 * RSS Parsing Options
 */
export interface RSSParsingOptions {
  timeout?: number;
  maxRedirects?: number;
  headers?: Record<string, string>;
  customFields?: Record<string, string>;
  normalize?: boolean;
  xml2jsOptions?: any;
}

/**
 * News Formatting Options
 */
export interface NewsFormattingOptions {
  format: 'table' | 'json' | 'simple' | 'detailed';
  includeDescription?: boolean;
  includeKeywords?: boolean;
  includeAlerts?: boolean;
  includeMetadata?: boolean;
  maxTitleLength?: number;
  maxDescriptionLength?: number;
  groupBy?: 'category' | 'source' | 'region' | 'alert';
  sortBy?: 'date' | 'alert' | 'relevance';
  limit?: number;
}

/**
 * Region Mapping
 */
export const REGION_MAPPING: Record<string, string[]> = {
  'north-america': ['usa', 'us', 'united states', 'canada', 'mexico'],
  'europe': ['europe', 'eu', 'uk', 'germany', 'france', 'italy', 'spain', 'poland', 'netherlands', 'switzerland'],
  'asia': ['asia', 'china', 'japan', 'india', 'korea', 'vietnam', 'thailand', 'indonesia', 'singapore', 'malaysia'],
  'middle-east': ['middle east', 'israel', 'iran', 'saudi', 'uae', 'qatar', 'syria', 'iraq', 'lebanon', 'jordan'],
  'south-america': ['south america', 'brazil', 'argentina', 'chile', 'colombia', 'peru', 'venezuela'],
  'africa': ['africa', 'south africa', 'nigeria', 'egypt', 'kenya', 'ethiopia', 'morocco'],
  'australia': ['australia', 'new zealand', 'oceania'],
  'global': ['global', 'world', 'international'],
};

/**
 * Cryptocurrency Keywords
 */
export const CRYPTO_KEYWORDS = {
  btc: ['bitcoin', 'btc', 'satoshi'],
  eth: ['ethereum', 'eth', 'vitalik'],
  sol: ['solana', 'sol', 'anatoly'],
  xrp: ['ripple', 'xrp'],
  ada: ['cardano', 'ada'],
  doge: ['dogecoin', 'doge'],
  dot: ['polkadot', 'dot'],
  avax: ['avalanche', 'avax'],
  matic: ['polygon', 'matic'],
  link: ['chainlink', 'link'],
};

/**
 * Market Keywords
 */
export const MARKET_KEYWORDS = {
  etf: ['etf', 'exchange traded fund', 'spot etf'],
  regulation: ['regulation', 'regulatory', 'sec', 'cfdc', 'finra'],
  halving: ['halving', 'bitcoin halving', 'reward halving'],
  mining: ['mining', 'miner', 'hashrate'],
  adoption: ['adoption', 'institutional', 'corporate'],
  exchange: ['exchange', 'binance', 'coinbase', 'kraken', 'okx'],
  wallet: ['wallet', 'custody', 'storage'],
  defi: ['defi', 'decentralized finance', 'yield'],
  nft: ['nft', 'non-fungible token'],
  web3: ['web3', 'web 3.0'],
};

/**
 * Alert Keywords by Level
 */
export const ALERT_KEYWORDS: Record<AlertLevel, string[]> = {
  critical: [
    'war', 'attack', 'terror', 'crisis', 'emergency', 'disaster',
    'explosion', 'shooting', 'hostage', 'invasion', 'nuclear',
    'biological', 'chemical', 'pandemic', 'epidemic'
  ],
  high: [
    'conflict', 'violence', 'protest', 'riot', 'strike', 'sanction',
    'embargo', 'default', 'bankruptcy', 'crash', 'collapse',
    'hack', 'breach', 'leak', 'outage', 'blackout'
  ],
  medium: [
    'warning', 'alert', 'danger', 'threat', 'risk', 'concern',
    'investigation', 'inquiry', 'hearing', 'lawsuit', 'fine',
    'suspension', 'delay', 'cancellation', 'recall'
  ],
  low: [
    'issue', 'problem', 'challenge', 'difficulty', 'setback',
    'decline', 'drop', 'fall', 'slowdown', 'weakness',
    'uncertainty', 'volatility', 'fluctuation'
  ],
  none: []
};

/**
 * Category Keywords Mapping
 */
export const CATEGORY_KEYWORDS: Record<NewsCategory, string[]> = {
  politics: ['politics', 'government', 'election', 'vote', 'parliament', 'congress', 'senate'],
  tech: ['tech', 'technology', 'innovation', 'startup', 'software', 'hardware', 'device'],
  finance: ['finance', 'economy', 'bank', 'investment', 'stock', 'bond', 'currency'],
  gov: ['gov', 'government', 'policy', 'regulation', 'law', 'legislation', 'bill'],
  ai: ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network'],
  intel: ['intel', 'intelligence', 'security', 'defense', 'military', 'surveillance'],
  crypto: ['crypto', 'cryptocurrency', 'blockchain', 'bitcoin', 'ethereum', 'defi', 'nft'],
  markets: ['market', 'trading', 'exchange', 'price', 'volume', 'liquidity', 'volatility'],
  regulatory: ['regulation', 'regulatory', 'compliance', 'license', 'approval', 'ban'],
  breaking: ['breaking', 'urgent', 'live', 'developing', 'latest', 'update'],
  all: []
};

/**
 * Default RSS Feeds
 */
export const DEFAULT_RSS_FEEDS: RSSFeed[] = [
  // Cryptocurrency News
  {
    id: 'coindesk',
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'crypto',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 10,
    refreshInterval: 300
  },
  {
    id: 'cointelegraph',
    name: 'CoinTelegraph',
    url: 'https://cointelegraph.com/rss',
    category: 'crypto',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 9,
    refreshInterval: 300
  },
  {
    id: 'theblock',
    name: 'The Block',
    url: 'https://www.theblock.co/rss',
    category: 'crypto',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 8,
    refreshInterval: 300
  },
  
  // Financial News
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com/feed/podcast/etf-iq.xml',
    category: 'finance',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 10,
    refreshInterval: 300
  },
  {
    id: 'reuters',
    name: 'Reuters',
    url: 'https://www.reutersagency.com/feed/?best-topics=tech&post_type=best',
    category: 'finance',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 9,
    refreshInterval: 300
  },
  
  // Technology News
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 10,
    refreshInterval: 300
  },
  {
    id: 'theverge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 9,
    refreshInterval: 300
  },
  
  // AI News
  {
    id: 'openai',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss/',
    category: 'ai',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 10,
    refreshInterval: 600
  },
  {
    id: 'anthropic',
    name: 'Anthropic Blog',
    url: 'https://www.anthropic.com/index.xml',
    category: 'ai',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 9,
    refreshInterval: 600
  },
  
  // Breaking News
  {
    id: 'bbc',
    name: 'BBC News',
    url: 'http://feeds.bbci.co.uk/news/rss.xml',
    category: 'breaking',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 10,
    refreshInterval: 180
  },
  {
    id: 'cnn',
    name: 'CNN',
    url: 'http://rss.cnn.com/rss/edition.rss',
    category: 'breaking',
    language: 'en',
    region: 'global',
    enabled: true,
    priority: 9,
    refreshInterval: 180
  }
];

/**
 * Default Alert Rules
 */
export const DEFAULT_ALERT_RULES: KeywordAlertRule[] = [
  // Cryptocurrency Alerts
  {
    id: 'crypto_btc_breakout',
    keyword: 'bitcoin.*break.*\\$[0-9]+,[0-9]+',
    category: 'crypto',
    alertLevel: 'high',
    enabled: true,
    regex: true,
    caseSensitive: false,
    description: 'Bitcoin price breakout',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'crypto_etf_approval',
    keyword: 'etf.*approv',
    category: 'crypto',
    alertLevel: 'high',
    enabled: true,
    regex: true,
    caseSensitive: false,
    description: 'ETF approval news',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'crypto_hack',
    keyword: 'hack|exploit|breach|theft',
    category: 'crypto',
    alertLevel: 'critical',
    enabled: true,
    regex: true,
    caseSensitive: false,
    description: 'Cryptocurrency hack or exploit',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Market Alerts
  {
    id: 'market_crash',
    keyword: 'market.*crash|stock.*crash|plunge|tumble',
    category: 'markets',
    alertLevel: 'high',
    enabled: true,
    regex: true,
    caseSensitive: false,
    description: 'Market crash or significant drop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'fed_decision',
    keyword: 'federal reserve|fed.*rate',
    category: 'finance',
    alertLevel: 'medium',
    enabled: true,
    regex: true,
    caseSensitive: false,
    description: 'Federal Reserve decision',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Regulatory Alerts
  {
    id: 'regulatory_crackdown',
    keyword: 'crackdown|ban|restrict|regulat.*tighten',
    category: 'regulatory',
    alertLevel: 'high',
    enabled: true,
    regex: true,
    caseSensitive: false,
    description: 'Regulatory crackdown or ban',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Technology Alerts
  {
    id: 'tech_breakthrough',
    keyword: 'breakthrough|revolution|game.*changer',
    category: 'tech',
    alertLevel: 'medium',
    enabled: true,
    regex: true,
    caseSensitive: false,
    description: 'Technology breakthrough',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // AI Alerts
  {
    id: 'ai_breakthrough',
    keyword: 'agi|artificial general intelligence|superintelligence',
    category: 'ai',
    alertLevel: 'high',
    enabled: true,
    regex: true,
    caseSensitive: false,
    description: 'AGI or major AI breakthrough',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];