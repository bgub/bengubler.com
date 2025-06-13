import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function Typography({ children, className }: TypographyProps) {
  return (
    <div
      className={cn(
        // Base typography styles
        "text-foreground",
        // Headings with better spacing
        "[&_h1]:scroll-m-20 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:lg:text-5xl [&_h1]:mt-12 [&_h1]:mb-6 [&_h1:first-child]:mt-0",
        "[&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:transition-colors [&_h2]:mt-10 [&_h2]:mb-4 [&_h2:first-child]:mt-0",
        "[&_h3]:scroll-m-20 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mt-8 [&_h3]:mb-4",
        "[&_h4]:scroll-m-20 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:tracking-tight [&_h4]:mt-6 [&_h4]:mb-3",
        "[&_h5]:scroll-m-20 [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:tracking-tight [&_h5]:mt-6 [&_h5]:mb-3",
        "[&_h6]:scroll-m-20 [&_h6]:text-base [&_h6]:font-semibold [&_h6]:tracking-tight [&_h6]:mt-6 [&_h6]:mb-3",
        // Paragraphs with proper spacing
        "[&_p]:leading-7 [&_p]:mt-6 [&_p:first-child]:mt-0",
        // Links
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80",
        // Lists with proper spacing
        "[&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul_li]:mt-2",
        "[&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol_li]:mt-2",
        // Blockquotes
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        // Inline code - compact vertical padding
        "[&_code]:relative [&_code]:rounded [&_code]:bg-muted [&_code]:px-[0.3rem] [&_code]:py-[0.1rem] [&_code]:font-mono [&_code]:font-semibold",
        // Code blocks with better spacing
        "[&_pre]:relative [&_pre]:mt-6 [&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:border",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-normal [&_pre_code]:text-sm",
        // Tables with better spacing
        "[&_table]:w-full [&_table]:my-6 [&_table]:overflow-y-auto [&_table]:border-collapse",
        "[&_table_tr]:even:bg-muted [&_table_tr]:m-0 [&_table_tr]:border-t [&_table_tr]:p-0",
        "[&_table_th]:border [&_table_th]:px-4 [&_table_th]:py-2 [&_table_th]:text-left [&_table_th]:font-bold [&_table_th[align=center]]:text-center [&_table_th[align=right]]:text-right",
        "[&_table_td]:border [&_table_td]:px-4 [&_table_td]:py-2 [&_table_td]:text-left [&_table_td[align=center]]:text-center [&_table_td[align=right]]:text-right",
        // Images with spacing
        "[&_img]:rounded-md [&_img]:border [&_img]:my-6",
        // HR with better spacing
        "[&_hr]:my-8 [&_hr]:border-border",
        // Strong/Bold
        "[&_strong]:font-semibold",
        "[&_b]:font-semibold",
        // Emphasis/Italic
        "[&_em]:italic",
        "[&_i]:italic",
        // Small text
        "[&_small]:text-sm [&_small]:font-medium [&_small]:leading-none",
        // Max width for readability
        "max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}
