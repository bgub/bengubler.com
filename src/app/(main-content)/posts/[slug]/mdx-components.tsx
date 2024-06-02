import { CodeBlock } from "@/components/CodeBlock";
import type { MDXComponents } from "mdx/types";

import NextImage, { ImageProps } from "next/image";
import Link from "next/link";

const mdxComponents: MDXComponents = {
  // Override the default <a> element to use the next/link component.
  a: ({ href, children }) => <Link href={href as string}>{children}</Link>,
  pre: ({ children, ...props }) => <CodeBlock {...props}>{children}</CodeBlock>,
  Image: (props: ImageProps) => <NextImage {...props} />,
};

export { mdxComponents };
