import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getTransitionName(slug: string, prefix: string) {
  return prefix + slug.replace(/[^\w\s\-\/]/gi, "").replace(/[\s\/]/g, "-");
}

export function getTransitionStyle(slug: string, prefix: string = "") {
  return {
    viewTransitionName: getTransitionName(slug, prefix),
  };
}
