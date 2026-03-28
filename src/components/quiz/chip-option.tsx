"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  selected: boolean;
  onSelect: () => void;
  ariaLabel?: string;
}

export function ChipOption({ label, selected, onSelect, ariaLabel }: Props) {
  return (
    <motion.button
      type="button"
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      aria-label={ariaLabel ?? label}
      aria-pressed={selected}
      className={cn(
        "min-h-[48px] rounded-2xl border-2 px-5 py-3.5 text-left text-base font-semibold transition-colors",
        "cursor-pointer",
        selected
          ? "border-[var(--teal)] bg-[var(--teal-dim)] text-[var(--text)] shadow-[0_0_24px_var(--teal-glow)]"
          : "border-[var(--border)] bg-[var(--glass)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]"
      )}
    >
      {label}
    </motion.button>
  );
}
