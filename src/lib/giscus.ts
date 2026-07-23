export type GiscusTheme = "dark" | "light";

export function mountGiscus(
  element: HTMLElement,
  theme: GiscusTheme,
  signal: AbortSignal,
): void {
  element.replaceChildren();

  const script = element.ownerDocument.createElement("script");
  Object.assign(script.dataset, {
    category: "Comments",
    categoryId: "DIC_kwDOMDxe684CrcJf",
    emitMetadata: "0",
    inputPosition: "top",
    lang: "en",
    loading: "lazy",
    mapping: "pathname",
    reactionsEnabled: "1",
    repo: "bgub/bengubler.com",
    repoId: "R_kgDOMDxe6w",
    strict: "1",
    theme,
  });
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = "https://giscus.app/client.js";
  element.append(script);

  signal.addEventListener("abort", () => element.replaceChildren(), {
    once: true,
  });
}
