const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 520,
    height: 780,
    resizable: true,
    frame: false,
    transparent: true,
    minWidth: 400,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

// 获取当前配置
ipcMain.handle('get-config', async () => {
  return new Promise((resolve) => {
    exec('powershell -Command "[Environment]::GetEnvironmentVariable(\'ANTHROPIC_BASE_URL\', \'User\')"', (err, stdout) => {
      const baseUrl = stdout.trim();
      exec('powershell -Command "[Environment]::GetEnvironmentVariable(\'ANTHROPIC_MODEL\', \'User\')"', (err2, stdout2) => {
        const model = stdout2.trim();
        resolve({ baseUrl, model });
      });
    });
  });
});

// 获取已保存的 API Key
ipcMain.handle('get-api-key', async (event, envName) => {
  return new Promise((resolve) => {
    exec(`powershell -Command "[Environment]::GetEnvironmentVariable('${envName}', 'User')"`, (err, stdout) => {
      resolve(stdout.trim());
    });
  });
});

// 设置配置
ipcMain.handle('set-config', async (event, config) => {
  const { baseUrl, model, apiKey, apiKeyEnv, accountId, accountIdEnv } = config;
  
  // ModelScope 需要限制 max_tokens
  const maxTokens = baseUrl.includes('modelscope') ? '8000' : '16000';
  
  const commands = [
    `[Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL', '${baseUrl}', 'User')`,
    `[Environment]::SetEnvironmentVariable('ANTHROPIC_AUTH_TOKEN', '${apiKey}', 'User')`,
    `[Environment]::SetEnvironmentVariable('ANTHROPIC_MODEL', '${model}', 'User')`,
    `[Environment]::SetEnvironmentVariable('ANTHROPIC_SMALL_FAST_MODEL', '${model}', 'User')`,
    `[Environment]::SetEnvironmentVariable('API_TIMEOUT_MS', '600000', 'User')`,
    `[Environment]::SetEnvironmentVariable('CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', '1', 'User')`,
    `[Environment]::SetEnvironmentVariable('MAX_OUTPUT_TOKENS', '${maxTokens}', 'User')`,
    `[Environment]::SetEnvironmentVariable('${apiKeyEnv}', '${apiKey}', 'User')`
  ];
  
  // 如果有 Account ID
  if (accountId && accountIdEnv) {
    commands.push(`[Environment]::SetEnvironmentVariable('${accountIdEnv}', '${accountId}', 'User')`);
  }
  
  return new Promise((resolve) => {
    exec(`powershell -Command "${commands.join('; ')}"`, (err) => {
      resolve(!err);
    });
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
  
  const commands = vars.map(v => `[Environment]::SetEnvironmentVariable('${v}', $null, 'User')`);
  
  return new Promise((resolve) => {
    exec(`powershell -Command "${commands.join('; ')}"`, (err) => {
      resolve(!err);
    });
  });
});

// 窗口控制
ipcMain.on('minimize', () => mainWindow.minimize());
ipcMain.on('close', () => mainWindow.close());

