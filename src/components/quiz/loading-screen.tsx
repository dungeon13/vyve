"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Crunching your numbers…",
  "Comparing with 14,000+ peers…",
  "Building your action plan…",
];

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => {
        if (prev >= MESSAGES.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-[var(--pad-x)]">
      <motion.div
        className="h-20 w-20 rounded-full border-4 border-[var(--teal)]/25 border-t-[var(--teal)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />

      <motion.p
        key={msgIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center font-display text-[17px] font-semibold text-[var(--text)]"
      >
        {MESSAGES[msgIdx]}
      </motion.p>
    </div>
  );
}
