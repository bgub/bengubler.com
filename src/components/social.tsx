import { T, useGT } from "gt-tanstack-start";
import { usePathname } from "@/lib/router";
import { cn } from "@/lib/utils";

interface SocialProps {
  title: string;
  className?: string;
}

export function Social({ title, className }: SocialProps) {
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
    <div className={cn("space-y-2", className)}>
      <T>
        <h3 className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          Pass along
        </h3>
      </T>
      <div className="flex gap-2">
        {shares.map((share) => (
          <a
            key={share.name}
            href={share.url}
            target="_blank"
            rel="noopener noreferrer"
            className="size-9 rounded-sm border border-border flex items-center justify-center text-ink-soft hover:bg-rule-soft hover:text-foreground transition-colors"
            title={gt("Share on {name}", { name: share.name })}
            aria-label={gt("Share on {name}", { name: share.name })}
          >
            <span className={`${share.icon} size-3.5`} aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}
