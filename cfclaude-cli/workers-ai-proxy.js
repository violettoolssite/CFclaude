// Cloudflare Workers AI 中转示例
// 部署到 Cloudflare Workers 后，CF Coder 将通过此 Worker 访问 AI 模型

export default {
  async fetch(request, env) {
    // 处理 CORS 预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // 只允许 POST 请求
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      // 从请求中获取模型名称，如果没有则使用默认模型
      const modelName = body.model || "@cf/meta/llama-3.1-8b-instruct";

      // 准备发送到 Workers AI 的消息
      const messages = body.messages || [];

      // 调用 Cloudflare Workers AI
      const response = await env.AI.run(modelName, {
        messages: messages,
        stream: body.stream || false,
        max_tokens: body.max_tokens || 2048,
        temperature: body.temperature || 0.7,
      });

      // 如果是流式响应
      if (body.stream) {
        return new Response(response, {
          headers: {
            "Content-Type": "text/event-stream",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // 非流式响应
      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
          details: "Failed to process request with Cloudflare Workers AI",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
