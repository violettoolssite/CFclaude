# CFclaude

Claude Code / Qwen Code 多模型切换工具 - 支持 8 大 AI 服务商

## 简介

CFclaude 是一款跨平台桌面工具，用于快速切换 Claude Code 和 Qwen Code 的 AI 后端服务商。无需手动编辑环境变量，通过图形界面即可完成配置，**配置后自动启动对应的 CLI 工具**。

## 功能特性

### 三种 CLI 工具支持
- **Claude Code**：适用于大多数服务商（DeepSeek、Kimi、豆包、智谱AI、Anthropic等）
- **Qwen Code**：专为通义千问优化，支持 OAuth 免费额度
- **CFclaude CLI**：内置多服务商 CLI 工具，无需单独安装

### 核心功能
- 一键切换 Claude Code / Qwen Code / CFclaude CLI 后端服务商
- 支持 8+ AI 服务商
- **Sub2API 网关**：内置 6 密钥负载均衡，无需配置即可使用
- **自建网关支持**：支持用户自己搭建的 Sub2API 网关
- **配置后自动启动对应的 CLI 工具**
- **历史配置记录**：记录 CLI 类型，快速切换并自动启动对应工具

### 文件监控与版本控制
- **实时文件监控**：查看 AI 的文件操作（新建、编辑、删除、读取）
- **操作快照保存**：自动保存每次操作时的文件内容（限制 500KB）
- **快照回溯功能**：将文件恢复到任意历史快照状态
- **操作日志回退**：回溯时同步移除后续操作记录

### 其他功能
- 自定义网关功能，兼容 OpenRouter、OneAPI、NewAPI
- Cloudflare Worker 一键部署（自动配置 AI Binding 和路由）
- 一键安装 Claude Code / Qwen Code 和 Node.js
- 集成 Qwen Code 安装和配置（阿里云百炼专属工具）
- 操作状态实时反馈

## 支持的服务商

| 服务商 | API 地址 | 推荐模型 | 启动工具 | 特点 |
|--------|----------|----------|----------|------|
| **Sub2API** | 内置/自建 | claude-sonnet-4.5 | Claude Code / **CFclaude CLI** | **无需 API Key，6 密钥负载均衡** |
| DeepSeek | api.deepseek.com | deepseek-chat | Claude Code / **CFclaude CLI** | 编程能力强，性价比高 |
| 豆包 | ark.cn-beijing.volces.com | doubao-seed-code | Claude Code / **CFclaude CLI** | 视觉理解，原生兼容 |
| Kimi | api.moonshot.cn | kimi-k2 | Claude Code / **CFclaude CLI** | 超长上下文 128K |
| 通义千问 | dashscope.aliyuncs.com | qwen3-coder-plus | **Qwen Code (OAuth)** / CFclaude CLI | 每天 2000 次免费 |
| 智谱AI | open.bigmodel.cn | glm-4.7 | Claude Code / **CFclaude CLI** | 稳定可靠，中文优化 |
| ModelScope | api-inference.modelscope.cn | Qwen2.5-Coder-32B | **Qwen Code** / CFclaude CLI | 魔搭社区，OpenAI 兼容 |
| NVIDIA NIM | integrate.api.nvidia.com | GLM 4.7、MiniMax M2.1 | **Qwen Code** / CFclaude CLI | 企业级推理，多模型 |
| Cloudflare | 自建 Worker | llama-3.1-8b | Claude Code / **CFclaude CLI** | 完全免费 |
| Anthropic | 官方 | claude-sonnet-4 | Claude Code / **CFclaude CLI** | 官方 API |

**说明：**
- **粗体** 表示推荐使用的工具
- CFclaude CLI 支持所有服务商，包括第三方网关

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

### Sub2API 网关（推荐，无需 API Key）

**内置网关模式（最简单）**
1. 运行 CFclaude
2. 点击侧边栏「推荐网关」
3. 选择「内置网关」模式（默认）
4. 选择模型（Claude Sonnet 4.5 推荐）
5. 点击「启动 Claude Code」
6. **无需输入任何 API Key，6 密钥自动负载均衡**

**自建网关模式**
1. 点击侧边栏「推荐网关」
2. 选择「自建网关」模式
3. 输入你的 Sub2API 网关地址
4. 输入 API Key
5. 点击「启动 Claude Code」

Sub2API 项目地址：https://github.com/AIPro-ltd/sub2api

### Claude Code 配置（大多数服务商）

1. 运行 CFclaude
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

### CFclaude CLI（内置工具）

**新增功能：** 无需单独安装 Claude Code 或 Qwen Code，直接使用内置的 CFclaude CLI！

**使用方法：**
1. 点击侧边栏「CFclaude CLI」
2. 选择服务商和模型
3. 输入认证信息：
   - 大多数服务商：输入 API Key
   - **Cloudflare**：输入 Worker 地址（如 `https://your-worker.workers.dev`）
4. 选择工作目录（可选）
5. 点击「启动 CFclaude CLI」

**特点：**
- 支持所有服务商（DeepSeek、Kimi、豆包、通义千问、智谱AI、NVIDIA、ModelScope、Anthropic、Cloudflare等）
- 支持自定义网关和第三方 API 网关
- 自动保存到历史配置，一键切换
- 完全集成到主程序，无需外部依赖
- 支持自定义模型添加
- 启动命令：`cfclaude`


### 自定义网关

支持自定义 API 网关地址，兼容 OpenRouter、OneAPI、NewAPI 等。填写自定义网关地址后，所有服务商（Cloudflare 和 Anthropic 除外）的请求将通过该网关转发。

### 历史配置

右侧历史配置栏记录最近 10 条配置，包含：
- 服务商和模型信息
- **CLI 工具类型**（Claude Code / Qwen Code / CFclaude CLI）
- 认证方式（API / OAuth / 网关）
- 工作目录
- 配置时间

点击任意历史配置即可：
1. 自动切换到对应的服务商配置
2. **自动启动对应的 CLI 工具**（Claude Code、Qwen Code 或 CFclaude CLI）
3. 自动应用工作目录

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

### Sub2API 内置网关响应很慢

内置网关可能响应较慢（约 1 分钟），这是正常现象。如果需要更快的响应速度，可以：
1. 自己搭建 Sub2API 网关
2. 使用其他服务商（如 DeepSeek、Kimi）

### 如何自建 Sub2API 网关

1. 访问 https://github.com/AIPro-ltd/sub2api
2. 按照项目说明部署到你的服务器
3. 在 CFclaude 中选择「自建网关」模式
4. 输入你的网关地址和 API Key

## 项目结构

```
CFclaude/
├── main.js              # Electron 主进程（IPC、CLI 启动、文件监控）
├── renderer.js          # 渲染进程（UI、配置管理、历史系统）
├── index.html           # 界面
├── styles.css           # 样式
├── package.json         # 项目配置
├── cfclaude-cli/        # 内置 CLI 工具（TypeScript）
│   ├── src/
│   │   ├── chat.ts          # 主聊天循环
│   │   ├── config.ts        # 配置管理
│   │   ├── index.ts         # 入口文件
│   │   ├── tools/           # 工具执行（read/write/edit/delete等）
│   │   ├── llm/             # LLM 客户端
│   │   ├── providers/       # 服务商配置
│   │   └── ui/              # TUI 界面
│   ├── dist/                # 编译输出（打包时包含）
│   ├── package.json
│   ├── tsconfig.json
│   └── CHANGELOG.md
├── cloudflare-worker/
│   ├── worker.js
│   ├── wrangler.toml
│   └── README.md
├── website/             # 推广网站
│   ├── index.html
│   ├── style.css
│   └── ...
├── README.md
└── CLAUDE.md           # Claude Code 开发指南
```

## 开发

### 主应用开发

```bash
# 安装依赖（自动安装 cfclaude-cli 依赖）
npm install

# 运行开发模式
npm start

# 构建（自动编译 CLI 工具）
npm run build           # 当前平台
npm run build:win       # Windows (portable + NSIS)
npm run build:linux     # Linux (AppImage + deb)
npm run build:mac       # macOS (dmg)
```

### CFclaude CLI 开发

```bash
# 进入 CLI 目录
cd cfclaude-cli

# 安装依赖
npm install

# 开发模式（ts-node）
npm run dev

# 编译 TypeScript
npm run build

# 运行编译后的 CLI
npm start

# 或直接运行
node dist/index.js
```

### 构建流程说明

1. **主应用构建时**会自动执行 `prebuild` 脚本
2. `prebuild` 脚本会自动编译 cfclaude-cli
3. 编译后的 `cfclaude-cli/dist/` 会被打包到 Electron 应用中
4. 打包后的应用可在 `release/` 目录找到

### 开发注意事项

- 修改 CLI 代码后需要重新编译：`cd cfclaude-cli && npm run build`
- 主应用会从 `cfclaude-cli/dist/index.js` 启动 CLI
- 开发模式下 CLI 路径：`__dirname/cfclaude-cli/dist/`
- 打包模式下 CLI 路径：`process.resourcesPath/cfclaude-cli/dist/`

## 相关资源

- [Sub2API 项目](https://github.com/AIPro-ltd/sub2api) - 自建 API 网关
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
