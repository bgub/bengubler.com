import { StyledLink } from "@/components/StyledLink";

import { stack } from "./stack-list";

export const metadata = {
  title: "My Stack",
  description: "The tools and technologies I use to build things.",
};

export default function Home() {
  return (
    <>
      <h1 className="mt-8">{metadata.title}</h1>
      {stack.map((group) => (
        <div key={group.category}>
          <h2>{group.category}</h2>
          <ul>
            {group.items.map((tool) => (
              <li key={tool.name}>
                <StyledLink
                  href={
                    tool.link.startsWith("https://")
                      ? tool.link
                      : "https://" + tool.link
                  }
                >
                  {tool.name}
                </StyledLink>{" "}
                — {tool.description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
