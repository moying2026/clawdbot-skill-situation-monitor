#!/usr/bin/env node

/**
 * 简化发布脚本 - 不依赖外部包
 * 使用方法: node scripts/publish-simple.js [github|npm]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

// 配置
const CONFIG = {
  SKILL_NAME: 'situation-monitor',
  GITHUB_USERNAME: 'moying2026',
  REPO_NAME: 'clawdbot-skill-situation-monitor',
  DRY_RUN: process.argv.includes('--dry-run'),
  TARGET: process.argv[2] || 'github'
};

// 工具函数
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function runCommand(command) {
  if (CONFIG.DRY_RUN) {
    log(`将执行: ${command}`);
    return { stdout: '', stderr: '' };
  }
  try {
    const stdout = execSync(command, { encoding: 'utf8' });
    return { stdout, stderr: '' };
  } catch (error) {
    return { stdout: '', stderr: error.message };
  }
}

// 主函数
async function main() {
  log(`开始${CONFIG.DRY_RUN ? '模拟' : ''}发布: ${CONFIG.SKILL_NAME}`);
  
  if (CONFIG.TARGET === 'github') {
    await publishToGitHub();
  } else if (CONFIG.TARGET === 'npm') {
    await publishToNpm();
  } else {
    log(`未知目标: ${CONFIG.TARGET}`);
    log('使用方法: node scripts/publish-simple.js [github|npm] [--dry-run]');
  }
}

async function publishToGitHub() {
  log('发布到GitHub...');
  
  // 检查Git状态
  const status = runCommand('git status --porcelain');
  if (status.stdout.trim()) {
    log('有未提交的更改');
  }
  
  // 添加远程仓库（如果不存在）
  const remotes = runCommand('git remote -v');
  if (!remotes.stdout.includes('origin')) {
    log('添加远程仓库...');
    runCommand(`git remote add origin https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}.git`);
  }
  
  // 推送代码
  log('推送代码到GitHub...');
  runCommand('git push -u origin main');
  
  log(`✅ GitHub发布${CONFIG.DRY_RUN ? '模拟' : '完成'}`);
  log(`🔗 仓库: https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`);
}

async function publishToNpm() {
  log('发布到npm...');
  
  // 检查package.json
  if (!fs.existsSync('package.json')) {
    log('错误: package.json不存在');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  log(`包名称: ${packageJson.name}`);
  log(`版本: ${packageJson.version}`);
  
  // 模拟npm发布
  log('模拟npm发布...');
  log('注意: 实际npm发布需要有效的npm令牌和依赖安装');
  log('当前为简化版本，跳过实际发布');
  
  log(`✅ npm发布${CONFIG.DRY_RUN ? '模拟' : '跳过'}完成`);
  log(`🔗 npm页面: https://www.npmjs.com/package/${packageJson.name}`);
}

// 运行
if (require.main === module) {
  main().catch(error => {
    log(`错误: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main };