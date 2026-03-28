"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PillarKind } from "@/components/ui/pillar-card";

const pillarClass: Record<PillarKind, string> = {
  financial: "border-[rgba(99,102,241,0.4)] text-[#818cf8] hover:bg-[rgba(99,102,241,0.1)]",
  career: "border-[rgba(240,165,0,0.4)] text-[var(--gold)] hover:bg-[rgba(240,165,0,0.1)]",
  health: "border-[rgba(0,212,170,0.4)] text-[var(--teal)] hover:bg-[rgba(0,212,170,0.1)]",
};

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  pillar: PillarKind;
  children: ReactNode;
};

/** Ghost CTA with pillar-coloured border (prompt: PillarCTA). */
export function PillarCTA({ pillar, children, className, type = "button", ...rest }: Props) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "min-h-[44px] w-full rounded-[14px] border-[1.5px] bg-transparent px-4 py-3 font-display text-[15px] font-semibold transition-colors",
        pillarClass[pillar],
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
