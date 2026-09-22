interface PostTagProps {
  selected?: boolean;
  tag: string;
}

export function PostTag({ selected = false, tag }: PostTagProps) {
  return (
    <span
      class="post-tag inline-flex leading-normal"
      data-selected={selected ? "true" : undefined}
    >
      #{tag.toLowerCase()}
    </span>
  );
}
