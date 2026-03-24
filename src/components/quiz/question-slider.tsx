"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types/quiz";

interface Props {
  question: QuizQuestion;
  value?: number;
  onSelect: (value: number) => void;
}

export function QuestionSlider({ question, value, onSelect }: Props) {
  const slider = question.slider!;
  const [localValue, setLocalValue] = useState(value ?? slider.default);

  const percentage =
    ((localValue - slider.min) / (slider.max - slider.min)) * 100;

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <span className="text-5xl font-display font-bold text-vyve-indigo">
          {localValue}
        </span>
        {slider.unit && (
          <span className="text-xl text-gray-400 ml-2">{slider.unit}</span>
        )}
      </div>

      <div className="relative px-2">
        <input
          type="range"
          min={slider.min}
          max={slider.max}
          step={slider.step}
          value={localValue}
          onChange={(e) => setLocalValue(Number(e.target.value))}
          onPointerUp={() => onSelect(localValue)}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-7
            [&::-webkit-slider-thumb]:h-7
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-vyve-indigo
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110"
          style={{
            background: `linear-gradient(to right, #1e1b4b ${percentage}%, #e5e7eb ${percentage}%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>{slider.min}{slider.unit ? ` ${slider.unit}` : ""}</span>
          <span>{slider.max}{slider.unit ? ` ${slider.unit}` : ""}</span>
        </div>
      </div>

      <button
        onClick={() => onSelect(localValue)}
        className="w-full py-3 bg-vyve-indigo text-white rounded-xl font-semibold
          hover:bg-vyve-indigo-light transition-colors cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}
