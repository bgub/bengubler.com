"use client";

import { T, useGT, Var } from "gt-next";
import { Brain, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FloatingELI5Props {
  content: string;
  title: string;
}

export function FloatingELI5({ content, title }: FloatingELI5Props) {
  const gt = useGT();
  const [isOpen, setIsOpen] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState("");

  const handleExplain = async () => {
    setIsExplaining(true);
    setExplanation("");

    try {
      const response = await fetch("/api/eli5", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, title }),
      });

      if (!response.ok) {
        throw new Error("Failed to get explanation");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setExplanation((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Error getting explanation:", error);
      setExplanation(
        gt("Sorry, I couldn't explain this right now. Please try again!"),
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !explanation) {
      handleExplain();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 end-6 h-12 w-12 rounded-full shadow-lg"
          title={gt("Explain Like I'm 5")}
        >
          <Brain className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <T>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Explain Like I'm 5
            </DialogTitle>
          </T>
          <T>
            <DialogDescription>Making complex topics simple</DialogDescription>
          </T>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh]">
          <div className="border rounded-lg p-4 bg-muted/30">
            {explanation ? (
              <div className="space-y-4">
                <T>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">
                    Simple Explanation
                  </h4>
                </T>
                <div className="text-sm leading-relaxed space-y-3">
                  {explanation
                    .split("\n")
                    .map(
                      (paragraph) =>
                        paragraph.trim() && <p key={paragraph}>{paragraph}</p>,
                    )}
                  {isExplaining && (
                    <span className="inline-block w-2 h-4 bg-foreground animate-pulse ms-1" />
                  )}
                </div>
              </div>
            ) : isExplaining ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mb-3" />
                <T>
                  <p className="text-sm font-medium">
                    Reading your blog post...
                  </p>
                </T>
                <T>
                  <p className="text-xs text-muted-foreground mt-1">
                    Breaking it down into simple terms
                  </p>
                </T>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Brain className="h-8 w-8 text-muted-foreground mb-3" />
                <T>
                  <p className="text-sm font-medium mb-1">Ready to Simplify!</p>
                </T>
                <T>
                  <p className="text-xs text-muted-foreground text-center">
                    I'll explain "<Var>{title}</Var>" in simple terms
                  </p>
                </T>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            onClick={handleExplain}
            disabled={isExplaining}
            className="w-full"
          >
            {isExplaining ? (
              <T>
                <Loader2 className="h-4 w-4 animate-spin me-2" />
                Explaining...
              </T>
            ) : (
              <>
                <Brain className="h-4 w-4 me-2" />
                {explanation ? gt("Explain Again") : gt("Start Explaining")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
