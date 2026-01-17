# CFclaude

一键切换 Claude Code 后端 API 的桌面工具，支持多种模型提供商。

## 功能特点

- 图形化界面，操作简单
- 支持多种 API 提供商
- 自动保存 API 密钥
- 永久设置环境变量

## 支持的提供商

| 提供商 | 说明 |
|--------|------|
| DeepSeek | deepseek-chat, deepseek-reasoner |
| ModelScope 魔塔 | Qwen2.5, DeepSeek-V3 |
| Cloudflare Worker | 自建代理，使用 Cloudflare AI 模型 |
| Anthropic 官方 | Claude Sonnet 4, Opus 4 |

## 安装使用

```bash
# 克隆项目
git clone https://github.com/violettoolssite/CFclaude.git
cd CFclaude

# 安装依赖
npm install

# 启动应用
npm start
```

## 打包

```bash
npm run build
```

生成的可执行文件在 `dist` 目录。

## Cloudflare Worker 代理

`cloudflare-worker/` 目录包含 Cloudflare Worker 代码，可以将 Claude Code 请求转发到 Cloudflare Workers AI 模型。

### 部署 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create Worker**
3. 复制 `cloudflare-worker/worker.js` 代码粘贴
4. 进入 **Settings** → **Bindings** → 添加 **Workers AI**，名称设为 `AI`
5. 部署并获取 Worker URL

### 可用模型

- `@cf/meta/llama-3-8b-instruct`
- `@cf/meta/llama-3.1-8b-instruct`
- `@cf/mistral/mistral-7b-instruct-v0.2`
- `@cf/qwen/qwen1.5-14b-chat-awq`
- `@cf/deepseek-ai/deepseek-math-7b-instruct`
- 更多模型见 Cloudflare Workers AI 文档

## 手动配置

也可以手动设置环境变量：

```powershell
# DeepSeek
[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://api.deepseek.com/anthropic", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "your-api-key", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "deepseek-chat", "User")

# 重启终端后运行 claude
```

## 许可证

MIT License
