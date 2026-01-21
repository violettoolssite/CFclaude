# CFclaude

CF Coder 桌面版 - 多模型 AI 编程助手

[![Build and Release](https://github.com/violettoolssite/CFclaude/actions/workflows/build.yml/badge.svg)](https://github.com/violettoolssite/CFclaude/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/violettoolssite/CFclaude)](https://github.com/violettoolssite/CFclaude/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-blue)](https://github.com/violettoolssite/CFclaude/releases)

---

## 目录

- [简介](#简介)
- [功能特性](#功能特性)
- [支持的服务商](#支持的服务商)
- [下载安装](#下载安装)
- [快速开始](#快速开始)
- [详细配置指南](#详细配置指南)
- [环境变量参考](#环境变量参考)
- [Cloudflare Worker 部署](#cloudflare-worker-部署)
- [文件监控与快照](#文件监控与快照)
- [开发指南](#开发指南)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 简介

CFclaude 是一款跨平台桌面应用，旨在简化 AI 编程助手的配置和管理。它集成了多种 CLI 工具（Claude Code、Qwen Code、CF Coder），支持快速切换多个 AI 服务商，无需手动编辑环境变量或配置文件。

### 为什么选择 CFclaude？

- **零配置复杂度**：图形化界面，无需手动编辑环境变量
- **多服务商支持**：一个工具管理所有 AI 服务商
- **内置 CLI**：无需单独安装 Claude Code 或 Qwen Code
- **跨平台**：Windows、Linux、macOS 全平台支持
- **开源免费**：MIT 许可证，完全开源

---

## 功能特性

### 核心功能

| 功能 | 描述 |
|------|------|
| 多服务商切换 | 支持 9+ AI 服务商，一键切换 |
| 三种 CLI 工具 | Claude Code、Qwen Code、CF Coder（内置） |
| 历史配置 | 保存最近 10 条配置，一键恢复 |
| 自动启动 | 配置完成后自动启动对应的 CLI 工具 |
| 自定义网关 | 支持 OpenRouter、OneAPI、NewAPI 等第三方网关 |

### 文件监控

| 功能 | 描述 |
|------|------|
| 实时监控 | 查看 AI 的文件操作（新建、编辑、删除、读取） |
| 操作快照 | 自动保存每次操作时的文件内容（最大 500KB） |
| 快照回溯 | 将文件恢复到任意历史快照状态 |
| 日志回退 | 回溯时同步移除后续操作记录 |

### Cloudflare Worker

| 功能 | 描述 |
|------|------|
| 一键部署 | 自动配置 AI Binding 和路由 |
| 免费额度 | 使用 Cloudflare Workers AI 免费模型 |
| 多模型支持 | Llama、Mistral、DeepSeek、Qwen 等 |

---

## 支持的服务商

### 服务商列表

| 服务商 | API 格式 | 推荐模型 | 启动工具 | 特点 |
|--------|----------|----------|----------|------|
| DeepSeek | Anthropic | deepseek-chat, deepseek-reasoner | Claude Code | 编程能力强，性价比高 |
| Kimi | Anthropic | kimi-k2-turbo-preview | Claude Code | 超长上下文 128K |
| 豆包 | Anthropic | doubao-seed-code | Claude Code | 视觉理解，原生兼容 |
| 智谱AI | Anthropic | glm-4.7 | Claude Code | 稳定可靠，中文优化 |
| 通义千问 | OpenAI | qwen3-coder-plus | Qwen Code (OAuth) | 每天 2000 次免费 |
| ModelScope | OpenAI | Qwen2.5-Coder-32B | Qwen Code | 魔搭社区，免费额度 |
| NVIDIA NIM | OpenAI | GLM 4.7, MiniMax M2.1 | Qwen Code | 企业级推理 |
| Anthropic | Anthropic | claude-sonnet-4 | Claude Code | 官方 API |
| Cloudflare | Anthropic | @cf/meta/llama-3.1-8b | Claude Code | 完全免费 |

### API 端点详情

**Anthropic 格式端点（用于 Claude Code）：**

| 服务商 | ANTHROPIC_BASE_URL | 说明 |
|--------|-------------------|------|
| DeepSeek | `https://api.deepseek.com/anthropic` | Anthropic 兼容端点 |
| Kimi | `https://api.moonshot.cn/anthropic` | Anthropic 兼容端点 |
| 豆包 | `https://ark.cn-beijing.volces.com/api/coding` | Coding 专用端点 |
| 智谱AI | `https://open.bigmodel.cn/api/anthropic` | Anthropic 兼容端点 |
| Anthropic | 留空（使用官方默认） | 官方 API |

**OpenAI 格式端点（用于 Qwen Code / CF Coder）：**

| 服务商 | OPENAI_BASE_URL | 说明 |
|--------|-----------------|------|
| DeepSeek | `https://api.deepseek.com/v1` | v1 与模型版本无关 |
| Kimi | `https://api.moonshot.cn/v1` | OpenAI 兼容端点 |
| 豆包 | `https://ark.cn-beijing.volces.com/api/v3` | OpenAI 兼容端点 |
| 智谱AI (通用) | `https://open.bigmodel.cn/api/paas/v4` | 通用 API 端点 |
| 智谱AI (Coding) | `https://open.bigmodel.cn/api/coding/paas/v4` | Coding 专用端点 |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI 兼容模式 |
| ModelScope | `https://api-inference.modelscope.cn/v1` | 魔搭社区 |
| NVIDIA NIM | `https://integrate.api.nvidia.com/v1` | 企业级推理 |

> **注意**：智谱AI 的 Coding 端点仅限 Coding 场景，通用场景请使用通用端点。

### API Key 获取方式

| 服务商 | 获取地址 | 说明 |
|--------|----------|------|
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com/) | 注册后创建 API Key |
| Kimi | [platform.moonshot.cn](https://platform.moonshot.cn/) | 注册后创建 API Key |
| 豆包 | [console.volcengine.com/ark](https://console.volcengine.com/ark/) | 火山引擎控制台 |
| 通义千问 | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com/) | 阿里云百炼平台 |
| 智谱AI | [open.bigmodel.cn](https://open.bigmodel.cn/) | 注册后创建 API Key |
| ModelScope | [modelscope.cn](https://modelscope.cn/) | 个人中心 - Access Token |
| NVIDIA NIM | [build.nvidia.com](https://build.nvidia.com/) | 注册后获取 API Key |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) | 官方控制台 |

---

## 下载安装

### 下载地址

从 [GitHub Releases](https://github.com/violettoolssite/CFclaude/releases) 下载最新版本。

### 安装包说明

| 平台 | 文件名 | 格式 | 说明 |
|------|--------|------|------|
| Windows | CFclaude-x.x.x-win-x64.exe | 便携版 | 下载即用，无需安装 |
| Windows | CFclaude-x.x.x-win-x64.exe | 安装版 | NSIS 安装程序 |
| Linux | CFclaude-x.x.x-linux-x64.AppImage | AppImage | 通用格式，赋予执行权限后运行 |
| Linux | CFclaude-x.x.x-linux-x64.deb | deb | Debian/Ubuntu 安装包 |
| macOS | CFclaude-x.x.x-mac-x64.dmg | dmg | Intel Mac |
| macOS | CFclaude-x.x.x-mac-arm64.dmg | dmg | Apple Silicon (M1/M2/M3) |

### 系统要求

| 平台 | 最低要求 |
|------|----------|
| Windows | Windows 10/11 x64 |
| Linux | Ubuntu 20.04+ / Debian 11+ x64 |
| macOS | macOS 10.15+ (Catalina 或更高) |

### Linux 安装说明

**AppImage：**
```bash
chmod +x CFclaude-x.x.x-linux-x64.AppImage
./CFclaude-x.x.x-linux-x64.AppImage
```

**deb：**
```bash
sudo dpkg -i CFclaude-x.x.x-linux-x64.deb
```

---

## 快速开始

### 方式一：桌面应用（推荐）

1. **下载并运行** CFclaude
2. **点击侧边栏**「CF Coder」
3. **选择服务商**（如 DeepSeek）
4. **选择模型**（如 deepseek-chat）
5. **输入 API Key**
6. **点击**「启动内置 CF Coder」
7. **开始编程**！

### 方式二：命令行直接运行

直接运行 CLI 会显示配置提示：

```
+--------------------------------------------------------------+
|                    CF Coder v2.0.0                           |
+--------------------------------------------------------------+
|                                                              |
|  [!] 未检测到配置，请通过以下方式使用:                       |
|                                                              |
|  [1] 下载桌面应用:                                           |
|      https://github.com/violettoolssite/CFclaude/releases    |
|                                                              |
|  [2] 或在桌面应用中点击「启动内置 CF Coder」                  |
|                                                              |
+--------------------------------------------------------------+
|  手动配置环境变量后也可直接运行:                             |
|  $env:CF_CODER_PROVIDER = 'deepseek'                         |
|  $env:OPENAI_API_KEY = 'your-api-key'                        |
|  $env:OPENAI_BASE_URL = 'https://api.deepseek.com/v1'        |
+--------------------------------------------------------------+
```

---

## 详细配置指南

### CF Coder 配置（内置工具，推荐）

CF Coder 是内置的 CLI 工具，无需单独安装。

**桌面应用配置：**
1. 点击侧边栏「CF Coder」
2. 选择服务商
3. 选择模型
4. 输入认证信息：
   - OpenAI 兼容服务商：输入 API Key
   - Cloudflare：输入 Worker 地址（如 `https://your-worker.workers.dev`）
5. 选择工作目录（可选）
6. 点击「启动内置 CF Coder」

**命令行配置（Windows PowerShell）：**
```powershell
# 必需：设置服务商
$env:CF_CODER_PROVIDER = 'deepseek'

# 必需：设置模型
$env:CF_CODER_MODEL = 'deepseek-chat'

# 必需：设置 API Key（OpenAI 兼容格式）
$env:OPENAI_API_KEY = 'sk-your-api-key'

# 必需：设置 API Base URL
$env:OPENAI_BASE_URL = 'https://api.deepseek.com/v1'

# 可选：启用颜色输出
$env:FORCE_COLOR = '1'

# 运行 CLI
node cfclaude-cli/dist/cf.js
```

**命令行配置（Linux/macOS）：**
```bash
# 必需：设置服务商
export CF_CODER_PROVIDER=deepseek

# 必需：设置模型
export CF_CODER_MODEL=deepseek-chat

# 必需：设置 API Key（OpenAI 兼容格式）
export OPENAI_API_KEY=sk-your-api-key

# 必需：设置 API Base URL
export OPENAI_BASE_URL=https://api.deepseek.com/v1

# 运行 CLI
node cfclaude-cli/dist/cf.js
```

### Claude Code 配置

适用于已安装 Claude Code 的用户。

**安装 Claude Code：**
```bash
npm install -g @anthropic-ai/claude-code
```

**桌面应用配置：**
1. 选择服务商
2. 选择模型
3. 输入 API Key
4. 点击「应用配置」
5. 自动在新窗口启动 Claude Code

**环境变量：**
```powershell
$env:ANTHROPIC_BASE_URL = 'https://api.deepseek.com/anthropic'
$env:ANTHROPIC_AUTH_TOKEN = 'sk-your-api-key'
$env:ANTHROPIC_MODEL = 'deepseek-chat'
claude
```

### Qwen Code 配置

适用于通义千问用户，提供每天 2000 次免费额度。

**安装 Qwen Code：**
```bash
npm install -g @qwen-code/qwen-code@latest
```

**OAuth 模式（推荐，免费额度）：**
1. 选择「通义千问」
2. 点击「应用配置」
3. 自动启动 Qwen Code
4. 首次使用需扫码登录 Qwen Chat 账号
5. 每天 2000 次免费调用

**OpenAI 兼容模式：**
```powershell
$env:OPENAI_API_KEY = 'sk-your-dashscope-key'
$env:OPENAI_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
$env:OPENAI_MODEL = 'qwen3-coder-plus'
qwen
```

### 各服务商配置示例

**DeepSeek：**
```powershell
$env:CF_CODER_PROVIDER = 'deepseek'
$env:CF_CODER_MODEL = 'deepseek-chat'
$env:OPENAI_API_KEY = 'sk-xxx'
$env:OPENAI_BASE_URL = 'https://api.deepseek.com/v1'
```

**Kimi：**
```powershell
$env:CF_CODER_PROVIDER = 'kimi'
$env:CF_CODER_MODEL = 'kimi-k2'
$env:OPENAI_API_KEY = 'sk-xxx'
$env:OPENAI_BASE_URL = 'https://api.moonshot.cn/v1'
```

**豆包：**
```powershell
$env:CF_CODER_PROVIDER = 'doubao'
$env:CF_CODER_MODEL = 'doubao-seed-code'
$env:OPENAI_API_KEY = 'sk-xxx'
$env:OPENAI_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3'
```

**智谱AI：**
```powershell
$env:CF_CODER_PROVIDER = 'zhipu'
$env:CF_CODER_MODEL = 'glm-4.7'
$env:OPENAI_API_KEY = 'xxx.xxx'
$env:OPENAI_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'
```

**Anthropic（官方）：**
```powershell
$env:CF_CODER_PROVIDER = 'anthropic'
$env:CF_CODER_MODEL = 'claude-sonnet-4-20250514'
$env:ANTHROPIC_API_KEY = 'sk-ant-xxx'
$env:ANTHROPIC_BASE_URL = 'https://api.anthropic.com'
```

**Cloudflare Workers AI：**
```powershell
$env:CF_CODER_PROVIDER = 'cloudflare'
$env:CF_CODER_MODEL = '@cf/meta/llama-3.1-8b-instruct'
$env:CF_CODER_WORKER_URL = 'https://your-worker.workers.dev'
```

---

## 环境变量参考

### CF Coder 环境变量

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| CF_CODER_PROVIDER | 是 | 服务商名称 | deepseek, kimi, doubao, qwen, zhipu, anthropic, cloudflare |
| CF_CODER_MODEL | 是 | 模型名称 | deepseek-chat, kimi-k2, glm-4.7 |
| OPENAI_API_KEY | 条件 | OpenAI 兼容 API Key | sk-xxx |
| OPENAI_BASE_URL | 条件 | OpenAI 兼容 API 地址 | https://api.deepseek.com/v1 |
| ANTHROPIC_API_KEY | 条件 | Anthropic API Key（用于 Anthropic 服务商） | sk-ant-xxx |
| ANTHROPIC_BASE_URL | 条件 | Anthropic API 地址 | https://api.anthropic.com |
| CF_CODER_WORKER_URL | 条件 | Cloudflare Worker URL（用于 Cloudflare 服务商） | https://xxx.workers.dev |
| CF_CODER_DEBUG | 否 | 启用调试模式 | true |
| FORCE_COLOR | 否 | 强制启用终端颜色 | 1 |

### Claude Code 环境变量

| 变量名 | 说明 |
|--------|------|
| ANTHROPIC_BASE_URL | API 服务地址 |
| ANTHROPIC_AUTH_TOKEN | API 密钥 |
| ANTHROPIC_MODEL | 主模型名称 |
| ANTHROPIC_SMALL_FAST_MODEL | 快速模型名称 |
| API_TIMEOUT_MS | 超时时间（毫秒） |

### Qwen Code 环境变量

| 变量名 | 说明 |
|--------|------|
| OPENAI_API_KEY | 百炼 API Key |
| OPENAI_BASE_URL | API 服务地址 |
| OPENAI_MODEL | 模型名称 |

---

## Cloudflare Worker 部署

Cloudflare Workers AI 提供免费的 AI 模型，无需 API Key。

### 一键部署

1. 在软件左侧点击「Cloudflare」
2. 输入 Account ID（在 Cloudflare Dashboard 右侧边栏）
3. 输入 API Token（需要 Workers 编辑权限）
4. 输入 Worker 名称（如 `claude-proxy`）
5. 输入 workers.dev 子域名
6. 点击「一键部署 Worker」
7. 部署完成后复制 Worker URL

### 手动部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **Workers & Pages** - **Create Worker**
3. 复制 `cloudflare-worker/worker.js` 代码粘贴到编辑器
4. 点击 **Deploy**
5. 进入 Worker 设置页面
6. 点击 **Settings** - **Bindings**
7. 点击 **Add** - **Workers AI**
8. Variable name 填写 `AI`（必须大写）
9. 点击 **Save**
10. 进入 **Settings** - **Domains & Routes**
11. 启用 workers.dev 路由

### 可用模型

| 模型 ID | 说明 | 推荐用途 |
|---------|------|----------|
| @cf/meta/llama-3.1-8b-instruct | Meta Llama 3.1 8B | 通用编程，推荐 |
| @cf/meta/llama-3.2-3b-instruct | Meta Llama 3.2 3B | 快速响应 |
| @cf/meta/llama-3.2-1b-instruct | Meta Llama 3.2 1B | 最快速度 |
| @cf/mistral/mistral-7b-instruct-v0.1 | Mistral 7B | 推理能力好 |
| @cf/deepseek-ai/deepseek-math-7b-instruct | DeepSeek Math 7B | 数学能力强 |
| @cf/openchat/openchat-3.5-0106 | OpenChat 3.5 | 对话优化 |
| @cf/qwen/qwen1.5-7b-chat-awq | Qwen 1.5 7B | 中文友好 |

### API Token 权限

创建 API Token 时需要以下权限：

| 权限 | 说明 |
|------|------|
| Account - Workers Scripts - Edit | 编辑 Worker 脚本 |
| Account - Workers AI - Read | 读取 Workers AI |

---

## 文件监控与快照

### 启用监控

1. 选择工作目录（或在启动 CLI 时自动使用当前目录）
2. 点击「开始监控」
3. 操作日志会实时显示在右侧面板

### 操作类型

| 类型 | 颜色 | 说明 |
|------|------|------|
| [新建] | 绿色 | 创建新文件 |
| [编辑] | 蓝色 | 修改文件内容 |
| [删除] | 红色 | 删除文件 |
| [读取] | 灰色 | 读取文件（仅时间变化） |
| [新建目录] | 黄色 | 创建新目录 |

### 快照功能

- 每次文件操作自动保存内容快照（最大 500KB）
- 点击操作日志可查看详情
- 点击「预览代码」查看操作时的文件内容
- 支持代码语法高亮

### 回溯功能

1. 选择某个历史操作
2. 点击「预览代码」查看快照内容
3. 点击「回溯到此版本」将文件恢复到快照状态
4. 操作日志同步回退，移除后续操作记录

**注意**：回溯操作会覆盖当前文件内容，无法撤销。

---

## 开发指南

### 环境准备

```bash
# 克隆仓库
git clone https://github.com/violettoolssite/CFclaude.git
cd CFclaude

# 安装依赖（自动安装 cfclaude-cli 依赖）
npm install

# 如果安装失败，手动安装 CLI 依赖
cd cfclaude-cli
npm install --legacy-peer-deps
cd ..
```

### 开发模式

```bash
# 运行 Electron 开发模式
npm start

# 单独开发 CLI（使用 ts-node）
cd cfclaude-cli
npm run dev
```

### 构建

```bash
# 编译 CLI（TypeScript -> JavaScript）
npm run prebuild

# 构建当前平台
npm run build

# 构建特定平台
npm run build:win     # Windows (portable + NSIS)
npm run build:linux   # Linux (AppImage + deb)
npm run build:mac     # macOS (dmg)
```

### 项目结构

```
CFclaude/
├── main.js                      # Electron 主进程
│   ├── 窗口创建和管理
│   ├── IPC 通信处理
│   ├── CLI 启动逻辑
│   ├── 文件监控系统
│   └── Cloudflare Worker 部署
│
├── renderer.js                  # 渲染进程（UI 逻辑）
│   ├── 服务商配置管理
│   ├── 历史配置系统
│   └── 用户界面交互
│
├── index.html                   # 主界面 HTML
├── styles.css                   # 样式表
├── package.json                 # 项目配置和构建脚本
│
├── cfclaude-cli/                # 内置 CLI 工具（TypeScript）
│   ├── src/
│   │   ├── index.ts             # CLI 入口文件
│   │   ├── config.ts            # 配置管理
│   │   ├── cfConfigLoader.ts    # CF Coder 配置加载器
│   │   ├── cfWorkersAdapter.ts  # 服务商适配器
│   │   ├── onboarding.ts        # 初始化引导
│   │   ├── commands/            # CLI 命令
│   │   │   ├── chat.ts          # 聊天命令
│   │   │   ├── login.ts         # 登录命令
│   │   │   └── ...
│   │   ├── services/            # 服务层
│   │   │   ├── ModelService.ts  # 模型服务
│   │   │   └── ...
│   │   ├── tools/               # 工具执行
│   │   ├── llm/                 # LLM 客户端
│   │   └── ui/                  # TUI 界面
│   ├── dist/                    # 编译输出
│   ├── package.json
│   └── tsconfig.json
│
├── cloudflare-worker/           # Cloudflare Worker 代码
│   ├── worker.js                # Worker 脚本
│   ├── wrangler.toml            # Wrangler 配置
│   └── README.md
│
├── .github/
│   └── workflows/
│       └── build.yml            # GitHub Actions 构建工作流
│
└── README.md
```


## 常见问题

### 安装和启动

**Q: Windows 提示「Windows 已保护你的电脑」**

A: 点击「更多信息」->「仍要运行」。这是因为应用未签名，但代码完全开源可审计。

**Q: Linux AppImage 无法运行**

A: 需要赋予执行权限：
```bash
chmod +x CFclaude-x.x.x-linux-x64.AppImage
```

**Q: macOS 提示「无法打开，因为无法验证开发者」**

A: 右键点击应用 -> 打开，或在系统偏好设置 -> 安全性与隐私中允许运行。

### 配置问题

**Q: 配置后 CLI 没有生效**

A: 配置后会自动在新窗口启动 CLI，已包含最新的环境变量。如果手动启动，需要重启终端。

**Q: PowerShell 报错「禁止运行脚本」**

A: 工具会自动设置执行策略，如仍有问题，手动运行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

**Q: 出现 404 错误**

A: 检查 API 地址是否正确。确保使用正确的 Base URL，不要添加额外的路径。

**Q: API Key 无效**

A: 检查：
1. API Key 是否正确复制（无多余空格）
2. API Key 是否已激活
3. 账户是否有余额

### Cloudflare Worker

**Q: Worker 报错「AI binding not configured」**

A: 确保在 Worker Settings -> Bindings 中添加了 Workers AI，Variable name 必须是 `AI`（大写）。

**Q: 部署失败「Cannot create symbolic link」**

A: 这是 Windows 权限问题，不影响功能。构建会自动重试。

### 其他

**Q: 如何恢复官方 Claude**

A: 点击「清除配置」按钮，然后重启终端。

**Q: 通义千问应该用 Claude Code 还是 Qwen Code？**

A: 推荐使用 Qwen Code，它是阿里云专门为 Qwen3-Coder 优化的工具，提供每天 2000 次免费额度。

**Q: CLI 卡在「Model: Loading...」**

A: 检查：
1. 环境变量是否正确设置
2. API Key 是否有效
3. 网络是否正常

---


## 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 报告问题

1. 在 [Issues](https://github.com/violettoolssite/CFclaude/issues) 页面创建新 Issue
2. 描述问题的复现步骤
3. 附上错误信息和系统信息

### 提交代码

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 创建 Pull Request

### 开发规范

- 使用 TypeScript 编写 CLI 代码
- 遵循 ESLint 规则
- 提交信息使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式

---

## 相关资源

### 服务商官网

- [DeepSeek 开放平台](https://platform.deepseek.com/)
- [豆包/火山引擎](https://console.volcengine.com/ark/)
- [Kimi 开放平台](https://platform.moonshot.cn/)
- [阿里云百炼](https://dashscope.console.aliyun.com/)
- [智谱AI](https://open.bigmodel.cn/)
- [ModelScope](https://modelscope.cn/)
- [NVIDIA NIM](https://build.nvidia.com/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)

### 官方文档

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Qwen Code](https://help.aliyun.com/zh/model-studio/qwen-code)

---

## 许可证

MIT License

Copyright (c) 2026 violettoolssite

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
