import NextImage, { ImageProps } from "next/image";

import type { MDXComponents } from "mdx/types";

import { StyledLink } from "../StyledLink";
import { CopyButton } from "./CopyButton";
import "./mdx-styles.css";

const mdxComponents: MDXComponents = {
  // Override the default <a> element to use the next/link component.
  a: ({ href, children }) => (
    <StyledLink href={href as string}>{children}</StyledLink>
  ),
  pre: ({ children, ...props }) => {
    const rawString = (props as any)["__raw_string__"] as string;

    return (
      <div className="relative">
        <pre {...props} className="border">
          <CopyButton text={rawString} />
          {children}
        </pre>
      </div>
    );
  },
  Image: (props: ImageProps) => <NextImage {...props} />,
};

export { mdxComponents };
