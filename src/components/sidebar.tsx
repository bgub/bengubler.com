"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Code,
  FileText,
  FolderOpen,
  Home,
  Languages,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  {
    name: "My Stack",
    href: "/about/my-stack",
    icon: Code,
    isSubItem: true,
    parent: "About",
  },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  {
    name: "Language Learning",
    href: "/language-learning",
    icon: Languages,
    isSubItem: true,
    parent: "Projects",
  },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Contact", href: "/contact", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-64 md:flex-col">
      <div className="flex grow flex-col overflow-y-auto bg-background">
        <div className="flex grow flex-col gap-y-5 px-6 py-8 md:py-12">
          {/* Profile Section */}
          <Link href="/" className="flex items-start space-x-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-border/20 group-hover:ring-border/40 transition-all">
              <Image
                src="/bengubler.jpg"
                alt="Ben Gubler"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                Ben Gubler
              </h2>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                @bgub
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/posts" && pathname.startsWith("/posts/")) ||
                  (item.href === "/language-learning" &&
                    pathname.startsWith("/language-learning"));
                return (
                  <li key={item.name} className="relative">
                    {item.isSubItem && (
                      <div className="absolute left-2 top-0 h-1/2 w-px bg-border/70"></div>
                    )}
                    {item.isSubItem && (
                      <div className="absolute left-2 top-1/2 w-4 h-px bg-border/70"></div>
                    )}
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-all duration-200 ${
                        item.isSubItem ? "ml-6" : ""
                      } ${
                        isActive
                          ? "bg-accent text-foreground border border-border"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent"
                      }`}
                    >
                      <item.icon
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* Theme Toggle */}
        <div className="px-6 pb-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
