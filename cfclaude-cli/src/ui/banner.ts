/**
 * CLI Banner and UI utilities
 * Inspired by Continue CLI's beautiful TUI design
 */

import chalk from 'chalk';

// Gradient colors - Yellow to Orange
const gradientColors = [
  '#FFD700', // Gold
  '#FFC800', // Orange Yellow
  '#FFAA00', // Orange
  '#FF9500', // Dark Orange
  '#FF8C00', // Darker Orange
  '#FF7F00', // Deep Orange
];

function applyGradient(text: string, colors: string[]): string {
  const chars = text.split('');
  const step = Math.ceil(chars.length / colors.length);
  
  return chars.map((char, i) => {
    const colorIndex = Math.min(Math.floor(i / step), colors.length - 1);
    return chalk.hex(colors[colorIndex])(char);
  }).join('');
}

export function printBanner(): void {
  const version = 'v1.0.0';
  
  // ASCII Art with gradient
  const bannerLines = [
    '  ██████╗███████╗ ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗',
    ' ██╔════╝██╔════╝██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝',
    ' ██║     █████╗  ██║     ██║     ███████║██║   ██║██║  ██║█████╗  ',
    ' ██║     ██╔══╝  ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝  ',
    ' ╚██████╗██║     ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗',
    '  ╚═════╝╚═╝      ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝',
  ];
  
  console.log();
  bannerLines.forEach((line) => {
    console.log(applyGradient(line, gradientColors));
  });
  
  // Version on the right
  const padding = 60;
  console.log(' '.repeat(padding) + chalk.hex('#FF8C00')(version));
  console.log();
}

export function printSessionInfo(config: {
  provider: string;
  model: string;
  workdir: string;
  mcpServers?: string[];
}): void {
  // Agent and Model info
  console.log(chalk.gray('Agent: ') + chalk.hex('#FFD700')('CFclaude Code'));
  console.log(chalk.gray('Model: ') + chalk.white(config.model || 'default'));
  console.log();
  
  // MCP Servers (if any)
  if (config.mcpServers && config.mcpServers.length > 0) {
    console.log(chalk.gray('MCP Servers:'));
    config.mcpServers.forEach(server => {
      console.log(chalk.gray('- ') + chalk.white(server));
    });
    console.log();
  }
}

export function printPrompt(): string {
  return chalk.hex('#FFD700')('● ');
}

export function printStatusBar(workdir: string, provider: string): void {
  const gitInfo = getGitInfo(workdir);
  const width = process.stdout.columns || 80;
  
  console.log();
  console.log(chalk.gray('─'.repeat(width)));
  
  let leftPart = '';
  if (gitInfo) {
    leftPart = chalk.gray(gitInfo);
  } else {
    leftPart = chalk.gray(workdir);
  }
  
  const rightPart = chalk.hex('#FF8C00')('● ') + chalk.white('CFclaude CLI');
  const padding = width - stripAnsi(leftPart).length - stripAnsi(rightPart).length - 2;
  
  console.log(leftPart + ' '.repeat(Math.max(1, padding)) + rightPart);
}

function getGitInfo(workdir: string): string | null {
  try {
    const { execSync } = require('child_process');
    const remote = execSync('git config --get remote.origin.url', { 
      cwd: workdir, 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    
    // Extract repo name from URL
    const match = remote.match(/[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
    if (match) {
      return `git@github.com:${match[1]}`;
    }
    return remote;
  } catch {
    return null;
  }
}

function stripAnsi(str: string): string {
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
}

export function printHelp(): void {
  console.log(chalk.hex('#FFD700')('Slash Commands:'));
  console.log(chalk.gray('  /help     ') + chalk.white('Show available commands'));
  console.log(chalk.gray('  /clear    ') + chalk.white('Clear conversation history'));
  console.log(chalk.gray('  /compact  ') + chalk.white('Summarize and compact history'));
  console.log(chalk.gray('  /context  ') + chalk.white('Show project context'));
  console.log(chalk.gray('  /model    ') + chalk.white('Show or change model'));
  console.log(chalk.gray('  /info     ') + chalk.white('Show session information'));
  console.log(chalk.gray('  /exit     ') + chalk.white('Exit the chat'));
  console.log();
  console.log(chalk.hex('#FFD700')('Tips:'));
  console.log(chalk.gray('  - Use ') + chalk.white('@filename') + chalk.gray(' to reference files'));
  console.log(chalk.gray('  - Press ') + chalk.white('Ctrl+C') + chalk.gray(' to interrupt'));
  console.log();
}

export function printThinking(message: string = 'Thinking...'): void {
  process.stdout.write(chalk.gray(`  ${message}`));
}

export function clearThinking(): void {
  process.stdout.write('\r\x1B[K');
}

export function printToolExecution(toolName: string): void {
  console.log(chalk.hex('#FFA500')('○ ') + chalk.white(toolName));
}

export function printToolResult(success: boolean, message: string): void {
  const icon = success ? chalk.green('✓') : chalk.red('✕');
  console.log(`  ${icon} ${chalk.gray(message)}`);
}

export function printError(message: string): void {
  console.log(chalk.red('✕ ') + chalk.white(message));
}

export function printSuccess(message: string): void {
  console.log(chalk.green('✓ ') + chalk.white(message));
}

export function printWarning(message: string): void {
  console.log(chalk.yellow('⚠ ') + chalk.white(message));
}

export function printDivider(): void {
  const width = process.stdout.columns || 80;
  console.log(chalk.gray('─'.repeat(width)));
}

// Command selector
export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

export const SLASH_COMMANDS: SelectOption[] = [
  { label: '/help', value: '/help', description: 'Show available commands' },
  { label: '/clear', value: '/clear', description: 'Clear conversation history' },
  { label: '/compact', value: '/compact', description: 'Summarize and compact history' },
  { label: '/context', value: '/context', description: 'Show project context' },
  { label: '/model', value: '/model', description: 'Show or change model' },
  { label: '/info', value: '/info', description: 'Show session information' },
  { label: '/exit', value: '/exit', description: 'Exit the chat' },
];

export function printSelector(options: SelectOption[], selectedIndex: number, prefix: string = ''): void {
  // Clear previous output
  process.stdout.write('\x1B[2K\r');
  
  options.forEach((opt, i) => {
    const isSelected = i === selectedIndex;
    const pointer = isSelected ? chalk.hex('#FFD700')('▸ ') : '  ';
    const label = isSelected ? chalk.hex('#FFD700')(opt.label) : chalk.gray(opt.label);
    const desc = opt.description ? chalk.gray(` - ${opt.description}`) : '';
    console.log(pointer + label + desc);
  });
}

export function clearSelector(lineCount: number): void {
  // Move cursor up and clear lines
  for (let i = 0; i < lineCount; i++) {
    process.stdout.write('\x1B[1A\x1B[2K');
  }
}
