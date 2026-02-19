# API 详细文档

## 📋 概述

本技能提供完整的API接口，支持新闻监控、市场数据获取、智能分析和报告生成等功能。所有API都通过TypeScript类型安全接口暴露。

## 🏗️ 架构设计

### 模块结构
```
src/
├── config/           # 配置管理
├── news/             # 新闻监控
├── markets/          # 市场数据
├── analysis/         # 智能分析
├── tools/            # 工具函数
└── commands/         # CLI命令接口
```

### 设计原则
1. **类型安全**：所有接口都有完整的TypeScript类型定义
2. **错误处理**：统一的错误处理机制
3. **可扩展性**：模块化设计，易于扩展
4. **性能优化**：缓存机制和异步处理

## 📰 新闻模块 API

### NewsMonitor 类

```typescript
import { NewsMonitor, NewsArticle, NewsCategory } from './news';

// 创建新闻监控器
const monitor = new NewsMonitor(config);

// 获取新闻
const articles: NewsArticle[] = await monitor.fetchNews(
  category: NewsCategory,  // 'politics' | 'tech' | 'finance'
  options?: {
    limit?: number;        // 限制数量，默认10
    keywords?: string[];   // 关键词过滤
    hours?: number;       // 时间范围（小时）
  }
);

// 关键词检测
const filtered = monitor.filterByKeywords(
  articles: NewsArticle[],
  keywords: string[]
): NewsArticle[];

// 获取新闻摘要
const summary = monitor.generateSummary(
  articles: NewsArticle[],
  maxLength: number = 500
): string;

// 检查新闻警报
const alerts = monitor.checkAlerts(
  articles: NewsArticle[],
  alertKeywords: string[]
): NewsAlert[];
```

### 新闻数据类型

```typescript
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Date;
  category: NewsCategory;
  keywords: string[];
  sentiment?: number;  // -1到1，情感分析得分
}

interface NewsAlert {
  id: string;
  articleId: string;
  keyword: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}
```

## 📊 市场模块 API

### MarketData 类

```typescript
import { MarketData, MarketPrice, TechnicalIndicator } from './markets';

// 创建市场数据实例
const market = new MarketData(config);

// 获取加密货币价格
const prices: MarketPrice[] = await market.getCryptoPrices(
  symbols: string[],      // ['ETH', 'BTC', 'SOL']
  options?: {
    interval?: string;    // '1m', '5m', '1h', '1d'
    limit?: number;       // 数据点数量
    startTime?: Date;     // 开始时间
    endTime?: Date;       // 结束时间
  }
);

// 获取股票市场数据
const stockPrices = await market.getStockPrices(
  symbols: string[],      // ['SPX', 'NDX', 'DJI']
  options?: MarketOptions
);

// 获取大宗商品价格
const commodityPrices = await market.getCommodityPrices(
  symbols: string[],      // ['GOLD', 'OIL', 'SILVER']
  options?: MarketOptions
);

// 计算技术指标
const indicators: TechnicalIndicator[] = market.calculateIndicators(
  prices: MarketPrice[],
  indicators: string[]    // ['RSI', 'MACD', 'BB', 'MA']
);

// 获取市场状态
const status = await market.getMarketStatus(): MarketStatus;
```

### 市场数据类型

```typescript
interface MarketPrice {
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;      // 价格变化
  changePercent: number; // 变化百分比
}

interface TechnicalIndicator {
  name: string;        // 'RSI', 'MACD', 'BB'
  value: number;
  signal?: 'buy' | 'sell' | 'hold';
  timestamp: Date;
}

interface MarketStatus {
  isOpen: boolean;
  lastUpdate: Date;
  volatility: number;  // 波动率指数
  trend: 'bullish' | 'bearish' | 'neutral';
}
```

## 🔍 分析模块 API

### Analyzer 类

```typescript
import { Analyzer, AnalysisResult, RiskAssessment } from './analysis';

// 创建分析器
const analyzer = new Analyzer(config);

// 运行综合分析
const result: AnalysisResult = await analyzer.analyze(
  assets: string[],      // ['ETH', 'BTC']
  options?: {
    timeframe?: string;  // '1d', '1w', '1m'
    indicators?: string[]; // 技术指标
    includeNews?: boolean; // 是否包含新闻分析
  }
);

// 风险评估
const risk: RiskAssessment = analyzer.assessRisk(
  prices: MarketPrice[],
  options?: {
    confidence?: number;  // 置信度，默认0.95
    window?: number;      // 时间窗口，默认30
  }
);

// 模式识别
const patterns = analyzer.identifyPatterns(
  prices: MarketPrice[],
  patternTypes?: string[]  // ['head_shoulders', 'double_top', 'triangle']
): Pattern[];

// 相关性分析
const correlations = analyzer.calculateCorrelations(
  assets: string[],      // ['ETH', 'BTC', 'GOLD']
  timeframe?: string     // 时间范围
): CorrelationMatrix;

// 叙事分析
const narratives = await analyzer.analyzeNarratives(
  newsArticles: NewsArticle[],
  timeframe?: string
): NarrativeAnalysis[];
```

### 分析数据类型

```typescript
interface AnalysisResult {
  timestamp: Date;
  assets: string[];
  overallScore: number;      // 0-100综合评分
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: Recommendation[];
  technicalAnalysis: TechnicalAnalysis;
  fundamentalAnalysis?: FundamentalAnalysis;
  sentimentAnalysis?: SentimentAnalysis;
}

interface Recommendation {
  action: 'buy' | 'sell' | 'hold' | 'wait';
  asset: string;
  confidence: number;        // 0-1置信度
  reason: string;
  targetPrice?: number;
  stopLoss?: number;
}

interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;             // 0-100风险分数
  factors: RiskFactor[];
  suggestions: string[];
}

interface Pattern {
  type: string;
  confidence: number;
  startTime: Date;
  endTime: Date;
  targetPrice?: number;
  stopLoss?: number;
}
```

## 🛠️ 工具模块 API

### ReportGenerator 类

```typescript
import { ReportGenerator, ReportFormat } from './tools';

// 创建报告生成器
const reporter = new ReportGenerator(config);

// 生成每日报告
const dailyReport = await reporter.generateDailyReport(
  options?: {
    focus?: string;          // 'crypto', 'stocks', 'all'
    format?: ReportFormat;   // 'markdown', 'html', 'pdf'
    includeCharts?: boolean; // 是否包含图表
  }
);

// 生成每周报告
const weeklyReport = await reporter.generateWeeklyReport(options);

// 生成自定义报告
const customReport = await reporter.generateReport(
  data: any,
  template: string,
  options?: ReportOptions
);

// 导出报告
await reporter.exportReport(
  report: string,
  format: ReportFormat,
  outputPath: string
);
```

### DataExporter 类

```typescript
import { DataExporter, ExportFormat } from './tools';

// 创建数据导出器
const exporter = new DataExporter(config);

// 导出为JSON
await exporter.toJSON(
  data: any,
  filePath: string,
  options?: {
    pretty?: boolean;        // 美化输出
    includeMetadata?: boolean; // 包含元数据
  }
);

// 导出为CSV
await exporter.toCSV(
  data: any[],
  filePath: string,
  options?: {
    delimiter?: string;      // 分隔符，默认','
    headers?: string[];      // 自定义表头
  }
);

// 导出为Markdown
await exporter.toMarkdown(
  data: any,
  filePath: string,
  options?: {
    includeTable?: boolean;  // 是否包含表格
    includeSummary?: boolean; // 是否包含摘要
  }
);
```

## 🔌 CLI 命令 API

### 命令结构

```typescript
import { Command, Option } from 'commander';

// 创建主命令
const program = new Command('situation-monitor');

// 新闻命令
program
  .command('news <category>')
  .description('获取新闻')
  .option('-l, --limit <number>', '限制返回数量', '10')
  .option('-k, --keywords <words>', '关键词过滤')
  .option('--hours <number>', '时间范围（小时）')
  .option('-f, --format <format>', '输出格式', 'table')
  .action(async (category, options) => {
    // 命令处理逻辑
  });

// 市场命令
program
  .command('markets')
  .description('获取市场数据')
  .option('-s, --symbol <symbols>', '资产符号')
  .option('-i, --interval <interval>', '时间间隔', '1h')
  .option('--indicators <indicators>', '技术指标')
  .action(async (options) => {
    // 命令处理逻辑
  });

// 分析命令
program
  .command('analyze')
  .description('运行分析')
  .option('-a, --assets <symbols>', '分析资产')
  .option('--strategy <strategy>', '分析策略')
  .option('--risk', '风险评估')
  .option('--backtest', '历史回测')
  .action(async (options) => {
    // 命令处理逻辑
  });

// 报告命令
program
  .command('report <type>')
  .description('生成报告')
  .option('--focus <focus>', '报告重点')
  .option('-f, --format <format>', '报告格式', 'markdown')
  .option('-o, --output <path>', '输出路径')
  .action(async (type, options) => {
    // 命令处理逻辑
  });
```

## 🔧 配置 API

### ConfigManager 类

```typescript
import { ConfigManager, AppConfig } from './config';

// 创建配置管理器
const configManager = new ConfigManager();

// 加载配置
await configManager.load(): Promise<AppConfig>;

// 获取配置
const newsConfig = configManager.get('news');
const marketConfig = configManager.get('markets');

// 更新配置
configManager.set('news.sources', ['local/rss/news.xml']);

// 保存配置
await configManager.save(): Promise<void>;

// 重置为默认配置
await configManager.reset(): Promise<void>;

// 验证配置
const isValid = configManager.validate(): boolean;
const errors = configManager.getValidationErrors(): string[];
```

### 配置类型

```typescript
interface AppConfig {
  news: {
    sources: string[];
    keywords: string[];
    cache: {
      enabled: boolean;
      ttl: number;  // 缓存时间（秒）
    };
    alerts: {
      enabled: boolean;
      keywords: string[];
      severity: 'low' | 'medium' | 'high';
    };
  };
  markets: {
    crypto: {
      symbols: string[];
      interval: string;
      indicators: string[];
    };
    stocks: {
      symbols: string[];
      interval: string;
    };
    commodities: {
      symbols: string[];
      interval: string;
    };
  };
  analysis: {
    risk: {
      enabled: boolean;
      threshold: number;
    };
    patterns: {
      enabled: boolean;
      types: string[];
    };
    correlation: {
      enabled: boolean;
      window: number;
    };
  };
  reporting: {
    daily: {
      enabled: boolean;
      time: string;  // 生成时间，如 '09:00'
      format: string;
    };
    weekly: {
      enabled: boolean;
      day: string;   // 生成日期，如 'monday'
      format: string;
    };
  };
}
```

## 🧪 错误处理

### 错误类型

```typescript
// 自定义错误类
class SituationMonitorError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SituationMonitorError';
  }
}

// 具体错误类型
class ConfigError extends SituationMonitorError {
  constructor(message: string, details?: any) {
    super(message, 'CONFIG_ERROR', details);
  }
}

class NewsError extends SituationMonitorError {
  constructor(message: string, details?: any) {
    super(message, 'NEWS_ERROR', details);
  }
}

class MarketError extends SituationMonitorError {
  constructor(message: string, details?: any) {
    super(message, 'MARKET_ERROR', details);
  }
}

class AnalysisError extends SituationMonitorError {
  constructor(message: string, details?: any) {
    super(message, 'ANALYSIS_ERROR', details);
  }
}
```

### 错误处理示例

```typescript
try {
  const articles = await monitor.fetchNews('finance');
} catch (error) {
  if (error instanceof NewsError) {
    console.error(`新闻获取失败: ${error.message}`);
    console.error(`错误代码: ${error.code}`);
    console.error(`详细信息:`, error.details);
  } else {
    console.error(`未知错误:`, error);
  }
}
```

## 📈 性能优化

### 缓存机制

```typescript
// 缓存管理器
class CacheManager {
  async get<T>(key: string): Promise<T | null>;
  async set<T>(key: string, value: T, ttl?: number): Promise<void>;
  async delete(key: string): Promise<void>;
  async clear(): Promise<void>;
}

// 使用缓存
const cache = new CacheManager();
const cacheKey = `news:${category}:${Date.now()}`;

// 尝试从缓存获取
let articles = await cache.get<NewsArticle[]>(cacheKey);
if (!articles) {
  // 缓存未命中，从API获取
  articles = await monitor.fetchNews(category);
  // 存入缓存（1小时过期）
  await cache.set(cacheKey, articles, 3600);
}
```

### 批量处理

```typescript
// 批量获取市场数据
async function batchGetMarketData(
  symbols: string[],
  interval: string
): Promise<MarketPrice[]> {
  const batchSize = 10;
  const results: MarketPrice[] = [];
  
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(symbol => market.getCryptoPrices([symbol], { interval }))
    );
    results.push(...batchResults.flat());
    
    // 避免速率限制
    await sleep(100);
  }
  
  return results;
}
```

## 🔗 扩展接口

### 插件系统

```typescript
// 插件接口
interface SituationMonitorPlugin {
  name: string;
  version: string;
  initialize(config: any): Promise<void>;
  execute(context: PluginContext): Promise<any>;
  cleanup(): Promise<void>;
}

// 插件上下文
interface PluginContext {
  config: AppConfig;
  newsMonitor: NewsMonitor;
  marketData: MarketData;
  analyzer: Analyzer;
  cache: CacheManager;
}

// 注册插件
class PluginManager {
  register(plugin: SituationMonitorPlugin): void;
  unregister(pluginName: string): void;
  getPlugin(pluginName: string): SituationMonitorPlugin | null;
  executeAll(context: PluginContext): Promise<any[]>;
}
```

---

**注意**：本API文档基于TypeScript类型定义，所有接口都有完整的类型安全保证。建议在使用时启用TypeScript以获得最佳开发体验。