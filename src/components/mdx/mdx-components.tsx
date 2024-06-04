import NextImage, { ImageProps } from "next/image";
import Link from "next/link";

import type { MDXComponents } from "mdx/types";

import { CopyButton } from "./CopyButton";
import "./mdx-styles.css";

const mdxComponents: MDXComponents = {
  // Override the default <a> element to use the next/link component.
  a: ({ href, children }) => <Link href={href as string}>{children}</Link>,
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
