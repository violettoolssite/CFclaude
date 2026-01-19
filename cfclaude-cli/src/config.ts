/**
 * Configuration management
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface CFclaudeConfig {
  provider?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;  // 自定义 baseUrl（从桌面应用传递）
  providers?: {
    [key: string]: {
      apiKey?: string;
      baseUrl?: string;
      model?: string;
    };
  };
}

const CONFIG_DIR = path.join(os.homedir(), '.cfclaude');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function loadConfig(): Promise<CFclaudeConfig> {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }
  
  return {};
}

export async function saveConfig(config: CFclaudeConfig): Promise<void> {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (e) {
    console.error('Error saving config:', e);
  }
}

// 与主项目 CFclaude 验证过的配置保持一致
export function getProviderConfig(provider: string): { baseUrl: string; defaultModel: string } {
  const providers: { [key: string]: { baseUrl: string; defaultModel: string } } = {
    deepseek: {
      baseUrl: 'https://api.deepseek.com/v1',
      defaultModel: 'deepseek-chat'
    },
    kimi: {
      baseUrl: 'https://api.moonshot.cn/anthropic',
      defaultModel: 'kimi-k2-turbo-preview'
    },
    doubao: {
      baseUrl: 'https://ark.cn-beijing.volces.com/api/coding',
      defaultModel: 'doubao-seed-code-preview-251028'
    },
    qwen: {
      baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      defaultModel: 'qwen3-coder-plus'
    },
    zhipu: {
      baseUrl: 'https://open.bigmodel.cn/api/anthropic',
      defaultModel: 'glm-4.7'
    },
    nvidia: {
      baseUrl: 'https://integrate.api.nvidia.com/v1',
      defaultModel: 'z-ai/glm4.7'
    },
    anthropic: {
      baseUrl: 'https://api.anthropic.com/v1',
      defaultModel: 'claude-sonnet-4-5-20250514'
    },
    modelscope: {
      baseUrl: 'https://api-inference.modelscope.cn/v1/',
      defaultModel: 'Qwen/Qwen2.5-Coder-32B-Instruct'
    }
  };
  
  return providers[provider] || providers.deepseek;
}

