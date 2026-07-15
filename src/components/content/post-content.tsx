import type { HighlightedLine } from "content-pipeline";
import { msg, useMessages } from "gt-next";
import { LinkIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import {
  type CSSProperties,
  createElement,
  Fragment,
  type ReactNode,
} from "react";
import { Tweet as ReactTweet } from "react-tweet";
import { CopyButton } from "./copy-button";
import "./content-styles.css";
import { type ContentComponents, ContentRenderer } from "./render-content";

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
        createElement(LinkIcon, {
          className: "size-4 flex-shrink-0",
        }),
      ),
  );
}

interface ContentLinkProps extends ChildrenProps {
  href?: string;
}

function ContentLink({ href, children, ...props }: ContentLinkProps) {
  if (href?.startsWith("http") || href?.startsWith("mailto:")) {
    return (
      <a href={href} {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href as Route} {...props}>
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
  return (
    <div className="relative">
      <CopyButton text={content} />
      <pre
        className={highlightedLines ? "shiki" : undefined}
        data-language={language}
      >
        <code>
          {highlightedLines
            ? highlightedLines.map((line, lineIndex) => (
                <Fragment key={line.offset}>
                  {line.tokens.map((token) => {
                    const style: HighlightedTokenStyle = {
                      "--shiki-dark": token.dark,
                      "--shiki-light": token.light,
                      fontStyle: token.fontStyle & 1 ? "italic" : undefined,
                      fontWeight: token.fontStyle & 2 ? 700 : undefined,
                      textDecoration:
                        token.fontStyle & 4 ? "underline" : undefined,
                    };

                    return (
                      <span
                        className="shiki-token"
                        key={token.offset}
                        style={style}
                      >
                        {token.content}
                      </span>
                    );
                  })}
                  {lineIndex < highlightedLines.length - 1 ? "\n" : null}
                </Fragment>
              ))
            : content}
        </code>
      </pre>
    </div>
  );
}

function InlineCode({ content }: { content: string }) {
  return <code>{content}</code>;
}

function Tweet({ id }: { id?: string }) {
  return id ? <ReactTweet id={id} /> : null;
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
