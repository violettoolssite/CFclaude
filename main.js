const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    resizable: true,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 获取单个环境变量
function getEnvVar(name) {
  return new Promise((resolve) => {
    exec(`powershell -Command "[Environment]::GetEnvironmentVariable('${name}', 'User')"`, (error, stdout) => {
      resolve(error ? '' : stdout.trim());
    });
  });
}

// 选择目录
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: '选择启动目录'
  });
  
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

// 文件监控相关
let fileWatcher = null;
let mainWindowRef = null;

// 获取 mainWindow 引用
app.on('browser-window-created', (event, window) => {
  mainWindowRef = window;
});

// 读取目录文件列表
ipcMain.handle('read-directory', async (event, dirPath) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = items
      .filter(item => !item.name.startsWith('.'))  // 过滤隐藏文件
      .slice(0, 100)  // 限制数量
      .map(item => ({
        name: item.name,
        isDirectory: item.isDirectory(),
        path: path.join(dirPath, item.name)
      }))
      .sort((a, b) => {
        // 目录在前
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
    
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 文件状态缓存（用于检测文件大小变化判断是否为编辑）
let fileStatsCache = new Map();
// 防抖缓存（避免重复事件）
let pendingEvents = new Map();

// 开始监控目录
ipcMain.handle('start-file-watch', async (event, dirPath) => {
  const fs = require('fs');
  const path = require('path');
  
  // 停止之前的监控
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
  }
  
  // 清空缓存
  fileStatsCache.clear();
  pendingEvents.clear();
  
  // 初始化文件状态缓存
  function cacheFileStats(dir) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isFile()) {
          try {
            const stats = fs.statSync(fullPath);
            fileStatsCache.set(fullPath, {
              size: stats.size,
              mtime: stats.mtimeMs
            });
          } catch (e) {}
        } else if (item.isDirectory() && !item.name.startsWith('.')) {
          cacheFileStats(fullPath);
        }
      }
    } catch (e) {}
  }
  cacheFileStats(dirPath);
  
  try {
    // 使用递归监控
    fileWatcher = fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
      if (!filename || filename.startsWith('.') || filename.includes('node_modules')) return;
      
      const fullPath = path.join(dirPath, filename);
      
      // 防抖处理：100ms 内的重复事件合并
      if (pendingEvents.has(fullPath)) {
        clearTimeout(pendingEvents.get(fullPath));
      }
      
      pendingEvents.set(fullPath, setTimeout(() => {
        pendingEvents.delete(fullPath);
        
        let changeType = 'modify';
        let action = '[修改]';
        let isDirectory = false;
        
        try {
          const exists = fs.existsSync(fullPath);
          const cachedStats = fileStatsCache.get(fullPath);
          
          if (!exists) {
            // 文件不存在
            if (cachedStats) {
              // 之前存在，现在不存在 - 删除
              changeType = 'delete';
              action = '[删除]';
              fileStatsCache.delete(fullPath);
            } else {
              // 之前也不存在 - 忽略
              return;
            }
          } else {
            const stats = fs.statSync(fullPath);
            isDirectory = stats.isDirectory();
            
            if (isDirectory) {
              if (!cachedStats) {
                changeType = 'create';
                action = '[新建目录]';
              } else {
                changeType = 'folder';
                action = '[访问目录]';
              }
            } else {
              if (!cachedStats) {
                // 缓存中没有 - 新创建的文件
                changeType = 'create';
                action = '[新建]';
                fileStatsCache.set(fullPath, { size: stats.size, mtime: stats.mtimeMs });
              } else if (stats.size !== cachedStats.size) {
                // 大小改变 - 编辑文件
                changeType = 'edit';
                action = '[编辑]';
                fileStatsCache.set(fullPath, { size: stats.size, mtime: stats.mtimeMs });
              } else if (stats.mtimeMs !== cachedStats.mtime) {
                // 仅时间改变 - 可能是读取
                changeType = 'touch';
                action = '[读取]';
                fileStatsCache.set(fullPath, { size: stats.size, mtime: stats.mtimeMs });
              } else {
                // 没有变化 - 忽略
                return;
              }
            }
          }
        } catch (e) {
          // 访问出错，可能正在被操作，忽略
          return;
        }
        
        // 读取文件内容快照（仅对文件，且非删除操作）
        let snapshot = null;
        let fileSize = 0;
        if (!isDirectory && changeType !== 'delete') {
          try {
            const stats = fs.statSync(fullPath);
            fileSize = stats.size;
            // 限制快照大小为 500KB
            if (fileSize <= 500 * 1024) {
              snapshot = fs.readFileSync(fullPath, 'utf-8');
            } else {
              snapshot = `[文件过大，无法预览快照 (${(fileSize / 1024).toFixed(1)} KB)]`;
            }
          } catch (e) {
            snapshot = null;
          }
        }
        
        // 发送事件到渲染进程
        if (mainWindowRef && !mainWindowRef.isDestroyed()) {
          mainWindowRef.webContents.send('file-change', {
            type: changeType,
            action: action,
            filename: filename,
            path: fullPath,
            isDirectory: isDirectory,
            time: new Date().toISOString(),
            snapshot: snapshot,
            size: fileSize
          });
        }
      }, 100));
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 停止监控
ipcMain.handle('stop-file-watch', async () => {
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
  }
  pendingEvents.clear();
  return { success: true };
});

// 读取文件内容（用于预览）
ipcMain.handle('read-file-content', async (event, filePath) => {
  const fs = require('fs');
  
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: '文件不存在' };
    }
    
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return { success: false, error: '这是一个目录' };
    }
    
    // 限制文件大小（最大 100KB）
    if (stats.size > 100 * 1024) {
      return { success: false, error: '文件太大，无法预览（>100KB）' };
    }
    
    // 读取文件
    const content = fs.readFileSync(filePath, 'utf8');
    return { success: true, content, size: stats.size };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 回溯文件到快照状态
ipcMain.handle('restore-file-snapshot', async (event, { path: filePath, content }) => {
  const fs = require('fs');
  const pathModule = require('path');
  
  try {
    // 确保目录存在
    const dir = pathModule.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 写入快照内容
    fs.writeFileSync(filePath, content, 'utf8');
    
    // 更新缓存
    const stats = fs.statSync(filePath);
    fileStatsCache.set(filePath, { size: stats.size, mtime: stats.mtimeMs });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 在资源管理器中显示文件
ipcMain.handle('show-in-folder', async (event, filePath) => {
  const { shell } = require('electron');
  shell.showItemInFolder(filePath);
  return { success: true };
});

// 用默认程序打开文件
ipcMain.handle('open-file', async (event, filePath) => {
  const { shell } = require('electron');
  await shell.openPath(filePath);
  return { success: true };
});

// 获取当前环境变量配置（从用户级环境变量读取）
ipcMain.handle('get-config', async () => {
  const [baseUrl, authToken, model, smallModel] = await Promise.all([
    getEnvVar('ANTHROPIC_BASE_URL'),
    getEnvVar('ANTHROPIC_AUTH_TOKEN'),
    getEnvVar('ANTHROPIC_MODEL'),
    getEnvVar('ANTHROPIC_SMALL_FAST_MODEL')
  ]);
  
  return { baseUrl, authToken, model, smallModel };
});

// 应用配置
ipcMain.handle('apply-config', async (event, config) => {
  const commands = [];
  
  if (config.baseUrl) {
    commands.push(`[Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL', '${config.baseUrl}', 'User')`);
  }
  if (config.authToken) {
    commands.push(`[Environment]::SetEnvironmentVariable('ANTHROPIC_AUTH_TOKEN', '${config.authToken}', 'User')`);
  }
  if (config.model) {
    commands.push(`[Environment]::SetEnvironmentVariable('ANTHROPIC_MODEL', '${config.model}', 'User')`);
  }
  if (config.smallModel) {
    commands.push(`[Environment]::SetEnvironmentVariable('ANTHROPIC_SMALL_FAST_MODEL', '${config.smallModel}', 'User')`);
  }
  
  // 设置更长的超时时间 (15分钟)，ModelScope 等服务响应较慢
  commands.push(`[Environment]::SetEnvironmentVariable('API_TIMEOUT_MS', '900000', 'User')`);
  commands.push(`[Environment]::SetEnvironmentVariable('CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', '1', 'User')`);
  
  const script = commands.join('; ');
  
  return new Promise((resolve, reject) => {
    exec(`powershell -Command "${script}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      } else {
        resolve('配置已保存，请重启 Claude Code');
      }
    });
  });
});

// 测试 API 连接（用于推荐网关的负载均衡）
// 使用快速模式：只检查服务器是否响应，不做完整 API 调用
ipcMain.handle('test-api-connection', async (event, config) => {
  const https = require('https');
  const http = require('http');
  
  return new Promise((resolve) => {
    const url = new URL(config.baseUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    // 使用 HEAD 请求快速检测服务器可达性
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'HEAD',
      timeout: 15000,  // 15秒超时用于快速检测
      headers: {
        'x-api-key': config.authToken
      }
    };
    
    const req = client.request(options, (res) => {
      // 只要服务器响应就认为可用
      // 4xx/5xx 也表示服务器活跃，密钥验证由实际使用时处理
      resolve({ success: true, statusCode: res.statusCode });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: '服务器响应超时' });
    });
    
    req.on('error', (e) => {
      // 连接错误表示服务器不可达
      resolve({ success: false, error: e.message });
    });
    
    req.end();
  });
});

// 完整 API 测试（可选，用于验证密钥有效性）
ipcMain.handle('test-api-key', async (event, config) => {
  const https = require('https');
  const http = require('http');
  
  return new Promise((resolve) => {
    const url = new URL(config.baseUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + '/v1/messages',
      method: 'POST',
      timeout: 120000,  // 2分钟超时，适应慢速网关
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.authToken,
        'anthropic-version': '2023-06-01'
      }
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 401 || res.statusCode === 403) {
          resolve({ success: false, error: '密钥无效', statusCode: res.statusCode });
        } else {
          resolve({ success: true, statusCode: res.statusCode });
        }
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: '请求超时（网关响应慢）' });
    });
    
    req.on('error', (e) => {
      resolve({ success: false, error: e.message });
    });
    
    req.write(JSON.stringify({
      model: config.model || 'claude-sonnet-4-5-20250514',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'hi' }]
    }));
    req.end();
  });
});

// 清除配置
ipcMain.handle('clear-config', async () => {
  const vars = [
    'ANTHROPIC_BASE_URL',
    'ANTHROPIC_AUTH_TOKEN', 
    'ANTHROPIC_MODEL',
    'ANTHROPIC_SMALL_FAST_MODEL',
    'API_TIMEOUT_MS',
    'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC'
  ];
  
  const commands = vars.map(v => 
    `[Environment]::SetEnvironmentVariable('${v}', $null, 'User')`
  );
  
  const script = commands.join('; ');
  
  return new Promise((resolve, reject) => {
    exec(`powershell -Command "${script}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      } else {
        resolve('配置已清除，Claude Code 将使用官方 API');
      }
    });
  });
});

// 安装 Claude Code
ipcMain.handle('install-claude-code', async () => {
  return new Promise((resolve, reject) => {
    // 设置更长的超时时间 (5分钟)
    const child = exec('npm install -g @anthropic-ai/claude-code', {
      timeout: 300000
    }, (error, stdout, stderr) => {
      if (error) {
        reject('安装失败: ' + error.message);
      } else {
        resolve('✓ Claude Code 安装成功！请在终端中运行 claude 命令启动。');
      }
    });
  });
});

// 下载 Node.js
ipcMain.handle('download-nodejs', async () => {
  const { shell } = require('electron');
  shell.openExternal('https://nodejs.org/dist/v24.13.0/node-v24.13.0-x64.msi');
  return '正在下载 Node.js...';
});

// 安装 Qwen Code
ipcMain.handle('install-qwen-code', async () => {
  return new Promise((resolve, reject) => {
    exec('npm install -g @qwen-code/qwen-code@latest', {
      timeout: 300000
    }, (error, stdout, stderr) => {
      if (error) {
        reject('安装失败: ' + error.message);
      } else {
        resolve('✓ Qwen Code 安装成功！请在终端中运行 qwen 命令启动。');
      }
    });
  });
});

// 启动 CF Coder CLI（内置 CLI，无需单独安装）
ipcMain.handle('launch-cfclaude-cli', async (event, config) => {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const workdir = config.workdir || process.cwd();

  // 获取内置 CF Coder CLI 路径
  let cliPath;
  if (app.isPackaged) {
    // 打包后：从 resources 目录加载
    cliPath = path.join(process.resourcesPath, 'cfclaude-cli', 'dist', 'cf.js');
  } else {
    // 开发模式：从项目目录加载
    cliPath = path.join(__dirname, 'cfclaude-cli', 'dist', 'cf.js');
  }

  return new Promise((resolve, reject) => {
    // 检查 CLI 文件是否存在
    if (!fs.existsSync(cliPath)) {
      reject(new Error('CF Coder CLI 文件不存在，请先编译 cfclaude-cli (npm run prebuild)'));
      return;
    }

    // 转义路径中的反斜杠
    const escapedCliPath = cliPath.replace(/\\/g, '\\\\');
    const escapedWorkdir = workdir.replace(/\\/g, '\\\\');

    // 构建 PowerShell 启动命令
    // CF Coder 使用 ~/.cfcoderrc 配置文件和环境变量
    // 判断提供商类型和 API 格式
    const isCloudflare = config.provider === 'cloudflare' || config.provider === 'cloudflare-workers';
    const apiFormat = config.apiFormat || 'openai';
    const isAnthropicFormat = apiFormat === 'anthropic';
    const isOpenAIFormat = apiFormat === 'openai';

    const psCommand = `
      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force;
      cd '${escapedWorkdir}';
      $env:FORCE_COLOR = '1';
      $env:CF_CODER_PROVIDER = '${config.provider}';
      $env:CF_CODER_MODEL = '${config.model}';
      $env:CF_CODER_API_FORMAT = '${apiFormat}';
      $env:OPENAI_API_KEY = '${isOpenAIFormat ? config.apiKey : ''}';
      $env:OPENAI_BASE_URL = '${isOpenAIFormat ? config.baseUrl : ''}';
      $env:ANTHROPIC_API_KEY = '${isAnthropicFormat ? config.apiKey : ''}';
      $env:ANTHROPIC_BASE_URL = '${isAnthropicFormat ? config.baseUrl : ''}';
      $env:CF_CODER_WORKER_URL = '${isCloudflare ? config.baseUrl : ''}';
      node '${escapedCliPath}'
    `.replace(/\n\s*/g, ' ');

    // 使用 cmd 的 start 命令在新窗口中启动 PowerShell
    const child = spawn('cmd', ['/c', 'start', 'powershell', '-NoExit', '-Command', psCommand], {
      detached: true,
      stdio: 'ignore',
      cwd: workdir,
      shell: true
    });

    child.unref();

    // 延迟返回，确保进程已启动
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
});

// 配置 Qwen Code 环境变量
ipcMain.handle('config-qwen-code', async (event, config) => {
  const commands = [];
  
  if (config.apiKey) {
    commands.push(`[Environment]::SetEnvironmentVariable('OPENAI_API_KEY', '${config.apiKey}', 'User')`);
  }
  if (config.baseUrl) {
    commands.push(`[Environment]::SetEnvironmentVariable('OPENAI_BASE_URL', '${config.baseUrl}', 'User')`);
  }
  if (config.model) {
    commands.push(`[Environment]::SetEnvironmentVariable('OPENAI_MODEL', '${config.model}', 'User')`);
  }
  
  const script = commands.join('; ');
  
  return new Promise((resolve, reject) => {
    exec(`powershell -Command "${script}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      } else {
        resolve('Qwen Code 配置已保存！');
      }
    });
  });
});

// 启动 Claude Code (在新终端窗口)
ipcMain.handle('launch-claude', async (event, options = {}) => {
  const { spawn } = require('child_process');
  const workdir = options.workdir || '';
  
  return new Promise((resolve) => {
    // 构建 cd 命令
    const cdCommand = workdir ? `cd '${workdir.replace(/'/g, "''")}';` : '';
    
    // PowerShell 命令：设置执行策略，刷新环境变量，切换目录，然后启动 claude
    const psCommand = `
      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force;
      $env:ANTHROPIC_BASE_URL = [Environment]::GetEnvironmentVariable('ANTHROPIC_BASE_URL', 'User');
      $env:ANTHROPIC_AUTH_TOKEN = [Environment]::GetEnvironmentVariable('ANTHROPIC_AUTH_TOKEN', 'User');
      $env:ANTHROPIC_MODEL = [Environment]::GetEnvironmentVariable('ANTHROPIC_MODEL', 'User');
      $env:ANTHROPIC_SMALL_FAST_MODEL = [Environment]::GetEnvironmentVariable('ANTHROPIC_SMALL_FAST_MODEL', 'User');
      $env:API_TIMEOUT_MS = [Environment]::GetEnvironmentVariable('API_TIMEOUT_MS', 'User');
      ${cdCommand}
      claude
    `.replace(/\n/g, ' ');
    
    const child = spawn('powershell', ['-NoExit', '-Command', psCommand], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });
    child.unref();
    setTimeout(() => resolve('已在新窗口启动 Claude Code'), 500);
  });
});

// 启动 Qwen Code (在新终端窗口) - 使用 OpenAI 兼容认证
// 可以传入 config 参数直接使用，或者从环境变量读取
ipcMain.handle('launch-qwen', async (event, config = null) => {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  
  let apiKey, baseUrl, model;
  
  // 如果传入了配置，直接使用；否则从环境变量读取
  if (config && config.apiKey) {
    apiKey = config.apiKey;
    baseUrl = config.baseUrl || '';
    model = config.model || '';
  } else {
    // 从用户环境变量读取配置
    try {
      apiKey = require('child_process').execSync(
        'powershell -Command "[Environment]::GetEnvironmentVariable(\'OPENAI_API_KEY\', \'User\')"',
        { encoding: 'utf8' }
      ).trim();
      baseUrl = require('child_process').execSync(
        'powershell -Command "[Environment]::GetEnvironmentVariable(\'OPENAI_BASE_URL\', \'User\')"',
        { encoding: 'utf8' }
      ).trim();
      model = require('child_process').execSync(
        'powershell -Command "[Environment]::GetEnvironmentVariable(\'OPENAI_MODEL\', \'User\')"',
        { encoding: 'utf8' }
      ).trim();
    } catch (e) {
      console.error('读取环境变量失败:', e);
    }
  }
  
  // 修改 Qwen Code 的 settings.json，将认证类型改为 openai
  const settingsPath = path.join(process.env.USERPROFILE, '.qwen', 'settings.json');
  try {
    let settings = { security: { auth: {} }, '$version': 2 };
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    if (!settings.security) settings.security = {};
    if (!settings.security.auth) settings.security.auth = {};
    
    settings.security.auth.selectedType = 'openai';
    if (apiKey) settings.security.auth.apiKey = apiKey;
    if (baseUrl) settings.security.auth.baseUrl = baseUrl;
    
    // 确保目录存在
    const qwenDir = path.join(process.env.USERPROFILE, '.qwen');
    if (!fs.existsSync(qwenDir)) {
      fs.mkdirSync(qwenDir, { recursive: true });
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log('已更新 Qwen settings.json:', { selectedType: 'openai', baseUrl });
  } catch (e) {
    console.error('修改 Qwen settings.json 失败:', e);
  }
  
  const workdir = config?.workdir || '';
  
  return new Promise((resolve) => {
    // 直接在命令中设置环境变量
    const escapedApiKey = apiKey ? apiKey.replace(/'/g, "''") : '';
    const escapedBaseUrl = baseUrl ? baseUrl.replace(/'/g, "''") : '';
    const escapedModel = model ? model.replace(/'/g, "''") : '';
    const cdCommand = workdir ? `cd '${workdir.replace(/'/g, "''")}';` : '';
    
    const psCommand = `
      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force;
      $env:OPENAI_API_KEY = '${escapedApiKey}';
      $env:OPENAI_BASE_URL = '${escapedBaseUrl}';
      $env:OPENAI_MODEL = '${escapedModel}';
      ${cdCommand}
      Write-Host 'OpenAI Mode - Starting Qwen Code...' -ForegroundColor Green;
      Write-Host "Base URL: $env:OPENAI_BASE_URL" -ForegroundColor Yellow;
      Write-Host "Model: $env:OPENAI_MODEL" -ForegroundColor Yellow;
      qwen
    `.replace(/\n/g, ' ');
    
    const child = spawn('powershell', ['-NoExit', '-Command', psCommand], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });
    child.unref();
    setTimeout(() => resolve('已在新窗口启动 Qwen Code (OpenAI 模式)'), 500);
  });
});

// 启动 Qwen Code (OAuth 模式) - 使用阿里云百炼 OAuth 认证（每天 2000 次免费）
ipcMain.handle('launch-qwen-oauth', async (event, options = {}) => {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const workdir = options.workdir || '';
  
  // 修改 Qwen Code 的 settings.json，将认证类型改为 qwen-oauth
  const settingsPath = path.join(process.env.USERPROFILE, '.qwen', 'settings.json');
  try {
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      if (settings.security && settings.security.auth) {
        settings.security.auth.selectedType = 'qwen-oauth';
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      }
    }
  } catch (e) {
    console.error('修改 Qwen settings.json 失败:', e);
  }
  
  return new Promise((resolve) => {
    const cdCommand = workdir ? `cd '${workdir.replace(/'/g, "''")}';` : '';
    
    const psCommand = `
      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force;
      Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue;
      Remove-Item Env:OPENAI_BASE_URL -ErrorAction SilentlyContinue;
      Remove-Item Env:OPENAI_MODEL -ErrorAction SilentlyContinue;
      ${cdCommand}
      Write-Host 'OAuth Mode - Starting Qwen Code (2000 free calls/day)...' -ForegroundColor Green;
      qwen
    `.replace(/\n/g, ' ');
    
    const child = spawn('powershell', ['-NoExit', '-Command', psCommand], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });
    child.unref();
    setTimeout(() => resolve('已在新窗口启动 Qwen Code (OAuth)'), 500);
  });
});

// 启动 Codex CLI (在新终端窗口，用于 ModelScope 等 OpenAI 兼容服务)
ipcMain.handle('launch-codex', async (event, options = {}) => {
  const { spawn } = require('child_process');
  return new Promise((resolve) => {
    // 获取参数
    const model = options.model || '';
    const baseUrl = options.baseUrl || '';
    const apiKey = options.apiKey || '';
    
    // PowerShell 命令：设置执行策略，设置环境变量，然后启动 codex
    // 使用 -c 参数配置 model_provider 为 openai
    const psCommand = `
      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force;
      $env:OPENAI_API_KEY = '${apiKey}';
      $env:OPENAI_BASE_URL = '${baseUrl}';
      codex -c model_provider="openai" --model "${model}"
    `.replace(/\n/g, ' ');
    
    const child = spawn('powershell', ['-NoExit', '-Command', psCommand], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });
    child.unref();
    setTimeout(() => resolve('已在新窗口启动 Codex'), 500);
  });
});

// 安装 Codex CLI
ipcMain.handle('install-codex', async () => {
  return new Promise((resolve, reject) => {
    exec('npm install -g @openai/codex', {
      timeout: 300000
    }, (error, stdout, stderr) => {
      if (error) {
        reject('安装失败: ' + error.message);
      } else {
        resolve('✓ Codex CLI 安装成功！');
      }
    });
  });
});

// 配置 OpenAI 兼容环境变量 (用于 ModelScope 等)
ipcMain.handle('config-openai-compatible', async (event, config) => {
  const commands = [];
  
  if (config.apiKey) {
    commands.push(`[Environment]::SetEnvironmentVariable('OPENAI_API_KEY', '${config.apiKey}', 'User')`);
  }
  if (config.baseUrl) {
    commands.push(`[Environment]::SetEnvironmentVariable('OPENAI_BASE_URL', '${config.baseUrl}', 'User')`);
  }
  if (config.model) {
    commands.push(`[Environment]::SetEnvironmentVariable('OPENAI_MODEL', '${config.model}', 'User')`);
  }
  
  const script = commands.join('; ');
  
  return new Promise((resolve, reject) => {
    exec(`powershell -Command "${script}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      } else {
        resolve('OpenAI 兼容配置已保存！');
      }
    });
  });
});

// 部署 Cloudflare Worker
ipcMain.handle('deploy-worker', async (event, config) => {
  const https = require('https');
  
  // Worker 代码直接嵌入
  const workerCode = `/**
 * Cloudflare Worker - Claude Code -> Cloudflare Workers AI
 */

const MODEL_MAP = {
  'claude-sonnet-4-20250514': '@cf/meta/llama-3.1-8b-instruct',
  'claude-opus-4-20250514': '@cf/meta/llama-3.1-8b-instruct',
  'claude-3-5-sonnet-20241022': '@cf/meta/llama-3.1-8b-instruct',
  'claude-3-5-haiku-20241022': '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.1-8b-instruct': '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.2-3b-instruct': '@cf/meta/llama-3.2-3b-instruct',
  '@cf/meta/llama-3.2-1b-instruct': '@cf/meta/llama-3.2-1b-instruct',
  '@cf/mistral/mistral-7b-instruct-v0.1': '@cf/mistral/mistral-7b-instruct-v0.1',
  '@cf/deepseek-ai/deepseek-math-7b-instruct': '@cf/deepseek-ai/deepseek-math-7b-instruct',
  '@cf/openchat/openchat-3.5-0106': '@cf/openchat/openchat-3.5-0106',
  '@cf/google/gemma-7b-it-lora': '@cf/google/gemma-7b-it-lora',
  '@cf/qwen/qwen1.5-7b-chat-awq': '@cf/qwen/qwen1.5-7b-chat-awq',
};

const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return corsResponse(null);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\\/+/g, '/').replace(/\\/$/, '') || '/';

    if (path === '/' || path === '/health') {
      return corsResponse(JSON.stringify({ 
        status: 'ok',
        provider: 'Cloudflare Workers AI',
        models: Object.keys(MODEL_MAP).filter(k => k.startsWith('@cf/')),
        message: 'Claude Code -> Cloudflare AI Proxy'
      }));
    }

    if (path === '/v1/models') {
      return corsResponse(JSON.stringify({
        object: 'list',
        data: Object.keys(MODEL_MAP).filter(k => k.startsWith('@cf/')).map(id => ({
          id,
          object: 'model',
          owned_by: 'cloudflare'
        }))
      }));
    }

    const messagePaths = ['/v1/messages', '/messages', '/v1/chat/completions', '/chat/completions', '/anthropic/v1/messages', '/api/v1/messages'];
    
    if (messagePaths.includes(path) && request.method === 'POST') {
      return handleMessages(request, env);
    }
    
    if ((path.endsWith('/messages') || path.endsWith('/chat/completions')) && request.method === 'POST') {
      return handleMessages(request, env);
    }

    return corsResponse(JSON.stringify({
      error: 'Not Found',
      requested_path: path,
      method: request.method,
      hint: 'Supported endpoints: /v1/messages, /messages, /v1/chat/completions'
    }), 404);
  }
};

async function handleMessages(request, env) {
  const ai = env.AI || env.claude;
  if (!ai) {
    return errorResponse('AI binding not configured. Please add Workers AI binding named "AI" in Worker settings.', 500);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return errorResponse('Invalid JSON', 400);
  }

  const requestedModel = body.model || '';
  const model = MODEL_MAP[requestedModel] || DEFAULT_MODEL;
  const messages = buildMessages(body);
  const isStream = body.stream === true;

  try {
    if (isStream) {
      return handleStreamRequest(ai, model, messages, body);
    } else {
      return handleNonStreamRequest(ai, model, messages, body);
    }
  } catch (e) {
    return errorResponse('AI request failed: ' + e.message, 500);
  }
}

function buildPromptString(messages) {
  let prompt = '';
  for (const msg of messages) {
    if (msg.role === 'system') {
      prompt += 'System: ' + msg.content + '\\n\\n';
    } else if (msg.role === 'user') {
      prompt += 'Human: ' + msg.content + '\\n\\n';
    } else if (msg.role === 'assistant') {
      prompt += 'Assistant: ' + msg.content + '\\n\\n';
    }
  }
  prompt += 'Assistant:';
  return prompt;
}

function buildMessages(body) {
  const messages = [];

  if (body.system) {
    let systemText = '';
    if (typeof body.system === 'string') {
      systemText = body.system;
    } else if (Array.isArray(body.system)) {
      systemText = body.system.filter(b => b.type === 'text').map(b => b.text).join('\\n');
    }
    messages.push({ role: 'system', content: systemText });
  }

  for (const msg of body.messages || []) {
    let content = '';
    if (typeof msg.content === 'string') {
      content = msg.content;
    } else if (Array.isArray(msg.content)) {
      content = msg.content.filter(b => b.type === 'text').map(b => b.text).join('\\n');
    }
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: content
    });
  }

  return messages;
}

async function handleNonStreamRequest(ai, model, messages, originalBody) {
  let responseText = '';
  
  try {
    const result = await ai.run(model, {
      messages: messages,
      max_tokens: Math.min(originalBody.max_tokens || 2048, 4096),
    });
    responseText = result.response || (typeof result === 'string' ? result : JSON.stringify(result));
  } catch (e1) {
    try {
      const prompt = buildPromptString(messages);
      const result = await ai.run(model, {
        prompt: prompt,
        max_tokens: Math.min(originalBody.max_tokens || 2048, 4096),
      });
      responseText = result.response || (typeof result === 'string' ? result : JSON.stringify(result));
    } catch (e2) {
      return errorResponse('Model error: ' + (e1.message || e2.message), 500);
    }
  }

  const anthropicResponse = {
    id: 'msg_' + Date.now(),
    type: 'message',
    role: 'assistant',
    model: originalBody.model,
    content: [{
      type: 'text',
      text: responseText
    }],
    stop_reason: 'end_turn',
    stop_sequence: null,
    usage: {
      input_tokens: estimateTokens(messages),
      output_tokens: estimateTokens(responseText)
    }
  };

  return corsResponse(JSON.stringify(anthropicResponse));
}

async function handleStreamRequest(ai, model, messages, originalBody) {
  let stream;
  
  try {
    stream = await ai.run(model, {
      messages: messages,
      max_tokens: Math.min(originalBody.max_tokens || 2048, 4096),
      stream: true
    });
  } catch (e1) {
    try {
      const prompt = buildPromptString(messages);
      stream = await ai.run(model, {
        prompt: prompt,
        max_tokens: Math.min(originalBody.max_tokens || 2048, 4096),
        stream: true
      });
    } catch (e2) {
      return errorResponse('Model error: ' + (e1.message || e2.message), 500);
    }
  }

  const messageId = 'msg_' + Date.now();
  const { readable, writable } = new TransformStream();
  
  (async () => {
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    await writeSSE(writer, encoder, 'message_start', {
      type: 'message_start',
      message: {
        id: messageId,
        type: 'message',
        role: 'assistant',
        model: originalBody.model,
        content: [],
        stop_reason: null,
        stop_sequence: null,
        usage: { input_tokens: 0, output_tokens: 0 }
      }
    });

    await writeSSE(writer, encoder, 'content_block_start', {
      type: 'content_block_start',
      index: 0,
      content_block: { type: 'text', text: '' }
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let outputTokens = 0;
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        let chunk = '';
        if (typeof value === 'string') {
          chunk = value;
        } else if (value instanceof Uint8Array) {
          chunk = decoder.decode(value, { stream: true });
        }

        buffer += chunk;
        const lines = buffer.split('\\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);
            const text = data.response || '';
            
            if (text) {
              outputTokens += estimateTokens(text);
              await writeSSE(writer, encoder, 'content_block_delta', {
                type: 'content_block_delta',
                index: 0,
                delta: { type: 'text_delta', text: text }
              });
            }
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error('Stream error:', e);
    }

    await writeSSE(writer, encoder, 'content_block_stop', {
      type: 'content_block_stop',
      index: 0
    });

    await writeSSE(writer, encoder, 'message_delta', {
      type: 'message_delta',
      delta: { stop_reason: 'end_turn', stop_sequence: null },
      usage: { output_tokens: outputTokens }
    });

    await writeSSE(writer, encoder, 'message_stop', {
      type: 'message_stop'
    });

    await writer.close();
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

async function writeSSE(writer, encoder, event, data) {
  await writer.write(encoder.encode('event: ' + event + '\\ndata: ' + JSON.stringify(data) + '\\n\\n'));
}

function estimateTokens(content) {
  if (!content) return 0;
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  return Math.ceil(text.length / 4);
}

function corsResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    }
  });
}

function errorResponse(message, status) {
  return new Response(JSON.stringify({
    type: 'error',
    error: {
      type: 'api_error',
      message: message
    }
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}`;

  const { accountId, apiToken, workerName } = config;
  const boundary = '----CFWorkerBoundary' + Date.now();
  
  // 构建 metadata
  const metadata = JSON.stringify({
    main_module: 'worker.js',
    bindings: [
      {
        type: 'ai',
        name: 'AI'
      }
    ]
  });
  
  // 构建 multipart body
  let body = '';
  body += `--${boundary}\r\n`;
  body += 'Content-Disposition: form-data; name="metadata"\r\n';
  body += 'Content-Type: application/json\r\n\r\n';
  body += metadata + '\r\n';
  body += `--${boundary}\r\n`;
  body += 'Content-Disposition: form-data; name="worker.js"; filename="worker.js"\r\n';
  body += 'Content-Type: application/javascript+module\r\n\r\n';
  body += workerCode + '\r\n';
  body += `--${boundary}--\r\n`;
  
  // 辅助函数：发送 HTTPS 请求
  function httpsRequest(options, body = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data: data });
          }
        });
      });
      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    });
  }

  try {
    // 1. 部署 Worker
    const deployResult = await httpsRequest({
      hostname: 'api.cloudflare.com',
      port: 443,
      path: `/client/v4/accounts/${accountId}/workers/scripts/${workerName}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }, body);

    if (!deployResult.data.success) {
      throw new Error(deployResult.data.errors?.[0]?.message || '部署失败');
    }

    // 2. 启用 workers.dev 子域 (通过 Worker 服务 API)
    const subdomainBody = JSON.stringify({ enabled: true });
    
    // 尝试新版 API
    let subdomainResult = await httpsRequest({
      hostname: 'api.cloudflare.com',
      port: 443,
      path: `/client/v4/accounts/${accountId}/workers/services/${workerName}/environments/production/subdomain`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(subdomainBody)
      }
    }, subdomainBody);
    
    // 如果失败，尝试旧版 API
    if (!subdomainResult.data.success) {
      subdomainResult = await httpsRequest({
        hostname: 'api.cloudflare.com',
        port: 443,
        path: `/client/v4/accounts/${accountId}/workers/scripts/${workerName}/subdomain`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(subdomainBody)
        }
      }, subdomainBody);
    }

    const workerUrl = `https://${workerName}.${config.subdomain}.workers.dev`;
    
    // 返回结构化数据
    return {
      success: true,
      url: workerUrl,
      routeEnabled: subdomainResult.data.success,
      message: subdomainResult.data.success 
        ? '部署成功！AI Binding 已配置，路由已启用。'
        : '部署成功！AI Binding 已配置。请手动启用 workers.dev 路由。'
    };
  } catch (e) {
    throw new Error(e.message || '部署失败');
  }
});

