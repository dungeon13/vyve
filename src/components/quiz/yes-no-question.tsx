"use client";

import { motion } from "framer-motion";

interface Props {
  yesLabel?: string;
  noLabel?: string;
  onSelect: (value: "yes" | "no") => void;
}

/**
 * Large Yes / No tap targets (prompt: YesNoQuestion).
 * Wire from quiz config when a question is strictly binary; otherwise chips are used.
 */
export function YesNoQuestion({
  yesLabel = "Yes",
  noLabel = "No",
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect("yes")}
        aria-label={yesLabel}
        className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-[22px] border-2 border-[var(--border)] bg-[var(--glass)] px-4 py-6 text-center transition-colors hover:border-[var(--teal)]"
      >
        <span className="text-4xl" aria-hidden>
          👍
        </span>
        <span className="font-display text-[18px] font-semibold text-[var(--text)]">{yesLabel}</span>
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect("no")}
        aria-label={noLabel}
        className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-[22px] border-2 border-[var(--border)] bg-[var(--glass)] px-4 py-6 text-center transition-colors hover:border-[var(--coral)]"
      >
        <span className="text-4xl" aria-hidden>
          👎
        </span>
        <span className="font-display text-[18px] font-semibold text-[var(--text)]">{noLabel}</span>
      </motion.button>
    </div>
  );
}
