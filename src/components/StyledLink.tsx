import { cn } from "@/lib/utils";
import Link from "next/link";

export function StyledLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className={cn(
        "font-semibold text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white",
        className
      )}
      title={label}
      href={href}
    >
      {children}
    </Link>
  );
}
