export function Squiggle({
  className = "",
  height = 6,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: "100%", height }}
    >
      <path
        d="M0 4 Q 7.5 0, 15 4 T 30 4 T 45 4 T 60 4 T 75 4 T 90 4 T 105 4 T 120 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
