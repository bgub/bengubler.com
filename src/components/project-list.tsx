import { useMessages } from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import type { Project } from "@/lib/projects";

export function ProjectList({ projects }: { projects: Project[] }) {
  const m = useMessages();

  return (
    <ul>
      {projects.map((project) => {
        const href = project.links.github ?? project.links.demo;

        return (
          <li key={project.name}>
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              class="block py-2.5 border-b border-dotted border-border hover:bg-rule-soft/30 transition-colors -mx-2 px-2 rounded-sm text-inherit no-underline"
            >
              <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <div class="font-serif text-lg font-medium text-foreground leading-tight">
                  {m(project.name)}
                </div>
                <div class="font-serif text-sm leading-relaxed text-ink-soft font-light">
                  — {m(project.description)}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
