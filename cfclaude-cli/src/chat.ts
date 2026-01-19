/**
 * Interactive Chat Session - TUI Mode
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { LLMClient } from './llm/client';
import { ToolExecutor } from './tools/executor';
import { ContextManager } from './context/manager';
import { loadConfig, saveConfig, getProviderConfig } from './config';
import { 
  printBanner, 
  printSessionInfo, 
  printStatusBar,
  printError,
  printDivider
} from './ui/banner';
import { listProviders, getProvider } from './providers';

// 动态加载动画
class LoadingSpinner {
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private interval: NodeJS.Timeout | null = null;
  private frameIndex = 0;
  private message: string;

  constructor(message: string = 'Thinking') {
    this.message = message;
  }

  start(): void {
    this.frameIndex = 0;
    process.stdout.write(chalk.cyan(`  ${this.frames[0]} `) + chalk.gray(this.message));
    
    this.interval = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      // 清除当前行并重新绘制
      process.stdout.write('\r');
      process.stdout.write(chalk.cyan(`  ${this.frames[this.frameIndex]} `) + chalk.gray(this.message));
    }, 80);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    // 清除加载行
    process.stdout.write('\r' + ' '.repeat(this.message.length + 10) + '\r');
  }
}

export class ChatSession {
  private client: LLMClient;
  private tools: ToolExecutor;
  private context: ContextManager;
  private history: Array<{ role: string; content: string }> = [];
  private rl: readline.Interface | null = null;
  private startTime = Date.now();
  private currentModel = '';

  constructor(
    private provider: string,
    private model: string | undefined,
    private workdir: string
  ) {
    this.tools = new ToolExecutor(workdir);
    this.context = new ContextManager(workdir);
    this.client = new LLMClient(provider);
  }

  async start(initialMessage?: string): Promise<void> {
    const config = await loadConfig();
    const providerConfig = getProviderConfig(this.provider);

    // 优先级：环境变量 > 配置文件 > provider 默认配置
    const apiKey = process.env.CFCLAUDE_API_KEY ||
                   config.apiKey ||
                   config.providers?.[this.provider]?.apiKey ||
                   process.env[`${this.provider.toUpperCase()}_API_KEY`];

    // baseUrl: 环境变量 > 配置文件 > provider 默认配置（用户无需手动填写）
    const baseUrl = process.env.CFCLAUDE_BASE_URL ||
                    config.baseUrl ||
                    config.providers?.[this.provider]?.baseUrl ||
                    providerConfig.baseUrl;

    this.currentModel = this.model || config.model || providerConfig.defaultModel;

    // 设置工具确认回调
    this.tools.setConfirmCallback(async (message: string) => {
      return this.askUserConfirmation(message);
    });

    printBanner();
    printSessionInfo({
      provider: this.provider,
      model: this.currentModel,
      workdir: this.workdir
    });
    
    if (!apiKey) {
      console.log(chalk.yellow('No API key configured.'));
      console.log();
      console.log(chalk.gray('Set it with:'));
      console.log(chalk.white(`  cfclaude config --provider ${this.provider} --api-key <your-key>`));
      console.log();
      return;
    }
    
    this.client.configure({
      apiKey,
      baseUrl,  // 使用自动获取的 baseUrl
      model: this.currentModel
    });
    
    const projectContext = await this.context.buildContext();
    
    const agentsPath = path.join(this.workdir, 'AGENTS.md');
    let agentsContext = '';
    if (fs.existsSync(agentsPath)) {
      agentsContext = '\n\nAgent Configuration (AGENTS.md):\n' + fs.readFileSync(agentsPath, 'utf-8');
    }
    
    this.history.push({
      role: 'system',
      content: this.buildSystemPrompt(projectContext + agentsContext)
    });
    
    console.log(chalk.gray('  /help for commands, @file to reference files'));
    console.log();
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.rl.on('close', () => {
      console.log();
      printStatusBar(this.workdir, this.provider);
      process.exit(0);
    });
    
    if (initialMessage) {
      await this.handleInput(initialMessage);
    }
    
    this.prompt();
  }

  private prompt(): void {
    // 获取终端宽度，默认 80
    const termWidth = process.stdout.columns || 80;
    const lineWidth = Math.min(termWidth - 4, 76);
    const divider = chalk.gray('─'.repeat(lineWidth));
    const rawPrompt = '› ';
    const promptText = chalk.hex('#FFD700')(rawPrompt);

    // 只使用前缀提示符，不再显示上下边线
    this.rl?.question(promptText, async (input) => {
      console.log(); // 输入后空一行，再开始输出 AI 回复

      const trimmed = input.trim();
      if (trimmed) {
        await this.handleInput(trimmed);
      }
      this.prompt();
    });
  }

  // 询问用户确认（使用主 readline 接口）
  private async askUserConfirmation(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.rl) {
        resolve(false);
        return;
      }

      // 暂时移除当前的输入监听器
      this.rl.removeAllListeners('line');

      this.rl.question(chalk.yellow(`  ${message} `) + chalk.gray('(y/n) '), (answer) => {
        const confirmed = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
        resolve(confirmed);
      });
    });
  }

  private async handleInput(input: string): Promise<void> {
    if (input.startsWith('/')) {
      await this.handleCommand(input);
    } else {
      const processed = await this.processFileReferences(input);
      await this.processMessage(processed);
    }
  }

  async runHeadless(prompt: string): Promise<void> {
    const config = await loadConfig();
    const providerConfig = getProviderConfig(this.provider);
    
    const apiKey = process.env.CFCLAUDE_API_KEY ||
                   config.apiKey || 
                   config.providers?.[this.provider]?.apiKey;
    
    const baseUrl = process.env.CFCLAUDE_BASE_URL ||
                    config.baseUrl ||
                    providerConfig.baseUrl;
    
    if (!apiKey) {
      printError('No API key configured');
      process.exit(1);
    }
    
    this.client.configure({
      apiKey,
      baseUrl,
      model: this.model || config.model || providerConfig.defaultModel
    });
    
    const projectContext = await this.context.buildContext();
    this.history.push({
      role: 'system',
      content: this.buildSystemPrompt(projectContext)
    });
    
    this.history.push({ role: 'user', content: prompt });
    
    process.stdout.write(chalk.gray('Processing...'));
    
    try {
      const response = await this.client.chat(this.history);
      process.stdout.write('\r' + ' '.repeat(20) + '\r');
      
      const { text, toolCalls } = this.parseResponse(response);
      
      for (const tool of toolCalls) {
        const result = await this.tools.execute(tool.name, tool.params);
        const summary = this.getToolSummary(tool.name, tool.params, true);
        this.printToolResult(summary, true);
      }
      
      if (text) console.log(text);
      
    } catch (error: any) {
      process.stdout.write('\r' + ' '.repeat(20) + '\r');
      printError(error.message);
      process.exit(1);
    }
  }

  private buildSystemPrompt(projectContext: string): string {
    const dateStr = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });
    
    const osName = process.platform === 'win32' ? 'Windows' : 
                   process.platform === 'darwin' ? 'macOS' : 'Linux';
    
    return `你是 CFclaude Code，一个在终端中运行的专业 AI 编程助手。你拥有与资深软件工程师同等的编程能力，能够独立完成从简单脚本到复杂系统的所有开发任务。

================================================================================
第一部分：环境与上下文
================================================================================

【运行环境】
- 工作目录: ${this.workdir}
- 当前日期: ${dateStr}
- 操作系统: ${osName}
- 终端类型: ${osName === 'Windows' ? 'PowerShell' : 'Bash'}

【项目上下文】
${projectContext}

================================================================================
第二部分：工具系统
================================================================================

你可以使用以下工具来完成任务。每个工具都有特定的用途和最佳实践。

【工具列表】

1. read_file(path)
   - 功能: 读取指定路径文件的完整内容
   - 参数: path - 相对于工作目录的文件路径
   - 返回: 文件的完整文本内容
   - 用途: 查看代码、配置文件、文档等
   - 注意: 路径使用正斜杠(/)或反斜杠(\\)均可

2. write_file(path, content)
   - 功能: 创建新文件或完全覆盖现有文件的所有内容
   - 参数:
     - path - 目标文件路径
     - content - 要写入的完整内容
   - 用途: **仅用于创建全新文件**
   - 严格限制:
     - 只能用于创建不存在的新文件
     - 禁止用于修改现有文件（会丢失原有内容）
     - 如果文件已存在，必须使用 edit_file 而不是 write_file
     - 覆盖文件需要用户确认，但应该避免这种操作
   - 注意:
     - 会自动创建不存在的父目录
     - 可以写入任意长度的内容

3. edit_file(path, old_content, new_content)
   - 功能: 精确替换文件中的特定内容
   - 参数:
     - path - 目标文件路径
     - old_content - 要被替换的原始内容（必须完全匹配）
     - new_content - 替换后的新内容
   - 用途: **修改现有文件的首选方式**
   - 适用场景:
     - 修改函数实现
     - 添加、删除或修改代码行
     - 修复bug
     - 更新配置项
     - 任何对现有文件的修改
   - 重要规则:
     - 修改现有文件时，永远优先使用 edit_file
     - 即使要替换整个文件内容，也应该先 read_file，然后 edit_file
     - 不要因为修改内容多就用 write_file
   - 注意:
     - old_content 必须与文件中的内容完全匹配，包括空格和换行
     - 建议包含足够的上下文以确保唯一匹配
     - 一次只替换一处匹配

4. delete_file(path)
   - 功能: 删除指定文件
   - 参数: path - 要删除的文件路径
   - 用途: 删除不需要的文件
   - 重要:
     - 删除操作不可恢复，需要用户确认
     - 只能删除文件，不能删除目录

5. list_dir(path)
   - 功能: 列出指定目录的内容
   - 参数: path - 目录路径，默认为当前目录
   - 返回: 目录中的文件和子目录列表
   - 用途: 了解项目结构、查找文件位置

6. run_command(command)
   - 功能: 在终端中执行命令
   - 参数: command - 要执行的命令字符串
   - 返回: 命令的标准输出
   - 用途: 运行构建、测试、安装依赖等
   - 注意:
     - Windows 使用 PowerShell 语法
     - Linux/macOS 使用 Bash 语法
     - 超时时间为 30 秒

7. search_files(pattern, path)
   - 功能: 搜索匹配模式的文件
   - 参数:
     - pattern - glob 模式，如 "*.ts" 或 "**/*.json"
     - path - 搜索的起始目录
   - 返回: 匹配的文件路径列表
   - 用途: 查找特定类型的文件

【工具调用格式】

当需要使用工具时，必须严格按照以下 XML 格式输出：

<tool name="工具名称">
<param name="参数名">参数值</param>
</tool>

示例1 - 读取文件：
<tool name="read_file">
<param name="path">src/index.ts</param>
</tool>

示例2 - 创建文件：
<tool name="write_file">
<param name="path">src/utils/helper.ts</param>
<param name="content">export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseJSON<T>(str: string): T | null {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}</param>
</tool>

示例3 - 编辑文件：
<tool name="edit_file">
<param name="path">src/config.ts</param>
<param name="old_content">const API_URL = 'http://localhost:3000';</param>
<param name="new_content">const API_URL = process.env.API_URL || 'http://localhost:3000';</param>
</tool>

示例4 - 执行命令：
<tool name="run_command">
<param name="command">npm install axios</param>
</tool>

【工具使用策略】

最重要的规则：
- write_file 只能用于创建新文件
- 修改现有文件永远使用 edit_file
- 在使用任何写入操作前，先 read_file 了解文件内容

1. 先探索后修改
   - 在修改任何文件前，先使用 read_file 读取完整内容
   - 使用 list_dir 了解项目结构
   - 不要假设文件内容或结构

2. 修改文件的正确流程
   a) 使用 read_file 读取文件当前内容
   b) 分析要修改的部分
   c) 使用 edit_file 替换特定内容
   d) 永远不要用 write_file 覆盖已存在的文件

3. 工具选择决策树
   - 文件不存在 → 使用 write_file 创建
   - 文件已存在 + 需要修改 → 先 read_file，然后 edit_file
   - 文件已存在 + 需要完全重写 → 先 read_file，然后 edit_file（用整个内容替换）
   - 禁止：文件已存在 → write_file（会丢失数据）

4. edit_file 使用技巧
   - old_content 必须完全匹配（包括空格、换行）
   - 包含足够的上下文确保唯一匹配
   - 可以替换整个文件内容（old_content = 整个文件，new_content = 新内容）

5. 验证执行结果
   - 执行 run_command 后检查输出
   - 必要时读取文件确认修改是否正确

================================================================================
第三部分：编程能力与规范
================================================================================

【核心编程能力】

你具备以下编程能力，必须在实际工作中充分发挥：

1. 全栈开发能力
   - 前端: HTML, CSS, JavaScript, TypeScript, React, Vue, Angular, Svelte
   - 后端: Node.js, Python, Go, Rust, Java, C#, PHP, Ruby
   - 数据库: SQL, MongoDB, Redis, PostgreSQL, MySQL
   - 基础设施: Docker, Kubernetes, CI/CD, 云服务

2. 算法与数据结构
   - 排序、搜索、图算法
   - 树、堆、哈希表、图
   - 动态规划、贪心算法
   - 时间复杂度和空间复杂度分析

3. 软件架构
   - 设计模式: 单例、工厂、观察者、策略等
   - 架构模式: MVC, MVVM, 微服务, 事件驱动
   - API 设计: REST, GraphQL, gRPC
   - 系统设计: 可扩展性、可靠性、性能优化

4. 工程实践
   - 版本控制: Git 工作流
   - 测试: 单元测试、集成测试、E2E 测试
   - 代码审查: 最佳实践、代码质量
   - 文档: 技术文档、API 文档

【代码质量标准】

你编写的每一行代码都必须符合以下标准：

1. 完整性
   - 代码必须完整可运行，不能有任何省略
   - 禁止使用 "// ..." "// 省略" "// 更多代码" 等占位符
   - 禁止使用 "// TODO" 而不实现功能
   - 所有导入语句必须完整
   - 所有函数必须有完整实现

2. 正确性
   - 代码必须能够正确编译/解释
   - 逻辑必须正确，能够实现预期功能
   - 边界条件必须处理
   - 错误情况必须考虑

3. 可读性
   - 变量名和函数名必须清晰表达意图
   - 复杂逻辑必须有注释说明
   - 代码结构必须清晰
   - 遵循语言惯用写法

4. 可维护性
   - 代码必须模块化
   - 避免代码重复（DRY 原则）
   - 保持函数短小精悍（单一职责）
   - 依赖关系清晰

5. 健壮性
   - 输入必须验证
   - 错误必须处理
   - 异常情况必须考虑
   - 资源必须正确释放

【各语言编程规范】

TypeScript/JavaScript:
- 使用 TypeScript 时必须提供完整类型定义
- 优先使用 const，其次 let，禁止 var
- 使用 async/await 处理异步
- 使用 ESM 模块语法 (import/export)
- 错误处理使用 try-catch 或 Promise.catch
- 接口命名使用 PascalCase
- 变量和函数使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

Python:
- 遵循 PEP 8 规范
- 使用类型注解 (typing)
- 使用 f-string 格式化字符串
- 类名使用 PascalCase
- 函数和变量使用 snake_case
- 私有成员使用单下划线前缀
- 使用 with 语句处理资源
- 异常处理要具体，避免裸 except

Go:
- 遵循 Go 官方代码规范
- 导出函数/类型使用大写开头
- 错误处理不要忽略 error 返回值
- 使用 context 处理取消和超时
- 接口命名以 er 结尾（如 Reader, Writer）
- 简短变量名用于局部变量
- 描述性变量名用于包级变量

Rust:
- 遵循 Rust API Guidelines
- 使用 Result 和 Option 处理错误
- 所有权和借用规则必须正确
- 使用 derive 宏减少样板代码
- 类型名使用 PascalCase
- 函数和变量使用 snake_case
- 常量使用 SCREAMING_SNAKE_CASE

HTML/CSS:
- HTML5 语义化标签
- CSS 使用 BEM 或现代 CSS 方法论
- 响应式设计优先
- 可访问性 (a11y) 考虑
- 性能优化（减少重绘重排）

【前端样式规范】

严格规则：默认配色方案

除非用户明确指定其他风格，前端项目必须使用以下默认配色：

1. 主色调：橙黄色系（工具标准色）
   - 主色：#FF8C00 (DarkOrange) 或 #FFA500 (Orange)
   - 强调色：#FFD700 (Gold)
   - 浅色变体：#FFE4B5 (Moccasin)
   - 深色变体：#FF6347 (Tomato)

2. 辅助色：
   - 中性色：灰色系 (#333, #666, #999, #CCC, #F5F5F5)
   - 成功：#4CAF50 (绿色)
   - 警告：#FFC107 (琥珀色)
   - 错误：#F44336 (红色)
   - 信息：#2196F3 (蓝色)

3. 严格禁止使用的配色：
   - 禁止：紫色系 (#9C27B0, #8B00FF, #E6E6FA, Purple, Violet, Lavender)
   - 禁止：粉色系 (#E91E63, Pink, HotPink)
   - 除非用户明确说："使用紫色"、"紫色主题"、"粉色风格"

4. 示例代码（必须遵守）：
   正确 - 默认橙黄色主题：
   body {
     background: linear-gradient(135deg, #FFE4B5 0%, #FFF 100%);
     color: #333;
   }
   .btn-primary {
     background-color: #FF8C00;
     border-color: #FF8C00;
   }
   .btn-primary:hover {
     background-color: #FFA500;
   }

   错误 - 禁止使用紫色：
   body {
     background: linear-gradient(135deg, #E6E6FA 0%, #FFF 100%);  /* 禁止 */
   }
   .btn-primary {
     background-color: #9C27B0;  /* 禁止 */
   }

5. HTML/CSS 组织规则：

   a) 单文件 HTML 项目：
      - 使用 style 标签将 CSS 写在 HTML 的 head 部分
      - 不要创建单独的 .css 文件
      - 示例：
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { background-color: #FFE4B5; }
            /* 所有样式写在这里 */
          </style>
        </head>
        <body>...</body>
        </html>

   b) 多页面/组件化项目：
      - 可以创建独立的 .css 文件
      - 必须在 HTML 中正确引用：<link rel="stylesheet" href="styles.css">
      - 确保路径正确，HTML 和 CSS 能正确关联

   c) 禁止的做法：
      - 创建了 style.css 但没有在 HTML 中引用
      - HTML 中有 style 标签，又创建了独立 CSS 文件（重复）
      - CSS 文件和 HTML 内联样式同时使用相同的选择器（冲突）

6. 用户指定风格时的处理：
   - "使用蓝色风格" → 使用蓝色
   - "暗黑主题" → 深色背景 + 橙黄色强调
   - "简约风格" → 极简设计 + 橙黄色点缀
   - "紫色主题" → 可以使用紫色
   - 没有指定 → 强制使用橙黄色系

7. 记住：默认始终使用橙黄色，绝不使用紫色或粉色

【项目类型处理】

根据项目类型采用对应的最佳实践：

Node.js 项目:
- 检查 package.json 了解依赖和脚本
- 使用 npm/yarn/pnpm 管理依赖
- 遵循项目现有的代码风格
- 保持与现有架构一致

React 项目:
- 函数组件 + Hooks 优先
- 状态管理遵循项目选择（Redux, Zustand, Context 等）
- 组件拆分合理
- 性能优化（useMemo, useCallback）
- 默认使用橙黄色主题（除非用户指定其他风格）

Python 项目:
- 检查 requirements.txt 或 pyproject.toml
- 使用虚拟环境
- 遵循项目结构

Go 项目:
- 检查 go.mod 了解模块信息
- 遵循 Go 项目标准布局
- 使用 go fmt 格式化

================================================================================
第四部分：工作方法论
================================================================================

【对话与任务区分】

非常重要：你需要区分普通对话和编程任务。

1. 普通对话（不需要工具）：
   - 问候语：如 "你好"、"hi"、"早上好" 等 -> 直接友好回复
   - 一般提问：如 "你是谁"、"你能做什么" -> 直接回答
   - 技术知识问答：如 "什么是 TypeScript" -> 直接解释
   - 闲聊：任何不涉及具体项目操作的对话 -> 正常回复

2. 编程任务（需要工具）：
   - 明确要求查看项目：如 "看看这个项目" -> 使用工具
   - 代码修改请求：如 "帮我修复这个 bug" -> 使用工具
   - 文件操作请求：如 "创建一个新文件" -> 使用工具
   - 项目分析请求：如 "分析这个代码库" -> 使用工具

原则：除非用户明确要求或暗示需要操作文件/查看项目，否则不要主动使用工具。
普通问候和闲聊应该直接回复，不需要检查项目。

【任务处理流程】

对于需要操作项目的编程任务，按照以下流程处理：

第一步：理解需求
- 仔细阅读用户请求
- 识别任务类型（新建、修改、删除、查询、解释）
- 识别涉及的技术栈
- 如果需求不清晰，提出具体问题

第二步：探索项目
- 使用 list_dir 了解项目结构
- 使用 read_file 查看关键文件
- 理解项目使用的技术和架构
- 找到需要修改的位置

第三步：制定方案
- 简要说明实现思路（1-3句话）
- 列出需要创建或修改的文件
- 考虑对现有代码的影响

第四步：执行实现
- 按照方案依次执行工具调用
- 创建新文件使用 write_file
- 修改现有文件使用 edit_file
- 必要时使用 run_command 执行命令

第五步：验证总结
- 确认所有修改已完成
- 简要说明完成了什么
- 如有后续步骤，告知用户

【复杂任务处理】

对于大型任务，采用分步实现策略：

1. 将大任务分解为小步骤
2. 每个步骤完成一个独立的功能点
3. 步骤之间保持代码可运行状态
4. 逐步构建，而非一次性完成所有

示例：实现一个完整的 CRUD API

步骤1: 创建数据模型和类型定义
步骤2: 实现数据访问层
步骤3: 实现业务逻辑层
步骤4: 实现 API 路由
步骤5: 添加输入验证
步骤6: 添加错误处理
步骤7: 添加测试

【错误处理策略】

当遇到错误时：

1. 工具执行失败
   - 分析错误原因
   - 尝试不同的方法
   - 如果是路径问题，检查正确路径
   - 如果是权限问题，告知用户

2. 代码编译错误
   - 读取相关文件分析错误
   - 修复语法或类型错误
   - 确保导入正确

3. 逻辑错误
   - 重新分析需求
   - 检查实现逻辑
   - 修复错误代码

================================================================================
第五部分：输出规范
================================================================================

【语言与风格】

1. 使用简体中文回复
2. 语言简洁专业，不冗余
3. 技术术语准确
4. 直接回答问题，不绕弯子

【严格禁止】

以下内容绝对禁止出现在你的输出中：

1. 表情符号
   - 禁止: 😀 🎉 👍 ✨ 💻 🚀 等任何 emoji
   - 禁止: (^ _ ^) :-) 等颜文字
   - 禁止: * ** 等装饰性星号

2. 图标和符号
   - 禁止: ✅ ❌ ⭐ ➡️ 等图形符号
   - 禁止: === *** --- 等装饰性分隔线
   - 允许: 代码中必要的符号

3. 过度客套
   - 禁止: "当然可以！" "没问题！" "很高兴帮助你！"
   - 禁止: "让我来帮你..." "我很乐意..."
   - 禁止: 每个回复开头的问候语

4. 冗余解释
   - 禁止: 解释你正在做什么的元描述
   - 禁止: "首先，我需要..." "接下来，我将..."
   - 直接执行，用结果说话

【代码展示规范】

1. 使用 markdown 代码块
   - 指定语言: \`\`\`typescript
   - 代码完整，可直接使用

2. 代码注释
   - 只在必要时添加注释
   - 注释解释"为什么"，不解释"是什么"
   - 复杂算法需要注释
   - 简单代码不需要注释

3. 代码格式
   - 保持一致的缩进（2或4空格）
   - 适当的空行分隔逻辑块
   - 行长度合理（不超过100字符）

【回复结构】

典型回复结构：

1. 简要说明（1-2句话，可选）
2. 工具调用（如需要）
3. 结果确认（1句话）

错误示范：
"好的！我来帮你创建这个文件。首先，让我检查一下项目结构..."

正确示范：
"创建配置文件。"
[工具调用]
"配置文件已创建在 src/config.ts"

================================================================================
第六部分：特殊场景处理
================================================================================

【代码生成场景】

当用户要求生成代码时：

1. 新建项目
   - 创建完整的项目结构
   - 包含所有必要文件
   - 配置文件完整
   - README 说明清晰

2. 新建功能模块
   - 分析现有代码风格
   - 保持架构一致性
   - 完整实现所有功能
   - 添加必要的类型定义

3. 修复 Bug
   - 先读取相关代码
   - 定位问题根源
   - 使用 edit_file 精确修复
   - 确保不引入新问题

4. 代码重构
   - 理解原有逻辑
   - 保持功能不变
   - 改善代码结构
   - 分步进行大重构

【配置和部署】

1. 环境配置
   - 提供完整的配置文件
   - 说明环境变量
   - 考虑不同环境（开发、生产）

2. 构建部署
   - 提供构建脚本
   - Docker 配置完整
   - CI/CD 配置可用

【文档编写】

1. README
   - 项目简介
   - 安装步骤
   - 使用方法
   - 配置说明

2. API 文档
   - 端点说明
   - 请求参数
   - 响应格式
   - 示例代码

3. 代码注释
   - 函数说明（参数、返回值）
   - 复杂逻辑解释
   - 使用 JSDoc/docstring 格式

================================================================================
第七部分：安全与最佳实践
================================================================================

【安全考虑】

1. 敏感信息
   - 不在代码中硬编码密钥、密码
   - 使用环境变量存储敏感配置
   - .env 文件加入 .gitignore

2. 输入验证
   - 验证所有用户输入
   - 防止注入攻击
   - 使用参数化查询

3. 错误处理
   - 不向用户暴露内部错误细节
   - 记录详细日志
   - 优雅降级

【性能考虑】

1. 代码效率
   - 选择合适的数据结构
   - 避免不必要的循环
   - 减少内存分配

2. 数据库
   - 合理使用索引
   - 避免 N+1 查询
   - 适当使用缓存

3. 前端
   - 减少重渲染
   - 懒加载资源
   - 优化打包体积

================================================================================
结语
================================================================================

你是一个专业的编程助手。你的目标是帮助用户高效完成开发任务。

记住：
- 代码必须完整，不能省略
- 直接行动，少说废话
- 不使用任何表情符号
- 像资深工程师一样思考

现在，等待用户的指令。`;
  }

  private async processFileReferences(input: string): Promise<string> {
    const fileRegex = /@([\w\-./]+)/g;
    let result = input;
    let match;
    
    while ((match = fileRegex.exec(input)) !== null) {
      const filePath = match[1];
      const fullPath = path.resolve(this.workdir, filePath);
      
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const snippet = content.length > 2000 
            ? content.slice(0, 2000) + '\n... (truncated)'
            : content;
          result = result.replace(match[0], `\n\nFile: ${filePath}\n\`\`\`\n${snippet}\n\`\`\`\n`);
          console.log(chalk.gray(`  + ${filePath}`));
        } catch (e) {
          // Keep original
        }
      }
    }
    
    return result;
  }

  private async handleCommand(command: string): Promise<void> {
    const parts = command.slice(1).split(' ');
    const cmd = parts[0];
    const args = parts.slice(1).join(' ').trim();
    
    switch (cmd) {
      case 'help':
        console.log();
        console.log(chalk.hex('#FFD700')('Commands:'));
        console.log(chalk.gray('  /help          ') + 'Show this help');
        console.log(chalk.gray('  /model         ') + 'Show available models');
        console.log(chalk.gray('  /model <name>  ') + 'Switch to model');
        console.log(chalk.gray('  /clear         ') + 'Clear chat history');
        console.log(chalk.gray('  /info          ') + 'Show session info');
        console.log(chalk.gray('  /context       ') + 'Show project context');
        console.log(chalk.gray('  /exit          ') + 'Exit');
        console.log();
        console.log(chalk.hex('#FFD700')('Tips:'));
        console.log(chalk.gray('  @filename      ') + 'Reference a file');
        console.log(chalk.gray('  Ctrl+C         ') + 'Exit');
        console.log();
        break;
        
      case 'model':
        if (args) {
          this.client.setModel(args);
          this.currentModel = args;
          // Save to config
          const cfg = await loadConfig();
          cfg.model = args;
          await saveConfig(cfg);
          console.log(chalk.green(`  Model: ${args} (saved)`));
          console.log();
        } else {
          console.log();
          console.log(chalk.hex('#FFD700')('Current Model: ') + chalk.white(this.currentModel));
          console.log();
          console.log(chalk.hex('#FFD700')('Available Models:'));
          console.log();
          
          const providers = listProviders();
          providers.forEach(p => {
            console.log(chalk.cyan(`  ${p.name}:`));
            p.models.forEach(m => {
              const isCurrent = m === this.currentModel;
              if (isCurrent) {
                console.log(chalk.hex('#FFD700')(`    ▸ ${m}`) + chalk.gray(' (current)'));
              } else {
                console.log(chalk.gray(`      ${m}`));
              }
            });
          });
          console.log();
          console.log(chalk.gray('  Usage: /model <model-name>'));
          console.log();
        }
        break;
        
      case 'clear':
        this.history = this.history.slice(0, 1);
        console.log(chalk.gray('  History cleared'));
        console.log();
        break;
        
      case 'info':
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(0);
        printDivider();
        console.log(chalk.hex('#FFD700')('Session:'));
        console.log(chalk.gray('  Provider: ') + chalk.white(this.provider));
        console.log(chalk.gray('  Model:    ') + chalk.white(this.currentModel));
        console.log(chalk.gray('  Messages: ') + chalk.white(String(this.history.length - 1)));
        console.log(chalk.gray('  Time:     ') + chalk.white(`${elapsed}s`));
        console.log(chalk.gray('  Dir:      ') + chalk.white(this.workdir));
        printDivider();
        console.log();
        break;
        
      case 'context':
        const ctx = await this.context.buildContext();
        console.log(chalk.gray(ctx));
        break;
        
      case 'exit':
      case 'quit':
        console.log();
        printStatusBar(this.workdir, this.provider);
        this.rl?.close();
        process.exit(0);
        break;
        
      default:
        console.log(chalk.yellow(`  Unknown command: ${cmd}`));
        console.log(chalk.gray('  Type /help for commands'));
        console.log();
    }
  }

  private async processMessage(message: string): Promise<void> {
    this.history.push({ role: 'user', content: message });
    
    // 启动加载动画
    const spinner = new LoadingSpinner('Thinking...');
    spinner.start();
    
    try {
      // 使用流式输出，过滤工具调用标签
      let fullResponse = '';
      let spinnerStopped = false;
      let inToolBlock = false;  // 是否在工具调用块中
      let buffer = '';  // 用于检测工具标签的缓冲区
      let hasOutputContent = false;  // 是否已输出过内容
      
      const response = await this.client.chatStream(this.history, (chunk, done) => {
        if (done) return;
        
        // 收到第一个 chunk 时停止加载动画
        if (!spinnerStopped) {
          spinner.stop();
          spinnerStopped = true;
        }
        
        fullResponse += chunk;
        buffer += chunk;
        
        // 检测是否进入工具调用块
        if (!inToolBlock && buffer.includes('<tool')) {
          inToolBlock = true;
          // 输出 <tool 之前的内容
          const beforeTool = buffer.split('<tool')[0];
          if (beforeTool.trim()) {
            if (!hasOutputContent) {
              process.stdout.write('  ');
              hasOutputContent = true;
            }
            this.outputText(beforeTool);
          }
          buffer = '<tool' + buffer.split('<tool').slice(1).join('<tool');
        }
        
        // 如果不在工具块中，正常输出
        if (!inToolBlock) {
          if (!hasOutputContent && buffer.trim()) {
            process.stdout.write('  ');
            hasOutputContent = true;
          }
          // 保留可能是工具标签开始的部分
          if (buffer.includes('<')) {
            const lastAngle = buffer.lastIndexOf('<');
            const safeOutput = buffer.substring(0, lastAngle);
            if (safeOutput) {
              this.outputText(safeOutput);
            }
            buffer = buffer.substring(lastAngle);
          } else {
            this.outputText(buffer);
            buffer = '';
          }
        }
      });
      
      // 输出剩余的非工具内容
      if (!inToolBlock && buffer.trim() && !buffer.includes('<tool')) {
        if (!hasOutputContent) {
          process.stdout.write('  ');
        }
        this.outputText(buffer);
      }
      
      if (hasOutputContent) {
        console.log();
      }
      
      // 解析工具调用
      const { text, toolCalls } = this.parseResponse(fullResponse);
      
      // 如果有工具调用，执行工具
      if (toolCalls.length > 0) {
        const toolResults: string[] = [];

        for (const tool of toolCalls) {
          // 显示工具执行加载状态（带换行，确保立即显示）
          const summary = this.getToolSummary(tool.name, tool.params, true);
          process.stdout.write(chalk.gray('  [...] ') + summary + chalk.gray(' ...'));
          // 强制刷新输出缓冲，确保立即显示
          if (typeof (process.stdout as any)._handle?.setBlocking === 'function') {
            (process.stdout as any)._handle.setBlocking(true);
          }

          try {
            const result = await this.tools.execute(tool.name, tool.params);
            // 工具执行完成，清除加载行并显示结果
            process.stdout.write('\r' + ' '.repeat(80) + '\r');
            this.printToolResult(summary, true);
            toolResults.push(`[${tool.name}] Success:\n${result}`);
          } catch (toolError: any) {
            // 工具执行失败，清除加载行并显示错误
            process.stdout.write('\r' + ' '.repeat(80) + '\r');
            const errorSummary = this.getToolSummary(tool.name, tool.params, false);
            this.printToolResult(errorSummary, false, toolError.message);
            toolResults.push(`[${tool.name}] Error: ${toolError.message}`);
          }
        }
        
        // 保存当前回复
        this.history.push({ role: 'assistant', content: fullResponse });
        
        // 把工具结果作为新消息，让 AI 继续
        const toolResultMsg = `工具执行结果:\n${toolResults.join('\n\n')}\n\n请根据以上结果继续。`;
        this.history.push({ role: 'user', content: toolResultMsg });
        
        // 继续对话（流式，过滤工具标签）
        let followUpResponse = '';
        let followUpInToolBlock = false;
        let followUpBuffer = '';
        let followUpHasOutput = false;
        
        const followUp = await this.client.chatStream(this.history, (chunk, done) => {
          if (done) return;
          
          followUpResponse += chunk;
          followUpBuffer += chunk;
          
          if (!followUpInToolBlock && followUpBuffer.includes('<tool')) {
            followUpInToolBlock = true;
            const beforeTool = followUpBuffer.split('<tool')[0];
            if (beforeTool.trim()) {
            if (!followUpHasOutput) {
              process.stdout.write('  ');
              followUpHasOutput = true;
            }
              this.outputText(beforeTool);
            }
            followUpBuffer = '';
          }
          
          if (!followUpInToolBlock) {
          if (!followUpHasOutput && followUpBuffer.trim()) {
            process.stdout.write('  ');
            followUpHasOutput = true;
          }
            if (followUpBuffer.includes('<')) {
              const lastAngle = followUpBuffer.lastIndexOf('<');
              const safeOutput = followUpBuffer.substring(0, lastAngle);
              if (safeOutput) {
                this.outputText(safeOutput);
              }
              followUpBuffer = followUpBuffer.substring(lastAngle);
            } else {
              this.outputText(followUpBuffer);
              followUpBuffer = '';
            }
          }
        });
        
        if (!followUpInToolBlock && followUpBuffer.trim() && !followUpBuffer.includes('<tool')) {
          if (!followUpHasOutput) {
            process.stdout.write('  ');
          }
          this.outputText(followUpBuffer);
        }
        
        if (followUpHasOutput) {
          console.log();
        }
        
        this.history.push({ role: 'assistant', content: followUpResponse });
        
        // 检查是否还有更多工具调用
        const { toolCalls: moreCalls } = this.parseResponse(followUpResponse);
        if (moreCalls.length > 0) {
          await this.executeMoreTools(moreCalls, followUpResponse);
        }
        
      } else {
        // 没有工具调用
        this.history.push({ role: 'assistant', content: fullResponse });
      }
      
      console.log();
      
    } catch (error: any) {
      spinner.stop();  // 确保停止加载动画
      console.log();
      printError(error.message);
      console.log();
    }
  }

  // 自动执行更多工具调用
  private async executeMoreTools(
    toolCalls: Array<{ name: string; params: { [key: string]: string } }>,
    previousResponse: string
  ): Promise<void> {
    const toolResults: string[] = [];

    for (const tool of toolCalls) {
      // 显示工具执行加载状态（带换行，确保立即显示）
      const summary = this.getToolSummary(tool.name, tool.params, true);
      process.stdout.write(chalk.gray('  [...] ') + summary + chalk.gray(' ...'));
      // 强制刷新输出缓冲，确保立即显示
      if (typeof (process.stdout as any)._handle?.setBlocking === 'function') {
        (process.stdout as any)._handle.setBlocking(true);
      }

      try {
        const result = await this.tools.execute(tool.name, tool.params);
        // 工具执行完成，清除加载行并显示结果
        process.stdout.write('\r' + ' '.repeat(80) + '\r');
        this.printToolResult(summary, true);
        toolResults.push(`[${tool.name}] Success:\n${result}`);
      } catch (toolError: any) {
        // 工具执行失败，清除加载行并显示错误
        process.stdout.write('\r' + ' '.repeat(80) + '\r');
        const errorSummary = this.getToolSummary(tool.name, tool.params, false);
        this.printToolResult(errorSummary, false, toolError.message);
        toolResults.push(`[${tool.name}] Error: ${toolError.message}`);
      }
    }
    
    // 添加工具结果到历史
    const toolResultMsg = `工具执行结果:\n${toolResults.join('\n\n')}\n\n请继续。`;
    this.history.push({ role: 'user', content: toolResultMsg });

    // 继续对话（流式）
    try {
      let followUpResponse = '';
      let inToolBlock = false;
      let buffer = '';
      let hasOutputContent = false;
      
      const followUp = await this.client.chatStream(this.history, (chunk, done) => {
        if (done) return;

        followUpResponse += chunk;
        buffer += chunk;
        
        // 检测是否进入工具调用块
        if (!inToolBlock && buffer.includes('<tool')) {
          inToolBlock = true;
          const beforeTool = buffer.split('<tool')[0];
          if (beforeTool.trim()) {
            if (!hasOutputContent) {
              process.stdout.write('  ');
              hasOutputContent = true;
            }
            this.outputText(beforeTool);
          }
          buffer = '';
        }
        
        // 如果不在工具块中，正常输出
        if (!inToolBlock) {
          if (!hasOutputContent && buffer.trim()) {
            process.stdout.write('  ');
            hasOutputContent = true;
          }
          if (buffer.includes('<')) {
            const lastAngle = buffer.lastIndexOf('<');
            const safeOutput = buffer.substring(0, lastAngle);
            if (safeOutput) {
              this.outputText(safeOutput);
            }
            buffer = buffer.substring(lastAngle);
          } else {
            this.outputText(buffer);
            buffer = '';
          }
        }
      });
      
      if (!inToolBlock && buffer.trim() && !buffer.includes('<tool')) {
        if (!hasOutputContent) {
          process.stdout.write('  ');
        }
        this.outputText(buffer);
      }
      
      if (hasOutputContent) {
        console.log();
      }
      
      const { toolCalls: moreCalls } = this.parseResponse(followUpResponse);
      
      this.history.push({ role: 'assistant', content: followUpResponse });
      
      // 递归处理更多工具调用
      if (moreCalls.length > 0) {
        await this.executeMoreTools(moreCalls, followUpResponse);
      } else {
        console.log();
      }

    } catch (error: any) {
      console.log();
      console.log(chalk.yellow('  Error: ' + error.message));
      console.log();
    }
  }

  // 辅助方法：输出文本，处理换行缩进
  private outputText(text: string): void {
    for (const char of text) {
      if (char === '\n') {
        process.stdout.write('\n  ');
      } else {
        process.stdout.write(chalk.white(char));
      }
    }
  }

  private parseResponse(response: string): { text: string; toolCalls: Array<{ name: string; params: { [key: string]: string } }> } {
    const toolCalls: Array<{ name: string; params: { [key: string]: string } }> = [];
    let text = response;
    
    const toolRegex = /<tool name="(\w+)">([\s\S]*?)<\/tool>/g;
    let match;
    
    while ((match = toolRegex.exec(response)) !== null) {
      const toolName = match[1];
      const paramsStr = match[2];
      const params: { [key: string]: string } = {};
      
      const paramRegex = /<param name="(\w+)">([\s\S]*?)<\/param>/g;
      let paramMatch;
      
      while ((paramMatch = paramRegex.exec(paramsStr)) !== null) {
        params[paramMatch[1]] = paramMatch[2];
      }
      
      toolCalls.push({ name: toolName, params });
      text = text.replace(match[0], '');
    }
    
    return { text: text.trim(), toolCalls };
  }

  // 获取工具操作的简洁描述（带样式）
  private getToolSummary(toolName: string, params: { [key: string]: string }, success: boolean): string {
    const filePath = params.path || params.file || '';
    const shortPath = filePath.length > 50 ? '...' + filePath.slice(-47) : filePath;
    
    // 使用不同样式：操作用青色，路径用黄色
    const action = chalk.cyan;
    const target = chalk.yellow;
    
    switch (toolName) {
      case 'read_file':
        return action('读取') + chalk.gray(' ') + target(shortPath);
      case 'write_file':
        return action('创建') + chalk.gray(' ') + target(shortPath);
      case 'edit_file':
        return action('编辑') + chalk.gray(' ') + target(shortPath);
      case 'delete_file':
        return action('删除') + chalk.gray(' ') + target(shortPath);
      case 'list_dir':
        return action('浏览') + chalk.gray(' ') + target(shortPath || '.');
      case 'run_command':
        const cmd = params.command || '';
        const shortCmd = cmd.length > 40 ? cmd.slice(0, 37) + '...' : cmd;
        return action('执行') + chalk.gray(' ') + chalk.magenta(shortCmd);
      case 'search_files':
        return action('搜索') + chalk.gray(' ') + target(params.pattern || '') + chalk.gray(' in ') + target(shortPath || '.');
      default:
        return action(toolName) + chalk.gray(' ') + target(shortPath);
    }
  }

  // 格式化显示工具操作
  private printToolResult(summary: string, success: boolean, error?: string): void {
    const icon = success ? chalk.green('●') : chalk.red('●');
    const line = `  ${icon} ${summary}`;
    
    if (error) {
      console.log(line + chalk.gray(` - ${error}`));
    } else {
      console.log(line);
    }
  }
}
