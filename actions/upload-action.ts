"use server";

import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.siliconflow.cn/v1",
  apiKey: process.env.SILICON_FLOW_TOKEN,
});

export async function uploadAction() {
  const response = await client.chat.completions.create({
    model: "deepseek-ai/DeepSeek-V2.5",
    messages: [
      {
        role: "user",
        content:
          "SiliconCloud公测上线，每用户送3亿token 解锁开源大模型创新能力。对于整个大模型应用领域带来哪些改变？",
      },
    ],
    stream: true,
  });

  console.log("response", { response });

  return "aaa";
}
