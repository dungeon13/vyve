"use client";

import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/quiz";

interface Props {
  question: QuizQuestion;
  value?: string;
  onSelect: (value: string) => void;
}

export function QuestionChips({ question, value, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {question.options?.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "px-5 py-3 rounded-xl text-base font-medium transition-all duration-200",
            "border-2 cursor-pointer",
            "hover:scale-105 active:scale-95",
            value === opt.value
              ? "bg-vyve-indigo text-white border-vyve-indigo shadow-lg shadow-vyve-indigo/20"
              : "bg-white text-gray-700 border-gray-200 hover:border-vyve-indigo/40 hover:bg-gray-50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
