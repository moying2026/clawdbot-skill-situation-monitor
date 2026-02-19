import dotenv from 'dotenv';

// 加载测试环境变量
dotenv.config({ path: '.env.test' });

// 测试配置
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';

// 全局测试超时
jest.setTimeout(10000);

// 全局测试钩子
beforeAll(() => {
  console.log('开始测试套件');
});

afterAll(() => {
  console.log('测试套件完成');
});

beforeEach(() => {
  // 每个测试前的设置
});

afterEach(() => {
  // 每个测试后的清理
});