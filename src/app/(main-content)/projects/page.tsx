import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { projectList } from "./project-list";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl lg:text-5xl font-bold py-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectList.map((project) => (
          <Project key={project.title} project={project} />
        ))}
      </div>
    </>
  );
}

function Project({ project }: { project: (typeof projectList)[number] }) {
  return (
    <Link href={project.href} target="_blank">
      <Card className="hover:shadow-lg h-full">
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription className="truncate">{project.href}</CardDescription>
        </CardHeader>
        <CardContent className="grow">
          <p>{project.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
