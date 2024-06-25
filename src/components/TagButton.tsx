"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

import { createQueryString } from "@/lib/utils";
import Link from "next/link";

export function TagButton({ name, count }: { name: string; count: number }) {
  const searchParams = useSearchParams();

  const isActive = searchParams.get("tag") === name;

  const newQuery = isActive ? "" : createQueryString("tag", name);

  return (
    <Button variant={isActive ? "default" : "secondary"} asChild>
      <Link href={`/posts?${newQuery}`} className="z-50 no-underline">
        # {name} ({count})
      </Link>
    </Button>
  );
}

export function InlineTagButton({ name }: { name: string }) {
  return (
    <Button variant="default" className="h-7 border px-3" asChild>
      <Link
        href={`/posts?${createQueryString("tag", name)}`}
        className="z-50 no-underline"
      >
        # {name}
      </Link>
    </Button>
  );
}
