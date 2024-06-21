export function AspectRatio({
  ratio = 1 / 1,
  children,
}: {
  ratio: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full" style={{ paddingTop: `${100 / ratio}%` }}>
      <div className="absolute top-0 left-0 w-full h-full">{children}</div>
    </div>
  );
}
