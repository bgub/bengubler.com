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

export type RouterSearchParams = {
  [key: string]: string | string[] | undefined;
};

export function buildSearchParams(searchParams: RouterSearchParams) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  });

  return params;
}

export function modifySearchParams(
  searchParams: URLSearchParams,
  newParams: { [key: string]: string | string[] }
) {
  const params = new URLSearchParams(searchParams.toString());
  Object.entries(newParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }
  });

  return params.toString();
}
