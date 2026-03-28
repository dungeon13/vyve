import { cn } from "@/lib/utils";

type Status = "critical" | "needs_work" | "good";

const styles: Record<
  Status,
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-[rgba(255,107,107,0.12)] text-[#ff6b6b]",
  },
  needs_work: {
    label: "Needs work",
    className: "bg-[rgba(240,165,0,0.12)] text-[#f0a500]",
  },
  good: {
    label: "Good",
    className: "bg-[rgba(0,212,170,0.12)] text-[#00d4aa]",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex rounded-lg px-2 py-0.5 font-mono-label text-[10px] font-semibold uppercase tracking-wide",
        s.className
      )}
    >
      {s.label}
    </span>
  );
}
