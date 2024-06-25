import { baseUrl } from "@/lib/config";
import { getPosts } from "@/lib/get-posts";

export default function sitemap() {
  const allPosts = getPosts({ localOnly: true });

  const postLinks = allPosts.map((post) => ({
    url: `${baseUrl}${post.url}`,
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

  return [...pageLinks, ...postLinks];
}
