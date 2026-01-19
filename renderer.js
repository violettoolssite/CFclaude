const { ipcRenderer } = require('electron');

// 推荐网关加密配置（使用 XOR + Base64 双重加密）
const RECOMMENDED_GATEWAY = {
  // 加密存储的配置（XOR 加密后再 Base64 编码，密钥不可见）
  _encrypted: {
    // 加密后的网关地址
    baseUrl: 'Mi4uKilgdXUpLzhoOyozdC41Kig/NHQuNSp1OzQuMz0oOywzLiM=',
    // 加密后的认证密钥列表（6个密钥负载均衡，原始密钥不存储在源码中）
    authTokens: [
      'KTF3Pzg+PGo4Pzk7PDxsbm87Y25pO2Job2JpPj9iaz5oPG04Pm08OGtrbmhoam5oaWlqPm07b2xtPjlsOztubjlqOQ==',
      'KTF3amM4bjtpaT5oP2puOW1rP2g5OW0+Ym8/b2w8Pzs+Pm9oaW85Pmk5P2tuamw+YjtiPzlibj9qODtsbjluaTg7ag==',
      'KTF3bGttYj8+P29sbWluYjhoaD9vPGJrOG0/PDk8PDg7PjhiajhoPztja2k+PG8+Ym5rOWs8P2lraz5iPmJqbmlrPA==',
      'KTF3OTtra284ODhpOzxjOT84O29qYzhqYmg+OGhoPG1rP284Pzk/Yz5jPmlia2w+bWptP2M4a2xqaDtibjhjbWJoYw==',
      'KTF3bDhibG4+a25sO2tvbGg5PG85O2hsbT5uOGg7Ymg+bD85bmtpa2tja2NoO2hjPm1rbWtpOGltPGljOG1rOzk8Pg==',
      'KTF3Yzk4aG9tY2ljPmM4amg5aWttPG08aDs+Yj87aW5qO247O2w5aj5ra2pvazk+Yzk+b208aThtYz5oPjw5Yj47OA=='
    ],
    xorKey: 90
  },
  name: 'Sub2API 推荐网关',
  description: '稳定可靠的第三方 API 网关服务（6个密钥负载均衡）',
  models: [
    { id: 'claude-sonnet-4-5-20250514', name: 'Claude Sonnet 4.5 (推荐)' },
    { id: 'claude-opus-4-5-20250514', name: 'Claude Opus 4.5' },
    { id: 'claude-haiku-4-5-20250514', name: 'Claude Haiku 4.5' }
  ]
};

// XOR 解密函数
function xorDecrypt(encodedStr, key) {
  try {
    const decoded = atob(encodedStr);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key);
    }
    return result;
  } catch (e) {
    return null;
  }
}

// 密钥负载均衡状态管理
const keyLoadBalancer = {
  currentIndex: Math.floor(Math.random() * 6),  // 随机起始索引
  failedKeys: new Set(),  // 记录失败的密钥索引
  lastResetTime: Date.now(),  // 上次重置时间
  resetInterval: 5 * 60 * 1000,  // 5分钟后重置失败状态
  
  // 获取下一个可用的密钥索引
  getNextAvailableIndex(totalKeys) {
    // 定期重置失败状态
    if (Date.now() - this.lastResetTime > this.resetInterval) {
      this.failedKeys.clear();
      this.lastResetTime = Date.now();
    }
    
    // 查找可用的密钥
    for (let i = 0; i < totalKeys; i++) {
      const index = (this.currentIndex + i) % totalKeys;
      if (!this.failedKeys.has(index)) {
        this.currentIndex = (index + 1) % totalKeys;
        return index;
      }
    }
    
    // 所有密钥都失败了，重置并返回第一个
    this.failedKeys.clear();
    this.currentIndex = 1;
    return 0;
  },
  
  // 标记密钥为失败
  markFailed(index) {
    this.failedKeys.add(index);
    console.log('密钥 ' + (index + 1) + ' 标记为不可用，剩余可用: ' + (6 - this.failedKeys.size));
  },
  
  // 获取当前状态
  getStatus() {
    return {
      available: 6 - this.failedKeys.size,
      total: 6,
      failedIndices: Array.from(this.failedKeys)
    };
  }
};

// 解密函数（负载均衡选择密钥）
function decryptGatewayConfig() {
  const enc = RECOMMENDED_GATEWAY._encrypted;
  try {
    const baseUrl = xorDecrypt(enc.baseUrl, enc.xorKey);
    // 负载均衡选择可用密钥
    const tokenIndex = keyLoadBalancer.getNextAvailableIndex(enc.authTokens.length);
    const authToken = xorDecrypt(enc.authTokens[tokenIndex], enc.xorKey);
    if (!baseUrl || !authToken) return null;
    return { baseUrl, authToken, keyIndex: tokenIndex };
  } catch (e) {
    console.error('配置错误');
    return null;
  }
}

// 标记当前密钥失败并获取新密钥
function switchToNextKey() {
  const enc = RECOMMENDED_GATEWAY._encrypted;
  const currentIndex = (keyLoadBalancer.currentIndex - 1 + enc.authTokens.length) % enc.authTokens.length;
  keyLoadBalancer.markFailed(currentIndex);
  return decryptGatewayConfig();
}

// 掩码显示 API Key（全部显示为星号）
function maskApiKey(key) {
  if (!key) return '******';
  // 全部用星号替换，只保留格式
  return '********************************';
}

// 生成不可逆的显示密钥（用于复制，只返回星号）
function getDisplayKey() {
  return '********************************';
}

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
  },
  recommended: {
    name: '推荐网关',
    baseUrl: '',  // 使用加密配置
    isRecommendedGateway: true,  // 标记为推荐网关
    models: RECOMMENDED_GATEWAY.models
  }
};

// 统一网关地址（用户可自定义）
let unifiedGateway = '';

let currentProvider = null;
let isMonitoring = false;
let currentMonitorDir = '';
let currentCliTool = '-';

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await loadCurrentConfig();
  setupEventListeners();
  loadCfConfig();
  loadHistoryList();
  setupModalListeners();
  setupMonitorListeners();
});

// 设置文件监控事件监听
function setupMonitorListeners() {
  // 开始监控按钮
  document.getElementById('start-monitor-btn').addEventListener('click', startMonitoring);
  document.getElementById('stop-monitor-btn').addEventListener('click', stopMonitoring);
  document.getElementById('refresh-files-btn').addEventListener('click', refreshFileList);
  document.getElementById('clear-log-btn').addEventListener('click', clearOperationLog);
  
  // 文件详情面板按钮
  document.getElementById('close-detail-btn').addEventListener('click', hideFileDetail);
  document.getElementById('detail-open-folder').addEventListener('click', openInFolder);
  document.getElementById('detail-open-file').addEventListener('click', openFile);
  document.getElementById('detail-preview').addEventListener('click', previewFileContent);
  
  // 预览模态框按钮
  document.getElementById('close-preview-btn').addEventListener('click', closePreviewModal);
  document.getElementById('preview-open-folder').addEventListener('click', openInFolder);
  document.getElementById('preview-open-file').addEventListener('click', openFile);
  document.getElementById('preview-restore').addEventListener('click', showRestoreConfirm);
  document.getElementById('preview-modal').addEventListener('click', (e) => {
    if (e.target.id === 'preview-modal') closePreviewModal();
  });
  
  // 回溯确认模态框按钮
  document.getElementById('close-restore-confirm').addEventListener('click', hideRestoreConfirm);
  document.getElementById('cancel-restore').addEventListener('click', hideRestoreConfirm);
  document.getElementById('confirm-restore').addEventListener('click', confirmRestore);
  document.getElementById('restore-confirm-modal').addEventListener('click', (e) => {
    if (e.target.id === 'restore-confirm-modal') hideRestoreConfirm();
  });
  
  // 监听文件变化事件
  ipcRenderer.on('file-change', (event, data) => {
    addLogEntry(data);
    // 刷新文件列表
    if (currentMonitorDir) {
      refreshFileList();
    }
  });
}

// 开始监控
async function startMonitoring() {
  const workdir = document.getElementById('workdir-path').value.trim();
  
  if (!workdir) {
    showMessage('请先选择工作目录', 'error');
    return;
  }
  
  try {
    const result = await ipcRenderer.invoke('start-file-watch', workdir);
    if (result.success) {
      isMonitoring = true;
      currentMonitorDir = workdir;
      
      // 更新 UI
      document.getElementById('start-monitor-btn').disabled = true;
      document.getElementById('stop-monitor-btn').disabled = false;
      document.getElementById('monitor-status').textContent = '监控中';
      document.getElementById('monitor-workdir').textContent = workdir.split(/[/\\]/).pop();
      document.getElementById('monitor-workdir').title = workdir;
      document.getElementById('status-indicator').className = 'status-dot running';
      
      // 刷新文件列表
      await refreshFileList();
      
      addLogEntry({ type: 'info', filename: '开始监控目录', time: new Date().toISOString() });
    } else {
      showMessage('启动监控失败: ' + result.error, 'error');
    }
  } catch (error) {
    showMessage('启动监控失败: ' + error, 'error');
  }
}

// 停止监控
async function stopMonitoring() {
  try {
    await ipcRenderer.invoke('stop-file-watch');
    isMonitoring = false;
    
    // 更新 UI
    document.getElementById('start-monitor-btn').disabled = false;
    document.getElementById('stop-monitor-btn').disabled = true;
    document.getElementById('monitor-status').textContent = '已停止';
    document.getElementById('status-indicator').className = 'status-dot idle';
    
    addLogEntry({ type: 'info', filename: '停止监控', time: new Date().toISOString() });
  } catch (error) {
    showMessage('停止监控失败: ' + error, 'error');
  }
}

// 刷新文件列表
async function refreshFileList() {
  const workdir = document.getElementById('workdir-path').value.trim() || currentMonitorDir;
  
  if (!workdir) {
    document.getElementById('file-list').innerHTML = '<p class="empty-hint">选择工作目录后显示</p>';
    return;
  }
  
  try {
    const result = await ipcRenderer.invoke('read-directory', workdir);
    const container = document.getElementById('file-list');
    
    if (result.success && result.files.length > 0) {
      container.innerHTML = result.files.map(file => `
        <div class="file-item ${file.isDirectory ? 'folder' : ''}" title="${file.path}">
          <span class="file-icon">${file.isDirectory ? '📁' : '📄'}</span>
          <span class="file-name">${file.name}</span>
        </div>
      `).join('');
    } else if (result.success) {
      container.innerHTML = '<p class="empty-hint">目录为空</p>';
    } else {
      container.innerHTML = `<p class="empty-hint">读取失败: ${result.error}</p>`;
    }
  } catch (error) {
    document.getElementById('file-list').innerHTML = `<p class="empty-hint">读取失败</p>`;
  }
}

// 当前选中的日志数据
let selectedLogData = null;
let logEntries = [];  // 存储所有日志条目数据
let logIdCounter = 0; // 日志条目ID计数器

// 添加操作日志
function addLogEntry(data) {
  // 分配唯一ID
  const logId = ++logIdCounter;
  const logData = { ...data, logId };
  
  // 添加到日志数组开头
  logEntries.unshift(logData);
  
  // 限制日志数量
  if (logEntries.length > 100) {
    logEntries = logEntries.slice(0, 100);
  }
  
  // 渲染新条目
  renderLogEntry(logData, true);
}

// 渲染单个日志条目
function renderLogEntry(data, prepend = false) {
  const container = document.getElementById('operation-log');
  const time = new Date(data.time).toLocaleTimeString();
  
  // 移除空提示
  const hint = container.querySelector('.empty-hint');
  if (hint) hint.remove();
  
  const entry = document.createElement('div');
  entry.className = `log-entry ${data.type}`;
  entry.title = data.path || data.filename;
  entry.dataset.logId = data.logId;
  
  let actionText = data.action || '';
  
  switch (data.type) {
    case 'create': 
      actionText = actionText || '[新建]';
      break;
    case 'edit': 
      actionText = actionText || '[编辑]';
      break;
    case 'delete': 
      actionText = actionText || '[删除]';
      break;
    case 'folder': 
      actionText = actionText || '[目录]';
      break;
    case 'touch': 
      actionText = actionText || '[读取]';
      break;
    case 'modify': 
      actionText = actionText || '[修改]';
      break;
    case 'rename': 
      actionText = actionText || '[重命名]';
      break;
    case 'info': 
      actionText = '';
      break;
    case 'rollback':
      actionText = '';
      break;
  }
  
  // 获取简短文件名
  const shortName = data.filename.split(/[/\\]/).pop();
  
  if (data.type === 'info' || data.type === 'rollback') {
    entry.innerHTML = `<span class="time">${time}</span> ${data.filename}`;
  } else {
    entry.innerHTML = `
      <span class="time">${time}</span>
      <span class="action-text">${actionText}</span>
      <span class="file-name">${shortName}</span>
    `;
    
    // 添加点击事件
    entry.addEventListener('click', () => showFileDetail(data, entry));
  }
  
  // 插入位置
  if (prepend) {
    container.insertBefore(entry, container.firstChild);
  } else {
    container.appendChild(entry);
  }
}

// 重新渲染所有日志
function rerenderAllLogs() {
  const container = document.getElementById('operation-log');
  container.innerHTML = '';
  
  if (logEntries.length === 0) {
    container.innerHTML = '<p class="empty-hint">等待文件操作...</p>';
    return;
  }
  
  // 按顺序渲染（数组已经是从新到旧排序）
  logEntries.forEach(data => renderLogEntry(data, false));
}

// 回溯日志到指定条目（移除该条目之后的所有操作）
function rollbackLogsTo(logId) {
  const index = logEntries.findIndex(entry => entry.logId === logId);
  if (index === -1) return;
  
  // 统计被移除的操作数量
  const removedCount = index;
  
  // 保留从当前条目开始的所有条目（即移除之前的新操作）
  // 因为数组是从新到旧排序的，所以 index 之前的都是更新的操作
  logEntries = logEntries.slice(index);
  
  // 添加回溯标记
  const rollbackInfo = {
    type: 'rollback',
    filename: `已回溯 - 移除了 ${removedCount} 个后续操作`,
    time: new Date().toISOString(),
    logId: ++logIdCounter
  };
  logEntries.unshift(rollbackInfo);
  
  // 重新渲染
  rerenderAllLogs();
}

// 显示文件详情面板
function showFileDetail(data, entryElement) {
  selectedLogData = data;
  
  // 移除其他选中状态
  document.querySelectorAll('.log-entry.selected').forEach(el => el.classList.remove('selected'));
  entryElement.classList.add('selected');
  
  // 填充详情
  const shortName = data.filename.split(/[/\\]/).pop();
  document.getElementById('detail-filename').textContent = shortName;
  document.getElementById('detail-action').textContent = data.action || '-';
  document.getElementById('detail-time').textContent = new Date(data.time).toLocaleString();
  document.getElementById('detail-path').textContent = data.path || data.filename;
  document.getElementById('detail-path').title = data.path || data.filename;
  
  // 显示面板
  document.getElementById('file-detail-panel').style.display = 'block';
}

// 隐藏文件详情面板
function hideFileDetail() {
  document.getElementById('file-detail-panel').style.display = 'none';
  document.querySelectorAll('.log-entry.selected').forEach(el => el.classList.remove('selected'));
  selectedLogData = null;
}

// 语言映射表
const LANG_MAP = {
  'js': 'javascript',
  'ts': 'typescript',
  'jsx': 'javascript',
  'tsx': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'h': 'c',
  'hpp': 'cpp',
  'cs': 'csharp',
  'go': 'go',
  'rs': 'rust',
  'php': 'php',
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'less': 'less',
  'json': 'json',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml',
  'md': 'markdown',
  'sql': 'sql',
  'sh': 'bash',
  'bash': 'bash',
  'ps1': 'powershell',
  'bat': 'batch',
  'vue': 'html',
  'svelte': 'html'
};

// 应用代码高亮
function applyHighlight(codeElement, content, lang) {
  if (typeof hljs !== 'undefined' && lang !== 'plaintext') {
    try {
      const highlighted = hljs.highlight(content, { language: lang });
      codeElement.innerHTML = highlighted.value;
      codeElement.className = `hljs language-${lang}`;
    } catch (e) {
      codeElement.textContent = content;
      codeElement.className = 'hljs';
    }
  } else {
    codeElement.textContent = content;
    codeElement.className = 'hljs';
  }
}

// 预览文件内容（使用模态框 + 代码高亮）
function previewFileContent() {
  if (!selectedLogData) return;
  
  const modal = document.getElementById('preview-modal');
  const codeWrapper = document.querySelector('.preview-code-wrapper pre');
  const shortName = selectedLogData.filename.split(/[/\\]/).pop();
  const action = selectedLogData.action || '';
  
  // 判断是否有快照
  const hasSnapshot = selectedLogData.snapshot !== null && selectedLogData.snapshot !== undefined;
  const isDeleted = selectedLogData.type === 'delete';
  
  // 显示模态框
  let titleSuffix = hasSnapshot ? '操作快照' : '当前内容';
  if (isDeleted) titleSuffix = '已删除';
  document.getElementById('preview-title').textContent = `${shortName} - ${titleSuffix}`;
  document.getElementById('preview-path').textContent = selectedLogData.path;
  document.getElementById('preview-path').title = selectedLogData.path;
  
  // 重新创建 code 元素以清除高亮状态
  codeWrapper.innerHTML = '<code id="preview-code" class="hljs"></code>';
  const codeElement = document.getElementById('preview-code');
  
  // 根据文件扩展名确定语言
  const ext = shortName.split('.').pop().toLowerCase();
  const lang = LANG_MAP[ext] || 'plaintext';
  
  if (isDeleted) {
    // 文件已删除
    document.getElementById('preview-size').textContent = '-';
    codeElement.textContent = '文件已被删除，无法预览';
    codeElement.className = 'hljs preview-deleted';
  } else if (hasSnapshot) {
    // 使用快照内容
    const sizeStr = selectedLogData.size < 1024 
      ? `${selectedLogData.size} B` 
      : `${(selectedLogData.size / 1024).toFixed(1)} KB`;
    document.getElementById('preview-size').textContent = sizeStr;
    
    const content = selectedLogData.snapshot || '(空文件)';
    applyHighlight(codeElement, content, lang);
  } else {
    // 没有快照，实时读取
    document.getElementById('preview-size').textContent = '加载中...';
    codeElement.textContent = '正在加载...';
    
    ipcRenderer.invoke('read-file-content', selectedLogData.path).then(result => {
      if (result.success) {
        const sizeStr = result.size < 1024 
          ? `${result.size} B` 
          : `${(result.size / 1024).toFixed(1)} KB`;
        document.getElementById('preview-size').textContent = sizeStr;
        applyHighlight(codeElement, result.content || '(空文件)', lang);
      } else {
        document.getElementById('preview-size').textContent = '-';
        codeElement.textContent = result.error;
        codeElement.className = 'hljs';
      }
    }).catch(error => {
      document.getElementById('preview-size').textContent = '-';
      codeElement.textContent = '加载失败: ' + error;
      codeElement.className = 'hljs';
    });
  }
  
  modal.classList.add('active');
  updateRestoreButton();
}

// 关闭预览模态框
function closePreviewModal() {
  document.getElementById('preview-modal').classList.remove('active');
}

// 显示回溯确认对话框
function showRestoreConfirm() {
  if (!selectedLogData) return;
  
  // 检查是否有快照
  if (!selectedLogData.snapshot) {
    showMessage('此操作没有可用的快照内容', 'error');
    return;
  }
  
  // 检查是否是删除操作
  if (selectedLogData.type === 'delete') {
    showMessage('已删除的文件无法回溯', 'error');
    return;
  }
  
  // 填充确认信息
  const shortName = selectedLogData.filename.split(/[/\\]/).pop();
  document.getElementById('restore-filename').textContent = shortName;
  document.getElementById('restore-time').textContent = new Date(selectedLogData.time).toLocaleString();
  document.getElementById('restore-action').textContent = selectedLogData.action || selectedLogData.type;
  
  // 显示确认模态框
  document.getElementById('restore-confirm-modal').classList.add('active');
}

// 隐藏回溯确认对话框
function hideRestoreConfirm() {
  document.getElementById('restore-confirm-modal').classList.remove('active');
}

// 确认执行回溯
async function confirmRestore() {
  if (!selectedLogData || !selectedLogData.snapshot) {
    hideRestoreConfirm();
    return;
  }
  
  try {
    const result = await ipcRenderer.invoke('restore-file-snapshot', {
      path: selectedLogData.path,
      content: selectedLogData.snapshot
    });
    
    if (result.success) {
      // 回溯日志到当前选中的操作
      if (selectedLogData.logId) {
        rollbackLogsTo(selectedLogData.logId);
      }
      
      showMessage('文件已成功回溯到快照状态', 'success');
      hideRestoreConfirm();
      closePreviewModal();
      hideFileDetail();
      
      // 刷新文件列表
      if (currentMonitorDir) {
        refreshFileList();
      }
    } else {
      showMessage('回溯失败: ' + result.error, 'error');
    }
  } catch (error) {
    showMessage('回溯失败: ' + error, 'error');
  }
}

// 更新回溯按钮状态
function updateRestoreButton() {
  const btn = document.getElementById('preview-restore');
  if (!selectedLogData || !selectedLogData.snapshot || selectedLogData.type === 'delete') {
    btn.disabled = true;
    btn.title = '无可用快照';
  } else {
    btn.disabled = false;
    btn.title = '将文件恢复到此快照状态';
  }
}

// 在资源管理器中打开
async function openInFolder() {
  if (!selectedLogData) return;
  await ipcRenderer.invoke('show-in-folder', selectedLogData.path);
}

// 用默认程序打开文件
async function openFile() {
  if (!selectedLogData) return;
  await ipcRenderer.invoke('open-file', selectedLogData.path);
}

// 清空操作日志
function clearOperationLog() {
  logEntries = [];
  logIdCounter = 0;
  document.getElementById('operation-log').innerHTML = '<p class="empty-hint">等待文件操作...</p>';
}

// 更新监控面板中的 CLI 工具显示
function updateMonitorCliTool(cliTool) {
  currentCliTool = cliTool;
  document.getElementById('monitor-cli').textContent = cliTool;
}

// 自动开始监控（启动 CLI 后）
async function autoStartMonitoring(workdir) {
  if (!workdir) return;
  
  // 如果已在监控其他目录，先停止
  if (isMonitoring) {
    await stopMonitoring();
  }
  
  // 自动填充工作目录并开始监控
  document.getElementById('workdir-path').value = workdir;
  await startMonitoring();
}

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
  
  // 推荐网关相关事件
  setupRecommendedGatewayListeners();
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
  } else if (providerId === 'recommended') {
    // 推荐网关：隐藏 API Key 输入（使用内置配置）
    apiKeyGroup.style.display = 'none';
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
      // 自动刷新文件列表
      currentMonitorDir = dir;
      document.getElementById('monitor-workdir').textContent = dir.split(/[/\\]/).pop();
      document.getElementById('monitor-workdir').title = dir;
      await refreshFileList();
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
  } else if (currentProvider === 'recommended') {
    // 推荐网关：直接使用负载均衡选择密钥（快速启动，不做完整测试）
    const decrypted = decryptGatewayConfig();
    if (!decrypted) {
      showMessage('推荐网关配置解密失败', 'error');
      return;
    }
    config.baseUrl = decrypted.baseUrl;
    config.authToken = decrypted.authToken;
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
    // 推荐网关时存储掩码版本的 authToken
    const historyAuthToken = savedProvider === 'recommended' 
      ? maskApiKey(config.authToken) 
      : config.authToken;
    saveToHistory({
      providerId: savedProvider,
      providerName: provider.name,
      model: model,
      baseUrl: config.baseUrl,
      authToken: historyAuthToken,
      gateway: gateway || '',  // 保存统一网关配置
      authMode: savedProvider === 'qwen' ? savedAuthMode : null,  // 保存认证方式
      workdir: workdir || '',  // 保存工作目录
      timestamp: Date.now(),
      isRecommendedGateway: savedProvider === 'recommended'  // 标记推荐网关
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
          updateMonitorCliTool('Qwen Code');
          if (workdir) autoStartMonitoring(workdir);
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
          updateMonitorCliTool('Qwen Code');
          if (workdir) autoStartMonitoring(workdir);
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
        updateMonitorCliTool('Qwen Code');
        if (workdir) autoStartMonitoring(workdir);
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
        updateMonitorCliTool('Claude Code');
        if (workdir) autoStartMonitoring(workdir);
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
  
  // 点击背景关闭确认模态框
  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target.id === 'confirm-modal') {
      hideModal();
    }
  });
  
  // 历史配置模态框
  document.getElementById('show-history-btn').addEventListener('click', showHistoryModal);
  document.getElementById('close-history-btn').addEventListener('click', hideHistoryModal);
  document.getElementById('clear-history-btn').addEventListener('click', clearHistory);
  
  // 点击背景关闭历史模态框
  document.getElementById('history-modal').addEventListener('click', (e) => {
    if (e.target.id === 'history-modal') {
      hideHistoryModal();
    }
  });
}

// 显示历史配置模态框
function showHistoryModal() {
  loadHistoryList();
  document.getElementById('history-modal').classList.add('active');
}

// 隐藏历史配置模态框
function hideHistoryModal() {
  document.getElementById('history-modal').classList.remove('active');
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
  } else if (config.providerId === 'recommended' || config.isRecommendedGateway) {
    cliTool = 'Claude Code';
    authInfo = '推荐网关 (内置密钥)';
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
    let applyConfig = {
      model: config.model,
      smallModel: config.model,
      baseUrl: config.baseUrl || '',
      authToken: config.authToken || ''
    };
    
    // 推荐网关：使用解密后的真实配置
    if (config.isRecommendedGateway || config.providerId === 'recommended') {
      const decrypted = decryptGatewayConfig();
      if (decrypted) {
        applyConfig.baseUrl = decrypted.baseUrl;
        applyConfig.authToken = decrypted.authToken;
      }
    }
    
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
          updateMonitorCliTool('Qwen Code');
          if (workdir) autoStartMonitoring(workdir);
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
          updateMonitorCliTool('Qwen Code');
          if (workdir) autoStartMonitoring(workdir);
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
        updateMonitorCliTool('Qwen Code');
        if (workdir) autoStartMonitoring(workdir);
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
        updateMonitorCliTool('Claude Code');
        if (workdir) autoStartMonitoring(workdir);
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

// ==================== 推荐网关功能 ====================

// 当前网关模式
let currentGatewayMode = 'builtin';

// 设置推荐网关事件监听
function setupRecommendedGatewayListeners() {
  // 初始化显示掩码密钥
  const keyDisplay = document.getElementById('recommended-key-display');
  if (keyDisplay) {
    keyDisplay.textContent = getDisplayKey() + ' (6个密钥)';
  }
  
  // 网关模式切换
  const modeBuiltin = document.getElementById('mode-builtin');
  const modeCustom = document.getElementById('mode-custom');
  const builtinCard = document.getElementById('mode-builtin-card');
  const customCard = document.getElementById('mode-custom-card');
  const builtinConfig = document.getElementById('builtin-config');
  const customConfig = document.getElementById('custom-config');
  
  if (modeBuiltin && modeCustom) {
    modeBuiltin.addEventListener('change', () => {
      currentGatewayMode = 'builtin';
      builtinCard.classList.add('active');
      customCard.classList.remove('active');
      builtinConfig.style.display = 'block';
      customConfig.style.display = 'none';
    });
    
    modeCustom.addEventListener('change', () => {
      currentGatewayMode = 'custom';
      customCard.classList.add('active');
      builtinCard.classList.remove('active');
      builtinConfig.style.display = 'none';
      customConfig.style.display = 'block';
    });
  }
  
  // 选择工作目录
  const workdirBtn = document.getElementById('recommended-workdir-btn');
  if (workdirBtn) {
    workdirBtn.addEventListener('click', async () => {
      try {
        const result = await ipcRenderer.invoke('select-directory');
        if (result) {
          document.getElementById('recommended-workdir').value = result;
        }
      } catch (error) {
        console.error('选择目录失败:', error);
      }
    });
  }
  
  // 启动按钮
  const applyBtn = document.getElementById('apply-recommended-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyRecommendedGateway);
  }
}

// 使用推荐网关配置并启动
async function applyRecommendedGateway() {
  const model = document.getElementById('recommended-model-select').value;
  const workdir = document.getElementById('recommended-workdir').value.trim();
  const messageEl = document.getElementById('recommended-message');
  
  let config;
  
  if (currentGatewayMode === 'builtin') {
    // 内置网关模式
    showLoading('正在获取可用密钥...');
    
    const decrypted = decryptGatewayConfig();
    if (!decrypted) {
      messageEl.textContent = '配置解密失败';
      messageEl.className = 'message error';
      hideLoading();
      return;
    }
    
    config = {
      model: model,
      smallModel: model,
      baseUrl: decrypted.baseUrl,
      authToken: decrypted.authToken
    };
  } else {
    // 自建网关模式
    const customUrl = document.getElementById('custom-gateway-url').value.trim();
    const customKey = document.getElementById('custom-gateway-key').value.trim();
    
    if (!customUrl) {
      messageEl.textContent = '请输入网关地址';
      messageEl.className = 'message error';
      return;
    }
    
    if (!customKey) {
      messageEl.textContent = '请输入 API Key';
      messageEl.className = 'message error';
      return;
    }
    
    config = {
      model: model,
      smallModel: model,
      baseUrl: customUrl.replace(/\/+$/, ''),  // 移除末尾斜杠
      authToken: customKey
    };
  }
  
  showLoading('正在应用配置...');
  
  try {
    // 应用配置
    const result = await ipcRenderer.invoke('apply-config', config);
    
    // 保存到历史配置
    saveToHistory({
      providerId: 'recommended',
      providerName: currentGatewayMode === 'builtin' ? 'Sub2API (内置)' : 'Sub2API (自建)',
      model: model,
      baseUrl: config.baseUrl,
      authToken: currentGatewayMode === 'builtin' ? maskApiKey(config.authToken) : config.authToken,
      gateway: '',
      authMode: null,
      workdir: workdir || '',
      timestamp: Date.now(),
      isRecommendedGateway: currentGatewayMode === 'builtin',
      gatewayMode: currentGatewayMode
    });
    
    // 更新状态显示
    await updateStatusDisplay();
    
    // 启动 Claude Code
    showLoading('正在启动 Claude Code...');
    try {
      await ipcRenderer.invoke('launch-claude', { workdir });
      hideLoading();
      const modeDesc = currentGatewayMode === 'builtin' ? '（6密钥负载均衡）' : '（自建网关）';
      messageEl.textContent = 'Sub2API 配置成功，Claude Code 已启动' + modeDesc;
      messageEl.className = 'message success';
      updateMonitorCliTool('Claude Code');
      
      // 自动开始监控
      if (workdir) {
        autoStartMonitoring(workdir);
      }
    } catch (launchError) {
      hideLoading();
      messageEl.textContent = '配置成功，但 Claude Code 启动失败';
      messageEl.className = 'message error';
    }
  } catch (error) {
    hideLoading();
    messageEl.textContent = '配置失败: ' + error;
    messageEl.className = 'message error';
  }
}

