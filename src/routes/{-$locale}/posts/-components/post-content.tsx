import { ClientOnly } from "@tanstack/react-router";
import type { HighlightedLine } from "content-pipeline";
import { msg, useMessages } from "gt-tanstack-start";
import {
  type CSSProperties,
  createElement,
  Fragment,
  type ReactNode,
} from "react";
import { Tweet as ReactTweet } from "react-tweet";
import {
  type ContentComponents,
  ContentRenderer,
} from "@/components/content/render-content";
import { Link } from "@/components/link";
import { CopyButton } from "./copy-button";
import "./content-styles.css";

const LINK_TO_SECTION_LABEL = msg("Link to section");

interface ChildrenProps {
  children?: ReactNode;
}

interface HeadingProps extends ChildrenProps {
  id?: string;
  level: number;
}

function Heading({ id, level, children }: HeadingProps) {
  const m = useMessages();

  return createElement(
    `h${level}`,
    { id, className: "group scroll-mt-20 relative" },
    children,
    id &&
      createElement(
        "a",
        {
          href: `#${id}`,
          className:
            "opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground ms-2 inline-block align-baseline",
          "aria-label": m(LINK_TO_SECTION_LABEL),
        },
        createElement("span", {
          className: "icon-[lucide--link] size-4 flex-shrink-0",
          "aria-hidden": "true",
        }),
      ),
  );
}

interface ContentLinkProps extends ChildrenProps {
  href?: string;
}

function ContentLink({ href, children, ...props }: ContentLinkProps) {
  if (!href) return <>{children}</>;

  if (href?.startsWith("http") || href?.startsWith("mailto:")) {
    return (
      <a href={href} {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

interface FenceProps {
  content: string;
  highlightedLines?: HighlightedLine[];
  language?: string;
}

interface HighlightedTokenStyle extends CSSProperties {
  "--shiki-dark": string;
  "--shiki-light": string;
}

function Fence({ content, highlightedLines, language }: FenceProps) {
  const renderedLines = highlightedLines?.map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {line.tokens.map((token, tokenIndex) => {
        const fontStyle = token.fontStyle ?? 0;
        const style: HighlightedTokenStyle = {
          "--shiki-dark": token.dark,
          "--shiki-light": token.light,
          fontStyle: fontStyle & 1 ? "italic" : undefined,
          fontWeight: fontStyle & 2 ? 700 : undefined,
          textDecoration: fontStyle & 4 ? "underline" : undefined,
        };

        return (
          <span className="shiki-token" key={tokenIndex} style={style}>
            {token.content}
          </span>
        );
      })}
      {lineIndex < highlightedLines.length - 1 ? "\n" : null}
    </Fragment>
  ));

  return (
    <div className="relative">
      <CopyButton text={content} />
      <pre
        className={highlightedLines ? "shiki" : undefined}
        data-language={language}
      >
        <code>{renderedLines ?? content}</code>
      </pre>
    </div>
  );
}

function InlineCode({ content }: { content: string }) {
  return <code>{content}</code>;
}

function Tweet({ id }: { id?: string }) {
  if (!id) return null;
  return (
    <ClientOnly
      fallback={
        <a href={`https://x.com/i/status/${id}`} rel="noreferrer">
          View post on X
        </a>
      }
    >
      <ReactTweet id={id} />
    </ClientOnly>
  );
}

const contentComponents = {
  Blockquote: "blockquote",
  ContentLink,
  Fence,
  Heading,
  InlineCode,
  Tweet,
} satisfies ContentComponents;

export function PostContent({ body }: { body: string }) {
  return <ContentRenderer body={body} components={contentComponents} />;
}
