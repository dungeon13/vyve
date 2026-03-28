"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { QuizQuestion } from "@/types/quiz";
import { PrimaryButton } from "@/components/ui/primary-button";

interface Props {
  question: QuizQuestion;
  value?: number;
  onSelect: (value: number) => void;
}

/** Slider with large value readout + Continue (prompt: SliderQuestion). */
export function SliderQuestion({ question, value, onSelect }: Props) {
  const slider = question.slider!;
  const [localValue, setLocalValue] = useState(value ?? slider.default);

  useEffect(() => {
    setLocalValue(value ?? slider.default);
  }, [question.id, value, slider.default, slider.min, slider.max]);

  const percentage = ((localValue - slider.min) / (slider.max - slider.min)) * 100;

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <motion.div
        key={localValue}
        initial={{ scale: 0.96, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg3)]/80 p-6 text-center"
      >
        <span className="font-display text-[clamp(40px,14vw,56px)] font-bold tracking-[-0.03em] text-[var(--teal)]">
          {localValue}
        </span>
        {slider.unit && (
          <span className="ml-2 font-display text-2xl font-semibold text-[var(--text3)]">{slider.unit}</span>
        )}
      </motion.div>

      <div className="relative px-2">
        <input
          type="range"
          min={slider.min}
          max={slider.max}
          step={slider.step}
          value={localValue}
          onChange={(e) => setLocalValue(Number(e.target.value))}
          aria-valuemin={slider.min}
          aria-valuemax={slider.max}
          aria-valuenow={localValue}
          className="h-3 w-full cursor-pointer appearance-none rounded-full
            [&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--bg)]
            [&::-webkit-slider-thumb]:bg-[var(--teal)] [&::-webkit-slider-thumb]:shadow-[0_0_16px_var(--teal-glow)]
            [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:cursor-grabbing"
          style={{
            background: `linear-gradient(to right, var(--teal) ${percentage}%, var(--bg3) ${percentage}%)`,
          }}
        />
        <div className="mt-2 flex justify-between font-mono-label text-[12px] text-[var(--text3)]">
          <span>
            {slider.min}
            {slider.unit ? ` ${slider.unit}` : ""}
          </span>
          <span>
            {slider.max}
            {slider.unit ? ` ${slider.unit}` : ""}
          </span>
        </div>
      </div>

      <PrimaryButton type="button" onClick={() => onSelect(localValue)} aria-label="Continue with this value">
        Continue
      </PrimaryButton>
    </div>
  );
}
