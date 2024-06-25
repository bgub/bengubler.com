"use client";

import { useSearchParams } from "next/navigation";
import { buttonVariants } from "./ui/button";

import { cn, createQueryString } from "@/lib/utils";
import Link from "next/link";

export function TagButton({ name, count }: { name: string; count: number }) {
  const searchParams = useSearchParams();

  const isActive = searchParams.get("tag") === name;

  const newQuery = isActive ? "" : createQueryString("tag", name);

  return (
    <Link
      href={`/posts?${newQuery}`}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "secondary",
        }),
        "border-2 no-underline",
        isActive && "border-black"
      )}
    >
      # {name} ({count})
    </Link>
  );
}

export function PostTagButton({ name }: { name: string }) {
  return (
    <Link
      href={`/posts?${createQueryString("tag", name)}`}
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "border-2 h-7 no-underline"
      )}
    >
      # {name}
    </Link>
  );
}

export function CardTag({ name }: { name: string }) {
  return (
    <div
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "border-2 h-7"
      )}
    >
      # {name}
    </div>
  );
}
