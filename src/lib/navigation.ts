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
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  {
    name: "My Stack",
    href: "/about/my-stack",
    icon: Code,
    isSubItem: true,
    parent: "About",
  },
  {
    name: "Favorites",
    href: "/about/favorites",
    icon: Star,
    isSubItem: true,
    parent: "About",
  },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  {
    name: "Language Learning",
    href: "/language-learning",
    icon: Languages,
    isSubItem: true,
    parent: "Projects",
  },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Recommended", href: "/recommended", icon: Link2 },
  { name: "Contact", href: "/contact", icon: Mail },
];
