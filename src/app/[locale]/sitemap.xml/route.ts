import { allPosts } from "content-collections";
import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();
const staticSitemapPaths = [
  "",
  "/about",
  "/about/my-stack",
  "/contact",
  "/projects",
  "/posts",
  "/language-learning",
  "/language-learning/czech-declensions",
  "/language-learning/russian-declensions",
] as const;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const localeBaseUrl = `${baseUrl}/${locale}`;
  const staticLastModified = new Date();

  const urls = staticSitemapPaths.map((url) => ({
    url: `${localeBaseUrl}${url}`,
    lastModified: staticLastModified,
    changeFrequency: "monthly",
    priority: url === "" ? 1.0 : 0.6,
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

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
