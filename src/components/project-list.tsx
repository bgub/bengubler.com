import { useGT, useMessages } from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import { getStripeColorByIndex } from "@/lib/colors";
import type { Project } from "@/lib/projects";

interface ProjectListProps {
  projects: Project[];
  compact?: boolean;
}

export function ProjectList({ projects, compact = false }: ProjectListProps) {
  const m = useMessages();
  const gt = useGT();
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project, i) => {
        const stripeColor = getStripeColorByIndex(i);
        return (
          <div
            key={project.name}
            class="bg-card border border-border rounded-sm relative overflow-hidden transition-all duration-200 hover:shadow-md group"
          >
            <div class={`absolute top-0 left-0 right-0 h-1.5 ${stripeColor}`} />
            <div class="p-4 pt-5">
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <div class="font-serif text-xl font-medium text-foreground">
                  {project.links.demo ? (
                    <Link
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="hover:underline no-underline group-hover:text-foreground/80 transition-colors"
                    >
                      {m(project.name)}
                    </Link>
                  ) : (
                    m(project.name)
                  )}
                </div>
                {project.links.github && (
                  <Link
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1"
                    aria-label={gt("{name} on GitHub", {
                      name: m(project.name),
                    })}
                  >
                    <span
                      class="icon-[simple-icons--github] size-4"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
              <div class="font-serif text-[14.5px] leading-relaxed text-ink-soft font-light">
                {m(project.description)}
              </div>
              {!compact && (
                <div class="font-mono text-[11px] text-muted-foreground tracking-wide mt-2.5">
                  {project.tech}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
