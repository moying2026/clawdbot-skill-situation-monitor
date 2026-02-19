/**
 * Command Handler for Situation Monitor Skill
 * 
 * Handles command routing and execution for Clawdbot.
 */

import { logger } from '../utils/logger';

/**
 * Skill Context Interface
 */
export interface SkillContext {
  userId?: string;
  channelId?: string;
  platform?: string;
  messageId?: string;
  timestamp: Date;
  [key: string]: any;
}

/**
 * Command Handler Function Type
 */
export type CommandHandlerFunction = (args: string[], context: SkillContext) => Promise<string>;

/**
 * Command Handler Class
 */
export class CommandHandler {
  private commands: Map<string, CommandHandlerFunction> = new Map();
  private aliases: Map<string, string> = new Map();

  /**
   * Register a command
   */
  registerCommand(command: string, handler: CommandHandlerFunction, aliases: string[] = []): void {
    this.commands.set(command.toLowerCase(), handler);
    
    for (const alias of aliases) {
      this.aliases.set(alias.toLowerCase(), command.toLowerCase());
    }
    
    logger.debug(`Registered command: ${command}${aliases.length > 0 ? ` (aliases: ${aliases.join(', ')})` : ''}`);
  }

  /**
   * Handle a command
   */
  async handleCommand(command: string, args: string[], context: SkillContext): Promise<string> {
    const normalizedCommand = command.toLowerCase();
    let handler: CommandHandlerFunction | undefined;

    // Check direct command
    handler = this.commands.get(normalizedCommand);
    
    // Check aliases
    if (!handler) {
      const actualCommand = this.aliases.get(normalizedCommand);
      if (actualCommand) {
        handler = this.commands.get(actualCommand);
      }
    }

    if (!handler) {
      return this.getHelpText();
    }

    try {
      logger.info(`Executing command: ${command} ${args.join(' ')}`);
      return await handler(args, context);
    } catch (error) {
      logger.error(`Error executing command ${command}:`, error);
      throw error;
    }
  }

  /**
   * Get help text
   */
  getHelpText(): string {
    const commands = Array.from(this.commands.keys()).sort();
    
    let help = '📊 SITUATION MONITOR HELP\n';
    help += '════════════════════════════════════\n\n';
    
    help += '📰 NEWS COMMANDS:\n';
    help += '  /situation news [category] [limit] - Get news for category\n';
    help += '    Categories: politics, tech, finance, gov, ai, intel, all\n';
    help += '    Example: /situation news politics 5\n\n';
    
    help += '📈 MARKET COMMANDS:\n';
    help += '  /situation markets - Market overview\n';
    help += '  /situation crypto - Cryptocurrency prices\n';
    help += '  /situation commodities - Commodity prices\n';
    help += '  /situation sectors - Sector performance\n\n';
    
    help += '🔍 ANALYSIS COMMANDS:\n';
    help += '  /situation analyze - Run full analysis\n';
    help += '  /situation correlation - Show correlation patterns\n';
    help += '  /situation narratives - Show narrative tracking\n';
    help += '  /situation mainchar - Show main character rankings\n';
    help += '  /situation alerts - Show alert keywords\n\n';
    
    help += '👁️ MONITORING COMMANDS:\n';
    help += '  /situation monitor add <keywords> - Add custom monitor\n';
    help += '  /situation monitor list - List custom monitors\n';
    help += '  /situation monitor remove <id> - Remove monitor\n';
    help += '  /situation monitor check - Check monitors against news\n\n';
    
    help += '🌍 GEOPOLITICAL COMMANDS:\n';
    help += '  /situation map - Show geopolitical hotspots\n';
    help += '  /situation region <region> - News for specific region\n\n';
    
    help += '⚙️ CONFIGURATION COMMANDS:\n';
    help += '  /situation config feeds - List configured feeds\n';
    help += '  /situation config keywords - List alert keywords\n';
    help += '  /situation config analysis - Show analysis patterns\n';
    help += '  /situation config reload - Reload configuration\n';
    help += '  /situation config status - Show configuration status\n\n';
    
    help += '📋 REPORT COMMANDS:\n';
    help += '  /situation report daily - Daily situation report\n';
    help += '  /situation report weekly - Weekly analysis report\n';
    help += '  /situation export json - Export data as JSON\n';
    help += '  /situation export html - Generate HTML report\n\n';
    
    help += '════════════════════════════════════\n';
    help += `Available commands: ${commands.join(', ')}\n`;
    help += 'Use /situation help for this message';

    return help;
  }

  /**
   * Get command count
   */
  getCommandCount(): number {
    return this.commands.size;
  }

  /**
   * Check if command exists
   */
  hasCommand(command: string): boolean {
    const normalizedCommand = command.toLowerCase();
    return this.commands.has(normalizedCommand) || this.aliases.has(normalizedCommand);
  }

  /**
   * List all commands
   */
  listCommands(): string[] {
    return Array.from(this.commands.keys()).sort();
  }

  /**
   * List all aliases
   */
  listAliases(): Map<string, string[]> {
    const aliasMap = new Map<string, string[]>();
    
    for (const [alias, command] of this.aliases.entries()) {
      if (!aliasMap.has(command)) {
        aliasMap.set(command, []);
      }
      aliasMap.get(command)!.push(alias);
    }
    
    return aliasMap;
  }
}