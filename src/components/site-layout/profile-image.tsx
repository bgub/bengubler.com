import { useGT } from "gt-fig-tanstack-start";
import profileImageUrl from "@/assets/profile.webp?no-inline";

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
      src={profileImageUrl}
      alt={gt("Profile photo")}
      width={size}
      height={size}
      class={classValue}
      loading="eager"
    />
  );
}
