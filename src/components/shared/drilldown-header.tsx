import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/section-label";

export function DrilldownHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 border-b border-[var(--border)] pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <SectionLabel>{eyebrow}</SectionLabel>
          <h1 className="font-display text-[clamp(26px,7vw,32px)] font-semibold tracking-[-0.02em] text-[var(--text)]">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-[14px] text-[var(--text2)]">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
