# CFclaude Code

**Ship faster with AI-powered coding assistance**

Multi-provider AI Coding Assistant CLI - 多服务商 AI 编程助手命令行工具

## 简介

CFclaude Code 是一个开源的多服务商 AI 编程助手命令行工具。参考 [Continue CLI](https://docs.continue.dev/cli/quick-start) 的设计，支持 TUI 模式和 Headless 模式。

## 致谢

本项目受以下优秀开源项目启发:

- **[Continue](https://github.com/continuedev/continue)** - Continuous AI 开源 CLI 工具，Apache-2.0 许可证
- **[Claude Code](https://github.com/anthropics/claude-code)** - Anthropic 官方编程助手
- **[Qwen Code](https://github.com/QwenLM/Qwen3-Coder)** - 阿里云通义千问编程助手

## 快速安装

```bash
npm i -g @anthropic-ai/cfclaude-code
```

## 两种模式

### TUI 模式 - 交互式对话

用于**大型开发任务**，需要人工监督的代理工作流。适合复杂重构、功能实现或需要监控和迭代的一次性自动化任务。

```bash
# 直接启动 TUI 模式
cfclaude

# 或显式指定
cfclaude chat
```

### Headless 模式 - 自动化工作流

用于**可靠、可重复的任务**，不再需要持续监督。适合 CI/CD 流水线、git hooks 和已测试完善的自动化工作流。

```bash
# 使用 -p 标志运行单个提示
cfclaude -p "为暂存的更改生成提交信息"

# 代码质量检查
cfclaude -p "修复 src/ 目录中的所有 TypeScript 错误"
```

## 使用示例

### TUI 模式示例

```bash
cfclaude

   ██████╗███████╗ ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗
  ██╔════╝██╔════╝██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝
  ██║     █████╗  ██║     ██║     ███████║██║   ██║██║  ██║█████╗  
  ██║     ██╔══╝  ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝  
  ╚██████╗██║     ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗
   ╚═════╝╚═╝      ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝

> @src/app.js 帮我添加 JWT 认证

> [Agent 分析代码库并实现认证系统]
> [你审查更改、测试并提供反馈]
> [Agent 根据你的输入进行迭代]
```

### 斜杠命令

| 命令 | 说明 |
|------|------|
| `/help` | 显示帮助信息 |
| `/clear` | 清除对话历史 |
| `/compact` | 压缩对话历史 |
| `/context` | 显示项目上下文 |
| `/model` | 显示或切换模型 |
| `/info` | 显示会话信息 |
| `/exit` | 退出对话 |

### 文件引用

使用 `@` 前缀引用文件:

```
> @src/utils.js 解释这个文件的作用
> @package.json @README.md 更新文档
```

## 支持的服务商

| 服务商 | ID | 默认模型 |
|--------|------|----------|
| DeepSeek | deepseek | deepseek-chat |
| Kimi | kimi | moonshot-v1-128k |
| 豆包 | doubao | doubao-seed-code |
| 通义千问 | qwen | qwen3-coder-plus |
| 智谱AI | zhipu | glm-4.7 |
| NVIDIA NIM | nvidia | z-ai/glm4.7 |
| Anthropic | anthropic | claude-sonnet-4 |
| ModelScope | modelscope | Qwen/Qwen2.5-Coder-32B-Instruct |

## 配置

### 设置 API Key

```bash
cfclaude config --provider deepseek --api-key your-api-key
cfclaude config --list
```

### 初始化项目

```bash
cfclaude init
```

创建 `AGENTS.md` 文件来自定义 Agent 行为。

### 环境变量

| 变量 | 说明 |
|------|------|
| `CFCLAUDE_API_KEY` | API Key |
| `DEEPSEEK_API_KEY` | DeepSeek API Key |
| `KIMI_API_KEY` | Kimi API Key |

## 工具能力

| 工具 | 说明 |
|------|------|
| `read_file` | 读取文件内容 |
| `write_file` | 创建或覆盖文件 |
| `edit_file` | 编辑文件特定部分 |
| `list_dir` | 列出目录内容 |
| `run_command` | 执行终端命令 |
| `search_files` | 搜索匹配的文件 |

## 开发工作流

1. **在 TUI 模式中实验** - 带人工监督地尝试复杂开发任务
2. **用 Headless 模式自动化** - 将经过验证的工作流转换为单个命令

## 开发

```bash
git clone https://github.com/violettoolssite/cfclaude-cli.git
cd cfclaude-cli
npm install
npm run build
npm link
```

## 许可证

Apache 2.0 - 2026 CFclaude Team

## 相关链接

- [CFclaude 桌面版](https://github.com/violettoolssite/CFclaude)
- [Continue CLI 文档](https://docs.continue.dev/cli/quick-start)
