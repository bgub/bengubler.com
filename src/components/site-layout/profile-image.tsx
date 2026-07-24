import { useGT } from "gt-fig-tanstack-start";

export function ProfileImage({
  class: classValue,
  size,
}: {
  class?: string;
  size: number;
}) {
  const gt = useGT();
  return (
    <img
      src="/bengubler-avatar-104.webp"
      alt={gt("Profile photo")}
      width={size}
      height={size}
      class={classValue}
      loading="eager"
    />
  );
}
