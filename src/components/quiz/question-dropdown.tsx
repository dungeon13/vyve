"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    ? [...pinned, ...rest].filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <input
        type="text"
        placeholder="Search city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--bg3)] px-4 py-3 text-base text-[var(--text)] transition-colors placeholder:text-[var(--text3)] focus:border-[var(--teal)] focus:outline-none"
      />

      <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg2)]/90 p-2">
        {!filtered && pinned.length > 0 && (
          <>
            <p className="px-1 font-mono-label text-[10px] uppercase tracking-wider text-[var(--text3)]">
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
            <div className="my-2 border-t border-[var(--border)]" />
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
    <motion.button
      type="button"
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "min-h-[48px] w-full rounded-xl border-2 px-4 py-3 text-left text-base font-semibold transition-colors",
        "cursor-pointer",
        selected
          ? "border-[var(--teal)] bg-[var(--teal-dim)] text-[var(--text)]"
          : "border-transparent bg-transparent text-[var(--text2)] hover:bg-[var(--glass)]"
      )}
    >
      {label}
    </motion.button>
  );
}
