import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
export default function Banner() {
  return (
    <section className="lg:max-w-6xl mx-auto flex flex-col z-0 items-center justify-center py-28 sm:pt-32 transition-all animate-in">
      <h1 className="py-6 text-center">
        将你的话转换为
        <span className="underline underline-offset-8 decoration-dashed decoration-purple-200">
          精彩的
        </span>
        博文
      </h1>
      <h2 className="text-center px-4 lg:px-0 lg:max-x-4xl">
        利用AI技术，您可以在几秒钟内将视频或语音快速转换成博客文章！
      </h2>
      <Button
        variant={"link"}
        className="mt-6 text-xl rounded-full px-12 py-8 lg:mt-20 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg hover:no-underline"
      >
        <Link href="/#pricing" className="flex gap-2 items-center">
          <span className="relative">立即开始</span>
          <ArrowRightIcon className="animate-pulse" />
        </Link>
      </Button>
    </section>
  );
}
