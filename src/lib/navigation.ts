import { msg } from "gt-tanstack-start";
export const navigation = [
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
