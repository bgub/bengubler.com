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
              class="project-list-row block hover:bg-rule-soft/30 transition-colors text-inherit no-underline"
            >
              <div class="project-row">
                <div class="project-name font-serif text-lg font-medium text-foreground leading-tight">
                  {m(project.name)}
                </div>
                <div class="project-description font-serif text-sm leading-relaxed text-ink-soft font-light">
                  <span class="project-description-mark" aria-hidden="true">
                    —
                  </span>
                  <span class="project-description-text">
                    {m(project.description)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
