"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/uatils/uploadthing";
import { transcribeUploadedFile } from "@/actions/upload-actions";

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
  const { startUpload } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
      toast({ title: "uploaded successfully" });
    },
    onUploadError: () => {
      console.log("error");
      toast({ title: "Something went wrong", variant: "destructive" });
    },
    onUploadBegin: () => {
      toast({ title: "Upload has begun 🚀" });
    },
  });
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
      const resp = await startUpload([file]);

      console.log(resp);

      if (!resp) {
        toast({
          title: "Something went wrong",
          description: "Please use a different file",
          variant: "destructive",
        });
      }
      toast({
        title: "🎤 Transcription is in progress...",
        description:
          "Hang tight! Our digital wizards are sprinkling magic dust on your file!",
      });

      const result = await transcribeUploadedFile(resp);
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
