const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1420,
    height: 920,
    resizable: false,
    maximizable: false,
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

