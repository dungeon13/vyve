"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/quiz";

interface Props {
  question: QuizQuestion;
  value?: string;
  onSelect: (value: string) => void;
}

export function QuestionDropdown({ question, value, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const dd = question.dropdown!;

  const pinnedSet = new Set(dd.pinned ?? []);
  const pinned = dd.options.filter((o) => pinnedSet.has(o.value));
  const rest = dd.options.filter((o) => !pinnedSet.has(o.value));

  const filtered = search
    ? [...pinned, ...rest].filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <input
        type="text"
        placeholder="Search city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base
          focus:border-vyve-indigo focus:outline-none transition-colors"
      />

      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
        {!filtered && pinned.length > 0 && (
          <>
            <p className="text-xs text-gray-400 uppercase tracking-wide px-1">
              Popular cities
            </p>
            {pinned.map((opt) => (
              <CityButton
                key={opt.value}
                label={opt.label}
                selected={value === opt.value}
                onClick={() => onSelect(opt.value)}
              />
            ))}
            <div className="border-t border-gray-100 my-2" />
          </>
        )}

        {(filtered ?? rest).map((opt) => (
          <CityButton
            key={opt.value}
            label={opt.label}
            selected={value === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

function CityButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all",
        "border-2 cursor-pointer",
        selected
          ? "bg-vyve-indigo text-white border-vyve-indigo"
          : "bg-white text-gray-700 border-gray-100 hover:border-vyve-indigo/30 hover:bg-gray-50"
      )}
    >
      {label}
    </button>
  );
}
