# Claude Code -> Cloudflare Workers AI 代理

将 Claude Code 的 Anthropic API 请求转换为 Cloudflare Workers AI 调用，直接使用 Cloudflare 上的免费 AI 模型。

## 可用模型 (Cloudflare Workers AI 免费)

| 模型 | 说明 |
|------|------|
| `@cf/meta/llama-3-8b-instruct` | Llama 3 8B (推荐) |
| `@cf/meta/llama-3.1-8b-instruct` | Llama 3.1 8B |
| `@cf/meta/llama-2-7b-chat-int8` | Llama 2 7B INT8 量化版 |
| `@cf/mistral/mistral-7b-instruct-v0.2` | Mistral 7B |
| `@cf/thebloke/codellama-7b-instruct-awq` | CodeLlama 7B (代码) |
| `@cf/deepseek-ai/deepseek-math-7b-instruct` | DeepSeek Math 7B |
| `@cf/qwen/qwen1.5-14b-chat-awq` | Qwen 1.5 14B |
| `@cf/openchat/openchat-3.5-0106` | OpenChat 3.5 |
| `@cf/google/gemma-7b-it` | Google Gemma 7B |

## 部署步骤

### 方法一：Dashboard 部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create Worker**
3. 命名为 `claude-ai-proxy`
4. 删除默认代码，复制 `worker.js` 全部内容粘贴
5. 点击 **Deploy**
6. 进入 Worker 的 **Settings** → **Bindings**
7. 点击 **Add** → **Workers AI**
8. Variable name 填写 `AI`
9. 保存并重新部署
10. 获取 Worker URL（如 `https://claude-ai-proxy.your-name.workers.dev`）

### 方法二：Wrangler CLI 部署

```bash
# 安装 wrangler
npm install -g wrangler

# 登录
wrangler login

# 进入目录并部署
cd cloudflare-worker
wrangler deploy
```

## 在 Claude Code 中使用

### 方法一：使用 Claude Switch 应用

1. 打开 Claude Switch
2. 选择 **Cloudflare Worker 代理**
3. 输入你的 Worker URL
4. API Key 任意填写
5. 应用配置

### 方法二：手动设置环境变量

```powershell
# PowerShell
$env:ANTHROPIC_BASE_URL = "https://claude-ai-proxy.your-name.workers.dev/v1"
$env:ANTHROPIC_AUTH_TOKEN = "any-value"
$env:ANTHROPIC_MODEL = "claude-sonnet-4-20250514"

# 然后运行
claude
```

永久设置：

```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://claude-ai-proxy.your-name.workers.dev/v1", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "any-value", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "claude-sonnet-4-20250514", "User")
```

## 模型映射

Claude Code 请求的模型会自动映射：

| Claude Code 请求 | 实际使用 |
|------------------|----------|
| claude-sonnet-4-* | Llama 3 8B |
| claude-opus-4-* | Llama 3 8B |
| claude-3-5-haiku-* | Llama 2 7B |

## 免费额度

Cloudflare Workers AI 提供免费额度：
- 每天 10,000 次神经元操作（约等于数千次请求）
- 对于轻度使用完全够用

## 注意事项

1. Workers AI 模型能力与 Claude 有差距，复杂任务可能效果不佳
2. 流式响应已支持
3. 不支持图片输入和工具调用
4. 建议用于学习和测试，重要工作建议使用 DeepSeek 或官方 API
