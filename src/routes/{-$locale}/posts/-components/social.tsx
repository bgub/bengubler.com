import { T, useGT } from "gt-fig-tanstack-start";
import { usePathname } from "@/lib/router";

interface SocialProps {
  title: string;
}

export function Social({ title }: SocialProps) {
  const gt = useGT();
  const pathname = usePathname();
  const currentUrl = `https://bengubler.com${pathname}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);

  const shares = [
    {
      name: "X",
      url: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: "icon-[simple-icons--x]",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: "icon-[simple-icons--linkedin]",
    },
    {
      name: "Reddit",
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: "icon-[simple-icons--reddit]",
    },
    {
      name: "Hacker News",
      url: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
      icon: "icon-[simple-icons--ycombinator]",
    },
  ];

  return (
    <div class="space-y-2">
      <T>
        <h3 class="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          Pass along
        </h3>
      </T>
      <div class="flex gap-2">
        {shares.map((share) => (
          <a
            key={share.name}
            href={share.url}
            target="_blank"
            rel="noopener noreferrer"
            class="size-9 rounded-sm border border-border flex items-center justify-center text-ink-soft hover:bg-rule-soft hover:text-foreground transition-colors"
            title={gt("Share on {name}", { name: share.name })}
            aria-label={gt("Share on {name}", { name: share.name })}
          >
            <span class={`${share.icon} size-3.5`} aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}
