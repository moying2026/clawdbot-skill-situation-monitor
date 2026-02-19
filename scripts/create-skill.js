#!/usr/bin/env node

/**
 * 技能创建脚本 - 从模板创建新技能
 * 使用方法: node scripts/create-skill.js <skill-name> [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 命令行参数解析
const args = process.argv.slice(2);
const skillName = args[0];
const options = {
  description: args.find(arg => arg.startsWith('--description='))?.split('=')[1] || `A Clawdbot skill for ${skillName}`,
  author: args.find(arg => arg.startsWith('--author='))?.split('=')[1] || 'Your Name <your.email@example.com>',
  keywords: args.find(arg => arg.startsWith('--keywords='))?.split('=')[1]?.split(',') || [skillName, 'clawdbot', 'automation'],
  template: args.find(arg => arg.startsWith('--template='))?.split('=')[1] || 'basic',
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose')
};

// 验证参数
if (!skillName) {
  console.error('错误: 请提供技能名称');
  console.error('使用方法: node scripts/create-skill.js <skill-name> [options]');
  console.error('\n选项:');
  console.error('  --description=<text>    技能描述');
  console.error('  --author=<text>         作者信息');
  console.error('  --keywords=<list>       关键词，用逗号分隔');
  console.error('  --template=<name>       模板名称 (basic, advanced, minimal)');
  console.error('  --dry-run               模拟运行，不实际创建文件');
  console.error('  --verbose               详细输出');
  process.exit(1);
}

// 工具函数
function log(message, level = 'info') {
  const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
  console.log(`${prefix} ${message}`);
}

function error(message) {
  log(message, 'error');
  process.exit(1);
}

function warn(message) {
  log(message, 'warn');
}

function info(message) {
  log(message, 'info');
}

function debug(message) {
  if (options.verbose) {
    console.log(`🔍 ${message}`);
  }
}

// 模板文件处理
function processTemplate(content, replacements) {
  let processed = content;
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    processed = processed.replace(regex, value);
  });
  return processed;
}

// 主函数
async function main() {
  info(`开始创建技能: ${skillName}`);
  info(`模板: ${options.template}`);
  
  // 定义替换变量
  const replacements = {
    'skill-name': skillName,
    'Skill description for Clawdbot': options.description,
    'your-username': 'moying2026',
    'your.email@example.com': options.author.includes('<') ? options.author.match(/<([^>]+)>/)?.[1] || 'your.email@example.com' : options.author,
    'Your Name': options.author.includes('<') ? options.author.split('<')[0].trim() : options.author,
    'skill-keywords': options.keywords.join('", "')
  };
  
  // 目标目录
  const targetDir = path.join(process.cwd(), '..', skillName);
  
  if (fs.existsSync(targetDir)) {
    error(`目录已存在: ${targetDir}`);
  }
  
  if (options.dryRun) {
    info(`将创建目录: ${targetDir} (dry-run模式)`);
    return;
  }
  
  // 创建目录结构
  info('创建目录结构...');
  const dirs = [
    targetDir,
    path.join(targetDir, 'src'),
    path.join(targetDir, 'src/commands'),
    path.join(targetDir, 'src/modules'),
    path.join(targetDir, 'src/utils'),
    path.join(targetDir, 'src/types'),
    path.join(targetDir, 'docs'),
    path.join(targetDir, 'tests'),
    path.join(targetDir, 'tests/unit'),
    path.join(targetDir, 'tests/integration'),
    path.join(targetDir, 'tests/e2e'),
    path.join(targetDir, 'tests/fixtures'),
    path.join(targetDir, 'config'),
    path.join(targetDir, 'scripts')
  ];
  
  dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
    debug(`创建目录: ${dir}`);
  });
  
  // 复制模板文件
  info('复制模板文件...');
  const templateDir = __dirname;
  
  const templateFiles = [
    { source: 'package.json', target: 'package.json' },
    { source: 'tsconfig.json', target: 'tsconfig.json' },
    { source: 'jest.config.js', target: 'jest.config.js' },
    { source: '.eslintrc.js', target: '.eslintrc.js' },
    { source: '.prettierrc.js', target: '.prettierrc.js' },
    { source: '.gitignore', target: '.gitignore' },
    { source: 'scripts/publish-to-github.js', target: 'scripts/publish-to-github.js' }
  ];
  
  templateFiles.forEach(({ source, target }) => {
    const sourcePath = path.join(templateDir, '..', '..', source);
    const targetPath = path.join(targetDir, target);
    
    if (fs.existsSync(sourcePath)) {
      const content = fs.readFileSync(sourcePath, 'utf8');
      const processed = processTemplate(content, replacements);
      fs.writeFileSync(targetPath, processed);
      debug(`创建文件: ${target}`);
    } else {
      warn(`模板文件不存在: ${sourcePath}`);
    }
  });
  
  // 创建基本源文件
  info('创建基本源文件...');
  
  // 创建index.ts
  const indexContent = `/**
 * ${skillName} - Clawdbot技能
 * ${options.description}
 */

import { Command } from '@clawdbot/types';

// 技能配置
export const config = {
  name: '${skillName}',
  version: '1.0.0',
  description: '${options.description}',
  commands: [] as Command[]
};

// 技能初始化
export async function initialize() {
  console.log(\`技能 \${config.name} v\${config.version} 初始化\`);
  
  // 注册命令
  config.commands.forEach(command => {
    console.log(\`注册命令: \${command.name}\`);
  });
  
  return config;
}

// 技能清理
export async function cleanup() {
  console.log(\`技能 \${config.name} 清理\`);
}

export default {
  config,
  initialize,
  cleanup
};`;
  
  fs.writeFileSync(path.join(targetDir, 'src/index.ts'), indexContent);
  
  // 创建SKILL.md
  const skillMdContent = `# ${skillName} - Clawdbot技能

## 概述

${options.description}

## 功能特性

- 功能1
- 功能2
- 功能3

## 安装

\`\`\`bash
# 克隆仓库
git clone https://github.com/moying2026/clawdbot-skill-${skillName}.git

# 安装依赖
cd clawdbot-skill-${skillName}
npm install

# 构建
npm run build
\`\`\`

## 使用

\`\`\`bash
# 运行技能
openclaw-cn ${skillName} --help
\`\`\`

## 配置

技能配置文件位于 \`config/default.json\`:

\`\`\`json
{
  "${skillName}": {
    "enabled": true,
    "settings": {}
  }
}
\`\`\`

## 开发

\`\`\`bash
# 开发模式
npm run build:watch

# 运行测试
npm test

# 代码检查
npm run lint

# 代码格式化
npm run format
\`\`\`

## 发布

\`\`\`bash
# 发布到GitHub
npm run publish:github

# 完整发布流程
npm run deploy
\`\`\`

## 许可证

MIT License

## 作者

${options.author}

## 支持

如有问题，请提交Issue: https://github.com/moying2026/clawdbot-skill-${skillName}/issues`;
  
  fs.writeFileSync(path.join(targetDir, 'SKILL.md'), skillMdContent);
  
  // 创建README.md
  const readmeContent = `# clawdbot-skill-${skillName}

${options.description}

## 🚀 快速开始

### 安装
\`\`\`bash
npm install clawdbot-skill-${skillName}
\`\`\`

### 使用
\`\`\`bash
openclaw-cn ${skillName} --help
\`\`\`

## 📖 文档

详细文档请查看:
- [API文档](./docs/API.md)
- [配置指南](./docs/CONFIGURATION.md)
- [测试文档](./docs/TESTING.md)

## 🛠️ 开发

### 环境设置
\`\`\`bash
# 克隆仓库
git clone https://github.com/moying2026/clawdbot-skill-${skillName}.git
cd clawdbot-skill-${skillName}

# 安装依赖
npm install

# 开发模式
npm run build:watch
\`\`\`

### 测试
\`\`\`bash
# 运行所有测试
npm test

# 运行特定测试
npm run test:unit
npm run test:integration
npm run test:e2e

# 测试覆盖率
npm run test:coverage
\`\`\`

### 代码质量
\`\`\`bash
# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npx tsc --noEmit
\`\`\`

## 📦 发布

### 版本管理
\`\`\`bash
# 发布新版本
npm run release          # 标准版本
npm run release:patch    # 补丁版本
npm run release:minor    # 次要版本
npm run release:major    # 主要版本
\`\`\`

### 发布到GitHub
\`\`\`bash
# 自动化发布
npm run publish:github

# 完整发布流程
npm run deploy
\`\`\`

## 🤝 贡献

欢迎贡献！请查看[贡献指南](./CONTRIBUTING.md)。

## 📄 许可证

MIT License - 查看[LICENSE](./LICENSE)文件。

## 📞 支持

- 问题跟踪: https://github.com/moying2026/clawdbot-skill-${skillName}/issues
- 讨论: https://github.com/moying2026/clawdbot-skill-${skillName}/discussions`;
  
  fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent);
  
  // 创建LICENSE
  const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()} ${options.author.includes('<') ? options.author.split('<')[0].trim() : options.author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
  
  fs.writeFileSync(path.join(targetDir, 'LICENSE'), licenseContent);
  
  // 初始化Git仓库
  info('初始化Git仓库...');
  try {
    execSync('git init', { cwd: targetDir, stdio: 'pipe' });
    execSync('git add .', { cwd: targetDir, stdio: 'pipe' });
    execSync('git commit -m "Initial commit: clawdbot-skill-' + skillName + ' v1.0.0"', { 
      cwd: targetDir, 
      stdio: 'pipe' 
    });
    info('Git仓库初始化完成');
  } catch (err) {
    warn(`Git初始化失败: ${err.message}`);
  }
  
  // 安装依赖
  info('安装依赖...');
  try {
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
    info('依赖安装完成');
  } catch (err) {
    warn(`依赖安装失败: ${err.message}`);
  }
  
  info(`🎉 技能创建完成: ${targetDir}`);
  info(`下一步:`);
  info(`  1. cd ${targetDir}`);
  info(`  2. 开始开发你的技能`);
  info(`  3. 运行测试: npm test`);
  info(`  4. 发布到GitHub: npm run publish:github`);
}

// 运行主函数
main().catch(err => {
  error(`创建失败: ${err.message}`);
});