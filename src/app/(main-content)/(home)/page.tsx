import { StyledLink } from "@/components/StyledLink";

export default function Home() {
  return (
    <>
      <div className="text-lg prose dark:prose-invert max-w-none text-foreground">
        <h1 className="mt-8">Hello! Ahoj! Привет! مرحبا! 👋</h1>
        <p>
          My name's Ben, but you might know me by my GitHub username,{" "}
          <StyledLink href="https://github.com/nebrelbug">
            @nebrelbug
          </StyledLink>
          .
        </p>
        <p>
          I study machine learning and (human) languages. In my free time, I
          like to build websites and open-source libraries. I'm currently
          studying ACME (Applied and Computational Mathematics) and Arabic at
          BYU.
        </p>
        <h2>Recent Posts</h2>
      </div>
    </>
  );
}
