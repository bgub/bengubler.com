import { T, useGT } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();
  return {
    title: gt("Contact - Ben Gubler"),
    description: gt(
      "Get in touch with me for collaborations, questions, or just to say hello.",
    ),
  };
}

export default function ContactPage() {
  const gt = useGT();
  const contactMethods = [
    {
      name: gt("Email"),
      value: "hello [at] bengubler [dot] com",
      href: null,
      description: gt("Best for business inquiries and longer conversations"),
    },
    {
      name: gt("X (Twitter)"),
      value: "@bgub_",
      href: "https://x.com/bgub_",
      description: gt("Follow me for quick updates and tech discussions"),
    },
    {
      name: gt("LinkedIn"),
      value: "Ben Gubler",
      href: "https://www.linkedin.com/in/ben-gubler/",
      description: gt("Professional network and career-related discussions"),
    },
    {
      name: gt("GitHub"),
      value: "bgub",
      href: "https://github.com/bgub",
      description: gt("Check out my open source projects and contributions"),
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <T>
          <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.02]">
            Contact.
          </h1>
        </T>
        <T>
          <p className="font-serif text-lg text-ink-soft max-w-lg leading-relaxed font-light">
            I'm always interested in connecting with fellow developers,
            discussing new ideas, or exploring potential collaborations. Feel
            free to reach out!
          </p>
        </T>
      </header>

      <div>
        {contactMethods.map((method) => {
          const Component = method.href ? "a" : "div";
          const linkProps = method.href
            ? {
                href: method.href,
                target: "_blank" as const,
                rel: "noopener noreferrer",
              }
            : {};

          return (
            <Component
              key={method.name}
              {...linkProps}
              className={`grid grid-cols-[1fr] sm:grid-cols-[120px_1fr] gap-x-4 gap-y-1 py-4 border-b border-dotted border-border group ${
                method.href ? "hover:bg-rule-soft/30 -mx-2 px-2 rounded-sm cursor-pointer" : ""
              } block no-underline`}
            >
              <div className="font-serif text-base font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                {method.name}
              </div>
              <div>
                <div className="font-mono text-sm text-foreground">
                  {method.value}
                  {method.href && (
                    <span className="text-ink-faint ml-1">&rsaquo;</span>
                  )}
                </div>
                <div className="font-serif text-sm text-ink-soft font-light mt-0.5">
                  {method.description}
                </div>
              </div>
            </Component>
          );
        })}
      </div>
    </div>
  );
}
