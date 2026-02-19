# Situation Monitor Skill

基于原项目 [hipcityreg/situation-monitor](https://github.com/hipcityreg/situation-monitor) 的实时监控仪表板功能，转换为Clawdbot技能。

## 功能模块

### 1. 新闻聚合模块
- GDELT新闻聚合（全球事件数据库）
- RSS源集成（BBC、NYT、Guardian等）
- 分类：政治、科技、金融、政府、AI、情报
- 关键词检测和警报

### 2. 市场数据模块
- 股票指数（道琼斯、标普500、纳斯达克）
- 加密货币（BTC、ETH、SOL等）
- 商品（黄金、原油、天然气等）
- 板块表现（科技、金融、能源等）

### 3. 分析引擎
- 关键词检测和关联分析
- 新兴模式识别
- 动量信号检测
- 跨源相关性分析

## 使用方法

### 基本命令
```bash
# 查看帮助
openclaw-cn situation-monitor --help

# 获取新闻摘要
openclaw-cn situation-monitor news [category]

# 获取市场数据
openclaw-cn situation-monitor markets [type]

# 运行完整分析
openclaw-cn situation-monitor analyze

# 监控特定关键词
openclaw-cn situation-monitor monitor <keyword>
```

### 参数说明
- `category`: 新闻类别 (politics, tech, finance, gov, ai, intel, all)
- `type`: 市场类型 (crypto, indices, sectors, commodities, all)
- `keyword`: 监控关键词（支持正则表达式）

## 配置

### 环境变量
```bash
# Finnhub API密钥（市场数据）
export FINNHUB_API_KEY="your_finnhub_api_key"

# FRED API密钥（经济数据）
export FRED_API_KEY="your_fred_api_key"

# 代理设置（可选）
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"
```

### 配置文件
`~/.config/situation-monitor/config.json`
```json
{
  "news": {
    "categories": ["politics", "tech", "finance"],
    "max_items": 10,
    "refresh_interval": 300
  },
  "markets": {
    "crypto": ["BTC", "ETH", "SOL"],
    "indices": ["^DJI", "^GSPC", "^IXIC"],
    "refresh_interval": 60
  },
  "analysis": {
    "enabled": true,
    "alert_threshold": 3
  }
}
```

## 输出格式

### 新闻输出
```
📰 新闻聚合 - 科技类
────────────────────
1. OpenAI发布新模型 (OpenAI Blog)
   🔗 https://openai.com/news/new-model
   ⏰ 2小时前 | 🚨 警报: BREAKING

2. 谷歌AI突破 (The Verge)
   🔗 https://theverge.com/ai-breakthrough
   ⏰ 3小时前

总计: 8条新闻 | 1条警报
```

### 市场输出
```
📊 市场数据 - 加密货币
────────────────────
BTC  $45,230.50  +2.3% ↗
ETH  $2,450.75   +1.8% ↗
SOL  $98.20      -0.5% ↘

📈 指数表现
────────────────────
DOW  38,450.25   +0.8% ↗
S&P  5,120.75    +1.2% ↗
NDQ  16,230.50   +1.5% ↗
```

### 分析输出
```
🔍 分析结果
────────────────────
🚨 新兴模式: AI监管 (5条新闻)
   • OpenAI面临监管审查
   • 欧盟通过AI法案
   • 美国国会听证会

📈 动量信号: 加密货币 (上升趋势)
   • BTC突破45,000美元
   • ETH ETF预期升温

🔗 跨源相关性: 中东冲突 (3个来源)
   • BBC: 地区紧张升级
   • Al-Monitor: 外交努力
   • The Diplomat: 分析报告
```

## 开发说明

### 项目结构
```
situation-monitor/
├── SKILL.md              # 技能文档
├── index.js              # 主入口文件
├── package.json          # 依赖配置
├── src/
│   ├── news/            # 新闻模块
│   ├── markets/         # 市场模块
│   ├── analysis/        # 分析引擎
│   └── utils/           # 工具函数
└── config/              # 配置文件
```

### 依赖项
- `axios`: HTTP客户端
- `cheerio`: HTML解析
- `node-cron`: 定时任务
- `cli-table3`: 表格输出
- `chalk`: 终端颜色

### API集成
- GDELT API: 全球新闻事件
- Finnhub API: 市场数据
- CoinGecko API: 加密货币
- FRED API: 经济指标

## 故障排除

### 常见问题
1. **API密钥错误**: 检查环境变量设置
2. **网络连接**: 检查代理设置或网络连接
3. **数据格式**: 确保API响应格式正确
4. **内存使用**: 监控缓存大小，定期清理

### 调试模式
```bash
DEBUG=situation-monitor* openclaw-cn situation-monitor analyze
```

## 更新日志

### v1.0.0 (2025-02-19)
- 初始版本发布
- 基于原项目核心功能
- 适配Clawdbot CLI接口
- 支持新闻聚合、市场数据、基础分析