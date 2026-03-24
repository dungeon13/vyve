"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export function ScoreRing({ score, size = 200, strokeWidth = 12, label, color = "#1e1b4b" }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const motionValue = useMotionValue(0);
  const strokeDashoffset = useTransform(
    motionValue,
    [0, 100],
    [circumference, 0]
  );
  const displayScore = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, score, {
      duration: 1.5,
      ease: [0.34, 1.56, 0.64, 1],
    });
    return () => controls.stop();
  }, [score, motionValue]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-display font-bold" style={{ color }}>
          {displayScore}
        </motion.span>
        {label && <span className="text-sm text-gray-400 mt-1">{label}</span>}
      </div>
    </div>
  );
}
