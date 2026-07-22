import { msg, useMessages } from "gt-tanstack-start";
import { Link } from "@/components/link";
import { getUnlocalizedPath } from "@/lib/locales";
import { usePathname } from "@/lib/router";
import { cn } from "@/lib/utils";

const navigation = [
  { name: msg("Home"), href: "/", icon: "icon-[lucide--house]" },
  { name: msg("About"), href: "/about", icon: "icon-[lucide--user]" },
  {
    name: msg("My Stack"),
    href: "/about/my-stack",
    icon: "icon-[lucide--code]",
    isSubItem: true,
  },
  {
    name: msg("Favorites"),
    href: "/about/favorites",
    icon: "icon-[lucide--star]",
    isSubItem: true,
  },
  {
    name: msg("Projects"),
    href: "/projects",
    icon: "icon-[lucide--folder-open]",
  },
  {
    name: msg("Language Learning"),
    href: "/language-learning",
    icon: "icon-[lucide--languages]",
    isSubItem: true,
  },
  { name: msg("Posts"), href: "/posts", icon: "icon-[lucide--file-text]" },
  {
    name: msg("Recommended"),
    href: "/recommended",
    icon: "icon-[lucide--link-2]",
  },
  { name: msg("Contact"), href: "/contact", icon: "icon-[lucide--mail]" },
];

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
