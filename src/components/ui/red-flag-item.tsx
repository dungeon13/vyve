"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function RedFlagItem({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ x: 4 }}
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--glass)] px-4 py-3 text-left text-sm text-[var(--text2)]"
    >
      <span
        className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--coral)]"
        aria-hidden
      />
      <span className="text-[var(--text)]">{children}</span>
    </motion.button>
  );
}
