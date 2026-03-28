"use client";

import type { QuizQuestion } from "@/types/quiz";
import { ChipOption } from "./chip-option";

interface Props {
  question: QuizQuestion;
  value?: string;
  onSelect: (value: string) => void;
}

export function QuestionChips({ question, value, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {question.options?.map((opt) => (
        <ChipOption
          key={opt.value}
          label={opt.label}
          selected={value === opt.value}
          onSelect={() => onSelect(opt.value)}
        />
      ))}
    </div>
  );
}
