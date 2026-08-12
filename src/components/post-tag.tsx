interface PostTagProps {
  selected?: boolean;
  tag: string;
}

export function PostTag({ selected = false, tag }: PostTagProps) {
  return (
    <span
      class={`inline-flex rounded-sm border bg-card px-2 py-0.5 font-mono text-[11px] leading-normal ${
        selected
          ? "border-foreground text-foreground"
          : "border-border text-ink-soft"
      }`}
    >
      #{tag.toLowerCase()}
    </span>
  );
}
