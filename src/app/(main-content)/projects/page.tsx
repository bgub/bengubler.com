import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import Link from "next/link";
import { projects } from "./project-list";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl lg:text-5xl font-bold py-8">Projects</h1>
      {projects.map((group) => (
        <div key={group.category}>
          <h2 className="text-2xl font-bold">{group.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-8">
            {group.items.map((project) => (
              <Project key={project.title} project={project} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function Project({
  project,
}: {
  project: (typeof projects)[number]["items"][number];
}) {
  return (
    <Link href={project.href} target="_blank">
      <Card className="hover:shadow-lg h-full border-2 border-black">
        <CardHeader className="p-0 border-b border-black bg-black rounded-t-lg">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={"/project-images/" + project.image || ""}
              alt={project.title}
              fill
              className="object-cover rounded-t-xl rounded-b-none"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2 rounded-sm text-sm opacity-70 bg-black text-white truncate">
              {project.href}
            </div>
          </AspectRatio>
        </CardHeader>
        <CardContent className="grow p-4">
          <CardTitle className="mb-4">{project.title}</CardTitle>
          <p className="text-sm">{project.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
