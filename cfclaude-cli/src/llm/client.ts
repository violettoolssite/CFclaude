/**
 * LLM API Client - Unified interface for multiple providers
 * Supports streaming output
 */

import * as https from 'https';
import * as http from 'http';

interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface Message {
  role: string;
  content: string;
}

type StreamCallback = (chunk: string, done: boolean) => void;

export class LLMClient {
  private config: LLMConfig | null = null;
  private provider: string;

  constructor(provider: string) {
    this.provider = provider;
  }

  configure(config: LLMConfig): void {
    this.config = config;
  }

  setModel(model: string): void {
    if (this.config) {
      this.config.model = model;
    }
  }

  getModel(): string {
    return this.config?.model || 'unknown';
  }

  // 非流式调用（用于工具调用等需要完整响应的场景）
  async chat(messages: Message[]): Promise<string> {
    if (!this.config) {
      throw new Error('LLM client not configured');
    }

    if (this.provider === 'anthropic') {
      return this.chatAnthropic(messages, false);
    } else {
      return this.chatOpenAI(messages, false);
    }
  }

  // 流式调用
  async chatStream(messages: Message[], onChunk: StreamCallback): Promise<string> {
    if (!this.config) {
      throw new Error('LLM client not configured');
    }

    if (this.provider === 'anthropic') {
      return this.chatAnthropic(messages, true, onChunk);
    } else {
      return this.chatOpenAI(messages, true, onChunk);
    }
  }

  private async chatOpenAI(
    messages: Message[], 
    stream: boolean = false,
    onChunk?: StreamCallback
  ): Promise<string> {
    const config = this.config!;
    const url = new URL(config.baseUrl);
    
    const requestBody = JSON.stringify({
      model: config.model,
      messages: messages,
      max_tokens: 8192,
      temperature: 0.7,
      stream: stream
    });

    return new Promise((resolve, reject) => {
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + '/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };

      const req = client.request(options, (res) => {
        if (stream && onChunk) {
          // 流式处理
          let fullContent = '';
          let buffer = '';
          
          res.on('data', (chunk) => {
            buffer += chunk.toString();
            
            // 处理 SSE 格式
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                  onChunk('', true);
                  continue;
                }
                
                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content || '';
                  if (content) {
                    fullContent += content;
                    onChunk(content, false);
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
          });
          
          res.on('end', () => {
            onChunk('', true);
            resolve(fullContent);
          });
          
        } else {
          // 非流式处理
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              if (res.statusCode !== 200) {
                reject(new Error(`API Error: ${res.statusCode} - ${data}`));
                return;
              }
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.message?.content || '';
              resolve(content);
            } catch (e) {
              reject(new Error(`Parse error: ${data}`));
            }
          });
        }
      });

      req.on('error', (e) => reject(e));
      req.write(requestBody);
      req.end();
    });
  }

  private async chatAnthropic(
    messages: Message[],
    stream: boolean = false,
    onChunk?: StreamCallback
  ): Promise<string> {
    const config = this.config!;
    const url = new URL(config.baseUrl);
    
    // Convert to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system');
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

    const requestBody = JSON.stringify({
      model: config.model,
      max_tokens: 8192,
      system: systemMessage?.content || '',
      messages: chatMessages,
      stream: stream
    });

    return new Promise((resolve, reject) => {
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + '/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };

      const req = client.request(options, (res) => {
        if (stream && onChunk) {
          // 流式处理 Anthropic 格式
          let fullContent = '';
          let buffer = '';
          
          res.on('data', (chunk) => {
            buffer += chunk.toString();
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                
                try {
                  const json = JSON.parse(data);
                  
                  if (json.type === 'content_block_delta') {
                    const content = json.delta?.text || '';
                    if (content) {
                      fullContent += content;
                      onChunk(content, false);
                    }
                  } else if (json.type === 'message_stop') {
                    onChunk('', true);
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
          });
          
          res.on('end', () => {
            onChunk('', true);
            resolve(fullContent);
          });
          
        } else {
          // 非流式处理
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              if (res.statusCode !== 200) {
                reject(new Error(`API Error: ${res.statusCode} - ${data}`));
                return;
              }
              const json = JSON.parse(data);
              const content = json.content?.[0]?.text || '';
              resolve(content);
            } catch (e) {
              reject(new Error(`Parse error: ${data}`));
            }
          });
        }
      });

      req.on('error', (e) => reject(e));
      req.write(requestBody);
      req.end();
    });
  }
}
