/**
 * TUI (Terminal User Interface) Mode
 * Inspired by Continue CLI's TUI mode
 */

import * as readline from 'readline';
import chalk from 'chalk';

export interface TUIState {
  mode: 'chat' | 'files' | 'commands' | 'settings';
  cursor: number;
  scrollOffset: number;
  inputBuffer: string;
}

export class TUIInterface {
  private state: TUIState = {
    mode: 'chat',
    cursor: 0,
    scrollOffset: 0,
    inputBuffer: ''
  };

  private width: number;
  private height: number;

  constructor() {
    this.width = process.stdout.columns || 80;
    this.height = process.stdout.rows || 24;
    
    process.stdout.on('resize', () => {
      this.width = process.stdout.columns || 80;
      this.height = process.stdout.rows || 24;
      this.render();
    });
  }

  render(): void {
    this.clearScreen();
    this.drawHeader();
    this.drawContent();
    this.drawStatusBar();
    this.drawInput();
  }

  private clearScreen(): void {
    process.stdout.write('\x1B[2J\x1B[0f');
  }

  private drawHeader(): void {
    const title = ' CFclaude Code ';
    const padding = Math.floor((this.width - title.length) / 2);
    
    process.stdout.write(chalk.bgCyan.black(' '.repeat(padding) + title + ' '.repeat(this.width - padding - title.length)));
    process.stdout.write('\n');
    
    // Mode tabs
    const modes = [
      { key: 'Chat', active: this.state.mode === 'chat' },
      { key: 'Files', active: this.state.mode === 'files' },
      { key: 'Commands', active: this.state.mode === 'commands' },
      { key: 'Settings', active: this.state.mode === 'settings' }
    ];
    
    let tabLine = '';
    modes.forEach((m, i) => {
      if (m.active) {
        tabLine += chalk.bgWhite.black(` ${m.key} `);
      } else {
        tabLine += chalk.gray(` ${m.key} `);
      }
      if (i < modes.length - 1) tabLine += ' ';
    });
    
    process.stdout.write(tabLine + '\n');
    process.stdout.write(chalk.gray('─'.repeat(this.width)) + '\n');
  }

  private drawContent(): void {
    // Content area - will be filled by specific mode
    const contentHeight = this.height - 6; // Header(3) + Status(1) + Input(2)
    for (let i = 0; i < contentHeight; i++) {
      process.stdout.write('\n');
    }
  }

  private drawStatusBar(): void {
    const status = ` Mode: ${this.state.mode} | Ctrl+C: Exit | Tab: Switch Mode `;
    process.stdout.write('\n' + chalk.bgGray.white(status.padEnd(this.width)));
  }

  private drawInput(): void {
    process.stdout.write('\n' + chalk.green('> ') + this.state.inputBuffer);
  }

  setMode(mode: TUIState['mode']): void {
    this.state.mode = mode;
    this.render();
  }

  handleKey(key: string): void {
    switch (key) {
      case '\t':
        const modes: TUIState['mode'][] = ['chat', 'files', 'commands', 'settings'];
        const currentIndex = modes.indexOf(this.state.mode);
        this.state.mode = modes[(currentIndex + 1) % modes.length];
        this.render();
        break;
      default:
        this.state.inputBuffer += key;
        break;
    }
  }
}

export function createBoxBorder(content: string[], title?: string): string[] {
  const maxLen = Math.max(...content.map(c => c.length), title?.length || 0);
  const result: string[] = [];
  
  // Top border
  if (title) {
    result.push('╭─ ' + title + ' ' + '─'.repeat(maxLen - title.length) + '╮');
  } else {
    result.push('╭' + '─'.repeat(maxLen + 2) + '╮');
  }
  
  // Content
  content.forEach(line => {
    result.push('│ ' + line.padEnd(maxLen) + ' │');
  });
  
  // Bottom border
  result.push('╰' + '─'.repeat(maxLen + 2) + '╯');
  
  return result;
}

export function drawProgressBar(progress: number, width: number = 20): string {
  const filled = Math.round(progress * width);
  const empty = width - filled;
  return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

