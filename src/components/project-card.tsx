import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, LinkIcon as LinkIconLucide } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  links: {
    github?: string;
    demo?: string;
  };
  borderColor?: string;
  image?: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const primaryLink = project.links.demo || project.links.github;
  const displayUrl = primaryLink
    ? primaryLink.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  const borderClass =
    project.borderColor || "border-slate-200 dark:border-slate-800";

  return (
    <div
      className={`group relative flex flex-col rounded-lg bg-card shadow-sm transition-all duration-300 border ${borderClass} hover:shadow-lg overflow-hidden h-full`}
    >
      {/* Main link overlay - sits below the GitHub button but above the content */}
      {primaryLink && (
        <a
          href={primaryLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 rounded-lg"
          aria-label={`Learn more about ${project.title}`}
        >
          <span className="sr-only">{project.title}</span>
        </a>
      )}

      {/* Project Image Header */}
      {project.image && (
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted border-b">
          <Image
            src={`/project-images/${project.image}`}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex-grow">
          <h3 className="mb-2 text-xl font-semibold leading-tight text-foreground">
            {project.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer section that sticks to bottom */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20 min-h-[2rem]">
          {primaryLink && (
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground flex-1 min-w-0 mr-2">
              <LinkIconLucide className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate" title={primaryLink}>
                {displayUrl}
              </span>
            </div>
          )}

          {project.links.github && (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground relative z-20 shrink-0"
            >
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub repository`}
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
