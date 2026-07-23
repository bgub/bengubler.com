import { useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";
import { Branch, T } from "gt-fig-tanstack-start";
import { getLocalizedPath, resolveLocale } from "@/lib/locales";

interface RawMarkdownProps {
  slug: string;
  content: string;
}

export function RawMarkdown({ slug, content }: RawMarkdownProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div class="space-y-2">
      <T>
        <h3 class="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          Raw (for LLMs)
        </h3>
      </T>
      <div class="font-serif text-[12.5px] text-ink-soft font-light leading-relaxed space-y-1">
        <T>
          <a
            href={getLocalizedPath(`/posts/${slug}.md`, resolveLocale())}
            target="_blank"
            rel="noopener noreferrer"
            class="block text-foreground no-underline border-b border-border w-fit hover:border-ink-mute transition-colors"
          >
            View Markdown
          </a>
        </T>
        <button
          mix={on("click", copyToClipboard)}
          type="button"
          class="block text-foreground no-underline border-b border-border hover:border-ink-mute transition-colors"
        >
          <T>
            <Branch
              branch={copied.toString()}
              true="Copied!"
              false="Copy Raw"
            />
          </T>
        </button>
      </div>
    </div>
  );
}
