import { getPostColors as getPostColorsFromUnified } from "./colors";

export function getPostColors(slug: string) {
  return getPostColorsFromUnified(slug);
}
