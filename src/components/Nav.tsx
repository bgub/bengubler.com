"use client";

import { useState } from "react";

import { LightDarkToggle } from "@/components/LightDarkToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  LayoutPanelLeftIcon,
  MenuIcon,
  RssIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/", activePattern: /^\/$/, icon: HomeIcon },
  { name: "About", href: "/about", activePattern: /^\/about/, icon: UserIcon },
  {
    name: "Projects",
    href: "/projects",
    activePattern: /^\/projects/,
    icon: LayoutPanelLeftIcon,
  },
  { name: "Blog", href: "/posts", activePattern: /^\/posts/, icon: RssIcon },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  console.log(pathname);

  return (
    <div className="flex items-center m-4">
      <div className="h-full w-full min-w-64 flex flex-col p-4 border rounded-xl shadow bg-card">
        {/* max-h-[64rem] */}
        <div className="flex flex-row sm:flex-col items-center sm:items-start">
          <Image
            src="/bengubler.jpg"
            alt="Ben Gubler"
            width={80}
            height={80}
            className="rounded-full mr-4 w-12 h-12 sm:w-20 sm:h-20"
          />
          <div className="flex flex-col justify-center sm:mt-2">
            <p className="text-lg font-semibold">Ben Gubler</p>
            <p className="text-sm text-muted-foreground">@nebrelbug</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav
          className={cn(
            "flex flex-col my-4 gap-2",
            // "animate-in fade-in slide-in-from-top",
            !isOpen && "hidden sm:flex"
          )}
        >
          {navLinks.map((link, i) => (
            <Button
              asChild
              variant="ghost"
              className={cn(
                "justify-start px-4",
                link.activePattern.test(pathname) && "bg-accent"
              )}
              size="lg"
              key={link.name}
            >
              <Link href={link.href}>
                {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                {link.name}
              </Link>
            </Button>
          ))}
        </nav>
        <LightDarkToggle className={cn(!isOpen && "hidden sm:flex")} />
      </div>
    </div>
  );
}
