import { LinkIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import NextImage, { ImageProps } from "next/image";
import { ReactNode, createElement } from "react";

import { CopyButton } from "./mdx/copy-button";
import "./mdx/mdx-styles.css";

interface AnchorProps {
  href?: string;
  children?: ReactNode;
  [key: string]: any;
}

interface CodeProps {
  children?: ReactNode;
  [key: string]: any;
}

interface HeaderProps {
  id?: string;
  children?: ReactNode;
  [key: string]: any;
}

// Header component with link icon that allows text wrapping
const createHeaderComponent = (tagName: string) => {
  return ({ id, children, ...props }: HeaderProps) => {
    return createElement(
      tagName,
      {
        ...props,
        id,
        className: "group scroll-mt-20 relative",
      },
      children,
      id &&
        createElement(
          "a",
          {
            href: `#${id}`,
            className:
              "opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground ml-2 inline-block align-baseline",
            "aria-label": `Link to section`,
          },
          createElement(LinkIcon, { className: "h-4 w-4 flex-shrink-0" })
        )
    );
  };
};

const mdxComponents = {
  // Override the default <a> element to use the next/link component for internal links
  a: ({ href, children, ...props }: AnchorProps) => {
    // Check if it's an external link
    if (href?.startsWith("http") || href?.startsWith("mailto:")) {
      return (
        <a href={href} {...props} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }

    // Internal link
    return (
      <Link href={href as string} {...props}>
        {children}
      </Link>
    );
  },

  // Headers with anchor links
  h1: createHeaderComponent("h1"),
  h2: createHeaderComponent("h2"),
  h3: createHeaderComponent("h3"),
  h4: createHeaderComponent("h4"),
  h5: createHeaderComponent("h5"),
  h6: createHeaderComponent("h6"),

  // Enhanced pre component with copy button (for Shiki)
  pre: ({ children, ...props }: CodeProps) => {
    const rawString = (props as any)["__raw_string__"] as string;

    return (
      <div className="relative">
        <pre
          {...props}
          className="border overflow-x-auto rounded-lg bg-muted/50 p-4 text-sm [&>code]:bg-transparent [&>code]:p-0"
        >
          {rawString && <CopyButton text={rawString} />}
          {children}
        </pre>
      </div>
    );
  },

  // Let typography.tsx handle all code styling through CSS cascade
  code: ({ children, ...props }: CodeProps) => (
    <code {...props}>{children}</code>
  ),

  // Style blockquotes
  blockquote: ({ children, ...props }: CodeProps) => (
    <blockquote
      {...props}
      className="border-l-4 border-border pl-4 italic text-muted-foreground"
    >
      {children}
    </blockquote>
  ),

  // Override Image component to use Next.js Image
  Image: (props: ImageProps) => <NextImage {...props} />,
};

export { mdxComponents };
