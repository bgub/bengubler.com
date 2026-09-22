import type { FigNode } from "@bgub/fig";

export function PageTitle({
  children,
  subtitle,
}: {
  children: FigNode;
  subtitle?: FigNode;
}) {
  return (
    <>
      <h1 class="font-serif text-foreground">{children}</h1>
      {subtitle && <p class="font-serif text-ink-soft">{subtitle}</p>}
    </>
  );
}
