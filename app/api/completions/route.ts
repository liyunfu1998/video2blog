import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(
    "https://api.siliconflow.cn/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SILICON_FLOW_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-72B-Instruct",
        stream: true,
        messages: body?.messages,
      }),
    }
  );
  console.log("response", response);
  if (!response.ok) {
    return new NextResponse(`SiliconFlow API error: ${response.statusText}`, {
      status: response.status,
    });
  }

  const reader = response?.body?.getReader();
  const textDecoder = new TextDecoder();
  let result = "";
  const readStream = async () => {
    let buffer = "";

    while (true) {
      const { done, value } = await reader!.read();
      if (done) {
        console.log("Stream complete");
        break;
      }

      const chunk = textDecoder.decode(value, { stream: true });
      buffer += chunk;

      // 解析事件块
      while (true) {
        const eventEndIndex = buffer.indexOf("\n\n");
        if (eventEndIndex === -1) break;

        const eventBlock = buffer.slice(0, eventEndIndex);
        buffer = buffer.slice(eventEndIndex + 2);

        const lines = eventBlock.split("\n");
        const event = {
          event: "",
          data: "",
        };

        lines.forEach((line) => {
          const [key, value] = line.split(": ");
          if (key === "event") {
            event.event = value;
          } else if (key === "data") {
            event.data += value + "\n";
          }
        });

        // 去除最后一个换行符
        event.data = event.data.trim();

        // 检查 data 是否为有效的 JSON 字符串
        if (event.data === "[DONE]") {
          console.log("Stream data complete");
          continue; // 跳过 [DONE] 标记
        }

        // 尝试将 data 解析为 JSON 对象
        try {
          event.data = JSON.parse(event.data);
          console.log("Received event:", event);
          // 在这里处理接收到的数据

          result += (event.data as any)?.choices?.[0]?.delta?.content ?? "";
        } catch (error) {
          console.error("Failed to parse JSON data:", error);
        }
      }
    }
  };

  await readStream();

  return new NextResponse(result, { status: 200 });
}
