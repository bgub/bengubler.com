import { isLocale } from "@/lib/locales";

export async function loadTranslations(locale: string) {
  if (!isLocale(locale)) throw new Error(`Unsupported locale: ${locale}`);
  return (await import(`./_gt/${locale}.json`)).default;
}
