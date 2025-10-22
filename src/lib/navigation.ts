import { msg } from "gt-next";
import {
  Code,
  FileText,
  FolderOpen,
  Home,
  Languages,
  Link2,
  Mail,
  Star,
  User,
} from "lucide-react";

export type NavigationItem = {
  name: string;
  href: string;
  icon: any;
  isSubItem?: boolean;
  parent?: string;
};

export const navigation: NavigationItem[] = [
  { name: msg("Home"), href: "/", icon: Home },
  { name: msg("About"), href: "/about", icon: User },
  {
    name: msg("My Stack"),
    href: "/about/my-stack",
    icon: Code,
    isSubItem: true,
    parent: "About",
  },
  {
    name: msg("Favorites"),
    href: "/about/favorites",
    icon: Star,
    isSubItem: true,
    parent: "About",
  },
  { name: msg("Projects"), href: "/projects", icon: FolderOpen },
  {
    name: msg("Language Learning"),
    href: "/language-learning",
    icon: Languages,
    isSubItem: true,
    parent: "Projects",
  },
  { name: msg("Posts"), href: "/posts", icon: FileText },
  { name: msg("Recommended"), href: "/recommended", icon: Link2 },
  { name: msg("Contact"), href: "/contact", icon: Mail },
];
