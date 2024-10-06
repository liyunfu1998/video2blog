"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { uploadAction } from "@/actions/upload-action";
import { useState } from "react";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must not exceed 20MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be an audio ot a video file."
    ),
});
export default function UploadForm() {
  const { toast } = useToast();
  const [transcription, setTranscription] = useState("");

  const handleTranscribe = async (formData: FormData) => {
    const file = formData.get("file") as File;

    const validatedFields = schema.safeParse({ file });

    if (!validatedFields.success) {
      console.log(
        "validatedFields",
        validatedFields.error.flatten().fieldErrors
      );
      toast({
        title: "Something went wrong",
        description:
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid file",
        variant: "destructive",
      });
    }

    if (file) {
      toast({
        title: "🎤 Transcription is in progress...",
        description:
          "Hang tight! Our digital wizards are sprinkling magic dust on your file!",
      });

      try {
        const response = await fetch("/api/aitransform", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Unable to read response");
        }

        let accumulatedTranscription = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode the received chunk and add it to the accumulated transcription
          const chunk = new TextDecoder().decode(value);
          accumulatedTranscription += chunk;
          setTranscription(accumulatedTranscription);
        }

        toast({
          title: "Transcription completed",
          description: "Your file has been successfully transcribed!",
        });

        // You can now use the complete transcription as needed
        console.log("Complete transcription:", accumulatedTranscription);

        // Call uploadAction if needed
        const uploadResponse = await uploadAction();
        console.log("Upload response:", { uploadResponse });
      } catch (error) {
        console.error("Error during transcription:", error);
        toast({
          title: "Transcription failed",
          description: "An error occurred while transcribing your file.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form className="flex flex-col gap-6" action={handleTranscribe}>
      <div className="flex justify-end items-center gap-1.5">
        <Input
          id="file"
          name="file"
          type="file"
          accept="audio/*, video/*"
          required
        />
        <Button className="bg-purple-600">Transcribe</Button>
      </div>
      {transcription && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Transcription:</h3>
          <p className="whitespace-pre-wrap">{transcription}</p>
        </div>
      )}
    </form>
  );
}
