import type { FigNode } from "@bgub/fig";
import type { HighlightedLine } from "content-pipeline";
import { msg, useMessages } from "gt-fig-tanstack-start";
import { ClientOnly } from "@/components/client-only";
import {
  type ContentComponents,
  ContentRenderer,
} from "@/components/content/render-content";
import { Link } from "@/components/link";
import { useTheme } from "@/components/theme-provider";
import { CopyButton } from "./copy-button";
import "./content-styles.css";

const LINK_TO_SECTION_LABEL = msg("Link to section");

interface ChildrenProps {
  children?: FigNode;
}

interface HeadingProps extends ChildrenProps {
  id?: string;
  level: keyof typeof headingTags;
}

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

function Heading({ id, level, children }: HeadingProps) {
  const m = useMessages();
  const HeadingTag = headingTags[level];

  return (
    <HeadingTag id={id} class="group scroll-mt-20 relative">
      {children}
      {id && (
        <a
          href={`#${id}`}
          class="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground ms-2 inline-block align-baseline"
          aria-label={m(LINK_TO_SECTION_LABEL)}
        >
          <span
            class="icon-[lucide--link] size-4 flex-shrink-0"
            aria-hidden="true"
          />
        </a>
      )}
    </HeadingTag>
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

interface HighlightedTokenStyle {
  [key: string]: string | null | undefined;
  "--shiki-dark": string;
  "--shiki-light": string;
}

function Fence({ content, highlightedLines, language }: FenceProps) {
  const renderedLines = highlightedLines?.flatMap((line, lineIndex) => [
    ...line.tokens.map((token, tokenIndex) => {
      const fontStyle = token.fontStyle ?? 0;
      const style: HighlightedTokenStyle = {
        "--shiki-dark": token.dark,
        "--shiki-light": token.light,
        fontStyle: fontStyle & 1 ? "italic" : undefined,
        fontWeight: fontStyle & 2 ? "700" : undefined,
        textDecoration: fontStyle & 4 ? "underline" : undefined,
      };

      return (
        <span
          class="shiki-token"
          key={`${lineIndex}-${tokenIndex}`}
          style={style}
        >
          {token.content}
        </span>
      );
    }),
    lineIndex < highlightedLines.length - 1 ? "\n" : null,
  ]);

  return (
    <div class="relative">
      <CopyButton text={content} />
      <pre
        class={highlightedLines ? "shiki" : undefined}
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
  const { resolvedTheme } = useTheme();
  if (!id) return null;
  return (
    <ClientOnly
      fallback={
        <a href={`https://x.com/i/status/${id}`} rel="noreferrer">
          View post on X
        </a>
      }
    >
      <div class="mx-auto w-full max-w-[550px]">
        <blockquote class="twitter-tweet" data-theme={resolvedTheme}>
          <a href={`https://x.com/i/status/${id}`}>View post on X</a>
        </blockquote>
        <script
          async
          charset="utf-8"
          src="https://platform.twitter.com/widgets.js"
        />
      </div>
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
