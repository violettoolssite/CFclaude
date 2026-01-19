/**
 * Tool Executor - Execute file operations and commands
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { glob } from 'glob';
import chalk from 'chalk';

export type ConfirmCallback = (message: string) => Promise<boolean>;

export class ToolExecutor {
  private confirmCallback?: ConfirmCallback;

  constructor(private workdir: string) {}

  // 设置确认回调函数
  setConfirmCallback(callback: ConfirmCallback): void {
    this.confirmCallback = callback;
  }

  async execute(toolName: string, params: { [key: string]: string }): Promise<string> {
    switch (toolName) {
      case 'read_file':
        return this.readFile(params.path);

      case 'write_file':
        return this.writeFile(params.path, params.content);

      case 'edit_file':
        return this.editFile(params.path, params.old_content, params.new_content);

      case 'delete_file':
        return this.deleteFile(params.path);

      case 'list_dir':
        return this.listDir(params.path || '.');

      case 'run_command':
        return this.runCommand(params.command);

      case 'search_files':
        return this.searchFiles(params.pattern, params.path || '.');

      default:
        return `Unknown tool: ${toolName}`;
    }
  }

  private readFile(filePath: string): string {
    const fullPath = path.resolve(this.workdir, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }
    return fs.readFileSync(fullPath, 'utf-8');
  }

  private async writeFile(filePath: string, content: string): Promise<string> {
    if (content === undefined || content === null) {
      throw new Error('写入内容不能为空');
    }

    const fullPath = path.resolve(this.workdir, filePath);
    const dir = path.dirname(fullPath);

    // 检查文件是否存在
    const exists = fs.existsSync(fullPath);

    if (exists) {
      // 文件已存在，给出严重警告
      console.log(chalk.red('  [!] 警告：文件已存在'));
      console.log(chalk.yellow('  此操作将完全覆盖文件内容，原有内容将丢失！'));
      console.log(chalk.gray('  建议：应该使用 edit_file 而不是 write_file'));
    }

    // 询问用户确认
    if (this.confirmCallback) {
      const action = exists ? '[!] 覆盖并删除原内容' : '创建新文件';
      const confirmed = await this.confirmCallback(`${action} ${chalk.cyan(filePath)}?`);
      if (!confirmed) {
        throw new Error('用户取消操作');
      }
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf-8');
    return filePath;
  }

  private async editFile(filePath: string, oldContent: string, newContent: string): Promise<string> {
    const fullPath = path.resolve(this.workdir, filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }

    let content = fs.readFileSync(fullPath, 'utf-8');

    if (!content.includes(oldContent)) {
      throw new Error(`找不到要替换的内容`);
    }

    // 显示变更内容
    console.log(chalk.cyan('  文件: ') + chalk.yellow(filePath));
    console.log(chalk.gray('  ────────────────────────────────────────'));
    console.log(chalk.red('  - 删除:'));
    this.printDiff(oldContent, 'red');
    console.log(chalk.green('  + 新增:'));
    this.printDiff(newContent, 'green');
    console.log(chalk.gray('  ────────────────────────────────────────'));

    // 询问用户确认
    if (this.confirmCallback) {
      const confirmed = await this.confirmCallback(`应用此修改?`);
      if (!confirmed) {
        throw new Error('用户取消操作');
      }
    }

    content = content.replace(oldContent, newContent);
    fs.writeFileSync(fullPath, content, 'utf-8');

    return filePath;
  }

  // 显示 diff 内容（带行号和缩进）
  private printDiff(text: string, color: 'red' | 'green'): void {
    const lines = text.split('\n');
    const colorFn = color === 'red' ? chalk.red : chalk.green;

    lines.forEach((line, index) => {
      const lineNum = String(index + 1).padStart(3, ' ');
      console.log(colorFn(`    ${lineNum} │ ${line}`));
    });
  }

  private async deleteFile(filePath: string): Promise<string> {
    const fullPath = path.resolve(this.workdir, filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }

    // 询问用户确认
    if (this.confirmCallback) {
      const confirmed = await this.confirmCallback(`[!] 删除文件 ${chalk.cyan(filePath)}?`);
      if (!confirmed) {
        throw new Error('用户取消操作');
      }
    }

    fs.unlinkSync(fullPath);
    return filePath;
  }

  private listDir(dirPath: string): string {
    const fullPath = path.resolve(this.workdir, dirPath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`目录不存在: ${dirPath}`);
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    const result: string[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const prefix = entry.isDirectory() ? '[DIR]  ' : '[FILE] ';
      result.push(prefix + entry.name);
    }

    return result.join('\n') || '(空目录)';
  }

  private runCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Security: prevent dangerous commands
      const dangerous = ['rm -rf /', 'format', 'del /f /s /q'];
      if (dangerous.some(d => command.includes(d))) {
        reject(new Error('命令被安全策略阻止'));
        return;
      }

      exec(command, { cwd: this.workdir, timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(stdout || stderr || '(无输出)');
        }
      });
    });
  }

  private async searchFiles(pattern: string, searchPath: string): Promise<string> {
    const fullPath = path.resolve(this.workdir, searchPath);
    const files = await glob(pattern, {
      cwd: fullPath,
      ignore: ['node_modules/**', '.git/**', 'dist/**']
    });

    if (files.length === 0) {
      return '未找到匹配的文件';
    }

    return files.slice(0, 50).join('\n') +
      (files.length > 50 ? `\n... 还有 ${files.length - 50} 个文件` : '');
  }
}
