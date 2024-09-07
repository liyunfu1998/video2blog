import Link from "next/link";
import { Bot } from "lucide-react";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="transition-colors duration-200 text-gray-600 hover:text-purple-500"
    >
      {children}
    </Link>
  );
};
export default function Header() {
  return (
    <nav className="container flex items-center justify-between px-8 py-4 mx-auto">
      <div className="flex lg:flex-1">
        <NavLink href={"/"}>
          <span className="flex items-center gap-2 shrink-0">
            <Bot className="hover:rotate-12 transform transition duration-200 ease-in-out" />
            <span className="font-extrabold text-lg">Video2Blog</span>
          </span>
        </NavLink>
      </div>

      <div className="flex lg:justify-center gap-2 lg:gap-12 lg:items-center">
        <NavLink href={"/#pricing"}>价格</NavLink>
        <NavLink href={"/#posts"}>你的文章</NavLink>
      </div>

      <div className="flex lg:justify-end lg:flex-1">
        <div className="flex gap-2 items-center">
          <NavLink href="/dashboard">上传视频</NavLink>
          {/* Profile */}
          <NavLink href="/sign-in">去登录</NavLink>
        </div>
      </div>
    </nav>
  );
}
