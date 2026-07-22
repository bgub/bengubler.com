import { useGT } from "gt-react";

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
      src="/bengubler-avatar-52.jpg"
      srcSet="/bengubler-avatar-52.jpg 1x, /bengubler-avatar-104.jpg 2x"
      alt={gt("Profile photo")}
      width={size}
      height={size}
      className={className}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
