import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono-label text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text3)]",
        className
      )}
    >
      {children}
    </p>
  );
}
