import { CardGrid, ProjectCard } from "@/components/CardGrid";
import { projects } from "./project-list";

export default function Home() {
  return (
    <>
      <h1 className="mt-8">Projects</h1>
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
