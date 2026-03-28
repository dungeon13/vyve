"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface Props {
  score: number;
  percentileLabel: string;
  deltaNote?: string;
}

export function HeroScoreCard({ score, percentileLabel, deltaNote = "Baseline snapshot" }: Props) {
  const rounded = Math.min(100, Math.max(0, Math.round(score)));

  return (
    <div className="elevated-card relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--teal-glow)] blur-2xl" aria-hidden />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text3)]">
            LifeScore
          </p>
          <p
            className="font-display text-[clamp(48px,16vw,72px)] font-bold leading-none tracking-[-0.03em] text-[var(--text)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {rounded}
          </p>
          <p className="mt-1 font-mono-label text-[11px] text-[var(--text2)]">{percentileLabel}</p>
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--glass)] px-3 py-1.5 font-mono-label text-[11px] font-semibold text-[var(--green)]"
        >
          <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          {deltaNote}
        </motion.div>
      </div>
    </div>
  );
}
