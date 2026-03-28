"use client";

import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import type { Action } from "@/data/actions-library";

interface Props {
  action: Action;
  variant: "risk" | "win" | "action";
  onActivate: (action: Action) => void;
}

/** Pillar action row: risk / win / one-move (prompt: ActionCard). */
export function ActionCard({ action, variant, onActivate }: Props) {
  const variantStyles = {
    risk: {
      icon: <AlertTriangle className="h-4 w-4 text-[var(--coral)]" aria-hidden />,
      border: "border-l-[var(--coral)]",
    },
    win: {
      icon: <CheckCircle className="h-4 w-4 text-[var(--green)]" aria-hidden />,
      border: "border-l-[var(--green)]",
    },
    action: {
      icon: <ArrowRight className="h-4 w-4 text-[var(--gold)]" aria-hidden />,
      border: "border-l-[var(--gold)]",
    },
  };

  const style = variantStyles[variant];

  return (
    <button
      type="button"
      onClick={() => onActivate(action)}
      className={`min-h-[48px] w-full rounded-xl border border-[var(--border)] border-l-4 ${style.border} bg-[var(--glass)] p-3 text-left transition-colors hover:bg-[var(--glass2)]`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5">{style.icon}</span>
        <div>
          <p className="text-[14px] font-semibold text-[var(--text)]">{action.title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--text2)]">{action.description}</p>
          {action.cta && (
            <span className="mt-2 inline-block font-mono-label text-[11px] font-semibold text-[var(--teal)]">
              {action.cta} →
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
