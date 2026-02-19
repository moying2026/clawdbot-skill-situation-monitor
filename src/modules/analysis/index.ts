/**
 * Analysis Module
 * 
 * Core analysis module for situation monitoring.
 * Provides comprehensive analysis of news and market data,
 * pattern recognition, trend analysis, risk assessment,
 * and decision support.
 */

import { logger } from '../../utils/logger';
import { ConfigManager } from '../../config';
import { NewsModule, NewsItem } from '../news';
import { MarketsModule } from '../markets';
import { 
  AnalysisResult, 
  PatternType, 
  TrendDirection,
  RiskLevel,
  OpportunityType,
  DecisionRecommendation,
  AnalysisConfig,
  CorrelationMatrix,
  Narrative,
  MainCharacter,
  Alert,
  Monitor,
  Report
} from './types';

import {
  PatternAnalyzer,
  TrendAnalyzer,
  RiskAnalyzer,
  OpportunityAnalyzer,
  DecisionEngine,
  CorrelationAnalyzer,
  NarrativeAnalyzer,
  MainCharacterAnalyzer
} from './strategies';

import {
  ReportGenerator,
  VisualizationEngine
} from './visualization';

/**
 * Analysis Module Class
 */
export class AnalysisModule {
  private configManager: ConfigManager;
  private newsModule: NewsModule;
  private marketsModule: MarketsModule;
  private isInitialized = false;
  
  // Analyzers
  private patternAnalyzer: PatternAnalyzer;
  private trendAnalyzer: TrendAnalyzer;
  private riskAnalyzer: RiskAnalyzer;
  private opportunityAnalyzer: OpportunityAnalyzer;
  private decisionEngine: DecisionEngine;
  private correlationAnalyzer: CorrelationAnalyzer;
  private narrativeAnalyzer: NarrativeAnalyzer;
  private mainCharacterAnalyzer: MainCharacterAnalyzer;
  
  // Visualization
  private reportGenerator: ReportGenerator;
  private visualizationEngine: VisualizationEngine;
  
  // State
  private lastAnalysisTime: Date | null = null;
  private analysisCache: Map<string, AnalysisResult> = new Map();
  private activeMonitors: Monitor[] = [];
  private alerts: Alert[] = [];

  constructor() {
    this.configManager = ConfigManager.getInstance();
    this.newsModule = new NewsModule();
    this.marketsModule = new MarketsModule();
    
    // Initialize analyzers
    this.patternAnalyzer = new PatternAnalyzer();
    this.trendAnalyzer = new TrendAnalyzer();
    this.riskAnalyzer = new RiskAnalyzer();
    this.opportunityAnalyzer = new OpportunityAnalyzer();
    this.decisionEngine = new DecisionEngine();
    this.correlationAnalyzer = new CorrelationAnalyzer();
    this.narrativeAnalyzer = new NarrativeAnalyzer();
    this.mainCharacterAnalyzer = new MainCharacterAnalyzer();
    
    // Initialize visualization
    this.reportGenerator = new ReportGenerator();
    this.visualizationEngine = new VisualizationEngine();
  }

  /**
   * Initialize the module
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      logger.info('Initializing Analysis Module...');
      
      // Load analysis configuration
      await this.configManager.loadAnalysisConfig();
      
      // Initialize analyzers
      await this.patternAnalyzer.initialize();
      await this.trendAnalyzer.initialize();
      await this.riskAnalyzer.initialize();
      await this.opportunityAnalyzer.initialize();
      await this.decisionEngine.initialize();
      await this.correlationAnalyzer.initialize();
      await this.narrativeAnalyzer.initialize();
      await this.mainCharacterAnalyzer.initialize();
      
      // Load active monitors
      await this.loadMonitors();
      
      this.isInitialized = true;
      logger.info('Analysis Module initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Analysis Module:', error);
      throw error;
    }
  }

  /**
   * Perform comprehensive analysis
   */
  async analyze(options?: Partial<AnalysisConfig>): Promise<AnalysisResult> {
    try {
      logger.info('Starting comprehensive analysis...');
      
      // Get data
      const news = await this.newsModule.getNews('all', 50);
      const marketData = await this.marketsModule.getMarketOverview();
      
      // Run analysis pipelines
      const patterns = await this.patternAnalyzer.analyzePatterns(news, marketData);
      const trends = await this.trendAnalyzer.analyzeTrends(news, marketData);
      const risks = await this.riskAnalyzer.assessRisks(news, marketData);
      const opportunities = await this.opportunityAnalyzer.identifyOpportunities(news, marketData);
      const decisions = await this.decisionEngine.generateRecommendations(patterns, trends, risks, opportunities);
      
      // Generate narratives and main characters
      const narratives = await this.narrativeAnalyzer.extractNarratives(news, marketData);
      const mainCharacters = await this.mainCharacterAnalyzer.identifyMainCharacters(news, marketData);
      
      // Check monitors
      await this.checkMonitors(news, marketData);
      
      // Create analysis result
      const result: AnalysisResult = {
        timestamp: new Date(),
        patterns,
        trends,
        risks,
        opportunities,
        decisions,
        narratives,
        mainCharacters,
        alerts: this.alerts,
        summary: this.generateSummary(patterns, trends, risks, opportunities),
        confidence: this.calculateConfidence(patterns, trends, risks, opportunities),
        metadata: {
          newsCount: news.length,
          marketSymbolsCount: marketData.length,
          analysisDuration: 0, // Will be calculated
          patternsDetected: patterns.length,
          risksIdentified: risks.length,
          opportunitiesIdentified: opportunities.length
        }
      };
      
      // Update cache
      this.analysisCache.set('latest', result);
      this.lastAnalysisTime = new Date();
      
      logger.info(`Analysis completed: ${patterns.length} patterns, ${risks.length} risks, ${opportunities.length} opportunities`);
      
      return result;
    } catch (error) {
      logger.error('Error during analysis:', error);
      throw error;
    }
  }

  /**
   * Get correlation analysis
   */
  async getCorrelations(): Promise<CorrelationMatrix> {
    try {
      const news = await this.newsModule.getNews('all', 100);
      const marketData = await this.marketsModule.getMarketOverview();
      
      return await this.correlationAnalyzer.analyzeCorrelations(news, marketData);
    } catch (error) {
      logger.error('Error getting correlations:', error);
      throw error;
    }
  }

  /**
   * Get narratives
   */
  async getNarratives(): Promise<Narrative[]> {
    try {
      const news = await this.newsModule.getNews('all', 100);
      const marketData = await this.marketsModule.getMarketOverview();
      
      return await this.narrativeAnalyzer.extractNarratives(news, marketData);
    } catch (error) {
      logger.error('Error getting narratives:', error);
      throw error;
    }
  }

  /**
   * Get main characters
   */
  async getMainCharacters(): Promise<MainCharacter[]> {
    try {
      const news = await this.newsModule.getNews('all', 100);
      const marketData = await this.marketsModule.getMarketOverview();
      
      return await this.mainCharacterAnalyzer.identifyMainCharacters(news, marketData);
    } catch (error) {
      logger.error('Error getting main characters:', error);
      throw error;
    }
  }

  /**
   * Add a monitor
   */
  async addMonitor(query: string): Promise<string> {
    try {
      const monitor: Monitor = {
        id: this.generateId(),
        query,
        createdAt: new Date(),
        lastChecked: new Date(),
        isActive: true,
        alertThreshold: 0.7,
        checkInterval: 3600, // 1 hour
        alertCount: 0
      };
      
      this.activeMonitors.push(monitor);
      await this.saveMonitors();
      
      return `Monitor added successfully (ID: ${monitor.id}). Query: "${query}"`;
    } catch (error) {
      logger.error('Error adding monitor:', error);
      throw error;
    }
  }

  /**
   * List all monitors
   */
  async listMonitors(): Promise<string> {
    if (this.activeMonitors.length === 0) {
      return 'No active monitors.';
    }
    
    let output = `📊 ACTIVE MONITORS (${this.activeMonitors.length})\n`;
    output += '════════════════════════════════════\n\n';
    
    for (const monitor of this.activeMonitors) {
      const status = monitor.isActive ? '🟢 ACTIVE' : '🔴 INACTIVE';
      const lastChecked = monitor.lastChecked.toLocaleDateString();
      const alertCount = monitor.alertCount > 0 ? ` ⚠️ ${monitor.alertCount} alerts` : '';
      
      output += `ID: ${monitor.id}\n`;
      output += `Status: ${status}${alertCount}\n`;
      output += `Query: "${monitor.query}"\n`;
      output += `Created: ${monitor.createdAt.toLocaleDateString()}\n`;
      output += `Last checked: ${lastChecked}\n`;
      output += `Check interval: ${monitor.checkInterval / 3600}h\n`;
      output += '────────────────────────────────────────\n\n';
    }
    
    return output;
  }

  /**
   * Remove a monitor
   */
  async removeMonitor(monitorId: string): Promise<string> {
    const initialCount = this.activeMonitors.length;
    this.activeMonitors = this.activeMonitors.filter(m => m.id !== monitorId);
    
    if (this.activeMonitors.length < initialCount) {
      await this.saveMonitors();
      return `Monitor ${monitorId} removed successfully.`;
    } else {
      return `Monitor ${monitorId} not found.`;
    }
  }

  /**
   * Check all monitors
   */
  async checkMonitors(): Promise<string> {
    if (this.activeMonitors.length === 0) {
      return 'No active monitors to check.';
    }
    
    logger.info(`Checking ${this.activeMonitors.length} monitors...`);
    
    const news = await this.newsModule.getNews('all', 100);
    const marketData = await this.marketsModule.getMarketOverview();
    
    let alertsTriggered = 0;
    
    for (const monitor of this.activeMonitors) {
      if (!monitor.isActive) continue;
      
      try {
        const shouldAlert = await this.evaluateMonitor(monitor, news, marketData);
        
        if (shouldAlert) {
          alertsTriggered++;
          monitor.alertCount++;
          monitor.lastChecked = new Date();
          
          // Create alert
          const alert: Alert = {
            id: this.generateId(),
            monitorId: monitor.id,
            query: monitor.query,
            severity: 'medium',
            message: `Monitor "${monitor.query}" triggered an alert`,
            timestamp: new Date(),
            acknowledged: false
          };
          
          this.alerts.push(alert);
          logger.info(`Monitor alert triggered: ${monitor.query}`);
        }
      } catch (error) {
        logger.error(`Error checking monitor ${monitor.id}:`, error);
      }
    }
    
    await this.saveMonitors();
    
    return `Monitor check completed. ${alertsTriggered} alerts triggered.`;
  }

  /**
   * Format analysis results
   */
  formatAnalysis(analysis: AnalysisResult): string {
    return this.reportGenerator.generateAnalysisReport(analysis);
  }

  /**
   * Format correlations
   */
  formatCorrelations(correlations: CorrelationMatrix): string {
    return this.reportGenerator.generateCorrelationReport(correlations);
  }

  /**
   * Format narratives
   */
  formatNarratives(narratives: Narrative[]): string {
    return this.reportGenerator.generateNarrativeReport(narratives);
  }

  /**
   * Format main characters
   */
  formatMainCharacters(mainCharacters: MainCharacter[]): string {
    return this.reportGenerator.generateMainCharacterReport(mainCharacters);
  }

  /**
   * Format analysis summary
   */
  formatAnalysisSummary(analysis: AnalysisResult): string {
    return this.reportGenerator.generateSummaryReport(analysis);
  }

  /**
   * Generate visualization
   */
  async generateVisualization(analysis: AnalysisResult, type: 'chart' | 'graph' | 'dashboard'): Promise<string> {
    return await this.visualizationEngine.generateVisualization(analysis, type);
  }

  /**
   * Check if module is initialized
   */
  isInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get module status
   */
  getStatus(): {
    initialized: boolean;
    analyzers: {
      pattern: boolean;
      trend: boolean;
      risk: boolean;
      opportunity: boolean;
      decision: boolean;
      correlation: boolean;
      narrative: boolean;
      mainCharacter: boolean;
    };
    monitors: number;
    alerts: number;
    lastAnalysis: Date | null;
  } {
    return {
      initialized: this.isInitialized,
      analyzers: {
        pattern: this.patternAnalyzer.isInitialized(),
        trend: this.trendAnalyzer.isInitialized(),
        risk: this.riskAnalyzer.isInitialized(),
        opportunity: this.opportunityAnalyzer.isInitialized(),
        decision: this.decisionEngine.isInitialized(),
        correlation: this.correlationAnalyzer.isInitialized(),
        narrative: this.narrativeAnalyzer.isInitialized(),
        mainCharacter: this.mainCharacterAnalyzer.isInitialized(),
      },
      monitors: this.activeMonitors.length,
      alerts: this.alerts.length,
      lastAnalysis: this.lastAnalysisTime
    };
  }

  /**
   * Private helper methods
   */

  private async loadMonitors(): Promise<void> {
    try {
      // TODO: Load monitors from persistent storage
      this.activeMonitors = [];
      logger.debug('Monitors loaded (empty)');
    } catch (error) {
      logger.error('Error loading monitors:', error);
      this.activeMonitors = [];
    }
  }

  private async saveMonitors(): Promise<void> {
    try {
      // TODO: Save monitors to persistent storage
      logger.debug('Monitors saved');
    } catch (error) {
      logger.error('Error saving monitors:', error);
    }
  }

  private async evaluateMonitor(monitor: Monitor, news: NewsItem[], marketData: any[]): Promise<boolean> {
    // Simple keyword matching for now
    // TODO: Implement more sophisticated monitoring logic
    
    const query = monitor.query.toLowerCase();
    let matchCount = 0;
    
    // Check news
    for (const item of news) {
      const text = (item.title + ' ' + item.description).toLowerCase();
      if (text.includes(query)) {
        matchCount++;
      }
    }
    
    // Check if matches exceed threshold
    const matchRatio = matchCount / Math.max(news.length, 1);
    return matchRatio >= monitor.alertThreshold;
  }

  private generateSummary(
    patterns: any[],
    trends: any[],
    risks: any[],
    opportunities: any[]
  ): string {
    const patternCount = patterns.length;
    const trendCount = trends.length;
    const riskCount = risks.length;
    const opportunityCount = opportunities.length;
    
    const highRisks = risks.filter(r => r.level === 'high').length;
    const highOpportunities = opportunities.filter(o => o.type === 'high_potential').length;
    
    return `Analysis detected ${patternCount} patterns, ${trendCount} trends, ` +
           `${riskCount} risks (${highRisks} high), and ${opportunityCount} opportunities ` +
           `(${highOpportunities} high potential).`;
  }

  private calculateConfidence(
    patterns: any[],
    trends: any[],
    risks: any[],
    opportunities: any[]
  ): number {
    // Simple confidence calculation based on data quality and consistency
    const totalItems = patterns.length + trends.length + risks.length + opportunities.length;
    
    if (totalItems === 0) return 0;
    
    // Weight different types of findings
    const patternWeight = patterns.length * 0.3;
    const trendWeight = trends.length * 0.4;
    const riskWeight = risks.length * 0.2;
    const opportunityWeight = opportunities.length * 0.1;
    
    const weightedTotal = patternWeight + trendWeight + riskWeight + opportunityWeight;
    const maxPossible = totalItems * 0.4; // Max weight per item is 0.4
    
    return Math.min(100, Math.round((weightedTotal / maxPossible) * 100));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }
}