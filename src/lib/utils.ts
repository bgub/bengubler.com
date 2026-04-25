import { type ClassNameValue, twMerge } from "tailwind-merge";

export function cn(...inputs: unknown[]) {
  return twMerge(
    inputs.filter((v) => typeof v === "string") as ClassNameValue[],
  );
}

export const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else if (process.env.NEXT_PUBLIC_URL) {
    // set in vercel project settings
    return process.env.NEXT_PUBLIC_URL;
  }

  // Fallback in case NEXT_PUBLIC_URL isn't set for some reason
  return "https://www.bengubler.com";
};
