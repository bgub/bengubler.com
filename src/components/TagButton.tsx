"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { buttonVariants } from "./ui/button";

import { cn, modifySearchParams } from "@/lib/utils";
import Link from "next/link";

export function TagButton({ name, count }: { name: string; count: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isActive = searchParams.get("tag") === name;

  let newQuery = new URLSearchParams(searchParams);
  if (isActive) {
    newQuery.delete("tag");
  } else {
    newQuery.set("tag", name);
  }

  return (
    <Link
      href={`${pathname}?${newQuery.toString()}`}
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
  const blankParams = new URLSearchParams();

  return (
    <Link
      href={`/posts?${modifySearchParams(blankParams, {
        tag: name,
      })}`}
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
