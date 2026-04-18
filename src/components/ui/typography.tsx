import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function Typography({ children, className }: TypographyProps) {
  return (
    <div
      className={cn(
        // Base typography styles — editorial serif
        "text-foreground font-serif",
        // Headings — serif, medium weight
        "[&_h1]:scroll-m-20 [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:font-medium [&_h1]:tracking-tight [&_h1]:mt-12 [&_h1]:mb-6 [&_h1:first-child]:mt-0",
        "[&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:border-dotted [&_h2]:border-border [&_h2]:pb-2 [&_h2]:text-[26px] [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2:first-child]:mt-0",
        "[&_h3]:scroll-m-20 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:mt-8 [&_h3]:mb-4",
        "[&_h4]:scroll-m-20 [&_h4]:text-lg [&_h4]:font-medium [&_h4]:tracking-tight [&_h4]:mt-6 [&_h4]:mb-3",
        "[&_h5]:scroll-m-20 [&_h5]:text-base [&_h5]:font-medium [&_h5]:tracking-tight [&_h5]:mt-6 [&_h5]:mb-3",
        "[&_h6]:scroll-m-20 [&_h6]:text-sm [&_h6]:font-medium [&_h6]:tracking-tight [&_h6]:mt-6 [&_h6]:mb-3",
        // Paragraphs — lighter weight, relaxed reading
        "[&_p]:leading-[1.7] [&_p]:mt-6 [&_p:first-child]:mt-0 [&_p]:text-ink-soft [&_p]:font-light",
        // Links
        "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-foreground/80",
        // Lists
        "[&_ul]:my-6 [&_ul]:ms-6 [&_ul]:list-disc [&_ul_li]:mt-2 [&_ul_li]:text-ink-soft [&_ul_li]:font-light",
        "[&_ol]:my-6 [&_ol]:ms-6 [&_ol]:list-decimal [&_ol_li]:mt-2 [&_ol_li]:text-ink-soft [&_ol_li]:font-light",
        // Blockquotes
        "[&_blockquote]:mt-6 [&_blockquote]:border-s-2 [&_blockquote]:border-peach-deep [&_blockquote]:ps-6 [&_blockquote]:italic [&_blockquote]:text-ink-soft",
        // Inline code
        "[&_code]:relative [&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-[0.3rem] [&_code]:py-[0.1rem] [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:font-normal",
        // Code blocks — accent left border
        "[&_pre]:relative [&_pre]:mt-6 [&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:border-l-[3px] [&_pre]:border-l-lavender-deep",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-normal [&_pre_code]:text-sm",
        // Tables
        "[&_table]:w-full [&_table]:my-6 [&_table]:overflow-y-auto [&_table]:border-collapse",
        "[&_table_tr]:even:bg-muted [&_table_tr]:m-0 [&_table_tr]:border-t [&_table_tr]:p-0",
        "[&_table_th]:border [&_table_th]:px-4 [&_table_th]:py-2 [&_table_th]:text-left [&_table_th]:font-medium [&_table_th:is([align=center])]:text-center [&_table_th:is([align=right])]:text-right",
        "[&_table_td]:border [&_table_td]:px-4 [&_table_td]:py-2 [&_table_td]:text-left [&_table_td:is([align=center])]:text-center [&_table_td:is([align=right])]:text-right",
        // Images
        "[&_img]:rounded-sm [&_img]:border [&_img]:my-6",
        // HR
        "[&_hr]:my-8 [&_hr]:border-border [&_hr]:border-dotted",
        // Strong/Bold
        "[&_strong]:font-medium",
        "[&_b]:font-medium",
        // Emphasis/Italic
        "[&_em]:italic",
        "[&_i]:italic",
        // Small text
        "[&_small]:text-sm [&_small]:font-medium [&_small]:leading-none",
        // Max width for readability
        "max-w-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
