import { cn } from "@/lib/utils";

export function Date({ date, className }: { date: Date; className?: string }) {
  const dateString = date.toDateString();

  return (
    <p className={cn(className)}>
      Published <time dateTime={dateString}>{dateString}</time>
    </p>
  );
}
