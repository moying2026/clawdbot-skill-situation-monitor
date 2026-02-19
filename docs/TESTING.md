# 测试文档

## 🧪 测试概述

本技能包含完整的测试套件，包括单元测试、集成测试和端到端测试。所有测试都使用 Jest 测试框架，并支持 TypeScript。

## 📋 测试结构

### 测试目录结构
```
tests/
├── unit/           # 单元测试
│   ├── config/     # 配置模块测试
│   ├── news/       # 新闻模块测试
│   ├── markets/    # 市场模块测试
│   ├── analysis/   # 分析模块测试
│   └── tools/      # 工具模块测试
├── integration/    # 集成测试
├── e2e/           # 端到端测试
└── fixtures/      # 测试数据
```

### 测试配置文件
- `jest.config.js` - Jest 测试配置
- `tsconfig.test.json` - 测试专用的 TypeScript 配置
- `.env.test` - 测试环境变量

## 🚀 运行测试

### 安装测试依赖
```bash
npm install --save-dev jest ts-jest @types/jest
```

### 运行所有测试
```bash
npm test
```

### 运行特定类型的测试
```bash
# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行端到端测试
npm run test:e2e

# 运行特定模块的测试
npm run test:config
npm run test:news
npm run test:markets
npm run test:analysis
npm run test:tools
```

### 测试覆盖率
```bash
# 生成测试覆盖率报告
npm run test:coverage

# 查看覆盖率报告
open coverage/lcov-report/index.html
```

## 📝 单元测试

### 配置模块测试
```typescript
// tests/unit/config/config.test.ts
import { ConfigManager } from '../../src/config';

describe('ConfigManager', () => {
  let configManager: ConfigManager;

  beforeEach(() => {
    configManager = new ConfigManager();
  });

  test('应该加载默认配置', async () => {
    await configManager.load();
    const config = configManager.get();
    expect(config).toBeDefined();
    expect(config.news).toBeDefined();
    expect(config.markets).toBeDefined();
  });

  test('应该验证配置', async () => {
    await configManager.load();
    const isValid = configManager.validate();
    expect(isValid).toBe(true);
  });

  test('应该处理配置错误', async () => {
    // 测试错误处理
  });
});
```

### 新闻模块测试
```typescript
// tests/unit/news/news.test.ts
import { NewsMonitor } from '../../src/news';

describe('NewsMonitor', () => {
  let newsMonitor: NewsMonitor;

  beforeEach(() => {
    newsMonitor = new NewsMonitor();
  });

  test('应该获取新闻', async () => {
    const articles = await newsMonitor.fetchNews('politics', { limit: 5 });
    expect(articles).toBeInstanceOf(Array);
    expect(articles.length).toBeLessThanOrEqual(5);
  });

  test('应该过滤关键词', async () => {
    const articles = [
      { title: '加密货币市场大涨', content: 'BTC突破50000美元' },
      { title: '政治新闻', content: '选举结果公布' }
    ];
    const filtered = newsMonitor.filterByKeywords(articles, ['crypto', 'BTC']);
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toContain('加密货币');
  });
});
```

### 市场模块测试
```typescript
// tests/unit/markets/markets.test.ts
import { MarketData } from '../../src/markets';

describe('MarketData', () => {
  let marketData: MarketData;

  beforeEach(() => {
    marketData = new MarketData();
  });

  test('应该获取加密货币价格', async () => {
    const prices = await marketData.getCryptoPrices(['ETH', 'BTC']);
    expect(prices).toBeInstanceOf(Array);
    prices.forEach(price => {
      expect(price).toHaveProperty('symbol');
      expect(price).toHaveProperty('price');
      expect(price).toHaveProperty('timestamp');
    });
  });

  test('应该计算技术指标', async () => {
    const prices = [
      { symbol: 'ETH', price: 2000, timestamp: new Date() },
      // ... 更多价格数据
    ];
    const indicators = marketData.calculateIndicators(prices, ['RSI', 'MACD']);
    expect(indicators).toBeInstanceOf(Array);
  });
});
```

## 🔗 集成测试

### 模块间集成测试
```typescript
// tests/integration/news-market.test.ts
import { NewsMonitor } from '../../src/news';
import { MarketData } from '../../src/markets';
import { Analyzer } from '../../src/analysis';

describe('新闻和市场数据集成', () => {
  test('应该综合分析新闻和市场数据', async () => {
    const newsMonitor = new NewsMonitor();
    const marketData = new MarketData();
    const analyzer = new Analyzer();

    // 获取新闻
    const articles = await newsMonitor.fetchNews('finance', { limit: 10 });
    
    // 获取市场数据
    const prices = await marketData.getCryptoPrices(['ETH', 'BTC']);
    
    // 运行分析
    const analysis = await analyzer.analyze(['ETH', 'BTC'], {
      includeNews: true,
      newsArticles: articles
    });

    expect(analysis).toBeDefined();
    expect(analysis.recommendations).toBeInstanceOf(Array);
  });
});
```

## 🌐 端到端测试

### CLI 命令测试
```typescript
// tests/e2e/cli.test.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI 端到端测试', () => {
  test('应该运行 help 命令', async () => {
    const { stdout } = await execAsync('openclaw-cn situation-monitor --help');
    expect(stdout).toContain('Usage');
    expect(stdout).toContain('Commands');
  });

  test('应该获取新闻', async () => {
    const { stdout } = await execAsync('openclaw-cn situation-monitor news politics --limit 3');
    expect(stdout).toContain('政治新闻');
  });

  test('应该获取市场数据', async () => {
    const { stdout } = await execAsync('openclaw-cn situation-monitor markets');
    expect(stdout).toContain('市场数据');
  });
});
```

## 🧹 测试数据

### 测试夹具 (Fixtures)
```typescript
// tests/fixtures/news.ts
export const mockNewsArticles = [
  {
    id: '1',
    title: '加密货币市场动态',
    content: 'ETH价格突破2000美元',
    source: 'CoinDesk',
    url: 'https://coindesk.com',
    publishedAt: new Date(),
    category: 'finance' as const,
    keywords: ['crypto', 'ETH', 'market']
  },
  // ... 更多测试数据
];

// tests/fixtures/markets.ts
export const mockMarketPrices = [
  {
    symbol: 'ETH',
    price: 2100,
    volume: 1000000,
    timestamp: new Date(),
    open: 2050,
    high: 2150,
    low: 2000,
    close: 2100,
    change: 50,
    changePercent: 2.44
  },
  // ... 更多测试数据
];
```

## 🔧 测试配置

### Jest 配置
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### 测试环境变量
```bash
# .env.test
NODE_ENV=test
LOG_LEVEL=silent
CACHE_ENABLED=false
TEST_MODE=true
```

## 🐛 调试测试

### 调试单个测试
```bash
# 使用 --testNamePattern 运行特定测试
npm test -- --testNamePattern="ConfigManager"

# 调试模式
npm run test:debug

# 监视模式（文件变化时自动运行测试）
npm run test:watch
```

### 测试日志
```typescript
// 在测试中启用详细日志
process.env.LOG_LEVEL = 'debug';

// 或者使用 Jest 的 verbose 模式
// jest --verbose
```

## 📊 测试覆盖率

### 覆盖率目标
- **语句覆盖率**: > 90%
- **分支覆盖率**: > 85%
- **函数覆盖率**: > 90%
- **行覆盖率**: > 90%

### 查看覆盖率报告
```bash
# 生成 HTML 报告
npm run test:coverage:html

# 生成 JSON 报告
npm run test:coverage:json

# 生成 LCOV 报告
npm run test:coverage:lcov
```

## 🚨 常见问题

### 测试失败排查
1. **环境变量问题**: 确保 `.env.test` 文件存在且正确
2. **依赖问题**: 运行 `npm install` 确保所有依赖已安装
3. **TypeScript 问题**: 检查 `tsconfig.test.json` 配置
4. **网络问题**: 测试可能需要网络连接，确保网络正常

### 性能优化
```bash
# 使用 --maxWorkers 限制并行测试数量
npm test -- --maxWorkers=4

# 使用 --runInBand 顺序运行测试
npm test -- --runInBand
```

## 🤝 贡献测试

### 添加新测试
1. 在 `tests/` 目录下创建新的测试文件
2. 遵循现有的测试模式
3. 确保测试覆盖所有边界情况
4. 运行测试确保通过

### 测试代码规范
- 使用描述性的测试名称
- 每个测试应该只测试一个功能
- 使用适当的断言
- 清理测试数据

---

**注意**: 所有测试都应该在 CI/CD 管道中自动运行，确保代码质量。