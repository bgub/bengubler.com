import { baseUrl } from "@/lib/config";
import { getContent } from "@/lib/get-content";

export default function sitemap() {
  const allContent = getContent();

  const contentLinks = allContent.map((post) => ({
    url: `${baseUrl}/${post.url}`,
    lastModified: post.date,
  }));

  const pageLinks = [
    "",
    "/about",
    "/contact",
    "/my-stack",
    "/projects",
    "/posts",
    "/language-learning",
    "/language-learning/russian-case-cards",
    "/language-learning/czech-case-cards",
  ].map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(), // current time
  }));

  return [...pageLinks, ...contentLinks];
}
