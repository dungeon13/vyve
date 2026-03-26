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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {question.options?.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "px-5 py-3.5 rounded-2xl text-base font-medium transition-all duration-200 text-left min-h-12",
            "border-2 cursor-pointer",
            "active:scale-[0.99]",
            value === opt.value
              ? "bg-gradient-to-r from-vyve-indigo to-vyve-indigo-light text-white border-vyve-indigo shadow-lg shadow-vyve-indigo/20"
              : "bg-white/80 backdrop-blur text-gray-700 border-gray-200 hover:border-vyve-indigo/40 hover:bg-white"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
