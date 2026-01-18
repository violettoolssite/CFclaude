const { ipcRenderer } = require('electron');

// 服务商配置
const PROVIDERS = {
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/anthropic',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat (推荐)' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (推理)' }
    ]
  },
  doubao: {
    name: '豆包',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/coding',
    models: [
      { id: 'doubao-seed-code-preview-251028', name: 'Doubao Seed Code (推荐)' }
    ]
  },
  kimi: {
    name: 'Kimi',
    baseUrl: 'https://api.moonshot.cn/anthropic',
    models: [
      { id: 'kimi-k2-turbo-preview', name: 'Kimi K2 (推荐)' }
    ]
  },
  zhipu: {
    name: '智谱AI',
    baseUrl: 'https://open.bigmodel.cn/api/anthropic',
    models: [
      { id: 'glm-4.7', name: 'GLM-4.7 (推荐)' },
      { id: 'glm-4.5-air', name: 'GLM-4.5 Air' },
      { id: 'glm-4-plus', name: 'GLM-4 Plus' },
      { id: 'glm-4-air', name: 'GLM-4 Air' }
    ]
  },
  qwen: {
    name: '通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    note: '支持 OAuth（免费）和 OpenAI 认证',
    authModes: [
      { id: 'oauth', name: 'OAuth 认证（每天 2000 次免费）' },
      { id: 'openai', name: 'OpenAI 兼容（需要 API Key）' }
    ],
    modelsByAuth: {
      oauth: [
        { id: 'coder-model', name: 'Coder Model（最新版本）' },
        { id: 'vision-model', name: 'Vision Model（视觉）' }
      ],
      openai: [
        { id: 'qwen3-coder-plus', name: 'Qwen3 Coder Plus (推荐)' },
        { id: 'qwen3-coder', name: 'Qwen3 Coder' },
        { id: 'qwen-max', name: 'Qwen Max' },
        { id: 'qwen-plus', name: 'Qwen Plus' },
        { id: 'qwen-turbo', name: 'Qwen Turbo' },
        { id: 'qwen2.5-coder-32b-instruct', name: 'Qwen2.5 Coder 32B' }
      ]
    },
    models: [
      { id: 'coder-model', name: 'Coder Model（OAuth 免费）' }
    ]
  },
  modelscope: {
    name: 'ModelScope',
    baseUrl: 'https://api-inference.modelscope.cn/v1/',
    note: '使用 Qwen Code',
    models: [
      { id: 'Qwen/Qwen2.5-Coder-32B-Instruct', name: 'Qwen2.5-Coder-32B (推荐)' },
      { id: 'Qwen/Qwen2.5-Coder-7B-Instruct', name: 'Qwen2.5-Coder-7B' },
      { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen2.5-72B' },
      { id: 'Qwen/Qwen2.5-32B-Instruct', name: 'Qwen2.5-32B' },
      { id: 'Qwen/Qwen2.5-14B-Instruct', name: 'Qwen2.5-14B' },
      { id: 'Qwen/Qwen2.5-7B-Instruct', name: 'Qwen2.5-7B' }
    ]
  },
  cloudflare: {
    name: 'Cloudflare',
    baseUrl: '',
    models: [
      { id: '@cf/meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B' },
      { id: '@cf/meta/llama-3.2-3b-instruct', name: 'Llama 3.2 3B' },
      { id: '@cf/mistral/mistral-7b-instruct-v0.1', name: 'Mistral 7B' },
      { id: '@cf/deepseek-ai/deepseek-math-7b-instruct', name: 'DeepSeek Math 7B' },
      { id: '@cf/openchat/openchat-3.5-0106', name: 'OpenChat 3.5' },
      { id: '@cf/qwen/qwen1.5-7b-chat-awq', name: 'Qwen 1.5 7B' }
    ]
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: '',
    models: [
      { id: 'claude-sonnet-4-5-20250514', name: 'Sonnet 4.5 (默认推荐) $3/$15' },
      { id: 'claude-opus-4-5-20250514', name: 'Opus 4.5 (最强) $5/$25' },
      { id: 'claude-haiku-4-5-20250514', name: 'Haiku 4.5 (最快) $1/$5' }
    ]
  }
};

// 统一网关地址（用户可自定义）
let unifiedGateway = '';

let currentProvider = null;

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await loadCurrentConfig();
  setupEventListeners();
  loadCfConfig();
  loadHistoryList();
  setupModalListeners();
});

// 只更新状态显示，不重置表单
async function updateStatusDisplay() {
  const config = await ipcRenderer.invoke('get-config');
  
  let providerName = '-';
  let modelName = '-';
  
  if (config.baseUrl) {
    if (config.baseUrl.includes('deepseek')) {
      providerName = 'DeepSeek';
    } else if (config.baseUrl.includes('volces.com') || config.baseUrl.includes('volcengine')) {
      providerName = '豆包';
    } else if (config.baseUrl.includes('moonshot.cn')) {
      providerName = 'Kimi';
    } else if (config.baseUrl.includes('dashscope.aliyuncs.com')) {
      providerName = '通义千问';
    } else if (config.baseUrl.includes('bigmodel.cn')) {
      providerName = '智谱AI';
    } else if (config.baseUrl.includes('modelscope')) {
      providerName = 'ModelScope';
    } else if (config.baseUrl.includes('workers.dev') || config.baseUrl.includes('cloudflare')) {
      providerName = 'Cloudflare';
    } else {
      providerName = '自定义网关';
    }
  } else if (config.model) {
    providerName = 'Anthropic';
  }
  
  if (config.model) {
    modelName = config.model;
  }
  
  document.getElementById('current-provider').textContent = providerName;
  document.getElementById('current-model').textContent = modelName;
}

async function loadCurrentConfig() {
  const config = await ipcRenderer.invoke('get-config');
  
  let providerName = '-';
  let providerId = null;
  let modelName = '-';
  let isCustomGateway = false;
  let gatewayUrl = '';
  
  if (config.baseUrl) {
    if (config.baseUrl.includes('deepseek')) {
      providerName = 'DeepSeek';
      providerId = 'deepseek';
    } else if (config.baseUrl.includes('volces.com') || config.baseUrl.includes('volcengine')) {
      providerName = '豆包';
      providerId = 'doubao';
    } else if (config.baseUrl.includes('moonshot.cn')) {
      providerName = 'Kimi';
      providerId = 'kimi';
    } else if (config.baseUrl.includes('dashscope.aliyuncs.com')) {
      providerName = '通义千问';
      providerId = 'qwen';
    } else if (config.baseUrl.includes('bigmodel.cn')) {
      providerName = '智谱AI';
      providerId = 'zhipu';
    } else if (config.baseUrl.includes('modelscope')) {
      providerName = 'ModelScope';
      providerId = 'modelscope';
    } else if (config.baseUrl.includes('workers.dev') || config.baseUrl.includes('cloudflare')) {
      providerName = 'Cloudflare';
      providerId = 'cloudflare';
    } else {
      // 使用了统一网关，根据模型名判断服务商
      isCustomGateway = true;
      gatewayUrl = config.baseUrl;
      if (config.model && config.model.includes('claude')) {
        providerName = 'Anthropic [网关]';
        providerId = 'anthropic';
    } else {
      providerName = '自定义网关';
        providerId = 'anthropic';  // 默认选择 Anthropic
      }
    }
  } else if (config.model) {
    providerName = 'Anthropic';
    providerId = 'anthropic';
  }
  
  if (config.model) {
    modelName = config.model;
  }
  
  document.getElementById('current-provider').textContent = providerName;
  document.getElementById('current-model').textContent = modelName;
  
  // 自动选中上次使用的服务商和模型
  if (providerId) {
    selectProvider(providerId);
    // 设置模型选择
    if (config.model) {
      const modelSelect = document.getElementById('model-select');
      for (let i = 0; i < modelSelect.options.length; i++) {
        if (modelSelect.options[i].value === config.model) {
          modelSelect.selectedIndex = i;
          break;
        }
      }
    }
    // 如果是 Cloudflare，填入 Worker URL
    if (providerId === 'cloudflare' && config.baseUrl) {
      document.getElementById('cf-worker-url').value = config.baseUrl;
    }
    // 填入统一网关地址
    const gatewayInput = document.getElementById('unified-gateway');
    if (gatewayInput) {
      gatewayInput.value = isCustomGateway ? gatewayUrl : '';
    }
  }
}

function setupEventListeners() {
  // 侧边栏视图切换
  document.querySelectorAll('.sidebar-btn[data-view]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
  
  // 服务商选择
  document.querySelectorAll('.provider-btn').forEach(btn => {
    btn.addEventListener('click', () => selectProvider(btn.dataset.provider));
  });
  
  // 应用配置
  document.getElementById('apply-btn').addEventListener('click', applyConfig);
  
  // 清除配置
  document.getElementById('clear-btn').addEventListener('click', clearConfig);
  
  // 安装 Claude Code
  document.getElementById('install-claude-btn').addEventListener('click', installClaudeCode);
  
  // 下载 Node.js
  document.getElementById('download-node-btn').addEventListener('click', downloadNodejs);
  
  // 安装 Qwen Code
  const installQwenBtn = document.getElementById('install-qwen-btn');
  if (installQwenBtn) {
    installQwenBtn.addEventListener('click', installQwenCode);
  }
  
  // 配置 Qwen Code
  const configQwenBtn = document.getElementById('config-qwen-btn');
  if (configQwenBtn) {
    configQwenBtn.addEventListener('click', configQwenCode);
  }
  
  // 安装 Codex CLI
  const installCodexBtn = document.getElementById('install-codex-btn');
  if (installCodexBtn) {
    installCodexBtn.addEventListener('click', installCodex);
  }
  
  // 清空历史
  document.getElementById('clear-history-btn').addEventListener('click', clearHistory);
  
  // 选择工作目录
  const workdirBtn = document.getElementById('workdir-btn');
  if (workdirBtn) {
    workdirBtn.addEventListener('click', selectWorkdir);
  }
  
  // 外部链接按钮
  document.querySelectorAll('button[data-url]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      if (url) {
        require('electron').shell.openExternal(url);
      }
    });
  });
  
  // 部署 Worker
  const deployBtn = document.getElementById('deploy-worker-btn');
  if (deployBtn) {
    deployBtn.addEventListener('click', deployWorker);
  }
}

async function deployWorker() {
  const accountId = document.getElementById('cf-account-id').value.trim();
  const apiToken = document.getElementById('cf-api-token').value.trim();
  const workerName = document.getElementById('cf-worker-name').value.trim() || 'claude-ai-proxy';
  const subdomain = document.getElementById('cf-subdomain').value.trim() || 'violetqqcom';
  
  const statusEl = document.getElementById('cf-deploy-status');
  const urlDisplay = document.getElementById('cf-url-display');
  
  // 重置状态
  statusEl.innerHTML = '';
  statusEl.style.display = 'block';
  urlDisplay.style.display = 'none';
  
  function addStep(text, status = 'active') {
    const step = document.createElement('div');
    step.className = 'step ' + status;
    step.textContent = text;
    statusEl.appendChild(step);
    statusEl.scrollTop = statusEl.scrollHeight;
    return step;
  }
  
  function updateStep(step, status) {
    step.className = 'step ' + status;
  }
  
  if (!accountId) {
    addStep('错误：请输入 Account ID', 'error');
    return;
  }
  if (!apiToken) {
    addStep('错误：请输入 API Token', 'error');
    return;
  }
  
  const step1 = addStep('正在验证配置...');
  await sleep(300);
  updateStep(step1, 'success');
  
  const step2 = addStep('正在上传 Worker 代码...');
  
  try {
    const result = await ipcRenderer.invoke('deploy-worker', {
      accountId,
      apiToken,
      workerName,
      subdomain
    });
    
    updateStep(step2, 'success');
    
    if (result.success) {
      const step3 = addStep('正在配置 AI Binding...');
      await sleep(200);
      updateStep(step3, 'success');
      
      const step4 = addStep('正在启用 workers.dev 路由...');
      await sleep(200);
      updateStep(step4, result.routeEnabled ? 'success' : 'error');
      
      if (!result.routeEnabled) {
        addStep('路由启用失败，请手动在 Cloudflare 设置中启用', 'error');
      }
      
      addStep('部署完成！', 'success');
      
      // 显示 URL
      const urlInput = document.getElementById('cf-deployed-url');
      urlDisplay.style.display = 'block';
      urlInput.value = result.url;
      
      // 点击复制
      urlInput.onclick = () => {
        urlInput.select();
        document.execCommand('copy');
        addStep('URL 已复制到剪贴板', 'success');
      };
      
      // 保存配置到本地存储
      localStorage.setItem('cf-config', JSON.stringify({
        accountId,
        apiToken,
        workerName,
        subdomain,
        deployedUrl: result.url
      }));
    } else {
      addStep(result.message || '部署失败', 'error');
    }
  } catch (error) {
    updateStep(step2, 'error');
    addStep('部署失败: ' + error, 'error');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 加载保存的 Cloudflare 配置
function loadCfConfig() {
  const saved = localStorage.getItem('cf-config');
  if (saved) {
    try {
      const config = JSON.parse(saved);
      const accountIdEl = document.getElementById('cf-account-id');
      const apiTokenEl = document.getElementById('cf-api-token');
      const workerNameEl = document.getElementById('cf-worker-name');
      const subdomainEl = document.getElementById('cf-subdomain');
      const urlDisplay = document.getElementById('cf-url-display');
      const urlInput = document.getElementById('cf-deployed-url');
      
      if (accountIdEl && config.accountId) accountIdEl.value = config.accountId;
      if (apiTokenEl && config.apiToken) apiTokenEl.value = config.apiToken;
      if (workerNameEl && config.workerName) workerNameEl.value = config.workerName;
      if (subdomainEl && config.subdomain) subdomainEl.value = config.subdomain;
      
      if (config.deployedUrl && urlDisplay && urlInput) {
        urlDisplay.style.display = 'block';
        urlInput.value = config.deployedUrl;
        urlInput.onclick = () => {
          urlInput.select();
          document.execCommand('copy');
          showCfMessage('URL 已复制到剪贴板', 'success');
        };
      }
    } catch (e) {}
  }
}

function showCfMessage(text, type) {
  const msg = document.getElementById('cf-deploy-message');
  if (msg) {
    msg.textContent = text;
    msg.className = 'message ' + type;
    if (type !== 'success' || !text.includes('正在')) {
      setTimeout(() => {
        msg.className = 'message';
      }, 5000);
    }
  }
}

function switchView(viewId) {
  // 隐藏所有视图
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  // 显示目标视图
  const targetView = document.getElementById('view-' + viewId);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  // 更新侧边栏按钮状态
  document.querySelectorAll('.sidebar-btn[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });
}

async function installClaudeCode() {
  showLoading('正在安装 Claude Code，请稍候...');
  try {
    const result = await ipcRenderer.invoke('install-claude-code');
    hideLoading();
    showInstallMessage(result, 'success');
  } catch (error) {
    hideLoading();
    showInstallMessage(String(error), 'error');
  }
}

async function downloadNodejs() {
  showLoading('正在打开下载页面...');
  try {
    const result = await ipcRenderer.invoke('download-nodejs');
    hideLoading();
    // 在 Node.js 页面没有 message 元素，使用 alert 或者直接忽略
    alert('Node.js 下载已开始，请在浏览器中完成下载和安装。');
  } catch (error) {
    hideLoading();
    alert('下载失败: ' + error);
  }
}

// Qwen Code 安装
async function installQwenCode() {
  showLoading('正在安装 Qwen Code，请稍候...');
  try {
    const result = await ipcRenderer.invoke('install-qwen-code');
    hideLoading();
    showQwenMessage(result, 'success');
  } catch (error) {
    hideLoading();
    showQwenMessage(String(error), 'error');
  }
}

// Qwen Code 配置
async function configQwenCode() {
  const apiKey = document.getElementById('qwen-api-key').value.trim();
  const model = document.getElementById('qwen-model-select').value;
  const baseUrl = document.getElementById('qwen-region-select').value;
  
  if (!apiKey) {
    showQwenMessage('请输入百炼 API Key', 'error');
    return;
  }
  
  showLoading('正在启动 Qwen Code...');
  try {
    await ipcRenderer.invoke('launch-qwen', {
      apiKey,
      model,
      baseUrl
    });
    hideLoading();
    showQwenMessage('配置已应用，Qwen Code 已启动', 'success');
  } catch (error) {
    hideLoading();
    showQwenMessage('启动失败: ' + error, 'error');
  }
}

// Qwen 页面消息显示
function showQwenMessage(text, type) {
  const msg = document.getElementById('qwen-message');
  if (msg) {
    msg.textContent = text;
    msg.className = 'message ' + type;
    setTimeout(() => {
      msg.className = 'message';
    }, 8000);
  }
}

// Codex CLI 安装
async function installCodex() {
  showLoading('正在安装 Codex CLI，请稍候...');
  try {
    const result = await ipcRenderer.invoke('install-codex');
    hideLoading();
    showCodexMessage(result, 'success');
  } catch (error) {
    hideLoading();
    showCodexMessage(String(error), 'error');
  }
}

// Codex 页面消息显示
function showCodexMessage(text, type) {
  const msg = document.getElementById('codex-message');
  if (msg) {
    msg.textContent = text;
    msg.className = 'message ' + type;
    setTimeout(() => {
      msg.className = 'message';
    }, 8000);
  }
}

// 当前选择的认证方式
let currentAuthMode = 'oauth';

function selectProvider(providerId) {
  currentProvider = providerId;
  const provider = PROVIDERS[providerId];
  
  // 更新按钮状态
  document.querySelectorAll('.provider-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.provider === providerId);
  });
  
  // 显示配置区域
  document.getElementById('config-section').style.display = 'block';
  
  // 显示/隐藏特有配置
  const cfConfig = document.getElementById('cloudflare-config');
  const apiKeyGroup = document.getElementById('api-key-group');
  const customModelGroup = document.getElementById('custom-model-group');
  const authModeGroup = document.getElementById('auth-mode-group');
  const modelSelect = document.getElementById('model-select');
  const authModeSelect = document.getElementById('auth-mode-select');
  
  cfConfig.style.display = 'none';
  apiKeyGroup.style.display = 'block';
  apiKeyGroup.querySelector('label').textContent = 'API Key';
  customModelGroup.style.display = 'none';
  authModeGroup.style.display = 'none';
  
  // 通义千问：显示认证方式选择
  if (providerId === 'qwen' && provider.authModes) {
    authModeGroup.style.display = 'block';
    
    // 填充认证方式选项
    authModeSelect.innerHTML = provider.authModes.map(m => 
      `<option value="${m.id}">${m.name}</option>`
    ).join('');
    
    // 默认选择 OAuth
    currentAuthMode = 'oauth';
    updateQwenModels(provider);
    
    // OAuth 模式不需要 API Key
    apiKeyGroup.style.display = 'none';
    
    // 监听认证方式变化
    authModeSelect.onchange = function() {
      currentAuthMode = this.value;
      updateQwenModels(provider);
      
      // 根据认证方式显示/隐藏 API Key
      if (currentAuthMode === 'oauth') {
        apiKeyGroup.style.display = 'none';
      } else {
        apiKeyGroup.style.display = 'block';
        apiKeyGroup.querySelector('label').textContent = '百炼 API Key';
      }
    };
  } else {
    // 其他服务商：使用默认模型列表
    let modelOptions = provider.models.map(m => 
      `<option value="${m.id}">${m.name}</option>`
    ).join('');
    modelOptions += '<option value="__custom__">-- 自定义模型 --</option>';
    modelSelect.innerHTML = modelOptions;
  }
  
  if (providerId === 'cloudflare') {
    cfConfig.style.display = 'block';
    apiKeyGroup.querySelector('label').textContent = 'API Token (可选)';
  } else if (providerId === 'anthropic') {
    apiKeyGroup.style.display = 'block';
    apiKeyGroup.querySelector('label').textContent = 'Anthropic API Key';
  }
  
  // 监听模型选择变化，显示/隐藏自定义模型输入框
  modelSelect.onchange = function() {
    if (this.value === '__custom__') {
      customModelGroup.style.display = 'block';
    } else {
      customModelGroup.style.display = 'none';
    }
  };
}

// 更新通义千问的模型列表
function updateQwenModels(provider) {
  const modelSelect = document.getElementById('model-select');
  const models = provider.modelsByAuth[currentAuthMode] || provider.models;
  
  let modelOptions = models.map(m => 
    `<option value="${m.id}">${m.name}</option>`
  ).join('');
  
  // OpenAI 模式允许自定义模型
  if (currentAuthMode === 'openai') {
    modelOptions += '<option value="__custom__">-- 自定义模型 --</option>';
  }
  
  modelSelect.innerHTML = modelOptions;
}

function cleanUrl(url) {
  if (!url) return url;
  url = url.trim();
  // 移除末尾的 /v1 或 /v1/
  url = url.replace(/\/v1\/?$/, '');
  // 移除末尾的 /
  url = url.replace(/\/$/, '');
  return url;
}

// 选择工作目录
async function selectWorkdir() {
  try {
    const dir = await ipcRenderer.invoke('select-directory');
    if (dir) {
      document.getElementById('workdir-path').value = dir;
    }
  } catch (error) {
    showMessage('选择目录失败: ' + error, 'error');
  }
}

async function applyConfig() {
  if (!currentProvider) {
    showMessage('请先选择服务商', 'error');
    return;
  }
  
  const provider = PROVIDERS[currentProvider];
  let model = document.getElementById('model-select').value;
  const apiKey = document.getElementById('api-key').value;
  
  // 对于通义千问，直接从 DOM 读取当前认证方式（确保获取最新值）
  if (currentProvider === 'qwen') {
    const authModeSelect = document.getElementById('auth-mode-select');
    if (authModeSelect) {
      currentAuthMode = authModeSelect.value;
      console.log('当前认证方式:', currentAuthMode);
    }
  }
  
  // 如果选择了自定义模型，使用自定义模型输入框的值
  if (model === '__custom__') {
    const customModel = document.getElementById('custom-model').value.trim();
    if (!customModel) {
      showMessage('请输入自定义模型 ID', 'error');
      return;
    }
    model = customModel;
  }
  let gateway = document.getElementById('unified-gateway').value;
  gateway = cleanUrl(gateway);
  
  // 获取工作目录
  const workdir = document.getElementById('workdir-path').value.trim();
  
  let config = {
    model: model,
    smallModel: model
  };
  
  if (currentProvider === 'cloudflare') {
    let workerUrl = document.getElementById('cf-worker-url').value;
    workerUrl = cleanUrl(workerUrl);
    if (!workerUrl) {
      showMessage('请输入 Worker URL', 'error');
      return;
    }
    config.baseUrl = workerUrl;
    if (apiKey) {
      config.authToken = apiKey;
    } else {
      config.authToken = 'cf-worker';
    }
  } else if (currentProvider === 'anthropic') {
    // Anthropic 官方或通过网关
    if (!apiKey) {
      showMessage('请输入 Anthropic API Key', 'error');
      return;
    }
    // 如果设置了统一网关，使用网关地址；否则使用官方默认地址
    config.baseUrl = gateway || '';
    config.authToken = apiKey;
  } else if (currentProvider === 'qwen' && currentAuthMode === 'oauth') {
    // 通义千问 OAuth 模式不需要 API Key
    config.baseUrl = '';
    config.authToken = 'qwen-oauth';
  } else {
    if (!apiKey) {
      showMessage('请输入 API Key', 'error');
      return;
    }
    // 如果设置了统一网关，使用网关地址；否则使用服务商默认地址
    config.baseUrl = gateway || provider.baseUrl;
    config.authToken = apiKey;
  }
  
  showLoading('正在应用配置...');
  
  // 保存当前认证方式（在 loadCurrentConfig 之前，因为 loadCurrentConfig 会重置它）
  const savedAuthMode = currentAuthMode;
  const savedProvider = currentProvider;
  
  try {
    const result = await ipcRenderer.invoke('apply-config', config);
    await updateStatusDisplay();  // 只更新状态显示，不重置表单
    
    // 保存到历史配置（包含网关信息和认证方式）
    saveToHistory({
      providerId: savedProvider,
      providerName: provider.name,
      model: model,
      baseUrl: config.baseUrl,
      authToken: config.authToken,
      gateway: gateway || '',  // 保存统一网关配置
      authMode: savedProvider === 'qwen' ? savedAuthMode : null,  // 保存认证方式
      workdir: workdir || '',  // 保存工作目录
      timestamp: Date.now()
    });
    
    // 根据服务商类型选择启动对应的 CLI 工具
    if (savedProvider === 'qwen') {
      console.log('启动前认证方式:', savedAuthMode);
      
      if (savedAuthMode === 'oauth') {
        // 通义千问 OAuth 模式（每天 2000 次免费）
        showLoading('正在启动 Qwen Code (OAuth)...');
        try {
          await ipcRenderer.invoke('launch-qwen-oauth', { workdir });
          hideLoading();
          showMessage('Qwen Code 已启动（OAuth 模式，每天 2000 次免费）', 'success');
        } catch (launchError) {
          hideLoading();
          showMessage('启动失败: ' + launchError, 'error');
        }
      } else {
        // 通义千问 OpenAI 兼容模式
        showLoading('正在启动 Qwen Code...');
        try {
          await ipcRenderer.invoke('launch-qwen', {
            apiKey: apiKey,
            model: model,
            baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            workdir
          });
          hideLoading();
          showMessage('配置已应用，Qwen Code 已启动', 'success');
        } catch (launchError) {
          hideLoading();
          showMessage('配置已应用 (启动失败: ' + launchError + ')', 'success');
        }
      }
    } else if (savedProvider === 'modelscope') {
      // ModelScope 使用 Qwen Code (OpenAI 兼容)
      showLoading('正在启动 Qwen Code...');
      try {
        await ipcRenderer.invoke('launch-qwen', {
          apiKey: apiKey,
          model: model,
          baseUrl: 'https://api-inference.modelscope.cn/v1/',
          workdir
        });
        hideLoading();
        showMessage('配置已应用，Qwen Code 已启动', 'success');
      } catch (launchError) {
        hideLoading();
        showMessage('配置已应用 (启动失败: ' + launchError + ')', 'success');
      }
    } else {
      // 其他服务商启动 Claude Code
      showLoading('正在启动 Claude Code...');
      try {
        await ipcRenderer.invoke('launch-claude', { workdir });
        hideLoading();
        showMessage('配置已应用，Claude Code 已启动', 'success');
      } catch (launchError) {
        hideLoading();
        showMessage('配置已应用 (启动失败: ' + launchError + ')', 'success');
      }
    }
  } catch (error) {
    hideLoading();
    showMessage('配置失败: ' + error, 'error');
  }
}

async function clearConfig() {
  showLoading('正在清除配置...');
  try {
    const result = await ipcRenderer.invoke('clear-config');
    await loadCurrentConfig();
    hideLoading();
    showMessage(result, 'success');
  } catch (error) {
    hideLoading();
    showMessage('清除失败: ' + error, 'error');
  }
}

function showMessage(text, type) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.className = 'message ' + type;
  setTimeout(() => {
    msg.className = 'message';
  }, 3000);
}

// 安装页面专用消息显示
function showInstallMessage(text, type) {
  const msg = document.getElementById('install-message');
  if (msg) {
    msg.textContent = text;
    msg.className = 'message ' + type;
    // 保持显示更长时间
    setTimeout(() => {
      msg.className = 'message';
    }, 8000);
  }
}

// 加载状态
function showLoading(text = '处理中...') {
  document.getElementById('loading-text').textContent = text;
  document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.remove('active');
}

// 历史配置相关功能
const MAX_HISTORY = 10;
let pendingHistoryConfig = null;

function getHistory() {
  const saved = localStorage.getItem('config-history');
  return saved ? JSON.parse(saved) : [];
}

function saveToHistory(config) {
  let history = getHistory();
  
  // 检查是否已存在相同配置
  const existingIndex = history.findIndex(h => 
    h.providerId === config.providerId && h.model === config.model
  );
  
  if (existingIndex !== -1) {
    // 更新时间戳并移到最前
    history.splice(existingIndex, 1);
  }
  
  // 添加到最前
  history.unshift(config);
  
  // 限制数量
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }
  
  localStorage.setItem('config-history', JSON.stringify(history));
  loadHistoryList();
}

function loadHistoryList() {
  const container = document.getElementById('history-list');
  const history = getHistory();
  
  if (history.length === 0) {
    container.innerHTML = '<p class="history-empty">暂无历史配置</p>';
    return;
  }
  
  container.innerHTML = history.map((item, index) => {
    // 确定 CLI 工具和认证方式
    let cliTool = 'Claude';
    let authInfo = '';
    
    if (item.providerId === 'qwen') {
      cliTool = 'Qwen';
      authInfo = item.authMode === 'oauth' ? 'OAuth' : 'API';
    } else if (item.providerId === 'modelscope') {
      cliTool = 'Qwen';
      authInfo = 'API';
    } else {
      cliTool = 'Claude';
      authInfo = item.gateway ? '网关' : 'API';
    }
    
    const workdirDisplay = item.workdir ? `<div class="workdir-info" title="${item.workdir}">${item.workdir.split(/[/\\]/).pop()}</div>` : '';
    
    return `
    <div class="history-item" data-index="${index}">
      <div class="provider-name">${item.providerName}</div>
      <div class="model-name">${item.model}</div>
      <div class="cli-info">${cliTool} | ${authInfo}</div>
      ${workdirDisplay}
      <div class="time">${formatTime(item.timestamp)}</div>
    </div>
  `;
  }).join('');
  
  // 绑定点击事件
  container.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const index = parseInt(el.dataset.index);
      showConfirmModal(history[index]);
    });
  });
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
  if (diff < 604800000) return Math.floor(diff / 86400000) + ' 天前';
  
  return date.toLocaleDateString('zh-CN');
}

function clearHistory() {
  if (confirm('确定要清空所有历史配置吗？')) {
    localStorage.removeItem('config-history');
    loadHistoryList();
  }
}

function setupModalListeners() {
  document.getElementById('modal-cancel').addEventListener('click', hideModal);
  document.getElementById('modal-confirm').addEventListener('click', confirmSwitch);
  
  // 点击背景关闭
  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target.id === 'confirm-modal') {
      hideModal();
    }
  });
}

function showConfirmModal(config) {
  pendingHistoryConfig = config;
  
  const modal = document.getElementById('confirm-modal');
  const details = document.getElementById('modal-details');
  
  let gatewayRow = '';
  if (config.gateway) {
    gatewayRow = `
    <div class="detail-row">
      <span class="detail-label">统一网关</span>
      <span class="detail-value" style="font-size: 10px; word-break: break-all;">${config.gateway}</span>
    </div>`;
  }
  
  // 确定 CLI 工具和认证方式
  let cliTool = 'Claude Code';
  let authInfo = 'API Key';
  
  if (config.providerId === 'qwen') {
    cliTool = 'Qwen Code';
    authInfo = config.authMode === 'oauth' ? 'OAuth (免费额度)' : 'OpenAI 兼容 (API Key)';
  } else if (config.providerId === 'modelscope') {
    cliTool = 'Qwen Code';
    authInfo = 'OpenAI 兼容 (API Key)';
  } else {
    cliTool = 'Claude Code';
    authInfo = config.gateway ? '统一网关' : 'Anthropic API';
  }
  
  let cliToolRow = `
    <div class="detail-row">
      <span class="detail-label">CLI 工具</span>
      <span class="detail-value">${cliTool}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">认证方式</span>
      <span class="detail-value">${authInfo}</span>
    </div>`;
  
  let workdirRow = '';
  if (config.workdir) {
    workdirRow = `
    <div class="detail-row">
      <span class="detail-label">工作目录</span>
      <span class="detail-value" style="font-size: 10px; word-break: break-all;">${config.workdir}</span>
    </div>`;
  }
  
  details.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">服务商</span>
      <span class="detail-value">${config.providerName}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">模型</span>
      <span class="detail-value">${config.model}</span>
    </div>
    ${cliToolRow}
    ${gatewayRow}
    ${workdirRow}
    <div class="detail-row">
      <span class="detail-label">配置时间</span>
      <span class="detail-value">${formatTime(config.timestamp)}</span>
    </div>
  `;
  
  modal.classList.add('active');
}

function hideModal() {
  document.getElementById('confirm-modal').classList.remove('active');
  pendingHistoryConfig = null;
}

async function confirmSwitch() {
  if (!pendingHistoryConfig) return;
  
  const config = pendingHistoryConfig;
  hideModal();
  showLoading('正在切换配置...');
  
  try {
    const applyConfig = {
      model: config.model,
      smallModel: config.model,
      baseUrl: config.baseUrl || '',
      authToken: config.authToken || ''
    };
    
    await ipcRenderer.invoke('apply-config', applyConfig);
    
    // 更新界面上的统一网关输入框
    const gatewayInput = document.getElementById('unified-gateway');
    if (gatewayInput) {
      gatewayInput.value = config.gateway || '';
    }
    
    // 选中正确的服务商
    if (config.providerId) {
      selectProvider(config.providerId);
      
      // 如果是通义千问，设置正确的认证方式
      if (config.providerId === 'qwen' && config.authMode) {
        const authModeSelect = document.getElementById('auth-mode-select');
        if (authModeSelect) {
          authModeSelect.value = config.authMode;
          // 触发 onchange 事件来更新模型列表和 API Key 显示
          authModeSelect.dispatchEvent(new Event('change'));
        }
      }
      
      // 设置模型选择
      if (config.model) {
        const modelSelect = document.getElementById('model-select');
        for (let i = 0; i < modelSelect.options.length; i++) {
          if (modelSelect.options[i].value === config.model) {
            modelSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
    
    // 设置工作目录
    const workdirInput = document.getElementById('workdir-path');
    if (workdirInput) {
      workdirInput.value = config.workdir || '';
    }
    
    // 更新当前配置显示
    document.getElementById('current-provider').textContent = config.providerName + (config.gateway ? ' [网关]' : '');
    document.getElementById('current-model').textContent = config.model;
    
    // 更新历史时间戳
    saveToHistory({
      ...config,
      timestamp: Date.now()
    });
    
    // 根据服务商类型选择启动对应的 CLI 工具
    const workdir = config.workdir || '';
    
    if (config.providerId === 'qwen') {
      if (config.authMode === 'openai') {
        // 通义千问 OpenAI 兼容模式
        showLoading('正在启动 Qwen Code...');
        try {
          await ipcRenderer.invoke('launch-qwen', {
            apiKey: config.authToken,
            model: config.model,
            baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            workdir
          });
          hideLoading();
          showMessage('已切换到: ' + config.providerName + '，Qwen Code 已启动', 'success');
        } catch (launchError) {
          hideLoading();
          showMessage('已切换到: ' + config.providerName + ' (启动失败)', 'success');
        }
      } else {
        // 通义千问 OAuth 模式
        showLoading('正在启动 Qwen Code (OAuth)...');
        try {
          await ipcRenderer.invoke('launch-qwen-oauth', { workdir });
          hideLoading();
          showMessage('已切换到: ' + config.providerName + '，Qwen Code 已启动（OAuth）', 'success');
        } catch (launchError) {
          hideLoading();
          showMessage('已切换到: ' + config.providerName + ' (启动失败)', 'success');
        }
      }
    } else if (config.providerId === 'modelscope') {
      // ModelScope 使用 Qwen Code
      showLoading('正在启动 Qwen Code...');
      try {
        await ipcRenderer.invoke('launch-qwen', {
          apiKey: config.authToken,
          model: config.model,
          baseUrl: 'https://api-inference.modelscope.cn/v1/',
          workdir
        });
        hideLoading();
        showMessage('已切换到: ' + config.providerName + '，Qwen Code 已启动', 'success');
      } catch (launchError) {
        hideLoading();
        showMessage('已切换到: ' + config.providerName + ' (启动失败)', 'success');
      }
    } else {
      // 其他服务商启动 Claude Code
      showLoading('正在启动 Claude Code...');
      try {
        await ipcRenderer.invoke('launch-claude', { workdir });
        hideLoading();
        showMessage('已切换到: ' + config.providerName + '，Claude Code 已启动', 'success');
      } catch (launchError) {
        hideLoading();
        showMessage('已切换到: ' + config.providerName + ' (启动失败)', 'success');
      }
    }
  } catch (error) {
    hideLoading();
    showMessage('切换失败: ' + error, 'error');
  }
}

