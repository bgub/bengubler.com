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
    <div class="interior-wireframe contact-wireframe">
      <header class="page-header">
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

      <section class="contact-methods">
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
              class={`contact-method group ${method.href ? "contact-method-link" : ""}`}
            >
              <div class="contact-method-name">{method.name}</div>
              <div>
                <div class="contact-method-value" dir="ltr">
                  {method.value}
                  {method.href && (
                    <span class="contact-method-arrow" aria-hidden="true">
                      &#x25B8;
                    </span>
                  )}
                </div>
                <div class="contact-method-description">
                  {method.description}
                </div>
              </div>
            </Component>
          );
        })}
      </section>
    </div>
  );
}
