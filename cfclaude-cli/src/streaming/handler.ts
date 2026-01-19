/**
 * Streaming Response Handler
 * Real-time token streaming for better UX
 */

import * as https from 'https';
import * as http from 'http';
import chalk from 'chalk';

export interface StreamOptions {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

export async function streamChat(options: StreamOptions): Promise<void> {
  const url = new URL(options.baseUrl);
  const isHttps = url.protocol === 'https:';
  const client = isHttps ? https : http;

  const requestBody = JSON.stringify({
    model: options.model,
    messages: options.messages,
    max_tokens: 4096,
    stream: true
  });

  return new Promise((resolve, reject) => {
    const req = client.request({
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + '/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', chunk => errorData += chunk);
        res.on('end', () => {
          options.onError(new Error(`API Error: ${res.statusCode} - ${errorData}`));
          reject(new Error(`API Error: ${res.statusCode}`));
        });
        return;
      }

      let fullResponse = '';
      let buffer = '';

      res.on('data', (chunk) => {
        buffer += chunk.toString();
        
        // Process complete SSE events
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              options.onComplete(fullResponse);
              resolve();
              return;
            }

            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                options.onToken(content);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      });

      res.on('end', () => {
        options.onComplete(fullResponse);
        resolve();
      });
    });

    req.on('error', (e) => {
      options.onError(e);
      reject(e);
    });

    req.write(requestBody);
    req.end();
  });
}

export class StreamingPrinter {
  private tokenCount = 0;
  private startTime = Date.now();

  print(token: string): void {
    process.stdout.write(token);
    this.tokenCount++;
  }

  complete(): void {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const tokensPerSecond = this.tokenCount / elapsed;
    
    console.log();
    console.log(chalk.gray(`\n[${this.tokenCount} tokens | ${elapsed.toFixed(1)}s | ${tokensPerSecond.toFixed(1)} tokens/s]`));
  }

  reset(): void {
    this.tokenCount = 0;
    this.startTime = Date.now();
  }
}

