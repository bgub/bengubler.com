import { useGT } from "gt-tanstack-start";

export function ProfileImage({
  className,
  priority,
  size,
}: {
  className?: string;
  priority?: boolean;
  size: number;
}) {
  const gt = useGT();
  return (
    <img
      src="/bengubler-avatar-104.jpg"
      alt={gt("Profile photo")}
      width={size}
      height={size}
      className={className}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
