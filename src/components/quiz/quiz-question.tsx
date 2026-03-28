"use client";

import type { ReactNode } from "react";

interface Props {
  title: string;
  tooltip?: string;
  helperText?: string;
  children: ReactNode;
}

/** Full-screen question chrome: title, optional tooltip, helper (prompt: QuizQuestion). */
export function QuizQuestion({
  title,
  tooltip,
  helperText = "No right or wrong answers. This is your private snapshot.",
  children,
}: Props) {
  return (
    <>
      <h2 className="text-center font-display text-[clamp(22px,6vw,28px)] font-semibold leading-tight tracking-[-0.02em] text-[var(--text)]">
        {title}
      </h2>

      {tooltip && (
        <p className="mt-3 text-center text-[13px] font-medium leading-relaxed text-[var(--gold)]">{tooltip}</p>
      )}
      <p className="mt-2 text-center font-mono-label text-[10px] uppercase tracking-wider text-[var(--text3)]">
        {helperText}
      </p>

      <div className="mx-auto mt-8 w-full max-w-lg">{children}</div>
    </>
  );
}
