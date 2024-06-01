import { Nav } from "@/components/Nav";

export default function MainContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row lg:container min-h-screen">
      <Nav />
      <div className="flex flex-col p-4">{children}</div>
    </div>
  );
}
