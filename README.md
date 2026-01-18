# CFclaude

Claude Code / Qwen Code 多模型切换工具 - 支持 8 大 AI 服务商

## 简介

CFclaude 是一款 Windows 桌面工具，用于快速切换 Claude Code 和 Qwen Code 的 AI 后端服务商。无需手动编辑环境变量，通过图形界面即可完成配置，**配置后自动启动对应的 CLI 工具**。

## 功能特性

- 一键切换 Claude Code / Qwen Code 后端服务商
- 支持 8 大 AI 服务商
- **配置后自动启动 Claude Code 或 Qwen Code**
- **集成 Qwen Code 安装和配置**（阿里云百炼专属工具）
- **实时文件监控**：查看 AI 的文件操作（新建、编辑、删除、读取）
- **操作快照保存**：自动保存每次操作时的文件内容
- **快照回溯功能**：将文件恢复到任意历史快照状态
- 统一网关功能，兼容 OpenRouter、OneAPI、NewAPI
- Cloudflare Worker 一键部署（自动配置 AI Binding 和路由）
- 历史配置记录，快速切换
- 一键安装 Claude Code / Qwen Code 和 Node.js
- 操作状态实时反馈

## 支持的服务商

| 服务商 | API 地址 | 推荐模型 | 启动工具 | 特点 |
|--------|----------|----------|----------|------|
| DeepSeek | api.deepseek.com | deepseek-chat | Claude Code | 编程能力强，性价比高 |
| 豆包 | ark.cn-beijing.volces.com | doubao-seed-code | Claude Code | 视觉理解，原生兼容 |
| Kimi | api.moonshot.cn | kimi-k2 | Claude Code | 超长上下文 128K |
| 通义千问 | dashscope.aliyuncs.com | qwen3-coder-plus | **Qwen Code (OAuth)** | 每天 2000 次免费 |
| 智谱AI | open.bigmodel.cn | glm-4.7 | Claude Code | 稳定可靠，中文优化 |
| ModelScope | api-inference.modelscope.cn | Qwen2.5-Coder-32B | **Qwen Code** | 魔搭社区，OpenAI 兼容 |
| Cloudflare | 自建 Worker | llama-3.1-8b | Claude Code | 完全免费 |
| Anthropic | 官方 | claude-sonnet-4 | Claude Code | 官方 API |

## 下载安装

从 [Releases](https://github.com/violettoolssite/CFclaude/releases) 下载对应平台的安装包：

| 平台 | 文件格式 | 说明 |
|------|----------|------|
| Windows | .exe (便携版) | 下载即用，无需安装 |
| Windows | .exe (安装版) | NSIS 安装程序 |
| Linux | .AppImage | 通用格式，赋予执行权限后运行 |
| Linux | .deb | Debian/Ubuntu 安装包 |
| macOS | .dmg | 支持 Intel 和 Apple Silicon |

系统要求：
- Windows 10/11 x64
- Linux x64 (Ubuntu 20.04+, Debian 11+)
- macOS 10.15+ (Intel / Apple Silicon)

## 使用方法

### Claude Code 配置（大多数服务商）

1. 运行 CFclaude.exe
2. 选择服务商（DeepSeek、Kimi、豆包等）
3. 选择模型
4. 输入 API Key
5. 点击「应用配置」
6. **自动在新窗口启动 Claude Code**

### Qwen Code 配置

**通义千问（OAuth 模式，推荐）**
1. 选择「通义千问」
2. 点击「应用配置」
3. 自动启动 Qwen Code（OAuth 模式）
4. 首次使用需扫码登录 Qwen Chat 账号
5. **每天 2000 次免费调用额度**

**ModelScope（OpenAI 兼容模式）**
1. 选择「ModelScope」
2. 选择模型
3. 输入 ModelScope Access Token
4. 点击「应用配置」
5. 自动配置 OPENAI 环境变量并启动 Qwen Code

**从安装页面配置（自定义）**
1. 点击侧边栏「安装 Qwen Code」
2. 点击「安装 Qwen Code」按钮
3. 输入百炼 API Key
4. 选择模型和地域
5. 点击「应用配置」启动

### Qwen Code 特点

- 专为 Qwen3-Coder 模型优化
- 每天 2000 次免费 API 调用额度
- 100 万 Token 免费额度（北京地域）
- 启动命令：`qwen`


### 统一网关

支持自定义 API 网关地址，兼容 OpenRouter、OneAPI、NewAPI 等。填写统一网关地址后，所有服务商（Cloudflare 和 Anthropic 除外）的请求将通过该网关转发。

### 历史配置

右侧历史配置栏记录最近 10 条配置，点击即可快速切换并自动启动对应的 CLI 工具。

### 文件监控与快照

CFclaude 提供实时文件监控功能，可以观察 AI 对文件的所有操作：

**监控功能**
1. 选择工作目录后点击「开始监控」
2. 实时显示 AI 的文件操作：新建、编辑、删除、读取、目录访问
3. 点击任意操作日志查看详情

**快照功能**
- 每次文件操作自动保存内容快照（限制 500KB）
- 点击「预览代码」查看操作时的文件内容
- 支持代码语法高亮

**回溯功能**
1. 选择某个历史操作
2. 点击「预览代码」查看快照
3. 点击「回溯到此版本」将文件恢复到快照状态
4. 操作日志同步回退，移除后续操作记录

注意：回溯操作会覆盖当前文件内容，无法撤销。

## Cloudflare Worker 部署

如需使用免费的 Cloudflare Workers AI，可通过软件一键部署，或手动部署。

### 一键部署

1. 在软件左侧点击「Cloudflare」
2. 输入 Account ID 和 API Token
3. 点击「一键部署 Worker」
4. 部署完成后复制 Worker URL

### 手动部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 Workers & Pages - Create Worker
3. 复制 `cloudflare-worker/worker.js` 代码粘贴
4. 点击 Deploy
5. 进入 Settings - Bindings
6. 添加 Workers AI，Variable name 填 AI
7. 进入 Settings - Domains & Routes
8. 启用 workers.dev 路由

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

### Claude Code 环境变量

| 变量名 | 说明 |
|--------|------|
| ANTHROPIC_BASE_URL | API 服务地址 |
| ANTHROPIC_AUTH_TOKEN | API 密钥 |
| ANTHROPIC_MODEL | 主模型名称 |
| ANTHROPIC_SMALL_FAST_MODEL | 快速模型名称 |
| API_TIMEOUT_MS | 超时时间 |

### Qwen Code 环境变量

| 变量名 | 说明 |
|--------|------|
| OPENAI_API_KEY | 百炼 API Key |
| OPENAI_BASE_URL | API 服务地址 |
| OPENAI_MODEL | 模型名称 |

## 常见问题

### 配置后 Claude Code 没有生效

配置后会自动在新窗口启动 Claude Code，已包含最新的环境变量。如果手动启动，需要重启终端。

### PowerShell 报错"禁止运行脚本"

工具会自动设置执行策略，如仍有问题，手动运行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### 出现 404 错误

检查 API 地址是否正确。工具会自动移除末尾的 /v1，无需手动添加。

### Cloudflare Worker 报错

确保在 Worker Settings - Bindings 中添加了 Workers AI，Variable name 必须是 AI。

### 如何恢复官方 Claude

点击「清除配置」按钮，然后重启终端。

### 通义千问应该用 Claude Code 还是 Qwen Code？

推荐使用 **Qwen Code**，它是阿里云专门为 Qwen3-Coder 优化的工具，提供每天 2000 次免费额度。

## 项目结构

```
CFclaude/
├── main.js              # Electron 主进程
├── renderer.js          # 渲染进程
├── index.html           # 界面
├── styles.css           # 样式
├── package.json         # 项目配置
├── cloudflare-worker/
│   ├── worker.js
│   ├── wrangler.toml
│   └── README.md
├── website/             # 推广网站
│   ├── index.html
│   ├── style.css
│   └── ...
└── README.md
```

## 开发

```bash
# 安装依赖
npm install

# 运行开发
npm start

# 构建
npm run build
```

## 相关资源

- [DeepSeek 开放平台](https://platform.deepseek.com/)
- [豆包/火山引擎](https://console.volcengine.com/ark/)
- [Kimi 开放平台](https://platform.moonshot.cn/)
- [阿里云百炼](https://dashscope.console.aliyun.com/)
- [Qwen Code 官方文档](https://help.aliyun.com/zh/model-studio/qwen-code)
- [智谱AI](https://open.bigmodel.cn/)
- [ModelScope](https://modelscope.cn/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

## 许可证

MIT License
