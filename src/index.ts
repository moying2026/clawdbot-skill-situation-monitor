/**
 * Situation Monitor Skill for Clawdbot
 * 
 * Main entry point for the situation monitoring skill.
 * Provides real-time global situation monitoring capabilities.
 */

import { CommandHandler, SkillContext } from './commands';
import { NewsModule } from './modules/news';
import { MarketsModule } from './modules/markets';
import { AnalysisModule } from './modules/analysis';
import { ConfigManager } from './config';
import { logger } from './utils/logger';

/**
 * Situation Monitor Skill Class
 */
export class SituationMonitorSkill {
  private commandHandler: CommandHandler;
  private newsModule: NewsModule;
  private marketsModule: MarketsModule;
  private analysisModule: AnalysisModule;
  private configManager: ConfigManager;
  private isInitialized = false;

  constructor() {
    this.configManager = ConfigManager.getInstance();
    this.commandHandler = new CommandHandler();
    this.newsModule = new NewsModule();
    this.marketsModule = new MarketsModule();
    this.analysisModule = new AnalysisModule();
  }

  /**
   * Initialize the skill
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.info('Skill already initialized');
      return;
    }

    try {
      logger.info('Initializing Situation Monitor Skill...');

      // Load configuration
      await this.configManager.load();

      // Initialize modules
      await this.newsModule.initialize();
      await this.marketsModule.initialize();
      await this.analysisModule.initialize();

      // Register commands
      this.registerCommands();

      this.isInitialized = true;
      logger.info('Situation Monitor Skill initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize skill:', error);
      throw error;
    }
  }

  /**
   * Register all commands with Clawdbot
   */
  private registerCommands(): void {
    // Basic monitoring commands
    this.commandHandler.registerCommand('news', this.handleNews.bind(this));
    this.commandHandler.registerCommand('markets', this.handleMarkets.bind(this));
    this.commandHandler.registerCommand('crypto', this.handleCrypto.bind(this));
    this.commandHandler.registerCommand('commodities', this.handleCommodities.bind(this));
    this.commandHandler.registerCommand('sectors', this.handleSectors.bind(this));

    // Analysis commands
    this.commandHandler.registerCommand('analyze', this.handleAnalyze.bind(this));
    this.commandHandler.registerCommand('correlation', this.handleCorrelation.bind(this));
    this.commandHandler.registerCommand('narratives', this.handleNarratives.bind(this));
    this.commandHandler.registerCommand('mainchar', this.handleMainCharacter.bind(this));
    this.commandHandler.registerCommand('alerts', this.handleAlerts.bind(this));

    // Custom monitoring commands
    this.commandHandler.registerCommand('monitor', this.handleMonitor.bind(this));

    // Geopolitical commands
    this.commandHandler.registerCommand('map', this.handleMap.bind(this));
    this.commandHandler.registerCommand('region', this.handleRegion.bind(this));

    // Configuration commands
    this.commandHandler.registerCommand('config', this.handleConfig.bind(this));

    // Report commands
    this.commandHandler.registerCommand('report', this.handleReport.bind(this));
    this.commandHandler.registerCommand('export', this.handleExport.bind(this));

    logger.info(`Registered ${this.commandHandler.getCommandCount()} commands`);
  }

  /**
   * Handle incoming command
   */
  async handleCommand(command: string, args: string[], context: SkillContext): Promise<string> {
    try {
      return await this.commandHandler.handleCommand(command, args, context);
    } catch (error) {
      logger.error(`Error handling command ${command}:`, error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Command handlers
   */

  private async handleNews(args: string[], context: SkillContext): Promise<string> {
    const category = args[0] || 'all';
    const limit = args[1] ? parseInt(args[1]) : 10;
    
    const news = await this.newsModule.getNews(category, limit);
    return this.newsModule.formatNews(news, category);
  }

  private async handleMarkets(args: string[], context: SkillContext): Promise<string> {
    const markets = await this.marketsModule.getMarketOverview();
    return this.marketsModule.formatMarketOverview(markets);
  }

  private async handleCrypto(args: string[], context: SkillContext): Promise<string> {
    const cryptos = await this.marketsModule.getCryptocurrencies();
    return this.marketsModule.formatCryptocurrencies(cryptos);
  }

  private async handleCommodities(args: string[], context: SkillContext): Promise<string> {
    const commodities = await this.marketsModule.getCommodities();
    return this.marketsModule.formatCommodities(commodities);
  }

  private async handleSectors(args: string[], context: SkillContext): Promise<string> {
    const sectors = await this.marketsModule.getSectors();
    return this.marketsModule.formatSectors(sectors);
  }

  private async handleAnalyze(args: string[], context: SkillContext): Promise<string> {
    const analysis = await this.analysisModule.analyze();
    return this.analysisModule.formatAnalysis(analysis);
  }

  private async handleCorrelation(args: string[], context: SkillContext): Promise<string> {
    const correlations = await this.analysisModule.getCorrelations();
    return this.analysisModule.formatCorrelations(correlations);
  }

  private async handleNarratives(args: string[], context: SkillContext): Promise<string> {
    const narratives = await this.analysisModule.getNarratives();
    return this.analysisModule.formatNarratives(narratives);
  }

  private async handleMainCharacter(args: string[], context: SkillContext): Promise<string> {
    const mainCharacters = await this.analysisModule.getMainCharacters();
    return this.analysisModule.formatMainCharacters(mainCharacters);
  }

  private async handleAlerts(args: string[], context: SkillContext): Promise<string> {
    const alerts = await this.newsModule.getAlerts();
    return this.newsModule.formatAlerts(alerts);
  }

  private async handleMonitor(args: string[], context: SkillContext): Promise<string> {
    const subcommand = args[0] || 'list';
    const params = args.slice(1);

    switch (subcommand) {
      case 'add':
        return await this.analysisModule.addMonitor(params.join(' '));
      case 'list':
        return await this.analysisModule.listMonitors();
      case 'remove':
        return await this.analysisModule.removeMonitor(params[0]);
      case 'check':
        return await this.analysisModule.checkMonitors();
      default:
        return `Unknown monitor subcommand: ${subcommand}. Use: add, list, remove, check`;
    }
  }

  private async handleMap(args: string[], context: SkillContext): Promise<string> {
    // TODO: Implement map visualization
    return 'Map visualization is under development.';
  }

  private async handleRegion(args: string[], context: SkillContext): Promise<string> {
    const region = args[0];
    if (!region) {
      return 'Please specify a region (e.g., europe, asia, middle-east)';
    }
    
    const news = await this.newsModule.getNewsByRegion(region);
    return this.newsModule.formatRegionalNews(news, region);
  }

  private async handleConfig(args: string[], context: SkillContext): Promise<string> {
    const subcommand = args[0] || 'status';
    const params = args.slice(1);

    switch (subcommand) {
      case 'feeds':
        return await this.configManager.listFeeds();
      case 'keywords':
        return await this.configManager.listKeywords();
      case 'analysis':
        return await this.configManager.listAnalysisPatterns();
      case 'reload':
        await this.configManager.reload();
        return 'Configuration reloaded successfully';
      case 'status':
      default:
        return await this.configManager.getStatus();
    }
  }

  private async handleReport(args: string[], context: SkillContext): Promise<string> {
    const type = args[0] || 'daily';
    
    switch (type) {
      case 'daily':
        return await this.generateDailyReport();
      case 'weekly':
        return await this.generateWeeklyReport();
      default:
        return `Unknown report type: ${type}. Use: daily, weekly`;
    }
  }

  private async handleExport(args: string[], context: SkillContext): Promise<string> {
    const format = args[0] || 'json';
    
    switch (format) {
      case 'json':
        return await this.exportData('json');
      case 'html':
        return await this.exportData('html');
      default:
        return `Unknown export format: ${format}. Use: json, html`;
    }
  }

  /**
   * Generate daily report
   */
  private async generateDailyReport(): Promise<string> {
    const news = await this.newsModule.getNews('all', 20);
    const markets = await this.marketsModule.getMarketOverview();
    const analysis = await this.analysisModule.analyze();

    let report = '📊 DAILY SITUATION REPORT\n';
    report += '════════════════════════════════════\n\n';
    
    report += '📰 TOP NEWS HEADLINES:\n';
    report += this.newsModule.formatNews(news, 'all', 5);
    report += '\n\n';
    
    report += '📈 MARKET OVERVIEW:\n';
    report += this.marketsModule.formatMarketOverview(markets);
    report += '\n\n';
    
    report += '🔍 KEY INSIGHTS:\n';
    report += this.analysisModule.formatAnalysisSummary(analysis);

    return report;
  }

  /**
   * Generate weekly report
   */
  private async generateWeeklyReport(): Promise<string> {
    // TODO: Implement weekly report with historical data
    return 'Weekly report generation is under development.';
  }

  /**
   * Export data in specified format
   */
  private async exportData(format: 'json' | 'html'): Promise<string> {
    // TODO: Implement data export
    return `${format.toUpperCase()} export is under development.`;
  }

  /**
   * Get skill status
   */
  getStatus(): {
    initialized: boolean;
    modules: {
      news: boolean;
      markets: boolean;
      analysis: boolean;
    };
    config: {
      loaded: boolean;
      feeds: number;
      keywords: number;
    };
  } {
    return {
      initialized: this.isInitialized,
      modules: {
        news: this.newsModule.isInitialized(),
        markets: this.marketsModule.isInitialized(),
        analysis: this.analysisModule.isInitialized(),
      },
      config: {
        loaded: this.configManager.isLoaded(),
        feeds: this.configManager.getFeedCount(),
        keywords: this.configManager.getKeywordCount(),
      },
    };
  }
}

// Export default instance
const skill = new SituationMonitorSkill();
export default skill;