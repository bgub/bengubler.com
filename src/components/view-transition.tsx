import type { ReactNode } from "react";

export function ViewTransition({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) {
  return (
    <span style={{ display: "contents", viewTransitionName: name }}>
      {children}
    </span>
  );
}
