import { useGT } from "gt-tanstack-start";

export function ProfileImage({
  className,
  size,
}: {
  className?: string;
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
      fetchPriority="high"
      loading="eager"
    />
  );
}
