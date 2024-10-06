"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

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

      const result = await fetch("/api/aitransform", {
        method: "POST",
        body: formData,
      });
      console.log("openai", { result });
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
    </form>
  );
}
