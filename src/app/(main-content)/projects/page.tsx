import { CardGrid, ProjectCard } from "@/components/CardGrid";
import { projects } from "./project-list";

export const metadata = {
  title: "Projects",
  description: "Some of the projects I've built.",
};

export default function Home() {
  return (
    <>
      <h1 className="mt-8">{metadata.title}</h1>
      {projects.map((group) => (
        <div key={group.category}>
          <h2>{group.category}</h2>
          <CardGrid>
            {group.items.map((project) => (
              <ProjectCard
                key={project.title}
                project={{
                  ...project,
                  image: "/project-images/" + project.image,
                }}
              />
            ))}
          </CardGrid>
        </div>
      ))}
    </>
  );
}
