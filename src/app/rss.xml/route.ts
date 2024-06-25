import { Feed } from "feed";

import { baseUrl } from "@/lib/config";
import { getPosts } from "@/lib/get-posts";

const createFeed = () => {
  const feed = new Feed({
    title: "bengubler.com",
    description: "Ben Gubler's personal website",
    id: baseUrl,
    link: baseUrl,
    language: "en",
    favicon: `${baseUrl}/icon.png`,
    copyright: `Copyright ${new Date().getFullYear()} Ben Gubler`,
    author: {
      name: "Ben Gubler",
    },
  });

  const allPosts = getPosts({
    localOnly: true,
  });

  allPosts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${baseUrl}${post.url}`,
      link: `${baseUrl}${post.url}?utm_campaign=feed&utm_source=rss2`,
      description: post.description,
      content: post.content,
      date: post.date,
      category: post.tags
        ? post.tags.map((name) => ({ name: name }))
        : undefined,
      // image: createImageUrl(post.image.url, 256, 256, true),
    });
  });

  return feed.rss2();
};

export const GET = async () => {
  const feed = await createFeed();
  return new Response(feed, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
