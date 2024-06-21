"use client";

import { useEffect, useState } from "react";

import { LightDarkToggle } from "@/components/LightDarkToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  LanguagesIcon,
  MenuIcon,
  PresentationIcon,
  RssIcon,
  SendIcon,
  UserIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";

const Hr = ({ key }: { key: number }) => (
  <hr key={key} className="w-full border" />
);

const navLinks = [
  { name: "Home", href: "/", activePattern: /^\/$/, icon: HomeIcon },
  { name: "About", href: "/about", activePattern: /^\/about/, icon: UserIcon },
  {
    name: "Contact",
    href: "/contact",
    activePattern: /^\/contact/,
    icon: SendIcon,
  },
  Hr,
  {
    name: "My Stack",
    href: "/my-stack",
    activePattern: /^\/my-stack/,
    icon: WrenchIcon,
  },

  Hr,
  {
    name: "Projects",
    href: "/projects",
    activePattern: /^\/projects/,
    icon: PresentationIcon,
  },
  { name: "Posts", href: "/posts", activePattern: /^\/posts/, icon: RssIcon },
  // TODO add some day
  // {
  //   name: "Microblog",
  //   href: "/microblog",
  //   activePattern: /^\/microblog/,
  //   icon: NotebookIcon,
  // },
  Hr,
  {
    name: "Language Learning",
    href: "/language-learning",
    activePattern: /^\/language-learning/,
    icon: LanguagesIcon,
  },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-center p-4 max-h-screen sm:sticky top-0">
      <div
        className={cn(
          "h-full w-full min-w-48 xl:min-w-64 flex flex-col sm:py-4"
          // "border rounded-xl shadow bg-card"
        )}
      >
        {/* max-h-[64rem] */}
        <div className="flex flex-row sm:flex-col items-center sm:items-start sm:ml-2 sm:mb-4">
          <Link href="/">
            <Image
              src="/bengubler.jpg"
              alt="Ben Gubler"
              width={80}
              height={80}
              className="rounded-full mr-4 w-12 h-12 sm:w-20 sm:h-20"
            />
          </Link>

          <Link href="/">
            <div className="flex flex-col justify-center sm:mt-2">
              <p className="text-lg font-semibold">Ben Gubler</p>
              <p className="text-sm text-muted-foreground">@nebrelbug</p>
            </div>
          </Link>

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
          {navLinks.map((navItem, i) => {
            if (typeof navItem === "function") {
              return navItem({ key: i });
            }

            return (
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "justify-start px-4",
                  navItem.activePattern.test(pathname) && "bg-accent",
                  "text-lg font-semibold"
                )}
                size="lg"
                key={navItem.name}
              >
                <Link href={navItem.href}>
                  {navItem.icon && (
                    <navItem.icon className="mr-2 h-5 w-5" strokeWidth={2} />
                  )}
                  {navItem.name}
                </Link>
              </Button>
            );
          })}
        </nav>
        <LightDarkToggle className={cn(!isOpen && "hidden sm:flex")} />
      </div>
    </div>
  );
}
