export function PageTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.02]">
        {children}
      </h1>
      {subtitle && (
        <p className="font-serif text-lg text-ink-soft leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </>
  );
}
