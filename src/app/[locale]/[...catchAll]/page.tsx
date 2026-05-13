import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Page Not Found - Ben Gubler",
  description: "The page you're looking for doesn't exist.",
};

export default function CatchAll() {
  notFound();
}
