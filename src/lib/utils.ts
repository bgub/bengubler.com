import { type ClassNameValue, twMerge } from "tailwind-merge";

export function cn(...inputs: unknown[]) {
  return twMerge(
    inputs.filter((v) => typeof v === "string") as ClassNameValue[],
  );
}

export const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  const configuredUrl =
    process.env.VITE_PUBLIC_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configuredUrl) {
    return configuredUrl.startsWith("http")
      ? configuredUrl
      : `https://${configuredUrl}`;
  }

  return "https://bengubler.com";
};
