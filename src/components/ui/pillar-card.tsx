"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./progress-bar";

export type PillarKind = "financial" | "career" | "health";

const pillarClass: Record<PillarKind, string> = {
  financial: "pillar-finance",
  career: "pillar-career",
  health: "pillar-health",
};

const barColor: Record<PillarKind, string> = {
  financial: "#818cf8",
  career: "var(--gold)",
  health: "var(--teal)",
};

const labels: Record<PillarKind, string> = {
  financial: "Financial",
  career: "Career",
  health: "Health",
};

export function PillarCard({
  pillar,
  score,
  onClick,
  delay = 0,
}: {
  pillar: PillarKind;
  score: number;
  onClick?: () => void;
  delay?: number;
}) {
  const content = (
    <>
      <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text3)]">
        {labels[pillar]}
      </p>
      <p className="font-display text-3xl font-bold tracking-tight text-[var(--text)]">
        {Math.round(score)}
      </p>
      <ProgressBar value={score} color={barColor[pillar]} delay={delay} />
    </>
  );

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "w-full rounded-[22px] p-5 text-left transition-colors",
          pillarClass[pillar]
        )}
        aria-label={`Open ${labels[pillar]} details`}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <div className={cn("rounded-[22px] p-5", pillarClass[pillar])}>{content}</div>
  );
}
