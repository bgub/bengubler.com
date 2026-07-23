export function Squiggle({
  class: classValue = "",
  height = 6,
}: {
  class?: string;
  height?: number;
}) {
  return (
    <svg
      class={classValue}
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: "100%", height: `${height}px` }}
    >
      <path
        d="M0 4 Q 7.5 0, 15 4 T 30 4 T 45 4 T 60 4 T 75 4 T 90 4 T 105 4 T 120 4"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
