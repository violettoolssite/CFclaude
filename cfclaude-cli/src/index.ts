#!/usr/bin/env node
/**
 * CFclaude Code - Multi-provider AI Coding Assistant CLI
 * 
 * Inspired by Continue CLI (https://github.com/continuedev/continue)
 * Thanks to Anthropic, Alibaba Cloud, and Continue Dev
 * 
 * Apache 2.0 License - 2026
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { ChatSession } from './chat';
import { loadConfig, saveConfig } from './config';
import { printBanner } from './ui/banner';
import { listProviders } from './providers';

const program = new Command();

program
  .name('cfclaude')
  .description('CFclaude Code - Multi-provider AI coding assistant')
  .version('1.0.0');

// Default command - TUI Mode
program
  .argument('[message]', 'Initial message')
  .option('-p, --prompt <message>', 'Run in headless mode')
  .option('-d, --dir <directory>', 'Working directory', process.cwd())
  .option('--provider <provider>', 'AI provider')
  .option('--model <model>', 'Model to use')
  .action(async (message, options) => {
    const config = await loadConfig();
    
    // 优先使用环境变量（从 CFclaude 桌面应用启动时传递）
    const envProvider = process.env.CFCLAUDE_PROVIDER;
    const envModel = process.env.CFCLAUDE_MODEL;
    const envApiKey = process.env.CFCLAUDE_API_KEY;
    const envBaseUrl = process.env.CFCLAUDE_BASE_URL;
    
    // 如果从桌面应用启动，保存环境变量配置到 config
    if (envProvider && envApiKey) {
      config.provider = envProvider;
      config.apiKey = envApiKey;
      if (envModel) config.model = envModel;
      if (envBaseUrl) config.baseUrl = envBaseUrl;
      await saveConfig(config);
    }
    
    const provider = options.provider || envProvider || config.provider || 'deepseek';
    const model = options.model || envModel || config.model;
    const workdir = options.dir;
    
    if (options.prompt) {
      console.log(chalk.gray('Headless mode...'));
      const session = new ChatSession(provider, model, workdir);
      await session.runHeadless(options.prompt);
      return;
    }
    
    const session = new ChatSession(provider, model, workdir);
    await session.start(message);
  });

// Chat command
program
  .command('chat')
  .description('Start interactive chat')
  .option('-p, --provider <provider>', 'AI provider')
  .option('-m, --model <model>', 'Model')
  .option('-d, --dir <directory>', 'Working directory', process.cwd())
  .action(async (options) => {
    const config = await loadConfig();
    const provider = options.provider || config.provider || 'deepseek';
    const model = options.model || config.model;
    const session = new ChatSession(provider, model, options.dir);
    await session.start();
  });

// Config command
program
  .command('config')
  .description('Configure CFclaude')
  .option('-p, --provider <provider>', 'Set provider')
  .option('-k, --api-key <key>', 'Set API key')
  .option('-m, --model <model>', 'Set model')
  .option('--list', 'Show config')
  .action(async (options) => {
    const config = await loadConfig();
    
    if (options.list) {
      console.log(chalk.cyan('Configuration:'));
      console.log(`  Provider: ${chalk.green(config.provider || 'not set')}`);
      console.log(`  Model: ${chalk.green(config.model || 'not set')}`);
      console.log(`  API Key: ${chalk.green(config.apiKey ? '****' + config.apiKey.slice(-4) : 'not set')}`);
      return;
    }
    
    if (options.provider) config.provider = options.provider;
    if (options.apiKey) config.apiKey = options.apiKey;
    if (options.model) config.model = options.model;
    
    await saveConfig(config);
    console.log(chalk.green('Saved!'));
  });

// Providers command
program
  .command('providers')
  .description('List providers')
  .action(() => {
    console.log(chalk.cyan('Providers:'));
    console.log();
    listProviders().forEach(p => {
      console.log(chalk.green(`  ${p.id.padEnd(12)}`) + p.name);
      console.log(chalk.gray(`              ${p.description}`));
      console.log(chalk.gray(`              Models: ${p.models.slice(0, 3).join(', ')}`));
    });
  });

// Init command
program
  .command('init')
  .description('Create AGENTS.md')
  .action(async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const agentsPath = path.join(process.cwd(), 'AGENTS.md');
    
    if (fs.existsSync(agentsPath)) {
      console.log(chalk.yellow('AGENTS.md exists'));
      return;
    }
    
    const content = `# CFclaude Code Agent Configuration

## Project Context
Describe your project here.

## Coding Standards
- Follow existing code style
- Add comments for complex logic

## Preferred Patterns
- Use TypeScript
- Keep functions small
`;
    
    fs.writeFileSync(agentsPath, content);
    console.log(chalk.green('Created AGENTS.md'));
  });

program.parse();
