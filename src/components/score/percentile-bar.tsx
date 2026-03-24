"use client";

import { motion } from "framer-motion";

interface Props {
  label: string;
  score: number;
  percentile: number;
  color: string;
  icon: React.ReactNode;
}

export function PercentileBar({ label, score, percentile, color, icon }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-gray-800">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold" style={{ color }}>{score}</span>
          <span className="text-sm text-gray-400 ml-1">/ 100</span>
        </div>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      <p className="text-sm text-gray-500">
        Better than <span className="font-semibold" style={{ color }}>{percentile}%</span> of your peers
      </p>
    </div>
  );
}
