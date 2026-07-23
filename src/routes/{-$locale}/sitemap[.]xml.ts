import { createFileRoute } from "@tanstack/solid-router";
import { allPosts } from "content-collections";
import { getLocalizedPath, resolveLocale } from "@/lib/locales";
import { sitePaths } from "@/lib/site-paths";
import { getBaseUrl } from "@/lib/utils";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/{-$locale}/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const locale = resolveLocale();
        const localePath = getLocalizedPath("/", locale);
        const localeBaseUrl = `${getBaseUrl()}${localePath === "/" ? "" : localePath}`;
        const urls = sitePaths.map((path) => ({
          url: `${localeBaseUrl}${path}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: path === "" ? 1 : 0.6,
        }));

        for (const post of allPosts) {
          if (post.locale !== locale || post.archived) continue;
          urls.push({
            url: `${localeBaseUrl}/posts/${post.slug}`,
            lastModified: post.lastUpdated || post.date,
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=0, must-revalidate",
          },
        });
      },
    },
  },
});
