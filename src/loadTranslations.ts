import type { Translation } from "gt-i18n/types";
import { isLocale, type Locale } from "@/lib/locales";

const translationLoaders = {
  ar: () => import("@/_gt/ar.json"),
  cs: () => import("@/_gt/cs.json"),
  en: () => import("@/_gt/en.json"),
  eo: () => import("@/_gt/eo.json"),
  ru: () => import("@/_gt/ru.json"),
  sk: () => import("@/_gt/sk.json"),
} satisfies Record<Locale, () => Promise<{ default: Record<string, unknown> }>>;

export async function loadTranslations(locale: string) {
  if (!isLocale(locale)) throw new Error(`Unsupported locale: ${locale}`);
  return (await translationLoaders[locale]()).default as Record<
    string,
    Translation
  >;
}
