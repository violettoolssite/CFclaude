# CF Coder CLI

CF Coder CLI 是 CFclaude 桌面应用的内置命令行 AI 编程助手。

## 注意事项

**此 CLI 作为 CFclaude 桌面应用的组件运行，不单独发布到 npm。**

模型选择完全由 CFclaude 桌面应用控制，CLI 通过环境变量接收模型配置。

## 功能特点

- **多模型支持** - 支持 Cloudflare Workers AI、OpenAI、Anthropic 三种提供商
- Cloudflare 品牌橙色 (#F6821F) 主题配色
- 支持交互式对话和无头模式
- 会话管理和历史记录
- 支持 MCP (Model Context Protocol) 扩展

## 环境变量

由 CFclaude 桌面应用设置：

| 变量名 | 说明 |
|--------|------|
| `CF_CODER_PROVIDER` | 当前提供商 (cloudflare-workers/openai/anthropic) |
| `CF_CODER_MODEL` | 当前模型 |
| `CF_CODER_WORKER_URL` | Cloudflare Worker URL |
| `OPENAI_API_KEY` | OpenAI API 密钥 |
| `ANTHROPIC_API_KEY` | Anthropic API 密钥 |

## 斜杠命令

| 命令 | 说明 |
|------|------|
| `/help` | 显示帮助信息 |
| `/clear` | 清除对话历史 |
| `/exit` | 退出程序 |
| `/resume` | 恢复历史会话 |
| `/mcp` | MCP 服务器管理 |

## 构建

```bash
npm install --legacy-peer-deps
npm run build
```

## 许可证

Apache-2.0 License
