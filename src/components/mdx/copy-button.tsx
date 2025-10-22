"use client";

import { useGT } from "gt-next";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

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
      onClick={copy}
      type="button"
      className="absolute top-3 end-3 z-10 p-2 rounded-md bg-background/80 hover:bg-background border transition-all duration-200 shadow-sm backdrop-blur-sm"
      aria-label={gt("Copy code to clipboard")}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      )}
    </button>
  );
}
