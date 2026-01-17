# CFclaude

让 Claude Code 使用 Cloudflare Workers AI 免费模型的完整解决方案。

通过部署一个 Cloudflare Worker 作为 API 代理，将 Claude Code 的请求转发到 Cloudflare Workers AI，实现免费使用 AI 编程助手。

## 目录

- [功能特点](#功能特点)
- [快速开始](#快速开始)
- [部署 Worker](#部署-worker)
- [配置 Claude Code](#配置-claude-code)
- [可用模型](#可用模型)
- [CFclaude 工具](#cfclaude-工具)
- [常见问题](#常见问题)
- [许可证](#许可证)

## 功能特点

- 🆓 **完全免费** - 使用 Cloudflare Workers AI 免费额度
- 🚀 **简单部署** - 只需复制粘贴代码到 Cloudflare
- 🔄 **自动转换** - 自动将 Anthropic API 格式转换为 Workers AI 格式
- 📡 **流式输出** - 支持实时流式响应
- 🛠️ **图形工具** - 提供 Windows 桌面工具一键配置

## 快速开始

### 前置要求

- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)（免费）
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 已安装

### 三步完成配置

1. **部署 Worker** → 复制代码到 Cloudflare
2. **绑定 AI** → 在 Worker 设置中添加 Workers AI
3. **配置环境变量** → 设置 `ANTHROPIC_BASE_URL` 指向你的 Worker

## 部署 Worker

### 方法一：Dashboard 部署（推荐新手）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)

2. 点击左侧菜单 **Workers & Pages**

3. 点击 **Create** → **Create Worker**

4. 给 Worker 取个名字（如 `claude-ai-proxy`）

5. 点击 **Deploy** 先部署一个空 Worker

6. 点击 **Edit code**，删除所有默认代码

7. 复制 `cloudflare-worker/worker.js` 的全部内容粘贴进去

8. 点击右上角 **Deploy** 保存

9. 返回 Worker 页面，进入 **Settings** → **Bindings**

10. 点击 **Add** → **Workers AI**

11. Variable name 填写 `AI`（必须大写）

12. 点击 **Deploy** 保存设置

13. 记录你的 Worker URL，格式如：`https://claude-ai-proxy.你的用户名.workers.dev`

### 方法二：Wrangler CLI 部署

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 进入 worker 目录
cd cloudflare-worker

# 部署
wrangler deploy
```

### 验证部署

在浏览器访问你的 Worker URL，应该看到：

```json
{
  "status": "ok",
  "provider": "Cloudflare Workers AI",
  "models": ["@cf/meta/llama-3-8b-instruct", ...],
  "message": "Claude Code -> Cloudflare AI Proxy"
}
```

## 配置 Claude Code

### 方法一：使用 CFclaude 工具（推荐）

1. 从 [Releases](https://github.com/violettoolssite/CFclaude/releases) 下载 `CFclaude.exe`
2. 运行程序
3. 选择 **Cloudflare Worker 代理**
4. 输入你的 Worker URL
5. API Key 随意填写（Worker 不验证）
6. 点击 **应用配置**
7. 重启终端，运行 `claude`

### 方法二：手动设置环境变量

**Windows PowerShell（永久生效）：**

```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://你的worker.workers.dev", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "any-value", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "@cf/meta/llama-3-8b-instruct", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_SMALL_FAST_MODEL", "@cf/meta/llama-3-8b-instruct", "User")
[Environment]::SetEnvironmentVariable("API_TIMEOUT_MS", "600000", "User")
```

**Windows CMD（临时）：**

```cmd
set ANTHROPIC_BASE_URL=https://你的worker.workers.dev
set ANTHROPIC_AUTH_TOKEN=any-value
set ANTHROPIC_MODEL=@cf/meta/llama-3-8b-instruct
claude
```

**Linux/macOS：**

```bash
export ANTHROPIC_BASE_URL="https://你的worker.workers.dev"
export ANTHROPIC_AUTH_TOKEN="any-value"
export ANTHROPIC_MODEL="@cf/meta/llama-3-8b-instruct"
claude
```

添加到 `~/.bashrc` 或 `~/.zshrc` 可永久生效。

## 可用模型

以下是 Cloudflare Workers AI 确认可用的文本生成模型：

| 模型 | 参数量 | 说明 |
|------|--------|------|
| `@cf/meta/llama-3.1-8b-instruct` | 8B | **推荐** - Llama 3.1，综合能力强 |
| `@cf/meta/llama-3.2-3b-instruct` | 3B | Llama 3.2，速度快 |
| `@cf/meta/llama-3.2-1b-instruct` | 1B | Llama 3.2，最快速度 |
| `@cf/mistral/mistral-7b-instruct-v0.1` | 7B | Mistral，推理能力好 |
| `@cf/deepseek-ai/deepseek-math-7b-instruct` | 7B | DeepSeek，数学能力强 |
| `@cf/openchat/openchat-3.5-0106` | 7B | OpenChat，对话优化 |
| `@cf/qwen/qwen1.5-7b-chat-awq` | 7B | 通义千问，中文友好 |

### 在 Claude Code 中切换模型

```
/model @cf/meta/llama-3-8b-instruct
```

## CFclaude 工具

`release/CFclaude.exe` 是一个 Windows 桌面工具，用于快速配置 Claude Code 的 API 提供商。

### 支持的提供商

| 提供商 | 说明 | 是否免费 |
|--------|------|----------|
| Cloudflare Worker | 自建代理，使用 Workers AI | ✅ 免费 |
| DeepSeek | deepseek-chat, deepseek-reasoner | 💰 付费 |
| ModelScope 魔塔 | Qwen2.5 系列 | 💰 付费 |
| Anthropic 官方 | Claude Sonnet/Opus | 💰 付费 |

### 使用说明

1. 运行 `CFclaude.exe`
2. 选择提供商
3. 填写必要信息（URL、API Key 等）
4. 点击 **应用配置**
5. 重启终端即可生效

## 常见问题

### Q: 出现 404 Not Found 错误

检查 Worker URL 是否正确，确保没有多余的 `/v1` 后缀。正确格式：
- ✅ `https://xxx.workers.dev`
- ❌ `https://xxx.workers.dev/v1`

### Q: 出现 AI binding not configured 错误

在 Worker 的 Settings → Bindings 中添加 Workers AI，Variable name 必须是 `AI`（大写）。

### Q: 响应很慢或超时

Cloudflare Workers AI 免费版有速率限制，高峰期可能较慢。可以尝试：
- 使用参数更小的模型（如 llama-2-7b-chat-int8）
- 稍后再试

### Q: 模型能力不如 Claude

这是正常的。Cloudflare Workers AI 提供的是开源模型（Llama、Mistral 等），能力确实不如 Claude。适合学习和轻度使用，重要工作建议使用官方 API。

### Q: 免费额度是多少

Cloudflare Workers AI 免费版提供：
- 每天约 10,000 次神经元操作
- 约等于数千次普通对话
- 对于个人学习完全够用

### Q: 支持图片和工具调用吗

目前不支持。Worker 只处理纯文本对话。

## 项目结构

```
CFclaude/
├── cloudflare-worker/
│   ├── worker.js       # Cloudflare Worker 代码
│   ├── wrangler.toml   # Wrangler 配置文件
│   └── README.md       # Worker 说明
├── README.md           # 本文档
└── Releases            # CFclaude.exe 在 GitHub Releases 下载
```

## 许可证

MIT License

## 致谢

- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Meta Llama](https://llama.meta.com/)
