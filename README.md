# CFclaude

Claude Code 多模型切换工具 - 一键配置多个 AI 服务商

## 简介

CFclaude 是一款 Windows 桌面工具，用于快速切换 Claude Code 的 AI 后端服务商。无需手动编辑环境变量，通过图形界面即可完成配置。


## 支持的服务商

| 服务商 | API 地址 | 推荐模型 | 特点 |
|--------|----------|----------|------|
| DeepSeek | api.deepseek.com | deepseek-chat | 编程能力强，性价比高 |
| 豆包 | ark.cn-beijing.volces.com | doubao-seed-code | 视觉理解，原生兼容 |
| Kimi | api.moonshot.cn | kimi-k2 | 超长上下文 128K |
| 通义千问 | dashscope.aliyuncs.com | qwen3-coder | 阿里云编程模型 |
| 智谱AI | open.bigmodel.cn | glm-4.7 | 稳定可靠，中文优化 |
| ModelScope | api-inference.modelscope.cn | Qwen2.5-72B | 魔搭社区 |
| Cloudflare | 自建 Worker | llama-3.1-8b | 完全免费 |
| Anthropic | 官方 | claude-sonnet-4 | 官方 API |

## 下载安装

从 [Releases](https://github.com/violettoolssite/CFclaude/releases) 下载 `CFclaude.exe`

## 使用方法

1. 运行 CFclaude.exe
2. 选择服务商
3. 选择模型
4. 输入 API Key
5. 点击「应用配置」
6. 重启终端，运行 claude

### 统一网关

支持自定义 API 网关地址，兼容 OpenRouter、OneAPI、NewAPI 等。填写统一网关地址后，所有服务商的请求将通过该网关转发。

## Cloudflare Worker 部署

如需使用免费的 Cloudflare Workers AI，需要自行部署 Worker。

### 部署步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 Workers & Pages - Create Worker
3. 复制 `cloudflare-worker/worker.js` 代码粘贴
4. 点击 Deploy
5. 进入 Settings - Bindings
6. 添加 Workers AI，Variable name 填 `AI`
7. 点击 Deploy 保存

### 可用模型

| 模型 | 说明 |
|------|------|
| @cf/meta/llama-3.1-8b-instruct | 推荐，综合能力强 |
| @cf/meta/llama-3.2-3b-instruct | 速度快 |
| @cf/mistral/mistral-7b-instruct-v0.1 | 推理能力好 |
| @cf/deepseek-ai/deepseek-math-7b-instruct | 数学能力强 |
| @cf/openchat/openchat-3.5-0106 | 对话优化 |
| @cf/qwen/qwen1.5-7b-chat-awq | 中文友好 |

## 环境变量

工具会自动设置以下用户级环境变量：

| 变量名 | 说明 |
|--------|------|
| ANTHROPIC_BASE_URL | API 服务地址 |
| ANTHROPIC_AUTH_TOKEN | API 密钥 |
| ANTHROPIC_MODEL | 主模型名称 |
| ANTHROPIC_SMALL_FAST_MODEL | 快速模型名称 |
| API_TIMEOUT_MS | 超时时间 |

## 常见问题

### 配置后 Claude Code 没有生效

需要重启终端或新开终端窗口才能加载新的环境变量。

### 出现 404 错误

检查 API 地址是否正确。工具会自动移除末尾的 /v1，无需手动添加。

### Cloudflare Worker 报错

确保在 Worker Settings - Bindings 中添加了 Workers AI，Variable name 必须是 AI。

### 如何恢复官方 Claude

点击「清除配置」按钮，然后重启终端。

## 项目结构

```
CFclaude/
├── cloudflare-worker/      # 开源
│   ├── worker.js
│   ├── wrangler.toml
│   └── README.md
└── README.md
```

## 相关资源

- [DeepSeek 开放平台](https://platform.deepseek.com/)
- [豆包/火山引擎](https://console.volcengine.com/ark/)
- [Kimi 开放平台](https://platform.moonshot.cn/)
- [阿里云灵积](https://dashscope.console.aliyun.com/)
- [智谱AI](https://open.bigmodel.cn/)
- [ModelScope](https://modelscope.cn/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

## 许可证

MIT License
