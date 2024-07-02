import { CardGrid, PostCard } from "@/components/CardGrid";
import { StyledLink } from "@/components/StyledLink";
import { getContentOverviews } from "@/lib/get-content";

export default function Home() {
  const allPosts = getContentOverviews({
    limit: 5,
    localOnly: true,
  });

  return (
    <>
      <div>
        <h1 className="mt-8">Hello! Ahoj! Привет! مرحبا! 👋</h1>
        <p>
          I&apos;m Ben (or on GitHub,{" "}
          <StyledLink href="https://github.com/nebrelbug">
            @nebrelbug
          </StyledLink>
          ).
        </p>
        <p>
          I study AI and (human) languages. In my free time, I like to build
          websites and open-source libraries. I&apos;m currently studying ACME
          (Applied and Computational Mathematics) and Arabic at BYU.
        </p>
        <p>
          Feel free to take a look at my{" "}
          <StyledLink href="/ben-gubler-resume.pdf">resumé</StyledLink>, some of
          the <StyledLink href="/projects">projects</StyledLink> I&apos;ve
          worked on, or the{" "}
          <StyledLink href="/language-learning">
            language learning materials
          </StyledLink>{" "}
          I&apos;ve created. Otherwise you can check out some of my recent blog
          posts below!
        </p>
        <h2>Recent Posts</h2>
        <CardGrid>
          {allPosts.map((post, i) => (
            <PostCard key={post.url} post={post} i={i} />
          ))}
          <div className="flex flex-col items-center justify-center w-full h-full ">
            <StyledLink href="/posts">View all posts 🡒</StyledLink>
          </div>
        </CardGrid>
      </div>
    </>
  );
}
