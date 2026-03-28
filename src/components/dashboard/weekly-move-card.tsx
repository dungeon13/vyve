"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  description?: string;
}

export function WeeklyMoveCard({ title, description }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="pillar-career relative overflow-hidden rounded-[var(--radius-card)] border border-[rgba(240,165,0,0.35)] p-5"
    >
      <div className="flex items-center gap-2 font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        <Sparkles className="h-4 w-4" aria-hidden />
        This week&apos;s move
      </div>
      <p className="mt-3 font-display text-[20px] font-semibold leading-snug text-[var(--text)]">{title}</p>
      {description && <p className="mt-2 text-[14px] leading-relaxed text-[var(--text2)]">{description}</p>}
    </motion.div>
  );
}
