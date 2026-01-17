const { ipcRenderer } = require('electron');

// 提供商配置
const providers = {
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/anthropic',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    defaultModel: 'deepseek-chat',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    apiKeyName: 'DeepSeek API Key',
    needsAccountId: false
  },
  modelscope: {
    name: 'ModelScope 魔塔',
    baseUrl: 'https://api-inference.modelscope.cn',
    models: [
      'Qwen/Qwen2.5-72B-Instruct',
      'Qwen/Qwen2.5-Coder-32B-Instruct',
      'Qwen/Qwen2.5-7B-Instruct',
      'deepseek-ai/DeepSeek-V3'
    ],
    defaultModel: 'Qwen/Qwen2.5-72B-Instruct',
    apiKeyEnv: 'MODELSCOPE_API_KEY',
    apiKeyName: 'ModelScope Access Token',
    needsAccountId: false
  },
  worker: {
    name: 'Cloudflare Worker 代理',
    baseUrlTemplate: '{worker_url}',
    models: [
      '@cf/meta/llama-3-8b-instruct',
      '@cf/meta/llama-3.1-8b-instruct',
      '@cf/meta/llama-2-7b-chat-int8',
      '@cf/mistral/mistral-7b-instruct-v0.2',
      '@cf/thebloke/codellama-7b-instruct-awq',
      '@cf/deepseek-ai/deepseek-math-7b-instruct',
      '@cf/qwen/qwen1.5-14b-chat-awq',
      '@cf/openchat/openchat-3.5-0106',
      '@cf/google/gemma-7b-it'
    ],
    defaultModel: '@cf/meta/llama-3-8b-instruct',
    apiKeyEnv: 'WORKER_API_KEY',
    apiKeyName: 'API Key (可任意填写)',
    needsAccountId: true,
    accountIdEnv: 'WORKER_URL',
    accountIdLabel: 'Worker URL',
    accountIdPlaceholder: 'https://your-worker.workers.dev'
  },
  anthropic: {
    name: 'Anthropic 官方',
    baseUrl: 'https://api.anthropic.com',
    models: [
      'claude-sonnet-4-20250514',
      'claude-opus-4-20250514',
      'claude-3-5-haiku-20241022'
    ],
    defaultModel: 'claude-sonnet-4-20250514',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    apiKeyName: 'Anthropic API Key',
    needsAccountId: false
  }
};

let currentProvider = null;

// 窗口控制
function minimize() {
  ipcRenderer.send('minimize');
}

function closeWin() {
  ipcRenderer.send('close');
}

// 显示 Toast
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => {
    toast.className = 'toast';
  }, 2500);
}

// 加载当前配置
async function loadCurrentConfig() {
  const config = await ipcRenderer.invoke('get-config');
  const statusEl = document.getElementById('current-status');
  
  if (config.baseUrl) {
    let providerName = '未知';
    for (const [key, p] of Object.entries(providers)) {
      if (config.baseUrl === p.baseUrl) {
        providerName = p.name;
        break;
      }
    }
    statusEl.innerHTML = `
      <div>提供商: <strong>${providerName}</strong></div>
      <div style="color: #888; font-size: 13px; margin-top: 4px;">模型: ${config.model || '未设置'}</div>
    `;
  } else {
    statusEl.innerHTML = '<div style="color: #888;">未配置 (使用官方 Anthropic)</div>';
  }
}

// 选择提供商
async function selectProvider(providerId) {
  // 更新 UI
  document.querySelectorAll('.provider-item').forEach(item => {
    item.classList.remove('selected');
  });
  document.querySelector(`[data-provider="${providerId}"]`).classList.add('selected');
  
  currentProvider = providers[providerId];
  currentProvider.id = providerId;
  
  // 显示模型选择
  const modelSection = document.getElementById('model-section');
  const modelSelect = document.getElementById('model-select');
  modelSection.style.display = 'block';
  
  modelSelect.innerHTML = currentProvider.models.map(m => 
    `<option value="${m}" ${m === currentProvider.defaultModel ? 'selected' : ''}>${m}</option>`
  ).join('');
  
  // Account ID / Worker URL
  const accountidSection = document.getElementById('accountid-section');
  const accountidInput = document.getElementById('accountid-input');
  const accountidHint = document.getElementById('accountid-hint');
  const accountidTitle = accountidSection.querySelector('.section-title');
  
  if (currentProvider.needsAccountId) {
    accountidSection.style.display = 'block';
    accountidTitle.textContent = currentProvider.accountIdLabel || 'Account ID';
    accountidInput.placeholder = currentProvider.accountIdPlaceholder || '输入 Account ID';
    
    const savedAccountId = await ipcRenderer.invoke('get-api-key', currentProvider.accountIdEnv);
    if (savedAccountId) {
      accountidInput.value = savedAccountId;
      accountidHint.textContent = '已检测到保存的配置';
    } else {
      accountidInput.value = '';
      accountidHint.textContent = '';
    }
  } else {
    accountidSection.style.display = 'none';
    accountidInput.value = '';
  }
  
  // 显示 API Key 输入
  const apikeySection = document.getElementById('apikey-section');
  const apikeyInput = document.getElementById('apikey-input');
  const apikeyHint = document.getElementById('apikey-hint');
  apikeySection.style.display = 'block';
  apikeyInput.placeholder = `输入 ${currentProvider.apiKeyName}`;
  
  // 检查是否有已保存的 Key
  const savedKey = await ipcRenderer.invoke('get-api-key', currentProvider.apiKeyEnv);
  if (savedKey) {
    apikeyInput.value = savedKey;
    apikeyHint.textContent = '已检测到保存的密钥';
  } else {
    apikeyInput.value = '';
    apikeyHint.textContent = '';
  }
  
  // 启用应用按钮
  updateApplyButton();
}

// 更新应用按钮状态
function updateApplyButton() {
  const btn = document.getElementById('apply-btn');
  const apikey = document.getElementById('apikey-input').value;
  const accountid = document.getElementById('accountid-input').value;
  
  if (!currentProvider || !apikey.trim()) {
    btn.disabled = true;
    return;
  }
  
  if (currentProvider.needsAccountId && !accountid.trim()) {
    btn.disabled = true;
    return;
  }
  
  btn.disabled = false;
}

// 应用配置
async function applyConfig() {
  if (!currentProvider) return;
  
  const model = document.getElementById('model-select').value;
  const apiKey = document.getElementById('apikey-input').value.trim();
  const accountId = document.getElementById('accountid-input').value.trim();
  
  if (!apiKey) {
    showToast('请输入 API 密钥', 'error');
    return;
  }
  
  if (currentProvider.needsAccountId && !accountId) {
    showToast('请输入 Account ID', 'error');
    return;
  }
  
  // 计算 baseUrl
  let baseUrl = currentProvider.baseUrl;
  if (currentProvider.baseUrlTemplate) {
    // 清理用户输入的 URL：移除末尾斜杠和多余的路径
    let cleanUrl = accountId.trim()
      .replace(/\/+$/, '')  // 移除末尾斜杠
      .replace(/\/v1\/?$/, ''); // 移除末尾的 /v1
    
    baseUrl = currentProvider.baseUrlTemplate
      .replace('{account_id}', cleanUrl)
      .replace('{worker_url}', cleanUrl);
  }
  
  const btn = document.getElementById('apply-btn');
  btn.disabled = true;
  btn.textContent = '应用中...';
  
  try {
    const success = await ipcRenderer.invoke('set-config', {
      baseUrl: baseUrl,
      model: model,
      apiKey: apiKey,
      apiKeyEnv: currentProvider.apiKeyEnv,
      accountId: accountId,
      accountIdEnv: currentProvider.accountIdEnv
    });
    
    if (success) {
      showToast('配置成功！请重启终端后运行 claude', 'success');
      loadCurrentConfig();
    } else {
      showToast('配置失败', 'error');
    }
  } catch (err) {
    showToast('配置失败: ' + err.message, 'error');
  }
  
  btn.disabled = false;
  btn.textContent = '应用配置';
}

// 清除配置
async function clearConfig() {
  const success = await ipcRenderer.invoke('clear-config');
  if (success) {
    showToast('配置已清除，恢复官方 Anthropic', 'success');
    loadCurrentConfig();
    
    // 重置 UI
    document.querySelectorAll('.provider-item').forEach(item => {
      item.classList.remove('selected');
    });
    document.getElementById('model-section').style.display = 'none';
    document.getElementById('apikey-section').style.display = 'none';
    document.getElementById('apply-btn').disabled = true;
    currentProvider = null;
  }
}

// 监听输入变化
document.getElementById('apikey-input').addEventListener('input', updateApplyButton);
document.getElementById('accountid-input').addEventListener('input', updateApplyButton);

// 初始化
loadCurrentConfig();

