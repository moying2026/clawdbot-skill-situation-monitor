#!/usr/bin/env node

/**
 * npm发布脚本 - 自动化发布技能包到npm registry
 * 使用方法: npm run publish:npm
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 配置
const CONFIG = {
  NPM_REGISTRY: process.env.NPM_REGISTRY || 'https://registry.npmjs.org',
  NPM_TOKEN: process.env.NPM_TOKEN || getNpmToken(),
  SKILL_NAME: process.env.SKILL_NAME || getSkillName(),
  PACKAGE_NAME: process.env.PACKAGE_NAME || getPackageName(),
  DRY_RUN: process.argv.includes('--dry-run'),
  VERBOSE: process.argv.includes('--verbose'),
  FORCE: process.argv.includes('--force'),
  BETA: process.argv.includes('--beta'),
  TAG: process.argv.includes('--beta') ? 'beta' : 'latest'
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

function getPackageName() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.name;
  } catch (err) {
    error('无法读取package.json获取包名称');
  }
}

function getNpmToken() {
  // 尝试从环境变量获取
  if (process.env.NPM_TOKEN) return process.env.NPM_TOKEN;
  if (process.env.NPM_AUTH_TOKEN) return process.env.NPM_AUTH_TOKEN;
  
  // 尝试从npm配置获取
  try {
    const npmrc = fs.readFileSync(path.join(process.env.HOME || process.env.USERPROFILE, '.npmrc'), 'utf8');
    const match = npmrc.match(/\/\/registry\.npmjs\.org\/:_authToken=([^\n]+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (err) {
    debug('无法从.npmrc读取令牌');
  }
  
  error('未找到npm令牌。请设置NPM_TOKEN环境变量或配置.npmrc');
}

// npm API客户端
const npmClient = axios.create({
  baseURL: CONFIG.NPM_REGISTRY,
  headers: {
    'Authorization': `Bearer ${CONFIG.NPM_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// 步骤函数
async function step1_ValidateEnvironment() {
  info('步骤1: 验证npm发布环境');
  
  // 检查npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    info(`npm版本: ${npmVersion}`);
  } catch (err) {
    error('npm未安装或不可用');
  }
  
  // 检查包名称
  info(`包名称: ${CONFIG.PACKAGE_NAME}`);
  info(`发布标签: ${CONFIG.TAG}`);
  
  // 检查构建状态
  if (!fs.existsSync('dist')) {
    warn('dist目录不存在，需要先构建');
    if (!CONFIG.DRY_RUN) {
      info('运行构建...');
      execSync('npm run build', { stdio: 'inherit' });
    }
  }
  
  return true;
}

async function step2_CheckPackageValidity() {
  info('步骤2: 检查包有效性');
  
  if (CONFIG.DRY_RUN) {
    info('跳过包检查 (dry-run模式)');
    return true;
  }
  
  try {
    // 检查package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // 必需字段检查
    const requiredFields = ['name', 'version', 'description', 'main', 'license'];
    const missingFields = requiredFields.filter(field => !packageJson[field]);
    
    if (missingFields.length > 0) {
      error(`package.json缺少必需字段: ${missingFields.join(', ')}`);
    }
    
    // 版本格式检查
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/;
    if (!versionRegex.test(packageJson.version)) {
      error(`版本号格式无效: ${packageJson.version}`);
    }
    
    // 名称检查
    if (!packageJson.name.startsWith('clawdbot-skill-')) {
      warn(`包名称建议以'clawdbot-skill-'开头: ${packageJson.name}`);
    }
    
    info(`包版本: ${packageJson.version}`);
    info(`包描述: ${packageJson.description}`);
    info(`许可证: ${packageJson.license}`);
    
    return true;
  } catch (err) {
    error(`包检查失败: ${err.message}`);
  }
}

async function step3_CheckNpmRegistry() {
  info('步骤3: 检查npm registry');
  
  if (CONFIG.DRY_RUN) {
    info('跳过registry检查 (dry-run模式)');
    return true;
  }
  
  try {
    // 检查包是否已存在
    info(`检查包 ${CONFIG.PACKAGE_NAME} 是否存在...`);
    const response = await npmClient.get(`/${CONFIG.PACKAGE_NAME}`);
    
    const existingVersion = response.data['dist-tags']?.[CONFIG.TAG];
    const currentVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
    
    if (existingVersion) {
      info(`当前${CONFIG.TAG}标签版本: ${existingVersion}`);
      info(`准备发布版本: ${currentVersion}`);
      
      if (existingVersion === currentVersion && !CONFIG.FORCE) {
        error(`版本 ${currentVersion} 已存在。使用 --force 强制发布`);
      }
      
      // 检查版本是否已存在
      if (response.data.versions && response.data.versions[currentVersion]) {
        if (!CONFIG.FORCE) {
          error(`版本 ${currentVersion} 已存在。使用 --force 强制发布`);
        } else {
          warn(`版本 ${currentVersion} 已存在，强制覆盖`);
        }
      }
    } else {
      info('包不存在或首次发布');
    }
    
    return true;
  } catch (err) {
    if (err.response?.status === 404) {
      info('包不存在，将进行首次发布');
      return true;
    }
    error(`检查npm registry失败: ${err.message}`);
  }
}

async function step4_RunPrePublishChecks() {
  info('步骤4: 运行发布前检查');
  
  if (CONFIG.DRY_RUN) {
    info('跳过发布前检查 (dry-run模式)');
    return true;
  }
  
  try {
    // 运行测试
    info('运行测试...');
    execSync('npm test', { stdio: 'inherit' });
    
    // 运行构建
    info('运行构建...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // 检查构建输出
    if (!fs.existsSync('dist')) {
      error('构建失败: dist目录不存在');
    }
    
    // 检查主要文件
    const mainFile = JSON.parse(fs.readFileSync('package.json', 'utf8')).main;
    if (mainFile && !fs.existsSync(mainFile)) {
      error(`主文件不存在: ${mainFile}`);
    }
    
    // 检查类型声明
    const typesFile = JSON.parse(fs.readFileSync('package.json', 'utf8')).types;
    if (typesFile && !fs.existsSync(typesFile)) {
      warn(`类型声明文件不存在: ${typesFile}`);
    }
    
    return true;
  } catch (err) {
    error(`发布前检查失败: ${err.message}`);
  }
}

async function step5_PublishToNpm() {
  info('步骤5: 发布到npm');
  
  if (CONFIG.DRY_RUN) {
    info(`将发布 ${CONFIG.PACKAGE_NAME}@${CONFIG.TAG} (dry-run模式)`);
    return true;
  }
  
  try {
    // 设置npm registry和认证
    info('配置npm...');
    execSync(`npm config set //registry.npmjs.org/:_authToken ${CONFIG.NPM_TOKEN}`, { stdio: 'pipe' });
    
    // 发布包
    info(`发布 ${CONFIG.PACKAGE_NAME} 到npm...`);
    const publishArgs = ['publish', '--access', 'public'];
    
    if (CONFIG.TAG !== 'latest') {
      publishArgs.push('--tag', CONFIG.TAG);
    }
    
    if (CONFIG.FORCE) {
      publishArgs.push('--force');
    }
    
    execSync(`npm ${publishArgs.join(' ')}`, { stdio: 'inherit' });
    
    info(`🎉 发布成功: ${CONFIG.PACKAGE_NAME}@${CONFIG.TAG}`);
    return true;
  } catch (err) {
    error(`发布失败: ${err.message}`);
  }
}

async function step6_VerifyPublication() {
  info('步骤6: 验证发布');
  
  if (CONFIG.DRY_RUN) {
    info('跳过发布验证 (dry-run模式)');
    return true;
  }
  
  try {
    info('等待npm registry更新...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 验证包已发布
    info(`验证 ${CONFIG.PACKAGE_NAME} 已发布...`);
    const response = await npmClient.get(`/${CONFIG.PACKAGE_NAME}`);
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const publishedVersion = response.data['dist-tags']?.[CONFIG.TAG];
    
    if (publishedVersion === packageJson.version) {
      info(`✅ 验证成功: ${CONFIG.PACKAGE_NAME}@${publishedVersion} 已发布`);
      info(`🔗 npm页面: https://www.npmjs.com/package/${CONFIG.PACKAGE_NAME}`);
    } else {
      warn(`版本不匹配: 期望 ${packageJson.version}, 实际 ${publishedVersion}`);
    }
    
    return true;
  } catch (err) {
    warn(`发布验证失败: ${err.message}`);
    return false;
  }
}

async function step7_UpdatePackageMetadata() {
  info('步骤7: 更新包元数据（可选）');
  
  if (CONFIG.DRY_RUN) {
    info('跳过元数据更新 (dry-run模式)');
    return true;
  }
  
  try {
    // 这里可以添加代码来更新npm包的其他元数据
    // 例如：添加关键词、更新描述、设置主页等
    
    info('包元数据更新功能待实现');
    return true;
  } catch (err) {
    warn(`元数据更新失败: ${err.message}`);
    return false;
  }
}

async function step8_CleanupAndNotify() {
  info('步骤8: 清理和通知');
  
  // 清理临时文件
  try {
    if (fs.existsSync('.npmrc')) {
      const npmrcContent = fs.readFileSync('.npmrc', 'utf8');
      if (npmrcContent.includes(CONFIG.NPM_TOKEN)) {
        fs.unlinkSync('.npmrc');
        info('清理临时.npmrc文件');
      }
    }
  } catch (err) {
    debug(`清理失败: ${err.message}`);
  }
  
  // 生成发布报告
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const report = {
    package: CONFIG.PACKAGE_NAME,
    version: packageJson.version,
    tag: CONFIG.TAG,
    timestamp: new Date().toISOString(),
    registry: CONFIG.NPM_REGISTRY,
    success: true
  };
  
  info('发布报告:');
  console.log(JSON.stringify(report, null, 2));
  
  return true;
}

// 主函数
async function main() {
  try {
    info(`开始npm发布: ${CONFIG.PACKAGE_NAME}`);
    info(`模式: ${CONFIG.DRY_RUN ? 'dry-run' : '生产模式'}`);
    info(`标签: ${CONFIG.TAG}`);
    
    // 执行所有步骤
    await step1_ValidateEnvironment();
    await step2_CheckPackageValidity();
    await step3_CheckNpmRegistry();
    await step4_RunPrePublishChecks();
    await step5_PublishToNpm();
    await step6_VerifyPublication();
    await step7_UpdatePackageMetadata();
    await step8_CleanupAndNotify();
    
    info('🎉 npm发布完成！');
    info(`访问: https://www.npmjs.com/package/${CONFIG.PACKAGE_NAME}`);
    
  } catch (err) {
    error(`npm发布失败: ${err.message}`);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  publishToNpm: main,
  CONFIG
};