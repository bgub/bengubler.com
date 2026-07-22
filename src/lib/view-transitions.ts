type PostTransitionKind =
  | "date"
  | "description"
  | "reading-time"
  | "tag"
  | "title";

export function getPostTransitionName(
  kind: PostTransitionKind,
  postUrl: string,
  suffix?: string,
) {
  return `${kind}-${postUrl}${suffix ? `-${suffix}` : ""}`
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-");
}
