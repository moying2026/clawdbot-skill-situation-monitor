#!/usr/bin/env node

/**
 * 自动化发布脚本 - 将技能发布到GitHub
 * 使用方法: npm run publish:github
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


// 配置
const CONFIG = {
  GITHUB_API: 'https://api.github.com',
  SKILL_NAME: process.env.SKILL_NAME || getSkillName(),
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || getGitHubToken(),
  GITHUB_USERNAME: process.env.GITHUB_USERNAME || 'moying2026',
  REPO_NAME: `clawdbot-skill-${process.env.SKILL_NAME || getSkillName()}`,
  DRY_RUN: process.argv.includes('--dry-run'),
  VERBOSE: process.argv.includes('--verbose')
};

// 工具函数
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
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
  if (CONFIG.VERBOSE) {
    log(message, 'debug');
  }
}

function getSkillName() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const name = packageJson.name.replace('clawdbot-skill-', '');
    return name;
  } catch (err) {
    error('无法读取package.json或解析技能名称');
  }
}

function getGitHubToken() {
  try {
    // 尝试从Git凭证存储获取
    const result = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf8'
    });
    
    const match = result.match(/password=([^\n]+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (err) {
    debug('无法从Git凭证获取GitHub令牌');
  }
  
  // 尝试从环境变量获取
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  
  error('未找到GitHub令牌。请设置GITHUB_TOKEN环境变量或配置Git凭证');
}

// GitHub API客户端
const githubClient = axios.create({
  baseURL: CONFIG.GITHUB_API,
  headers: {
    'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Clawdbot-Skill-Publisher'
  }
});

// 步骤函数
async function step1_ValidateEnvironment() {
  info('步骤1: 验证环境');
  
  // 检查Git
  try {
    execSync('git --version', { stdio: 'pipe' });
  } catch (err) {
    error('Git未安装或不可用');
  }
  
  // 检查Node.js
  if (!process.version.startsWith('v18') && !process.version.startsWith('v20')) {
    warn(`Node.js版本${process.version}可能不受支持，推荐使用Node.js 18+`);
  }
  
  // 检查package.json
  if (!fs.existsSync('package.json')) {
    error('未找到package.json文件');
  }
  
  // 检查技能名称
  info(`技能名称: ${CONFIG.SKILL_NAME}`);
  info(`仓库名称: ${CONFIG.REPO_NAME}`);
  
  return true;
}

async function step2_RunTests() {
  info('步骤2: 运行测试');
  
  if (CONFIG.DRY_RUN) {
    info('跳过测试 (dry-run模式)');
    return true;
  }
  
  try {
    info('运行单元测试...');
    execSync('npm test', { stdio: 'inherit' });
    
    info('运行构建...');
    execSync('npm run build', { stdio: 'inherit' });
    
    return true;
  } catch (err) {
    error('测试或构建失败，请修复后再试');
  }
}

async function step3_CheckGitStatus() {
  info('步骤3: 检查Git状态');
  
  try {
    // 检查是否有未提交的更改
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      warn('有未提交的更改，建议先提交更改');
      if (!CONFIG.DRY_RUN) {
        const answer = await askQuestion('是否继续? (y/N): ');
        if (answer.toLowerCase() !== 'y') {
          error('用户取消操作');
        }
      }
    }
    
    // 检查当前分支
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    info(`当前分支: ${branch}`);
    
    // 检查提交历史
    const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    info(`提交数量: ${commitCount}`);
    
    return true;
  } catch (err) {
    error('Git状态检查失败');
  }
}

async function step4_CreateGitHubRepository() {
  info('步骤4: 创建GitHub仓库');
  
  // 检查仓库是否已存在
  try {
    const response = await githubClient.get(`/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`);
    info(`仓库已存在: ${response.data.html_url}`);
    return response.data.clone_url;
  } catch (err) {
    if (err.response?.status !== 404) {
      error(`检查仓库失败: ${err.message}`);
    }
  }
  
  // 创建新仓库
  if (CONFIG.DRY_RUN) {
    info(`将创建仓库: ${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME} (dry-run模式)`);
    return `https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}.git`;
  }
  
  try {
    info(`创建仓库: ${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`);
    
    const repoData = {
      name: CONFIG.REPO_NAME,
      description: `Clawdbot skill: ${CONFIG.SKILL_NAME}`,
      private: false,
      has_issues: true,
      has_projects: false,
      has_wiki: false,
      auto_init: false,
      license_template: 'mit'
    };
    
    const response = await githubClient.post('/user/repos', repoData);
    info(`仓库创建成功: ${response.data.html_url}`);
    
    return response.data.clone_url;
  } catch (err) {
    error(`创建仓库失败: ${err.message}`);
  }
}

async function step5_ConfigureGitRemote(repoUrl) {
  info('步骤5: 配置Git远程仓库');
  
  if (CONFIG.DRY_RUN) {
    info(`将设置远程仓库: ${repoUrl} (dry-run模式)`);
    return;
  }
  
  try {
    // 移除现有的origin（如果存在）
    try {
      execSync('git remote remove origin', { stdio: 'pipe' });
    } catch (err) {
      // 忽略错误，origin可能不存在
    }
    
    // 添加新的origin
    execSync(`git remote add origin ${repoUrl}`, { stdio: 'pipe' });
    info('远程仓库配置成功');
    
    // 验证远程仓库
    const remotes = execSync('git remote -v', { encoding: 'utf8' });
    debug(`远程仓库:\n${remotes}`);
    
  } catch (err) {
    error(`配置远程仓库失败: ${err.message}`);
  }
}

async function step6_PushToGitHub() {
  info('步骤6: 推送到GitHub');
  
  if (CONFIG.DRY_RUN) {
    info('将推送到GitHub (dry-run模式)');
    return;
  }
  
  try {
    // 确保分支名称为main
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    if (currentBranch !== 'main') {
      info(`重命名分支 ${currentBranch} -> main`);
      execSync('git branch -M main', { stdio: 'pipe' });
    }
    
    // 推送代码
    info('推送代码到GitHub...');
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    info('代码推送成功');
  } catch (err) {
    error(`推送代码失败: ${err.message}`);
  }
}

async function step7_CreateRelease() {
  info('步骤7: 创建GitHub Release');
  
  if (CONFIG.DRY_RUN) {
    info('将创建Release (dry-run模式)');
    return;
  }
  
  try {
    // 获取版本号
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = packageJson.version;
    
    // 获取最新的提交信息
    const latestCommit = execSync('git log -1 --pretty=format:"%s"', { encoding: 'utf8' }).trim();
    
    const releaseData = {
      tag_name: `v${version}`,
      name: `v${version} - ${CONFIG.SKILL_NAME}`,
      body: `## 版本 ${version}\n\n${latestCommit}\n\n### 功能\n\n- 初始发布\n- 完整技能实现\n- 详细文档\n\n### 使用方法\n\n\`\`\`bash\nnpm install clawdbot-skill-${CONFIG.SKILL_NAME}\n\`\`\``,
      draft: false,
      prerelease: false,
      generate_release_notes: true
    };
    
    info(`创建Release v${version}...`);
    const response = await githubClient.post(
      `/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}/releases`,
      releaseData
    );
    
    info(`Release创建成功: ${response.data.html_url}`);
  } catch (err) {
    warn(`创建Release失败: ${err.message}`);
  }
}

async function step8_UpdateSkillRegistry() {
  info('步骤8: 更新技能注册表（可选）');
  
  // 这里可以添加代码来更新中央技能注册表
  // 例如：向awesome-openclaw-skills仓库提交PR
  
  info('技能注册表更新功能待实现');
  return true;
}

// 辅助函数
function askQuestion(question) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

// 主函数
async function main() {
  try {
    info(`开始发布技能: ${CONFIG.SKILL_NAME}`);
    info(`模式: ${CONFIG.DRY_RUN ? 'dry-run' : '生产模式'}`);
    
    // 执行所有步骤
    await step1_ValidateEnvironment();
    await step2_RunTests();
    await step3_CheckGitStatus();
    const repoUrl = await step4_CreateGitHubRepository();
    await step5_ConfigureGitRemote(repoUrl);
    await step6_PushToGitHub();
    await step7_CreateRelease();
    await step8_UpdateSkillRegistry();
    
    info('🎉 技能发布完成！');
    info(`访问: https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`);
    
  } catch (err) {
    error(`发布失败: ${err.message}`);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  publishToGitHub: main,
  CONFIG
};