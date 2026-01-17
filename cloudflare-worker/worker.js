/**
 * Cloudflare Worker - 使用 Cloudflare Workers AI 模型
 * 将 Claude Code 的 Anthropic API 请求转换为 Cloudflare AI 调用
 * 
 * 部署步骤:
 * 1. 在 Cloudflare Dashboard 创建 Worker
 * 2. 复制此代码到 Worker 编辑器
 * 3. 在 Worker 设置中绑定 AI:
 *    - 进入 Settings -> Bindings
 *    - 添加 Workers AI binding, 名称设为 "AI"
 * 4. 部署后获取 Worker URL
 */

// 模型映射: Claude 模型 -> Cloudflare AI 模型
const MODEL_MAP = {
  // Claude 请求的模型会被映射到这些 Cloudflare 模型
  'claude-sonnet-4-20250514': '@cf/meta/llama-3-8b-instruct',
  'claude-opus-4-20250514': '@cf/meta/llama-3-8b-instruct',
  'claude-3-5-sonnet-20241022': '@cf/meta/llama-3-8b-instruct',
  'claude-3-5-haiku-20241022': '@cf/meta/llama-2-7b-chat-int8',
  
  // Cloudflare Workers AI 免费可用模型
  '@cf/meta/llama-3-8b-instruct': '@cf/meta/llama-3-8b-instruct',
  '@cf/meta/llama-3.1-8b-instruct': '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-2-7b-chat-int8': '@cf/meta/llama-2-7b-chat-int8',
  '@cf/meta/llama-2-7b-chat-fp16': '@cf/meta/llama-2-7b-chat-fp16',
  '@cf/mistral/mistral-7b-instruct-v0.1': '@cf/mistral/mistral-7b-instruct-v0.1',
  '@cf/mistral/mistral-7b-instruct-v0.2': '@cf/mistral/mistral-7b-instruct-v0.2',
  '@cf/thebloke/codellama-7b-instruct-awq': '@cf/thebloke/codellama-7b-instruct-awq',
  '@cf/deepseek-ai/deepseek-math-7b-instruct': '@cf/deepseek-ai/deepseek-math-7b-instruct',
  '@cf/qwen/qwen1.5-7b-chat-awq': '@cf/qwen/qwen1.5-7b-chat-awq',
  '@cf/qwen/qwen1.5-14b-chat-awq': '@cf/qwen/qwen1.5-14b-chat-awq',
  '@cf/tiiuae/falcon-7b-instruct': '@cf/tiiuae/falcon-7b-instruct',
  '@cf/openchat/openchat-3.5-0106': '@cf/openchat/openchat-3.5-0106',
  '@cf/microsoft/phi-2': '@cf/microsoft/phi-2',
  '@cf/google/gemma-7b-it': '@cf/google/gemma-7b-it',
};

// 默认模型
const DEFAULT_MODEL = '@cf/meta/llama-3-8b-instruct';

export default {
  async fetch(request, env) {
    // CORS 预检
    if (request.method === 'OPTIONS') {
      return corsResponse(null);
    }

    const url = new URL(request.url);
    // 标准化路径：移除多余斜杠
    const path = url.pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/';

    // 健康检查
    if (path === '/' || path === '/health') {
      return corsResponse(JSON.stringify({ 
        status: 'ok',
        provider: 'Cloudflare Workers AI',
        models: Object.keys(MODEL_MAP).filter(k => k.startsWith('@cf/')),
        message: 'Claude Code -> Cloudflare AI Proxy'
      }));
    }

    // 列出可用模型
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

    // 处理 Anthropic messages 端点 (支持多种路径格式)
    const messagePaths = [
      '/v1/messages',
      '/messages', 
      '/v1/chat/completions',
      '/chat/completions',
      // Claude Code 可能请求这些路径
      '/anthropic/v1/messages',
      '/api/v1/messages'
    ];
    
    if (messagePaths.includes(path) && request.method === 'POST') {
      return handleMessages(request, env);
    }
    
    // 也支持路径以这些结尾的情况
    if ((path.endsWith('/messages') || path.endsWith('/chat/completions')) && request.method === 'POST') {
      return handleMessages(request, env);
    }

    // 调试: 返回请求的路径信息
    return corsResponse(JSON.stringify({
      error: 'Not Found',
      requested_path: path,
      method: request.method,
      hint: 'Supported endpoints: /v1/messages, /messages, /v1/chat/completions'
    }), 404);
  }
};

async function handleMessages(request, env) {
  // 检查 AI 绑定 (支持 AI 或 claude 命名)
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

  // 获取模型
  const requestedModel = body.model || '';
  const model = MODEL_MAP[requestedModel] || DEFAULT_MODEL;

  // 构建消息
  const messages = buildMessages(body);

  // 检查是否为流式请求
  const isStream = body.stream === true;

  try {
    if (isStream) {
      return handleStreamRequest(ai, model, messages, body);
    } else {
      return handleNonStreamRequest(ai, model, messages, body);
    }
  } catch (e) {
    return errorResponse(`AI request failed: ${e.message}`, 500);
  }
}

// 将消息列表转换为 prompt 字符串
function buildPromptString(messages) {
  let prompt = '';
  for (const msg of messages) {
    if (msg.role === 'system') {
      prompt += `System: ${msg.content}\n\n`;
    } else if (msg.role === 'user') {
      prompt += `Human: ${msg.content}\n\n`;
    } else if (msg.role === 'assistant') {
      prompt += `Assistant: ${msg.content}\n\n`;
    }
  }
  prompt += 'Assistant:';
  return prompt;
}

// 构建消息列表
function buildMessages(body) {
  const messages = [];

  // 系统提示
  if (body.system) {
    let systemText = '';
    if (typeof body.system === 'string') {
      systemText = body.system;
    } else if (Array.isArray(body.system)) {
      systemText = body.system
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');
    }
    messages.push({ role: 'system', content: systemText });
  }

  // 用户和助手消息
  for (const msg of body.messages || []) {
    let content = '';
    
    if (typeof msg.content === 'string') {
      content = msg.content;
    } else if (Array.isArray(msg.content)) {
      content = msg.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');
    }

    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: content
    });
  }

  return messages;
}

// 非流式请求
async function handleNonStreamRequest(ai, model, messages, originalBody) {
  let responseText = '';
  
  try {
    // 尝试使用 messages 格式 (聊天模型)
    const result = await ai.run(model, {
      messages: messages,
      max_tokens: Math.min(originalBody.max_tokens || 2048, 4096),
    });
    responseText = result.response || (typeof result === 'string' ? result : JSON.stringify(result));
  } catch (e1) {
    try {
      // 如果失败，尝试使用 prompt 格式
      const prompt = buildPromptString(messages);
      const result = await ai.run(model, {
        prompt: prompt,
        max_tokens: Math.min(originalBody.max_tokens || 2048, 4096),
      });
      responseText = result.response || (typeof result === 'string' ? result : JSON.stringify(result));
    } catch (e2) {
      return errorResponse(`Model error: ${e1.message || e2.message}`, 500);
    }
  }

  const anthropicResponse = {
    id: `msg_${Date.now()}`,
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

// 流式请求
async function handleStreamRequest(ai, model, messages, originalBody) {
  let stream;
  
  try {
    // 尝试使用 messages 格式
    stream = await ai.run(model, {
      messages: messages,
      max_tokens: Math.min(originalBody.max_tokens || 2048, 4096),
      stream: true
    });
  } catch (e1) {
    try {
      // 如果失败，尝试使用 prompt 格式
      const prompt = buildPromptString(messages);
      stream = await ai.run(model, {
        prompt: prompt,
        max_tokens: Math.min(originalBody.max_tokens || 2048, 4096),
        stream: true
      });
    } catch (e2) {
      return errorResponse(`Model error: ${e1.message || e2.message}`, 500);
    }
  }

  const messageId = `msg_${Date.now()}`;
  
  const { readable, writable } = new TransformStream();
  
  (async () => {
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // 发送 message_start
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

    // 发送 content_block_start
    await writeSSE(writer, encoder, 'content_block_start', {
      type: 'content_block_start',
      index: 0,
      content_block: { type: 'text', text: '' }
    });

    // 读取流 - Cloudflare AI 返回的是 EventSource 格式
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let outputTokens = 0;
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解码数据
        let chunk = '';
        if (typeof value === 'string') {
          chunk = value;
        } else if (value instanceof Uint8Array) {
          chunk = decoder.decode(value, { stream: true });
        }

        buffer += chunk;
        
        // 解析 SSE 格式的数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留不完整的行

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);
            // Cloudflare AI 返回 {"response": "text", ...}
            const text = data.response || '';
            
            if (text) {
              outputTokens += estimateTokens(text);
              await writeSSE(writer, encoder, 'content_block_delta', {
                type: 'content_block_delta',
                index: 0,
                delta: { type: 'text_delta', text: text }
              });
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    } catch (e) {
      console.error('Stream error:', e);
    }

    // 发送 content_block_stop
    await writeSSE(writer, encoder, 'content_block_stop', {
      type: 'content_block_stop',
      index: 0
    });

    // 发送 message_delta
    await writeSSE(writer, encoder, 'message_delta', {
      type: 'message_delta',
      delta: { stop_reason: 'end_turn', stop_sequence: null },
      usage: { output_tokens: outputTokens }
    });

    // 发送 message_stop
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

// 写入 SSE 事件
async function writeSSE(writer, encoder, event, data) {
  await writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
}

// 简单的 token 估算
function estimateTokens(content) {
  if (!content) return 0;
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  return Math.ceil(text.length / 4);
}

// CORS 响应
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

// 错误响应
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
}
