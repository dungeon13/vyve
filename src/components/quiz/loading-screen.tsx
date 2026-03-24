"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Crunching your numbers...",
  "Comparing with 14,000+ peers...",
  "Building your action plan...",
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
    <div className="min-h-screen bg-vyve-indigo flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-20 h-20 border-4 border-vyve-amber/30 border-t-vyve-amber rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      <motion.p
        key={msgIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-lg font-medium mt-8 text-center"
      >
        {MESSAGES[msgIdx]}
      </motion.p>
    </div>
  );
}
