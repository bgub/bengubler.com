import { useMessages } from "gt-tanstack-start";
import { Link } from "@/components/link";
import { getUnlocalizedPath } from "@/lib/locales";
import { navigation } from "@/lib/navigation";
import { usePathname } from "@/lib/router";
import { cn } from "@/lib/utils";

interface NavigationLinksProps {
  className?: string;
  onNavigate?: () => void;
}

function isActivePath(pathname: string, href: string) {
  return (
    pathname === href ||
    (href === "/posts" && pathname.startsWith("/posts/")) ||
    (href === "/language-learning" && pathname.startsWith("/language-learning"))
  );
}

export function NavigationLinks({
  className,
  onNavigate,
}: NavigationLinksProps) {
  const pathname = getUnlocalizedPath(usePathname());
  const m = useMessages();

  return (
    <ul className={className}>
      {navigation.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <li key={item.name} className="relative">
            {item.isSubItem && (
              <>
                <div className="absolute inset-s-2 top-0 h-1/2 w-px bg-border/70" />
                <div className="absolute inset-s-2 top-1/2 w-4 h-px bg-border/70" />
              </>
            )}
            <Link
              href={item.href}
              className={cn(
                "group flex items-center gap-x-2.5 rounded-sm px-2.5 py-2 text-sm font-sans leading-tight transition-all duration-100",
                item.isSubItem && "ms-4",
                isActive
                  ? "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                  : "text-ink-soft hover:bg-rule-soft",
              )}
              onClick={onNavigate}
            >
              <span
                className={`${item.icon} size-3.75 shrink-0 opacity-75`}
                aria-hidden="true"
              />
              {m(item.name)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
