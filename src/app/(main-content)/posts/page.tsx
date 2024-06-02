import { allPosts } from "content-collections";
import { Link } from "next-view-transitions";

export default function Posts() {
  return (
    <>
      <h1 className="text-4xl lg:text-5xl font-bold py-8">Posts</h1>

      <ul>
        {allPosts.map((post) => (
          <li key={post._meta.path}>
            <Link href={`/posts/${post._meta.path}`}>
              <h3>
                <span
                  style={{
                    viewTransitionName: getPostClassName(post._meta.path),
                  }}
                >
                  {post.title}
                </span>
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function getPostClassName(slug: string) {
  return "post-title-" + slug.replace(/[^\w\S]/gi, "").replace(/\s/g, "-");
}
