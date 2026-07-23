import { type FigNode, ViewTransition } from "@bgub/fig";
import { getPostTransitionName } from "@/lib/view-transitions";

type PostTransitionKind = Parameters<typeof getPostTransitionName>[0];

export function PostViewTransition({
  children,
  kind,
  postUrl,
  suffix,
}: {
  children: FigNode;
  kind: PostTransitionKind;
  postUrl: string;
  suffix?: string;
}): FigNode {
  return (
    <ViewTransition
      enter="none"
      exit="none"
      name={getPostTransitionName(kind, postUrl, suffix)}
      share="auto"
      update="none"
    >
      {children}
    </ViewTransition>
  );
}
