import type { FigNode } from "@bgub/fig";

export function NotFoundPanel({
  title,
  description,
  children,
}: {
  title: FigNode;
  description: FigNode;
  children: FigNode;
}) {
  return (
    <div class="interior-wireframe not-found-wireframe">
      <section class="not-found-panel">
        <div class="space-y-4">
          <h1 class="font-serif text-6xl font-medium text-muted-foreground">
            404
          </h1>
          <h2 class="font-serif text-3xl font-medium tracking-tight text-foreground">
            {title}
          </h2>
          <p class="mx-auto max-w-md font-serif text-lg font-light leading-relaxed text-ink-soft">
            {description}
          </p>
        </div>
        <div class="flex items-center gap-4 font-serif text-[11.5px]">
          {children}
        </div>
      </section>
    </div>
  );
}
