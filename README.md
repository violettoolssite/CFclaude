# CFclaude

Claude Code 多模型切换工具 - 一键配置 8 大 AI 服务商

## 更新日志

### v1.0.0 (2026-01-18)

#### 新增功能

- **8 大 AI 服务商支持**
  - DeepSeek - 国产首选，编程能力强
  - 豆包 (Doubao) - 字节跳动，视觉理解，性价比高
  - Kimi - 月之暗面，超长上下文
  - 通义千问 - 阿里云 DashScope，Qwen3-Coder
  - 智谱AI - GLM-4.7，稳定可靠
  - ModelScope - 魔搭社区免费模型
  - Cloudflare Workers AI - 免费额度
  - Anthropic - 官方 Claude

- **统一网关功能**
  - 支持自定义 API 网关地址
  - 兼容 OpenRouter、OneAPI、NewAPI 等
  - 所有服务商可通过统一网关访问

- **自动配置恢复**
  - 启动时自动读取当前配置
  - 自动选中上次使用的服务商
  - 自动填充模型和 Worker URL

#### 界面优化

- 固定窗口大小，优化布局
- 下拉菜单样式改进，选项更清晰
- 紧凑布局，一屏显示完整界面

#### 技术改进

- 使用 PowerShell 读取用户级环境变量
- URL 自动清理（移除末尾 /v1 或 /）
- Cloudflare Worker 支持 messages 和 prompt 双格式

---

## 功能特点

- 🎯 **一键切换** - 图形界面快速配置 Claude Code 后端
- 🌐 **多服务商** - 支持国内外 8 大主流 AI 服务
- 🔗 **统一网关** - 可配置自定义 API 代理
- 💾 **配置记忆** - 自动恢复上次配置
- 🆓 **Cloudflare 免费** - 提供 Worker 代码实现免费使用

## 支持的服务商

| 服务商 | API 地址 | 推荐模型 | 特点 |
|--------|----------|----------|------|
| DeepSeek | api.deepseek.com | deepseek-chat | 编程能力强，性价比高 |
| 豆包 | ark.cn-beijing.volces.com | doubao-seed-code | 视觉理解，原生兼容 Claude Code |
| Kimi | api.moonshot.cn | kimi-k2 | 超长上下文 128K |
| 通义千问 | dashscope.aliyuncs.com | qwen3-coder | 阿里云，编程专用模型 |
| 智谱AI | open.bigmodel.cn | glm-4.7 | 稳定可靠，中文优化 |
| ModelScope | api-inference.modelscope.cn | Qwen2.5-72B | 魔搭社区，部分免费 |
| Cloudflare | 自建 Worker | llama-3.1-8b | 完全免费，需部署 Worker |
| Anthropic | 官方 | claude-sonnet-4 | 官方 API |

## 快速开始

### 下载安装

从 [Releases](https://github.com/violettoolssite/CFclaude/releases) 下载 `CFclaude.exe`

### 使用方法

1. 运行 `CFclaude.exe`
2. （可选）填写统一网关地址
3. 选择服务商
4. 选择模型
5. 输入 API Key
6. 点击 **应用配置**
7. 重启终端，运行 `claude`

### 使用统一网关

如果你有自建的 API 网关（如 OneAPI），可以：

1. 在"统一网关"输入框填写网关地址
2. 选择任意服务商的模型
3. 输入网关的 API Key
4. 所有请求将通过网关转发

## Cloudflare Worker 部署

### 部署步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **Workers & Pages** → **Create Worker**
3. 复制 `cloudflare-worker/worker.js` 代码粘贴
4. 点击 **Deploy**
5. 进入 **Settings** → **Bindings**
6. 添加 **Workers AI**，Variable name 填 `AI`
7. 点击 **Deploy** 保存

### 可用模型

| 模型 | 说明 |
|------|------|
| @cf/meta/llama-3.1-8b-instruct | **推荐** - 综合能力强 |
| @cf/meta/llama-3.2-3b-instruct | 速度快 |
| @cf/mistral/mistral-7b-instruct-v0.1 | 推理能力好 |
| @cf/deepseek-ai/deepseek-math-7b-instruct | 数学能力强 |
| @cf/openchat/openchat-3.5-0106 | 对话优化 |
| @cf/qwen/qwen1.5-7b-chat-awq | 中文友好 |

## 环境变量说明

CFclaude 工具会自动设置以下用户级环境变量：

| 变量名 | 说明 |
|--------|------|
| ANTHROPIC_BASE_URL | API 服务地址 |
| ANTHROPIC_AUTH_TOKEN | API 密钥 |
| ANTHROPIC_MODEL | 主模型名称 |
| ANTHROPIC_SMALL_FAST_MODEL | 快速模型名称 |
| API_TIMEOUT_MS | 超时时间（毫秒） |
| CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC | 禁用非必要流量 |

## 常见问题

### Q: 配置后 Claude Code 没有生效

需要重启终端（或新开一个终端窗口）才能加载新的环境变量。

### Q: 出现 404 错误

检查 API 地址是否正确。工具会自动移除末尾的 `/v1`，无需手动添加。

### Q: Cloudflare Worker 报错

确保在 Worker Settings → Bindings 中添加了 Workers AI，Variable name 必须是 `AI`。

### Q: 如何清除配置恢复官方 Claude

点击"清除配置"按钮，然后重启终端。

## 项目结构

```
CFclaude/
├── cloudflare-worker/      # 开源 - Cloudflare Worker 代码
│   ├── worker.js           # Worker 源码
│   ├── wrangler.toml       # Wrangler 配置
│   └── README.md           # Worker 说明
├── README.md               # 本文档
```

**注意：** CFclaude 桌面工具不开源，仅提供可执行文件下载。Cloudflare Worker 代码完全开源。

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

## 致谢

感谢所有 AI 服务提供商为开发者提供的 API 服务。
