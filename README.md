# CFclaude

Claude Code 模型切换工具 - 让 Claude Code 使用多种 AI 服务商。

## 功能特点

- 🔄 **一键切换** - 支持多个 AI 服务商快速切换
- 🌐 **统一网关** - 支持自定义 API 网关代理
- 🆓 **免费方案** - 支持 Cloudflare Workers AI 免费模型
- 💾 **配置记忆** - 自动显示上次配置的模型信息

## 支持的服务商

| 服务商 | 特点 | 费用 |
|--------|------|------|
| **DeepSeek** | 国产编程首选，能力强 | 付费 |
| **豆包** | 字节跳动，视觉理解 | 付费 |
| **Kimi** | 月之暗面，长上下文 | 付费 |
| **通义千问** | 阿里云，Qwen3-Coder | 付费 |
| **智谱AI** | GLM-4.7，稳定可靠 | 付费 |
| **ModelScope** | 魔搭社区 | 付费 |
| **Cloudflare** | Workers AI | 免费 |
| **Anthropic** | 官方 Claude | 付费 |

## 快速开始

### 下载

从 [Releases](https://github.com/violettoolssite/CFclaude/releases) 下载 `CFclaude.exe`

### 使用

1. 运行 `CFclaude.exe`
2. （可选）填写统一网关地址
3. 选择服务商
4. 选择模型
5. 输入 API Key
6. 点击 **应用配置**
7. 重启终端，运行 `claude`

## 统一网关

如果你使用 API 代理服务（如 OpenRouter、OneAPI 等），可以在 "统一网关" 输入框填入代理地址。所有服务商（除 Cloudflare 和 Anthropic）都会通过该网关访问。

留空则使用各服务商的默认地址。

## Cloudflare Worker 部署

如果使用 Cloudflare 免费方案，需要先部署 Worker：

### 1. 创建 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **Workers & Pages** → **Create** → **Create Worker**
3. 取名后点击 **Deploy**
4. 点击 **Edit code**
5. 删除默认代码，复制 `cloudflare-worker/worker.js` 粘贴
6. 点击 **Deploy**

### 2. 绑定 AI

1. 进入 Worker 的 **Settings** → **Bindings**
2. 点击 **Add** → **Workers AI**
3. Variable name 填写 `AI`（必须大写）
4. 点击 **Deploy**

### 3. 配置

在 CFclaude 工具中：
1. 选择 **Cloudflare**
2. 输入 Worker URL（如 `https://xxx.workers.dev`）
3. 选择模型
4. 应用配置

## 可用模型

### Cloudflare Workers AI（免费）

| 模型 | 说明 |
|------|------|
| `@cf/meta/llama-3.1-8b-instruct` | 推荐，综合能力强 |
| `@cf/meta/llama-3.2-3b-instruct` | 速度快 |
| `@cf/mistral/mistral-7b-instruct-v0.1` | 推理能力好 |
| `@cf/deepseek-ai/deepseek-math-7b-instruct` | 数学能力强 |
| `@cf/openchat/openchat-3.5-0106` | 对话优化 |
| `@cf/qwen/qwen1.5-7b-chat-awq` | 中文友好 |

### 其他服务商

各服务商的模型列表已内置在工具中，选择服务商后会自动显示可用模型。

## API Key 获取

| 服务商 | 获取地址 |
|--------|----------|
| DeepSeek | https://platform.deepseek.com/ |
| 豆包 | https://console.volcengine.com/ark/ |
| Kimi | https://platform.moonshot.cn/ |
| 通义千问 | https://dashscope.console.aliyun.com/ |
| 智谱AI | https://open.bigmodel.cn/ |
| ModelScope | https://modelscope.cn/ |

## 常见问题

### Q: 配置后 Claude Code 无法使用

重启终端后环境变量才会生效。

### Q: 出现 404 错误

检查 URL 是否正确，不要包含末尾的 `/v1`。

### Q: Cloudflare Worker 报错

确保已绑定 Workers AI，Variable name 必须是 `AI`（大写）。

### Q: 清除配置

点击 **清除配置** 按钮，Claude Code 将恢复使用官方 API。

## 更新日志

### v1.1.0

- 新增统一网关功能
- 新增服务商：豆包、Kimi、通义千问
- 自动记忆上次配置
- 优化界面布局
- 固定窗口大小

### v1.0.0

- 初始版本
- 支持 DeepSeek、智谱AI、ModelScope、Cloudflare、Anthropic

## 项目结构

```
CFclaude/
├── cloudflare-worker/
│   ├── worker.js       # Cloudflare Worker 代码
│   ├── wrangler.toml   # Wrangler 配置
│   └── README.md
├── main.js             # Electron 主进程
├── index.html          # 界面
├── styles.css          # 样式
├── renderer.js         # 渲染进程
├── package.json
└── README.md
```

## 许可证

MIT License
