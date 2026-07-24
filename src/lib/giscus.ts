export type GiscusTheme = "dark" | "light";

export function mountGiscus(
  element: HTMLElement,
  theme: GiscusTheme,
  signal: AbortSignal,
): void {
  element.replaceChildren();

  let observer: IntersectionObserver | undefined;
  const load = () => {
    if (signal.aborted) return;
    observer?.disconnect();
    appendGiscus(element, theme);
  };
  const Observer = element.ownerDocument.defaultView?.IntersectionObserver;

  if (Observer === undefined) {
    load();
  } else {
    observer = new Observer(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) load();
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(element);
  }

  signal.addEventListener(
    "abort",
    () => {
      observer?.disconnect();
      element.replaceChildren();
    },
    { once: true },
  );
}

function appendGiscus(element: HTMLElement, theme: GiscusTheme): void {
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
}
