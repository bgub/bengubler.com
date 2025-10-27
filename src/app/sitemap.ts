import { allPosts } from "content-collections";
import getLocale from "@/getLocale";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export default async function sitemap() {
  const locale = (await getLocale()) || "en";
  // Content links from non-archived posts only
  const postLinks = allPosts
    .filter((post) => post.locale === locale)
    .filter((post) => !post.archived)
    .map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.lastUpdated || post.date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Static page links
  const pageLinks = [
    "",
    "/about",
    "/about/my-stack",
    "/contact",
    "/projects",
    "/posts",
    "/language-learning",
    "/language-learning/czech-declensions",
    "/language-learning/russian-declensions",
  ].map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: url === "" ? 1.0 : 0.6,
  }));

  return [...pageLinks, ...postLinks];
}
