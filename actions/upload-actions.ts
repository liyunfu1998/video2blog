"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeUploadedFile(
  resp: {
    serverData: { userId: string; file: any };
  }[]
) {
  if (!resp) {
    return {
      success: false,
      message: "File upload failed!",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: fileUrl, name: fileName },
    },
  } = resp[0];

  if (!fileUrl || !fileName) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const response = await fetch(fileUrl);
  console.log("response", { response });
  try {
    const transcriptions = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: response,
      response_format: "text",
    });
    console.log({ transcriptions });
    return {
      success: true,
      message: "File uploaded successfully",
      data: { transcriptions, userId },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
