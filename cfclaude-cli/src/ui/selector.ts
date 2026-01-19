/**
 * Interactive Selector Component
 * For slash commands and file selection
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

export const SLASH_COMMANDS: SelectOption[] = [
  { label: 'help', value: '/help', description: 'Show available commands' },
  { label: 'clear', value: '/clear', description: 'Clear conversation history' },
  { label: 'compact', value: '/compact', description: 'Summarize and compact history' },
  { label: 'context', value: '/context', description: 'Show project context' },
  { label: 'model', value: '/model', description: 'Show or change model' },
  { label: 'info', value: '/info', description: 'Show session information' },
  { label: 'exit', value: '/exit', description: 'Exit the chat' },
];

export class InteractiveSelector {
  private options: SelectOption[] = [];
  private selectedIndex = 0;
  private filterText = '';
  private filteredOptions: SelectOption[] = [];
  private isActive = false;
  private onSelect: ((value: string) => void) | null = null;
  private onCancel: (() => void) | null = null;

  constructor(private prefix: string = '') {}

  show(options: SelectOption[], onSelect: (value: string) => void, onCancel: () => void): void {
    this.options = options;
    this.filteredOptions = options;
    this.selectedIndex = 0;
    this.filterText = '';
    this.isActive = true;
    this.onSelect = onSelect;
    this.onCancel = onCancel;
    
    this.render();
  }

  private render(): void {
    // Clear previous selector if any
    this.clear();
    
    const displayOptions = this.filteredOptions.slice(0, 7); // Max 7 options
    
    console.log();
    displayOptions.forEach((opt, i) => {
      const isSelected = i === this.selectedIndex;
      const pointer = isSelected ? chalk.hex('#FFD700')(' ▸ ') : '   ';
      const label = isSelected 
        ? chalk.hex('#FFD700').bold(opt.label) 
        : chalk.white(opt.label);
      const desc = opt.description 
        ? chalk.gray(` - ${opt.description}`) 
        : '';
      console.log(pointer + label + desc);
    });
    
    if (this.filteredOptions.length > 7) {
      console.log(chalk.gray(`   ... and ${this.filteredOptions.length - 7} more`));
    }
  }

  private clear(): void {
    const linesToClear = Math.min(this.filteredOptions.length, 7) + 2;
    for (let i = 0; i < linesToClear; i++) {
      process.stdout.write('\x1B[1A\x1B[2K');
    }
  }

  filter(text: string): void {
    this.filterText = text;
    this.filteredOptions = this.options.filter(opt => 
      opt.label.toLowerCase().includes(text.toLowerCase()) ||
      (opt.description?.toLowerCase().includes(text.toLowerCase()))
    );
    this.selectedIndex = 0;
    this.render();
  }

  moveUp(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.render();
    }
  }

  moveDown(): void {
    if (this.selectedIndex < Math.min(this.filteredOptions.length - 1, 6)) {
      this.selectedIndex++;
      this.render();
    }
  }

  select(): void {
    if (this.filteredOptions.length > 0 && this.onSelect) {
      const selected = this.filteredOptions[this.selectedIndex];
      this.clear();
      this.isActive = false;
      this.onSelect(selected.value);
    }
  }

  cancel(): void {
    this.clear();
    this.isActive = false;
    if (this.onCancel) {
      this.onCancel();
    }
  }

  getIsActive(): boolean {
    return this.isActive;
  }
}

export function getFilesForSelector(workdir: string, filter: string = ''): SelectOption[] {
  const files: SelectOption[] = [];
  
  try {
    const scanDir = (dir: string, prefix: string = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        // Skip hidden files and common ignore patterns
        if (entry.name.startsWith('.') || 
            entry.name === 'node_modules' || 
            entry.name === 'dist' ||
            entry.name === '__pycache__') {
          continue;
        }
        
        const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
        
        if (entry.isDirectory()) {
          files.push({
            label: relativePath + '/',
            value: relativePath,
            description: 'directory'
          });
          
          // Recursively scan subdirectories (limit depth)
          if (prefix.split('/').length < 3) {
            scanDir(path.join(dir, entry.name), relativePath);
          }
        } else {
          files.push({
            label: relativePath,
            value: relativePath,
            description: getFileType(entry.name)
          });
        }
      }
    };
    
    scanDir(workdir);
    
    // Filter if provided
    if (filter) {
      return files.filter(f => 
        f.label.toLowerCase().includes(filter.toLowerCase())
      ).slice(0, 20);
    }
    
    return files.slice(0, 20);
  } catch (e) {
    return [];
  }
}

function getFileType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: { [key: string]: string } = {
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript React',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript React',
    '.py': 'Python',
    '.rs': 'Rust',
    '.go': 'Go',
    '.java': 'Java',
    '.md': 'Markdown',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.css': 'CSS',
    '.html': 'HTML',
    '.vue': 'Vue',
    '.svelte': 'Svelte',
  };
  return types[ext] || 'file';
}

export function printCommandSelector(commands: SelectOption[], filter: string = ''): void {
  const filtered = filter 
    ? commands.filter(c => c.label.includes(filter))
    : commands;
  
  console.log();
  console.log(chalk.hex('#FFD700')('  Commands:'));
  
  filtered.slice(0, 7).forEach((cmd, i) => {
    const prefix = i === 0 ? chalk.hex('#FFD700')(' ▸ ') : '   ';
    console.log(prefix + chalk.white('/' + cmd.label) + chalk.gray(` - ${cmd.description}`));
  });
  
  console.log();
}

export function printFileSelector(files: SelectOption[]): void {
  console.log();
  console.log(chalk.hex('#FFD700')('  Files:'));
  
  files.slice(0, 7).forEach((file, i) => {
    const prefix = i === 0 ? chalk.hex('#FFD700')(' ▸ ') : '   ';
    console.log(prefix + chalk.white('@' + file.label) + chalk.gray(` - ${file.description}`));
  });
  
  if (files.length > 7) {
    console.log(chalk.gray(`   ... and ${files.length - 7} more`));
  }
  
  console.log();
}

