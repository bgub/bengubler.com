import { createFileRoute } from "@tanstack/solid-router";
import { getGT, T, useGT } from "gt-fig-tanstack-start";
import { PageTitle } from "@/components/page-title";
import { getPageMetadata } from "@/lib/metadata";

export const Route = createFileRoute("/{-$locale}/contact")({
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("Contact - Ben Gubler"),
        description: gt(
          "Get in touch with me for collaborations, questions, or just to say hello.",
        ),
      }),
    };
  },
  component: ContactPage,
});

function ContactPage() {
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
    <div class="space-y-10">
      <header class="space-y-3">
        <T>
          <PageTitle
            subtitle={gt(
              "I'm always interested in connecting with fellow developers, discussing new ideas, or exploring potential collaborations. Feel free to reach out!",
            )}
          >
            Contact
          </PageTitle>
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
              class={`grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-x-4 gap-y-1 py-4 border-b border-dotted border-border group ${
                method.href
                  ? "hover:bg-rule-soft/30 -mx-2 px-2 rounded-sm cursor-pointer"
                  : ""
              } block no-underline`}
            >
              <div class="font-serif text-base font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                {method.name}
              </div>
              <div>
                <div class="font-mono text-sm text-foreground">
                  {method.value}
                  {method.href && (
                    <span class="text-ink-faint ml-1">&#x25B8;</span>
                  )}
                </div>
                <div class="font-serif text-sm text-ink-soft font-light mt-0.5">
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
