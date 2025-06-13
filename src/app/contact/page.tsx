import { getColorByIndex } from "@/lib/colors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Ben Gubler",
  description:
    "Get in touch with me for collaborations, questions, or just to say hello.",
};

export default function ContactPage() {
  const contactMethods = [
    {
      name: "Email",
      value: "hello [at] bengubler [dot] com",
      href: null,
      description: "Best for business inquiries and longer conversations",
    },
    {
      name: "X (Twitter)",
      value: "@nebrelbug",
      href: "https://x.com/nebrelbug",
      description: "Follow me for quick updates and tech discussions",
    },
    {
      name: "LinkedIn",
      value: "Ben Gubler",
      href: "https://linkedin.com/in/bengubler",
      description: "Professional network and career-related discussions",
    },
    {
      name: "GitHub",
      value: "nebrelbug",
      href: "https://github.com/nebrelbug",
      description: "Check out my open source projects and contributions",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Contact
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          I'm always interested in connecting with fellow developers, discussing
          new ideas, or exploring potential collaborations. Feel free to reach
          out!
        </p>
      </header>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactMethods.map((method, index) => {
          const colors = getColorByIndex(index);
          const Component = method.href ? "a" : "div";
          const linkProps = method.href
            ? {
                href: method.href,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {};

          return (
            <Component
              key={method.name}
              {...linkProps}
              className={`${colors.bg} ${
                colors.border
              } border rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${
                method.href ? "hover:scale-[1.02] cursor-pointer" : ""
              } group block`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                    {method.name}
                  </h3>
                  {method.href && (
                    <svg
                      className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-mono text-foreground">
                  {method.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </Component>
          );
        })}
      </div>
    </div>
  );
}
