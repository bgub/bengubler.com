import { useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";
import { useGT } from "gt-fig-tanstack-start";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const gt = useGT();

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      mix={on("click", copy)}
      type="button"
      class="absolute top-3 inset-e-3 z-10 p-2 rounded-md bg-background/80 hover:bg-background border transition-all duration-200 shadow-sm backdrop-blur-sm"
      aria-label={gt("Copy code to clipboard")}
    >
      {copied ? (
        <span
          class="icon-[lucide--check] size-4 text-green-500"
          aria-hidden="true"
        />
      ) : (
        <span
          class="icon-[lucide--copy] size-4 text-muted-foreground hover:text-foreground"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
