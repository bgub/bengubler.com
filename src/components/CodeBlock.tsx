"use client";

import { ClipboardIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

export function CodeBlock({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLProps<HTMLPreElement>) {
  const myRef = useRef<HTMLPreElement>(null);

  return (
    <div className="relative">
      <pre {...props} ref={myRef}>
        {children}
      </pre>
      <ClipboardButton siblingRef={myRef} />
    </div>
  );
}

function ClipboardButton({
  siblingRef,
}: {
  siblingRef: React.RefObject<HTMLPreElement>;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(siblingRef.current?.innerText ?? "");
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  return (
    <Button
      variant="outline"
      className="absolute top-2 right-2"
      onClick={copy}
      aria-label="Copy the code block"
    >
      <ClipboardIcon className="h-4 w-4 mr-2" />
      {isCopied ? "Copied!" : "Copy"}
    </Button>
  );
}
