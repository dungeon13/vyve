"use client";

import { motion } from "framer-motion";
import { useQuiz } from "@/components/quiz/quiz-context";
import { ScoreRequiredGate } from "@/components/gates/score-required-gate";
import { BriefPageSkeleton } from "@/components/shells/page-skeletons";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionLabel } from "@/components/ui/section-label";

export default function BriefPage() {
  return (
    <ScoreRequiredGate skeleton={<BriefPageSkeleton />}>
      <BriefInner />
    </ScoreRequiredGate>
  );
}

function BriefInner() {
  const { scoreResult } = useQuiz();

  if (!scoreResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-[480px] px-[var(--pad-x)] pb-12 pt-10"
    >
      <SectionLabel>Monday brief</SectionLabel>
      <motion.h1
        initial={{ opacity: 0, skewX: -2 }}
        animate={{ opacity: 1, skewX: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
        className="mt-3 font-display text-[clamp(26px,7vw,34px)] font-semibold italic leading-tight tracking-[-0.02em] text-[var(--text)]"
      >
        Your weekly LifeScore brief
      </motion.h1>
      <p className="mt-3 font-mono-label text-[11px] text-[var(--text3)]">Snapshot · next personalised brief when you return</p>

      <GlassCard className="mt-8 p-5">
        <p className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text3)]">Score</p>
        <p className="mt-2 font-display text-[40px] font-bold leading-none text-[var(--text)]">
          {scoreResult.composite_score}
        </p>
        <p className="mt-2 text-[14px] text-[var(--text2)]">
          Finance {scoreResult.financial_score} · Career {scoreResult.career_score} · Health{" "}
          {scoreResult.health_score}
        </p>
        <p className="mt-4 text-[13px] leading-relaxed text-[var(--text2)]">
          Baseline locked. As you complete moves, we&apos;ll show what moved — and what still costs you
          most.
        </p>
      </GlassCard>

      <div className="mt-6 space-y-4">
        <div className="pillar-finance rounded-[var(--radius-card)] border border-[rgba(99,102,241,0.35)] p-5">
          <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--violet)]">
            Financial move
          </p>
          <p className="mt-2 font-display text-[17px] font-semibold text-[var(--text)]">
            Revisit savings rate vs EMI — one lever this week.
          </p>
        </div>
        <div className="pillar-career rounded-[var(--radius-card)] border border-[rgba(240,165,0,0.35)] p-5">
          <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Career move
          </p>
          <p className="mt-2 font-display text-[17px] font-semibold text-[var(--text)]">
            Salary vs cohort: negotiate or upskill — pick one.
          </p>
        </div>
      </div>

      <GlassCard className="mt-6 p-4">
        <p className="font-mono-label text-[10px] text-[var(--green)]">Completed · placeholder</p>
        <p className="mt-1 text-[14px] text-[var(--text)]">Finish your first Elevate action to unlock +pts here.</p>
      </GlassCard>
    </motion.div>
  );
}
