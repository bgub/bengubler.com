import { on } from "@bgub/fig-dom";
import { msg, useMessages } from "gt-fig-tanstack-start";
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
  class?: string;
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
  class: classValue,
  onNavigate,
}: NavigationLinksProps) {
  const pathname = getUnlocalizedPath(usePathname());
  const m = useMessages();

  return (
    <ul class={classValue}>
      {navigation.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <li
            key={item.name}
            class={cn("relative", item.isSubItem && "site-nav-subitem")}
          >
            {item.isSubItem && (
              <>
                <div class="absolute inset-s-2 top-0 h-1/2 w-px" />
                <div class="absolute inset-s-2 top-1/2 w-4 h-px" />
              </>
            )}
            <Link
              href={item.href}
              class={cn(
                "site-nav-link group flex items-center gap-x-2.5 py-2 leading-tight",
                item.isSubItem && "ms-4",
                isActive ? "site-nav-link-active" : "text-ink-soft",
              )}
              mix={onNavigate ? on("click", onNavigate) : undefined}
            >
              <span
                class={`${item.icon} site-nav-icon shrink-0`}
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
