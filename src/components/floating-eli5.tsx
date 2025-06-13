"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";

interface FloatingELI5Props {
  content: string;
  title: string;
}

export function FloatingELI5({ content, title }: FloatingELI5Props) {
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
        "Sorry, I couldn't explain this right now. Please try again!"
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    if (!explanation) {
      handleExplain();
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={openModal}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Explain Like I'm 5"
        >
          <Brain className="h-6 w-6" />
        </Button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6" />
                  <div>
                    <h3 className="text-xl font-bold">Explain Like I'm 5</h3>
                    <p className="text-blue-100 text-sm">
                      Making complex topics simple!
                    </p>
                  </div>
                </div>
                <Button
                  onClick={closeModal}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Status */}
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
                >
                  {isExplaining
                    ? "🔍 Reading & Simplifying..."
                    : "🎉 Ready to Read!"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {content.split(" ").length} words • "{title}"
                </span>
              </div>

              {/* Explanation */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                {explanation ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        Simple Explanation
                      </span>
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
                      {explanation.split("\n").map(
                        (paragraph, index) =>
                          paragraph.trim() && (
                            <p key={index} className="mb-4">
                              {paragraph}
                            </p>
                          )
                      )}
                      {isExplaining && (
                        <span className="inline-block w-3 h-6 bg-blue-500 animate-pulse ml-1" />
                      )}
                    </div>
                  </div>
                ) : isExplaining ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-blue-700 dark:text-blue-300 font-medium">
                      Reading your blog post...
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Breaking it down into simple terms
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Brain className="h-12 w-12 text-blue-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ready to Simplify!
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                      I'll read through "{title}" and explain it like you're 5
                      years old
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleExplain}
                  disabled={isExplaining}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {isExplaining ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Explaining...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {explanation ? "Explain Again" : "Start Explaining"}
                    </>
                  )}
                </Button>
                <Button onClick={closeModal} variant="outline" className="px-6">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
