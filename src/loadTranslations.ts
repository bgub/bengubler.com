const translationLoaders = {
  ar: () => import("../public/_gt/ar.json"),
  cs: () => import("../public/_gt/cs.json"),
  en: () => import("../public/_gt/en.json"),
  ru: () => import("../public/_gt/ru.json"),
  sk: () => import("../public/_gt/sk.json"),
  eo: () => import("../public/_gt/eo.json"),
};

export async function loadTranslations(locale: string) {
  try {
    const load = translationLoaders[locale as keyof typeof translationLoaders];
    if (!load) return {};

    const t = await load();
    return t.default;
  } catch (error) {
    console.warn(`Failed to load translations for locale ${locale}:`, error);
    return {};
  }
}
