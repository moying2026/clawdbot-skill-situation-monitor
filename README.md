# Clawdbot Skill: Situation Monitor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)

实时全球态势监控技能，特别关注加密货币市场动态和新闻动向，支持网格交易决策。

## 🎯 功能特点

### 📰 新闻监控
- **多源新闻聚合**：支持RSS、API等多种新闻源
- **关键词检测**：实时检测重要新闻关键词
- **智能分类**：自动分类政治、科技、财经新闻
- **警报系统**：重要新闻即时警报

### 📊 市场监控
- **加密货币**：BTC、ETH等主要加密货币价格监控
- **股票市场**：主要股指和个股监控
- **大宗商品**：黄金、原油等大宗商品价格
- **技术指标**：RSI、MACD、布林带等技术指标计算

### 🔍 智能分析
- **模式识别**：识别市场模式和趋势
- **风险评估**：实时风险评估和预警
- **相关性分析**：资产间相关性分析
- **叙事分析**：市场叙事和情绪分析

### 🛠️ 工具支持
- **网格交易支持**：特别优化网格交易决策
- **数据导出**：支持JSON、CSV、Markdown格式导出
- **报告生成**：每日/每周自动报告生成
- **CLI接口**：完整的命令行接口

## 🚀 快速开始

### 安装

```bash
# 进入技能目录
cd skills/situation-monitor

# 安装依赖
npm install

# 编译技能
npm run build

# 测试技能
npm test
```

### 基本使用

```bash
# 查看帮助
openclaw-cn situation-monitor --help

# 获取新闻
openclaw-cn situation-monitor news politics
openclaw-cn situation-monitor news tech
openclaw-cn situation-monitor news finance

# 获取市场数据
openclaw-cn situation-monitor markets
openclaw-cn situation-monitor crypto
openclaw-cn situation-monitor commodities

# 运行分析
openclaw-cn situation-monitor analyze
openclaw-cn situation-monitor correlation
openclaw-cn situation-monitor narratives

# 生成报告
openclaw-cn situation-monitor report daily
openclaw-cn situation-monitor report weekly
```

## 📖 详细使用指南

### 新闻监控

```bash
# 获取政治新闻
openclaw-cn situation-monitor news politics --limit 10

# 获取科技新闻（带关键词过滤）
openclaw-cn situation-monitor news tech --keywords "AI,crypto,blockchain"

# 获取财经新闻（带时间范围）
openclaw-cn situation-monitor news finance --hours 24

# 导出为JSON格式
openclaw-cn situation-monitor news politics --format json > news.json
```

### 市场监控

```bash
# 获取加密货币数据
openclaw-cn situation-monitor crypto --symbol ETH,BTC

# 获取股票市场数据
openclaw-cn situation-monitor markets --index SPX,NDX

# 获取大宗商品数据
openclaw-cn situation-monitor commodities --symbol GOLD,OIL

# 获取技术指标
openclaw-cn situation-monitor crypto --symbol ETH --indicators RSI,MACD,BB
```

### 智能分析

```bash
# 运行综合分析
openclaw-cn situation-monitor analyze --assets ETH,BTC

# 相关性分析
openclaw-cn situation-monitor correlation --assets ETH,BTC,GOLD

# 叙事分析
openclaw-cn situation-monitor narratives --hours 48

# 风险评估
openclaw-cn situation-monitor analyze --risk
```

### 网格交易支持

```bash
# 网格交易分析
openclaw-cn situation-monitor analyze --strategy grid --asset ETH

# 网格参数优化
openclaw-cn situation-monitor analyze --grid-params "lower=1800,upper=2200,steps=20"

# 历史回测
openclaw-cn situation-monitor analyze --backtest --days 30
```

## ⚙️ 配置

### 配置文件

配置文件位于 `config/default.json`：

```json
{
  "news": {
    "sources": [
      "local/rss/politics.xml",
      "local/rss/tech.xml",
      "local/rss/finance.xml"
    ],
    "keywords": [
      "crypto",
      "ETH",
      "BTC",
      "Binance",
      "grid trading",
      "market crash",
      "regulation"
    ],
    "cache": {
      "enabled": true,
      "ttl": 3600
    }
  },
  "markets": {
    "crypto": {
      "symbols": ["ETH", "BTC", "SOL", "ADA"],
      "interval": "1h",
      "indicators": ["RSI", "MACD", "BB"]
    },
    "stocks": {
      "symbols": ["SPX", "NDX", "DJI"],
      "interval": "1d"
    }
  },
  "analysis": {
    "risk": {
      "enabled": true,
      "threshold": 0.7
    },
    "correlation": {
      "enabled": true,
      "window": 30
    }
  }
}
```

### 环境变量

```bash
# 新闻API密钥（可选）
export NEWS_API_KEY=your_api_key

# 市场数据API密钥（可选）
export MARKET_API_KEY=your_api_key

# 缓存目录
export CACHE_DIR=/path/to/cache

# 日志级别
export LOG_LEVEL=info
```

## 📚 API 文档

### 核心模块

#### 1. 配置模块 (`src/config`)
```typescript
import { ConfigManager } from './config';

const config = new ConfigManager();
await config.load(); // 加载配置
const newsConfig = config.get('news'); // 获取新闻配置
```

#### 2. 新闻模块 (`src/news`)
```typescript
import { NewsMonitor } from './news';

const monitor = new NewsMonitor();
const articles = await monitor.fetchNews('politics'); // 获取政治新闻
const filtered = monitor.filterByKeywords(articles, ['crypto']); // 关键词过滤
```

#### 3. 市场模块 (`src/markets`)
```typescript
import { MarketData } from './markets';

const market = new MarketData();
const prices = await market.getCryptoPrices(['ETH', 'BTC']); // 获取加密货币价格
const indicators = market.calculateIndicators(prices, ['RSI', 'MACD']); // 计算技术指标
```

#### 4. 分析模块 (`src/analysis`)
```typescript
import { Analyzer } from './analysis';

const analyzer = new Analyzer();
const risk = analyzer.assessRisk(prices); // 风险评估
const patterns = analyzer.identifyPatterns(prices); // 模式识别
```

#### 5. 工具模块 (`src/tools`)
```typescript
import { ReportGenerator, DataExporter } from './tools';

const reporter = new ReportGenerator();
const report = await reporter.generateDailyReport(); // 生成每日报告

const exporter = new DataExporter();
await exporter.toJSON(data, 'output.json'); // 导出为JSON
await exporter.toCSV(data, 'output.csv'); // 导出为CSV
```

### CLI 命令

完整命令列表：

```bash
# 新闻相关命令
openclaw-cn situation-monitor news <category> [options]
  --limit <number>       限制返回数量
  --keywords <words>     关键词过滤
  --hours <number>       时间范围（小时）
  --format <format>      输出格式（json/csv/markdown）

# 市场相关命令
openclaw-cn situation-monitor markets [options]
  --symbol <symbols>     资产符号
  --interval <interval>  时间间隔
  --indicators <inds>    技术指标

# 分析相关命令
openclaw-cn situation-monitor analyze [options]
  --assets <symbols>     分析资产
  --strategy <strategy>  分析策略
  --risk                 风险评估
  --backtest             历史回测

# 报告相关命令
openclaw-cn situation-monitor report <type> [options]
  --focus <focus>        报告重点
  --format <format>      报告格式
  --output <path>        输出路径
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行端到端测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:coverage
```

### 测试覆盖率

```bash
# 查看覆盖率报告
open coverage/lcov-report/index.html
```

## 🔧 开发

### 项目结构

```
situation-monitor/
├── src/
│   ├── index.ts          # 主入口文件
│   ├── config/           # 配置模块
│   ├── news/             # 新闻模块
│   ├── markets/          # 市场模块
│   ├── analysis/         # 分析模块
│   ├── tools/            # 工具模块
│   └── commands/         # CLI命令
├── config/
│   └── default.json      # 默认配置
├── tests/                # 测试文件
├── docs/                 # 文档
├── package.json
├── tsconfig.json
└── README.md
```

### 构建

```bash
# 开发模式（监听文件变化）
npm run dev

# 生产构建
npm run build

# 清理构建文件
npm run clean
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何开始。

## 📞 支持

- 问题报告：[GitHub Issues](https://github.com/yourusername/clawdbot-skill-situation-monitor/issues)
- 功能请求：[GitHub Discussions](https://github.com/yourusername/clawdbot-skill-situation-monitor/discussions)
- 文档：[GitHub Wiki](https://github.com/yourusername/clawdbot-skill-situation-monitor/wiki)

## 🙏 致谢

- 基于 [hipcityreg/situation-monitor](https://github.com/hipcityreg/situation-monitor) 项目
- 感谢所有贡献者和用户

---

**注意**：本技能默认使用本地数据源，不消耗API Token。如需使用外部API，请参考配置指南。## GitHub仓库\n\n### 创建GitHub仓库\n\n1. 访问 https://github.com/new\n2. 创建新仓库：clawdbot-skill-situation-monitor\n3. 设置为公开仓库\n4. 不要初始化README、.gitignore或许可证\n5. 创建后复制仓库URL\n\n### 推送代码\n\n
