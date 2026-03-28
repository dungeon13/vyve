"use client";

import { PrimaryButton } from "@/components/ui/primary-button";

interface Props {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <div
      className="mx-auto flex min-h-[50vh] max-w-[480px] flex-col justify-center px-[var(--pad-x)] py-10"
      role="alert"
    >
      <h1 className="font-display text-[22px] font-semibold text-[var(--text)]">{title}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--text2)]">{description}</p>
      <PrimaryButton className="mt-8" onClick={onAction} aria-label={actionLabel}>
        {actionLabel}
      </PrimaryButton>
      {secondaryLabel && onSecondary && (
        <button
          type="button"
          onClick={onSecondary}
          className="mt-4 min-h-[44px] w-full rounded-[16px] py-3 font-display text-[15px] font-semibold text-[var(--text2)] transition-colors hover:text-[var(--text)]"
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  );
}
