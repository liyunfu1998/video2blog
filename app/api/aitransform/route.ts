import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import FormData from "form-data";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 }
    );
  }

  // 将 File 对象转换为 Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 创建新的 FormData
  const form = new FormData();
  form.append("file", Readable.from(buffer), {
    filename: file.name,
    contentType: file.type,
  });
  form.append("model", "FunAudioLLM/SenseVoiceSmall");

  try {
    const response = await fetch(
      "https://api.siliconflow.cn/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SILICON_FLOW_TOKEN}`,
          ...form.getHeaders(),
        },
        body: form,
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error details:", errorData);
      return NextResponse.json(
        { success: false, error: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
