"use client";

interface Props {
  score: number;
  label?: string;
}

/** Match quality 0–100 on the right of an ActiveMatch card (prompt: MatchScoreBadge). */
export function MatchScoreBadge({ score, label = "Match" }: Props) {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  return (
    <div className="flex flex-col items-end justify-between gap-1">
      <span className="font-mono-label text-[10px] text-[var(--text3)]">{label}</span>
      <span className="font-display text-[22px] font-bold tabular-nums text-[var(--teal)]">{clamped}</span>
    </div>
  );
}
