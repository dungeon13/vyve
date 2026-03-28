"use client";

import { motion } from "framer-motion";

interface Props {
  label: string;
  score: number;
  percentile: number;
  color: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

export function PercentileBar({ label, score, percentile, color, icon, onPress }: Props) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-[var(--text)]">{icon}</span>
          <span className="truncate font-display text-[17px] font-semibold text-[var(--text)]">{label}</span>
        </div>
        <div className="shrink-0 text-right">
          <span className="font-display text-2xl font-bold tabular-nums" style={{ color }}>
            {score}
          </span>
          <span className="ml-1 font-mono-label text-[11px] text-[var(--text3)]">/ 100</span>
        </div>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg3)]">
        <motion.div
          className="h-full w-full origin-left rounded-full"
          style={{ backgroundColor: color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.min(100, Math.max(0, score)) / 100 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
        />
      </div>

      <p className="font-mono-label text-[11px] text-[var(--text2)]">
        Better than{" "}
        <span className="font-semibold tabular-nums" style={{ color }}>
          {percentile}%
        </span>{" "}
        of peers in this cohort
      </p>
    </>
  );

  if (onPress) {
    return (
      <motion.button
        type="button"
        onClick={onPress}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="glass-card w-full space-y-2 rounded-[20px] p-4 text-left"
        aria-label={`Open ${label} drilldown, score ${score}`}
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card space-y-2 rounded-[20px] p-4"
    >
      {inner}
    </motion.div>
  );
}
