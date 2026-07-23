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
      <h1 class="font-serif font-medium text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.02]">
        {children}
      </h1>
      {subtitle && (
        <p class="font-serif text-lg text-ink-soft leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </>
  );
}
