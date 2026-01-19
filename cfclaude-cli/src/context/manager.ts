/**
 * Context Manager - Build project context for AI
 */

import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

export class ContextManager {
  private ig: ReturnType<typeof ignore>;

  constructor(private workdir: string) {
    this.ig = ignore();
    this.loadGitignore();
  }

  private loadGitignore(): void {
    const gitignorePath = path.join(this.workdir, '.gitignore');
    
    // Default ignores
    this.ig.add([
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      '__pycache__',
      '*.pyc',
      '.env',
      '.env.local',
      '*.log'
    ]);
    
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, 'utf-8');
      this.ig.add(content.split('\n').filter(line => line.trim() && !line.startsWith('#')));
    }
  }

  async buildContext(): Promise<string> {
    const lines: string[] = [];
    
    lines.push('Project Structure:');
    lines.push('```');
    lines.push(this.buildTree(this.workdir, '', 0, 20));
    lines.push('```');
    
    // Try to read key files
    const keyFiles = ['package.json', 'README.md', 'requirements.txt', 'Cargo.toml', 'go.mod'];
    
    for (const file of keyFiles) {
      const filePath = path.join(this.workdir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          if (content.length < 2000) {
            lines.push('');
            lines.push(`${file}:`);
            lines.push('```');
            lines.push(content.slice(0, 2000));
            lines.push('```');
          }
        } catch (e) {
          // Ignore read errors
        }
      }
    }
    
    return lines.join('\n');
  }

  private buildTree(dir: string, prefix: string, depth: number, maxItems: number): string {
    if (depth > 3) return '';
    
    const lines: string[] = [];
    let count = 0;
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (count >= maxItems) {
          lines.push(prefix + '... (more items)');
          break;
        }
        
        const relativePath = path.relative(this.workdir, path.join(dir, entry.name));
        
        if (this.ig.ignores(relativePath) || entry.name.startsWith('.')) {
          continue;
        }
        
        const isLast = count === entries.length - 1 || count === maxItems - 1;
        const connector = isLast ? '└── ' : '├── ';
        const childPrefix = isLast ? '    ' : '│   ';
        
        if (entry.isDirectory()) {
          lines.push(prefix + connector + entry.name + '/');
          const subTree = this.buildTree(
            path.join(dir, entry.name),
            prefix + childPrefix,
            depth + 1,
            10
          );
          if (subTree) lines.push(subTree);
        } else {
          lines.push(prefix + connector + entry.name);
        }
        
        count++;
      }
    } catch (e) {
      // Ignore errors
    }
    
    return lines.join('\n');
  }

  async getFileContent(filePath: string): Promise<string | null> {
    try {
      const fullPath = path.resolve(this.workdir, filePath);
      if (!fs.existsSync(fullPath)) return null;
      return fs.readFileSync(fullPath, 'utf-8');
    } catch (e) {
      return null;
    }
  }
}

