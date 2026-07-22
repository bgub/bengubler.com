import { getLocalizedPath, type Locale, resolveLocale } from "./locales.ts";

const siteName = "Ben Gubler";
const siteUrl = "https://bengubler.com";

type PageMetadataOptions = {
  description: string;
  locale: Locale;
  title: string;
};

type PostMetadataOptions = PageMetadataOptions & {
  date: Date;
  lastUpdated?: Date;
  tags: string[];
};

function getImageUrl({ description, locale, title }: PageMetadataOptions) {
  const params = new URLSearchParams({ title, description });
  return `${siteUrl}${getLocalizedPath("/og", locale)}?${params.toString()}`;
}

export function getPageMetadata(options: PageMetadataOptions) {
  const image = getImageUrl(options);

  return [
    { title: options.title },
    { name: "description", content: options.description },
    { name: "author", content: siteName },
    { property: "og:title", content: options.title },
    { property: "og:description", content: options.description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: siteName },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: options.title },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: "@bgub_" },
    { name: "twitter:title", content: options.title },
    { name: "twitter:description", content: options.description },
    { name: "twitter:image", content: image },
    {
      name: "googlebot",
      content: "max-video-preview:-1, max-image-preview:large, max-snippet:-1",
    },
  ];
}

export function getRouteMetadata(
  options: Omit<PageMetadataOptions, "locale"> | undefined,
  locale: string | undefined,
) {
  return options
    ? getPageMetadata({ ...options, locale: resolveLocale(locale) })
    : [];
}

export function getPostMetadata(options: PostMetadataOptions) {
  const image = getImageUrl(options);
  const pageMetadata = getPageMetadata(options)
    .map((entry) =>
      "title" in entry ? { title: `${options.title} - ${siteName}` } : entry,
    )
    .filter((entry) => !("property" in entry && entry.property === "og:type"));

  return [
    ...pageMetadata,
    { property: "og:type", content: "article" },
    { property: "article:published_time", content: options.date.toISOString() },
    {
      property: "article:modified_time",
      content: (options.lastUpdated ?? options.date).toISOString(),
    },
    { property: "article:author", content: siteName },
    ...options.tags.map((tag) => ({
      property: "article:tag",
      content: tag,
    })),
    // TanStack renders this descriptor, but its public meta type does not yet
    // include the supported `script:ld+json` shape.
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: options.title,
        description: options.description,
        image,
        datePublished: options.date.toISOString(),
        dateModified: (options.lastUpdated ?? options.date).toISOString(),
        keywords: options.tags,
        author: {
          "@type": "Person",
          name: siteName,
          url: siteUrl,
        },
      },
    } as unknown as { name: string; content: string },
  ];
}
