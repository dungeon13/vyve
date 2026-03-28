"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { MatchScoreBadge } from "./match-score-badge";

export interface MatchCardData {
  name: string;
  distance: string;
  financialFit: string;
  healthTag: string;
  score: number;
}

interface Props {
  data: MatchCardData;
  highlighted?: boolean;
}

/** ActiveMatch venue row (prompt: MatchCard). */
export function MatchCard({ data, highlighted = false }: Props) {
  return (
    <motion.div
      whileHover={{ x: 4, borderColor: "rgba(0,212,170,0.4)" }}
      transition={{ duration: 0.2 }}
      className={`glass-card flex gap-3 rounded-[20px] p-4 ${
        highlighted ? "border-[var(--teal)] ring-1 ring-[var(--teal)]" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-display text-[16px] font-semibold leading-snug text-[var(--text)]">{data.name}</p>
        <p className="mt-1 flex items-center gap-1 font-mono-label text-[10px] text-[var(--text3)]">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
          {data.distance}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--glass2)] px-2 py-0.5 font-mono-label text-[10px] text-[var(--text)]">
            {data.financialFit}
          </span>
          <span className="rounded-full bg-[var(--teal-dim)] px-2 py-0.5 font-mono-label text-[10px] text-[var(--teal)]">
            {data.healthTag}
          </span>
        </div>
      </div>
      <MatchScoreBadge score={data.score} />
    </motion.div>
  );
}
