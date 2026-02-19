# 配置指南

## 📋 配置概述

本技能提供灵活的配置系统，支持多种配置源和环境变量。所有配置都有完整的 TypeScript 类型定义，确保类型安全。

## 🏗️ 配置架构

### 配置层次结构
1. **环境变量** (最高优先级)
2. **本地配置文件** (`config/local.json`)
3. **用户配置文件** (`config/user.json`)
4. **默认配置文件** (`config/default.json`)
5. **内置默认值** (最低优先级)

### 配置文件位置
```
config/
├── default.json      # 默认配置（提交到版本控制）
├── user.json         # 用户配置（可选，不提交到版本控制）
├── local.json        # 本地配置（不提交到版本控制）
└── schemas/          # 配置模式定义
    └── config.schema.json
```

## ⚙️ 默认配置

### 完整默认配置
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
      "ttl": 3600,
      "maxSize": 100
    },
    "alerts": {
      "enabled": true,
      "keywords": ["urgent", "breaking", "alert"],
      "severity": "medium",
      "notify": true
    },
    "api": {
      "enabled": false,
      "provider": "newsapi",
      "apiKey": "",
      "rateLimit": 100
    }
  },
  "markets": {
    "crypto": {
      "enabled": true,
      "symbols": ["ETH", "BTC", "SOL", "ADA"],
      "interval": "1h",
      "indicators": ["RSI", "MACD", "BB", "MA"],
      "api": {
        "provider": "coingecko",
        "apiKey": "",
        "cache": true
      }
    },
    "stocks": {
      "enabled": false,
      "symbols": ["SPX", "NDX", "DJI"],
      "interval": "1d",
      "api": {
        "provider": "alphavantage",
        "apiKey": ""
      }
    },
    "commodities": {
      "enabled": false,
      "symbols": ["GOLD", "OIL", "SILVER"],
      "interval": "1d"
    }
  },
  "analysis": {
    "risk": {
      "enabled": true,
      "threshold": 0.7,
      "confidence": 0.95,
      "window": 30
    },
    "patterns": {
      "enabled": true,
      "types": ["head_shoulders", "double_top", "triangle", "wedge"],
      "confidence": 0.8
    },
    "correlation": {
      "enabled": true,
      "window": 30,
      "threshold": 0.5
    },
    "sentiment": {
      "enabled": true,
      "provider": "local",
      "apiKey": ""
    }
  },
  "reporting": {
    "daily": {
      "enabled": true,
      "time": "09:00",
      "format": "markdown",
      "recipients": [],
      "include": ["news", "markets", "analysis", "recommendations"]
    },
    "weekly": {
      "enabled": true,
      "day": "monday",
      "time": "10:00",
      "format": "html",
      "recipients": [],
      "include": ["summary", "trends", "performance", "outlook"]
    },
    "alerts": {
      "enabled": true,
      "channels": ["console", "email"],
      "threshold": "high"
    }
  },
  "gridTrading": {
    "enabled": true,
    "assets": ["ETH"],
    "parameters": {
      "lowerBound": 1800,
      "upperBound": 2200,
      "gridCount": 20,
      "investment": 1000,
      "takeProfit": 0.02,
      "stopLoss": 0.05
    },
    "optimization": {
      "enabled": true,
      "method": "genetic",
      "iterations": 100
    }
  },
  "performance": {
    "cache": {
      "enabled": true,
      "strategy": "lru",
      "maxSize": 1000,
      "ttl": 3600
    },
    "logging": {
      "level": "info",
      "format": "json",
      "output": "console"
    },
    "monitoring": {
      "enabled": true,
      "metrics": ["responseTime", "errorRate", "cacheHitRate"]
    }
  },
  "security": {
    "apiKeys": {
      "encrypt": true,
      "rotation": 90
    },
    "rateLimiting": {
      "enabled": true,
      "requests": 100,
      "window": 3600
    },
    "validation": {
      "enabled": true,
      "strict": false
    }
  }
}
```

## 🔧 配置方式

### 1. 环境变量配置

```bash
# 新闻配置
export NEWS_API_KEY=your_news_api_key
export NEWS_SOURCES="local/rss/politics.xml,local/rss/tech.xml"
export NEWS_KEYWORDS="crypto,ETH,BTC"
export NEWS_CACHE_TTL=3600

# 市场配置
export MARKETS_CRYPTO_SYMBOLS="ETH,BTC,SOL"
export MARKETS_CRYPTO_INTERVAL="1h"
export MARKETS_CRYPTO_API_KEY=your_crypto_api_key

# 分析配置
export ANALYSIS_RISK_THRESHOLD=0.7
export ANALYSIS_PATTERNS_ENABLED=true

# 报告配置
export REPORTING_DAILY_TIME="09:00"
export REPORTING_WEEKLY_DAY="monday"

# 性能配置
export PERFORMANCE_CACHE_ENABLED=true
export PERFORMANCE_LOGGING_LEVEL="info"

# 安全配置
export SECURITY_APIKEYS_ENCRYPT=true
```

### 2. 本地配置文件

创建 `config/local.json` 文件：

```json
{
  "news": {
    "api": {
      "enabled": true,
      "provider": "newsapi",
      "apiKey": "your_actual_api_key_here"
    }
  },
  "markets": {
    "crypto": {
      "api": {
        "provider": "coingecko",
        "apiKey": "your_actual_api_key_here"
      }
    }
  }
}
```

**重要**: `config/local.json` 文件应该添加到 `.gitignore`，不提交到版本控制。

### 3. 用户配置文件

创建 `config/user.json` 文件用于用户特定配置：

```json
{
  "news": {
    "keywords": ["crypto", "ETH", "grid trading"]
  },
  "gridTrading": {
    "assets": ["ETH"],
    "parameters": {
      "lowerBound": 1800,
      "upperBound": 2200,
      "gridCount": 20
    }
  }
}
```

### 4. CLI 参数配置

```bash
# 覆盖特定配置
openclaw-cn situation-monitor news politics \
  --config.news.keywords="crypto,ETH" \
  --config.news.cache.ttl=1800

# 使用自定义配置文件
openclaw-cn situation-monitor markets \
  --config-file /path/to/custom-config.json
```

## 🎯 特定场景配置

### 加密货币交易者配置

```json
{
  "news": {
    "keywords": [
      "crypto",
      "ETH",
      "BTC",
      "Binance",
      "regulation",
      "SEC",
      "ETF",
      "halving"
    ],
    "alerts": {
      "keywords": ["crash", "surge", "ban", "approval"],
      "severity": "high"
    }
  },
  "markets": {
    "crypto": {
      "symbols": ["ETH", "BTC", "SOL", "ADA", "DOT"],
      "interval": "15m",
      "indicators": ["RSI", "MACD", "BB", "OBV", "Volume"]
    }
  },
  "gridTrading": {
    "assets": ["ETH"],
    "parameters": {
      "lowerBound": 1800,
      "upperBound": 2200,
      "gridCount": 20,
      "investment": 5000,
      "takeProfit": 0.015,
      "stopLoss": 0.03
    }
  }
}
```

### 新闻分析师配置

```json
{
  "news": {
    "sources": [
      "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=tech&post_type=best"
    ],
    "keywords": [
      "geopolitics",
      "economy",
      "technology",
      "climate",
      "health"
    ],
    "cache": {
      "enabled": true,
      "ttl": 1800
    }
  },
  "analysis": {
    "sentiment": {
      "enabled": true,
      "provider": "openai",
      "apiKey": "your_openai_api_key"
    }
  },
  "reporting": {
    "daily": {
      "include": ["news", "sentiment", "trends"]
    }
  }
}
```

### 开发者/测试配置

```json
{
  "news": {
    "cache": {
      "enabled": false
    },
    "api": {
      "enabled": false
    }
  },
  "markets": {
    "crypto": {
      "api": {
        "enabled": false
      }
    }
  },
  "performance": {
    "logging": {
      "level": "debug"
    }
  },
  "security": {
    "validation": {
      "strict": true
    }
  }
}
```

## 🔒 安全配置

### API 密钥管理

```bash
# 使用环境变量（推荐）
export NEWS_API_KEY=sk_live_abc123...
export CRYPTO_API_KEY=sk_live_def456...

# 使用密钥管理服务
export AWS_SECRETS_MANAGER_ENABLED=true
export SECRETS_MANAGER_REGION=us-east-1
```

### 配置文件安全

1. **不要提交敏感信息到版本控制**
   ```gitignore
   # .gitignore
   config/local.json
   config/*.key
   *.env
   secrets/
   ```

2. **加密敏感配置**
   ```typescript
   // 使用加密的配置值
   const encryptedApiKey = process.env.ENCRYPTED_API_KEY;
   const apiKey = decrypt(encryptedApiKey, encryptionKey);
   ```

3. **配置验证**
   ```typescript
   // 验证配置
   const config = loadConfig();
   const errors = validateConfig(config);
   if (errors.length > 0) {
     throw new Error(`配置验证失败: ${errors.join(', ')}`);
   }
   ```

## 🚀 性能优化配置

### 缓存配置
```json
{
  "performance": {
    "cache": {
      "enabled": true,
      "strategy": "lru",
      "maxSize": 1000,
      "ttl": 3600,
      "compression": true
    }
  }
}
```

### 并发配置
```json
{
  "performance": {
    "concurrency": {
      "maxConnections": 10,
      "timeout": 30000,
      "retry": {
        "attempts": 3,
        "delay": 1000
      }
    }
  }
}
```

### 日志配置
```json
{
  "performance": {
    "logging": {
      "level": "info",
      "format": "json",
      "output": "file",
      "file": {
        "path": "logs/app.log",
        "maxSize": "10MB",
        "maxFiles": 5
      }
    }
  }
}
```

## 🔧 配置验证

### 配置模式验证
```typescript
import { validateConfig } from './config/validator';

const config = await loadConfig();
const validationResult = validateConfig(config);

if (!validationResult.valid) {
  console.error('配置验证失败:');
  validationResult.errors.forEach(error => {
    console.error(`- ${error.path}: ${error.message}`);
  });
  process.exit(1);
}
```

### 环境检查
```bash
# 检查配置
npm run config:check

# 验证环境变量
npm run env:check

# 生成配置文档
npm run config:docs
```

## 📊 监控配置

### 指标收集
```json
{
  "monitoring": {
    "enabled": true,
    "metrics": {
      "news": ["fetchCount", "cacheHitRate", "errorRate"],
      "markets": ["priceUpdates", "apiCalls", "latency"],
      "analysis": ["executionTime", "accuracy", "confidence"]
    },
    "exporters": ["console", "prometheus", "datadog"]
  }
}
```

### 警报配置
```json
{
  "alerts": {
    "news": {
      "noNewArticles": {
        "enabled": true,
        "threshold": 3600,
        "channels": ["email", "slack"]
      }
    },
    "markets": {
      "priceChange": {
        "enabled": true,
        "threshold": 0.1,
        "window": 300
      }
    }
  }
}
```

## 🔄 配置更新

### 热重载配置
```typescript
// 启用配置热重载
const configManager = new ConfigManager({
  watch: true,
  watchDebounce: 1000
});

// 监听配置变化
configManager.on('change', (newConfig, oldConfig) => {
  console.log('配置已更新');
  // 重新初始化相关模块
});
```

### 配置迁移
```bash
# 迁移旧配置到新版本
npm run config:migrate -- --from v1 --to v2

# 备份当前配置
npm run config:backup

# 恢复配置
npm run config:restore -- --file backup-20240219.json
```

## ❓ 常见问题

### 配置优先级问题
**问题**: 环境变量和配置文件哪个优先级更高？
**答案**: 环境变量优先级最高，然后是本地配置文件，最后是默认配置。

### 配置验证失败
**问题**: 配置验证失败怎么办？
**解决方案**:
1. 检查配置模式 `config/schemas/config.schema.json`
2. 运行 `npm run config:validate`
3. 查看验证错误详情

### 敏感信息泄露
**问题**: 如何防止 API 密钥泄露？
**解决方案**:
1. 使用环境变量而不是配置文件
2. 加密配置文件中的敏感信息
3. 使用密钥管理服务

### 配置性能问题
**问题**: 配置加载太慢怎么办？
**解决方案**:
1. 启用配置缓存
2. 减少配置文件大小
3. 使用懒加载配置

---

**注意**: 所有配置都有完整的 TypeScript 类型定义，建议使用 TypeScript 以获得最佳开发体验。