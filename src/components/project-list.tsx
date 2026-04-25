import { useMessages, useGT } from "gt-next";
import Link from "next/link";
import { GitHubIcon } from "@/components/social";
import { getColorByIndex } from "@/lib/colors";
import type { Project } from "@/lib/projects";

interface ProjectListProps {
  projects: Project[];
  compact?: boolean;
}

export function ProjectList({ projects, compact = false }: ProjectListProps) {
  const m = useMessages();
  const gt = useGT();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project, i) => {
        const colors = getColorByIndex(i);
        return (
          <div
            key={project.name}
            className="bg-card border border-border rounded-sm relative overflow-hidden transition-all duration-200 hover:shadow-md group"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${colors.stripe}`}
            />
            <div className="p-4 pt-5">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="font-serif text-xl font-medium text-foreground">
                  {project.links.demo ? (
                    <Link
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline no-underline group-hover:text-foreground/80 transition-colors"
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
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1"
                    aria-label={gt('{name} on GitHub', { name: m(project.name) })}
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <div className="font-serif text-[14.5px] leading-relaxed text-ink-soft font-light">
                {m(project.description)}
              </div>
              {!compact && (
                <div className="font-mono text-[11px] text-muted-foreground tracking-wide mt-2.5">
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
