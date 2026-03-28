"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PrimaryButton({
  children,
  className,
  type = "button",
  ...props
}: HTMLMotionProps<"button"> & { children: ReactNode }) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1, boxShadow: "0 8px 32px rgba(0,212,170,0.35)" }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "w-full rounded-[18px] bg-[var(--teal)] px-[18px] py-[18px] text-center font-display text-[17px] font-semibold text-black",
        "disabled:pointer-events-none disabled:opacity-35",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
