"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  className?: string;
  delay?: number;
  color?: string;
}

export function ProgressBar({
  value,
  className,
  delay = 0,
  color = "var(--teal)",
}: Props) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-[var(--glass2)]", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full origin-left rounded-full will-change-transform"
        style={{ backgroundColor: color, transformOrigin: "left center" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: pct / 100 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay }}
      />
    </div>
  );
}
