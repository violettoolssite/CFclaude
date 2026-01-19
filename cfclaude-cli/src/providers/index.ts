/**
 * Provider Registry - All supported AI providers
 */

export interface ProviderInfo {
  id: string;
  name: string;
  baseUrl: string;
  defaultModel: string;
  models: string[];
  authHeader: 'Bearer' | 'x-api-key';
  description: string;
}

// 与主项目 CFclaude 验证过的模型配置保持一致
export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    authHeader: 'Bearer',
    description: 'DeepSeek AI - 高性能推理和代码生成'
  },
  {
    id: 'kimi',
    name: 'Kimi (Moonshot)',
    baseUrl: 'https://api.moonshot.cn/anthropic',
    defaultModel: 'kimi-k2-turbo-preview',
    models: ['kimi-k2-turbo-preview'],
    authHeader: 'Bearer',
    description: 'Moonshot AI - Kimi K2 对话助手'
  },
  {
    id: 'doubao',
    name: '豆包 (ByteDance)',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/coding',
    defaultModel: 'doubao-seed-code-preview-251028',
    models: ['doubao-seed-code-preview-251028'],
    authHeader: 'Bearer',
    description: '字节跳动豆包 - Seed Code 编程助手'
  },
  {
    id: 'qwen',
    name: '通义千问 (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen3-coder-plus',
    models: ['qwen3-coder-plus', 'qwen-max'],
    authHeader: 'Bearer',
    description: '阿里云通义千问 - Qwen3 Coder 智能助手'
  },
  {
    id: 'zhipu',
    name: '智谱AI',
    baseUrl: 'https://open.bigmodel.cn/api/anthropic',
    defaultModel: 'glm-4.7',
    models: ['glm-4.7', 'glm-4.5-air', 'glm-4-plus'],
    authHeader: 'Bearer',
    description: '智谱AI - GLM系列大模型'
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    defaultModel: 'z-ai/glm4.7',
    models: [
      'z-ai/glm4.7',
      'minimaxai/minimax-m2.1',
      'deepseek-ai/deepseek-r1',
      'meta/llama-4-maverick-17b-128e-instruct',
      'meta/llama-4-scout-17b-16e-instruct'
    ],
    authHeader: 'Bearer',
    description: 'NVIDIA NIM - GPU加速推理平台'
  },
  {
    id: 'modelscope',
    name: 'ModelScope',
    baseUrl: 'https://api-inference.modelscope.cn/v1/',
    defaultModel: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    models: [
      'Qwen/Qwen2.5-Coder-32B-Instruct',
      'Qwen/Qwen2.5-72B-Instruct',
      'Qwen/Qwen2.5-Coder-7B-Instruct',
      'Qwen/Qwen2.5-32B-Instruct',
      'Qwen/Qwen2.5-14B-Instruct',
      'Qwen/Qwen2.5-7B-Instruct'
    ],
    authHeader: 'Bearer',
    description: '魔搭社区 - 开源模型推理平台'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-sonnet-4-5-20250514',
    models: ['claude-sonnet-4-5-20250514', 'claude-opus-4-5-20250514', 'claude-haiku-4-5-20250514'],
    authHeader: 'x-api-key',
    description: 'Anthropic Claude - 安全可靠的AI助手'
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI Compatible)',
    baseUrl: '',
    defaultModel: '',
    models: [],
    authHeader: 'Bearer',
    description: '自定义 OpenAI 兼容接口'
  }
];

export function getProvider(id: string): ProviderInfo | undefined {
  return PROVIDERS.find(p => p.id === id);
}

export function listProviders(): ProviderInfo[] {
  return PROVIDERS.filter(p => p.id !== 'custom');
}

