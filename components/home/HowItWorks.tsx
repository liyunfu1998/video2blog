import { BrainIcon, MoveRight } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center w-full pb-6">
          <h2 className="font-bold text-xl uppercase mb-8 text-purple-600">
            How it works
          </h2>
        </div>
        <h3 className="flex items-center justify-center mb-24 text-center font-bold text-3xl text-gray-800">
          Easily repurpose your content into SEO focused blog posts
        </h3>
        <div className="flex items-center justify-center gap-4 lg:gap-24">
          <div className="flex flex-col gap-4">
            <span
              className="text-7xl text-center"
              role="img"
              aria-label="Video camera"
            >
              🎥
            </span>
            <p className="text-center font-medium">Upload a Video</p>
          </div>
          <MoveRight size={64} strokeWidth={0.5} className="text-purple-500" />
          <div className="flex flex-col gap-4">
            <span className="flex items-center justify-start">
              <BrainIcon size={64} strokeWidth={0.5} />
            </span>
            <p className="text-center font-medium">AI Magic ✨</p>
          </div>
          <MoveRight size={64} strokeWidth={0.5} className="text-purple-500" />
          <div className="flex flex-col gap-4">
            <span
              className="text-7xl text-center"
              role="img"
              aria-label="Document"
            >
              📃
            </span>
            <p className="text-center font-medium">Blog</p>
          </div>
        </div>
      </div>
    </section>
  );
}
