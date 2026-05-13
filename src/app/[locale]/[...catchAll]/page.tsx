import { getGT } from "gt-next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();

  return {
    title: gt("Page Not Found - Ben Gubler"),
    description: gt("The page you're looking for doesn't exist."),
  };
}

export default function CatchAll() {
  notFound();
}
