# CFclaude

让 Claude Code 使用 Cloudflare Workers AI 免费模型的解决方案。

## 快速开始

### 1. 部署 Cloudflare Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create Worker**
3. 复制 `cloudflare-worker/worker.js` 代码粘贴到编辑器
4. 点击 **Deploy**
5. 进入 **Settings** → **Bindings** → 添加 **Workers AI**，Variable name 设为 `AI`
6. 保存并重新部署
7. 记录你的 Worker URL（如 `https://xxx.workers.dev`）

### 2. 配置 Claude Code

**方法一：使用 CFclaude 工具（推荐）**

下载 `release/CFclaude.exe` 运行，选择 **Cloudflare Worker 代理**，输入你的 Worker URL 即可。

**方法二：手动配置环境变量**

```powershell
# PowerShell 永久设置
[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://你的worker.workers.dev", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "any", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "@cf/meta/llama-3-8b-instruct", "User")
```

重启终端后运行 `claude` 即可。

## 可用模型

| 模型 | 说明 |
|------|------|
| `@cf/meta/llama-3-8b-instruct` | Llama 3 8B (推荐) |
| `@cf/meta/llama-3.1-8b-instruct` | Llama 3.1 8B |
| `@cf/meta/llama-2-7b-chat-int8` | Llama 2 7B |
| `@cf/mistral/mistral-7b-instruct-v0.2` | Mistral 7B |
| `@cf/qwen/qwen1.5-14b-chat-awq` | Qwen 1.5 14B |
| `@cf/deepseek-ai/deepseek-math-7b-instruct` | DeepSeek Math 7B |
| `@cf/openchat/openchat-3.5-0106` | OpenChat 3.5 |
| `@cf/google/gemma-7b-it` | Google Gemma 7B |

## 其他支持的提供商

CFclaude 工具还支持：

- **DeepSeek** - deepseek-chat, deepseek-reasoner
- **ModelScope 魔塔** - Qwen2.5 系列
- **Anthropic 官方** - Claude Sonnet/Opus

## 免费额度

Cloudflare Workers AI 提供免费额度，每天约可进行数千次对话，适合个人学习使用。

## 许可证

MIT License
