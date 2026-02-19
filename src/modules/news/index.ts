/**
 * News Aggregation Module
 * 
 * Handles news aggregation from GDELT API and RSS feeds.
 * Supports 6 categories: politics, tech, finance, gov, ai, intel.
 */

import axios from 'axios';
import Parser from 'rss-parser';
import { logger } from '../../utils/logger';
import { ConfigManager } from '../../config';

/**
 * News Item Interface
 */
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: string;
  category: string;
  publishedAt: Date;
  region?: string;
  keywords: string[];
  alertLevel: 'none' | 'low' | 'medium' | 'high';
}

/**
 * News Aggregation Module Class
 */
export class NewsModule {
  private configManager: ConfigManager;
  private parser: Parser;
  private isInitialized = false;
  private lastFetchTime: Date | null = null;
  private cache: Map<string, NewsItem[]> = new Map();

  constructor() {
    this.configManager = ConfigManager.getInstance();
    this.parser = new Parser();
  }

  /**
   * Initialize the module
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      logger.info('Initializing News Module...');
      
      // Load news configuration
      await this.configManager.loadNewsConfig();
      
      this.isInitialized = true;
      logger.info('News Module initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize News Module:', error);
      throw error;
    }
  }

  /**
   * Get news for a specific category
   */
  async getNews(category: string = 'all', limit: number = 10): Promise<NewsItem[]> {
    try {
      logger.debug(`Fetching news for category: ${category}, limit: ${limit}`);

      // Check cache first
      const cacheKey = `${category}:${limit}`;
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid()) {
        logger.debug('Returning cached news');
        return cached.slice(0, limit);
      }

      let newsItems: NewsItem[] = [];

      // Fetch from GDELT if configured
      const gdeltItems = await this.fetchFromGDELT(category);
      newsItems = newsItems.concat(gdeltItems);

      // Fetch from RSS feeds
      const rssItems = await this.fetchFromRSS(category);
      newsItems = newsItems.concat(rssItems);

      // Process and analyze news items
      const processedItems = await this.processNewsItems(newsItems);

      // Sort by date (newest first)
      processedItems.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

      // Update cache
      this.cache.set(cacheKey, processedItems);
      this.lastFetchTime = new Date();

      return processedItems.slice(0, limit);
    } catch (error) {
      logger.error('Error fetching news:', error);
      throw error;
    }
  }

  /**
   * Get news by region
   */
  async getNewsByRegion(region: string, limit: number = 10): Promise<NewsItem[]> {
    const allNews = await this.getNews('all', 50); // Get more news to filter by region
    const regionalNews = allNews.filter(item => 
      item.region?.toLowerCase().includes(region.toLowerCase()) || 
      this.detectRegionFromText(item.title + ' ' + item.description, region)
    );
    
    return regionalNews.slice(0, limit);
  }

  /**
   * Get alerts from news
   */
  async getAlerts(limit: number = 5): Promise<NewsItem[]> {
    const allNews = await this.getNews('all', 50);
    const alerts = allNews.filter(item => item.alertLevel !== 'none');
    
    // Sort by alert level (high to low)
    const alertLevels = { high: 3, medium: 2, low: 1, none: 0 };
    alerts.sort((a, b) => alertLevels[b.alertLevel] - alertLevels[a.alertLevel]);
    
    return alerts.slice(0, limit);
  }

  /**
   * Format news for display
   */
  formatNews(newsItems: NewsItem[], category: string = 'all', limit?: number): string {
    if (newsItems.length === 0) {
      return `No news found for category: ${category}`;
    }

    const displayItems = limit ? newsItems.slice(0, limit) : newsItems;
    const categoryDisplay = category === 'all' ? 'ALL CATEGORIES' : category.toUpperCase();

    let output = `📰 ${categoryDisplay} NEWS (${displayItems.length} items)\n`;
    output += '════════════════════════════════════\n\n';

    for (let i = 0; i < displayItems.length; i++) {
      const item = displayItems[i];
      const alertIcon = this.getAlertIcon(item.alertLevel);
      const regionInfo = item.region ? ` 🌎 ${item.region}` : '';
      const keywordInfo = item.keywords.length > 0 ? ` 📊 ${item.keywords.slice(0, 3).join(', ')}` : '';

      output += `${i + 1}. ${alertIcon} ${item.title}\n`;
      output += `   📰 Source: ${item.source}\n`;
      output += `   📅 Date: ${item.publishedAt.toLocaleDateString()} ${item.publishedAt.toLocaleTimeString()}\n`;
      if (regionInfo) output += `   ${regionInfo}\n`;
      if (keywordInfo) output += `   ${keywordInfo}\n`;
      
      // Truncate description if too long
      const maxDescLength = 150;
      let description = item.description || '';
      if (description.length > maxDescLength) {
        description = description.substring(0, maxDescLength) + '...';
      }
      if (description) {
        output += `   📝 ${description}\n`;
      }
      
      output += `   🔗 ${item.url}\n\n`;
    }

    // Add summary
    const alertCount = newsItems.filter(item => item.alertLevel !== 'none').length;
    const regionCount = new Set(newsItems.filter(item => item.region).map(item => item.region)).size;
    const keywordCount = new Set(newsItems.flatMap(item => item.keywords)).size;

    output += '════════════════════════════════════\n';
    output += `📈 Summary: ${alertCount} alerts, ${regionCount} regions, ${keywordCount} keywords detected\n`;
    output += `🕒 Last updated: ${new Date().toLocaleTimeString()}`;

    return output;
  }

  /**
   * Format regional news
   */
  formatRegionalNews(newsItems: NewsItem[], region: string): string {
    if (newsItems.length === 0) {
      return `No news found for region: ${region}`;
    }

    let output = `🌎 ${region.toUpperCase()} REGIONAL NEWS\n`;
    output += '════════════════════════════════════\n\n';

    for (let i = 0; i < newsItems.length; i++) {
      const item = newsItems[i];
      const alertIcon = this.getAlertIcon(item.alertLevel);

      output += `${i + 1}. ${alertIcon} ${item.title}\n`;
      output += `   📰 Source: ${item.source} (${item.category})\n`;
      output += `   📅 ${item.publishedAt.toLocaleDateString()}\n`;
      output += `   🔗 ${item.url}\n\n`;
    }

    return output;
  }

  /**
   * Format alerts
   */
  formatAlerts(alerts: NewsItem[]): string {
    if (alerts.length === 0) {
      return 'No alerts detected in recent news.';
    }

    let output = '⚠️ NEWS ALERTS\n';
    output += '════════════════════════════════════\n\n';

    const alertGroups = {
      high: alerts.filter(item => item.alertLevel === 'high'),
      medium: alerts.filter(item => item.alertLevel === 'medium'),
      low: alerts.filter(item => item.alertLevel === 'low'),
    };

    if (alertGroups.high.length > 0) {
      output += '🔴 HIGH ALERTS:\n';
      for (const item of alertGroups.high) {
        output += `• ${item.title} (${item.source})\n`;
      }
      output += '\n';
    }

    if (alertGroups.medium.length > 0) {
      output += '🟡 MEDIUM ALERTS:\n';
      for (const item of alertGroups.medium) {
        output += `• ${item.title} (${item.source})\n`;
      }
      output += '\n';
    }

    if (alertGroups.low.length > 0) {
      output += '🟢 LOW ALERTS:\n';
      for (const item of alertGroups.low) {
        output += `• ${item.title} (${item.source})\n`;
      }
      output += '\n';
    }

    output += '════════════════════════════════════\n';
    output += `Total alerts: ${alerts.length} (${alertGroups.high.length} high, ${alertGroups.medium.length} medium, ${alertGroups.low.length} low)`;

    return output;
  }

  /**
   * Check if module is initialized
   */
  isInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Private helper methods
   */

  private async fetchFromGDELT(category: string): Promise<NewsItem[]> {
    const gdeltApiKey = process.env.GDELT_API_KEY;
    if (!gdeltApiKey) {
      logger.debug('GDELT_API_KEY not set, skipping GDELT fetch');
      return [];
    }

    try {
      // TODO: Implement GDELT API integration
      // This is a placeholder implementation
      logger.debug('Fetching from GDELT API...');
      
      // Example GDELT API call (simplified)
      // const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
      //   params: {
      //     query: this.getGDELTQuery(category),
      //     format: 'json',
      //     mode: 'artlist',
      //     maxrecords: 20,
      //     startdatetime: this.getStartDateTime(),
      //     enddatetime: this.getEndDateTime(),
      //   },
      // });

      // For now, return empty array
      return [];
    } catch (error) {
      logger.error('Error fetching from GDELT:', error);
      return [];
    }
  }

  private async fetchFromRSS(category: string): Promise<NewsItem[]> {
    try {
      const feeds = this.configManager.getFeedsByCategory(category);
      const newsItems: NewsItem[] = [];

      for (const feed of feeds) {
        try {
          logger.debug(`Fetching RSS feed: ${feed.url}`);
          const feedData = await this.parser.parseURL(feed.url);

          for (const item of feedData.items || []) {
            const newsItem: NewsItem = {
              id: this.generateId(item),
              title: item.title || 'No title',
              description: item.contentSnippet || item.content || 'No description',
              content: item.content,
              url: item.link || '#',
              source: feed.name,
              category: feed.category,
              publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
              keywords: this.extractKeywords(item),
              alertLevel: this.detectAlertLevel(item),
            };

            // Detect region
            newsItem.region = this.detectRegion(newsItem);

            newsItems.push(newsItem);
          }
        } catch (error) {
          logger.error(`Error fetching RSS feed ${feed.url}:`, error);
          continue;
        }
      }

      return newsItems;
    } catch (error) {
      logger.error('Error fetching from RSS feeds:', error);
      return [];
    }
  }

  private async processNewsItems(items: NewsItem[]): Promise<NewsItem[]> {
    // Process each news item (clean, analyze, etc.)
    return items.map(item => ({
      ...item,
      title: this.cleanText(item.title),
      description: this.cleanText(item.description),
      keywords: this.enhanceKeywords(item),
    }));
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\x00-\x7F]/g, '')
      .trim();
  }

  private extractKeywords(item: any): string[] {
    const text = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`.toLowerCase();
    const keywords: string[] = [];
    
    // Extract common keywords (simplified)
    const commonKeywords = ['crisis', 'attack', 'emergency', 'alert', 'warning', 'breakthrough', 'discovery', 'deal', 'agreement'];
    
    for (const keyword of commonKeywords) {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    }
    
    return keywords;
  }

  private detectAlertLevel(item: any): 'none' | 'low' | 'medium' | 'high' {
    const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
    
    const highAlertKeywords = ['crisis', 'attack', 'emergency', 'disaster', 'war'];
    const mediumAlertKeywords = ['warning', 'alert', 'danger', 'threat'];
    const lowAlertKeywords = ['concern', 'issue', 'problem', 'challenge'];
    
    for (const keyword of highAlertKeywords) {
      if (text.includes(keyword)) return 'high';
    }
    
    for (const keyword of mediumAlertKeywords) {
      if (text.includes(keyword)) return 'medium';
    }
    
    for (const keyword of lowAlertKeywords) {
      if (text.includes(keyword)) return 'low';
    }
    
    return 'none';
  }

  private detectRegion(newsItem: NewsItem): string | undefined {
    const text = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    
    const regions = {
      'north america': ['usa', 'us', 'united states', 'canada', 'mexico'],
      'europe': ['europe', 'eu', 'uk', 'germany', 'france', 'italy', 'spain'],
      'asia': ['china', 'japan', 'india', 'korea', 'asia'],
      'middle east': ['middle east', 'israel', 'iran', 'saudi', 'uae'],
      'south america': ['brazil', 'argentina', 'chile', 'south america'],
      'africa': ['africa', 'south africa', 'nigeria', 'egypt'],
    };
    
    for (const [region, keywords] of Object.entries(regions)) {
      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          return region;
        }
      }
    }
    
    return undefined;
  }

  private detectRegionFromText(text: string, targetRegion: string): boolean {
    const regions: Record<string, string[]> = {
      'europe': ['europe', 'eu', 'uk', 'germany', 'france', 'italy', 'spain', 'poland', 'netherlands'],
      'asia': ['asia', 'china', 'japan', 'india', 'korea', 'vietnam', 'thailand', 'indonesia'],
      'middle-east': ['middle east', 'israel', 'iran', 'saudi', 'uae', 'qatar', 'syria', 'iraq'],
      'north-america': ['usa', 'us', 'united states', 'canada', 'mexico'],
      'south-america': ['south america', 'brazil', 'argentina', 'chile', 'colombia', 'peru'],
      'africa': ['africa', 'south africa', 'nigeria', 'egypt', 'kenya', 'ethiopia'],
      'australia': ['australia', 'new zealand', 'oceania'],
    };
    
    const targetKeywords = regions[targetRegion.toLowerCase()] || [];
    const textLower = text.toLowerCase();
    
    return targetKeywords.some(keyword => textLower.includes(keyword));
  }

  private enhanceKeywords(item: NewsItem): string[] {
    const existingKeywords = item.keywords;
    const text = `${item.title} ${item.description}`.toLowerCase();
    
    // Add category as keyword
    if (!existingKeywords.includes(item.category)) {
      existingKeywords.push(item.category);
    }
    
    // Add region as keyword if present
    if (item.region && !existingKeywords.includes(item.region)) {
      existingKeywords.push(item.region);
    }
    
    return [...new Set(existingKeywords)]; // Remove duplicates
  }

  private generateId(item: any): string {
    return Buffer.from(`${item.link || item.title || Math.random()}`).toString('base64').substring(0, 10);
  }

  private getAlertIcon(level: 'none' | 'low' | 'medium' | 'high'): string {
    switch (level) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  private isCacheValid(): boolean {
    if (!this.lastFetchTime) return false;
    
    const cacheTTL = 5 * 60 * 1000; // 5 minutes
    return Date.now() - this.lastFetchTime.getTime() < cacheTTL;
  }
}