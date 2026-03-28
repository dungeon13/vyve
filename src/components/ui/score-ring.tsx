"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export function ScoreRing({
  score,
  size = 220,
  strokeWidth = 12,
  label,
  color = "var(--teal)",
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));

  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);
  const strokeDashoffset = useTransform(
    motionValue,
    [0, 100],
    [circumference, 0]
  );

  useEffect(() => {
    const controls = animate(0, clamped, {
      duration: 1.8,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.3,
      onUpdate: (v) => {
        setDisplay(Math.round(v));
        motionValue.set(v);
      },
    });
    return () => controls.stop();
  }, [clamped, motionValue]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="meter"
      aria-label={label ? `${label}: ${display} out of 100` : `Score ${display} out of 100`}
      aria-valuenow={display}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border2)"
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
        <span
          className="font-display text-[clamp(48px,18vw,72px)] font-bold leading-none tracking-[-0.03em]"
          style={{ color }}
        >
          {display}
        </span>
        {label && (
          <span className="mt-2 font-mono-label text-[11px] uppercase tracking-wider text-[var(--text3)]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
